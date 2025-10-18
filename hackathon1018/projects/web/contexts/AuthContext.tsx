import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

export type UserRole = 'Institution' | 'Authority' | 'Student' | null

interface AuthContextType {
  userRole: UserRole
  login: (role: UserRole) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole
    if (savedRole) {
      setUserRole(savedRole)
    }
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

  return (
    <AuthContext.Provider value={{ userRole, login, logout, isLoading }}>
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
