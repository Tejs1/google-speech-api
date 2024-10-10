import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export interface GoogleServiceKey {
  client_email: string;
  private_key: string;
}

export async function pingBackend() {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8081";
  try {
    const response = await fetch(`${BACKEND_URL}/ping`, {
      method: "GET",
      cache: "no-store", // This ensures fresh data is always fetched
    });
    if (response.ok) {
      console.log("Backend pinged successfully");
    } else {
      console.error("Failed to ping backend");
    }
  } catch (error) {
    console.error("Error pinging backend:", error);
  }
}
