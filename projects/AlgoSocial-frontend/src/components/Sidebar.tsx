import { useLocation, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  PlusIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserIcon as UserIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  FireIcon as FireIconSolid
} from '@heroicons/react/24/solid'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      name: 'Feed',
      path: '/app/feed',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Explore',
      path: '/app/explore',
      icon: MagnifyingGlassIcon,
      iconSolid: MagnifyingGlassIconSolid,
    },
    {
      name: 'Profile',
      path: '/app/profile',
      icon: UserIcon,
      iconSolid: UserIconSolid,
    },
    {
      name: 'Messages',
      path: '/app/messages',
      icon: ChatBubbleLeftRightIcon,
      iconSolid: ChatBubbleLeftRightIconSolid,
    },
    {
      name: 'Settings',
      path: '/app/settings',
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/app/feed') {
      return location.pathname === '/app' || location.pathname === '/app/feed'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex flex-col flex-grow px-4">
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const Icon = isActive(item.path) ? item.iconSolid : item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all hover-lift ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
                    {item.name}
                  </button>
                )
              })}
            </nav>

            {/* Create Post Button */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/app/create')}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover-lift shadow-lg transition-all"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Post
              </button>
            </div>

            {/* Trending Section */}
            <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
              <div className="flex items-center mb-3">
                <FireIconSolid className="w-5 h-5 text-primary-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Trending</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">#AlgorandDeFi</div>
                <div className="text-sm text-gray-600">#Web3Social</div>
                <div className="text-sm text-gray-600">#AlgoNFTs</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = isActive(item.path) ? item.iconSolid : item.icon
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-1 ${
                  isActive(item.path)
                    ? 'text-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            )
          })}
          <button
            onClick={() => navigate('/app/create')}
            className="flex flex-col items-center py-2 px-1 text-primary-500"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs mt-1">Create</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar