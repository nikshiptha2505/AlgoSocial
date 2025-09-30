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

  const mockTrendingTopics: TrendingTopic[] = [
    { tag: 'AlgorandDeFi', posts: 1234, growth: 25.5 },
    { tag: 'Web3Social', posts: 892, growth: 18.2 },
    { tag: 'AlgoNFTs', posts: 567, growth: 12.8 },
    { tag: 'SmartContracts', posts: 445, growth: 9.4 },
    { tag: 'Blockchain', posts: 334, growth: 7.1 },
    { tag: 'Cryptocurrency', posts: 289, growth: 5.6 },
  ]

  const mockTrendingPosts: Post[] = [
    {
      id: '1',
      author: 'ALGO...TREND1',
      content: '🔥 BREAKING: Algorand just processed 1 million transactions today! #AlgorandDeFi #Scalability',
      timestamp: Date.now() - 1800000,
      upvotes: 342,
      downvotes: 12,
      hasVoted: false,
    },
    {
      id: '2',
      author: 'ALGO...TREND2',
      content: 'Just discovered AlgoSocial! Pure decentralized social interaction 🚀 #Web3Social',
      timestamp: Date.now() - 3600000,
      upvotes: 289,
      downvotes: 8,
      hasVoted: true,
      voteType: 'up',
    },
    {
      id: '3',
      author: 'ALGO...TREND3',
      content: 'My latest NFT collection dropped on Algorand! 🎨 #AlgoNFTs #NFTCommunity',
      timestamp: Date.now() - 5400000,
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
      loadData()
    }
  }

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(post => {
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
            } else newUpvotes += 1
          } else {
            if (wasDownvoted) {
              newDownvotes -= 1
              newHasVoted = false
              newVoteType = undefined as any
            } else if (wasUpvoted) {
              newDownvotes += 1
              newUpvotes -= 1
            } else newDownvotes += 1
          }

          return { ...post, upvotes: newUpvotes, downvotes: newDownvotes, hasVoted: newHasVoted, voteType: newVoteType }
        }
        return post
      })
    )
  }

  const handleTip = async (postId: string, amount: number) => {
    console.log(`Tipping ${amount} ALGO to post ${postId}`)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700 transition-all">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Search posts, users, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </form>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { key: 'trending', label: 'Trending', icon: FireIcon },
                { key: 'latest', label: 'Latest', icon: TrendingUpIcon },
                { key: 'people', label: 'People', icon: UsersIcon },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-all ${
                    activeTab === tab.key
                      ? 'text-primary-500 border-b-2 border-primary-500 scale-105'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
                <PostCard key={post.id} post={post} onVote={handleVote} onTip={handleTip} />
              ))}

              {activeTab === 'latest' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                  <p className="text-gray-600 dark:text-gray-400">Latest posts will appear here.</p>
                </div>
              )}

              {activeTab === 'people' && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                  <p className="text-gray-600 dark:text-gray-400">People search results will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-8">
          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg">
            <div className="flex items-center mb-4">
              <FireIcon className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className="font-bold text-gray-900 dark:text-white">Trending Topics</h3>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.tag}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer transition-colors"
                  onClick={() => setSearchQuery(`#${topic.tag}`)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">#{topic.tag}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{topic.posts.toLocaleString()} posts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">+{topic.growth}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Hashtags */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <HashtagIcon className="w-5 h-5 text-secondary-500 mr-2" />
              <h3 className="font-bold text-gray-900 dark:text-white">Popular Hashtags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['AlgorandDeFi','Web3Social','AlgoNFTs','SmartContracts','Blockchain','Cryptocurrency','DeFi','NFTs'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(`#${tag}`)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-600 hover:text-primary-700 text-gray-700 dark:text-gray-200 rounded-full text-sm transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all">
            <h3 className="font-bold mb-4">AlgoSocial Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="opacity-90">Total Posts</span><span className="font-semibold">50,234</span></div>
              <div className="flex justify-between"><span className="opacity-90">Active Users</span><span className="font-semibold">12,456</span></div>
              <div className="flex justify-between"><span className="opacity-90">ALGO Tipped</span><span className="font-semibold">1.2M</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore
