import type { AxiosInstance } from 'axios';
import type { ErrorResponse, Headers, TokenResponse } from '$http/types';
import type { WebhookErrorResponse } from '$webhooks/types/WebhookErrorResponse';

import axios, { AxiosError } from 'axios';
import Config from '$Config';
import MindbodyError from '$http/MindbodyError';

const API_BASE_URL = 'https://api.mindbodyonline.com/public/v6';
const WEBHOOKS_BASE_URL = 'https://mb-api.mindbodyonline.com/push/api/v1';

export class BaseClient {
  protected client: AxiosInstance;

  protected constructor(clientType: 'api-client' | 'webhooks-client') {
    this.client = axios.create({
      baseURL: clientType === 'api-client' ? API_BASE_URL : WEBHOOKS_BASE_URL,
    });
    this.client.interceptors.response.use(
      res => res,
      err => {
        if (err instanceof AxiosError && err.response?.data != null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const serverErrorMessage = err.response.data?.Message as
            | string
            | undefined;

          if (serverErrorMessage != null) {
            throw new Error(
              'Mindbody Internal Server Error: ' + serverErrorMessage,
            );
          }

          const error = err.response.data as
            | ErrorResponse
            | WebhookErrorResponse;

          throw new MindbodyError(error);
        }

        throw new Error('Unknown error');
      },
    );
  }

  protected async request(
    siteID: string,
    staffToken?: TokenResponse,
  ): Promise<[AxiosInstance, Headers]> {
    const headers = staffToken
      ? await this.authHeaders(siteID, staffToken)
      : this.basicHeaders(siteID);

    return [this.client, headers];
  }

  protected webhookRequest(): [AxiosInstance, Headers] {
    return [this.client, this.basicHeaders()];
  }

  protected basicHeaders(siteID?: string): Headers {
    const headers = {
      'Content-Type': 'application/json',
      'Api-Key': Config.getApiKey(),
    } as Headers;

    if (siteID != null) {
      headers.SiteId = siteID;
    }

    return headers;
  }

  protected async authHeaders(siteID: string, staffToken: TokenResponse): Promise<Required<Headers>> {
    const token = await this.getStaffToken(siteID, staffToken);
    return {
      ...this.basicHeaders(siteID),
      Authorization: 'Bearer ' + token.AccessToken,
    };
  }

  /**
   * If the provided staff token is expired, it will be renewed.
   * If the provided staff token is not expired, it will be returned.
   *
   * @param siteID - The site ID to get the staff token for
   * @param staffToken - The staff token to use, may or may not be expired
   * @returns The active staff token
   */
  private async getStaffToken(siteID: string, staffToken: TokenResponse): Promise<TokenResponse> {
    if (!staffToken) {
      throw new Error('Staff token is required');
    }

    // If the token is expired, we need to renew it
    if (new Date(staffToken.Expires) < new Date(Date.now())) {
      const res = (await this.client.post<TokenResponse>(
        '/usertoken/renew',
        {},
        {
          headers: {
            ...this.basicHeaders(siteID),
            Authorization: 'Bearer ' + staffToken.AccessToken,
          },
        },
      ))?.data;

      // Return the new token
      return res;
    }

    // Return the exisating token
    return staffToken;
  }
}
