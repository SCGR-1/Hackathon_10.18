import Link from 'next/link'
import Layout from '../components/Layout'
import { useAuth, UserRole } from '../contexts/AuthContext'
import { GraduationCap, Shield, Wallet, CheckCircle, Users, Award, Zap, Lock, Globe } from 'lucide-react'
import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import StudentLoginModal from '../components/StudentLoginModal'

export default function Home() {
  const { userRole, isLoading, isDarkMode, login } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [studentAddress, setStudentAddress] = useState('')

  const handleLogin = (role: UserRole) => {
    if (role === 'Student') {
      setShowStudentModal(true)
    } else {
      login(role)
      setShowLoginModal(false)
    }
  }

  const handleStudentLogin = (address: string) => {
    localStorage.setItem('studentAddress', address)
    login('Student')
    setShowStudentModal(false)
    setShowLoginModal(false)
    setStudentAddress('')
  }

  if (isLoading) {
    return (
      <Layout>
        <div style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif", textAlign: "center"}}>
          <p>Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{
        maxWidth: '1400px',
        margin: '20px auto',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: isDarkMode 
          ? '0 20px 40px rgba(0,0,0,0.3)' 
          : '0 20px 40px rgba(0,0,0,0.1)',
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
      }}>
        {/* Hero Section */}
        <div style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a0b2e 0%, #2d1b69 50%, #16213e 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
          padding: '60px 20px',
          textAlign: 'center',
          color: isDarkMode ? '#ffffff' : '#1f2937'
        }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            margin: '0 0 20px 0',
            color: isDarkMode ? '#ffffff' : '#1f2937',
            lineHeight: '1.1',
            textShadow: isDarkMode 
              ? '0 0 20px rgba(139, 92, 246, 0.5)' 
              : '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            EduChain
          </h1>
          <p style={{
            fontSize: '1.5rem',
            margin: '0 0 40px 0',
            opacity: 0.9,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Blockchain-powered credential verification with commemorative NFTs
          </p>
          
          {/* Feature Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginBottom: '50px'
          }}>
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
              padding: '20px',
              borderRadius: '20px',
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`
            }}>
              <Lock size={32} style={{color: '#8b5cf6', marginBottom: '10px'}} />
              <h3 style={{margin: '0 0 8px 0', fontSize: '1.1rem'}}>Secure & Immutable</h3>
              <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.8}}>Blockchain ensures credentials cannot be tampered with</p>
            </div>
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              padding: '20px',
              borderRadius: '20px',
              border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
            }}>
              <Award size={32} style={{color: '#3b82f6', marginBottom: '10px'}} />
              <h3 style={{margin: '0 0 8px 0', fontSize: '1.1rem'}}>NFT Commemoratives</h3>
              <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.8}}>Unique digital collectibles for each credential</p>
            </div>
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
              padding: '20px',
              borderRadius: '20px',
              border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'}`
            }}>
              <Zap size={32} style={{color: '#22c55e', marginBottom: '10px'}} />
              <h3 style={{margin: '0 0 8px 0', fontSize: '1.1rem'}}>Instant Verification</h3>
              <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.8}}>Real-time credential validation</p>
            </div>
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
              padding: '20px',
              borderRadius: '20px',
              border: `1px solid ${isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)'}`
            }}>
              <Globe size={32} style={{color: '#a855f7', marginBottom: '10px'}} />
              <h3 style={{margin: '0 0 8px 0', fontSize: '1.1rem'}}>Global Access</h3>
              <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.8}}>Accessible worldwide on Algorand</p>
            </div>
          </div>

          {/* CTA Buttons */}
          {!userRole ? (
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
              padding: '30px',
              borderRadius: '24px',
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
              maxWidth: '400px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.3rem'}}>Log in</h3>
              <p style={{margin: '0 0 20px 0', opacity: 0.8}}>
                Choose your role to access the credential system
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  padding: '14px 28px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '0 auto',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7c3aed';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#8b5cf6';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                }}
              >
                <Users size={18} />
                Login
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
              padding: '30px',
              borderRadius: '24px',
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.3rem'}}>
                Welcome back!
              </h3>
              <p style={{margin: '0 0 20px 0', opacity: 0.8}}>
                Continue managing credentials and NFTs
              </p>
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {userRole !== 'Student' && (
                  <button
                    onClick={() => window.location.href = '/issuer'}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {userRole === 'Institution' ? <GraduationCap size={16} /> : 
                     userRole === 'Authority' ? <Shield size={16} /> : 
                     <Award size={16} />}
                    Issue {userRole === 'Institution' ? 'Education' : userRole === 'Authority' ? 'Visa' : 'Certification'} Credential
                  </button>
                )}
                <button
                  onClick={() => window.location.href = '/verify'}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle size={16} />
                  Verify Credentials
                </button>
                {userRole === 'Student' && (
                  <button
                    onClick={() => window.location.href = '/wallet'}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Wallet size={16} />
                    My NFTs
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{
        padding: '80px 20px',
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1f2937'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            margin: '0 0 60px 0'
          }}>
            How EduChain Works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            <div style={{
              backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
              padding: '30px',
              borderRadius: '24px',
              textAlign: 'center',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#8b5cf6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Users size={24} color="white" />
              </div>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.3rem'}}>1. Issue Credentials</h3>
              <p style={{margin: 0, opacity: 0.8, lineHeight: '1.6'}}>
                Institutions, authorities, and certifiers issue verified credentials to students and professionals using blockchain technology.
              </p>
            </div>
            
            <div style={{
              backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
              padding: '30px',
              borderRadius: '24px',
              textAlign: 'center',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Award size={24} color="white" />
              </div>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.3rem'}}>2. Mint NFTs</h3>
              <p style={{margin: 0, opacity: 0.8, lineHeight: '1.6'}}>
                Each credential is automatically minted as a unique NFT, creating a digital collectible that commemorates the achievement.
              </p>
            </div>
            
            <div style={{
              backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
              padding: '30px',
              borderRadius: '24px',
              textAlign: 'center',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <CheckCircle size={24} color="white" />
              </div>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.3rem'}}>3. Verify Instantly</h3>
              <p style={{margin: 0, opacity: 0.8, lineHeight: '1.6'}}>
                Anyone can instantly verify the authenticity of credentials using the blockchain, ensuring trust and preventing fraud.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '40px 20px',
        backgroundColor: isDarkMode ? '#111827' : '#f8fafc',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        textAlign: 'center',
        borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <p style={{margin: '0 0 10px 0', fontSize: '0.9rem'}}>
            Powered by Algorand Blockchain
          </p>
          <p style={{margin: 0, fontSize: '0.8rem', opacity: 0.7}}>
            Secure • Immutable • Decentralized
        </p>
      </div>
      </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        isDarkMode={isDarkMode}
      />

      {/* Student Login Modal */}
      <StudentLoginModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onLogin={handleStudentLogin}
        studentAddress={studentAddress}
        setStudentAddress={setStudentAddress}
        isDarkMode={isDarkMode}
      />
    </Layout>
  )
}

