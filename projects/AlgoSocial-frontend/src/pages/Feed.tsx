import { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import PostCard from '../components/PostCard'
import CreatePostQuick from '../components/CreatePostQuick'
import LoadingSpinner from '../components/LoadingSpinner'

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

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { activeAddress } = useWallet()

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: '1',
      author: 'ALGO...XYZ123',
      content: 'Just deployed my first smart contract on Algorand! The developer experience is incredible. The low fees and fast finality make it perfect for DeFi applications. #AlgorandDev #SmartContracts',
      timestamp: Date.now() - 3600000, // 1 hour ago
      upvotes: 24,
      downvotes: 2,
      hasVoted: false,
    },
    {
      id: '2',
      author: 'ALGO...ABC789',
      content: 'The future of social media is decentralized! 🚀 AlgoSocial is proving that we can build better platforms that put users first. No more data harvesting, no more censorship. #Web3 #Decentralized',
      timestamp: Date.now() - 7200000, // 2 hours ago
      upvotes: 156,
      downvotes: 8,
      hasVoted: true,
      voteType: 'up',
    },
    {
      id: '3',
      author: 'ALGO...DEF456',
      content: 'Algorand\'s Pure Proof of Stake consensus is a game changer. Energy efficient, secure, and truly decentralized. This is what blockchain should be! 🌱',
      timestamp: Date.now() - 10800000, // 3 hours ago
      upvotes: 89,
      downvotes: 3,
      hasVoted: false,
    },
    {
      id: '4',
      author: 'ALGO...GHI012',
      content: 'Just received my first tip on AlgoSocial! 💰 The tokenomics here are brilliant - creators get rewarded for quality content, and the community decides what\'s valuable. This is the future!',
      timestamp: Date.now() - 14400000, // 4 hours ago
      upvotes: 67,
      downvotes: 1,
      hasVoted: false,
    },
    {
      id: '5',
      author: 'ALGO...JKL345',
      content: 'Building on Algorand has been an amazing journey. The documentation is top-notch, the community is supportive, and the technology just works. If you\'re thinking about Web3 development, start here! 🔧',
      timestamp: Date.now() - 18000000, // 5 hours ago
      upvotes: 134,
      downvotes: 5,
      hasVoted: true,
      voteType: 'up',
    },
  ]

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPosts(mockPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
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
              // Remove upvote
              newUpvotes -= 1
              newHasVoted = false
              newVoteType = undefined as any
            } else if (wasDownvoted) {
              // Change from downvote to upvote
              newUpvotes += 1
              newDownvotes -= 1
            } else {
              // Add upvote
              newUpvotes += 1
            }
          } else {
            if (wasDownvoted) {
              // Remove downvote
              newDownvotes -= 1
              newHasVoted = false
              newVoteType = undefined as any
            } else if (wasUpvoted) {
              // Change from upvote to downvote
              newDownvotes += 1
              newUpvotes -= 1
            } else {
              // Add downvote
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
    // Implement tipping logic here
    console.log(`Tipping ${amount} ALGO to post ${postId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quick Create Post */}
      <CreatePostQuick />

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-sm btn-outline btn-primary"
        >
          {refreshing ? <LoadingSpinner size="sm" /> : 'Refresh'}
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onVote={handleVote}
            onTip={handleTip}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <button className="btn btn-outline btn-primary">
          Load More Posts
        </button>
      </div>
    </div>
  )
}

export default Feed