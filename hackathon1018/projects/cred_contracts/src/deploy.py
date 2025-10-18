import argparse, json, os, time
from algosdk import account, mnemonic, encoding
from algosdk.v2client import algod, indexer
from algosdk.future import transaction
from pyteal import compileTeal, Mode
from .app import app

ALGOD = algod.AlgodClient("", "https://testnet-api.algonode.cloud")
INDEX = indexer.IndexerClient("", "https://testnet-idx.algonode.cloud")

ART_PATH = "projects/cred_contracts/artifacts/app_id.json"

def get_sk():
    m = os.environ.get("DEPLOYER_MNEMONIC")
    assert m, "DEPLOYER_MNEMONIC missing"
    return mnemonic.to_private_key(m)

def compile_program(source: str):
    return ALGOD.compile(source)["result"]

def deploy():
    sk = get_sk()
    addr = account.address_from_private_key(sk)
    approval = compile_program(compileTeal(app().approval_program, Mode.Application, 8))
    clear = compile_program(compileTeal(app().clear_program, Mode.Application, 8))
    sp = ALGOD.suggested_params()
    txn = transaction.ApplicationCreateTxn(
        addr, sp,
        on_complete=transaction.OnComplete.NoOpOC.real,
        approval_program=bytes.fromhex(approval),
        clear_program=bytes.fromhex(clear),
        global_schema=transaction.StateSchema(2,0),
        local_schema=transaction.StateSchema(0,0),
        extra_pages=0,
    )
    stx = txn.sign(sk); txid = ALGOD.send_transaction(stx)
    res = transaction.wait_for_confirmation(ALGOD, txid, 4)
    app_id = res["application-index"]
    os.makedirs(os.path.dirname(ART_PATH), exist_ok=True)
    with open(ART_PATH, "w") as f:
        json.dump({"appId": app_id, "network": "testnet"}, f, indent=2)
    print("Deployed appId:", app_id)

def call_issue(cred_id, subject, schema_code, cred_hash_hex, expires_at, cid_pointer=b""):
    with open(ART_PATH) as f: app_id = json.load(f)["appId"]
    sk = get_sk(); addr = account.address_from_private_key(sk)
    assert encoding.is_valid_address(subject)
    sp = ALGOD.suggested_params()
    args = [b"issue", cred_id.encode(), encoding.decode_address(subject), schema_code.to_bytes(1, "big"), bytes.fromhex(cred_hash_hex), expires_at.to_bytes(8, "big"), cid_pointer]
    txn = transaction.ApplicationNoOpTxn(addr, sp, app_id, app_args=args, boxes=[(app_id, cred_id.encode())])
    stx = txn.sign(sk); txid = ALGOD.send_transaction(stx)
    transaction.wait_for_confirmation(ALGOD, txid, 4); print("issued", txid)

def call_revoke(cred_id):
    with open(ART_PATH) as f: app_id = json.load(f)["appId"]
    sk = get_sk(); addr = account.address_from_private_key(sk)
    sp = ALGOD.suggested_params()
    args = [b"revoke", cred_id.encode()]
    txn = transaction.ApplicationNoOpTxn(addr, sp, app_id, app_args=args, boxes=[(app_id, cred_id.encode())])
    stx = txn.sign(sk); txid = ALGOD.send_transaction(stx)
    transaction.wait_for_confirmation(ALGOD, txid, 4); print("revoked", txid)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--deploy", action="store_true")
    p.add_argument("--compile", action="store_true")
    p.add_argument("--issue", nargs=6, metavar=("CRED_ID","SUBJECT","SCHEMA_CODE","HASH_HEX","EXPIRES_UNIX","CID_POINTER"))
    p.add_argument("--revoke", metavar="CRED_ID")
    a = p.parse_args()
    if a.compile:
        compileTeal(app().approval_program, Mode.Application, 8)  # sanity
        print("compiled ok")
    if a.deploy: deploy()
    if a.issue:  call_issue(a.issue[0], a.issue[1], int(a.issue[2]), a.issue[3], int(a.issue[4]), a.issue[5].encode() if a.issue[5] else b"")
    if a.revoke: call_revoke(a.revoke)
