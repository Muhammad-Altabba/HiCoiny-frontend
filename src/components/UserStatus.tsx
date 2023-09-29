import React, { useEffect, useState } from 'react';
import { authenticate } from '../services/authenticate';
import { RegisteredUser } from '../common/interfaces';
const {
  AccountsApi,
  FaucetsApi,
  Configuration,
} = require('@stacks/blockchain-api-client');

export let userDid: string | undefined;

const apiConfig = new Configuration({
  fetchApi: fetch,
  basePath: 'https://api.mainnet.hiro.so',
});
const accounts = new AccountsApi(apiConfig);

const apiConfigInTestnet = new Configuration({
  fetchApi: fetch,
  basePath: 'https://api.testnet.hiro.so',
});
const accountsOnTestnet = new AccountsApi(apiConfigInTestnet);

// Bitcoin faucet:
// new FaucetsApi(apiConfigInTestnet).runFaucetBtc({ address: 'tb1q8yfznxvskezf7kqjzrddajtz66663xt0yqyjxv' }).then(console.log);

export default function UserStatus() {
  const [userData, setUserData] = useState({} as RegisteredUser);

  useEffect(() => {
    authenticate().then(async (data) => {
      userDid = data?.decentralizedID;
      if (data?.profile?.stxAddress?.mainnet) {
        const balances = await accounts.getAccountBalance({
          principal: data.profile.stxAddress.mainnet,
        });
        console.log('mainnet balances', balances);
        data.profile.stxAddress.mainnetBalance = balances.stx.balance;
      }
      if (data?.profile?.stxAddress?.testnet) {
        const balances = await accountsOnTestnet.getAccountBalance({
          principal: data.profile.stxAddress.testnet,
        });
        console.log('testnet balances', balances);
        data.profile.stxAddress.testnetBalance = balances.stx.balance / 10 ** 6;
      }
      setUserData(data ?? ({} as RegisteredUser));
    });
  }, []);

  return (
    <div>
      <h3>My BitCoin Status</h3>
      <ul style={{ textAlign: 'left' }}>
        <li style={{ display: userData?.email ? 'inherit' : 'none' }}>
          Email: {userData?.email}
        </li>
        {/* <li>BTC Address (testnet): {userData?.profile?.btcAddress?.p2tr?.testnet}</li>

            <li>BTC Address (mainnet): {userData?.profile?.btcAddress?.p2tr?.mainnet}</li> 
            <br />
            sBTC:
            <li>sBTC Balance (testnet): 2.00</li>
            <li>sBTC Balance (mainnet): 11.50</li>
        */}

        {/* 
            <li>Stx Address (testnet): {userData?.profile?.stxAddress?.testnet}
                <br />Balance: {userData?.profile?.stxAddress?.testnetBalance}</li>
            <li>Stx Address (mainnet): {userData?.profile?.stxAddress?.mainnet}
                <br />Balance: {userData?.profile?.stxAddress?.mainnetBalance}</li> */}

        <li>sBTC Balance: 7.30</li>
        <li>STX Balance: {userData?.profile?.stxAddress?.testnetBalance}</li>

        <li>Decentralized Identity: {userData?.decentralizedID}</li>
      </ul>
    </div>
  );
}
