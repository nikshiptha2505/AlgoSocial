import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs';

// Pages
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';

// Layout
import Layout from './components/Layout';

let supportedWallets: SupportedWallet[] = [];

if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
  const kmdConfig = getKmdConfigFromViteEnvironment();
  supportedWallets = [
    {
      id: WalletId.KMD,
      options: {
        baseServer: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ];
} else {
  supportedWallets = [
    { id: WalletId.DEFLY },
    { id: WalletId.PERA },
    { id: WalletId.EXODUS },
  ];
}

export default function App() {
  const algodConfig = getAlgodConfigFromViteEnvironment();

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    defaultNetwork: algodConfig.network,
    networks: {
      [algodConfig.network]: {
        algod: {
          baseServer: algodConfig.server,
          port: algodConfig.port,
          token: String(algodConfig.token),
        },
      },
    },
    options: {
      resetNetwork: true,
    },
  });

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
        <Router>
          <div className="min-h-screen bg-base-200">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/app" element={<Layout />}>
                <Route index element={<Feed />} />
                <Route path="feed" element={<Feed />} />
                <Route path="explore" element={<Explore />} />
                <Route path="profile/:address?" element={<Profile />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<Settings />} />
                <Route path="create" element={<CreatePost />} />
                <Route path="post/:id" element={<PostDetail />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </SnackbarProvider>
  );
}
