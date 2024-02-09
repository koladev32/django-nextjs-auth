import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "@/app/auth/utils";

// Extract necessary functions from the AuthActions utility.
const { handleJWTRefresh, storeToken, getToken } = AuthActions();

/**
 * Configures the API with authentication and automatic token refresh on 401 responses.
 */
const api = wretch("http://localhost:8000")
  // Initialize authentication with the access token.
  .auth(`Bearer ${getToken("access")}`)
  // Catch 401 errors to refresh the token and retry the request.
  .catcher(401, async (error: WretchError, request: Wretch) => {
    try {
      // Attempt to refresh the JWT token.
      const newToken: string = await handleJWTRefresh().text();

      // Store the new access token.
      storeToken(newToken, "access");

      // Replay the original request with the new access token.
      return request
        .auth(`Bearer ${newToken}`)
        .fetch()
        .unauthorized((err: WretchError) => {
          // Rethrow the error if unauthorized after token refresh.
          throw err;
        })
        .json();
    } catch (err) {
      // Handle or log the error as needed.
      throw err;
    }
  });

/**
 * Fetches data from the specified URL, automatically handling authentication and token refresh.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} The promise resolving to the fetched data.
 */
export const fetcher = (url: string): Promise<any> => api.get(url).json();
