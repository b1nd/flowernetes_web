export function setItem(key, value) {
  localStorage.setItem(key, value)
}

export function getItemOrEmpty(key) {
  return localStorage.getItem(key) || "";
}

export function getItemOrThrow(key) {
  const item = localStorage.getItem(key);
  if (!item) throw new Error(`${key} doesn't exists`);
  return item
}

export function removeItem(key) {
  localStorage.removeItem(key);
}