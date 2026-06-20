export const salesMetrics = [
  { month: 'Jan', revenue: 45000, target: 40000, orders: 128 },
  { month: 'Feb', revenue: 52000, target: 45000, orders: 145 },
  { month: 'Mar', revenue: 48000, target: 45000, orders: 132 },
  { month: 'Apr', revenue: 61000, target: 50000, orders: 156 },
  { month: 'May', revenue: 55000, target: 50000, orders: 142 },
  { month: 'Jun', revenue: 67000, target: 55000, orders: 168 }
]

export const inventoryData = [
  { category: 'Electronics', stock: 850, reorder: 500, value: 125000 },
  { category: 'Textiles', stock: 2200, reorder: 1000, value: 88000 },
  { category: 'Chemicals', stock: 450, reorder: 300, value: 67500 },
  { category: 'Machinery', stock: 125, reorder: 100, value: 312500 },
  { category: 'Packaging', stock: 5600, reorder: 3000, value: 56000 }
]

export const productionData = [
  { week: 'W1', production: 1200, target: 1100, defects: 12 },
  { week: 'W2', production: 1350, target: 1100, defects: 8 },
  { week: 'W3', production: 1100, target: 1100, defects: 15 },
  { week: 'W4', production: 1450, target: 1100, defects: 10 }
]

export const purchaseMetrics = [
  { supplier: 'TechCorp Ltd', amount: 125000, status: 'on_time', rating: 4.8 },
  { supplier: 'Global Supply', amount: 87000, status: 'on_time', rating: 4.5 },
  { supplier: 'Quality Materials', amount: 156000, status: 'delayed', rating: 4.2 },
  { supplier: 'Premium Goods', amount: 92000, status: 'on_time', rating: 4.9 }
]

export const recentOrders = [
  { id: 'ORD-2024-001', customer: 'Acme Corp', amount: 15000, status: 'completed', date: '2024-06-18' },
  { id: 'ORD-2024-002', customer: 'TechStart Inc', amount: 22000, status: 'processing', date: '2024-06-19' },
  { id: 'ORD-2024-003', customer: 'Global Solutions', amount: 18500, status: 'pending', date: '2024-06-20' },
  { id: 'ORD-2024-004', customer: 'Innovation Labs', amount: 31000, status: 'completed', date: '2024-06-20' }
]

export const activityLog = [
  { id: 1, action: 'New order received from Acme Corp', timestamp: '2 hours ago', icon: '📦' },
  { id: 2, action: 'Production batch completed with 99% quality', timestamp: '4 hours ago', icon: '✅' },
  { id: 3, action: 'Inventory alert: Electronics stock below threshold', timestamp: '6 hours ago', icon: '⚠️' },
  { id: 4, action: 'Purchase order approved for 50,000 units', timestamp: '1 day ago', icon: '💰' },
  { id: 5, action: 'System maintenance scheduled for Sunday', timestamp: '2 days ago', icon: '🔧' }
]

export const kpiTargets = {
  admin: {
    revenue: { current: 283000, target: 250000, unit: '₹' },
    orders: { current: 603, target: 500, unit: '' },
    efficiency: { current: 94.2, target: 90, unit: '%' },
    satisfaction: { current: 4.6, target: 4.5, unit: '/5' }
  },
  sales: {
    revenue: { current: 283000, target: 250000, unit: '₹' },
    activeDeals: { current: 24, target: 20, unit: '' },
    conversionRate: { current: 32.5, target: 30, unit: '%' },
    avgDealSize: { current: 18500, target: 15000, unit: '₹' }
  },
  purchase: {
    costSavings: { current: 45000, target: 40000, unit: '₹' },
    onTimeDelivery: { current: 96.2, target: 95, unit: '%' },
    supplierQuality: { current: 4.6, target: 4.5, unit: '/5' },
    poProcessed: { current: 142, target: 120, unit: '' }
  },
  manufacturing: {
    production: { current: 5100, target: 4400, unit: 'units' },
    defectRate: { current: 1.2, target: 2.0, unit: '%' },
    efficiency: { current: 94.8, target: 90, unit: '%' },
    costPerUnit: { current: 24.5, target: 25, unit: '₹' }
  },
  inventory: {
    accuracy: { current: 99.1, target: 98, unit: '%' },
    turnoverRate: { current: 6.8, target: 6, unit: 'x' },
    stockValue: { current: 649000, target: 600000, unit: '₹' },
    criticalItems: { current: 3, target: 5, unit: '' }
  },
  business_owner: {
    netProfit: { current: 245000, target: 200000, unit: '₹' },
    roi: { current: 34.5, target: 30, unit: '%' },
    operationalEfficiency: { current: 92.3, target: 85, unit: '%' },
    customerSatisfaction: { current: 4.7, target: 4.5, unit: '/5' }
  }
}
