import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import {
  Cog6ToothIcon,
  CalendarIcon,
  LinkIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { ellipseAddress } from '../utils/ellipseAddress'

interface UserProfile {
  address: string
  displayName?: string
  bio?: string
  website?: string
  location?: string
  joinedDate: number
  followersCount: number
  followingCount: number
  postsCount: number
  reputation: number
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

const Profile = () => {
  const { address } = useParams()
  const { activeAddress } = useWallet()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'likes'>('posts')

  const profileAddress = address || activeAddress
  const isOwnProfile = profileAddress === activeAddress

  // Mock profile data
  const mockProfile: UserProfile = {
    address: profileAddress || '',
    displayName: 'Algorand Developer',
    bio: '🚀 Building the future on Algorand | Smart Contract Developer | DeFi Enthusiast | #AlgorandCommunity',
    website: 'https://algorand.org',
    location: 'Decentralized',
    joinedDate: Date.now() - 86400000 * 180, // 6 months ago
    followersCount: 1234,
    followingCount: 567,
    postsCount: 89,
    reputation: 2450,
  }

  // Mock posts data
  const mockPosts: Post[] = [
    {
      id: '1',
      author: profileAddress || '',
      content: 'Just shipped a new DeFi protocol on Algorand! The transaction throughput is incredible - 1000 TPS with instant finality. This is what the future of finance looks like! 🚀 #DeFi #Algorand',
      timestamp: Date.now() - 3600000,
      upvotes: 45,
      downvotes: 2,
      hasVoted: false,
    },
    {
      id: '2',
      author: profileAddress || '',
      content: 'Working on a new tutorial series about Algorand smart contracts. What topics would you like me to cover? Drop your suggestions below! 👇',
      timestamp: Date.now() - 7200000,
      upvotes: 78,
      downvotes: 1,
      hasVoted: true,
      voteType: 'up',
    },
  ]

  useEffect(() => {
    loadProfile()
  }, [profileAddress])

  const loadProfile = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProfile(mockProfile)
      setPosts(mockPosts)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
        <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full border-4 border-white avatar-ring flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {profile.address.slice(0, 2).toUpperCase()}
              </span>
            </div>
            
            {isOwnProfile && (
              <button className="btn btn-outline btn-primary">
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.displayName || ellipseAddress(profile.address)}
            </h1>
            <p className="text-gray-600 mb-3">{ellipseAddress(profile.address)}</p>
            
            {profile.bio && (
              <p className="text-gray-800 mb-4 leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {profile.location && (
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <div className="flex items-center">
                  <LinkIcon className="w-4 h-4 mr-1" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                    {profile.website.replace('https://', '')}
                  </a>
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Joined {formatDate(profile.joinedDate)}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="font-semibold text-gray-900">{profile.followingCount}</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{profile.followersCount}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{profile.postsCount}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold text-primary-500">{profile.reputation}</span>
                <span className="text-gray-600 ml-1">Reputation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'posts', label: 'Posts', count: profile.postsCount },
            { key: 'replies', label: 'Replies', count: 23 },
            { key: 'likes', label: 'Likes', count: 156 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {activeTab === 'posts' && posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onVote={handleVote}
            onTip={handleTip}
          />
        ))}
        
        {activeTab === 'replies' && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-600">No replies yet.</p>
          </div>
        )}
        
        {activeTab === 'likes' && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-600">No liked posts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile