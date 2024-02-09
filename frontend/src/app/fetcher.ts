import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "@/app/auth/utils";

// Extract necessary functions from the AuthActions utility.
const { handleJWTRefresh, storeToken, getToken } = AuthActions();

/**
 * Configures the API with authentication and automatic token refresh on 401 responses.
 */
const api = (onRedirect?: () => void) => {
  return (
    wretch("http://localhost:8000")
      // Initialize authentication with the access token.
      .auth(`Bearer ${getToken("access")}`)
      // Catch 401 errors to refresh the token and retry the request.
      .catcher(401, async (error: WretchError, request: Wretch) => {
        try {
          // Attempt to refresh the JWT token.
          const { access } = (await handleJWTRefresh().json()) as {
            access: string;
          };

          // Store the new access token.
          storeToken(access, "access");

          // Replay the original request with the new access token.
          return request
            .auth(`Bearer ${access}`)
            .fetch()
            .unauthorized(() => {
              // Rethrow the error if unauthorized after token refresh.
              onRedirect && onRedirect();
            })
            .json();
        } catch (err) {
          onRedirect && onRedirect();
        }
      })
  );
};

/**
 * Fetches data from the specified URL, automatically handling authentication and token refresh.
 * @returns {Promise<any>} The promise resolving to the fetched data.
 * @param args
 */
export const fetcher = (
  args: [url: string, onRedirect: () => void]
): Promise<any> => {
  const [url, onRedirect] = args;
  return api(onRedirect).get(url).json();
};
