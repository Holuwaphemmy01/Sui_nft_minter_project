import { SuiClientProvider, WalletProvider, ConnectButton } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Minter } from "./Minter";
import "@mysten/dapp-kit/dist/index.css";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();
const networks = { testnet: { url: getFullnodeUrl("testnet") } };

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Handle opening the modal with the selected NFT
  const openModal = (nft) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // NFT data for the showcase
  const nfts = [
    {
      src: "/assets/nft1.jpg",
      alt: "Iridescent Hand",
      title: "Iridescent Hand",
      description: "A stunning digital artwork minted on Sui.",
    },
    {
      src: "/assets/nft2.jpg",
      alt: "Fragmented Bust",
      title: "Fragmented Bust",
      description: "A surreal piece with crystalline elements on Sui.",
    },
    {
      src: "/assets/nft3.jpg",
      alt: "Cyberpunk Listener",
      title: "Cyberpunk Listener",
      description: "A futuristic vibe with glowing accents on Sui.",
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src="/assets/logo.png"
                    alt="MintEasy Logo"
                    className="h-12 w-12 rounded-full animate-pulse"
                  />
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">MintEasy</h1>
                    <p className="text-sm font-medium text-blue-100">
                      Create NFTs Effortlessly on Sui
                    </p>
                  </div>
                </div>
                <ConnectButton className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors" />
              </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto flex-grow py-8">
              {/* Description Section */}
              <section className="mb-12 text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to MintEasy</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
                  MintEasy is your gateway to creating NFTs on the Sui blockchain. Our platform makes it simple for anyone e.g artists, collectors, or enthusiasts to mint unique digital assets without complexity.
                </p>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Why is MintEasy important? By leveraging Sui’s fast and low-cost transactions, we empower you to own a piece of the Web3 future. Whether you’re showcasing art, building a brand, or exploring blockchain, MintEasy democratizes NFT creation, making it accessible and affordable. Join the digital revolution and start minting today!
                </p>
              </section>

              {/* Minter Section */}
              <section className="mb-12">
                <Minter />
              </section>

              {/* Showcase Section */}
              <section className="mt-12">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Explore Sample NFTs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => openModal(nft)}
                    >
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <img
                          src={nft.src}
                          alt={nft.alt}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800">{nft.title}</h3>
                        <p className="text-gray-600">{nft.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            {/* Modal for Enlarged NFT */}
            {isModalOpen && selectedNFT && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
                onClick={closeModal}
              >
                <div
                  className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto relative"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                  <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
                    onClick={closeModal}
                  >
                    ×
                  </button>
                  <img
                    src={selectedNFT.src}
                    alt={selectedNFT.alt}
                    className="w-full max-h-[60vh] object-contain mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-semibold text-gray-800 text-center mb-2">{selectedNFT.title}</h3>
                  <p className="text-gray-600 text-center">{selectedNFT.description}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6">
              <div className="container mx-auto text-center">
                <p className="mb-2">© 2025 MintEasy. All rights reserved.</p>
                <p className="text-sm">
                  Powered by the{" "}
                  <a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                    Sui Blockchain
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;