import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { SocialMediaFactory } from '../contracts/SocialMedia' // generated from our contract
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [contentId, setContentId] = useState<string>('')
  const [contentHash, setContentHash] = useState<string>('')
  const [voteType, setVoteType] = useState<'up' | 'down'>('up')

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })
  algorand.setDefaultSigner(transactionSigner)

  // Deploy + return app client
  const getAppClient = async () => {
    const factory = new SocialMediaFactory({
      defaultSender: activeAddress ?? undefined,
      algorand,
    })

    const deployResult = await factory.deploy({
      onSchemaBreak: OnSchemaBreak.AppendApp,
      onUpdate: OnUpdate.AppendApp,
    })

    return deployResult.appClient
  }

  const handlePost = async () => {
    setLoading(true)
    try {
      const appClient = await getAppClient()
      await appClient.send.post_content({
        args: { content_id: new Uint8Array(Buffer.from(contentId)), content_hash: new Uint8Array(Buffer.from(contentHash)) },
      })
      enqueueSnackbar(`✅ Posted content with ID ${contentId}`, { variant: 'success' })
    } catch (e: any) {
      enqueueSnackbar(`Error posting: ${e.message}`, { variant: 'error' })
    }
    setLoading(false)
  }

  const handleVote = async () => {
    setLoading(true)
    try {
      const appClient = await getAppClient()
      await appClient.send.vote({
        args: { content_id: new Uint8Array(Buffer.from(contentId)), is_upvote: voteType === 'up' ? 1n : 0n },
      })
      enqueueSnackbar(`✅ ${voteType === 'up' ? 'Upvoted' : 'Downvoted'} ${contentId}`, { variant: 'success' })
    } catch (e: any) {
      enqueueSnackbar(`Error voting: ${e.message}`, { variant: 'error' })
    }
    setLoading(false)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Interact with Social Media Contract</h3>

        <div className="py-2">
          <input
            type="text"
            placeholder="Content ID"
            className="input input-bordered w-full my-1"
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Content Hash"
            className="input input-bordered w-full my-1"
            value={contentHash}
            onChange={(e) => setContentHash(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 my-4">
          <button className="btn btn-primary" type="button" onClick={handlePost} disabled={loading}>
            {loading ? <span className="loading loading-spinner" /> : '📌 Post Content'}
          </button>

          <div className="flex justify-between">
            <button className="btn btn-success" type="button" onClick={() => { setVoteType('up'); handleVote() }} disabled={loading}>
              👍 Upvote
            </button>
            <button className="btn btn-error" type="button" onClick={() => { setVoteType('down'); handleVote() }} disabled={loading}>
              👎 Downvote
            </button>
          </div>
        </div>

        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls
