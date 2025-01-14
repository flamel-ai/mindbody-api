import type { StaffUserToken } from "$mindbody/types";

/* eslint-disable @typescript-eslint/no-extraneous-class */
export type MindbodyConfig = {
  apiKey?: string;
};

let CONFIG = {} as MindbodyConfig;

/**
 * Mindbody requires an API key to interact with endpoints
 *
 * @example
 * ```
 * import { Config } from '@splitpass/mindbody-api';
 *
 * Config.setup({ apiKey: 'my-api-key' });
 * ```
 */

export default class Config {
  private constructor() { }

  public static setup(config: MindbodyConfig): void {
    CONFIG = config;
  }

  public static getApiKey(): string {
    if (CONFIG.apiKey == null) {
      throw Error(
        'Config.setup({ apiKey: <key> }) requires at least an API key to interact with endpoints',
      );
    }

    return CONFIG.apiKey;
  }

  public static get(): MindbodyConfig {
    if (CONFIG.apiKey == null) {
      throw Error(
        'Config.setup({...}) requires an API key to be provided',
      );
    }

    return CONFIG;
  }
}
