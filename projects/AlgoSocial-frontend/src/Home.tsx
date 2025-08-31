// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'

// Import contract call components (you’ll create these like Transact/AppCalls)
import PostContent from './components/PostContent'
import VoteContent from './components/VoteContent'
import TipCreator from './components/TipCreator'
import CommentBox from './components/CommentBox'
import ReputationCheck from './components/ReputationCheck'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)

  // New state for contract interaction modals
  const [postModal, setPostModal] = useState<boolean>(false)
  const [voteModal, setVoteModal] = useState<boolean>(false)
  const [tipModal, setTipModal] = useState<boolean>(false)
  const [commentModal, setCommentModal] = useState<boolean>(false)
  const [repModal, setRepModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  return (
    <div className="hero min-h-screen bg-teal-400">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <h1 className="text-4xl">
            Welcome to <div className="font-bold">AlgoKit Social DApp 🚀</div>
          </h1>
          <p className="py-6">
            Interact with the <b>Social Media Smart Contract</b>: Post, Vote, Comment, Tip, and check reputation directly from this UI.
          </p>

          <div className="grid">
            <a
              data-test-id="getting-started"
              className="btn btn-primary m-2"
              target="_blank"
              href="https://github.com/algorandfoundation/algokit-cli"
            >
              Getting started
            </a>

            <div className="divider" />

            {/* Wallet connection */}
            <button data-test-id="connect-wallet" className="btn m-2" onClick={() => setOpenWalletModal(!openWalletModal)}>
              Wallet Connection
            </button>

            {/* Show contract actions only if wallet is connected */}
            {activeAddress && (
              <>
                <button className="btn m-2" onClick={() => setPostModal(true)}>
                  📌 Post Content
                </button>

                <button className="btn m-2" onClick={() => setVoteModal(true)}>
                  👍👎 Vote Content
                </button>

                <button className="btn m-2" onClick={() => setTipModal(true)}>
                  💰 Tip Creator
                </button>

                <button className="btn m-2" onClick={() => setCommentModal(true)}>
                  💬 Add Comment
                </button>

                <button className="btn m-2" onClick={() => setRepModal(true)}>
                  ⭐ Check Reputation
                </button>
              </>
            )}
          </div>

          {/* Existing Modals */}
          <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
          <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
          <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />

          {/* New Contract Interaction Modals */}
          <PostContent openModal={postModal} setModalState={setPostModal} />
          <VoteContent openModal={voteModal} setModalState={setVoteModal} />
          <TipCreator openModal={tipModal} setModalState={setTipModal} />
          <CommentBox openModal={commentModal} setModalState={setCommentModal} />
          <ReputationCheck openModal={repModal} setModalState={setRepModal} />
        </div>
      </div>
    </div>
  )
}

export default Home
