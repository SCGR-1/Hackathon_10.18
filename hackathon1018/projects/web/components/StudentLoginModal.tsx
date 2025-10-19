import React from 'react'
import { GraduationCap } from 'lucide-react'

interface StudentLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (address: string) => void
  studentAddress: string
  setStudentAddress: (address: string) => void
  isDarkMode: boolean
}

export default function StudentLoginModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  studentAddress, 
  setStudentAddress, 
  isDarkMode 
}: StudentLoginModalProps) {
  if (!isOpen) return null

  const handleLogin = () => {
    if (studentAddress.trim()) {
      onLogin(studentAddress.trim())
    }
  }

  const handleClose = () => {
    setStudentAddress('')
    onClose()
  }

  return (
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
      zIndex: 1001
    }}>
      <div style={{
        backgroundColor: isDarkMode ? '#2d1b69' : 'white',
        padding: '2rem',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            margin: 0,
            color: isDarkMode ? '#ffffff' : '#1f2937',
            fontSize: '1.5rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <GraduationCap size={24} />
            Student Login
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: isDarkMode ? '#ffffff' : '#1f2937',
            fontWeight: '500'
          }}>
            Student Algorand Address:
          </label>
          <input
            type="text"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            placeholder="Enter your Algorand address"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '8px',
              backgroundColor: isDarkMode ? '#374151' : 'white',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleLogin}
            disabled={!studentAddress.trim()}
            style={{
              padding: '12px 24px',
              backgroundColor: studentAddress.trim() ? '#8b5cf6' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: studentAddress.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Login as Student
          </button>
          
          <button
            onClick={handleClose}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
