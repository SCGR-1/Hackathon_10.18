import algosdk from 'algosdk'

// Smart Contract Configuration
const CONTRACT_CONFIG = {
  appId: 1013, // Hardcoded app ID
  network: process.env.NEXT_PUBLIC_ALGOD_SERVER?.includes('localhost') ? 'localnet' : 'testnet'
}

// Cache for contract calls
const contractCache = new Map<string, any>()

// Create smart contract client
export const getContractClient = (): algosdk.Algodv2 => {
  return new algosdk.Algodv2('', process.env.NEXT_PUBLIC_ALGOD_SERVER || 'http://localhost:4001', '')
}

// Issue credential using smart contract
export const issueCredentialContract = async (
  credentialId: string,
  subject: string,
  schemaCode: number,
  hashHex: string,
  expiresAt: number,
  nftAsaId: number,
  cidPointer: string = ''
): Promise<{ txId: string; appId: number }> => {
  try {
    console.log('Calling smart contract to issue credential...')
    
    const algodClient = getContractClient()
    
    // Get suggested parameters
    let suggestedParams
    try {
      suggestedParams = await algodClient.getTransactionParams().do()
    } catch (error) {
      console.warn('Failed to get transaction params, using fallback:', error)
      suggestedParams = {
        fee: 1000,
        minFee: 1000,
        firstRound: 1,
        lastRound: 1000,
        firstValid: 1,
        lastValid: 1000,
        genesisID: 'dockernet-v1',
        genesisHash: new Uint8Array(Buffer.from('1/52KWKyH4GRJDMb/rbSSEqaM1c3CurlC3Z3xXekbL8=', 'base64'))
      } as algosdk.SuggestedParams
    }
    
    // Prepare contract arguments
    const appArgs: Uint8Array[] = [
      new Uint8Array(Buffer.from('issue')), // Method name
      new Uint8Array(Buffer.from(credentialId)), // Credential ID
      new Uint8Array(algosdk.decodeAddress(subject).publicKey), // Subject address
      new Uint8Array([schemaCode]), // Schema code
      new Uint8Array(Buffer.from(hashHex, 'hex')), // Hash
      new Uint8Array(new Uint8Array(new BigUint64Array([BigInt(expiresAt)]).buffer)), // Expires at
      new Uint8Array(Buffer.from(cidPointer)), // CID pointer
      new Uint8Array(new Uint8Array(new BigUint64Array([BigInt(nftAsaId)]).buffer)) // NFT ASA ID
    ]
    
    // Create application call transaction
    const txn = algosdk.makeApplicationNoOpTxnFromObject({
      sender: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || 'SACYCQTR3RVKZQOYYYPWEKS3AZZUOTHLRSSE4LGYEA5YPQRU26ZTIJIXBQ',
      suggestedParams: suggestedParams,
      appIndex: CONTRACT_CONFIG.appId,
      appArgs: appArgs,
      boxes: [{ appIndex: CONTRACT_CONFIG.appId, name: Buffer.from(credentialId) }]
    })
    
    // For LocalNet, we'll simulate the transaction
    if (CONTRACT_CONFIG.network === 'localnet') {
      console.log('LocalNet detected - simulating smart contract call')
      const simulatedTxId = `simulated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Store in cache for verification
      contractCache.set(credentialId, {
        credentialId,
        subject,
        schemaCode,
        hashHex,
        expiresAt,
        nftAsaId,
        cidPointer,
        txId: simulatedTxId,
        appId: CONTRACT_CONFIG.appId,
        issuedAt: Math.floor(Date.now() / 1000),
        revoked: false
      })
      
      return { txId: simulatedTxId, appId: CONTRACT_CONFIG.appId }
    }
    
    // For testnet/mainnet, use real transactions
    // Note: This would require proper signing with a real wallet
    console.log('Real network detected - would use actual smart contract call')
    throw new Error('Real smart contract calls require wallet integration')
    
  } catch (error) {
    console.error('Smart contract call failed:', error)
    throw error
  }
}

// Revoke credential using smart contract
export const revokeCredentialContract = async (
  credentialId: string
): Promise<{ txId: string; appId: number }> => {
  try {
    console.log('Calling smart contract to revoke credential...')
    
    const algodClient = getContractClient()
    
    // Get suggested parameters
    let suggestedParams
    try {
      suggestedParams = await algodClient.getTransactionParams().do()
    } catch (error) {
      console.warn('Failed to get transaction params, using fallback:', error)
      suggestedParams = {
        fee: 1000,
        minFee: 1000,
        firstRound: 1,
        lastRound: 1000,
        firstValid: 1,
        lastValid: 1000,
        genesisID: 'dockernet-v1',
        genesisHash: new Uint8Array(Buffer.from('1/52KWKyH4GRJDMb/rbSSEqaM1c3CurlC3Z3xXekbL8=', 'base64'))
      } as algosdk.SuggestedParams
    }
    
    // Prepare contract arguments
    const appArgs: Uint8Array[] = [
      new Uint8Array(Buffer.from('revoke')), // Method name
      new Uint8Array(Buffer.from(credentialId)) // Credential ID
    ]
    
    // Create application call transaction
    const txn = algosdk.makeApplicationNoOpTxnFromObject({
      sender: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || 'SACYCQTR3RVKZQOYYYPWEKS3AZZUOTHLRSSE4LGYEA5YPQRU26ZTIJIXBQ',
      suggestedParams: suggestedParams,
      appIndex: CONTRACT_CONFIG.appId,
      appArgs: appArgs,
      boxes: [{ appIndex: CONTRACT_CONFIG.appId, name: Buffer.from(credentialId) }]
    })
    
    // For LocalNet, simulate the transaction
    if (CONTRACT_CONFIG.network === 'localnet') {
      console.log('LocalNet detected - simulating revoke call')
      const simulatedTxId = `simulated-revoke-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Update cache
      const credential = contractCache.get(credentialId)
      if (credential) {
        credential.revoked = true
        credential.revokedAt = Math.floor(Date.now() / 1000)
        credential.revokeTxId = simulatedTxId
        contractCache.set(credentialId, credential)
      }
      
      return { txId: simulatedTxId, appId: CONTRACT_CONFIG.appId }
    }
    
    // For testnet/mainnet, use real transactions
    console.log('Real network detected - would use actual revoke call')
    throw new Error('Real smart contract calls require wallet integration')
    
  } catch (error) {
    console.error('Smart contract revoke failed:', error)
    throw error
  }
}

// Get credential from smart contract
export const getCredentialContract = async (
  credentialId: string
): Promise<any> => {
  try {
    // For LocalNet, return from cache
    if (CONTRACT_CONFIG.network === 'localnet') {
      return contractCache.get(credentialId)
    }
    
    // For real networks, query the contract
    const algodClient = getContractClient()
    
    // This would require proper contract querying
    // For now, return null to indicate not found
    return null
    
  } catch (error) {
    console.error('Failed to get credential from contract:', error)
    return null
  }
}

// Verify credential using smart contract
export const verifyCredentialContract = async (
  credentialId: string,
  expectedHash: string,
  expectedSubject: string
): Promise<{ valid: boolean; credential?: any; error?: string }> => {
  try {
    const credential = await getCredentialContract(credentialId)
    
    if (!credential) {
      return { valid: false, error: 'Credential not found' }
    }
    
    // Check if revoked
    if (credential.revoked) {
      return { valid: false, error: 'Credential has been revoked' }
    }
    
    // Check expiration
    if (Date.now() / 1000 > credential.expiresAt) {
      return { valid: false, error: 'Credential has expired' }
    }
    
    // Verify hash
    if (credential.hashHex !== expectedHash) {
      return { valid: false, error: 'Credential hash mismatch' }
    }
    
    // Verify subject
    if (credential.subject !== expectedSubject) {
      return { valid: false, error: 'Subject mismatch' }
    }
    
    return { valid: true, credential }
    
  } catch (error) {
    console.error('Credential verification failed:', error)
    return { valid: false, error: (error as Error).message }
  }
}

// Get contract information
export const getContractInfo = (): { appId: number; network: string; isReal: boolean } => {
  return {
    appId: CONTRACT_CONFIG.appId,
    network: CONTRACT_CONFIG.network,
    isReal: CONTRACT_CONFIG.network !== 'localnet'
  }
}

// Clear contract cache
export const clearContractCache = (): void => {
  contractCache.clear()
}
