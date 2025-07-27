import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import {
  ArrowLeftIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import {
  ArrowUpIcon as ArrowUpIconSolid,
  ArrowDownIcon as ArrowDownIconSolid,
} from '@heroicons/react/24/solid'
import { ellipseAddress } from '../utils/ellipseAddress'
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

interface Comment {
  id: string
  author: string
  content: string
  timestamp: number
  upvotes: number
  downvotes: number
  hasVoted: boolean
  voteType?: 'up' | 'down'
}

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeAddress } = useWallet()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState('')

  // Mock post data
  const mockPost: Post = {
    id: id || '1',
    author: 'ALGO...XYZ123',
    content: 'Just deployed my first smart contract on Algorand! The developer experience is incredible. The low fees and fast finality make it perfect for DeFi applications. Here\'s what I learned during the process:\n\n1. AlgoPy makes smart contract development intuitive\n2. The testnet is incredibly fast for testing\n3. The documentation is comprehensive\n4. The community is super helpful\n\nIf you\'re thinking about building on Algorand, now is the perfect time to start! The ecosystem is growing rapidly and there are so many opportunities.\n\n#AlgorandDev #SmartContracts #DeFi #Blockchain',
    timestamp: Date.now() - 3600000, // 1 hour ago
    upvotes: 89,
    downvotes: 3,
    hasVoted: false,
  }

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: '1',
      author: 'ALGO...ABC789',
      content: 'Congratulations! 🎉 Algorand is definitely the best choice for smart contracts. The Pure Proof of Stake consensus is revolutionary.',
      timestamp: Date.now() - 2700000, // 45 minutes ago
      upvotes: 12,
      downvotes: 0,
      hasVoted: true,
      voteType: 'up',
    },
    {
      id: '2',
      author: 'ALGO...DEF456',
      content: 'This is awesome! I\'ve been thinking about learning smart contract development. Do you have any resources you\'d recommend for beginners?',
      timestamp: Date.now() - 2400000, // 40 minutes ago
      upvotes: 8,
      downvotes: 0,
      hasVoted: false,
    },
    {
      id: '3',
      author: 'ALGO...GHI012',
      content: 'The Algorand ecosystem is growing so fast! It\'s exciting to see more developers joining. Keep building! 🚀',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      upvotes: 15,
      downvotes: 1,
      hasVoted: false,
    },
  ]

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPost(mockPost)
      setComments(mockComments)
    } catch (error) {
      console.error('Error loading post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!post) return

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

    setPost({
      ...post,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      hasVoted: newHasVoted,
      voteType: newVoteType,
    })
  }

  const handleCommentVote = async (commentId: string, voteType: 'up' | 'down') => {
    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const wasUpvoted = comment.hasVoted && comment.voteType === 'up'
          const wasDownvoted = comment.hasVoted && comment.voteType === 'down'
          
          let newUpvotes = comment.upvotes
          let newDownvotes = comment.downvotes
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
            ...comment,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            hasVoted: newHasVoted,
            voteType: newVoteType,
          }
        }
        return comment
      })
    )
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !activeAddress) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: activeAddress,
      content: newComment,
      timestamp: Date.now(),
      upvotes: 0,
      downvotes: 0,
      hasVoted: false,
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
  }

  const handleTip = () => {
    const amount = parseFloat(tipAmount)
    if (amount > 0) {
      console.log(`Tipping ${amount} ALGO to ${post?.author}`)
      setTipAmount('')
      setShowTipModal(false)
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getVoteButtonClass = (voteType: 'up' | 'down', hasVoted: boolean, userVoteType?: 'up' | 'down') => {
    const isActive = hasVoted && userVoteType === voteType
    const baseClass = "flex items-center space-x-1 px-3 py-2 rounded-full transition-all hover-lift"
    
    if (voteType === 'up') {
      return `${baseClass} ${isActive 
        ? 'bg-green-100 text-green-600' 
        : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`
    } else {
      return `${baseClass} ${isActive 
        ? 'bg-red-100 text-red-600' 
        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
        <p className="text-gray-600">The post you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/app/feed')}
          className="btn btn-primary mt-4"
        >
          Back to Feed
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Post</h1>
      </div>

      {/* Post */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Author */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring">
            <span className="text-white font-semibold text-sm">
              {post.author.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {ellipseAddress(post.author)}
            </div>
            <div className="text-sm text-gray-500">
              {formatTimeAgo(post.timestamp)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-gray-800 mb-6 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Upvote */}
            <button
              onClick={() => handleVote(post.id, 'up')}
              className={getVoteButtonClass('up', post.hasVoted, post.voteType)}
            >
              {post.hasVoted && post.voteType === 'up' ? (
                <ArrowUpIconSolid className="w-5 h-5" />
              ) : (
                <ArrowUpIcon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{post.upvotes}</span>
            </button>

            {/* Downvote */}
            <button
              onClick={() => handleVote(post.id, 'down')}
              className={getVoteButtonClass('down', post.hasVoted, post.voteType)}
            >
              {post.hasVoted && post.voteType === 'down' ? (
                <ArrowDownIconSolid className="w-5 h-5" />
              ) : (
                <ArrowDownIcon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{post.downvotes}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tip */}
            <button
              onClick={() => setShowTipModal(true)}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-full transition-all hover-lift"
            >
              <CurrencyDollarIcon className="w-5 h-5" />
              <span className="text-sm">Tip</span>
            </button>

            {/* Share */}
            <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all hover-lift">
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      {activeAddress && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmitComment}>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {activeAddress.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-500">
                    {newComment.length}/280
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || newComment.length > 280}
                    className="btn btn-primary btn-sm"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
        
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Comment Header */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {comment.author.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {ellipseAddress(comment.author)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTimeAgo(comment.timestamp)}
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <div className="text-gray-800 mb-3 leading-relaxed">
              {comment.content}
            </div>

            {/* Comment Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCommentVote(comment.id, 'up')}
                className={getVoteButtonClass('up', comment.hasVoted, comment.voteType)}
              >
                {comment.hasVoted && comment.voteType === 'up' ? (
                  <ArrowUpIconSolid className="w-4 h-4" />
                ) : (
                  <ArrowUpIcon className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">{comment.upvotes}</span>
              </button>

              <button
                onClick={() => handleCommentVote(comment.id, 'down')}
                className={getVoteButtonClass('down', comment.hasVoted, comment.voteType)}
              >
                {comment.hasVoted && comment.voteType === 'down' ? (
                  <ArrowDownIconSolid className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">{comment.downvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Tip Creator</h3>
            <p className="text-gray-600 mb-4">
              Send ALGO to {ellipseAddress(post.author)} to show appreciation for their content.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (ALGO)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTipModal(false)}
                className="flex-1 btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleTip}
                disabled={!tipAmount || parseFloat(tipAmount) <= 0}
                className="flex-1 btn btn-primary"
              >
                Send Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail