import { useState } from "react"
import { CredentialRecord, searchCredentialsBySubject } from "../lib/algorand"
import { searchCredentialsBySubjectLocalNet } from "../lib/blockchain"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link"

const APP_ID = Number(process.env.NEXT_PUBLIC_APP_ID || 0)

export default function Verify() {
  const { isLoading } = useAuth()
  const [result, setResult] = useState<string>("")
  const [userCredentials, setUserCredentials] = useState<CredentialRecord[]>([])

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const subjectAddress = (new FormData(e.currentTarget).get("address") as string) || ""
    
    if (!subjectAddress) {
      setResult("❌ Please enter a subject address")
      return
    }

    try {
      // Demo mode when APP_ID is 0
      if (APP_ID === 0) {
        return setResult(`⚠️ Demo Mode - Smart contract not deployed yet
        
To enable user search:
1. Deploy smart contract: algokit project deploy testnet
2. Set NEXT_PUBLIC_APP_ID in .env.local
3. Restart frontend

Search would look for credentials for: ${subjectAddress}`)
      }

      // Search for credentials by subject address
      const credentials = await searchCredentialsBySubjectLocalNet(subjectAddress)
      
      if (credentials.length === 0) {
        setResult(`🔍 No credentials found for: ${subjectAddress}

This address has no issued credentials on the blockchain.`)
        return
      }

      // Display found credentials
      let resultText = `🔍 Found ${credentials.length} credential(s) for: ${subjectAddress}\n\n`
      
      credentials.forEach((cred, index) => {
        const issuedDate = new Date(cred.issuedAt * 1000).toISOString()
        const expiresDate = new Date(cred.expiresAt * 1000).toISOString()
        const validFromDate = cred.validFrom ? new Date(cred.validFrom).toISOString() : null
        const status = cred.revoked ? "❌ REVOKED" : "✅ ACTIVE"
        
        resultText += `${index + 1}. ${cred.credentialType} (Schema: ${cred.schemaCode})\n`
        resultText += `   Status: ${status}\n`
        resultText += `   Issuer: ${cred.issuer}\n`
        resultText += `   Issued: ${issuedDate}\n`
        if (validFromDate) resultText += `   Valid From: ${validFromDate}\n`
        resultText += `   Expires: ${expiresDate}\n`
        
        // Display claim data based on credential type
        if (cred.claim && Object.keys(cred.claim).length > 0) {
          resultText += `   Details:\n`
          if (cred.credentialType === 'VisaCredential') {
            if (cred.claim.visaType) resultText += `     • Visa Type: ${cred.claim.visaType}\n`
            if (cred.claim.country) resultText += `     • Country: ${cred.claim.country}\n`
            if (cred.claim.visaNumber) resultText += `     • Visa Number: ${cred.claim.visaNumber}\n`
            if (cred.claim.issuedBy) resultText += `     • Issued By: ${cred.claim.issuedBy}\n`
          } else if (cred.credentialType === 'EducationCredential') {
            if (cred.claim.institution) resultText += `     • Institution: ${cred.claim.institution}\n`
            if (cred.claim.degree) resultText += `     • Degree: ${cred.claim.degree}\n`
            if (cred.claim.fieldOfStudy) resultText += `     • Field of Study: ${cred.claim.fieldOfStudy}\n`
            if (cred.claim.graduationYear) resultText += `     • Graduation Year: ${cred.claim.graduationYear}\n`
          }
        }
        
        resultText += `\n`
      })
      
      setResult(resultText)
      
    } catch (err: any) {
      setResult(`❌ Error searching: ${err.message}`)
    }
  }


  return (
    <Layout>
      <div style={{maxWidth:720, margin:"40px auto", fontFamily:"ui-sans-serif"}}>
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
                padding: "8px 16px",
                backgroundColor: "#f0f0f0",
                color: "#333",
                textDecoration: "none",
                borderRadius: "5px",
                border: "1px solid #ddd"
              }}>
                ← Back to Home
              </Link>
            </div>
            
            <h1>Verify Credential</h1>
        
        <div>
          <h2>Search User Credentials</h2>
          <p>Enter a user's Algorand address to find and verify all their credentials.</p>
          
          <form onSubmit={handleSearch}>
            <div style={{marginBottom: "10px"}}>
              <label>Subject Address (Algorand Address):</label>
              <input 
                type="text" 
                name="address"
                placeholder="ALGORAND_ADDRESS_HERE"
                style={{width: "100%", padding: "10px", marginTop: "5px"}}
              />
            </div>
            <button type="submit">Search User Credentials</button>
          </form>
        </div>
      
      {result && (
        <div style={{
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: result.includes("✅") ? "#d4edda" : "#f8d7da",
          border: `1px solid ${result.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "5px"
        }}>
          <pre style={{whiteSpace: "pre-wrap", margin: 0}}>{result}</pre>
        </div>
      )}
          </>
        )}
      </div>
    </Layout>
  )
}