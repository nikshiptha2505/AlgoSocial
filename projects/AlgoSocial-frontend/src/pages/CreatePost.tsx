import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import {
  PhotoIcon,
  GifIcon,
  FaceSmileIcon,
  MapPinIcon,
  CalendarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { activeAddress } = useWallet()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsPosting(true)
    try {
      // Here you would call your smart contract to create the post
      console.log('Creating post:', { content, images })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate back to feed
      navigate('/app/feed')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files].slice(0, 4)) // Max 4 images
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const characterCount = content.length
  const maxCharacters = 500
  const isOverLimit = characterCount > maxCharacters

  if (!activeAddress) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">You need to connect your wallet to create posts.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
            <button
              onClick={() => navigate('/app/feed')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* User Info */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring mr-3">
              <span className="text-white font-semibold">
                {activeAddress.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">You</div>
              <div className="text-sm text-gray-500">
                {activeAddress.slice(0, 8)}...{activeAddress.slice(-8)}
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening on Algorand?"
              className="w-full p-4 border-0 resize-none focus:ring-0 text-lg placeholder-gray-500 bg-gray-50 rounded-xl min-h-32"
              rows={6}
            />
            
            {/* Character Count */}
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                Share your thoughts with the Algorand community
              </div>
              <div className={`text-sm font-medium ${
                isOverLimit ? 'text-red-500' : 'text-gray-500'
              }`}>
                {characterCount}/{maxCharacters}
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Options */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-primary-500 transition-colors">
                <PhotoIcon className="w-5 h-5" />
                <span className="text-sm">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 4}
                />
              </label>
              
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <GifIcon className="w-5 h-5" />
                <span className="text-sm">GIF</span>
              </button>
              
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <FaceSmileIcon className="w-5 h-5" />
                <span className="text-sm">Emoji</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <MapPinIcon className="w-5 h-5" />
                  <span className="text-sm">Add Location</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-sm">Schedule</span>
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Warning (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Add a content warning..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Your post will be stored on the Algorand blockchain
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/app/feed')}
                className="btn btn-outline"
                disabled={isPosting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={!content.trim() || isOverLimit || isPosting}
                className="btn btn-primary px-8"
              >
                {isPosting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">💡 Tips for Great Posts</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Use hashtags to reach more people (#AlgorandDeFi, #Web3Social)</li>
          <li>• Share valuable insights about blockchain and DeFi</li>
          <li>• Engage with the community by asking questions</li>
          <li>• Quality content gets more upvotes and tips!</li>
        </ul>
      </div>
    </div>
  )
}

export default CreatePost