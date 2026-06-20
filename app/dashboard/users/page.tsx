'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  Users, Search, UserPlus, Edit2, Trash2, UserMinus, UserCheck, 
  RefreshCw, Filter, Shield, Plus, X, Activity, Briefcase, Clock, ShieldCheck, Mail
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface DbUser {
  id: string
  name: string
  email: string
  password?: string
  role: string
  created_at: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<DbUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All')
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales'
  })

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true)
    setError('')
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter(u => !u.role.startsWith('deactivated_')).length
    const deactivated = total - active
    
    // Unique departments (roles)
    const departments = new Set()
    const roleCounts: Record<string, number> = {
      admin: 0,
      owner: 0,
      sales: 0,
      purchase: 0,
      manufacturing: 0,
      inventory: 0
    }

    users.forEach(u => {
      let roleName = u.role
      if (roleName.startsWith('deactivated_')) {
        roleName = roleName.replace('deactivated_', '')
      }
      departments.add(roleName)
      if (roleCounts[roleName] !== undefined) {
        roleCounts[roleName]++
      }
    })

    return {
      total,
      active,
      deactivated,
      departments: departments.size,
      roleCounts
    }
  }, [users])

  // Filters & Search
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      let baseRole = u.role
      let isDeactivated = false
      if (baseRole.startsWith('deactivated_')) {
        baseRole = baseRole.replace('deactivated_', '')
        isDeactivated = true
      }

      const matchesFilter = 
        selectedRoleFilter === 'All' ||
        (selectedRoleFilter === 'deactivated' && isDeactivated) ||
        (selectedRoleFilter.toLowerCase() === baseRole.toLowerCase() && !isDeactivated)

      return matchesSearch && matchesFilter
    })
  }, [users, searchQuery, selectedRoleFilter])

  // Handle Add User
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }])
        .select()

      if (error) throw error

      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#a855f7', '#06b6d4', '#10b981']
      })

      setIsAddModalOpen(false)
      // reset form
      setFormData({ name: '', email: '', password: '', role: 'sales' })
      fetchUsers()
    } catch (err) {
      console.error('Error adding user:', err)
      setError(err instanceof Error ? err.message : 'Failed to add user')
    }
  }

  // Handle Edit User
  const handleEditOpen = (user: DbUser) => {
    setSelectedUser(user)
    let baseRole = user.role
    if (baseRole.startsWith('deactivated_')) {
      baseRole = baseRole.replace('deactivated_', '')
    }
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: baseRole
    })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setError('')

    try {
      // If user was deactivated, keep the deactivated prefix on update unless they are modifying role
      let finalRole = formData.role
      if (selectedUser.role.startsWith('deactivated_')) {
        finalRole = `deactivated_${formData.role}`
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: finalRole
        })
        .eq('id', selectedUser.id)

      if (error) throw error

      setIsEditModalOpen(false)
      setSelectedUser(null)
      setFormData({ name: '', email: '', password: '', role: 'sales' })
      fetchUsers()
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user')
    }
  }

  // Handle Delete User
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return
    setError('')
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  // Toggle user active status
  const handleToggleDeactivate = async (user: DbUser) => {
    setError('')
    const isDeactivated = user.role.startsWith('deactivated_')
    let newRole = user.role

    if (isDeactivated) {
      newRole = user.role.replace('deactivated_', '')
    } else {
      newRole = `deactivated_${user.role}`
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id)

      if (error) throw error
      fetchUsers()
    } catch (err) {
      console.error('Error toggling user status:', err)
      setError(err instanceof Error ? err.message : 'Failed to modify status')
    }
  }

  const getRoleBadgeStyle = (role: string) => {
    let baseRole = role
    if (baseRole.startsWith('deactivated_')) {
      baseRole = baseRole.replace('deactivated_', '')
    }

    switch (baseRole) {
      case 'admin':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400'
      case 'owner':
      case 'business_owner':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      case 'sales':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      case 'purchase':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400'
      case 'manufacturing':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      case 'inventory':
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400'
    }
  }

  const parseRoleName = (role: string) => {
    let name = role
    if (name.startsWith('deactivated_')) {
      name = name.replace('deactivated_', '')
    }
    if (name === 'business_owner') return 'Owner'
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      
      {/* Neo glow backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-purple-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Administration Center
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            User Security Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision roles, manage active logs, and verify access privileges.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchUsers} 
            className="bg-slate-900/60 border border-white/10 hover:border-purple-500/30 p-2.5 rounded-xl cursor-pointer text-slate-300 transition-all"
            title="Reload List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
          </button>
          
          <button
            onClick={() => {
              setFormData({ name: '', email: '', password: '', role: 'sales' })
              setIsAddModalOpen(true)
            }}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/15 border border-purple-400/20"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          Error: {error}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Total Registered Users', val: stats.total, icon: <Users className="w-5 h-5 text-purple-400" />, desc: 'Corporate roster count' },
          { title: 'Active Accounts', val: stats.active, icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, desc: 'Clearance validated' },
          { title: 'Deactivated Nodes', val: stats.deactivated, icon: <UserMinus className="w-5 h-5 text-red-400" />, desc: 'Access locks active' },
          { title: 'Departments Active', val: stats.departments, icon: <Briefcase className="w-5 h-5 text-cyan-400" />, desc: 'Division clusters' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl backdrop-blur-md">
            <div className="flex justify-between items-start text-slate-400 mb-2">
              <span className="text-[9px] uppercase font-bold tracking-wider">{card.title}</span>
              {card.icon}
            </div>
            <div className="text-2xl font-black text-white">{card.val}</div>
            <span className="text-[9px] text-slate-500 font-bold block mt-1.5 uppercase">{card.desc}</span>
          </div>
        ))}
      </div>

      {/* Table & Controls Section */}
      <div className="bg-white/[0.01] border border-white/[0.04] rounded-3xl p-6 backdrop-blur-xl z-10 relative">
        
        {/* Controls Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 font-bold py-2 px-4 focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="All">All Users</option>
              <option value="admin">Administrators</option>
              <option value="owner">Owners</option>
              <option value="sales">Sales</option>
              <option value="purchase">Procurement</option>
              <option value="manufacturing">Operations</option>
              <option value="inventory">Warehouse</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Syncing database caches...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
              <Users className="w-10 h-10 text-slate-600" />
              <span className="text-xs font-bold uppercase tracking-wider">No matching security profiles found</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] text-[10px] uppercase text-slate-500 font-black tracking-wider">
                  <th className="pb-3 text-left">User Name</th>
                  <th className="pb-3 text-left">Email Address</th>
                  <th className="pb-3 text-left">Clearance Role</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-left">Provisioned Date</th>
                  <th className="pb-3 text-right">Security Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredUsers.map((user) => {
                  const isDeactivated = user.role.startsWith('deactivated_')
                  const formattedDate = new Date(user.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })

                  return (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.01] transition-all"
                    >
                      <td className="py-4 font-bold text-white text-xs">{user.name}</td>
                      <td className="py-4 text-slate-300 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {user.email}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getRoleBadgeStyle(user.role)}`}>
                          {parseRoleName(user.role)}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${isDeactivated ? 'text-red-400' : 'text-emerald-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isDeactivated ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
                          {isDeactivated ? 'Deactivated' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-600" />
                          {formattedDate}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => handleToggleDeactivate(user)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              isDeactivated 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            }`}
                            title={isDeactivated ? 'Activate Access' : 'Deactivate Access'}
                          >
                            {isDeactivated ? <UserCheck className="w-3.5 h-3.5" /> : <UserMinus className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleEditOpen(user)}
                            className="bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 p-1.5 rounded-lg transition-all cursor-pointer"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === 'admin'}
                            className={`p-1.5 rounded-lg border transition-all ${
                              user.role === 'admin' 
                                ? 'opacity-30 cursor-not-allowed border-white/5 text-slate-500' 
                                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 cursor-pointer'
                            }`}
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD USER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black uppercase text-white tracking-wider mb-6 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                Add New Security Node
              </h2>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-400 mb-1.5">User Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@erp.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter access code"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">Clearance Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                  >
                    <option value="sales">Sales (Blue)</option>
                    <option value="purchase">Procurement (Orange)</option>
                    <option value="manufacturing">Operations (Emerald)</option>
                    <option value="inventory">Warehouse (Cyan)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-slate-950 border border-white/10 text-slate-300 font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer hover:bg-slate-900 transition-all text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-all text-xs"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT USER MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedUser(null)
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black uppercase text-white tracking-wider mb-6 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                Modify Security Node
              </h2>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-400 mb-1.5">User Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@erp.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter new access code"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">Clearance Role</label>
                  <select
                    disabled={selectedUser.role === 'admin' || selectedUser.role === 'owner' || selectedUser.role === 'business_owner'}
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="admin">Administrator</option>
                    <option value="owner">Owner</option>
                    <option value="sales">Sales (Blue)</option>
                    <option value="purchase">Procurement (Orange)</option>
                    <option value="manufacturing">Operations (Emerald)</option>
                    <option value="inventory">Warehouse (Cyan)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false)
                      setSelectedUser(null)
                    }}
                    className="flex-1 bg-slate-950 border border-white/10 text-slate-300 font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer hover:bg-slate-900 transition-all text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-all text-xs"
                  >
                    Apply Edits
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
