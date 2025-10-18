import algosdk from 'algosdk'

// Algorand configuration
const ALGOD_TOKEN = process.env.NEXT_PUBLIC_ALGOD_TOKEN || ''
const ALGOD_SERVER = process.env.NEXT_PUBLIC_ALGOD_SERVER || 'http://localhost:4001'
const ALGOD_PORT = process.env.NEXT_PUBLIC_ALGOD_PORT || '4001'

// Admin configuration
export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || 'KYK6GIIY7JXHCX2VOQF2PFZJH4B5EL5KHCJ7CFSF7K7TZKONGWPUBA6OSM'
export const ADMIN_MNEMONIC = process.env.NEXT_PUBLIC_ADMIN_MNEMONIC || ''

// App configuration
export const APP_ID = Number(process.env.NEXT_PUBLIC_APP_ID || 0)

// Create singleton Algod client
let algodClient: algosdk.Algodv2 | null = null

export function getAlgodClient(): algosdk.Algodv2 {
  if (!algodClient) {
    algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT)
  }
  return algodClient
}

// Helper function to get admin account
export function getAdminAccount(): algosdk.Account {
  if (!ADMIN_MNEMONIC) {
    throw new Error('Admin mnemonic not configured')
  }
  
  try {
    return algosdk.mnemonicToSecretKey(ADMIN_MNEMONIC)
  } catch (error) {
    throw new Error('Invalid admin mnemonic')
  }
}

// Helper function to wait for transaction confirmation
export async function waitForConfirmation(txId: string, timeout: number = 4): Promise<any> {
  const client = getAlgodClient()
  return await algosdk.waitForConfirmation(client, txId, timeout)
}

// Helper function to get suggested parameters
export async function getSuggestedParams(): Promise<algosdk.SuggestedParams> {
  const client = getAlgodClient()
  return await client.getTransactionParams().do()
}

// Helper function to encode address
export function encodeAddress(address: string): Uint8Array {
  return algosdk.decodeAddress(address).publicKey
}

// Helper function to decode address
export function decodeAddress(encoded: Uint8Array): string {
  return algosdk.encodeAddress(encoded)
}

// Helper function to convert number to 8-byte array
export function numberToBytes8(num: number): Uint8Array {
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  view.setBigUint64(0, BigInt(num), false) // big-endian
  return new Uint8Array(buffer)
}

// Helper function to convert 8-byte array to number
export function bytes8ToNumber(bytes: Uint8Array): number {
  const view = new DataView(bytes.buffer)
  return Number(view.getBigUint64(0, false)) // big-endian
}