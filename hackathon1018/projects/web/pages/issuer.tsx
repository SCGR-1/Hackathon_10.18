import { useState, useEffect } from "react"
import { Credential, CredentialType, hashCredential, getSchemaCode } from "../lib/cred"
import { mintNftAndIssueCredential } from "../lib/blockchain"
import { ADMIN_ADDRESS } from "../lib/algorand"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link"

export default function Issuer() {
  const { userRole, isLoading } = useAuth()
  const [credentialType, setCredentialType] = useState<CredentialType>('VisaCredential')
  const [credential, setCredential] = useState<Credential>({
    type: 'VisaCredential',
    credentialId: "",
    issuer: "",
    subject: "",
    claim: {
      visaType: "Work Visa",
      country: "USA",
      visaNumber: "V123456789",
      issuedBy: "US Embassy"
    },
    issuedAt: new Date().toISOString(),
    expiresAt: ""
  })
  const [result, setResult] = useState<string>("")
  const [isIssuing, setIsIssuing] = useState<boolean>(false)
  const [claimData, setClaimData] = useState<any>({
    visaType: "Work Visa",
    country: "USA",
    visaNumber: "V123456789",
    issuedBy: "US Embassy"
  })

  // Set default credential type based on role
  useEffect(() => {
    if (userRole === 'Institution') {
      setCredentialType('EducationCredential')
      setClaimData({
        institution: "University of Example",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        graduationYear: "2024"
      })
      setCredential(prev => ({
        ...prev,
        type: 'EducationCredential',
        claim: {
          institution: "University of Example",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          graduationYear: "2024"
        }
      }))
    } else if (userRole === 'Authority') {
      setCredentialType('VisaCredential')
    }
  }, [userRole])

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
    if (!credential.credentialId?.trim() || !credential.subject?.trim() || !credential.expiresAt?.trim()) {
      setResult("❌ Please fill in all required fields:\n- Credential ID (e.g., visa-12345)\n- Subject (Algorand address)\n- Start On (date and time)\n- Ends On (date and time)")
      return
    }

    // Debug: log what we're about to issue
    console.log('Issuing credential with data:', credential)
    console.log('Claim data:', credential.claim)

    setIsIssuing(true)
    setResult("🔄 Minting NFT and issuing credential to blockchain...")

    try {
      const hash = await hashCredential(credential)
      const schemaCode = getSchemaCode(credentialType)
      const expiresAtUnix = Math.floor(new Date(credential.expiresAt).getTime() / 1000)
      
      const result = await mintNftAndIssueCredential({
        credentialId: credential.credentialId,
        subject: credential.subject,
        schemaCode: schemaCode,
        hashHex: hash,
        expiresAt: expiresAtUnix,
        cidPointer: "",
        claim: credential.claim,
        validFrom: credential.validFrom
      })

      // Create block explorer link (for TestNet/MainNet)
      const explorerBaseUrl = process.env.NEXT_PUBLIC_ALGOD_SERVER?.includes('testnet') 
        ? 'https://testnet.algoexplorer.io' 
        : 'https://algoexplorer.io'
      const explorerLink = `${explorerBaseUrl}/asset/${result.nftAsaId}`

      setResult(`✅ Credential issued successfully with commemorative NFT!

🎨 NFT Details:
• Asset ID: ${result.nftAsaId}
• Unit Name: CRD
• Asset Name: CRD-${credential.credentialId}

📜 Credential Details:
• Transaction ID: ${result.txId}
• Credential ID: ${credential.credentialId}
• Subject: ${credential.subject}
• Schema Code: ${schemaCode}
• Hash: ${hash}
• Expires: ${credential.expiresAt}

🔗 View NFT: ${explorerLink}

The student has received a commemorative NFT representing this credential!`)
    } catch (err: any) {
      setResult(`⚠️ Failed to mint NFT and issue credential: ${err.message}

Please check:
• Student address is valid
• All required fields are filled
• Network connection is stable`)
    } finally {
      setIsIssuing(false)
    }
  }

  const updateCredentialType = (newType: CredentialType) => {
    setCredentialType(newType)
    setCredential({...credential, type: newType})
    setClaimData(getClaimTemplate(newType))
  }

  const updateClaimField = (field: string, value: string) => {
    const newClaimData = {...claimData, [field]: value}
    setClaimData(newClaimData)
    setCredential({...credential, claim: newClaimData})
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
    <Layout>
      <div style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
        {isLoading ? (
          <div style={{padding: "20px", textAlign: "center"}}>
            <p>Loading...</p>
          </div>
        ) : !userRole ? (
          <div style={{padding: "20px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "5px"}}>
            <h3>🔒 Access Restricted</h3>
            <p>Please log in as an Institution or Authority to issue credentials.</p>
          </div>
        ) : userRole === 'Student' ? (
          <div style={{padding: "20px", backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", borderRadius: "5px"}}>
            <h3>🚫 Access Denied</h3>
            <p>Students cannot issue credentials. Please log in as an Institution or Authority.</p>
          </div>
        ) : (
          <>
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
            
            <h1>Issue {userRole === 'Institution' ? 'Education' : 'Visa'} Credential</h1>
            
            <div style={{marginBottom: "20px"}}>
              <label>Credential Type:</label>
              <select 
                value={credentialType}
                onChange={(e) => updateCredentialType(e.target.value as CredentialType)}
                style={{width: "100%", padding: "5px", marginTop: "5px"}}
                disabled={userRole !== null} // Disable if role is set
              >
                <option value="VisaCredential">Visa Credential</option>
                <option value="EducationCredential">Education Credential</option>
              </select>
              {userRole && (
                <small style={{color: "#666", display: "block", marginTop: "5px"}}>
                  {userRole === 'Institution' ? 'Education credentials only' : 'Visa credentials only'}
                </small>
              )}
            </div>

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: "10px"}}>
          <label>Credential ID:</label>
          <input 
            type="text" 
            value={credential.credentialId}
            onChange={(e) => setCredential({...credential, credentialId: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
            placeholder="e.g., visa-12345, edu-67890"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label>Issuer (Algorand Address):</label>
          <input 
            type="text" 
            value={credential.issuer || "KYK6GIIY7JXHCX2VOQF2PFZJH4B5EL5KHCJ7CFSF7K7TZKONGWPUBA6OSM"}
            onChange={(e) => setCredential({...credential, issuer: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
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
            style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
            placeholder="ALGORAND_ADDRESS_HERE"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label>Start On:</label>
          <input 
            type="datetime-local" 
            value={credential.validFrom || new Date().toISOString().slice(0, 16)}
            onChange={(e) => setCredential({...credential, validFrom: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label>Ends On:</label>
          <input 
            type="datetime-local" 
            value={credential.expiresAt}
            onChange={(e) => setCredential({...credential, expiresAt: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
          />
        </div>

        
        <div style={{marginBottom: "10px"}}>
          
          {credentialType === 'VisaCredential' && (
            <div style={{marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
              <div>
                <label>Visa Type:</label>
                <input 
                  type="text" 
                  value={claimData.visaType || ""}
                  onChange={(e) => updateClaimField('visaType', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., Work Visa"
                />
              </div>
              <div>
                <label>Country:</label>
                <input 
                  type="text" 
                  value={claimData.country || ""}
                  onChange={(e) => updateClaimField('country', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., USA"
                />
              </div>
              <div>
                <label>Visa Number:</label>
                <input 
                  type="text" 
                  value={claimData.visaNumber || ""}
                  onChange={(e) => updateClaimField('visaNumber', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., V123456789"
                />
              </div>
              <div>
                <label>Issued By:</label>
                <input 
                  type="text" 
                  value={claimData.issuedBy || ""}
                  onChange={(e) => updateClaimField('issuedBy', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., US Embassy"
                />
              </div>
            </div>
          )}
          
          {credentialType === 'EducationCredential' && (
            <div style={{marginTop: "10px"}}>
              <div style={{marginBottom: "10px"}}>
                <label>Institution:</label>
                <input 
                  type="text" 
                  value={claimData.institution || ""}
                  onChange={(e) => updateClaimField('institution', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., University of Example"
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label>Program:</label>
                <input 
                  type="text" 
                  value={claimData.program || ""}
                  onChange={(e) => updateClaimField('program', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., Bachelor of Computer Science"
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label>Degree:</label>
                <input 
                  type="text" 
                  value={claimData.degree || ""}
                  onChange={(e) => updateClaimField('degree', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., BSc"
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label>GPA:</label>
                <input 
                  type="text" 
                  value={claimData.gpa || ""}
                  onChange={(e) => updateClaimField('gpa', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., 3.8"
                />
              </div>
            </div>
          )}
        </div>
        
        <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
          <button 
            type="button"
            onClick={() => {
              // Auto-fill with demo data
              const demoData = credentialType === 'EducationCredential' 
                ? {
                    institution: "Stanford University",
                    program: "Bachelor of Computer Science",
                    degree: "BSc",
                    gpa: "3.8"
                  }
                : {
                    visaType: "Student Visa",
                    country: "United States",
                    visaNumber: "F123456789",
                    issuedBy: "US Consulate"
                  }
              
              setClaimData(demoData)
              
              // Set dates: Start On = today, Ends On = 1 year later
              const today = new Date()
              const oneYearLater = new Date(today)
              oneYearLater.setFullYear(today.getFullYear() + 1)
              
              setCredential(prev => ({
                ...prev,
                credentialId: `demo-${Date.now()}`,
                claim: demoData,
                validFrom: today.toISOString().slice(0, 16), // Format for datetime-local
                expiresAt: oneYearLater.toISOString().slice(0, 16) // Format for datetime-local
              }))
            }}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              flex: "1",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(108,117,125,0.2)"
            }}
          >
            📝 Use Template for Demo
          </button>
          <button 
            type="button"
            onClick={handleIssueToBlockchain}
            disabled={isIssuing}
            style={{
              backgroundColor: isIssuing ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: isIssuing ? "not-allowed" : "pointer",
              flex: "2",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              boxShadow: isIssuing ? "none" : "0 2px 4px rgba(0,112,243,0.2)"
            }}
          >
            {isIssuing ? "🔄 Minting NFT & Issuing..." : "🎨 Mint NFT & Issue Credential"}
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
          <h3>Success!</h3>
          <pre style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>{result}</pre>
        </div>
      )}
          </>
        )}
      </div>
    </Layout>
  )
}