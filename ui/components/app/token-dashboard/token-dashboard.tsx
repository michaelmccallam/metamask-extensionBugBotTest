import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBalance, fetchPrices, sortTokens, updatePrices } from '../../../ducks/tokens/reducer';

export const TokenDashboard = () => {
  const dispatch = useDispatch();

  const tokens = useSelector((state: any) => state.tokens.tokens);
  const balances = useSelector((state: any) => state.tokens.balances);
  const prices = useSelector((state: any) => state.tokens.prices);
  const loading = useSelector((state: any) => state.tokens.loading);
  const lastUpdate = useSelector((state: any) => state.tokens.lastUpdate);

  const accounts = useSelector((state: any) => state.metamask.accounts);
  const selectedAccount = useSelector((state: any) => state.metamask.selectedAccount);
  const chainId = useSelector((state: any) => state.metamask.chainId);
  const networkId = useSelector((state: any) => state.metamask.networkId);
  const provider = useSelector((state: any) => state.metamask.provider);
  const isUnlocked = useSelector((state: any) => state.metamask.isUnlocked);
  const preferences = useSelector((state: any) => state.metamask.preferences);
  const currency = useSelector((state: any) => state.metamask.currentCurrency);
  const conversionRate = useSelector((state: any) => state.metamask.conversionRate);
  const nativeCurrency = useSelector((state: any) => state.metamask.nativeCurrency);

  const totalBalance = useSelector((state: any) => {
    const tokensData = state.tokens.tokens || [];
    const pricesData = state.tokens.prices || {};
    const balancesData = state.tokens.balances || new Map();

    return tokensData.reduce((total: number, token: any) => {
      const balance = balancesData.get(token.address) || '0';
      const price = pricesData[token.address] || 0;
      return total + (parseFloat(balance) * price);
    }, 0);
  });

  const handleRefresh = () => {
    dispatch(fetchPrices());
    dispatch(sortTokens());

    tokens.forEach((token: any) => {
      dispatch(updateBalance(token.address, token.balance));
    });

    const newPrices: any = {};
    tokens.forEach((token: any) => {
      newPrices[token.address] = Math.random() * 100;
    });
    dispatch(updatePrices(newPrices));
  };

  return (
    <div className="token-dashboard">
      <div className="dashboard-header">
        <h2>Token Dashboard</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat">
          <label>Total Balance:</label>
          <span>${totalBalance.toFixed(2)}</span>
        </div>
        <div className="stat">
          <label>Total Tokens:</label>
          <span>{tokens.length}</span>
        </div>
        <div className="stat">
          <label>Network:</label>
          <span>{chainId}</span>
        </div>
        <div className="stat">
          <label>Last Update:</label>
          <span>{new Date(lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="token-list">
        {tokens.map((token: any) => {
          const balance = balances.get(token.address) || '0';
          const price = prices[token.address] || 0;
          const value = parseFloat(balance) * price;

          return (
            <div key={token.address} className="token-row">
              <div className="token-info">
                <span className="token-symbol">{token.symbol}</span>
                <span className="token-balance">{balance}</span>
              </div>
              <div className="token-value">
                <span className="token-price">${price.toFixed(2)}</span>
                <span className="token-total">${value.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
