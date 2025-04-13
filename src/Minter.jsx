import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction, ConnectButton } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export function Minter() {
  const [txDigest, setTxDigest] = useState(null);
  const [error, setError] = useState(null);
  const [nfts, setNfts] = useState([]);
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({ client });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!account) {
      setNfts([]);
      return;
    }

    const fetchNFTs = async () => {
      try {
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          options: { showType: true, showContent: true },
        });

        const nftList = ownedObjects.data
          .filter((obj) => obj.data?.type === "0x083eae7e8a098ee15486692c654bfd6a3850ba967b0e6a804a11dfc7dadec2b1::sui_nft::NFT")
          .map((obj) => ({
            objectId: obj.data?.objectId || "",
            name: obj.data?.content?.fields.name || "Unknown",
            description: obj.data?.content?.fields.description || "Unknown",
            timestamp: obj.data?.content?.fields.timestamp || 0,
          }));

        setNfts(nftList);
      } catch (err) {
        setError(`Failed to fetch NFTs: ${err.message}`);
      }
    };

    fetchNFTs();
  }, [account, client]);

  const onSubmit = async (data) => {
    if (!account) {
      setError("Please connect your wallet");
      return;
    }

    setError(null);
    setTxDigest(null);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: "0x083eae7e8a098ee15486692c654bfd6a3850ba967b0e6a804a11dfc7dadec2b1::sui_nft::mint",
        arguments: [
          tx.pure.string(data.name),
          tx.pure.string(data.description),
          tx.object("0x6"),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setTxDigest(result.digest);
            reset();
            fetchNFTs();
          },
          onError: (err) => {
            setError(`Transaction failed: ${err.message}`);
          },
        }
      );
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Akinzo NFT Minter</h1>
      <div className="mb-4">
        <ConnectButton />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register("name", { required: true })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="NFT Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            {...register("description", { required: true })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="NFT Description"
          />
        </div>
        <button
          type="submit"
          disabled={!account}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Mint NFT
        </button>
      </form>
      {txDigest && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
          NFT Minted! Transaction Digest: {txDigest}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      {nfts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Your NFTs</h2>
          <div className="grid grid-cols-1 gap-4">
            {nfts.map((nft) => (
              <div key={nft.objectId} className="p-4 bg-gray-50 rounded-md border">
                <p><strong>Name:</strong> {nft.name}</p>
                <p><strong>Description:</strong> {nft.description}</p>
                <p><strong>Timestamp:</strong> {nft.timestamp} ms</p>
                <p><strong>Object ID:</strong> {nft.objectId}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}