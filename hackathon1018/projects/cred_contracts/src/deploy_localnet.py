import argparse, json, os, time, base64
from algosdk import account, mnemonic, encoding
from algosdk.v2client import algod, indexer
from algosdk import transaction
from pyteal import compileTeal, Mode, Int
from algokit_utils import get_localnet_default_account
from .app import app

# LocalNet configuration
ALGOD = algod.AlgodClient("a" * 64, "http://localhost:4001")
INDEX = indexer.IndexerClient("a" * 64, "http://localhost:8980")

ART_PATH = "projects/cred_contracts/artifacts/app_id_localnet.json"

def get_deployer_account():
    """Get the LocalNet dispenser account"""
    try:
        # Use algokit_utils to get the funded dispenser account
        return get_localnet_default_account(ALGOD)
    except Exception as e:
        print(f"Failed to get LocalNet account: {e}")
        print("Make sure LocalNet is running and accessible")
        raise

def compile_program(source: str):
    return ALGOD.compile(source)["result"]

def deploy():
    print("Deploying smart contract to LocalNet...")
    
    try:
        deployer_account = get_deployer_account()
        sk = deployer_account.private_key
        addr = deployer_account.address
        print(f"Using deployer address: {addr}")
        
        # Check if we have funds
        account_info = ALGOD.account_info(addr)
        print(f"Account balance: {account_info['amount']} microAlgos")
        
        if account_info['amount'] < 1000000:  # Need at least 1 ALGO
            print("Warning: Low balance, but proceeding...")
        
        # Compile the smart contract
        print("Compiling smart contract...")
        approval_teal = compileTeal(app(), Mode.Application, version=8)
        print(f"Approval TEAL: {approval_teal[:100]}...")  # Debug output
        
        # Compile TEAL to bytecode (returns base64, convert to bytes)
        approval_program_b64 = ALGOD.compile(approval_teal)["result"]
        approval_program = base64.b64decode(approval_program_b64)
        print(f"Approval program compiled: {len(approval_program)} bytes")  # Debug output
        
        # Create clear state program (minimal)
        clear_teal = compileTeal(Int(1), Mode.Application, version=8)
        clear_program_b64 = ALGOD.compile(clear_teal)["result"]
        clear_program = base64.b64decode(clear_program_b64)
        
        # Get suggested parameters
        sp = ALGOD.suggested_params()
        print(f"Suggested params: {sp}")
        
        # Create application
        txn = transaction.ApplicationCreateTxn(
            addr, sp,
            on_complete=transaction.OnComplete.NoOpOC.real,
            approval_program=approval_program,
            clear_program=clear_program,
            global_schema=transaction.StateSchema(1, 1),  # 1 integer, 1 byte slice
            local_schema=transaction.StateSchema(0, 0),  # No local state
            extra_pages=0,
        )
        
        # Sign and send transaction
        stx = txn.sign(sk)
        txid = ALGOD.send_transaction(stx)
        print(f"Transaction sent: {txid}")
        
        # Wait for confirmation
        print("Waiting for confirmation...")
        res = transaction.wait_for_confirmation(ALGOD, txid, 4)
        app_id = res["application-index"]
        
        # Save app ID
        os.makedirs(os.path.dirname(ART_PATH), exist_ok=True)
        with open(ART_PATH, "w") as f:
            json.dump({
                "appId": app_id, 
                "network": "localnet",
                "deployer": addr,
                "deployedAt": int(time.time())
            }, f, indent=2)
        
        print(f"Smart contract deployed successfully!")
        print(f"Application ID: {app_id}")
        print(f"App ID saved to: {ART_PATH}")
        
        return app_id
        
    except Exception as e:
        print(f"Deployment failed: {e}")
        raise

def call_issue(cred_id, subject, schema_code, cred_hash_hex, expires_at, nft_asa_id, cid_pointer=b""):
    """Call the issue method on the deployed contract"""
    try:
        with open(ART_PATH) as f: 
            app_data = json.load(f)
            app_id = app_data["appId"]
        
        deployer_account = get_deployer_account()
        sk = deployer_account.private_key
        addr = deployer_account.address
        
        # Validate subject address
        if not encoding.is_valid_address(subject):
            raise ValueError(f"Invalid subject address: {subject}")
        
        print(f"Issuing credential {cred_id} to {subject}")
        print(f"Schema code: {schema_code}")
        print(f"NFT ASA ID: {nft_asa_id}")
        
        sp = ALGOD.suggested_params()
        
        # Ensure hash is exactly 32 bytes
        if len(cred_hash_hex) % 2 != 0:
            cred_hash_hex = cred_hash_hex + '0'  # Pad with 0 if odd length
        cred_hash_bytes = bytes.fromhex(cred_hash_hex)
        if len(cred_hash_bytes) != 32:
            # Pad or truncate to exactly 32 bytes
            cred_hash_bytes = cred_hash_bytes[:32].ljust(32, b'\x00')
        
        # Ensure CID pointer is exactly 32 bytes
        cid_bytes = cid_pointer[:32].ljust(32, b'\x00')
        
        # Prepare arguments for the smart contract
        args = [
            b"issue",
            cred_id.encode(),
            encoding.decode_address(subject),
            schema_code.to_bytes(1, "big"),
            cred_hash_bytes,  # Now exactly 32 bytes
            expires_at.to_bytes(8, "big"),
            cid_bytes,  # Now exactly 32 bytes
            nft_asa_id.to_bytes(8, "big")  # NFT ASA ID
        ]
        
        # Debug: print argument lengths
        print(f"Debug - Argument lengths:")
        print(f"  cred_id: {len(args[1])} bytes")
        print(f"  subject: {len(args[2])} bytes")
        print(f"  schema_code: {len(args[3])} bytes")
        print(f"  cred_hash: {len(args[4])} bytes")
        print(f"  expires_at: {len(args[5])} bytes")
        print(f"  cid_pointer: {len(args[6])} bytes")
        print(f"  nft_asa_id: {len(args[7])} bytes")
        
        # Create application call transaction (sent by admin)
        txn = transaction.ApplicationNoOpTxn(
            addr, sp, app_id, 
            app_args=args,
            boxes=[(app_id, cred_id.encode())]
        )
        
        stx = txn.sign(sk)
        txid = ALGOD.send_transaction(stx)
        
        print(f"Issue transaction sent: {txid}")
        
        # Wait for confirmation
        transaction.wait_for_confirmation(ALGOD, txid, 4)
        print(f"Credential issued successfully: {txid}")
        
        return txid
        
    except Exception as e:
        print(f"Issue failed: {e}")
        raise

def call_revoke(cred_id):
    """Call the revoke method on the deployed contract"""
    try:
        with open(ART_PATH) as f: 
            app_data = json.load(f)
            app_id = app_data["appId"]
        
        deployer_account = get_deployer_account()
        sk = deployer_account.private_key
        addr = deployer_account.address
        
        print(f"Revoking credential {cred_id}")
        
        sp = ALGOD.suggested_params()
        args = [b"revoke", cred_id.encode()]
        
        txn = transaction.ApplicationNoOpTxn(
            addr, sp, app_id, 
            app_args=args, 
            boxes=[(app_id, cred_id.encode())]
        )
        
        stx = txn.sign(sk)
        txid = ALGOD.send_transaction(stx)
        
        print(f"Revoke transaction sent: {txid}")
        
        transaction.wait_for_confirmation(ALGOD, txid, 4)
        print(f"Credential revoked successfully: {txid}")
        
        return txid
        
    except Exception as e:
        print(f"Revoke failed: {e}")
        raise

def fund_app_account(amount_microalgos=200000):
    """Fund the application account for box storage operations"""
    try:
        with open(ART_PATH) as f: 
            app_data = json.load(f)
            app_id = app_data["appId"]
        
        deployer_account = get_deployer_account()
        sk = deployer_account.private_key
        addr = deployer_account.address
        
        # Get the application account address (derived from app ID)
        app_info = ALGOD.application_info(app_id)
        creator_addr = app_info['params']['creator']
        
        # The application account address is derived from the creator and app ID
        # For simplicity, we'll fund the creator account which is the app account in this case
        app_account_addr = creator_addr
        
        print(f"Funding application account: {app_account_addr}")
        print(f"Amount: {amount_microalgos} microALGOs")
        
        # Check current balance
        try:
            app_account_info = ALGOD.account_info(app_account_addr)
            current_balance = app_account_info['amount']
            print(f"Current app account balance: {current_balance} microALGOs")
        except Exception as e:
            print(f"App account not found or error: {e}")
            current_balance = 0
        
        if current_balance >= amount_microalgos:
            print(f"App account already has sufficient balance: {current_balance} microALGOs")
            return True
        
        # Check deployer balance
        deployer_info = ALGOD.account_info(addr)
        deployer_balance = deployer_info['amount']
        print(f"Deployer balance: {deployer_balance} microALGOs")
        
        if deployer_balance < amount_microalgos + 1000:  # Add some buffer for fees
            print(f"Error: Deployer has insufficient balance. Need {amount_microalgos + 1000}, have {deployer_balance}")
            return False
        
        # Create payment transaction
        sp = ALGOD.suggested_params()
        txn = transaction.PaymentTxn(
            addr, sp, app_account_addr, amount_microalgos
        )
        
        stx = txn.sign(sk)
        txid = ALGOD.send_transaction(stx)
        
        print(f"Funding transaction sent: {txid}")
        
        # Wait for confirmation
        transaction.wait_for_confirmation(ALGOD, txid, 4)
        
        # Verify the funding
        app_account_info = ALGOD.account_info(app_account_addr)
        new_balance = app_account_info['amount']
        print(f"App account funded successfully!")
        print(f"New balance: {new_balance} microALGOs")
        
        return True
        
    except Exception as e:
        print(f"Funding failed: {e}")
        return False

def get_app_info():
    """Get information about the deployed contract"""
    try:
        with open(ART_PATH) as f: 
            app_data = json.load(f)
            app_id = app_data["appId"]
        
        app_info = ALGOD.application_info(app_id)
        print(f"Contract Information:")
        print(f"App ID: {app_id}")
        print(f"Network: {app_data['network']}")
        print(f"Deployer: {app_data['deployer']}")
        print(f"Deployed: {time.ctime(app_data['deployedAt'])}")
        print(f"Creator: {app_info['params']['creator']}")
        
        return app_data
        
    except Exception as e:
        print(f"Failed to get app info: {e}")
        return None

if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Deploy and interact with credential smart contract on LocalNet")
    p.add_argument("--deploy", action="store_true", help="Deploy the contract")
    p.add_argument("--compile", action="store_true", help="Compile the contract")
    p.add_argument("--fund", type=int, metavar="AMOUNT", help="Fund the application account (amount in microALGOs)")
    p.add_argument("--issue", nargs=7, metavar=("CRED_ID","SUBJECT","SCHEMA_CODE","HASH_HEX","EXPIRES_UNIX","NFT_ASA_ID","CID_POINTER"), help="Issue a credential")
    p.add_argument("--revoke", metavar="CRED_ID", help="Revoke a credential")
    p.add_argument("--info", action="store_true", help="Show contract information")
    
    a = p.parse_args()
    
    if a.compile:
        print("Compiling smart contract...")
        compileTeal(app(), Mode.Application, version=8)
        print("Compilation successful")
        
    if a.deploy: 
        deploy()
        
    if a.fund is not None:
        fund_app_account(a.fund)
        
    if a.issue:  
        call_issue(a.issue[0], a.issue[1], int(a.issue[2]), a.issue[3], int(a.issue[4]), int(a.issue[5]), a.issue[6].encode() if a.issue[6] else b"")
        
    if a.revoke: 
        call_revoke(a.revoke)
        
    if a.info:
        get_app_info()
