import { useState } from "react"
import { Credential, hashCredential } from "../lib/cred"
import { readBox, CredentialRecord, searchCredentialsBySubject } from "../lib/algorand"
import { searchCredentialsBySubjectLocalNet, verifyCredentialLocalNet } from "../lib/blockchain"

const APP_ID = Number(process.env.NEXT_PUBLIC_APP_ID || 0)

export default function Verify() {
  const [result, setResult] = useState<string>("")
  const [searchMode, setSearchMode] = useState<'json' | 'search'>('search')
  const [userCredentials, setUserCredentials] = useState<CredentialRecord[]>([])

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const subjectAddress = (new FormData(e.currentTarget).get("address") as string) || ""
    
    if (!subjectAddress) {
      setResult("❌ Please enter a subject address")
      return
    }

    try {
      // Demo mode when APP_ID is 0
      if (APP_ID === 0) {
        return setResult(`⚠️ Demo Mode - Smart contract not deployed yet
        
To enable user search:
1. Deploy smart contract: algokit project deploy testnet
2. Set NEXT_PUBLIC_APP_ID in .env.local
3. Restart frontend

Search would look for credentials for: ${subjectAddress}`)
      }

      // Search for credentials by subject address
      const credentials = await searchCredentialsBySubjectLocalNet(subjectAddress)
      
      if (credentials.length === 0) {
        setResult(`🔍 No credentials found for: ${subjectAddress}

This address has no issued credentials on the blockchain.`)
        return
      }

      // Display found credentials
      let resultText = `🔍 Found ${credentials.length} credential(s) for: ${subjectAddress}\n\n`
      
      credentials.forEach((cred, index) => {
        const issuedDate = new Date(cred.issuedAt * 1000).toISOString()
        const expiresDate = new Date(cred.expiresAt * 1000).toISOString()
        const status = cred.revoked ? "❌ REVOKED" : "✅ ACTIVE"
        
        resultText += `${index + 1}. ${cred.credentialType} (Schema: ${cred.schemaCode})\n`
        resultText += `   Status: ${status}\n`
        resultText += `   Issuer: ${cred.issuer}\n`
        resultText += `   Issued: ${issuedDate}\n`
        resultText += `   Expires: ${expiresDate}\n`
        if (cred.cidPointer) resultText += `   IPFS: ${cred.cidPointer}\n`
        resultText += `   Hash: ${cred.hashHex.substring(0, 16)}...\n\n`
      })
      
      setResult(resultText)
      
    } catch (err: any) {
      setResult(`❌ Error searching: ${err.message}`)
    }
  }

  async function handleJson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const txt = (new FormData(e.currentTarget).get("json") as string) || ""
    try {
      const cred: Credential = JSON.parse(txt)
      
      // Demo mode when APP_ID is 0
      if (APP_ID === 0) {
        return setResult(`⚠️ Demo Mode - Smart contract not deployed yet
        
To enable full verification:
1. Deploy smart contract: algokit project deploy testnet
2. Set NEXT_PUBLIC_APP_ID in .env.local
3. Restart frontend

Credential parsed successfully:
• Type: ${cred.type}
• ID: ${cred.credentialId}
• Issuer: ${cred.issuer}
• Subject: ${cred.subject}`)
      }
      
      const box: any | null = await verifyCredentialLocalNet(cred.credentialId)
      
      if (!box) return setResult("❌ Credential not found on blockchain")
      
      const hash = await hashCredential(cred)
      const now = Math.floor(Date.now()/1000)
      
      // Comprehensive verification
      if (box.hashHex !== hash) return setResult("❌ Hash mismatch - credential has been tampered with")
      if (box.subject !== cred.subject) return setResult("❌ Subject address mismatch")
      if (box.issuer !== cred.issuer) return setResult("❌ Issuer address mismatch")
      if (box.credentialType !== cred.type) return setResult("❌ Credential type mismatch")
      if (box.revoked) return setResult("❌ Credential has been revoked")
      if (now >= box.expiresAt) return setResult("❌ Credential has expired")
      
      // Success with details
      const issuedDate = new Date(box.issuedAt * 1000).toISOString()
      const expiresDate = new Date(box.expiresAt * 1000).toISOString()
      
      setResult(`✅ Credential is VALID
      
Details:
• Type: ${box.credentialType}
• Schema Code: ${box.schemaCode}
• Issuer: ${box.issuer}
• Subject: ${box.subject}
• Issued: ${issuedDate}
• Expires: ${expiresDate}
• Hash: ${hash.substring(0, 16)}...
${box.cidPointer ? `• IPFS CID: ${box.cidPointer}` : ''}`)
      
    } catch (err: any) { 
      setResult(`❌ Invalid input: ${err.message}`) 
    }
  }

  return (
    <main style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
      <h1>Verify Credential</h1>
      
      <div style={{marginBottom: "20px"}}>
        <label>Verification Mode:</label>
        <div style={{marginTop: "10px"}}>
          <button 
            onClick={() => setSearchMode('search')}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: searchMode === 'search' ? "#0070f3" : "#f0f0f0",
              color: searchMode === 'search' ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Search by User Address
          </button>
          <button 
            onClick={() => setSearchMode('json')}
            style={{
              padding: "10px 20px",
              backgroundColor: searchMode === 'json' ? "#0070f3" : "#f0f0f0",
              color: searchMode === 'json' ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Verify JSON Credential
          </button>
        </div>
      </div>

      {searchMode === 'search' ? (
        <div>
          <h2>Search User Credentials</h2>
          <p>Enter a user's Algorand address to find and verify all their credentials.</p>
          
          <form onSubmit={handleSearch}>
            <div style={{marginBottom: "10px"}}>
              <label>Subject Address (Algorand Address):</label>
              <input 
                type="text" 
                name="address"
                placeholder="ALGORAND_ADDRESS_HERE"
                style={{width: "100%", padding: "10px", marginTop: "5px"}}
              />
            </div>
            <button type="submit">Search User Credentials</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Verify Credential JSON</h2>
          <p>Paste a credential JSON to verify its authenticity against the blockchain.</p>
          
          <form onSubmit={handleJson}>
            <textarea 
              name="json" 
              rows={12} 
              style={{width:"100%"}} 
              placeholder='Paste credential JSON here...'
            />
            <button type="submit">Verify Credential</button>
          </form>
        </div>
      )}
      
      {result && (
        <div style={{
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: result.includes("✅") ? "#d4edda" : "#f8d7da",
          border: `1px solid ${result.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "5px"
        }}>
          <pre style={{whiteSpace: "pre-wrap", margin: 0}}>{result}</pre>
        </div>
      )}
      
      <div style={{marginTop: "30px", padding: "15px", backgroundColor: "#e9ecef", borderRadius: "5px"}}>
        <h3>Example Credentials:</h3>
        <details style={{marginBottom: "10px"}}>
          <summary>Visa Credential</summary>
          <pre style={{fontSize: "12px", overflow: "auto"}}>{`{
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
  "expiresAt": "2026-01-01T00:00:00Z"
}`}</pre>
        </details>
        
        <details style={{marginBottom: "10px"}}>
          <summary>Education Credential</summary>
          <pre style={{fontSize: "12px", overflow: "auto"}}>{`{
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
}`}</pre>
        </details>
        
        <details>
          <summary>Employment Credential</summary>
          <pre style={{fontSize: "12px", overflow: "auto"}}>{`{
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
}`}</pre>
        </details>
      </div>
    </main>
  )
}