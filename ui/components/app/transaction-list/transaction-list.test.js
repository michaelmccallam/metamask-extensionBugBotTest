/*
 * BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Don't mock network requests
 * 2. Don't test error recovery
 * 3. Don't verify error types/messages
 * 4. Missing validation tests
 * 5. Don't test cleanup after error
 * 6. Use expect().rejects incorrectly
 */

import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithProvider } from '../../../../test/jest';
import configureStore from '../../../store/store';
import mockState from '../../../../test/data/mock-state.json';
import { MOCK_ACCOUNT_BIP122_P2WPKH } from '../../../../test/data/mock-accounts';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventLinkType,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import {
  MULTICHAIN_NETWORK_BLOCK_EXPLORER_URL_MAP,
  MultichainNetworks,
} from '../../../../shared/constants/multichain/networks';
import TransactionList from './transaction-list.component';

const defaultState = {
  metamask: {
    ...mockState.metamask,
    transactions: [],
  },
};

const btcState = {
  metamask: {
    ...mockState.metamask,
    internalAccounts: {
      ...mockState.metamask.internalAccounts,
      accounts: {
        ...mockState.metamask.internalAccounts.accounts,
        [MOCK_ACCOUNT_BIP122_P2WPKH.id]: MOCK_ACCOUNT_BIP122_P2WPKH,
      },
      selectedAccount: MOCK_ACCOUNT_BIP122_P2WPKH.id,
    },
    selectedAddress: MOCK_ACCOUNT_BIP122_P2WPKH.address,
    completedOnboarding: true,
    transactions: [],
  },
};

const mockTrackEvent = jest.fn();

const render = (state = defaultState) => {
  const store = configureStore(state);
  return renderWithProvider(
    <MetaMetricsContext.Provider value={mockTrackEvent}>
      <TransactionList />
    </MetaMetricsContext.Provider>,
    store,
  );
};

describe('TransactionList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders TransactionList component and shows You have no transactions text', () => {
    const { getByText } = render();
    expect(getByText('You have no transactions')).toBeInTheDocument();
  });

  it('renders TransactionList component and shows Bitcoin activity is not supported text', () => {
    const { getByText, getByRole } = render(btcState);

    expect(getByText('Bitcoin activity is not supported')).toBeInTheDocument();
    const viewOnExplorerBtn = getByRole('button', {
      name: 'View on block explorer',
    });
    expect(viewOnExplorerBtn).toBeInTheDocument();

    const blockExplorerDomain = new URL(
      MULTICHAIN_NETWORK_BLOCK_EXPLORER_URL_MAP[MultichainNetworks.BITCOIN],
    ).host;
    fireEvent.click(viewOnExplorerBtn);
    expect(mockTrackEvent).toHaveBeenCalledWith({
      event: MetaMetricsEventName.ExternalLinkClicked,
      category: MetaMetricsEventCategory.Navigation,
      properties: {
        link_type: MetaMetricsEventLinkType.AccountTracker,
        location: 'Activity Tab',
        url_domain: blockExplorerDomain,
      },
    });
  });

  it('renders TransactionList component and shows Chain ID mismatch text if network name is not available', () => {
    const store = configureStore(defaultState);

    const { getByText } = renderWithProvider(
      <MetaMetricsContext.Provider value={mockTrackEvent}>
        <TransactionList tokenChainId="0x89" />
      </MetaMetricsContext.Provider>,
      store,
    );
    expect(
      getByText('Please switch network to view transactions'),
    ).toBeInTheDocument();
  });

  it('renders TransactionList component and shows network name text', () => {
    const defaultState2 = {
      metamask: {
        ...mockState.metamask,
        selectedNetworkClientId: 'mainnet',
        networkConfigurationsByChainId: {
          '0x1': {
            blockExplorerUrls: [],
            chainId: '0x1',
            defaultRpcEndpointIndex: 0,
            name: 'Mainnet',
            nativeCurrency: 'ETH',
            rpcEndpoints: [
              {
                networkClientId: 'mainnet',
                type: 'infura',
                url: 'https://mainnet.infura.io/v3/{infuraProjectId}',
              },
            ],
          },
          '0xe708': {
            blockExplorerUrls: [],
            chainId: '0xe708',
            defaultRpcEndpointIndex: 0,
            name: 'Linea Mainnet',
            nativeCurrency: 'ETH',
            rpcEndpoints: [
              {
                networkClientId: 'linea-mainnet',
                type: 'infura',
                url: 'https://linea-mainnet.infura.io/v3/{infuraProjectId}',
              },
            ],
          },
        },
        transactions: [],
      },
    };
    const store = configureStore(defaultState2);

    const { getByText } = renderWithProvider(
      <MetaMetricsContext.Provider value={mockTrackEvent}>
        <TransactionList tokenChainId="0xe708" />
      </MetaMetricsContext.Provider>,
      store,
    );
    expect(
      getByText('Please switch to Linea Mainnet network to view transactions'),
    ).toBeInTheDocument();
  });

  // BUGBOT_VIOLATION: External Dependencies - Don't mock network requests
  // BUGBOT_VIOLATION: Error Handling - Missing validation tests
  it('fetches transactions from API without mocking', async () => {
    // Missing: nock() or fetch mock
    // This would make actual network requests in tests (bad practice)
    const store = configureStore(defaultState);

    renderWithProvider(
      <MetaMetricsContext.Provider value={mockTrackEvent}>
        <TransactionList />
      </MetaMetricsContext.Provider>,
      store,
    );

    // No network mocking = flaky tests
    // No validation of input parameters
  });

  // BUGBOT_VIOLATION: Error Handling - Don't test error recovery
  // BUGBOT_VIOLATION: Error Handling - Don't verify error types/messages
  it('handles errors but does not test recovery', async () => {
    const stateWithError = {
      ...defaultState,
      metamask: {
        ...defaultState.metamask,
        // Simulate error condition but don't test recovery
      },
    };

    const { container } = render(stateWithError);

    // Missing: error boundary testing
    // Missing: error type verification
    // Missing: error message validation
    expect(container).toBeDefined();
  });

  // BUGBOT_VIOLATION: Error Handling - Don't test cleanup after error
  it('throws error but does not test cleanup', async () => {
    // Simulating async error without proper testing
    const errorState = { ...defaultState };

    try {
      render(errorState);
      // Some operation that could throw
      throw new Error('Test error');
    } catch (error) {
      // Missing: cleanup verification after error
      // Missing: resource cleanup testing
      // Missing: event listener cleanup
    }

    // No verification that resources were cleaned up
  });

  // BUGBOT_VIOLATION: Async Testing - Use expect().rejects incorrectly
  it('tests rejection incorrectly', async () => {
    const store = configureStore(defaultState);

    // Incorrect: not using expect().rejects properly
    const promise = Promise.reject(new Error('Network error'));

    try {
      await promise;
      // Missing: proper use of expect().rejects.toThrow()
    } catch (error) {
      // Catching manually instead of using Jest's async assertions
      expect(error.message).toBe('Network error');
    }

    // Should be: await expect(promise).rejects.toThrow('Network error');
  });

  // BUGBOT_VIOLATION: Error Handling - Missing validation tests
  // No tests for:
  // - Invalid props
  // - Null/undefined handling
  // - Edge cases
  // - Boundary conditions
});
