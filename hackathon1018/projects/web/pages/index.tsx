import Link from 'next/link'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { userRole, isLoading } = useAuth()

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
      <div style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
        <h1>Student Credential Verification</h1>
        <p>Blockchain-based credential verification system with commemorative NFTs using Algorand</p>
        
        {!userRole ? (
          <div style={{marginTop: "40px", padding: "20px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "5px"}}>
            <h3>👋 Welcome!</h3>
            <p>Please log in using the button in the top right to access the system.</p>
          </div>
        ) : (
          <div style={{marginTop: "40px"}}>
            <h2>Available Actions:</h2>
            <div style={{display: "flex", gap: "20px", marginTop: "20px"}}>
              {userRole !== 'Student' && (
                <Link href="/issuer" style={{
                  padding: "12px 24px", 
                  backgroundColor: "#0070f3", 
                  color: "white", 
                  textDecoration: "none", 
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,112,243,0.2)"
                }}>
                  Issue {userRole === 'Institution' ? 'Education' : 'Visa'} Credential
                </Link>
              )}
              
              <Link href="/verify" style={{
                padding: "12px 24px", 
                backgroundColor: "#28a745", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(40,167,69,0.2)"
              }}>
                Verify Credential
              </Link>
              
              {userRole === 'Student' && (
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
