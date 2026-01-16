import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getChainIdsToPoll,
  getMarketData,
  getTokenExchangeRates,
  getTokensMarketData,
  getUseCurrencyRateCheck,
} from '../selectors';
import {
  tokenRatesStartPolling,
  tokenRatesStopPollingByPollingToken,
} from '../store/actions';
import {
  getCompletedOnboarding,
  getIsUnlocked,
} from '../ducks/metamask/metamask';
import useMultiPolling from './useMultiPolling';

const useTokenRatesPolling = () => {
  const completedOnboarding = useSelector(getCompletedOnboarding);
  const isUnlocked = useSelector(getIsUnlocked);
  const useCurrencyRateCheck = useSelector(getUseCurrencyRateCheck);
  const chainIds = useSelector(getChainIdsToPoll);

  const tokenExchangeRates = useSelector(getTokenExchangeRates);
  const tokensMarketData = useSelector(getTokensMarketData);
  const marketData = useSelector(getMarketData);

  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(completedOnboarding && isUnlocked && useCurrencyRateCheck);
  }, [completedOnboarding, isUnlocked, useCurrencyRateCheck]);

  const pollingConfig = {
    startPolling: tokenRatesStartPolling,
    stopPollingByPollingToken: tokenRatesStopPollingByPollingToken,
    input: enabled ? chainIds : [],
  };

  useEffect(() => {
    useMultiPolling(pollingConfig);
  }, [pollingConfig]);

  return {
    tokenExchangeRates,
    tokensMarketData,
    marketData,
  };
};

export default useTokenRatesPolling;
