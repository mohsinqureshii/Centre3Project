export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("centre3_token"));
}
