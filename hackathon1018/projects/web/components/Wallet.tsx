import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Layout from './Layout'
import Link from 'next/link'

interface NFT {
  assetId: number
  assetName: string
  unitName: string
  metadataUrl: string
  credentialId: string
  credentialType: string
  issuer: string
  subject: string
  issuedAt: string
  expiresAt: string
}

export default function Wallet() {
  const { userRole, isLoading, isDarkMode } = useAuth()
  const [userAddress, setUserAddress] = useState('')
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoadingNfts, setIsLoadingNfts] = useState(false)
  const [result, setResult] = useState('')
  const [filterType, setFilterType] = useState<'All' | 'Education' | 'Visa' | 'Employment'>('All')

  // Auto-load NFTs for students
  useEffect(() => {
    if (userRole === 'Student') {
      const studentAddress = localStorage.getItem('studentAddress')
      if (studentAddress) {
        setUserAddress(studentAddress)
        loadNFTs(studentAddress)
      } else {
        setResult('❌ Student address not found. Please log in again.')
      }
    }
  }, [userRole])

  // Load NFTs from localStorage (LocalNet simulation)
  const loadNFTs = async (address: string) => {
    if (!address.trim()) {
      setResult('❌ Please enter an Algorand address')
      return
    }

    setIsLoadingNfts(true)
    setResult('')

    try {
      // In LocalNet mode, we'll get NFTs from the credential data
      const storedCredentials = localStorage.getItem('localnet_credentials')
      if (!storedCredentials) {
        setNfts([])
        setResult('🔍 No NFTs found for this address')
        return
      }

      const credentials = JSON.parse(storedCredentials)
      const userNFTs: NFT[] = []

      // Find credentials issued to this address that have NFTs
      Object.values(credentials).forEach((cred: any) => {
        if (cred.subject === address && cred.nftAsaId) {
          userNFTs.push({
            assetId: cred.nftAsaId,
            assetName: `CRD-${cred.credentialId}`,
            unitName: 'CRD',
            metadataUrl: `https://educhain.app/nft/${cred.credentialId}`,
            credentialId: cred.credentialId,
            credentialType: cred.schemaCode === 1 ? 'VisaCredential' : cred.schemaCode === 2 ? 'EducationCredential' : 'EmploymentCredential',
            issuer: cred.issuer || 'Unknown',
            subject: cred.subject,
            issuedAt: new Date(cred.issuedAt * 1000).toISOString(),
            expiresAt: new Date(cred.expiresAt * 1000).toISOString()
          })
        }
      })

      setNfts(userNFTs)
      
      if (userNFTs.length === 0) {
        setResult('🔍 No NFTs found for this address')
      } else {
        setResult(`✅ Found ${userNFTs.length} NFT(s) for ${address}`)
      }

    } catch (error) {
      setResult(`❌ Error loading NFTs: ${error}`)
    } finally {
      setIsLoadingNfts(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadNFTs(userAddress)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCredentialTypeIcon = (type: string) => {
    if (type === 'VisaCredential') return '🛂'
    if (type === 'EducationCredential') return '🎓'
    if (type === 'EmploymentCredential') return '💼'
    return '📄'
  }

  const getCredentialTypeColor = (type: string) => {
    if (type === 'VisaCredential') return '#007bff'
    if (type === 'EducationCredential') return '#28a745'
    if (type === 'EmploymentCredential') return '#f59e0b'
    return '#6c757d'
  }

  const getFilteredNFTs = () => {
    if (filterType === 'All') return nfts
    if (filterType === 'Education') return nfts.filter(nft => nft.credentialType === 'EducationCredential')
    if (filterType === 'Visa') return nfts.filter(nft => nft.credentialType === 'VisaCredential')
    if (filterType === 'Employment') return nfts.filter(nft => nft.credentialType === 'EmploymentCredential')
    return nfts
  }

  return (
    <Layout>
      {/* Main Card Container */}
      <div style={{maxWidth: 1000, margin: "0 auto", fontFamily: "ui-sans-serif", backgroundColor: isDarkMode ? '#2d1b69' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: isDarkMode ? '#ffffff' : 'inherit'}}>
        {isLoading ? (
          <div style={{padding: "20px", textAlign: "center"}}>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            
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
                  My NFTs {getFilteredNFTs().length > 0 && `(${getFilteredNFTs().length})`}
                </h1>
              </div>
            </div>

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

                   {userRole !== 'Student' && (
                     <div style={{
                       backgroundColor: "#f8f9fa",
                       padding: "20px",
                       borderRadius: "10px",
                       marginBottom: "30px",
                       border: "1px solid #e9ecef"
                     }}>
                       <div>
                         <h3 style={{marginTop: 0}}>🔍 Find My NFTs</h3>
                         <form onSubmit={handleSearch}>
                           <div style={{marginBottom: "15px"}}>
                             <label style={{display: "block", marginBottom: "5px", fontWeight: "500"}}>
                               Your Algorand Address:
                             </label>
                             <input 
                               type="text" 
                               value={userAddress}
                               onChange={(e) => setUserAddress(e.target.value)}
                               placeholder="Enter your Algorand address to find your NFTs..."
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
                           <button 
                             type="submit"
                             disabled={isLoadingNfts}
                             style={{
                               backgroundColor: isLoadingNfts ? "#ccc" : "#7c3aed",
                               color: "white",
                               border: "none",
                               padding: "12px 24px",
                               borderRadius: "8px",
                               cursor: isLoadingNfts ? "not-allowed" : "pointer",
                               fontSize: "14px",
                               fontWeight: "500",
                               transition: "all 0.2s ease",
                               boxShadow: isLoadingNfts ? "none" : "0 2px 4px rgba(111,66,193,0.2)"
                             }}
                           >
                             {isLoadingNfts ? "🔍 Searching..." : "🔍 Find My NFTs"}
                           </button>
                         </form>
                       </div>
                     </div>
                   )}


            {getFilteredNFTs().length > 0 && (
              <div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {getFilteredNFTs().map((nft, index) => (
                    <div 
                      key={nft.assetId}
                      style={{
                        backgroundColor: isDarkMode ? '#1f2937' : 'white',
                        border: isDarkMode ? '1px solid #374151' : '1px solid #e9ecef',
                        borderRadius: "10px",
                        padding: "20px",
                        boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                        transition: "transform 0.2s, box-shadow 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = isDarkMode ? '0 4px 8px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.15)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px"
                      }}>
                        <div style={{
                          fontSize: "24px",
                          marginRight: "10px"
                        }}>
                          {getCredentialTypeIcon(nft.credentialType)}
                        </div>
                        <div>
                          <h3 style={{
                            margin: 0,
                            fontSize: "18px",
                            color: getCredentialTypeColor(nft.credentialType)
                          }}>
                            {nft.assetName}
                          </h3>
                          <p style={{
                            margin: 0,
                            fontSize: "12px",
                            color: isDarkMode ? '#9ca3af' : '#666',
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}>
                            {nft.unitName} • Asset ID: {nft.assetId}
                          </p>
                        </div>
                      </div>

                      <div style={{marginBottom: "15px"}}>
                        <div style={{
                          backgroundColor: getCredentialTypeColor(nft.credentialType),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "inline-block"
                        }}>
                          {nft.credentialType === 'VisaCredential' ? 'Visa Credential' : nft.credentialType === 'EducationCredential' ? 'Education Credential' : 'Employment Credential'}
                        </div>
                      </div>

                      <div style={{
                        fontSize: "14px",
                        color: isDarkMode ? '#d1d5db' : '#666',
                        lineHeight: "1.5"
                      }}>
                        <div style={{marginBottom: "8px"}}>
                          <strong style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>Credential ID:</strong> {nft.credentialId}
                        </div>
                        <div style={{marginBottom: "8px"}}>
                          <strong style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>Start Date:</strong> {formatDate(nft.issuedAt)}
                        </div>
                        <div style={{marginBottom: "8px"}}>
                          <strong style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>End Date:</strong> {formatDate(nft.expiresAt)}
                        </div>
                        <div style={{marginBottom: "8px"}}>
                          <strong style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>Issuer:</strong> {nft.issuer.slice(0, 8)}...{nft.issuer.slice(-8)}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Back Button - At bottom of card */}
      <div style={{maxWidth: 1000, margin: "20px auto 60px", fontFamily: "ui-sans-serif"}}>
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
