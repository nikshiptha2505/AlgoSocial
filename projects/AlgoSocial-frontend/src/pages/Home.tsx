import { useWallet } from '@txnlab/use-wallet-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import ConnectWallet from '../components/ConnectWallet'

const Home = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const { activeAddress } = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    if (activeAddress) {
      navigate('/app')
    }
  }, [activeAddress, navigate])

  const features = [
    {
      icon: UserGroupIcon,
      title: 'Connect & Share',
      description: 'Build meaningful connections with the Algorand community'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Engage & Discuss',
      description: 'Join conversations about blockchain, DeFi, and more'
    },
    {
      icon: HeartIcon,
      title: 'Support Creators',
      description: 'Tip your favorite content creators with ASA tokens'
    },
    {
      icon: SparklesIcon,
      title: 'Earn Rewards',
      description: 'Get rewarded for quality content and engagement'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <SparklesIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce-subtle"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="gradient-text">AlgoSocial</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The first decentralized social media platform built on Algorand. 
              Connect, share, and earn in a truly decentralized ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setOpenWalletModal(true)}
                className="btn btn-lg btn-gradient hover-lift px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              
              <button className="btn btn-lg btn-outline btn-primary px-8 py-4 text-lg font-semibold rounded-xl hover-lift">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AlgoSocial?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience social media the way it should be - decentralized, rewarding, and community-driven.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover-lift border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-xl opacity-90">Active Users</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-xl opacity-90">Posts Created</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-xl opacity-90">ALGO Tipped</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect your Algorand wallet and start your decentralized social media journey today.
          </p>
          <button
            onClick={() => setOpenWalletModal(true)}
            className="btn btn-lg btn-gradient hover-lift px-12 py-4 text-lg font-semibold rounded-xl shadow-lg"
          >
            Connect Wallet & Start
          </button>
        </div>
      </div>

      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
    </div>
  )
}

export default Home