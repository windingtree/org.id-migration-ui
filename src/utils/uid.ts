// Generates simple unique Id
export const simpleUid = (length = 11): string => {
  if (length < 5 || length > 11) {
    throw new Error('length value must be between 5 and 11');
  }
  return Math.random().toString(16).substr(2, length);
};
