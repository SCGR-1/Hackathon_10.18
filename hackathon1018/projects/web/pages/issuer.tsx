import { useState } from "react"
import { Credential, CredentialType, hashCredential, getSchemaCode } from "../lib/cred"
import { issueCredential, ADMIN_ADDRESS } from "../lib/blockchain"
import Link from "next/link"

export default function Issuer() {
  const [credentialType, setCredentialType] = useState<CredentialType>('VisaCredential')
  const [credential, setCredential] = useState<Credential>({
    type: 'VisaCredential',
    credentialId: "",
    issuer: "",
    subject: "",
    claim: {},
    issuedAt: new Date().toISOString(),
    expiresAt: ""
  })
  const [result, setResult] = useState<string>("")
  const [isIssuing, setIsIssuing] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const hash = await hashCredential(credential)
      const schemaCode = getSchemaCode(credentialType)
      setResult(`Credential Hash: ${hash}\nSchema Code: ${schemaCode}\nCredential Type: ${credentialType}`)
    } catch (err: any) {
      setResult(`Error: ${err.message}`)
    }
  }

  const handleIssueToBlockchain = async () => {
    // Debug: log current credential state
    console.log('Current credential:', credential)
    console.log('Credential ID:', credential.credentialId, 'Length:', credential.credentialId?.length)
    console.log('Subject:', credential.subject, 'Length:', credential.subject?.length)
    console.log('Expires At:', credential.expiresAt, 'Length:', credential.expiresAt?.length)
    
    if (!credential.credentialId?.trim() || !credential.subject?.trim() || !credential.expiresAt?.trim()) {
      setResult("❌ Please fill in all required fields:\n- Credential ID (e.g., visa-12345)\n- Subject (Algorand address)\n- Expires At (date and time)")
      return
    }

    setIsIssuing(true)
    setResult("🔄 Issuing credential to blockchain...")

    try {
      // Generate hash
      const hash = await hashCredential(credential)
      const schemaCode = getSchemaCode(credentialType)
      
      // Convert expiresAt to Unix timestamp
      const expiresAtUnix = Math.floor(new Date(credential.expiresAt).getTime() / 1000)
      
      // Issue to blockchain
      const txId = await issueCredential({
        credentialId: credential.credentialId,
        subject: credential.subject,
        schemaCode: schemaCode,
        hashHex: hash,
        expiresAt: expiresAtUnix,
        cidPointer: ""
      })

      setResult(`✅ Credential issued successfully!

Transaction ID: ${txId}
Credential ID: ${credential.credentialId}
Subject: ${credential.subject}
Schema Code: ${schemaCode}
Hash: ${hash}
Expires: ${credential.expiresAt}

You can now verify this credential on the verify page!`)
    } catch (err: any) {
      setResult(`⚠️ ${err.message}

Please ensure:
- LocalNet is running (algokit localnet start)
- Admin mnemonic is set in NEXT_PUBLIC_ADMIN_MNEMONIC environment variable
- Smart contract is deployed and NEXT_PUBLIC_APP_ID is set`)
    } finally {
      setIsIssuing(false)
    }
  }

  const updateCredentialType = (newType: CredentialType) => {
    setCredentialType(newType)
    setCredential({...credential, type: newType})
  }

  const getClaimTemplate = (type: CredentialType) => {
    switch (type) {
      case 'VisaCredential':
        return {
          visaType: "Work Visa",
          country: "USA",
          visaNumber: "V123456789",
          issuedBy: "US Embassy"
        }
      case 'EducationCredential':
        return {
          institution: "University of Example",
          program: "Bachelor of Computer Science",
          degree: "BSc",
          graduatedOn: "2024-06-15",
          gpa: "3.8"
        }
    }
  }

  return (
    <main style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
      <div style={{marginBottom: "20px"}}>
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "#f0f0f0",
          color: "#333",
          textDecoration: "none",
          borderRadius: "5px",
          border: "1px solid #ddd"
        }}>
          ← Back to Home
        </Link>
      </div>
      
      <h1>Issue Credential</h1>
      
      <div style={{marginBottom: "20px"}}>
        <label>Credential Type:</label>
        <select 
          value={credentialType}
          onChange={(e) => updateCredentialType(e.target.value as CredentialType)}
          style={{width: "100%", padding: "5px", marginTop: "5px"}}
        >
          <option value="VisaCredential">Visa Credential</option>
          <option value="EducationCredential">Education Credential</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: "10px"}}>
          <label>Credential ID:</label>
          <input 
            type="text" 
            value={credential.credentialId}
            onChange={(e) => setCredential({...credential, credentialId: e.target.value})}
            style={{width: "100%", padding: "5px"}}
            placeholder="e.g., visa-12345, edu-67890"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label>Issuer (Algorand Address):</label>
          <input 
            type="text" 
            value={credential.issuer || ADMIN_ADDRESS}
            onChange={(e) => setCredential({...credential, issuer: e.target.value})}
            style={{width: "100%", padding: "5px"}}
            placeholder="ALGORAND_ADDRESS_HERE"
          />
          <small style={{color: "#666"}}>Using LocalNet admin address by default</small>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label>Subject (Algorand Address):</label>
          <input 
            type="text" 
            value={credential.subject}
            onChange={(e) => setCredential({...credential, subject: e.target.value})}
            style={{width: "100%", padding: "5px"}}
            placeholder="ALGORAND_ADDRESS_HERE"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label>Expires At:</label>
          <input 
            type="datetime-local" 
            value={credential.expiresAt}
            onChange={(e) => setCredential({...credential, expiresAt: e.target.value})}
            style={{width: "100%", padding: "5px"}}
          />
        </div>

        
        <div style={{marginBottom: "10px"}}>
          <label>Claim Data (JSON):</label>
          <button 
            type="button"
            onClick={() => setCredential({...credential, claim: getClaimTemplate(credentialType)})}
            style={{marginLeft: "10px", padding: "5px"}}
          >
            Use Template
          </button>
          <textarea 
            rows={6}
            value={JSON.stringify(credential.claim, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setCredential({...credential, claim: parsed})
              } catch (err) {
                // Keep the text for editing
              }
            }}
            style={{width: "100%", padding: "5px", marginTop: "5px"}}
          />
        </div>
        
        <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
          <button type="submit">Generate Hash & Schema Code</button>
          <button 
            type="button"
            onClick={handleIssueToBlockchain}
            disabled={isIssuing}
            style={{
              backgroundColor: isIssuing ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: isIssuing ? "not-allowed" : "pointer"
            }}
          >
            {isIssuing ? "🔄 Issuing..." : "🚀 Issue to Blockchain"}
          </button>
        </div>
      </form>
      
      {result && (
        <div style={{
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: result.startsWith("✅") ? "#e6ffe6" : (result.startsWith("🔄") ? "#fffbe6" : (result.startsWith("❌") ? "#ffe6e6" : "#f0f0f0")),
          border: `1px solid ${result.startsWith("✅") ? "#00cc00" : (result.startsWith("🔄") ? "#ffcc00" : (result.startsWith("❌") ? "#ff0000" : "#ccc"))}`,
          borderRadius: "5px"
        }}>
          <h3>Result:</h3>
          <pre style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>{result}</pre>
        </div>
      )}
    </main>
  )
}