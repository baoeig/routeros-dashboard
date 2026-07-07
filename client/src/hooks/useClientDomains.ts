import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import type { ClientDomain } from "../types";

export function useClientDomains() {
  return useQuery<{ domains: ClientDomain[] }>({
    queryKey: ["client-domains"],
    queryFn: () => http.get("/dns/client-domains").then((r) => r.data),
    refetchInterval: 10000,
  });
}
