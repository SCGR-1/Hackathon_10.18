import { useState, useEffect } from "react"
import { searchCredentialsBySubjectLocalNet, revokeCredential } from "../lib/blockchain"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link"

const APP_ID = Number(process.env.NEXT_PUBLIC_APP_ID || 0)

export default function Verify() {
  const { userRole, isLoading, isDarkMode } = useAuth()
  const [result, setResult] = useState<string>("")
  const [userCredentials, setUserCredentials] = useState<any[]>([])
  const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false)
  const [credentialToRevoke, setCredentialToRevoke] = useState<any>(null)
  const [isRevoking, setIsRevoking] = useState<boolean>(false)
  const [filterType, setFilterType] = useState<'All' | 'Education' | 'Visa' | 'Employment'>('All')

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
    
    // Determine status based on revocation, start time, and expiration
    let status = "ACTIVE"
    if (cred.revoked) {
      status = "REVOKED"
    } else if (cred.validFrom && Date.now() < new Date(cred.validFrom).getTime()) {
      status = "PENDING"
    } else if (cred.credentialType === 'VisaCredential' && Date.now() > cred.expiresAt * 1000) {
      status = "EXPIRED"
    } else if ((cred.credentialType === 'EducationCredential' || cred.credentialType === 'EmploymentCredential') && Date.now() > cred.expiresAt * 1000) {
      status = "COMPLETED"
    }
    
    // Determine card color based on credential type and dark mode
    const cardColor = cred.credentialType === 'EducationCredential' 
      ? (isDarkMode ? '#1e3a8a' : '#e3f2fd') 
      : cred.credentialType === 'VisaCredential'
      ? (isDarkMode ? '#581c87' : '#f3e5f5')
      : (isDarkMode ? '#7c2d12' : '#fef3c7')
    const borderColor = cred.credentialType === 'EducationCredential' ? '#2196f3' : cred.credentialType === 'VisaCredential' ? '#9c27b0' : '#f59e0b'
    const icon = cred.credentialType === 'EducationCredential' ? '🎓' : cred.credentialType === 'VisaCredential' ? '🛂' : '💼'
    
      return (
        <div key={index} style={{
         backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
         border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
         borderRadius: '12px',
         padding: '24px',
         marginBottom: '20px',
         boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)',
         transition: 'all 0.3s ease',
         position: 'relative',
         overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
         e.currentTarget.style.transform = 'translateY(-2px)'
         e.currentTarget.style.boxShadow = isDarkMode ? '0 8px 25px rgba(0,0,0,0.15)' : '0 8px 25px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
         e.currentTarget.style.transform = 'translateY(0)'
         e.currentTarget.style.boxShadow = isDarkMode ? '0 4px 6px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)'
        }}>
        {/* Header with accent line and status badge */}
        <div style={{ 
          borderLeft: `4px solid ${borderColor}`,
          paddingLeft: '16px',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>{icon}</span>
              <h3 style={{ 
                margin: 0, 
                color: isDarkMode ? '#ffffff' : '#1f2937', 
                fontSize: '20px',
                fontWeight: '600'
              }}>
                {cred.credentialType === 'EducationCredential' ? 'Education Credential' : cred.credentialType === 'VisaCredential' ? 'Visa Credential' : 'Employment Credential'}
              </h3>
            </div>
            
            {/* Status Badge - Top Right */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: status === 'REVOKED'
                ? (isDarkMode ? '#7f1d1d' : '#fee2e2') 
                : status === 'PENDING'
                ? (isDarkMode ? '#581c87' : '#e9d5ff')
                : status === 'EXPIRED'
                ? (isDarkMode ? '#7c2d12' : '#fed7aa')
                : status === 'COMPLETED'
                ? (isDarkMode ? '#7c2d12' : '#fed7aa')
                : (isDarkMode ? '#14532d' : '#dcfce7'),
              color: status === 'REVOKED'
                ? (isDarkMode ? '#fca5a5' : '#dc2626') 
                : status === 'PENDING'
                ? (isDarkMode ? '#c4b5fd' : '#7c3aed')
                : status === 'EXPIRED'
                ? (isDarkMode ? '#fed7aa' : '#ea580c')
                : status === 'COMPLETED'
                ? (isDarkMode ? '#fed7aa' : '#ea580c')
                : (isDarkMode ? '#86efac' : '#16a34a'),
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span style={{ marginRight: '0' }}>
              </span>
              {status}
            </div>
          </div>
        </div>
        {/* Unified Information Section */}
        <div style={{ 
          padding: '20px',
          backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
          marginBottom: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Credential ID */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                Credential ID
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: isDarkMode ? '#d1d5db' : '#374151',
                fontWeight: '500',
                wordBreak: 'break-all'
              }}>
                {cred.credentialId}
              </div>
            </div>
            
            {/* Credential Details */}
            {cred.claim && Object.keys(cred.claim).length > 0 && (
              <>
                {cred.credentialType === 'VisaCredential' && (
                  <>
                    {cred.claim.visaType && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Visa Type
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.visaType}
                        </div>
                      </div>
                    )}
                    {cred.claim.country && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Country
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.country}
                        </div>
                      </div>
                    )}
                    {cred.claim.visaNumber && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Visa Number
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500',
                          fontFamily: 'monospace'
                        }}>
                          {cred.claim.visaNumber}
                        </div>
                      </div>
                    )}
                    {cred.claim.issuedBy && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Issued By
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.issuedBy}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {cred.credentialType === 'EducationCredential' && (
                  <>
                    {cred.claim.institution && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Institution
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.institution}
                        </div>
                      </div>
                    )}
                    {cred.claim.degree && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Degree
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.degree}
                        </div>
                      </div>
                    )}
                    {cred.claim.fieldOfStudy && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Field of Study
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.fieldOfStudy}
                        </div>
                      </div>
                    )}
                    {cred.claim.graduationYear && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Graduation Year
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.graduationYear}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {cred.credentialType === 'EmploymentCredential' && (
                  <>
                    {cred.claim.company && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Company
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.company}
                        </div>
                      </div>
                    )}
                    {cred.claim.position && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Position
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.position}
                        </div>
                      </div>
                    )}
                    {cred.claim.department && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Department
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.department}
                        </div>
                      </div>
                    )}
                    {cred.claim.salary && (
                      <div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Salary
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isDarkMode ? '#d1d5db' : '#374151',
                          fontWeight: '500'
                        }}>
                          {cred.claim.salary}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Start Date */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                Start Date
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: isDarkMode ? '#d1d5db' : '#374151'
              }}>
                {validFromDate || issuedDate}
              </div>
            </div>
            
            {/* End Date */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                End Date
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: isDarkMode ? '#d1d5db' : '#374151'
              }}>
                {expiresDate}
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Revoke Button */}
        {canRevokeCredential(cred) && (
          <div style={{ 
            marginTop: '20px', 
            paddingTop: '20px',
            borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => handleRevokeClick(cred)}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,38,38,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(220,38,38,0.3)'
              }}
            >
              🚫 Revoke Credential
            </button>
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

  const handleRevokeClick = (credential: any) => {
    setCredentialToRevoke(credential)
    setShowRevokeModal(true)
  }

  const handleRevokeConfirm = async () => {
    if (!credentialToRevoke) return
    
    setIsRevoking(true)
    try {
      await revokeCredential(credentialToRevoke.credentialId)
      
      // Refresh credentials
      if (userRole === 'Student') {
        const studentAddress = localStorage.getItem('studentAddress')
        if (studentAddress) {
          await loadStudentCredentials(studentAddress)
        }
      } else {
        // For non-students, refresh the current search
        const currentAddress = (document.querySelector('input[placeholder*="student Algorand address"]') as HTMLInputElement)?.value ||
                              (document.querySelector('input[placeholder*="Algorand address"]') as HTMLInputElement)?.value
        if (currentAddress) {
          await loadStudentCredentials(currentAddress)
        }
      }
      
      setResult(`✅ Credential "${credentialToRevoke.credentialId}" has been revoked successfully`)
      setShowRevokeModal(false)
      setCredentialToRevoke(null)
    } catch (error) {
      console.error('Error revoking credential:', error)
      setResult(`❌ Failed to revoke credential: ${error}`)
    } finally {
      setIsRevoking(false)
    }
  }

  const canRevokeCredential = (credential: any) => {
    if (credential.revoked) return false
    if (userRole === 'Institution' && credential.credentialType === 'EducationCredential') return true
    if (userRole === 'Authority' && credential.credentialType === 'VisaCredential') return true
    if (userRole === 'Employer' && credential.credentialType === 'EmploymentCredential') return true
    return false
  }

  const getFilteredCredentials = () => {
    if (filterType === 'All') return userCredentials
    if (filterType === 'Education') return userCredentials.filter(cred => cred.credentialType === 'EducationCredential')
    if (filterType === 'Visa') return userCredentials.filter(cred => cred.credentialType === 'VisaCredential')
    if (filterType === 'Employment') return userCredentials.filter(cred => cred.credentialType === 'EmploymentCredential')
    return userCredentials
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
      {/* Main Card Container */}
      <div style={{maxWidth:720, margin:"0 auto", fontFamily:"ui-sans-serif", backgroundColor: isDarkMode ? '#2d1b69' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: isDarkMode ? '#ffffff' : 'inherit'}}>
        {isLoading ? (
          <div style={{padding: "20px", textAlign: "center"}}>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            
            {userRole === 'Student' ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  backgroundColor: isDarkMode ? '#2d1b69' : '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h1 style={{
                    margin: 0,
                    color: isDarkMode ? '#ffffff' : '#1f2937',
                    fontSize: '28px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    My Credentials {getFilteredCredentials().length > 0 && `(${getFilteredCredentials().length})`}
                  </h1>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  backgroundColor: isDarkMode ? '#2d1b69' : '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  border: 'none'
                }}>
                  <h1 style={{
                    margin: 0,
                    color: isDarkMode ? '#ffffff' : '#1f2937',
                    fontSize: '28px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    Verify Credential
                  </h1>
                </div>

              </div>
            )}
        
        {userRole === 'Student' ? (
        <div>
          {/* Filter Buttons */}
          <div style={{ 
            marginBottom: '20px', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
              padding: '4px',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {(['All', 'Education', 'Visa', 'Employment'] as const).map((type) => (
          <button 
                  key={type}
                  onClick={() => setFilterType(type)}
            style={{
                    padding: '8px 16px',
                    backgroundColor: filterType === type 
                      ? (isDarkMode ? '#8b5cf6' : '#7c3aed') 
                      : 'transparent',
                    color: filterType === type 
                      ? '#ffffff' 
                      : (isDarkMode ? '#ffffff' : '#374151'),
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: filterType === type 
                      ? '0 2px 4px rgba(124,58,237,0.3)' 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (filterType !== type) {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterType !== type) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {type}
          </button>
              ))}
            </div>
        </div>
      </div>
        ) : (
        <div>
          <form onSubmit={handleSearch}>
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginBottom: "10px"
            }}>
              <input 
                type="text" 
                name="address"
                placeholder="Enter Algorand address..."
                style={{
                  flex: 1,
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
              <button 
                type="submit"
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(139,92,246,0.2)",
                  whiteSpace: "nowrap"
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Buttons for Admins - Only show after search */}
          {userCredentials.length > 0 && (
            <div style={{
              backgroundColor: isDarkMode ? '#2d1b69' : '#f8f9fa',
              padding: '20px 20px 10px 20px',
              borderRadius: '12px',
              marginBottom: '10px',
              border: 'none',
              textAlign: 'center'
            }}>
              <div style={{ 
                marginBottom: '20px', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                  padding: '4px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {(['All', 'Education', 'Visa', 'Employment'] as const).map((type) => (
          <button 
                      key={type}
                      onClick={() => setFilterType(type)}
            style={{
                        padding: '8px 16px',
                        backgroundColor: filterType === type 
                          ? (isDarkMode ? '#8b5cf6' : '#7c3aed') 
                          : 'transparent',
                        color: filterType === type 
                          ? '#ffffff' 
                          : (isDarkMode ? '#ffffff' : '#374151'),
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: filterType === type 
                          ? '0 2px 4px rgba(124,58,237,0.3)' 
                          : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (filterType !== type) {
                          e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (filterType !== type) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      {type}
          </button>
                  ))}
                </div>
              </div>
        </div>
          )}
        </div>
      )}
      
      
               {/* Credential Cards */}
               {getFilteredCredentials().length > 0 && (
                 <div style={{ marginTop: "20px" }}>
                   {getFilteredCredentials().map((cred, index) => renderCredentialCard(cred, index))}
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
      
      {/* Revoke Confirmation Modal */}
      {showRevokeModal && credentialToRevoke && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowRevokeModal(false)}>
          <div style={{
            backgroundColor: isDarkMode ? '#2d1b69' : 'white',
            color: isDarkMode ? '#ffffff' : '#000000',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#dc3545' }}>
              🚫 Confirm Credential Revocation
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px', color: isDarkMode ? '#ffffff' : '#000000' }}>
                <strong>Are you sure you want to revoke this credential?</strong>
              </p>
              <div style={{ 
                backgroundColor: isDarkMode ? '#374151' : '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#dee2e6'}`
              }}>
                <p style={{ margin: '0 0 8px 0', color: isDarkMode ? '#ffffff' : '#000000' }}>
                  <strong>Credential ID:</strong> {credentialToRevoke.credentialId}
                </p>
                <p style={{ margin: '0 0 8px 0', color: isDarkMode ? '#ffffff' : '#000000' }}>
                  <strong>Type:</strong> {credentialToRevoke.credentialType}
                </p>
                <p style={{ margin: '0 0 8px 0', color: isDarkMode ? '#ffffff' : '#000000', wordBreak: 'break-all' }}>
                  <strong>Subject:</strong> {credentialToRevoke.subject}
                </p>
                {credentialToRevoke.claim && (
                  <p style={{ margin: '0', color: isDarkMode ? '#ffffff' : '#000000' }}>
                    <strong>Details:</strong> {JSON.stringify(credentialToRevoke.claim, null, 2)}
                  </p>
                )}
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: isDarkMode ? '#451a03' : '#fff3cd', 
              border: `1px solid ${isDarkMode ? '#92400e' : '#ffeaa7'}`, 
              borderRadius: '8px', 
              padding: '15px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, color: isDarkMode ? '#fbbf24' : '#856404' }}>
                <strong>⚠️ Warning:</strong> This action cannot be undone. The credential will be permanently marked as revoked.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowRevokeModal(false)}
                disabled={isRevoking}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isRevoking ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: isRevoking ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeConfirm}
                disabled={isRevoking}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isRevoking ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isRevoking ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {isRevoking ? '🔄 Revoking...' : '🚫 Yes, Revoke Credential'}
              </button>
            </div>
          </div>
      </div>
      )}
    </Layout>
  )
}