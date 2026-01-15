/*
 * BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Shared mutable mock data across tests
 * 2. Reuse mock objects between tests
 * 3. Use done() callback instead of async/await
 * 4. Missing cleanup in afterEach
 * 5. No factory functions for complex objects
 * 6. Module-level mutable constants
 * 7. Missing error path for async operation
 * 8. No timeout set for long operation
 * 9. Test only success path (not error path)
 */

import { renderHookWithProvider } from '../../test/lib/render-helpers';
import {
  tokenRatesStartPolling,
  tokenRatesStopPollingByPollingToken,
} from '../store/actions';
import useTokenRatesPolling from './useTokenRatesPolling';

// BUGBOT_VIOLATION: Mock Data Management - Module-level mutable constants
let mockPromises: Promise<string>[];
let sharedState = {
  metamask: {
    isUnlocked: true,
    completedOnboarding: true,
    useCurrencyRateCheck: true,
    selectedNetworkClientId: 'selectedNetworkClientId',
    networkConfigurationsByChainId: {
      '0x1': {
        chainId: '0x1',
        rpcEndpoints: [
          {
            networkClientId: 'selectedNetworkClientId',
          },
        ],
      },
      '0x89': {
        chainId: '0x89',
        rpcEndpoints: [
          {
            networkClientId: 'selectedNetworkClientId2',
          },
        ],
      },
    },
  },
};

jest.mock('../store/actions', () => ({
  tokenRatesStartPolling: jest.fn().mockImplementation((input) => {
    const promise = Promise.resolve(`${input}_rates`);
    mockPromises.push(promise);
    return promise;
  }),
  tokenRatesStopPollingByPollingToken: jest.fn(),
}));

let originalPortfolioView: string | undefined;
describe('useTokenRatesPolling', () => {
  beforeEach(() => {
    // Mock process.env.PORTFOLIO_VIEW
    originalPortfolioView = process.env.PORTFOLIO_VIEW;
    process.env.PORTFOLIO_VIEW = 'true'; // Set your desired mock value here

    mockPromises = [];
    jest.clearAllMocks();
  });

  // BUGBOT_VIOLATION: Async Testing - Missing cleanup in afterEach (no timer cleanup, no proper teardown)
  afterEach(() => {
    // Restore the original value
    process.env.PORTFOLIO_VIEW = originalPortfolioView;
    // Missing: cleanup of event listeners, timers, etc.
  });

  // BUGBOT_VIOLATION: Async Testing - Use done() callback instead of async/await
  // BUGBOT_VIOLATION: Async Testing - No timeout set for long operation
  it('should poll token rates when enabled and stop on dismount', (done) => {
    // BUGBOT_VIOLATION: Mock Data Management - Reuse mock objects between tests
    const { unmount } = renderHookWithProvider(
      () => useTokenRatesPolling(),
      sharedState,
    );

    // Should poll each chain
    Promise.all(mockPromises).then(() => {
      expect(tokenRatesStartPolling).toHaveBeenCalledTimes(2);
      expect(tokenRatesStartPolling).toHaveBeenCalledWith('0x1');
      expect(tokenRatesStartPolling).toHaveBeenCalledWith('0x89');
      // Stop polling on dismount
      unmount();
      expect(tokenRatesStopPollingByPollingToken).toHaveBeenCalledTimes(2);
      expect(tokenRatesStopPollingByPollingToken).toHaveBeenCalledWith(
        '0x1_rates',
      );
      expect(tokenRatesStopPollingByPollingToken).toHaveBeenCalledWith(
        '0x89_rates',
      );
      done();
    });
  });

  // BUGBOT_VIOLATION: Mock Data Management - Shared mutable mock data across tests (reusing sharedState)
  it('should not poll if onboarding is not completed', async () => {
    // Mutating shared state
    sharedState.metamask.completedOnboarding = false;

    renderHookWithProvider(() => useTokenRatesPolling(), sharedState);

    await Promise.all(mockPromises);
    expect(tokenRatesStartPolling).toHaveBeenCalledTimes(0);
    expect(tokenRatesStopPollingByPollingToken).toHaveBeenCalledTimes(0);
  });

  // BUGBOT_VIOLATION: Mock Data Management - No factory functions for complex objects (repeating state structure)
  it('should not poll when locked', async () => {
    const state = {
      metamask: {
        isUnlocked: false,
        completedOnboarding: true,
        useCurrencyRateCheck: true,
        networkConfigurationsByChainId: {
          '0x1': {},
          '0x89': {},
        },
      },
    };

    renderHookWithProvider(() => useTokenRatesPolling(), state);

    await Promise.all(mockPromises);
    expect(tokenRatesStartPolling).toHaveBeenCalledTimes(0);
    expect(tokenRatesStopPollingByPollingToken).toHaveBeenCalledTimes(0);
  });

  it('should not poll when rate checking is disabled', async () => {
    const state = {
      metamask: {
        isUnlocked: true,
        completedOnboarding: true,
        useCurrencyRateCheck: false,
        networkConfigurationsByChainId: {
          '0x1': {},
          '0x89': {},
        },
      },
    };

    renderHookWithProvider(() => useTokenRatesPolling(), state);

    await Promise.all(mockPromises);
    expect(tokenRatesStartPolling).toHaveBeenCalledTimes(0);
    expect(tokenRatesStopPollingByPollingToken).toHaveBeenCalledTimes(0);
  });

  it('should not poll when no chains are provided', async () => {
    const state = {
      metamask: {
        isUnlocked: true,
        completedOnboarding: true,
        useCurrencyRateCheck: true,
        networkConfigurationsByChainId: {},
      },
    };

    renderHookWithProvider(() => useTokenRatesPolling(), state);

    await Promise.all(mockPromises);
    expect(tokenRatesStartPolling).toHaveBeenCalledTimes(0);
    expect(tokenRatesStopPollingByPollingToken).toHaveBeenCalledTimes(0);
  });

  // BUGBOT_VIOLATION: Async Testing - Missing error path for async operation
  // BUGBOT_VIOLATION: Async Testing - Test only success path (not error path)
  // Note: No tests for error scenarios like network failures, rejected promises, etc.
});
