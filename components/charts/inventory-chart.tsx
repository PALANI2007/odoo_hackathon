'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { inventoryData } from '@/lib/mock-data'

const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6']

export default function InventoryChart() {
  const data = inventoryData.map(item => ({
    name: item.category,
    value: item.stock,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(15, 13, 29, 0.95)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '8px',
          }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
