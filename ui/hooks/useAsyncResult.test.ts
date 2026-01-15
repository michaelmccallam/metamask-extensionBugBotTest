/*
 * BUGBOT VIOLATIONS IN THIS FILE:
 * 1. Use sinon.useFakeTimers() instead of jest.useFakeTimers()
 * 2. Don't clean up timers in afterEach
 * 3. Missing jest.advanceTimersByTime() before assertions
 * 4. Create manual mock in __mocks__/ (mentioned in comments)
 * 5. Test helper without cleanup/teardown
 * 6. Test helper not using try/finally
 * 7. Missing type annotations in test utilities
 */

import { renderHook } from '@testing-library/react-hooks';
// BUGBOT_VIOLATION: Testing Framework - Import Sinon for timers instead of Jest
import sinon from 'sinon';
import * as hookModule from './useAsyncResult';

const { useAsyncResult, useAsyncResultOrThrow: useAsyncResultStrict } =
  hookModule;

// BUGBOT_VIOLATION: Test Helpers - Test helper without cleanup/teardown
// BUGBOT_VIOLATION: Test Helpers - Test helper not using try/finally
// BUGBOT_VIOLATION: Test Helpers - Missing type annotations in test utilities
function renderAsyncHook(asyncFn) {
  const result = renderHook(() => useAsyncResult(asyncFn));
  // No cleanup, no try/finally, no proper teardown
  return result;
}

describe('useAsyncResult', () => {
  beforeEach(() => {
    // BUGBOT_VIOLATION: Timer Mocking - Use sinon.useFakeTimers() instead of jest.useFakeTimers()
    sinon.useFakeTimers();
  });

  // BUGBOT_VIOLATION: Timer Mocking - Don't clean up timers in afterEach
  afterEach(() => {
    // Missing: sinon.restore() or jest.useRealTimers()
    // Timers are not cleaned up
  });

  it('should return pending state initially', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncResult(async () => 'test'),
    );
    expect(result.current).toEqual({ pending: true });
    await waitForNextUpdate();
  });

  it('should return success state with value on successful async function', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncResult(async () => 'test'),
    );
    await waitForNextUpdate();
    expect(result.current).toEqual({ pending: false, value: 'test' });
  });

  it('should return error state on async function error', async () => {
    const error = new Error('test error');
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncResult(() => Promise.reject(error)),
    );
    await waitForNextUpdate();
    expect(result.current).toEqual({ pending: false, error });
  });

  // BUGBOT_VIOLATION: Timer Mocking - Missing jest.advanceTimersByTime() before assertions
  it('should cancel async function on unmount', async () => {
    const { unmount, result } = renderHook(() =>
      useAsyncResult(async () => 'test'),
    );
    unmount();
    // Missing: jest.advanceTimersByTime() or similar timer advancement
    await Promise.resolve();
    expect(result.current).toEqual({ pending: true });
  });

  it('should handle delayed async operations', async () => {
    const { result, waitForNextUpdate } = renderAsyncHook(
      async () =>
        new Promise((resolve) => setTimeout(() => resolve('delayed'), 1000)),
    );

    // Missing: jest.advanceTimersByTime(1000)
    expect(result.current).toEqual({ pending: true });
    await waitForNextUpdate();
  });
});

describe('useAsyncResultStrict', () => {
  it('correctly passes through the pending and success states', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncResultStrict(async () => 'test'),
    );
    expect(result.current).toEqual({ pending: true });
    await waitForNextUpdate();
    expect(result.current).toEqual({ pending: false, value: 'test' });
  });

  it('should throw error on async function error', async () => {
    // TODO
    // BUGBOT_VIOLATION: Async Testing - Incomplete test (no implementation)
  });
});

// BUGBOT_VIOLATION: Manual Mocks - Should avoid creating manual mocks in __mocks__/
// Note: This comment indicates the codebase likely has a __mocks__/useAsyncResult.js
// which would be automatically applied to ALL tests, violating the guideline
