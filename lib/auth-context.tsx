'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

export type UserRole = 'admin' | 'sales' | 'purchase' | 'manufacturing' | 'inventory' | 'business_owner'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getRoleDetails = (role: string) => {
  switch (role) {
    case 'admin':
      return { department: 'Administration', avatar: '👩‍💼' }
    case 'sales':
      return { department: 'Sales', avatar: '👨‍💻' }
    case 'purchase':
      return { department: 'Procurement', avatar: '👩‍🔬' }
    case 'manufacturing':
      return { department: 'Operations', avatar: '👨‍🏭' }
    case 'inventory':
      return { department: 'Warehouse', avatar: '👩‍🎓' }
    case 'owner':
    case 'business_owner':
      return { department: 'Executive', avatar: '👨‍💼' }
    default:
      return { department: 'General Operations', avatar: '👤' }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('erp_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)

      if (error) {
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid email or password')
      }

      const dbUser = data[0]

      if (dbUser.role && dbUser.role.startsWith('deactivated_')) {
        throw new Error('Account deactivated. Contact administrator.')
      }

      // Map DB role 'owner' to frontend role 'business_owner'
      const mappedRole: UserRole = dbUser.role === 'owner' ? 'business_owner' : dbUser.role

      const { department, avatar } = getRoleDetails(dbUser.role)

      const currentUser: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: mappedRole,
        department,
        avatar
      }

      setUser(currentUser)
      localStorage.setItem('erp_user', JSON.stringify(currentUser))
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('erp_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
