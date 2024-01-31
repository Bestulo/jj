import { useEffect, useState } from "react";
import { SecretNetworkClient } from "secretjs";
import { Coin } from "secretjs/dist/grpc_gateway/cosmos/base/v1beta1/coin.pb";

interface KeplrWindow extends Window {
  keplr: any;
}
declare let window: KeplrWindow;

const testnetSecretJs = new SecretNetworkClient({
  url: "https://api.pulsar3.scrttestnet.com",
  chainId: "secret-4",
});



const mainnetSecretJs = new SecretNetworkClient({
  url: "https://1rpc.io/scrt-lcd",
  chainId: "secret-4",
});


export default function Home() {
  const [mainnetAddress, setMainnetAddress] = useState<string | null>(null);
  const [testnetAddress, setTestnetAddress] = useState<string | null>(null);
  const [testnetBalances, setTestnetBalances] = useState<Coin[] | undefined>(undefined);
  const [mainnetBalances, setMainnetBalances] = useState<Coin[] | undefined>(undefined);
  const [viewingKey, setViewingKey] = useState<string | null>(null);

  useEffect(() => {
    async function connectKeplr() {
      if (window.keplr) {
        // Enable for mainnet
        await window.keplr.enable("secret-4");
        const keplrOfflineSignerMainnet = window.keplr.getOfflineSignerOnlyAmino("secret-4");
        const accountsMainnet = await keplrOfflineSignerMainnet.getAccounts();
        setMainnetAddress(accountsMainnet[0].address);

        // Enable for testnet
        await window.keplr.enable("pulsar-3");
        const keplrOfflineSignerTestnet = window.keplr.getOfflineSignerOnlyAmino("pulsar-3");
        const accountsTestnet = await keplrOfflineSignerTestnet.getAccounts();
        setTestnetAddress(accountsTestnet[0].address);
      } else {
        console.log("Keplr wallet not found");
      }
    }

    connectKeplr();
  }, []);

  useEffect(() => {
    async function fetchTestnetBalances() {
      if (!testnetAddress) return;

      // Assuming you want to fetch balances for the mainnet address
      const { balances } = await testnetSecretJs.query.bank.allBalances({ address: testnetAddress });
      setTestnetBalances(balances);
    }
    fetchTestnetBalances();
  }, [testnetAddress]);
  useEffect(() => {
    async function fetchMainnetBalances() {
      if (!mainnetAddress) return;

      // Assuming you want to fetch balances for the mainnet address
      const { balances } = await mainnetSecretJs.query.bank.allBalances({ address: mainnetAddress });
      setMainnetBalances(balances);
    }
    fetchMainnetBalances();
  }, [mainnetAddress]);

  // attempt to get the viewing key for secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek address
  useEffect(() => {
    const tokenAddress = "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek";
    async function fetchViewingKey() {
      if (!mainnetAddress) return;

      // Assuming you want to fetch balances for the mainnet address
      const { viewing_key } = await window.keplr.getSecret20ViewingKey("secret-4", tokenAddress);
      setViewingKey(viewing_key);
    }
    fetchViewingKey();
  }, [mainnetAddress]);


  return (
    <div className="bg-black w-screen flex justify-center mt-20">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold">Secret Network Mainnet Address</h1>
        {mainnetAddress ? mainnetAddress : "Connecting to Keplr Mainnet..."}

        <h1 className="text-xl font-bold mt-4">Secret Network Testnet Address</h1>
        {testnetAddress ? testnetAddress : "Connecting to Keplr Testnet..."}

        <h1 className="text-xl font-bold mt-4">Testnet allBalances JSON</h1>
        {!testnetBalances ? "Loading balances..." : JSON.stringify(testnetBalances)}

        <h1 className="text-xl font-bold mt-4">Mainnet allBalances JSON</h1>
        {!mainnetBalances ? "Loading balances..." : JSON.stringify(mainnetBalances)}
      </div>
    </div>
  );
}
