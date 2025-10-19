import React, { useState } from 'react'

interface NFTArtDisplayProps {
  credentialId: string
  credentialType: string
  artUrl?: string
  artPrompt?: string
  isAIGenerated?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Component to display NFT art with fallback to placeholder
 */
export function NFTArtDisplay({ 
  credentialId, 
  credentialType, 
  artUrl, 
  artPrompt, 
  isAIGenerated = false,
  className = '',
  style = {}
}: NFTArtDisplayProps) {
  const [imageError, setImageError] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  // Generate placeholder if no art URL or image failed to load
  const generatePlaceholder = () => {
    const colors = {
      'EducationCredential': { primary: '#2563eb', secondary: '#1d4ed8', icon: '🎓' },
      'VisaCredential': { primary: '#7c3aed', secondary: '#6d28d9', icon: '🛂' },
      'CertificationCredential': { primary: '#dc2626', secondary: '#b91c1c', icon: '🏆' }
    }

    const colorScheme = colors[credentialType as keyof typeof colors] || colors['EducationCredential']

    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <rect width="200" height="200" fill="url(#grad)" rx="12"/>
        
        <circle cx="100" cy="100" r="60" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        
        <text x="100" y="110" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="white">${colorScheme.icon}</text>
        
        <text x="100" y="150" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="white">${credentialType.replace('Credential', '')}</text>
      </svg>
    `)}`
  }

  const displayImage = imageError || !artUrl ? generatePlaceholder() : artUrl

  return (
    <div className={`nft-art-display ${className}`} style={style}>
      <div className="relative group">
        <img
          src={displayImage}
          alt={`NFT Art for ${credentialId}`}
          className="w-full h-full object-cover rounded-lg"
          onError={() => setImageError(true)}
          style={{
            minHeight: '200px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb'
          }}
        />
        
        {/* Art type indicator */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isAIGenerated 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            {isAIGenerated ? '🤖 AI' : '🎨 Art'}
          </span>
        </div>

        {/* Hover overlay with prompt */}
        {artPrompt && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="text-white text-sm font-medium px-3 py-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
            >
              {showPrompt ? 'Hide Prompt' : 'Show Prompt'}
            </button>
          </div>
        )}
      </div>

      {/* Prompt modal */}
      {showPrompt && artPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPrompt(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">AI Art Prompt</h3>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              {artPrompt}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              This prompt was used to generate the NFT art using OpenAI DALL-E
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Hook to get NFT art information for a credential
 */
export function useNFTArt(credential: any) {
  const [artData, setArtData] = useState({
    artUrl: credential?.artUrl,
    artPrompt: credential?.artPrompt,
    isAIGenerated: credential?.isAIGenerated || false
  })

  return artData
}
