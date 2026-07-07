import axios, { type AxiosInstance } from "axios";
import https from "node:https";
import { config } from "../config.js";

export class RouterOSClient {
  private http: AxiosInstance;

  constructor() {
    const { host, port, user, password } = config.router;
    const protocol = port === 443 ? "https" : "http";
    this.http = axios.create({
      baseURL: `${protocol}://${host}:${port}/rest`,
      auth: { username: user, password },
      ...(protocol === "https" && {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }),
      timeout: 30000,
    });
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T[]> {
    const { data } = await this.http.get(`/${path}`, { params });
    return Array.isArray(data) ? data : [data];
  }

  async post<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    const { data } = await this.http.post<T>(`/${path}`, body);
    return data;
  }

  async put(
    path: string,
    body: Record<string, unknown>
  ): Promise<{ ret: string }> {
    const { data } = await this.http.put<{ ret: string }>(`/${path}`, body);
    return data;
  }

  async patch(
    path: string,
    id: string,
    body: Record<string, unknown>
  ): Promise<void> {
    await this.http.patch(`/${path}/${id}`, body);
  }

  async delete(path: string, id: string): Promise<void> {
    await this.http.delete(`/${path}/${id}`);
  }
}

export const routerClient = new RouterOSClient();
