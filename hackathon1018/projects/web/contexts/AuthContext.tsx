import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

export type UserRole = 'Institution' | 'Authority' | 'Employer' | 'Student' | null

interface AuthContextType {
  userRole: UserRole
  login: (role: UserRole) => void
  logout: () => void
  isLoading: boolean
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()

  // Load user role and dark mode preference from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    
    if (savedRole) {
      setUserRole(savedRole)
    }
    setIsDarkMode(savedDarkMode)
    setIsLoading(false)
  }, [])

  const login = (role: UserRole) => {
    setUserRole(role)
    localStorage.setItem('userRole', role || '')
  }

  const logout = () => {
    setUserRole(null)
    localStorage.removeItem('userRole')
    // Redirect to home page on logout
    router.push('/')
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  return (
    <AuthContext.Provider value={{ userRole, login, logout, isLoading, isDarkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
