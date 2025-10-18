import algosdk from "algosdk"
import { Credential } from "./cred"
import { mintCredentialNft, createMetadataUrl, CredentialNFTMetadata } from "./nft"
import { getAlgodClient, getAdminAccount, waitForConfirmation, getSuggestedParams, encodeAddress, numberToBytes8, APP_ID } from "./algorand"

// LocalNet configuration
const ALGOD_TOKEN = ""
const ALGOD_SERVER = "http://localhost:4001"
const INDEXER_TOKEN = ""
const INDEXER_SERVER = "http://localhost:8980"

// Create clients
export const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, "")
export const indexerClient = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_SERVER, "")

// In-memory storage for LocalNet simulation with localStorage persistence
const STORAGE_KEY = 'localnet_credentials'

function loadCredentials(): Map<string, any> {
  if (typeof window === 'undefined') return new Map()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return new Map(Object.entries(data))
    }
  } catch (e) {
    console.error('Error loading credentials from localStorage:', e)
  }
  return new Map()
}

function saveCredentials(credentials: Map<string, any>) {
  if (typeof window === 'undefined') return
  
  try {
    const data = Object.fromEntries(credentials)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving credentials to localStorage:', e)
  }
}

const issuedCredentials = loadCredentials()

// LocalNet admin account - use default LocalNet admin address
const ADMIN_ADDRESS = "KYK6GIIY7JXHCX2VOQF2PFZJH4B5EL5KHCJ7CFSF7K7TZKONGWPUBA6OSM"

// Debug: Log environment loading
console.log('=== Blockchain Module Load ===')
console.log('Environment variables loaded:', {
  NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID || 'NOT SET',
  ADMIN_ADDRESS: ADMIN_ADDRESS
})
console.log('=============================')

export interface IssueCredentialParams {
  credentialId: string
  subject: string
  schemaCode: number
  hashHex: string
  expiresAt: number
  cidPointer?: string
  claim?: Record<string, unknown>
  validFrom?: string
  nftAsaId?: number
}

export async function issueCredential(params: IssueCredentialParams): Promise<{ txId: string; nftAsaId?: number }> {
  try {
    // Debug logging for environment variables
    console.log('=== Environment Debug ===')
    console.log('NEXT_PUBLIC_APP_ID:', process.env.NEXT_PUBLIC_APP_ID || 'NOT SET')
    console.log('ADMIN_ADDRESS:', ADMIN_ADDRESS)
    console.log('========================')
    
    const appId = Number(process.env.NEXT_PUBLIC_APP_ID || 1005)
    
    // For LocalNet, we'll use a different approach - call the contract directly
    // This simulates the credential issuing without requiring private key signing
    console.log('Simulating credential issue for LocalNet...')
    console.log('Credential ID:', params.credentialId)
    console.log('Subject:', params.subject)
    console.log('Schema Code:', params.schemaCode)
    console.log('Hash:', params.hashHex)
    console.log('Expires At:', params.expiresAt)
    
    // For LocalNet, simulate NFT minting first
    let nftAsaId: number | undefined
    if (params.nftAsaId) {
      nftAsaId = params.nftAsaId
      console.log('Using provided NFT ASA ID:', nftAsaId)
    } else {
      // Simulate NFT creation
      nftAsaId = Math.floor(Math.random() * 1000000) + 1000000
      console.log('Simulated NFT ASA ID:', nftAsaId)
    }
    
    // Store credential data for verification
    const credentialData = {
      credentialId: params.credentialId,
      subject: params.subject,
      schemaCode: params.schemaCode,
      hashHex: params.hashHex,
      expiresAt: params.expiresAt,
      issuedAt: Math.floor(Date.now() / 1000),
      revoked: false,
      cidPointer: params.cidPointer || "",
      claim: params.claim || {},
      validFrom: params.validFrom || null,
      nftAsaId: nftAsaId
    }
    
    // Store by credential ID for verification
    issuedCredentials.set(params.credentialId, credentialData)
    saveCredentials(issuedCredentials)
    
    // Return a mock transaction ID for LocalNet
    const mockTxId = `LOCALNET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('✅ Credential issued successfully (LocalNet simulation)')
    console.log('Stored credential:', credentialData)
    return { txId: mockTxId, nftAsaId }
  } catch (error) {
    console.error("Error issuing credential:", error)
    throw new Error(`Failed to issue credential: ${error}`)
  }
}

/**
 * Mints an NFT and issues a credential in a grouped transaction
 * @param params - Credential parameters
 * @param metadataUrl - Optional metadata URL for the NFT
 * @returns Promise with transaction ID and NFT ASA ID
 */
export async function mintNftAndIssueCredential(
  params: IssueCredentialParams,
  metadataUrl?: string
): Promise<{ txId: string; nftAsaId: number }> {
  try {
    console.log('🎨 Starting NFT minting and credential issuance...')
    
    // Check if we're in LocalNet mode
    if (!process.env.NEXT_PUBLIC_APP_ID || process.env.NEXT_PUBLIC_APP_ID === '0' || !process.env.NEXT_PUBLIC_ADMIN_MNEMONIC || process.env.NEXT_PUBLIC_ADMIN_MNEMONIC === '') {
      console.log('LocalNet mode - simulating NFT minting and credential issuance...')
      
      // Simulate NFT minting
      const nftAsaId = Math.floor(Math.random() * 1000000) + 1000000
      console.log('Simulated NFT ASA ID:', nftAsaId)
      
      // Issue credential with NFT ASA ID
      const result = await issueCredential({
        ...params,
        nftAsaId
      })
      
      return { txId: result.txId, nftAsaId }
    }

    // Real blockchain implementation
    console.log('🔗 Real blockchain mode - minting NFT and issuing credential...')
    
    // Create metadata URL if not provided
    const finalMetadataUrl = metadataUrl || createMetadataUrl(params.credentialId)
    
    // Mint the NFT first
    console.log('🎨 Minting NFT...')
    const nftAsaId = await mintCredentialNft(
      params.credentialId,
      params.subject,
      params.hashHex,
      finalMetadataUrl
    )
    
    console.log('✅ NFT minted successfully! ASA ID:', nftAsaId)
    
    // Issue credential with NFT ASA ID
    console.log('📜 Issuing credential with NFT ASA ID...')
    const result = await issueCredential({
      ...params,
      nftAsaId
    })
    
    console.log('✅ Credential issued successfully!')
    return { txId: result.txId, nftAsaId }
    
  } catch (error) {
    console.error('Error in mintNftAndIssueCredential:', error)
    throw new Error(`Failed to mint NFT and issue credential: ${error}`)
  }
}

export async function revokeCredential(credentialId: string): Promise<string> {
  try {
    console.log('Simulating credential revocation for LocalNet...')
    console.log('Credential ID:', credentialId)
    
    // Check if credential exists
    const credential = issuedCredentials.get(credentialId)
    if (!credential) {
      throw new Error('Credential not found')
    }
    
    // Mark credential as revoked
    const updatedCredential = {
      ...credential,
      revoked: true,
      revokedAt: Date.now()
    }
    
    issuedCredentials.set(credentialId, updatedCredential)
    saveCredentials(issuedCredentials) // Persist to localStorage
    
    // Return a mock transaction ID for LocalNet
    const mockTxId = `LOCALNET_REVOKE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('✅ Credential revoked successfully (LocalNet simulation)')
    console.log('Updated credential:', updatedCredential)
    return mockTxId
  } catch (error) {
    console.error("Error revoking credential:", error)
    throw new Error(`Failed to revoke credential: ${error}`)
  }
}

export async function checkAccountBalance(address: string): Promise<number> {
  try {
    const accountInfo = await algodClient.accountInformation(address).do()
    return accountInfo.amount
  } catch (error) {
    console.error("Error checking account balance:", error)
    return 0
  }
}

// LocalNet simulation functions for verification
export async function searchCredentialsBySubjectLocalNet(subjectAddress: string): Promise<any[]> {
  console.log('Searching credentials for subject:', subjectAddress)
  console.log('Total stored credentials:', issuedCredentials.size)
  console.log('All stored credentials:', Array.from(issuedCredentials.entries()))
  
  const credentials: any[] = []
  
  for (const [credentialId, credentialData] of Array.from(issuedCredentials)) {
    console.log(`Checking credential ${credentialId}:`, credentialData)
    if (credentialData.subject === subjectAddress) {
      credentials.push({
        ...credentialData,
        issuer: ADMIN_ADDRESS,
        credentialType: credentialData.schemaCode === 1 ? 'VisaCredential' : credentialData.schemaCode === 2 ? 'EducationCredential' : 'EmploymentCredential'
      })
    }
  }
  
  console.log(`Found ${credentials.length} credentials for ${subjectAddress}`)
  return credentials
}

export async function verifyCredentialLocalNet(credentialId: string): Promise<any | null> {
  console.log('Verifying credential:', credentialId)
  const credential = issuedCredentials.get(credentialId)
  
  if (credential) {
    console.log('✅ Credential found:', credential)
    return {
      ...credential,
      issuer: ADMIN_ADDRESS,
      credentialType: credential.schemaCode === 1 ? 'VisaCredential' : credential.schemaCode === 2 ? 'EducationCredential' : 'EmploymentCredential'
    }
  }
  
  console.log('❌ Credential not found:', credentialId)
  return null
}

export { ADMIN_ADDRESS }
