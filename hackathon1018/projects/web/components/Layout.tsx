import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth, UserRole } from '../contexts/AuthContext'
import { Sun, Moon } from 'lucide-react'
import LoginModal from './LoginModal'
import StudentLoginModal from './StudentLoginModal'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { userRole, login, logout, isDarkMode, toggleDarkMode } = useAuth()
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
    // Store the student address in localStorage for this session
    localStorage.setItem('studentAddress', address)
    login('Student')
    setShowStudentModal(false)
    setShowLoginModal(false) // Also close the main login modal
    setStudentAddress('')
  }

  // Auto-fill student address from environment variable
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STUDENT_ADDRESS) {
      setStudentAddress(process.env.NEXT_PUBLIC_STUDENT_ADDRESS)
    }
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: isDarkMode ? '#1a0b2e' : '#f8f9fa',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#312e81',
        borderBottom: '1px solid #4c1d95',
        padding: '1rem 0',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
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
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(139,92,246,0.3)'
                  }}
                >
                  Log In
                </button>
                
                {/* Dark Mode Toggle - Next to Login */}
                <button
                  onClick={toggleDarkMode}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: isDarkMode ? '#6366f1' : '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode ? '0 4px 12px rgba(99,102,241,0.4)' : '0 4px 12px rgba(31,41,55,0.4)',
                    marginLeft: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '48px',
                    height: '48px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                    e.currentTarget.style.boxShadow = isDarkMode ? '0 6px 16px rgba(99,102,241,0.6)' : '0 6px 16px rgba(31,41,55,0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = isDarkMode ? '0 4px 12px rgba(99,102,241,0.4)' : '0 4px 12px rgba(31,41,55,0.4)'
                  }}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </>
            )}
            
            {userRole && (
              <>
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
                
                {/* Dark Mode Toggle - Next to Logout */}
                <button
                  onClick={toggleDarkMode}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: isDarkMode ? '#6366f1' : '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode ? '0 4px 12px rgba(99,102,241,0.4)' : '0 4px 12px rgba(31,41,55,0.4)',
                    marginLeft: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '48px',
                    height: '48px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                    e.currentTarget.style.boxShadow = isDarkMode ? '0 6px 16px rgba(99,102,241,0.6)' : '0 6px 16px rgba(31,41,55,0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = isDarkMode ? '0 4px 12px rgba(99,102,241,0.4)' : '0 4px 12px rgba(31,41,55,0.4)'
                  }}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem 60px 1rem',
        backgroundColor: isDarkMode ? '#1a0b2e' : 'transparent',
        color: isDarkMode ? '#ffffff' : 'inherit'
      }}>
        {children}
      </main>

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
    </div>
  )
}
