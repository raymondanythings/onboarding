export const hasObjectKeys = <T>(objectName: T) => {
  if (typeof objectName !== "object") return false;
  for (const prop in objectName) {
    if (Object.prototype.hasOwnProperty.call(objectName, prop)) {
      return false;
    }
  }
  return true;
};
