/* eslint-disable @typescript-eslint/no-extraneous-class */
export type MindbodyConfig = {
  apiKey?: string;
  username?: string;
  password?: string;
  token?: string;
};

let CONFIG = {} as MindbodyConfig;
let FULL_CREDENTIALS_PROVIDED = false;

/**
 * Mindbody requires an API key to interact with endpoints and may additionally
 * require a user token generated from your username/password combination.
 *
 * Actions such as adding clients to a class require a user token
 * included in the request headers. Tokens can only be generated for locations
 * that have explicitly granted you permission. Some endpoints may limit the
 * data returned if no token is provided.
 *
 * @example
 * ```
 * import { Config } from '@splitpass/mindbody-api';
 *
 * // Limited to interacting with endpoints that don't require a staff token
 * Config.setup({ apiKey: 'my-api-key' });
 *
 * // Full access to API data that a location has granted to your user
 * Config.setup({ apiKey: 'api-key', username: 'username', password: 'password' });
 * ```
 */
export default class Config {
  private constructor() { }

  public static setup(config: MindbodyConfig): void {
    CONFIG = config;

    // Username and password authentication
    if (config.username != null && config.password != null) {
      FULL_CREDENTIALS_PROVIDED = true;
    }

    // Access token authentication (acquired via OAuth 2.0 flow)
    // Docs: https://developers.mindbodyonline.com/ui/documentation/public-api#/http/mindbody-public-api-v6-0/authentication/oauth
    if (config.token != null) {
      FULL_CREDENTIALS_PROVIDED = true;
    }
  }

  public static getApiKey(): string {
    if (CONFIG.apiKey == null) {
      throw Error(
        'Config.setup({ apiKey: <key> }) requires at least an API key to interact with endpoints',
      );
    }

    return CONFIG.apiKey;
  }


  public static getAccessToken(): string {
    if (CONFIG.token == null) {
      throw Error(
        'Config.setup({ token: <token> }) requires at least an access token to interact with endpoints',
      );
    }

    return CONFIG.token;
  }

  public static get(): MindbodyConfig {
    if (
      CONFIG.username == null ||
      CONFIG.password == null ||
      CONFIG.apiKey == null
    ) {
      throw Error(
        'Config.setup({...}) requires all fields to be provided to generate a staff token',
      );
    }

    return CONFIG;
  }

  public static isFullCredentialsProvided(): boolean {
    return FULL_CREDENTIALS_PROVIDED;
  }
}
