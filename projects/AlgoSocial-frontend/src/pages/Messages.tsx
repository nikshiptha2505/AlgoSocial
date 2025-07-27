import { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { ellipseAddress } from '../utils/ellipseAddress'
import LoadingSpinner from '../components/LoadingSpinner'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: number
  isRead: boolean
}

interface Conversation {
  id: string
  participant: string
  lastMessage: Message
  unreadCount: number
  isOnline: boolean
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { activeAddress } = useWallet()

  // Mock conversations data
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participant: 'ALGO...XYZ123',
      lastMessage: {
        id: '1',
        sender: 'ALGO...XYZ123',
        content: 'Hey! Thanks for the tip on my DeFi post. Really appreciate it! 🙏',
        timestamp: Date.now() - 300000, // 5 minutes ago
        isRead: false,
      },
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      participant: 'ALGO...ABC789',
      lastMessage: {
        id: '2',
        sender: activeAddress || '',
        content: 'The Algorand ecosystem is growing so fast! Excited to see what comes next.',
        timestamp: Date.now() - 3600000, // 1 hour ago
        isRead: true,
      },
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '3',
      participant: 'ALGO...DEF456',
      lastMessage: {
        id: '3',
        sender: 'ALGO...DEF456',
        content: 'Would love to collaborate on that smart contract project you mentioned!',
        timestamp: Date.now() - 7200000, // 2 hours ago
        isRead: false,
      },
      unreadCount: 1,
      isOnline: true,
    },
  ]

  // Mock messages for active conversation
  const mockMessages: Message[] = [
    {
      id: '1',
      sender: 'ALGO...XYZ123',
      content: 'Hey! I saw your post about Algorand smart contracts. Really insightful!',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      isRead: true,
    },
    {
      id: '2',
      sender: activeAddress || '',
      content: 'Thanks! I\'ve been working with Algorand for a while now. The developer experience is amazing.',
      timestamp: Date.now() - 1500000, // 25 minutes ago
      isRead: true,
    },
    {
      id: '3',
      sender: 'ALGO...XYZ123',
      content: 'Totally agree! The transaction speed and low fees make it perfect for DeFi applications.',
      timestamp: Date.now() - 1200000, // 20 minutes ago
      isRead: true,
    },
    {
      id: '4',
      sender: activeAddress || '',
      content: 'Exactly! And the Pure Proof of Stake consensus is so much more energy efficient.',
      timestamp: Date.now() - 900000, // 15 minutes ago
      isRead: true,
    },
    {
      id: '5',
      sender: 'ALGO...XYZ123',
      content: 'Hey! Thanks for the tip on my DeFi post. Really appreciate it! 🙏',
      timestamp: Date.now() - 300000, // 5 minutes ago
      isRead: false,
    },
  ]

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation)
    }
  }, [activeConversation])

  const loadConversations = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConversations(mockConversations)
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0].id)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: Date.now().toString(),
      sender: activeAddress || '',
      content: newMessage,
      timestamp: Date.now(),
      isRead: true,
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation
          ? { ...conv, lastMessage: message }
          : conv
      )
    )
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return 'now'
  }

  const formatMessageTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const activeConv = conversations.find(c => c.id === activeConversation)

  if (!activeAddress) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">You need to connect your wallet to access messages.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <PlusIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  activeConversation === conversation.id
                    ? 'bg-primary-50 border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring">
                      <span className="text-white font-semibold text-sm">
                        {conversation.participant.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900 truncate">
                        {ellipseAddress(conversation.participant)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.sender === activeAddress ? 'You: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring">
                        <span className="text-white font-semibold text-sm">
                          {activeConv.participant.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      {activeConv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {ellipseAddress(activeConv.participant)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activeConv.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === activeAddress ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === activeAddress
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === activeAddress
                            ? 'text-primary-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-600">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages