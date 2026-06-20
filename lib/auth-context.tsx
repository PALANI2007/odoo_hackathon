'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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

// Demo users for the system
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Sarah Chen',
      email: 'admin@erp.com',
      role: 'admin',
      department: 'Administration',
      avatar: '👩‍💼'
    }
  },
  sales: {
    password: 'sales123',
    user: {
      id: '2',
      name: 'Marcus Johnson',
      email: 'sales@erp.com',
      role: 'sales',
      department: 'Sales',
      avatar: '👨‍💻'
    }
  },
  purchase: {
    password: 'purchase123',
    user: {
      id: '3',
      name: 'Priya Patel',
      email: 'purchase@erp.com',
      role: 'purchase',
      department: 'Procurement',
      avatar: '👩‍🔬'
    }
  },
  manufacturing: {
    password: 'manufacturing123',
    user: {
      id: '4',
      name: 'David Kim',
      email: 'manufacturing@erp.com',
      role: 'manufacturing',
      department: 'Operations',
      avatar: '👨‍🏭'
    }
  },
  inventory: {
    password: 'inventory123',
    user: {
      id: '5',
      name: 'Elena Rodriguez',
      email: 'inventory@erp.com',
      role: 'inventory',
      department: 'Warehouse',
      avatar: '👩‍🎓'
    }
  },
  business_owner: {
    password: 'owner123',
    user: {
      id: '6',
      name: 'James Wilson',
      email: 'owner@erp.com',
      role: 'business_owner',
      department: 'Executive',
      avatar: '👨‍💼'
    }
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Find user by email
    const userEntry = Object.values(DEMO_USERS).find(
      entry => entry.user.email === email && entry.password === password
    )

    if (!userEntry) {
      throw new Error('Invalid email or password')
    }

    setUser(userEntry.user)
    localStorage.setItem('erp_user', JSON.stringify(userEntry.user))
    setIsLoading(false)
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
