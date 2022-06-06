export function evalulate<T, P>(fn: T | ((...args: P[]) => T), ...args: P[]): T {
	if (typeIs(fn, "function")) {
		return fn(...args);
	} else {
		return fn;
	}
}
