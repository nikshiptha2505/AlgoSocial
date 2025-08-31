import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { PlusIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { SocialMediaFactory } from '../contracts/SocialMedia'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const CreatePostQuick = () => {
  const [content, setContent] = useState('')
  const { activeAddress, transactionSigner } = useWallet()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })
  algorand.setDefaultSigner(transactionSigner)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !activeAddress) return

    try {
      // For demo: generate content_id from timestamp
      const contentId = `post-${Date.now()}`
      const contentHash = content // ideally hash(content) in prod

      const factory = new SocialMediaFactory({
        defaultSender: activeAddress,
        algorand,
      })

      const deployResult = await factory.deploy({
        onSchemaBreak: OnSchemaBreak.AppendApp,
        onUpdate: OnUpdate.AppendApp,
      })

      const { appClient } = deployResult

      await appClient.send.post_content({
        args: {
          content_id: new Uint8Array(Buffer.from(contentId)),
          content_hash: new Uint8Array(Buffer.from(contentHash)),
        },
      })

      enqueueSnackbar('✅ Post created successfully!', { variant: 'success' })
      setContent('')
    } catch (e: any) {
      enqueueSnackbar(`❌ Error creating post: ${e.message}`, { variant: 'error' })
    }
  }

  if (!activeAddress) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring flex-shrink-0">
          <span className="text-white font-semibold">
            {activeAddress.slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Input Area */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening on Algorand?"
              className="w-full p-4 border-0 resize-none focus:ring-0 text-lg placeholder-gray-500 bg-gray-50 rounded-xl"
              rows={3}
              maxLength={280}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <PhotoIcon className="w-5 h-5" />
                  <span className="text-sm">Photo</span>
                </button>

                <div className="text-sm text-gray-500">
                  {content.length}/280
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/app/create')}
                  className="btn btn-outline btn-sm"
                >
                  Advanced
                </button>

                <button
                  type="submit"
                  disabled={!content.trim() || content.length > 280}
                  className="btn btn-primary btn-sm px-6"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePostQuick
