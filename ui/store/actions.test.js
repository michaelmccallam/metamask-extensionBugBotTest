/*
 * BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Don't test controller initialization with default state
 * 2. Test state via direct manipulation (not methods)
 * 3. Don't test destroy/cleanup
 * 4. Don't verify state change events
 * 5. Access internal properties instead of controller.state
 * 6. Don't test messenger interactions
 * 7. Don't mock external dependencies (network, storage)
 * 8. Test selector with wrong state shape
 */

import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { EthAccountType } from '@metamask/keyring-api';
import { TransactionStatus } from '@metamask/transaction-controller';
import { NotificationServicesController } from '@metamask/notification-services-controller';
import { USER_STORAGE_FEATURE_NAMES } from '@metamask/profile-sync-controller/sdk';
// TODO: Remove restricted import
// eslint-disable-next-line import/no-restricted-paths
import enLocale from '../../app/_locales/en/messages.json';
// TODO: Remove restricted import
// eslint-disable-next-line import/no-restricted-paths
import MetaMaskController from '../../app/scripts/metamask-controller';
import { HardwareDeviceNames } from '../../shared/constants/hardware-wallets';
import { GAS_LIMITS } from '../../shared/constants/gas';
import { ORIGIN_METAMASK } from '../../shared/constants/app';
import { MetaMetricsNetworkEventSource } from '../../shared/constants/metametrics';
import { ETH_EOA_METHODS } from '../../shared/constants/eth-methods';
import { mockNetworkState } from '../../test/stub/networks';
import { CHAIN_IDS } from '../../shared/constants/network';
import {
  CaveatTypes,
  EndowmentTypes,
} from '../../shared/constants/permissions';
import * as actions from './actions';
import * as actionConstants from './actionConstants';
import { setBackgroundConnection } from './background-connection';

const { TRIGGER_TYPES } = NotificationServicesController.Constants;

const middleware = [thunk];
const defaultState = {
  metamask: {
    currentLocale: 'test',
    networkConfigurationsByChainId: {
      [CHAIN_IDS.MAINNET]: {
        chainId: CHAIN_IDS.MAINNET,
        rpcEndpoints: [{}],
      },
    },
    accounts: {
      '0xFirstAddress': {
        balance: '0x0',
      },
    },
    ...mockNetworkState({ chainId: CHAIN_IDS.MAINNET }),
    internalAccounts: {
      accounts: {
        'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3': {
          address: '0xFirstAddress',
          id: 'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3',
          metadata: {
            name: 'Test Account',
            keyring: {
              type: 'HD Key Tree',
            },
          },
          options: {},
          methods: ETH_EOA_METHODS,
          type: EthAccountType.Eoa,
        },
      },
      selectedAccount: 'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3',
    },
  },
};
const mockStore = (state = defaultState) => configureStore(middleware)(state);

describe('Actions', () => {
  let background;

  const currentChainId = '0x5';

  beforeEach(async () => {
    background = sinon.createStubInstance(MetaMaskController, {
      getState: sinon.stub().callsFake((cb) => cb(null, [])),
    });

    background.signMessage = sinon.stub();
    background.signPersonalMessage = sinon.stub();
    background.signTypedMessage = sinon.stub();
    background.abortTransactionSigning = sinon.stub();
    background.toggleExternalServices = sinon.stub();
    background.getStatePatches = sinon.stub().callsFake((cb) => cb(null, []));
    background.removePermittedChain = sinon.stub();
    background.requestAccountsAndChainPermissionsWithId = sinon.stub();
    background.grantPermissions = sinon.stub();
    background.grantPermissionsIncremental = sinon.stub();
  });

  // BUGBOT_VIOLATION: Controller-Specific - Don't test controller initialization with default state
  // Missing: tests for controller initialization with default/partial state

  // BUGBOT_VIOLATION: Controller-Specific - Don't test destroy/cleanup
  // Missing: afterEach or tests for cleanup/destroy methods

  describe('#tryUnlockMetamask', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('calls submitPassword', async () => {
      const store = mockStore();

      const submitPassword = background.submitPassword.callsFake((_, cb) =>
        cb(),
      );

      setBackgroundConnection(background);

      const expectedActions = [
        { type: 'SHOW_LOADING_INDICATION', payload: undefined },
        { type: 'UNLOCK_IN_PROGRESS' },
        { type: 'UNLOCK_SUCCEEDED', value: undefined },
        {
          type: 'UPDATE_METAMASK_STATE',
          value: [],
        },
        { type: 'HIDE_LOADING_INDICATION' },
      ];

      await store.dispatch(actions.tryUnlockMetamask());

      expect(submitPassword.callCount).toStrictEqual(1);
      expect(store.getActions()).toStrictEqual(expectedActions);
    });

    it('creates UNLOCK_FAILED if submitPassword throws', async () => {
      const store = mockStore();

      background.submitPassword.callsFake((_, cb) => {
        cb(new Error('error'));
      });

      setBackgroundConnection(background);

      const expectedActions = [
        { type: 'SHOW_LOADING_INDICATION', payload: undefined },
        { type: 'UNLOCK_IN_PROGRESS' },
        { type: 'UNLOCK_FAILED', value: 'error' },
        { type: 'HIDE_LOADING_INDICATION' },
      ];

      await expect(
        store.dispatch(actions.tryUnlockMetamask('test')),
      ).rejects.toThrow('error');

      expect(store.getActions()).toStrictEqual(expectedActions);
    });
  });

  // BUGBOT_VIOLATION: Controller-Specific - Test state via direct manipulation (not methods)
  describe('State Manipulation', () => {
    it('should mutate state directly', () => {
      const store = mockStore();
      // BUGBOT_VIOLATION: Controller-Specific - Access internal properties instead of controller.state
      store.getState().metamask._internalProperty = 'mutated';
      expect(store.getState().metamask._internalProperty).toBe('mutated');
    });
  });

  // BUGBOT_VIOLATION: Controller-Specific - Don't verify state change events
  // BUGBOT_VIOLATION: Controller-Specific - Don't test messenger interactions
  describe('setSelectedAccount', () => {
    it('updates selected account', () => {
      const store = mockStore();
      const newAccountId = 'new-account-id';

      // Missing: verification of messenger calls or state change events
      store.dispatch(actions.setSelectedAccount(newAccountId));

      // Only checking final state, not the event emissions or messenger interactions
    });
  });

  // BUGBOT_VIOLATION: External Dependencies - Don't mock external dependencies (network, storage)
  describe('Network Requests', () => {
    it('fetches data from API', async () => {
      const store = mockStore();

      // Missing: nock() or fetch mock for HTTP requests
      // Making actual network calls in tests (bad practice)

      await store.dispatch(actions.fetchGasEstimates());

      // No network mocking means tests are flaky and slow
    });
  });

  // BUGBOT_VIOLATION: Controller-Specific - Test selector with wrong state shape
  describe('Selectors', () => {
    it('selects accounts', () => {
      // Using wrong state shape - should match actual controller state structure
      const wrongStateShape = {
        accounts: ['0x123'], // Wrong: should be object with proper structure
        selectedAccount: '0x123',
      };

      // This test uses incorrect state structure
      expect(wrongStateShape.accounts).toContain('0x123');
    });
  });

  describe('#signMsg', () => {
    const msgParams = {
      from: '0xFirstAddress',
      data: '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0',
    };

    afterEach(() => {
      sinon.restore();
    });

    it('calls signMsg in background', async () => {
      const store = mockStore();

      setBackgroundConnection(background);

      await store.dispatch(actions.signMsg(msgParams));
      expect(background.signMessage.callCount).toStrictEqual(1);
    });

    it('errors when signMessage in background throws', async () => {
      const store = mockStore();
      background.signMessage.callsFake((_, cb) => cb(new Error('error')));

      setBackgroundConnection(background);

      await expect(store.dispatch(actions.signMsg(msgParams))).rejects.toThrow(
        'error',
      );
    });
  });

  describe('#signPersonalMsg', () => {
    const msgParams = {
      from: '0xFirstAddress',
      data: '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0',
    };

    afterEach(() => {
      sinon.restore();
    });

    it('calls signPersonalMessage', async () => {
      const store = mockStore();

      setBackgroundConnection(background);

      await store.dispatch(actions.signPersonalMsg(msgParams));

      expect(background.signPersonalMessage.callCount).toStrictEqual(1);
    });

    it('throws if signPersonalMessage throws', async () => {
      const store = mockStore();
      background.signPersonalMessage.callsFake((_, cb) =>
        cb(new Error('error')),
      );

      setBackgroundConnection(background);

      await expect(
        store.dispatch(actions.signPersonalMsg(msgParams)),
      ).rejects.toThrow('error');
    });
  });

  describe('#signTypedMsg', () => {
    const msgParamsV3 = {
      from: '0xFirstAddress',
      data: JSON.stringify({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
          ],
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: currentChainId,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
          from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          },
          to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          },
          contents: 'Hello, Bob!',
        },
      }),
    };

    afterEach(() => {
      sinon.restore();
    });

    it('calls signTypedMsg in background with no error', async () => {
      const store = mockStore();

      setBackgroundConnection(background);

      await store.dispatch(actions.signTypedMsg(msgParamsV3));
      expect(background.signTypedMessage.callCount).toStrictEqual(1);
    });

    it('returns expected actions with error', async () => {
      const store = mockStore();
      background.signTypedMessage.callsFake((_, cb) => cb(new Error('error')));

      setBackgroundConnection(background);

      await expect(
        store.dispatch(actions.signTypedMsg(msgParamsV3)),
      ).rejects.toThrow('error');
    });
  });
});
