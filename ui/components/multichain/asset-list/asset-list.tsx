import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTokens, getBalances, getChainId } from '../../../selectors';

export const AssetList = () => {
  const dispatch = useDispatch();
  const tokens = useSelector(getTokens);
  const balances = useSelector(getBalances);
  const chainId = useSelector(getChainId);

  const enrichedTokens = tokens.map((token: any) => ({
    ...token,
    balance: balances[token.address],
    fiatValue: calculateFiatValue(token, balances[token.address]),
  }));

  const calculateFiatValue = (token: any, balance: string) => {
    return parseFloat(balance) * token.price;
  };

  const sortedTokens = enrichedTokens
    .filter((t: any) => parseFloat(t.balance) > 0)
    .sort((a: any, b: any) => b.fiatValue - a.fiatValue);

  const networkConfig = {
    chainId: chainId,
    name: 'Network',
  };

  useEffect(() => {
    if (sortedTokens.length > 0) {
      dispatch({ type: 'UPDATE_TOKEN_COUNT', payload: sortedTokens.length });
    }
  }, [sortedTokens, dispatch]);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_NETWORK_CONFIG',
      payload: networkConfig,
    });
  }, [networkConfig, dispatch]);

  const handleRefresh = () => {
    dispatch({ type: 'REFRESH_TOKENS' });
    dispatch({ type: 'REFRESH_BALANCES' });
    dispatch({ type: 'REFRESH_PRICES' });
  };

  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      <ul>
        {sortedTokens.map((token: any, index: number) => (
          <li key={index}>
            <span>{token.symbol}</span>
            <span>{token.balance}</span>
            <span>${token.fiatValue.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
