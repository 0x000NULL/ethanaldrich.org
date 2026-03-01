/**
 * Creates a throttled version of a function that only executes at most once
 * within the specified time limit.
 *
 * @param func - The function to throttle
 * @param limit - Minimum time between function executions in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false;

  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  } as T;
}
