# Multi-Credential Verification System

A blockchain-based credential verification system using Algorand's blockchain for visa, education, and employment status verification. Implements the recommended pattern of keeping heavy data off-chain while anchoring each credential on-chain for privacy + verifiability + simple revocation.

## Project Structure

```
hackathon1018/
├── projects/
│   ├── cred_contracts/          # PyTeal smart contracts
│   │   ├── src/
│   │   │   ├── app.py         # Main smart contract
│   │   │   ├── deploy.py      # Deployment script
│   │   │   └── util.py        # Utility functions
│   │   ├── tests/
│   │   │   └── test_app.py    # Unit tests
│   │   ├── artifacts/         # Compiled contracts
│   │   └── pyproject.toml     # Python dependencies
│   └── web/                   # Next.js frontend
│       ├── lib/
│       │   ├── cred.ts        # Credential utilities
│       │   └── algorand.ts    # Algorand client
│       ├── pages/
│       │   ├── index.tsx      # Home page
│       │   ├── issuer.tsx     # Issue credentials
│       │   └── verify.tsx     # Verify credentials
│       └── package.json       # Node dependencies
└── .algokit.toml             # Workspace configuration
```

## Features

- **Multi-Credential Support**: Visa, Education, and Employment credentials with schema codes
- **Smart Contract**: PyTeal-based credential registry with issue/revoke functionality
- **Web Interface**: Next.js application for issuing and verifying credentials
- **Off-Chain Storage**: Full credential data stored off-chain (IPFS/DB) with on-chain anchors
- **Privacy-First**: Only hashes and minimal metadata stored on-chain
- **Tamper Detection**: Cryptographic verification of credential integrity
- **Expiration Support**: Time-based credential expiration
- **Revocation**: Ability to revoke issued credentials
- **IPFS Integration**: Optional IPFS CID pointers for off-chain data retrieval

## Setup Instructions

### Prerequisites

1. **Python 3.12+** with Poetry
2. **Node.js 18+** with npm
3. **AlgoKit CLI** (`pipx install algokit`)
4. **TestNet Account** with ALGO tokens

### 1. Install Dependencies

```bash
# Install smart contract dependencies
cd hackathon1018/projects/cred_contracts
poetry install

# Install web app dependencies
cd ../web
npm install
```

### 2. Set Environment Variables

```bash
# Set your TestNet account mnemonic
export DEPLOYER_MNEMONIC="your 25-word mnemonic phrase"

# Set the deployed app ID (after deployment)
echo "NEXT_PUBLIC_APP_ID=<app_id>" > hackathon1018/projects/web/.env.local
```

### 3. Deploy Smart Contract

```bash
# Deploy to TestNet
cd hackathon1018
algokit project deploy testnet
```

### 4. Run the Application

```bash
# Start the web application
cd hackathon1018/projects/web
npm run dev
```

## Usage

### Issuing Credentials

1. Navigate to `/issuer` page
2. Select credential type (Visa or Education)
3. Fill in credential details:
   - Credential ID (unique identifier)
   - Issuer (Algorand address)
   - Subject (Algorand address)
   - Expiration date
   - Claim data (JSON) - use templates for each type
4. Click "🚀 Issue to Blockchain" to automatically issue the credential

The web interface handles all the complexity of generating hashes, schema codes, and blockchain transactions automatically.

### Verifying Credentials

1. Navigate to `/verify` page
2. Paste the credential JSON
3. Click "Verify" to check against blockchain

### Example Credentials

**Visa Credential:**
```json
{
  "type": "VisaCredential",
  "credentialId": "visa-12345",
  "issuer": "ALGORAND_ISSUER_ADDR",
  "subject": "ALGORAND_SUBJECT_ADDR",
  "claim": {
    "visaType": "Work Visa",
    "country": "USA",
    "visaNumber": "V123456789",
    "issuedBy": "US Embassy"
  },
  "issuedAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2026-01-01T00:00:00Z",
  "cid": "QmHash..."
}
```

**Education Credential:**
```json
{
  "type": "EducationCredential",
  "credentialId": "edu-67890",
  "issuer": "ALGORAND_ISSUER_ADDR",
  "subject": "ALGORAND_SUBJECT_ADDR",
  "claim": {
    "institution": "University of Example",
    "program": "Bachelor of Computer Science",
    "degree": "BSc",
    "graduatedOn": "2024-06-15",
    "gpa": "3.8"
  },
  "issuedAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2028-01-01T00:00:00Z"
}
```

**Employment Credential:**
```json
{
  "type": "EmploymentCredential",
  "credentialId": "emp-11111",
  "issuer": "ALGORAND_ISSUER_ADDR",
  "subject": "ALGORAND_SUBJECT_ADDR",
  "claim": {
    "position": "Software Engineer",
    "department": "Engineering",
    "company": "TechCorp Inc",
    "salary": "120000",
    "startDate": "2024-01-01"
  },
  "issuedAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2025-01-01T00:00:00Z"
}
```

## Commands

```bash
# Build everything
algokit project run build

# Lint code
algokit project run lint

# Run tests
algokit project run test

# Compile contracts
algokit project run compile_contracts

# Deploy to TestNet
algokit project deploy testnet

# Issue demo credential
algokit project run issue_demo -- demo-1234 <SUBJECT_ADDR> <HASH_HEX> <EXPIRES_UNIX>

# Revoke credential
algokit project run revoke_demo -- demo-1234
```

## Smart Contract Details

The multi-credential registry smart contract provides:

- **Issue**: Store credential hash with schema-specific metadata
- **Revoke**: Mark credential as revoked
- **Box Storage**: Each credential stored in a separate box (146 bytes)
- **Schema Support**: Visa (1), Education (2), Employment (3)
- **Admin Control**: Only admin can issue/revoke credentials
- **IPFS Integration**: Optional CID pointers for off-chain data
- **Immutable**: Once issued, credentials cannot be modified

### On-Chain Storage (per credential):
- issuer_addr (32 bytes)
- subject_addr (32 bytes) 
- schema_code (1 byte)
- cred_hash (32 bytes)
- issued_at (8 bytes)
- expires_at (8 bytes)
- revoked (1 byte)
- cid_pointer (32 bytes)

## Security Features

- **Cryptographic Hashing**: SHA-256 hashing prevents tampering
- **Blockchain Immutability**: Credential registry cannot be altered
- **Expiration Checking**: Automatic expiration validation
- **Revocation Support**: Ability to revoke compromised credentials
- **Address Verification**: Subject address validation

## Architecture Benefits

### Privacy + Verifiability
- **Off-Chain Storage**: Full credential data (names, IDs, details) stored off-chain
- **On-Chain Anchors**: Only cryptographic hashes and minimal metadata on-chain
- **Tamper Detection**: Any modification to off-chain data breaks hash verification
- **Selective Disclosure**: Users control what information to share

### Scalability
- **Per-Credential Anchors**: Each credential is independently verifiable and revocable
- **Schema Flexibility**: Easy to add new credential types with new schema codes
- **IPFS Integration**: Decentralized off-chain storage with CID pointers
- **Efficient Storage**: Only 146 bytes per credential on-chain

### Security
- **Immutable Registry**: Blockchain ensures credential registry cannot be altered
- **Cryptographic Verification**: SHA-256 hashing prevents credential tampering
- **Revocation Support**: Instant revocation capability for compromised credentials
- **Expiration Control**: Time-based credential expiration

## Next Steps

1. **IPFS Integration**: Implement actual IPFS storage for off-chain data
2. **Batch Operations**: Support for issuing multiple credentials
3. **Advanced Schemas**: Add more credential types (certifications, licenses, etc.)
4. **API Endpoints**: REST API for third-party integration
5. **Mobile App**: React Native app for credential management
6. **MainNet Deployment**: Production deployment on Algorand MainNet
7. **Audit Trail**: Complete transaction history and analytics
8. **Multi-Language**: Support for multiple languages and regions