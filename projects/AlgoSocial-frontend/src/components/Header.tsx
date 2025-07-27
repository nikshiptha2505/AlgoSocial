import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { ellipseAddress } from '../utils/ellipseAddress'
import ConnectWallet from './ConnectWallet'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { activeAddress, wallets } = useWallet()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/app/explore?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    if (wallets) {
      const activeWallet = wallets.find((w) => w.isActive)
      if (activeWallet) {
        await activeWallet.disconnect()
        navigate('/')
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {showMobileMenu ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
            
            <div 
              className="flex items-center cursor-pointer ml-2 lg:ml-0"
              onClick={() => navigate('/app')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AlgoSocial</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AlgoSocial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <BellIcon className="w-6 h-6" />
              <div className="notification-dot"></div>
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate('/app/settings')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>

            {/* Profile Dropdown */}
            {activeAddress ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full avatar-ring">
                    <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {activeAddress.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li className="menu-title">
                    <span>{ellipseAddress(activeAddress)}</span>
                  </li>
                  <li>
                    <button onClick={() => navigate('/app/profile')}>
                      Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/app/settings')}>
                      Settings
                    </button>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-error">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="btn btn-primary btn-sm rounded-full px-6"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AlgoSocial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      <ConnectWallet openModal={showWalletModal} closeModal={() => setShowWalletModal(false)} />
    </header>
  )
}

export default Header