import { useState, useEffect } from "react"
import { searchCredentialsBySubjectLocalNet } from "../lib/blockchain"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link"

const APP_ID = Number(process.env.NEXT_PUBLIC_APP_ID || 0)

export default function Verify() {
  const { userRole, isLoading } = useAuth()
  const [result, setResult] = useState<string>("")
  const [userCredentials, setUserCredentials] = useState<any[]>([])

  // Auto-load credentials for students
  useEffect(() => {
    if (userRole === 'Student') {
      const studentAddress = localStorage.getItem('studentAddress')
      if (studentAddress) {
        loadStudentCredentials(studentAddress)
      } else {
        setResult('❌ Student address not found. Please log in again.')
      }
    }
  }, [userRole])

  const renderCredentialCard = (cred: any, index: number) => {
    const issuedDate = new Date(cred.issuedAt * 1000).toISOString()
    const expiresDate = new Date(cred.expiresAt * 1000).toISOString()
    const validFromDate = cred.validFrom ? new Date(cred.validFrom).toISOString() : null
    const status = cred.revoked ? "❌ REVOKED" : "✅ ACTIVE"
    
    // Determine card color based on credential type
    const cardColor = cred.credentialType === 'EducationCredential' ? '#e3f2fd' : '#f3e5f5'
    const borderColor = cred.credentialType === 'EducationCredential' ? '#2196f3' : '#9c27b0'
    const icon = cred.credentialType === 'EducationCredential' ? '🎓' : '🛂'
    
    return (
      <div key={index} style={{
        backgroundColor: cardColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '24px', marginRight: '10px' }}>{icon}</span>
          <h3 style={{ margin: 0, color: borderColor, fontSize: '18px' }}>
            {cred.credentialType} (Schema: {cred.schemaCode})
          </h3>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: '600', marginRight: '8px' }}>Status:</span>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              backgroundColor: cred.revoked ? '#ffebee' : '#e8f5e8',
              color: cred.revoked ? '#c62828' : '#2e7d32',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {status}
            </span>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <span style={{ fontWeight: '600' }}>Issuer:</span> 
            <span style={{ marginLeft: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
              {cred.issuer}
            </span>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <span style={{ fontWeight: '600' }}>Issued:</span> 
            <span style={{ marginLeft: '8px' }}>{issuedDate}</span>
          </div>
          
          {validFromDate && (
            <div style={{ marginBottom: '5px' }}>
              <span style={{ fontWeight: '600' }}>Valid From:</span> 
              <span style={{ marginLeft: '8px' }}>{validFromDate}</span>
            </div>
          )}
          
          <div style={{ marginBottom: '5px' }}>
            <span style={{ fontWeight: '600' }}>Expires:</span> 
            <span style={{ marginLeft: '8px' }}>{expiresDate}</span>
          </div>
        </div>
        
        {/* Claim Details */}
        {cred.claim && Object.keys(cred.claim).length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '16px' }}>Details:</h4>
            <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              {cred.credentialType === 'VisaCredential' && (
                <>
                  {cred.claim.visaType && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Visa Type:</span> 
                      <span style={{ marginLeft: '8px' }}>{cred.claim.visaType}</span>
                    </div>
                  )}
                  {cred.claim.country && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Country:</span> 
                      <span style={{ marginLeft: '8px' }}>{cred.claim.country}</span>
                    </div>
                  )}
                  {cred.claim.visaNumber && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Visa Number:</span> 
                      <span style={{ marginLeft: '8px', fontFamily: 'monospace' }}>{cred.claim.visaNumber}</span>
                    </div>
                  )}
                  {cred.claim.issuedBy && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Issued By:</span> 
                      <span style={{ marginLeft: '8px' }}>{cred.claim.issuedBy}</span>
                    </div>
                  )}
                </>
              )}
              {cred.credentialType === 'EducationCredential' && (
                <>
                  {cred.claim.institution && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Institution:</span> 
                      <span style={{ marginLeft: '8px' }}>{cred.claim.institution}</span>
                    </div>
                  )}
                  {cred.claim.degree && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Degree:</span> 
                      <span style={{ marginLeft: '8px' }}>{cred.claim.degree}</span>
                    </div>
                  )}
                  {cred.claim.fieldOfStudy && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Field of Study:</span> 
                      <span style={{ marginLeft: '8px' }}>{cred.claim.fieldOfStudy}</span>
                    </div>
                  )}
                  {cred.claim.graduationYear && (
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>Graduation Year:</span> 
                      <span style={{ marginLeft: '8px' }}>{cred.claim.graduationYear}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        
        {/* NFT Information */}
        {cred.nftAsaId && (
          <div style={{ 
            backgroundColor: '#fff3e0', 
            border: '1px solid #ff9800', 
            borderRadius: '8px', 
            padding: '12px',
            marginTop: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px', marginRight: '8px' }}>🎨</span>
              <h4 style={{ margin: 0, color: '#e65100', fontSize: '16px' }}>Commemorative NFT</h4>
            </div>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Asset ID:</span> 
                <span style={{ marginLeft: '8px', fontFamily: 'monospace' }}>{cred.nftAsaId}</span>
              </div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Unit Name:</span> 
                <span style={{ marginLeft: '8px' }}>CRD</span>
              </div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: '600' }}>Asset Name:</span> 
                <span style={{ marginLeft: '8px', fontFamily: 'monospace' }}>CRD-{cred.credentialId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const loadStudentCredentials = async (address: string) => {
    try {
      const credentials = await searchCredentialsBySubjectLocalNet(address)
      
      if (credentials.length === 0) {
        setResult(`🔍 No credentials found for student address: ${address}`)
        setUserCredentials([])
        return
      }

      // Store credentials for card display
      setUserCredentials(credentials)
      setResult(`🔍 Found ${credentials.length} credential(s) for student: ${address}`)
      
    } catch (err: any) {
      setResult(`❌ Error loading student credentials: ${err.message}`)
      setUserCredentials([])
    }
  }

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
               setResult(`🔍 No credentials found for: ${subjectAddress}\n\nThis address has no issued credentials on the blockchain.`)
               setUserCredentials([])
        return
      }

             // Store credentials for card display
             setUserCredentials(credentials)
             setResult(`🔍 Found ${credentials.length} credential(s) for: ${subjectAddress}`)
      
    } catch (err: any) {
      setResult(`❌ Error searching: ${err.message}`)
    }
  }


  return (
    <Layout>
      <div style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
        {isLoading ? (
          <div style={{padding: "20px", textAlign: "center"}}>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div style={{marginBottom: "20px"}}>
                     <Link href="/" style={{
                       display: "inline-flex",
                       alignItems: "center",
                       padding: "10px 20px",
                       backgroundColor: "#f8f9fa",
                       color: "#495057",
                       textDecoration: "none",
                       borderRadius: "8px",
                       border: "1px solid #dee2e6",
                       fontSize: "14px",
                       fontWeight: "500",
                       transition: "all 0.2s ease",
                       boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                     }}>
                       ← Back to Home
                     </Link>
            </div>
            
            <h1>{userRole === 'Student' ? 'My Credentials' : 'Verify Credential'}</h1>
        
        {userRole === 'Student' ? (
          <div>
            <h2>Your Credentials</h2>
            <p>Here are all your issued credentials. You can also view your commemorative NFTs.</p>
      
      <div style={{marginBottom: "20px"}}>
                     <Link href="/wallet" style={{
                       padding: "12px 24px", 
                       backgroundColor: "#6f42c1", 
                       color: "white", 
                       textDecoration: "none", 
                       borderRadius: "8px",
                       fontSize: "14px",
                       fontWeight: "500",
                       transition: "all 0.2s ease",
                       boxShadow: "0 2px 4px rgba(111,66,193,0.2)"
                     }}>
                       🎨 View My NFTs
                     </Link>
        </div>
      </div>
        ) : (
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
                style={{
                  width: "100%", 
                  padding: "12px", 
                  marginTop: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box"
                }}
              />
            </div>
                     <button 
                       type="submit"
                       style={{
                         backgroundColor: "#28a745",
                         color: "white",
                         border: "none",
                         padding: "12px 24px",
                         borderRadius: "8px",
                         cursor: "pointer",
                         fontSize: "14px",
                         fontWeight: "500",
                         transition: "all 0.2s ease",
                         boxShadow: "0 2px 4px rgba(40,167,69,0.2)"
                       }}
                     >
                       Search User Credentials
                     </button>
          </form>
        </div>
      )}
      
      {result && (
        <div style={{
          marginTop: "20px", 
          padding: "15px", 
                   backgroundColor: result.includes("✅") || result.includes("Found") ? "#d4edda" : "#f8d7da",
                   border: `1px solid ${result.includes("✅") || result.includes("Found") ? "#c3e6cb" : "#f5c6cb"}`,
                   borderRadius: "5px",
                   marginBottom: "20px"
        }}>
          <pre style={{whiteSpace: "pre-wrap", margin: 0}}>{result}</pre>
        </div>
      )}
      
               {/* Credential Cards */}
               {userCredentials.length > 0 && (
                 <div style={{ marginTop: "20px" }}>
                   {userCredentials.map((cred, index) => renderCredentialCard(cred, index))}
                 </div>
               )}
          </>
        )}
      </div>
    </Layout>
  )
}