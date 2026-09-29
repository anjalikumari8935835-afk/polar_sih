export type UserRole = "user" | "researcher";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("polarLoggedIn") === "true";
}

export function getUserRole(): UserRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  const role = localStorage.getItem("polarRole");

  if (role === "user" || role === "researcher") {
    return role;
  }

  return null;
}