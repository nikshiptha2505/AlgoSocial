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
import { Picker } from 'emoji-mart' // npm install emoji-mart
import 'emoji-mart/css/emoji-mart.css'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { activeAddress } = useWallet()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsPosting(true)
    try {
      // Call smart contract or backend API
      console.log('Creating post:', { content, images })
      await new Promise(resolve => setTimeout(resolve, 2000))
      navigate('/app/feed')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    const selected = Array.from(files)
    setImages(prev => [...prev, ...selected].slice(0, 4))
  }

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index))

  const addEmoji = (emoji: any) => setContent(prev => prev + emoji.native)

  const maxCharacters = 500
  const characterCount = content.length
  const isOverLimit = characterCount > maxCharacters

  if (!activeAddress) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Connect Your Wallet</h2>
        <p className="text-gray-600 text-lg">You need to connect your wallet to create posts.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Post Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-transform hover:scale-[1.01] duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Post</h1>
          <button
            onClick={() => navigate('/app/feed')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {activeAddress.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">You</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeAddress.slice(0, 8)}...{activeAddress.slice(-8)}
              </p>
            </div>
          </div>

          {/* Content Input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening on Algorand?"
              className="w-full p-5 border-0 resize-none focus:ring-0 text-lg placeholder-gray-400 dark:placeholder-gray-500 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-2xl min-h-[120px]"
              rows={6}
            />
            <div className="absolute bottom-3 right-5 text-sm font-medium text-gray-500 dark:text-gray-400">
              {characterCount}/{maxCharacters}
            </div>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute bottom-3 left-5 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary-500 transition-colors"
            >
              <FaceSmileIcon className="w-5 h-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-10">
                <Picker onSelect={addEmoji} theme="light" />
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-4 cursor-pointer hover:border-primary-500 transition-colors"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <p className="text-gray-500 dark:text-gray-400 text-center">Click or drag images here (max 4)</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`upload-${i}`}
                    className="w-full h-36 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Advanced Options */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-primary-500 hover:text-primary-600 text-sm font-semibold transition-colors"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
          </div>

          {showAdvanced && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 space-y-4 transition-all">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
                  <MapPinIcon className="w-5 h-5" />
                  <span className="text-sm">Add Location</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-sm">Schedule</span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Warning (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Add a content warning..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Your post will be stored on Algorand blockchain</p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/app/feed')}
                className="btn btn-outline px-6"
                disabled={isPosting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-8 flex items-center justify-center"
                disabled={!content.trim() || isOverLimit || isPosting}
              >
                {isPosting ? <LoadingSpinner size="sm" /> : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
