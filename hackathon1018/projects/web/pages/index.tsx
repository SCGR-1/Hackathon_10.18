import Link from 'next/link'

export default function Home() {
  return (
    <main style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
      <h1>Visa/Employment Status Verification</h1>
      <p>Blockchain-based credential verification system using Algorand</p>
      
      <div style={{marginTop: "40px"}}>
        <h2>Available Actions:</h2>
        <div style={{display: "flex", gap: "20px", marginTop: "20px"}}>
          <Link href="/issuer" style={{
            padding: "10px 20px", 
            backgroundColor: "#0070f3", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "5px"
          }}>
            Issue Credential
          </Link>
          
          <Link href="/verify" style={{
            padding: "10px 20px", 
            backgroundColor: "#28a745", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "5px"
          }}>
            Verify Credential
          </Link>
        </div>
      </div>
      
      <div style={{marginTop: "40px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "5px"}}>
        <h3>How it works:</h3>
        <ol>
          <li><strong>Issue:</strong> Create credentials with employment/visa information</li>
          <li><strong>Deploy:</strong> Store credential hash on Algorand blockchain</li>
          <li><strong>Verify:</strong> Check credential authenticity against blockchain</li>
        </ol>
      </div>
    </main>
  )
}
