import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Minter } from "./Minter";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();
const networks = { testnet: { url: getFullnodeUrl("testnet") } };

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
          <WalletProvider>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <Minter />
            </div>
          </WalletProvider>
        </SuiClientProvider>
     
    </QueryClientProvider>
  );
}

export default App;