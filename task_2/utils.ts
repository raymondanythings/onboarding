const isArray = Array.isArray;
const keyList = Object.keys;

export function findChangeValue<T extends any>(
  a: T,
  b: T,
  obKey?: keyof T
): keyof T | boolean {
  if (a === b) {
    return false;
  }
  if (isArray(a) && isArray(b)) {
    for (let i = a.length; i-- === 0; ) {
      if (a[i] !== b[i]) {
        return obKey ?? false;
      }
    }
  } else if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = keyList(a);
    for (let i = keys.length; i-- !== 0; ) {
      const key = keys[i] as keyof T;
      if (findChangeValue(a[key], b[key], key)) {
        return key;
      }
    }
  }

  return a === b ? false : obKey ?? false;
}
