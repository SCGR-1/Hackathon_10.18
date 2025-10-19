import OpenAI from 'openai'

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
const OPENAI_ENABLED = Boolean(OPENAI_API_KEY)

// Initialize OpenAI client if API key is available
const openai = OPENAI_ENABLED ? new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage
}) : null

export interface ArtGenerationParams {
  credentialType: 'VisaCredential' | 'EducationCredential' | 'CertificationCredential'
  credentialId: string
  institution?: string
  degree?: string
  fieldOfStudy?: string
  country?: string
  visaType?: string
  certificationBody?: string
  examType?: string
}

export interface ArtGenerationResult {
  success: boolean
  imageUrl?: string
  prompt?: string
  error?: string
  isPlaceholder?: boolean
}

/**
 * Generates AI art for a credential NFT using OpenAI DALL-E
 * Falls back to placeholder if OpenAI is not available
 */
export async function generateCredentialArt(params: ArtGenerationParams): Promise<ArtGenerationResult> {
  try {
    console.log('🎨 Starting art generation for credential:', params.credentialId)
    
    if (!OPENAI_ENABLED) {
      console.log('⚠️ OpenAI not configured, using placeholder art')
      return generatePlaceholderArt(params)
    }

    // Generate art prompt based on credential type
    const prompt = generateArtPrompt(params)
    console.log('Generated prompt:', prompt)

    // Call OpenAI DALL-E API
    const response = await openai!.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    })

    const imageUrl = response.data[0]?.url
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI')
    }

    console.log('✅ AI art generated successfully')
    return {
      success: true,
      imageUrl,
      prompt,
      isPlaceholder: false
    }

  } catch (error) {
    console.error('❌ AI art generation failed:', error)
    console.log('🔄 Falling back to placeholder art')
    
    // Fallback to placeholder
    return generatePlaceholderArt(params)
  }
}

/**
 * Generates a detailed art prompt based on credential parameters
 */
function generateArtPrompt(params: ArtGenerationParams): string {
  const { credentialType, institution, degree, fieldOfStudy, country, visaType, certificationBody, examType } = params

  let basePrompt = "A professional, elegant digital artwork representing a "

  switch (credentialType) {
    case 'EducationCredential':
      basePrompt += `educational achievement certificate. `
      if (institution) basePrompt += `Institution: ${institution}. `
      if (degree) basePrompt += `Degree: ${degree}. `
      if (fieldOfStudy) basePrompt += `Field: ${fieldOfStudy}. `
      basePrompt += `Style: Academic, prestigious, with graduation cap, diploma, books, and university architecture. `
      break

    case 'VisaCredential':
      basePrompt += `travel visa document. `
      if (country) basePrompt += `Country: ${country}. `
      if (visaType) basePrompt += `Visa Type: ${visaType}. `
      basePrompt += `Style: Official, governmental, with passport stamps, flags, landmarks, and travel elements. `
      break

    case 'CertificationCredential':
      basePrompt += `professional certification badge. `
      if (certificationBody) basePrompt += `Certifying Body: ${certificationBody}. `
      if (examType) basePrompt += `Exam: ${examType}. `
      basePrompt += `Style: Professional, corporate, with badges, certificates, and achievement symbols. `
      break
  }

  basePrompt += `Color scheme: Blue and gold professional tones. `
  basePrompt += `Art style: Modern digital illustration, clean lines, professional design. `
  basePrompt += `No text or words in the image. `

  return basePrompt
}

/**
 * Generates placeholder art when OpenAI is not available
 */
function generatePlaceholderArt(params: ArtGenerationParams): ArtGenerationResult {
  const { credentialType } = params
  
  // Create SVG placeholder based on credential type
  const svgPlaceholder = generateSVGPlaceholder(credentialType)
  
  // Convert SVG to data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgPlaceholder)}`
  
  console.log('✅ Placeholder art generated')
  
  return {
    success: true,
    imageUrl: dataUrl,
    prompt: `Placeholder art for ${credentialType}`,
    isPlaceholder: true
  }
}

/**
 * Generates SVG placeholder art
 */
function generateSVGPlaceholder(credentialType: string): string {
  const colors = {
    'EducationCredential': { primary: '#2563eb', secondary: '#1d4ed8', icon: '🎓' },
    'VisaCredential': { primary: '#7c3aed', secondary: '#6d28d9', icon: '🛂' },
    'CertificationCredential': { primary: '#dc2626', secondary: '#b91c1c', icon: '🏆' }
  }

  const colorScheme = colors[credentialType as keyof typeof colors] || colors['EducationCredential']

  return `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1024" height="1024" fill="url(#grad)"/>
      
      <!-- Decorative circles -->
      <circle cx="200" cy="200" r="100" fill="rgba(255,255,255,0.1)"/>
      <circle cx="824" cy="824" r="150" fill="rgba(255,255,255,0.05)"/>
      <circle cx="824" cy="200" r="80" fill="rgba(255,255,255,0.08)"/>
      <circle cx="200" cy="824" r="120" fill="rgba(255,255,255,0.06)"/>
      
      <!-- Main icon area -->
      <rect x="312" y="312" width="400" height="400" rx="40" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
      
      <!-- Icon -->
      <text x="512" y="580" font-family="Arial, sans-serif" font-size="120" text-anchor="middle" fill="white">${colorScheme.icon}</text>
      
      <!-- Credential type text -->
      <text x="512" y="680" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">${credentialType.replace('Credential', '')}</text>
      
      <!-- Decorative elements -->
      <rect x="100" y="100" width="20" height="20" rx="10" fill="rgba(255,255,255,0.2)"/>
      <rect x="904" y="100" width="20" height="20" rx="10" fill="rgba(255,255,255,0.2)"/>
      <rect x="100" y="904" width="20" height="20" rx="10" fill="rgba(255,255,255,0.2)"/>
      <rect x="904" y="904" width="20" height="20" rx="10" fill="rgba(255,255,255,0.2)"/>
    </svg>
  `
}

/**
 * Uploads generated art to a hosting service (optional)
 * This could be integrated with IPFS, AWS S3, or other services
 */
export async function uploadArtToHosting(imageUrl: string, credentialId: string): Promise<string> {
  try {
    // For now, return the original URL
    // In production, you might want to upload to IPFS or a CDN
    console.log('📤 Art uploaded for credential:', credentialId)
    return imageUrl
  } catch (error) {
    console.error('Failed to upload art:', error)
    return imageUrl // Return original URL as fallback
  }
}

/**
 * Gets art URL for a credential (AI-generated or placeholder)
 */
export async function getCredentialArtUrl(params: ArtGenerationParams): Promise<string> {
  const result = await generateCredentialArt(params)
  return result.imageUrl || generatePlaceholderArt(params).imageUrl!
}

/**
 * Checks if OpenAI is configured and available
 */
export function isOpenAIAvailable(): boolean {
  return OPENAI_ENABLED
}

/**
 * Gets OpenAI configuration status
 */
export function getOpenAIStatus(): { enabled: boolean; hasApiKey: boolean } {
  return {
    enabled: OPENAI_ENABLED,
    hasApiKey: Boolean(OPENAI_API_KEY)
  }
}
