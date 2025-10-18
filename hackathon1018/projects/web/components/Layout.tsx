import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth, UserRole } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { userRole, login, logout } = useAuth()
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

  const handleStudentLogin = () => {
    if (studentAddress.trim()) {
      // Store the student address in localStorage for this session
      localStorage.setItem('studentAddress', studentAddress.trim())
      login('Student')
      setShowStudentModal(false)
      setShowLoginModal(false) // Also close the main login modal
      setStudentAddress('')
    }
  }

  // Auto-fill student address from environment variable
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STUDENT_ADDRESS) {
      setStudentAddress(process.env.NEXT_PUBLIC_STUDENT_ADDRESS)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#333' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>EduChain</h1>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {userRole && (
              <span style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#e3f2fd', 
                color: '#1976d2',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Logged in as: {userRole}
              </span>
            )}
            
            {!userRole && (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,112,243,0.2)'
                }}
              >
                Log In
              </button>
            )}
            
            {userRole && (
              <button
                onClick={logout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(220,53,69,0.2)'
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {children}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          style={{
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
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              maxWidth: '400px',
              width: '90%',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6c757d',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Select Your Role</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => handleLogin('Institution')}
                style={{
                  padding: '1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(40,167,69,0.2)'
                }}
              >
                🏫 Institution
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
                  Issue Education Credentials
                </div>
              </button>
              
              <button
                onClick={() => handleLogin('Authority')}
                style={{
                  padding: '1rem',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,112,243,0.2)'
                }}
              >
                🏛️ Authority
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
                  Issue Visa Credentials
                </div>
              </button>
              
              <button
                onClick={() => handleLogin('Student')}
                style={{
                  padding: '1rem',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(111,66,193,0.2)'
                }}
              >
                🎓 Student
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
                  Verify Credentials Only
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Login Modal */}
      {showStudentModal && (
        <div 
          style={{
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
          }}
          onClick={() => setShowStudentModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              maxWidth: '400px',
              width: '90%',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStudentModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6c757d',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center', color: '#6f42c1' }}>
              🎓 Student Login
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Your Algorand Address:
              </label>
              <input
                type="text"
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                placeholder="Enter your Algorand address..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '0.25rem', display: 'block' }}>
                This address will be used to load your credentials and NFTs
              </small>
            </div>
            
            <button
              onClick={handleStudentLogin}
              disabled={!studentAddress.trim()}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: studentAddress.trim() ? '#6f42c1' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: studentAddress.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                boxShadow: studentAddress.trim() ? '0 2px 4px rgba(111,66,193,0.2)' : 'none'
              }}
            >
              🎓 Login as Student
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
