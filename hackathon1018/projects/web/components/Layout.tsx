import { useState } from 'react'
import Link from 'next/link'
import { useAuth, UserRole } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { userRole, login, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogin = (role: UserRole) => {
    login(role)
    setShowLoginModal(false)
  }

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
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Log In
              </button>
            )}
            
            {userRole && (
              <button
                onClick={logout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
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
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
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
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
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
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a32a3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6f42c1'}
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
    </div>
  )
}
