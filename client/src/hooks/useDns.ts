import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import type { DnsCacheEntry } from "../types";

export function useDns() {
  return useQuery<{ entries: DnsCacheEntry[] }>({
    queryKey: ["dns"],
    queryFn: () => http.get("/dns/cache").then((r) => r.data),
    refetchInterval: 30000,
  });
}
