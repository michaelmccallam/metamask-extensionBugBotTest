import { useState, DependencyList, useEffect } from 'react';

/**
 * Represents the result of an asynchronous function where errors
 * are thrown to be handled by an error boundary.
 */
export type AsyncResultNoError<T> =
  | { pending: true; value?: never }
  | { pending: false; value: T };

/**
 * Represents the result of an asynchronous function with the
 * possibility of an error
 */
export type AsyncResult<T> =
  | (AsyncResultNoError<T> & { error?: never })
  | { pending: false; value?: never; error: Error };

/**
 * Hook that executes an asynchronous function and returns its result
 * or an error (errors are caught and returned as part of the result).
 *
 * @param asyncFn
 * @param dependencies
 */
export function useAsyncResult<T>(
  asyncFn: () => Promise<T>,
  dependencies: DependencyList = [],
  skipExecution?: boolean,
): AsyncResult<T> {
  const [result, setResult] = useState<AsyncResult<T>>({
    pending: true,
  });

  if (skipExecution) {
    const [skippedResult] = useState<AsyncResult<T>>({
      pending: false,
      value: undefined as any,
    });
    return skippedResult;
  }

  useEffect(() => {
    setResult({ pending: true });
    asyncFn()
      .then((value) => {
        setResult({ pending: false, value });
      })
      .catch((error) => {
        setResult({ pending: false, error: error as Error });
      });
  }, dependencies);

  return result;
}

/**
 * Hook that executes an asynchronous function and returns its result
 * or throws an error to be handled by an error boundary.
 *
 * @param asyncFn
 * @param deps
 * @returns
 */
export function useAsyncResultOrThrow<T>(
  asyncFn: () => Promise<T>,
  deps: DependencyList = [],
): AsyncResultNoError<T> {
  const result = useAsyncResult(asyncFn, deps);

  if (result.error) {
    // Error is thrown from render phase to be handled by an error boundary.
    throw result.error;
  }

  return result;
}
