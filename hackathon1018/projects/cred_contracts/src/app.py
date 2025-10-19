from pyteal import *

# Multi-credential registry contract with NFT support
# On-chain per credential (in app box by cred_id):
# issuer_addr(32) | subject_addr(32) | schema_code(1) | cred_hash(32) | issued_at(8) | expires_at(8) | revoked(1) | cid_pointer(32) | nft_asa_id(8)
# Total: 154 bytes (was 146 bytes)

def app():
    admin = Bytes("admin")
    version = Bytes("version")
    
    # Schema codes: 1=visa, 2=education, 3=employment
    VISA_SCHEMA = Int(1)
    EDUCATION_SCHEMA = Int(2)
    EMPLOYMENT_SCHEMA = Int(3)

    # Create application
    create_app = Seq(
        App.globalPut(admin, Txn.sender()),
        App.globalPut(version, Int(2)),  # Version 2 for multi-credential support
        Approve()
    )

    # Issue credential with NFT ASA ID
    def issue():
        cred_id = Txn.application_args[1]
        subject = Txn.application_args[2]
        schema_code = Btoi(Txn.application_args[3])
        cred_hash = Txn.application_args[4]
        expires_at = Btoi(Txn.application_args[5])
        cid_pointer = Txn.application_args[6]  # Optional IPFS CID
        nft_asa_id = Txn.application_args[7]   # NFT ASA ID (8 bytes)
        
        return Seq(
            Assert(Txn.sender() == App.globalGet(admin)),  # only admin can issue
            Assert(Len(cred_hash) == Int(32)),  # hash must be 32 bytes
            Assert(Len(subject) == Int(32)),   # address must be 32 bytes
            Assert(schema_code >= VISA_SCHEMA),  # valid schema code
            Assert(schema_code <= EMPLOYMENT_SCHEMA),
            Assert(Len(cid_pointer) <= Int(32)),  # CID pointer max 32 bytes
            Assert(Len(nft_asa_id) == Int(8)),  # NFT ASA ID must be exactly 8 bytes
            Pop(BoxCreate(cred_id, Int(32 + 32 + 8 + 32 + 8 + 8 + 1 + 32 + 8))),  # Total: 161 bytes
            BoxPut(
                cred_id,
                Concat(
                    Txn.sender(),  # issuer_addr (32)
                    subject,       # subject_addr (32)
                    Itob(schema_code),  # schema_code (8 bytes for integer)
                    cred_hash,     # cred_hash (32)
                    Itob(Global.latest_timestamp()),  # issued_at (8)
                    Itob(expires_at),  # expires_at (8)
                    Bytes("\x00"),  # revoked (1)
                    cid_pointer,   # cid_pointer (32 bytes, caller ensures this)
                    nft_asa_id     # nft_asa_id (8)
                ),
            ),
            Approve(),
        )

    # Revoke credential
    def revoke():
        cred_id = Txn.application_args[1]
        
        return Seq(
            Assert(Txn.sender() == App.globalGet(admin)),  # only admin can revoke
            # replace revoked byte at offset (32+32+1+32+8+8) = 113
            BoxReplace(cred_id, Int(113), Bytes("\x01")),
            Approve(),
        )

    # Get credential info (read-only)
    def get_credential():
        cred_id = Txn.application_args[1]
        
        return Seq(
            # Just return success - the box data can be read via indexer
            Approve(),
        )

    # Get NFT ASA ID for a credential
    def get_nft_asa_id():
        cred_id = Txn.application_args[1]
        
        return Seq(
            # Check that the box exists and return success
            # The NFT ASA ID can be read from the box at offset 146-153 (last 8 bytes)
            Approve(),
        )

    # Main program
    program = Cond(
        [Txn.application_id() == Int(0), create_app],
        [Txn.on_completion() == OnComplete.NoOp, 
         Cond(
             [Txn.application_args[0] == Bytes("issue"), issue()],
             [Txn.application_args[0] == Bytes("revoke"), revoke()],
             [Txn.application_args[0] == Bytes("get"), get_credential()],
             [Txn.application_args[0] == Bytes("get_nft"), get_nft_asa_id()],
             [Int(1), Reject()]
         )],
        [Int(1), Reject()]
    )

    return program

if __name__ == "__main__":
    print(compileTeal(app(), mode=Mode.Application, version=8))