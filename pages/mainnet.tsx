import { useEffect, useState } from "react";
import { SecretNetworkClient } from "secretjs";
import { Coin } from "secretjs/dist/grpc_gateway/cosmos/base/v1beta1/coin.pb";
import { KeplrWindow } from "@/types";

const mainnetSecretJs = new SecretNetworkClient({
  url: "https://1rpc.io/scrt-lcd",
  chainId: "secret-4",
});

const sscrtAddress = "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek";

export default function Home() {
  const [mainnetAddress, setMainnetAddress] = useState<string | null>(null);
  const [mainnetBalances, setMainnetBalances] = useState<Coin[] | undefined>(
    undefined
  );
  const [viewingKey, setViewingKey] = useState<string | null>(null);
  const [params, setParams] = useState<any | null>(null);

  useEffect(() => {
    async function connectKeplr() {
      const keplr = (window as KeplrWindow).keplr;
      if (keplr) {
        await keplr.enable("secret-4");
        const keplrOfflineSignerMainnet =
          keplr.getOfflineSignerOnlyAmino("secret-4");
        const accountsMainnet = await keplrOfflineSignerMainnet.getAccounts();
        setMainnetAddress(accountsMainnet[0].address);
      } else {
        console.log("Keplr wallet not found");
      }
    }

    connectKeplr();
  }, []);

  useEffect(() => {
    async function fetchMainnetBalances() {
      if (!mainnetAddress) return;
      const { balances } = await mainnetSecretJs.query.bank.allBalances({
        address: mainnetAddress,
      });
      setMainnetBalances(balances);
    }
    fetchMainnetBalances();
    mainnetSecretJs.query.bank.balance({
      address: mainnetAddress ?? undefined,
    });
  }, [mainnetAddress]);

  useEffect(() => {
    const keplr = (window as KeplrWindow).keplr;
    if (!keplr) return;
    const tokenAddress = sscrtAddress;
    async function fetchViewingKey() {
      if (!mainnetAddress) return;

      const viewing_key = await keplr.getSecret20ViewingKey(
        "secret-4",
        tokenAddress
      );
      setViewingKey(viewing_key);
    }
    fetchViewingKey();
  }, [mainnetAddress]);

  useEffect(() => {
    async function getTokenBalance() {
      const { code_hash } =
        await mainnetSecretJs.query.snip20.codeHashByContractAddress({
          contract_address: sscrtAddress,
        });
      const params = await mainnetSecretJs.query.snip20.queryContract({
        contract_address: sscrtAddress,
        query: { balance: { address: mainnetAddress, key: viewingKey } },
        code_hash,
      });
      setParams(params);
    }
    getTokenBalance();
  }, [viewingKey, mainnetAddress]);

  return (
    <div className="bg-black text-white w-full flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold">Secret Network Mainnet Address</h1>
        {mainnetAddress ? mainnetAddress : "Connecting to Keplr Mainnet..."}
        <h1 className="text-xl font-bold mt-4">Mainnet allBalances JSON</h1>
        {!mainnetBalances
          ? "Loading balances..."
          : JSON.stringify(mainnetBalances)}
        <h1 className="text-xl font-bold mt-4">Viewing Key for sSCRT</h1>
        {viewingKey ? viewingKey : "Loading viewing key..."}
        <p>Current type: {typeof viewingKey}</p>
        <h1 className="text-xl font-bold mt-4">sSCRT params</h1>
        {!params ? "Loading params..." : JSON.stringify(params)}
      </div>
    </div>
  );
}
