export const isBlank = val => !val || val.trim() === '';
export const hasValue = val => !isBlank(val);

export const objectValues = obj => Object.values(obj).flat();
