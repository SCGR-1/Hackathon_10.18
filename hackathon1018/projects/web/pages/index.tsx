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
                  padding: "10px 20px", 
                  backgroundColor: "#0070f3", 
                  color: "white", 
                  textDecoration: "none", 
                  borderRadius: "5px"
                }}>
                  Issue {userRole === 'Institution' ? 'Education' : 'Visa'} Credential
                </Link>
              )}
              
              <Link href="/verify" style={{
                padding: "10px 20px", 
                backgroundColor: "#28a745", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: "5px"
              }}>
                Verify Credential
              </Link>
              
              {userRole === 'Student' && (
                <Link href="/wallet" style={{
                  padding: "10px 20px", 
                  backgroundColor: "#6f42c1", 
                  color: "white", 
                  textDecoration: "none", 
                  borderRadius: "5px"
                }}>
                  🎨 My NFTs
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
