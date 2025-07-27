import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  PaintBrushIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { ellipseAddress } from '../utils/ellipseAddress'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    posts: true,
    comments: true,
    tips: true,
    follows: false,
    mentions: true,
  })
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    website: '',
    location: '',
  })
  const { activeAddress, wallets } = useWallet()

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon },
    { id: 'wallet', name: 'Wallet', icon: CurrencyDollarIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'about', name: 'About', icon: InformationCircleIcon },
  ]

  const handleLogout = async () => {
    if (wallets) {
      const activeWallet = wallets.find((w) => w.isActive)
      if (activeWallet) {
        await activeWallet.disconnect()
        window.location.href = '/'
      }
    }
  }

  const handleSaveProfile = () => {
    // Here you would save the profile to your smart contract or backend
    console.log('Saving profile:', profile)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  if (!activeAddress) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">You need to connect your wallet to access settings.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center avatar-ring">
                      <span className="text-white font-bold text-2xl">
                        {activeAddress.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <button className="btn btn-outline btn-sm">Change Avatar</button>
                      <p className="text-sm text-gray-500 mt-1">Upload a custom avatar image</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your display name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://your-website.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <button onClick={handleSaveProfile} className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {key === 'posts' && 'New Posts from Following'}
                          {key === 'comments' && 'Comments on Your Posts'}
                          {key === 'tips' && 'Tips Received'}
                          {key === 'follows' && 'New Followers'}
                          {key === 'mentions' && 'Mentions'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {key === 'posts' && 'Get notified when people you follow create new posts'}
                          {key === 'comments' && 'Get notified when someone comments on your posts'}
                          {key === 'tips' && 'Get notified when you receive tips'}
                          {key === 'follows' && 'Get notified when someone follows you'}
                          {key === 'mentions' && 'Get notified when someone mentions you'}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNotificationChange(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy & Security</h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Wallet Address</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Your wallet address is public on the blockchain and cannot be hidden.
                    </p>
                    <div className="font-mono text-sm bg-white p-2 rounded border">
                      {activeAddress}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Data Privacy</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Make my profile discoverable in search</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Allow others to tip me</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Show my activity status</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Wallet Settings</h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Connected Wallet</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {ellipseAddress(activeAddress)}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline btn-error btn-sm"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Disconnect Wallet
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Transaction Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Tip Amount (ALGO)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          defaultValue="1.0"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Appearance</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 border-2 border-primary-500 rounded-lg cursor-pointer">
                        <div className="w-full h-16 bg-white rounded mb-2"></div>
                        <div className="text-sm font-medium text-center">Light</div>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                        <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                        <div className="text-sm font-medium text-center">Dark</div>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                        <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                        <div className="text-sm font-medium text-center">Auto</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Font Size</h4>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Small</option>
                      <option selected>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">About AlgoSocial</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Version</h4>
                    <p className="text-gray-600">AlgoSocial v1.0.0</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Built on Algorand</h4>
                    <p className="text-gray-600 mb-3">
                      AlgoSocial is a decentralized social media platform built on the Algorand blockchain.
                      All posts and interactions are stored on-chain, ensuring transparency and censorship resistance.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Links</h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-primary-500 hover:text-primary-600">Documentation</a>
                      <a href="#" className="block text-primary-500 hover:text-primary-600">GitHub Repository</a>
                      <a href="#" className="block text-primary-500 hover:text-primary-600">Discord Community</a>
                      <a href="#" className="block text-primary-500 hover:text-primary-600">Terms of Service</a>
                      <a href="#" className="block text-primary-500 hover:text-primary-600">Privacy Policy</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings