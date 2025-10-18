import { useState } from "react"
import { Credential, CredentialType, hashCredential, getSchemaCode } from "../lib/cred"

export default function Issuer() {
  const [credentialType, setCredentialType] = useState<CredentialType>('EmploymentCredential')
  const [credential, setCredential] = useState<Credential>({
    type: 'EmploymentCredential',
    credentialId: "",
    issuer: "",
    subject: "",
    claim: {},
    issuedAt: new Date().toISOString(),
    expiresAt: ""
  })
  const [result, setResult] = useState<string>("")

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
      case 'EmploymentCredential':
        return {
          position: "Software Engineer",
          department: "Engineering",
          company: "TechCorp Inc",
          salary: "120000",
          startDate: "2024-01-01"
        }
    }
  }

  return (
    <main style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
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
          <option value="EmploymentCredential">Employment Credential</option>
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
            placeholder="e.g., visa-12345, edu-67890, emp-11111"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label>Issuer (Algorand Address):</label>
          <input 
            type="text" 
            value={credential.issuer}
            onChange={(e) => setCredential({...credential, issuer: e.target.value})}
            style={{width: "100%", padding: "5px"}}
            placeholder="ALGORAND_ADDRESS_HERE"
          />
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
          <label>IPFS CID (Optional):</label>
          <input 
            type="text" 
            value={credential.cid || ""}
            onChange={(e) => setCredential({...credential, cid: e.target.value})}
            style={{width: "100%", padding: "5px"}}
            placeholder="QmHash... (for off-chain storage)"
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
        
        <button type="submit">Generate Hash & Schema Code</button>
      </form>
      
      {result && (
        <div style={{marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0"}}>
          <h3>Result:</h3>
          <pre style={{whiteSpace: "pre-wrap"}}>{result}</pre>
        </div>
      )}
    </main>
  )
}