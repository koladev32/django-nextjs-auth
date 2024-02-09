import wretch, { WretchError } from "wretch";
import { AuthActions } from "@/app/auth/utils";

const { handleJWTRefresh, storeToken, getAccessToken } = AuthActions();

const api = wretch("http://localhost:8000")
  .auth("Bearer " + getAccessToken())
  .catcher(401, async (error: any, request: any) => {
    const token = await handleJWTRefresh().text();

    storeToken(token);

    // Replay the original request with new credentials
    return request
      .auth(token)
      .fetch()
      .unauthorized((err: WretchError) => {
        throw err;
      })
      .json();
  });

export const fetcher = (url: string) => api.get(url);
