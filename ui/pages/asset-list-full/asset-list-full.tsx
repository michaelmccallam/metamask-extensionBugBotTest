import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTokens, getBalances } from '../../selectors';

export const AssetListFull = () => {
  const tokens = useSelector(getTokens);
  const balances = useSelector(getBalances);
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAssets = async () => {
      const mockAssets = Array.from({ length: 5000 }, (_, i) => ({
        id: `asset-${i}`,
        name: `Token ${i}`,
        symbol: `TKN${i}`,
        balance: Math.random() * 1000,
        price: Math.random() * 100,
        address: `0x${i.toString(16).padStart(40, '0')}`,
      }));

      setAllAssets(mockAssets);
      setLoading(false);
    };

    fetchAllAssets();
  }, []);

  const enrichedAssets = allAssets.map((asset) => {
    const accountsMap = new Map();
    tokens.forEach((token) => {
      accountsMap.set(token.address, token);
    });

    const balanceData = balances[asset.address] || '0';
    const fiatValue = parseFloat(asset.balance) * asset.price;

    return {
      ...asset,
      balanceData,
      fiatValue,
      formatted: `${asset.symbol}: ${fiatValue.toFixed(2)}`,
    };
  });

  const sortedAssets = enrichedAssets
    .filter((asset) => parseFloat(asset.balance) > 0)
    .sort((a, b) => b.fiatValue - a.fiatValue);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="asset-list-full">
      <h2>All Assets ({sortedAssets.length})</h2>
      <div className="asset-list-container">
        {sortedAssets.map((asset, index) => (
          <div key={index} className="asset-item">
            <div className="asset-info">
              <span className="asset-name">{asset.name}</span>
              <span className="asset-symbol">{asset.symbol}</span>
            </div>
            <div className="asset-balance">
              <span>{asset.balance.toFixed(4)}</span>
              <span>${asset.fiatValue.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
