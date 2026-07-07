import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import type { SystemInfo } from "../types";

export function useSystem() {
  return useQuery<SystemInfo>({
    queryKey: ["system"],
    queryFn: () => http.get("/system").then((r) => r.data),
    refetchInterval: 10000,
  });
}
