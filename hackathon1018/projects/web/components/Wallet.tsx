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
  const { userRole, isLoading } = useAuth()
  const [userAddress, setUserAddress] = useState('')
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoadingNfts, setIsLoadingNfts] = useState(false)
  const [result, setResult] = useState('')

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
            credentialType: cred.schemaCode === 1 ? 'VisaCredential' : 'EducationCredential',
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
    return type === 'VisaCredential' ? '🛂' : '🎓'
  }

  const getCredentialTypeColor = (type: string) => {
    return type === 'VisaCredential' ? '#007bff' : '#28a745'
  }

  return (
    <Layout>
      <div style={{maxWidth: 1000, margin: "40px auto", fontFamily: "ui-sans-serif"}}>
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
            
            <h1>My NFTs</h1>
            <p style={{color: "#666", marginBottom: "30px"}}>
              View your commemorative credential NFTs. Enter your Algorand address to see all NFTs you've received from issued credentials.
            </p>

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
                             disabled={isLoadingNfts}
                             style={{
                               backgroundColor: isLoadingNfts ? "#ccc" : "#6f42c1",
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

            {result && (
              <div style={{
                marginBottom: "20px", 
                padding: "15px", 
                backgroundColor: result.includes("✅") ? "#d4edda" : (result.includes("🔍") ? "#fff3cd" : "#f8d7da"),
                border: `1px solid ${result.includes("✅") ? "#c3e6cb" : (result.includes("🔍") ? "#ffeaa7" : "#f5c6cb")}`,
                borderRadius: "5px"
              }}>
                <p style={{margin: 0, fontWeight: "500"}}>{result}</p>
              </div>
            )}

            {nfts.length > 0 && (
              <div>
                <h2 style={{marginBottom: "20px"}}>Your NFTs ({nfts.length})</h2>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px"
                }}>
                  {nfts.map((nft, index) => (
                    <div 
                      key={nft.assetId}
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #e9ecef",
                        borderRadius: "10px",
                        padding: "20px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s, box-shadow 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)"
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
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
                            color: "#666",
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
                          {nft.credentialType === 'VisaCredential' ? 'Visa Credential' : 'Education Credential'}
                        </div>
                      </div>

                      <div style={{
                        fontSize: "14px",
                        color: "#666",
                        lineHeight: "1.5"
                      }}>
                        <div style={{marginBottom: "8px"}}>
                          <strong>Credential ID:</strong> {nft.credentialId}
                        </div>
                        <div style={{marginBottom: "8px"}}>
                          <strong>Issued:</strong> {formatDate(nft.issuedAt)}
                        </div>
                        <div style={{marginBottom: "8px"}}>
                          <strong>Expires:</strong> {formatDate(nft.expiresAt)}
                        </div>
                        <div style={{marginBottom: "8px"}}>
                          <strong>Issuer:</strong> {nft.issuer.slice(0, 8)}...{nft.issuer.slice(-8)}
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
    </Layout>
  )
}
