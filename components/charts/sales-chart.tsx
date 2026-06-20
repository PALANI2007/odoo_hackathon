'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { salesMetrics } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={salesMetrics}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
        <YAxis 
          stroke="rgba(255,255,255,0.5)" 
          tickFormatter={(value) => formatCurrency(value)}
          width={80}
        />
        <Tooltip 
          formatter={(value: any) => [formatCurrency(Number(value))]}
          contentStyle={{
            backgroundColor: 'rgba(15, 13, 29, 0.95)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '8px',
          }}
          cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar dataKey="revenue" fill="#7c3aed" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="target" fill="#06b6d4" name="Target (₹)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
