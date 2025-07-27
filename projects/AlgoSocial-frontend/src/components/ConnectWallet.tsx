import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import Account from './Account'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <div className={`fixed inset-0 z-50 ${openModal ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
          <h3 className="font-bold text-2xl mb-6 text-center">Connect Your Wallet</h3>

          {activeAddress && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <Account />
            </div>
          )}

          <div className="space-y-3 mb-6">
            {!activeAddress &&
              wallets?.map((wallet) => (
                <button
                  data-test-id={`${wallet.id}-connect`}
                  className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 hover:border-primary-500 rounded-xl transition-all hover-lift"
                  key={`provider-${wallet.id}`}
                  onClick={() => {
                    return wallet.connect()
                  }}
                >
                  {!isKmd(wallet) && (
                    <img
                      alt={`wallet_icon_${wallet.id}`}
                      src={wallet.metadata.icon}
                      style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                    />
                  )}
                  <span className="font-medium">
                    {isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}
                  </span>
                </button>
              ))}
          </div>

          <div className="flex space-x-3">
            <button
              data-test-id="close-wallet-modal"
              className="flex-1 btn btn-outline"
              onClick={() => {
                closeModal()
              }}
            >
              Close
            </button>
            {activeAddress && (
              <button
                className="flex-1 btn btn-error"
                data-test-id="logout"
                onClick={async () => {
                  if (wallets) {
                    const activeWallet = wallets.find((w) => w.isActive)
                    if (activeWallet) {
                      await activeWallet.disconnect()
                    } else {
                      // Required for logout/cleanup of inactive providers
                      // For instance, when you login to localnet wallet and switch network
                      // to testnet/mainnet or vice verse.
                      localStorage.removeItem('@txnlab/use-wallet:v3')
                      window.location.reload()
                    }
                  }
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ConnectWallet
