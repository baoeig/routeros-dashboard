import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Client } from "../types";

export function useClients() {
  return useQuery<{ clients: Client[]; count: number }>({
    queryKey: ["clients"],
    queryFn: () => http.get("/clients").then((r) => r.data),
    refetchInterval: 10000,
  });
}
