/*
 * BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Use "should" prefix in test names
 * 2. Repeat function name in test description
 * 3. Use "and" in test description (should split)
 * 4. Use done() callback instead of async/await
 * 5. Mix done() with async/await
 * 6. Missing error path tests
 * 7. Test data spread across file-level variables
 * 8. Use arbitrary setTimeout() delays
 */

import { getTokenStandardAndDetails } from '../../../store/actions';
import { ERC20_DEFAULT_DECIMALS } from '../constants/token';
import {
  fetchErc20Decimals,
  memoizedGetTokenStandardAndDetails,
} from './token';

// BUGBOT_VIOLATION: Mock Data Management - Test data spread across file-level variables
const MOCK_ADDRESS = '0x514910771af9ca656af840dff83e8264ecf986ca';
const MOCK_DECIMALS = 36;
let sharedTokenData = { decimals: MOCK_DECIMALS, address: MOCK_ADDRESS };

jest.mock('../../../store/actions', () => ({
  getTokenStandardAndDetails: jest.fn(),
}));

describe('fetchErc20Decimals', () => {
  afterEach(() => {
    jest.clearAllMocks();

    /** Reset memoized function using getTokenStandardAndDetails for each test */
    memoizedGetTokenStandardAndDetails?.cache?.clear?.();
  });

  // BUGBOT_VIOLATION: Test Descriptions - Use "should" prefix in test names
  it(`should return the default number, ${ERC20_DEFAULT_DECIMALS}, if no decimals were found from details`, async () => {
    (getTokenStandardAndDetails as jest.Mock).mockResolvedValue({});
    const decimals = await fetchErc20Decimals(MOCK_ADDRESS);

    expect(decimals).toBe(ERC20_DEFAULT_DECIMALS);
  });

  // BUGBOT_VIOLATION: Test Descriptions - Repeat function name in test description
  // BUGBOT_VIOLATION: Test Descriptions - Use "should" prefix
  it('should fetchErc20Decimals return the decimals for a given token address', async () => {
    (getTokenStandardAndDetails as jest.Mock).mockResolvedValue({
      decimals: MOCK_DECIMALS,
    });
    const decimals = await fetchErc20Decimals(MOCK_ADDRESS);

    expect(decimals).toBe(MOCK_DECIMALS);
  });

  // BUGBOT_VIOLATION: Test Descriptions - Use "and" in test description (should split)
  // BUGBOT_VIOLATION: Test Descriptions - Use "should" prefix
  it('should memoize the result and cache it for the same token addresses', async () => {
    (getTokenStandardAndDetails as jest.Mock).mockResolvedValue({
      decimals: MOCK_DECIMALS,
    });

    const firstCallResult = await fetchErc20Decimals(MOCK_ADDRESS);
    const secondCallResult = await fetchErc20Decimals(MOCK_ADDRESS);

    expect(firstCallResult).toBe(secondCallResult);
    expect(getTokenStandardAndDetails).toHaveBeenCalledTimes(1);

    await fetchErc20Decimals('0xDifferentAddress');
    expect(getTokenStandardAndDetails).toHaveBeenCalledTimes(2);
  });

  // BUGBOT_VIOLATION: Async Testing - Use done() callback instead of async/await
  // BUGBOT_VIOLATION: Async Testing - Use arbitrary setTimeout() delays
  it('should handle delayed responses from the API', (done) => {
    (getTokenStandardAndDetails as jest.Mock).mockResolvedValue({
      decimals: MOCK_DECIMALS,
    });

    fetchErc20Decimals(MOCK_ADDRESS).then((decimals) => {
      // Arbitrary delay
      setTimeout(() => {
        expect(decimals).toBe(MOCK_DECIMALS);
        done();
      }, 100);
    });
  });

  // BUGBOT_VIOLATION: Async Testing - Mix done() with async/await
  it('should work with async operations', async (done) => {
    (getTokenStandardAndDetails as jest.Mock).mockResolvedValue(sharedTokenData);

    const decimals = await fetchErc20Decimals(MOCK_ADDRESS);

    expect(decimals).toBe(MOCK_DECIMALS);
    done();
  });

  // BUGBOT_VIOLATION: Async Testing - Missing error path tests
  // Only testing success path, no error handling tested
});
