import { useState, useEffect } from "react"
import { Credential, CredentialType, hashCredential, getSchemaCode } from "../lib/cred"
import { mintNftAndIssueCredential } from "../lib/blockchain"
import { ADMIN_ADDRESS } from "../lib/algorand"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link"

export default function Issuer() {
  const { userRole, isLoading, isDarkMode } = useAuth()
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
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [successData, setSuccessData] = useState<any>(null)
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
    } else if (userRole === 'Employer') {
      setCredentialType('EmploymentCredential')
      setClaimData({
        company: "Tech Corp Inc.",
        position: "Software Engineer",
        department: "Engineering",
        startDate: new Date().toISOString().split('T')[0],
        salary: "$75,000"
      })
      setCredential(prev => ({
        ...prev,
        type: 'EmploymentCredential',
        claim: {
          company: "Tech Corp Inc.",
          position: "Software Engineer",
          department: "Engineering",
          startDate: new Date().toISOString().split('T')[0],
          salary: "$75,000"
        }
      }))
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
    setResult("")

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

      // Set success data for modal
      setSuccessData({
        nftAsaId: result.nftAsaId,
        txId: result.txId,
        credentialId: credential.credentialId,
        subject: credential.subject,
        schemaCode,
        hash,
        expiresAt: credential.expiresAt,
        explorerLink
      })
      setShowSuccessModal(true)
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
      case 'EmploymentCredential':
        return {
          company: "Tech Corp Inc.",
          position: "Software Engineer",
          department: "Engineering",
          startDate: new Date().toISOString().split('T')[0],
          salary: "$75,000"
        }
    }
  }

  return (
    <Layout>
      {/* Main Card Container */}
      <div style={{maxWidth:720, margin:"0 auto", fontFamily:"ui-sans-serif", backgroundColor: isDarkMode ? '#2d1b69' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: isDarkMode ? '#ffffff' : 'inherit', textAlign: 'center'}}>
        {isLoading ? (
          <div style={{padding: "20px", textAlign: "center"}}>
            <p>Loading...</p>
          </div>
        ) : !userRole ? (
          <div style={{padding: "20px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "5px"}}>
            <h3>🔒 Access Restricted</h3>
            <p>Please log in as an Institution, Authority, or Employer to issue credentials.</p>
          </div>
        ) : userRole === 'Student' ? (
          <div style={{padding: "20px", backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", borderRadius: "5px"}}>
            <h3>🚫 Access Denied</h3>
            <p>Students cannot issue credentials. Please log in as an Institution, Authority, or Employer.</p>
          </div>
        ) : (
          <>
            
            <div style={{
              backgroundColor: isDarkMode ? '#2d1b69' : '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: 'none',
              textAlign: 'center'
            }}>
              <h1 style={{
                margin: 0,
                color: isDarkMode ? '#ffffff' : '#1f2937',
                fontSize: '28px',
                fontWeight: '600'
              }}>
                Issue {userRole === 'Institution' ? 'Education' : userRole === 'Authority' ? 'Visa' : userRole === 'Employer' ? 'Employment' : 'Credential'} Credential
              </h1>
      </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '500px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: "10px"}}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Credential ID:</label>
          <input 
            type="text" 
            value={credential.credentialId}
            onChange={(e) => setCredential({...credential, credentialId: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
            placeholder="e.g., visa-12345, edu-67890"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Issuer (Algorand Address):</label>
          <input 
            type="text" 
            value={credential.issuer || "KYK6GIIY7JXHCX2VOQF2PFZJH4B5EL5KHCJ7CFSF7K7TZKONGWPUBA6OSM"}
            onChange={(e) => setCredential({...credential, issuer: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
            placeholder="ALGORAND_ADDRESS_HERE"
          />
          <small style={{color: isDarkMode ? "#9ca3af" : "#666"}}>Using LocalNet admin address by default</small>
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Subject (Algorand Address):</label>
          <input 
            type="text" 
            value={credential.subject}
            onChange={(e) => setCredential({...credential, subject: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
            placeholder="ALGORAND_ADDRESS_HERE"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Start On:</label>
          <input 
            type="datetime-local" 
            value={credential.validFrom || new Date().toISOString().slice(0, 16)}
            onChange={(e) => setCredential({...credential, validFrom: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Ends On:</label>
          <input 
            type="datetime-local" 
            value={credential.expiresAt}
            onChange={(e) => setCredential({...credential, expiresAt: e.target.value})}
            style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
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
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Visa Type:</label>
                <input 
                  type="text" 
                  value={claimData.visaType || ""}
                  onChange={(e) => updateClaimField('visaType', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., Work Visa"
                />
              </div>
              <div>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Country:</label>
                <input 
                  type="text" 
                  value={claimData.country || ""}
                  onChange={(e) => updateClaimField('country', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., USA"
                />
              </div>
              <div>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Visa Number:</label>
                <input 
                  type="text" 
                  value={claimData.visaNumber || ""}
                  onChange={(e) => updateClaimField('visaNumber', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., V123456789"
                />
              </div>
              <div>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Issued By:</label>
                <input 
                  type="text" 
                  value={claimData.issuedBy || ""}
                  onChange={(e) => updateClaimField('issuedBy', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
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
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Institution:</label>
                <input 
                  type="text" 
                  value={claimData.institution || ""}
                  onChange={(e) => updateClaimField('institution', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., University of Example"
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Program:</label>
                <input 
                  type="text" 
                  value={claimData.program || ""}
                  onChange={(e) => updateClaimField('program', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., Bachelor of Computer Science"
                />
              </div>
        <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Degree:</label>
          <input 
            type="text" 
                  value={claimData.degree || ""}
                  onChange={(e) => updateClaimField('degree', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., BSc"
          />
        </div>
        <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>GPA:</label>
          <input 
            type="text" 
                  value={claimData.gpa || ""}
                  onChange={(e) => updateClaimField('gpa', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
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
          
          {credentialType === 'EmploymentCredential' && (
            <div style={{marginTop: "10px"}}>
              <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Company:</label>
                <input 
                  type="text" 
                  value={claimData.company || ""}
                  onChange={(e) => updateClaimField('company', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Position:</label>
                <input 
                  type="text" 
                  value={claimData.position || ""}
                  onChange={(e) => updateClaimField('position', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Department:</label>
                <input 
                  type="text" 
                  value={claimData.department || ""}
                  onChange={(e) => updateClaimField('department', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., Engineering"
                />
              </div>
              <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Start Date:</label>
                <input 
                  type="date" 
                  value={claimData.startDate || ""}
                  onChange={(e) => updateClaimField('startDate', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                />
              </div>
        <div style={{marginBottom: "10px"}}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: isDarkMode ? '#ffffff' : '#374151' }}>Salary:</label>
                <input 
                  type="text" 
                  value={claimData.salary || ""}
                  onChange={(e) => updateClaimField('salary', e.target.value)}
                  style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box"
          }}
                  placeholder="e.g., $75,000"
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
                : credentialType === 'VisaCredential'
                ? {
                    visaType: "Student Visa",
                    country: "United States",
                    visaNumber: "F123456789",
                    issuedBy: "US Consulate"
                  }
                : {
                    company: "Tech Corp Inc.",
                    position: "Senior Software Engineer",
                    department: "Engineering",
                    startDate: new Date().toISOString().split('T')[0],
                    salary: "$95,000"
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
              backgroundColor: isIssuing ? "#ccc" : "#8b5cf6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: isIssuing ? "not-allowed" : "pointer",
              flex: "2",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              boxShadow: isIssuing ? "none" : "0 2px 4px rgba(139,92,246,0.3)"
            }}
          >
            {isIssuing ? "🔄 Minting NFT & Issuing..." : `🎨 Mint NFT & Issue ${credentialType === 'EducationCredential' ? 'Education' : credentialType === 'VisaCredential' ? 'Visa' : 'Employment'} Credential`}
          </button>
        </div>
      </form>
              </div>
            </div>
      
      {/* Error/Loading Messages */}
      {result && !result.startsWith("✅") && (
        <div style={{
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: result.startsWith("🔄") ? "#fffbe6" : "#ffe6e6",
          border: `1px solid ${result.startsWith("🔄") ? "#ffcc00" : "#ff0000"}`,
          borderRadius: "5px",
          color: isDarkMode ? "#ffffff" : "#000000"
        }}>
          <pre style={{whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0}}>{result}</pre>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowSuccessModal(false)}>
          <div style={{
            backgroundColor: isDarkMode ? '#1a0b2e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                margin: 0,
                color: '#10b981',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                ✅ Success!
              </h2>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: isDarkMode ? '#ffffff' : '#000000',
                  padding: '5px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '10px' }}>🎨 NFT Details</h3>
              <div style={{
                backgroundColor: isDarkMode ? '#2d1b69' : '#f3f4f6',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '5px 0' }}><strong>Asset ID:</strong> {successData.nftAsaId}</p>
                <p style={{ margin: '5px 0' }}><strong>Unit Name:</strong> CRD</p>
                <p style={{ margin: '5px 0' }}><strong>Asset Name:</strong> CRD-{successData.credentialId}</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '10px' }}>📜 Credential Details</h3>
              <div style={{
                backgroundColor: isDarkMode ? '#2d1b69' : '#f3f4f6',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '5px 0' }}><strong>Transaction ID:</strong> {successData.txId}</p>
                <p style={{ margin: '5px 0' }}><strong>Credential ID:</strong> {successData.credentialId}</p>
                <p style={{ margin: '5px 0', wordBreak: 'break-all' }}><strong>Subject:</strong> {successData.subject}</p>
                <p style={{ margin: '5px 0' }}><strong>Schema Code:</strong> {successData.schemaCode}</p>
                <p style={{ margin: '5px 0', wordBreak: 'break-all' }}><strong>Hash:</strong> {successData.hash}</p>
                <p style={{ margin: '5px 0' }}><strong>Expires:</strong> {successData.expiresAt}</p>
              </div>
            </div>


            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7c3aed'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#8b5cf6'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
          </>
        )}
      </div>

      {/* Back Button - At bottom of card */}
      <div style={{maxWidth:720, margin:"20px auto 60px", fontFamily:"ui-sans-serif"}}>
        <div style={{marginBottom: "20px"}}>
          <Link href="/" style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: isDarkMode ? "#374151" : "#f8f9fa",
            color: isDarkMode ? "#ffffff" : "#495057",
            textDecoration: "none",
            borderRadius: "8px",
            border: isDarkMode ? "1px solid #4b5563" : "1px solid #dee2e6",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  )
}