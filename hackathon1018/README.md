# EduChain - Blockchain Credential Verification Platform

EduChain is a decentralized credential verification system built on Algorand that issues tamper-proof credentials and commemorative NFTs. Whether you're an institution issuing diplomas, a government authority managing visas, or a certification body validating professional credentials, EduChain provides a secure, immutable way to verify achievements.

## 🌟 What Makes EduChain Special

- **Real Blockchain Integration**: Built on Algorand with actual smart contracts and NFT minting
- **Multiple Credential Types**: Education, Visa, and Certification credentials
- **Commemorative NFTs**: Each credential comes with a unique digital collectible
- **Instant Verification**: Real-time credential validation on the blockchain
- **LocalNet Development**: Full development environment with Algorand LocalNet

## 🏗️ Architecture Overview

### Smart Contract Layer
- **Algorand Smart Contract (ASC)**: Handles credential issuance, revocation, and verification
- **Box Storage**: Stores credential metadata securely on-chain
- **Application Account**: Funded account for smart contract operations

### Frontend Layer
- **Next.js + TypeScript**: Modern React-based web application
- **AlgoKit Integration**: Simplified Algorand blockchain interactions
- **Role-Based Access**: Student, Institution, Authority, and Certifier roles

### Blockchain Integration
- **Real NFTs**: Actual Algorand Standard Assets (ASAs) minted for each credential
- **LocalNet Support**: Complete development environment with funding automation
- **Environment Flexibility**: Works with LocalNet, TestNet, and MainNet

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Algorand LocalNet** (via AlgoKit)
- **Git**

### 1. Clone and Setup

```bash
git clone <repository-url>
cd hackathon1018
```

### 2. Backend Setup (Smart Contracts)

```bash
cd projects/cred_contracts
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd ../web
npm install
```

### 4. Environment Configuration

Create `.env.local` in the `web` directory:

```env
# Algorand Configuration
NEXT_PUBLIC_ALGOD_SERVER=http://localhost:4001
NEXT_PUBLIC_ALGOD_TOKEN=
NEXT_PUBLIC_INDEXER_SERVER=http://localhost:8980
NEXT_PUBLIC_INDEXER_TOKEN=

# Smart Contract Configuration
NEXT_PUBLIC_APP_ID=1013
NEXT_PUBLIC_ADMIN_ADDRESS=SACYCQTR3RVKZQOYYYPWEKS3AZZUOTHLRSSE4LGYEA5YPQRU26ZTIJIXBQ

# Optional: For production deployments
NEXT_PUBLIC_ADMIN_MNEMONIC=your_mnemonic_here
```

## 📋 Detailed Deployment Manual

### Step 1: Start Algorand LocalNet

```bash
# Install AlgoKit if not already installed
pip install algokit

# Start LocalNet
algokit localnet start
```

Verify LocalNet is running:
- Algod: http://localhost:4001
- Indexer: http://localhost:8980
- KMD: http://localhost:4002

### Step 2: Deploy Smart Contract

```bash
cd projects/cred_contracts/src

# Deploy the smart contract
python deploy_localnet.py

# Fund the application account (required for box storage)
python deploy_localnet.py --fund
```

**Important**: The `--fund` flag is crucial as it funds the application account with 200,000 microALGOs needed for box storage operations.

### Step 3: Configure Frontend

1. **Update App ID**: After deployment, update `NEXT_PUBLIC_APP_ID` in `.env.local` with the deployed contract's App ID.

2. **Verify Admin Address**: Ensure `NEXT_PUBLIC_ADMIN_ADDRESS` matches your LocalNet admin address.

### Step 4: Start Development Server

```bash
cd projects/web
npm run dev
```

The application will be available at http://localhost:3000

### Step 5: Test the System

1. **Login as Certifier**: Use the Award icon to login as a Certifier
2. **Issue Certification**: Create a certification credential with fields like:
   - Certification Body: "AWS"
   - Exam Type: "Solutions Architect"
   - Score: "95%"
   - Validity Period: "3 years"
3. **Verify Credential**: Use the verify page to check the issued credential
4. **Check NFT**: View the commemorative NFT in the wallet section

## 🔧 Technical Details

### Smart Contract Features

- **Credential Issuance**: Store credential metadata in box storage
- **Revocation Support**: Mark credentials as revoked
- **Expiration Handling**: Automatic expiration checking
- **NFT Integration**: Link credentials to minted NFTs

### Frontend Architecture

- **Authentication Context**: Role-based access control
- **Blockchain Integration**: Real smart contract calls via AlgoKit
- **NFT Minting**: Automatic NFT creation for each credential
- **Responsive Design**: Dark/light mode support

### Credential Types

1. **Education Credential** (Schema Code: 1)
   - Institution, Degree, Field of Study, GPA

2. **Visa Credential** (Schema Code: 2)
   - Country, Visa Type, Purpose, Duration

3. **Certification Credential** (Schema Code: 3)
   - Certification Body, Exam Type, Score, Validity Period

## 🛠️ Development Workflow

### Making Changes

1. **Smart Contract Changes**: Modify `projects/cred_contracts/src/app.py`
2. **Frontend Changes**: Update components in `projects/web/components/`
3. **Redeploy**: Run `python deploy_localnet.py` after contract changes

### Testing

```bash
# Run smart contract tests
cd projects/cred_contracts
python -m pytest tests/

# Run frontend tests
cd ../web
npm test
```

### Debugging

- **Smart Contract Logs**: Check LocalNet logs for transaction details
- **Frontend Console**: Browser dev tools for frontend debugging
- **Blockchain Explorer**: Use Algorand Explorer for transaction verification

## 🚨 Troubleshooting

### Common Issues

1. **"Box Storage Account Problem"**
   - Solution: Run `python deploy_localnet.py --fund`

2. **"Invalid admin mnemonic"**
   - Solution: Ensure LocalNet is running and admin address is correct

3. **"Overspend error"**
   - Solution: Fund accounts using AlgoKit's `ensureFunded` function

4. **"Asset name too big"**
   - Solution: Credential IDs are automatically truncated to fit 32-character limit

### Environment Issues

- **LocalNet Not Running**: Ensure `algokit localnet start` is executed
- **Port Conflicts**: Check that ports 4001, 8980, and 4002 are available
- **Python Dependencies**: Run `pip install -r requirements.txt`

## 📚 API Reference

### Smart Contract Methods

- `issue(credentialId, subject, schemaCode, hash, expiresAt, nftAsaId, cidPointer)`
- `revoke(credentialId)`
- `getCredential(credentialId)`

### Frontend Functions

- `mintNftAndIssueCredential()`: Mint NFT and issue credential
- `verifyCredentialLocalNet()`: Verify credential authenticity
- `revokeCredential()`: Revoke a credential

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built on Algorand blockchain
- Powered by AlgoKit development tools
- Uses Next.js and React for the frontend
- Lucide React for beautiful icons

---

**Ready to revolutionize credential verification? Start with EduChain!** 🚀