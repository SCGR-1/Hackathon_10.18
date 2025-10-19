import Link from 'next/link'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { userRole, isLoading, isDarkMode } = useAuth()

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
      <div style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif", backgroundColor: isDarkMode ? '#2d1b69' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: isDarkMode ? '#ffffff' : 'inherit', textAlign: 'center'}}>
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
            Student Credential Verification
          </h1>
        </div>
        <p style={{color: isDarkMode ? '#e0e0e0' : 'inherit'}}>Blockchain-based credential verification system with commemorative NFTs using Algorand</p>
        
        {!userRole ? (
          <div style={{marginTop: "40px", padding: "20px", backgroundColor: isDarkMode ? "#3d2a7a" : "#fff3cd", border: isDarkMode ? "1px solid #6366f1" : "1px solid #ffeaa7", borderRadius: "5px"}}>
            <h3 style={{color: isDarkMode ? '#ffffff' : 'inherit'}}>👋 Welcome!</h3>
            <p style={{color: isDarkMode ? '#e0e0e0' : 'inherit'}}>Please log in using the button in the top right to access the system.</p>
          </div>
        ) : (
          <div style={{marginTop: "40px"}}>
            <div style={{display: "flex", gap: "20px", marginTop: "20px", justifyContent: 'center', flexWrap: 'wrap'}}>
              {userRole !== 'Student' && (
                <Link href="/issuer" style={{
                  padding: "12px 24px", 
                  backgroundColor: "#8b5cf6", 
                  color: "white", 
                  textDecoration: "none", 
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(139,92,246,0.3)"
                }}>
                  Issue {userRole === 'Institution' ? 'Education' : userRole === 'Authority' ? 'Visa' : 'Employment'} Credential
                </Link>
              )}
              
              <Link href="/verify" style={{
                padding: "12px 24px", 
                backgroundColor: "#7c3aed", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(124,58,237,0.3)"
              }}>
                Verify Credential
              </Link>
              
              {userRole === 'Student' && (
                <Link href="/wallet" style={{
                  padding: "12px 24px", 
                  backgroundColor: "#6d28d9", 
                  color: "white", 
                  textDecoration: "none", 
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(109,40,217,0.3)"
                }}>
                  My NFTs
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
