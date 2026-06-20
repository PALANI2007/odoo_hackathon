'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AI_RESPONSES: Record<string, string[]> = {
  sales: [
    'Based on your sales data, I recommend focusing on high-value clients. Your Q2 revenue is up 15% YoY!',
    'Your conversion rate has improved to 32.5%. Consider increasing marketing spend for your top 3 products.',
    'I notice seasonal patterns in your sales. Peak season is approaching in Q3.',
  ],
  inventory: [
    'Alert: Electronics inventory is at 85% of normal levels. Consider restocking.',
    'Your warehouse efficiency is excellent at 99.1% accuracy. Great work!',
    'Turnover rate is healthy at 6.8x per year. Maintain current stock levels.',
  ],
  manufacturing: [
    'Production is 15% above target this week. Quality metrics remain excellent.',
    'Defect rate is at 1.2%, which is below your 2% target. Keep up the quality control!',
    'Equipment utilization is optimal. No maintenance issues detected.',
  ],
  purchase: [
    'Cost savings of $45K this month. Your negotiation strategy is effective.',
    '96.2% on-time delivery rate from suppliers. Maintain these partnerships.',
    'Supplier quality average is 4.6/5. Consider reviewing the lower-rated suppliers.',
  ],
  admin: [
    'All systems are operating normally. Business health index: 92.3%',
    'Your operational efficiency has improved 8% this quarter.',
    'Revenue trends show consistent growth across all departments.',
  ],
  business_owner: [
    'Net profit is up 22% YoY. Your ROI stands at 34.5%, exceeding targets.',
    'Operational efficiency is at 92.3%. All departments are performing well.',
    'Customer satisfaction remains high at 4.7/5. Retention rate is excellent.',
  ],
}

export default function AIAssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your ERP AI Assistant. I'm here to help you with ${user?.role.replace('_', ' ') || 'business'} insights and analytics. What would you like to know?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get AI response based on role
    const responses = AI_RESPONSES[user?.role || 'admin'] || AI_RESPONSES.admin
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
  }

  return (
    <div className="h-full flex flex-col bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-4xl font-bold text-foreground">AI Assistant 🤖</h1>
        <p className="text-muted-foreground mt-2">
          Ask me anything about your {user?.role.replace('_', ' ')} operations
        </p>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        className="flex-1 flex flex-col bg-card border border-border/50 rounded-xl backdrop-blur-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 border border-border/50 text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted/50 border border-border/50 rounded-lg px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 p-4 bg-muted/30">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 text-foreground placeholder-muted-foreground focus:bg-background"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              Send
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
