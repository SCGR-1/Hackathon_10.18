import { useState } from "react"
import { Credential, hashCredential } from "../lib/cred"
import { readBox, CredentialRecord } from "../lib/algorand"

const APP_ID = Number(process.env.NEXT_PUBLIC_APP_ID || 0)

export default function Verify() {
  const [result, setResult] = useState<string>("")

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const txt = (new FormData(e.currentTarget).get("json") as string) || ""
    try {
      const cred: Credential = JSON.parse(txt)
      const box: CredentialRecord | null = await readBox(APP_ID, cred.credentialId)
      
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
      <p>Paste a credential JSON to verify its authenticity against the blockchain.</p>
      
      <form onSubmit={handle}>
        <textarea 
          name="json" 
          rows={12} 
          style={{width:"100%"}} 
          placeholder='Paste credential JSON here...'
        />
        <button type="submit">Verify Credential</button>
      </form>
      
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