import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid,
  ArrowUpIcon as ArrowUpIconSolid,
  ArrowDownIcon as ArrowDownIconSolid,
} from '@heroicons/react/24/solid'
import { ellipseAddress } from '../utils/ellipseAddress'

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

interface PostCardProps {
  post: Post
  onVote: (postId: string, voteType: 'up' | 'down') => void
  onTip: (postId: string, amount: number) => void
}

const PostCard = ({ post, onVote, onTip }: PostCardProps) => {
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState('')
  const navigate = useNavigate()

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

  const handleTip = () => {
    const amount = parseFloat(tipAmount)
    if (amount > 0) {
      onTip(post.id, amount)
      setTipAmount('')
      setShowTipModal(false)
    }
  }

  const getVoteButtonClass = (voteType: 'up' | 'down') => {
    const isActive = post.hasVoted && post.voteType === voteType
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

  return (
    <div className="post-card bg-white rounded-2xl p-6 shadow-sm hover-lift">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring">
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
      </div>

      {/* Content */}
      <div 
        className="text-gray-800 mb-6 leading-relaxed cursor-pointer"
        onClick={() => navigate(`/app/post/${post.id}`)}
      >
        {post.content}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Upvote */}
          <button
            onClick={() => onVote(post.id, 'up')}
            className={getVoteButtonClass('up')}
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
            onClick={() => onVote(post.id, 'down')}
            className={getVoteButtonClass('down')}
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
          {/* Comment */}
          <button 
            onClick={() => navigate(`/app/post/${post.id}`)}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all hover-lift"
          >
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />
            <span className="text-sm">Reply</span>
          </button>

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

export default PostCard