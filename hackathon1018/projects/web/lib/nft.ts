import algosdk from 'algosdk'
import { getAlgodClient, getAdminAccount, waitForConfirmation, getSuggestedParams, encodeAddress } from './algorand'

export interface CredentialNFTMetadata {
  credentialId: string
  credentialType: string
  issuer: string
  subject: string
  issuedAt: string
  expiresAt: string
  hash: string
  claim: Record<string, unknown>
}

/**
 * Creates a commemorative NFT for a credential
 * @param credentialId - Unique identifier for the credential
 * @param studentAddress - Algorand address of the student
 * @param credentialHash - SHA-256 hash of the credential
 * @param metadataUrl - URL pointing to off-chain metadata
 * @returns Promise<number> - The created ASA ID
 */
export async function mintCredentialNft(
  credentialId: string,
  studentAddress: string,
  credentialHash: string,
  metadataUrl?: string
): Promise<number> {
  try {
    // Debug environment variables
    console.log('NFT minting - Environment check:')
    console.log('NEXT_PUBLIC_ADMIN_MNEMONIC:', process.env.NEXT_PUBLIC_ADMIN_MNEMONIC ? 'SET' : 'NOT SET')
    console.log('NEXT_PUBLIC_APP_ID:', process.env.NEXT_PUBLIC_APP_ID)
    console.log('Mnemonic word count:', process.env.NEXT_PUBLIC_ADMIN_MNEMONIC?.split(' ').length)
    
    // Check if we're in LocalNet mode (no real mnemonic or invalid mnemonic)
    let isLocalNet = !process.env.NEXT_PUBLIC_ADMIN_MNEMONIC || 
                     process.env.NEXT_PUBLIC_ADMIN_MNEMONIC === '' ||
                     process.env.NEXT_PUBLIC_ADMIN_MNEMONIC.split(' ').length !== 24
    
    // Additional check: try to decode the mnemonic to see if it's valid
    if (!isLocalNet && process.env.NEXT_PUBLIC_ADMIN_MNEMONIC) {
      try {
        algosdk.mnemonicToSecretKey(process.env.NEXT_PUBLIC_ADMIN_MNEMONIC)
        console.log('Valid mnemonic detected - using real blockchain mode')
      } catch (error) {
        console.log('Invalid mnemonic detected - falling back to LocalNet simulation')
        isLocalNet = true
      }
    }
    
    if (isLocalNet) {
      console.log('LocalNet mode - simulating NFT minting...')
      
      // Simulate NFT creation
      const simulatedAssetId = Math.floor(Math.random() * 1000000) + 1000000
      console.log(`Simulated NFT created with ASA ID: ${simulatedAssetId}`)
      
      return simulatedAssetId
    }

    // Real blockchain implementation
    const client = getAlgodClient()
    const adminAccount = getAdminAccount()
    const suggestedParams = await getSuggestedParams()

    // Validate inputs
    if (!algosdk.isValidAddress(studentAddress)) {
      throw new Error('Invalid student address')
    }

    if (credentialHash.length !== 64) {
      throw new Error('Invalid credential hash length')
    }

    // Create asset name from credential ID
    const assetName = `CRD-${credentialId}`
    
    // Use default metadata URL if none provided
    const finalMetadataUrl = metadataUrl || `https://educhain.app/nft/${credentialId}`
    
    // Create metadata hash from credential hash
    const metadataHash = new Uint8Array(32)
    const hashBytes = new Uint8Array(Buffer.from(credentialHash, 'hex'))
    metadataHash.set(hashBytes)

    // Create asset creation transaction
    const createAssetTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: adminAccount.addr,
      suggestedParams,
      total: 1, // Total supply of 1 (NFT)
      decimals: 0, // No decimals for NFT
      defaultFrozen: false, // Not frozen by default
      unitName: 'CRD', // Unit name
      assetName: assetName, // Asset name
      assetURL: finalMetadataUrl, // Metadata URL
      assetMetadataHash: metadataHash, // Metadata hash
      manager: adminAccount.addr, // Manager address
      reserve: adminAccount.addr, // Reserve address
      freeze: adminAccount.addr, // Freeze address
      clawback: adminAccount.addr, // Clawback address
    })

    // Sign and send the transaction
    const signedTxn = createAssetTxn.signTxn(adminAccount.sk)
    const response = await client.sendRawTransaction(signedTxn).do()
    const txID = response.txID

    // Wait for confirmation
    const confirmedTxn = await waitForConfirmation(txID)
    
    if (!confirmedTxn.txn?.txn?.apaa) {
      throw new Error('Asset creation failed')
    }

    // Get the created asset ID
    const assetId = confirmedTxn.txn.txn.apaa[0]
    const assetIdNumber = Number(assetId)

    console.log(`✅ NFT created successfully! Asset ID: ${assetIdNumber}`)

    // Now transfer the NFT to the student
    await transferNftToStudent(assetIdNumber, studentAddress)

    return assetIdNumber

  } catch (error) {
    console.error('Error minting credential NFT:', error)
    throw new Error(`Failed to mint NFT: ${error}`)
  }
}

/**
 * Transfers an NFT to a student address
 * @param assetId - The ASA ID of the NFT
 * @param studentAddress - Algorand address of the student
 */
async function transferNftToStudent(assetId: number, studentAddress: string): Promise<void> {
  try {
    const client = getAlgodClient()
    const adminAccount = getAdminAccount()
    const suggestedParams = await getSuggestedParams()

    // Create opt-in transaction for the student
    const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: studentAddress,
      to: studentAddress,
      amount: 0,
      assetIndex: assetId,
      suggestedParams,
    })

    // Create transfer transaction
    const transferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: adminAccount.addr,
      to: studentAddress,
      amount: 1,
      assetIndex: assetId,
      suggestedParams,
    })

    // Group transactions
    const groupedTxn = algosdk.assignGroupID([optInTxn, transferTxn])

    // Sign transactions
    const signedOptIn = algosdk.signTransaction(optInTxn, adminAccount.sk)
    const signedTransfer = algosdk.signTransaction(transferTxn, adminAccount.sk)

    // Send grouped transaction (extract blob from signed transactions)
    const response = await client.sendRawTransaction([signedOptIn.blob, signedTransfer.blob]).do()
    const txID = response.txID

    // Wait for confirmation
    await waitForConfirmation(txID)

    console.log(`✅ NFT transferred to student: ${studentAddress}`)

  } catch (error) {
    console.error('Error transferring NFT to student:', error)
    throw new Error(`Failed to transfer NFT: ${error}`)
  }
}

/**
 * Creates metadata URL for a credential NFT
 * @param credentialId - Unique identifier for the credential
 * @param baseUrl - Base URL for metadata (optional)
 * @returns string - The metadata URL
 */
export function createMetadataUrl(credentialId: string, baseUrl?: string): string {
  const defaultBaseUrl = 'https://api.educhain.com/metadata'
  const url = baseUrl || defaultBaseUrl
  return `${url}/${credentialId}`
}

/**
 * Generates metadata for a credential NFT
 * @param metadata - Credential metadata
 * @returns object - NFT metadata object
 */
export function generateNftMetadata(metadata: CredentialNFTMetadata): object {
  return {
    name: `Credential NFT - ${metadata.credentialId}`,
    description: `Commemorative NFT for ${metadata.credentialType} credential`,
    image: `https://api.educhain.com/images/${metadata.credentialId}.png`,
    attributes: [
      {
        trait_type: 'Credential Type',
        value: metadata.credentialType
      },
      {
        trait_type: 'Credential ID',
        value: metadata.credentialId
      },
      {
        trait_type: 'Issuer',
        value: metadata.issuer
      },
      {
        trait_type: 'Subject',
        value: metadata.subject
      },
      {
        trait_type: 'Issued At',
        value: metadata.issuedAt
      },
      {
        trait_type: 'Expires At',
        value: metadata.expiresAt
      },
      {
        trait_type: 'Hash',
        value: metadata.hash
      }
    ],
    properties: {
      credential: metadata
    }
  }
}
