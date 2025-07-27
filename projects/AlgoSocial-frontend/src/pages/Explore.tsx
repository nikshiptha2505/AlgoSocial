import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  FireIcon,
  TrendingUpIcon,
  UsersIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'

interface TrendingTopic {
  tag: string
  posts: number
  growth: number
}

interface Post {
  id: string
  author: string
  content: string
  timestamp: number
  upvotes: number
  downvotes: number
  hasVoted: boolean
  voteType?: 'up' | 'down'
}

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'people'>('trending')
  const [posts, setPosts] = useState<Post[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(true)

  // Mock trending topics
  const mockTrendingTopics: TrendingTopic[] = [
    { tag: 'AlgorandDeFi', posts: 1234, growth: 25.5 },
    { tag: 'Web3Social', posts: 892, growth: 18.2 },
    { tag: 'AlgoNFTs', posts: 567, growth: 12.8 },
    { tag: 'SmartContracts', posts: 445, growth: 9.4 },
    { tag: 'Blockchain', posts: 334, growth: 7.1 },
    { tag: 'Cryptocurrency', posts: 289, growth: 5.6 },
  ]

  // Mock trending posts
  const mockTrendingPosts: Post[] = [
    {
      id: '1',
      author: 'ALGO...TREND1',
      content: '🔥 BREAKING: Algorand just processed 1 million transactions in a single day! The network is scaling beautifully. This is why I believe ALGO is the future of blockchain. #AlgorandDeFi #Scalability',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      upvotes: 342,
      downvotes: 12,
      hasVoted: false,
    },
    {
      id: '2',
      author: 'ALGO...TREND2',
      content: 'Just discovered AlgoSocial and I\'m blown away! Finally, a social platform that puts users first. No ads, no data harvesting, just pure decentralized social interaction. This is the future! 🚀 #Web3Social',
      timestamp: Date.now() - 3600000, // 1 hour ago
      upvotes: 289,
      downvotes: 8,
      hasVoted: true,
      voteType: 'up',
    },
    {
      id: '3',
      author: 'ALGO...TREND3',
      content: 'My latest NFT collection just dropped on Algorand! The minting cost was less than $0.01 and it was instant. Compare that to other chains... there\'s no competition! 🎨 #AlgoNFTs #NFTCommunity',
      timestamp: Date.now() - 5400000, // 1.5 hours ago
      upvotes: 156, 
      downvotes: 3,
      hasVoted: false,
    },
  ]

  useEffect(() => {
    loadData()
  }, [activeTab, searchQuery])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setTrendingTopics(mockTrendingTopics)
      setPosts(mockTrendingPosts)
    } catch (error) {
      console.error('Error loading explore data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery })
      // Trigger search
      loadData()
    }
  }

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const wasUpvoted = post.hasVoted && post.voteType === 'up'
          const wasDownvoted = post.hasVoted && post.voteType === 'down'
          
          let newUpvotes = post.upvotes
          let newDownvotes = post.downvotes
          let newHasVoted = true
          let newVoteType: 'up' | 'down' = voteType

          if (voteType === 'up') {
            if (wasUpvoted) {
              newUpvotes -= 1
              newHasVoted = false
              newVoteType = undefined as any
            } else if (wasDownvoted) {
              newUpvotes += 1
              newDownvotes -= 1
            } else {
              newUpvotes += 1
            }
          } else {
            if (wasDownvoted) {
              newDownvotes -= 1
              newHasVoted = false
              newVoteType = undefined as any
            } else if (wasUpvoted) {
              newDownvotes += 1
              newUpvotes -= 1
            } else {
              newDownvotes += 1
            }
          }

          return {
            ...post,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            hasVoted: newHasVoted,
            voteType: newVoteType,
          }
        }
        return post
      })
    )
  }

  const handleTip = async (postId: string, amount: number) => {
    console.log(`Tipping ${amount} ALGO to post ${postId}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, users, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-lg"
                />
              </div>
            </form>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex border-b border-gray-200">
              {[
                { key: 'trending', label: 'Trending', icon: FireIcon },
                { key: 'latest', label: 'Latest', icon: TrendingUpIcon },
                { key: 'people', label: 'People', icon: UsersIcon },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'trending' && posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  onTip={handleTip}
                />
              ))}
              
              {activeTab === 'latest' && (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-gray-600">Latest posts will appear here.</p>
                </div>
              )}
              
              {activeTab === 'people' && (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-gray-600">People search results will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <FireIcon className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className="font-bold text-gray-900">Trending Topics</h3>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.tag}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => setSearchQuery(`#${topic.tag}`)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">#{topic.tag}</div>
                      <div className="text-sm text-gray-600">{topic.posts.toLocaleString()} posts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">+{topic.growth}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Hashtags */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <HashtagIcon className="w-5 h-5 text-secondary-500 mr-2" />
              <h3 className="font-bold text-gray-900">Popular Hashtags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'AlgorandDeFi', 'Web3Social', 'AlgoNFTs', 'SmartContracts',
                'Blockchain', 'Cryptocurrency', 'DeFi', 'NFTs'
              ].map((hashtag) => (
                <button
                  key={hashtag}
                  onClick={() => setSearchQuery(`#${hashtag}`)}
                  className="px-3 py-1 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-gray-700 rounded-full text-sm transition-colors"
                >
                  #{hashtag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4">AlgoSocial Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="opacity-90">Total Posts</span>
                <span className="font-semibold">50,234</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Active Users</span>
                <span className="font-semibold">12,456</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">ALGO Tipped</span>
                <span className="font-semibold">1.2M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore