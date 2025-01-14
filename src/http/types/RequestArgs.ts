import type { QueryParams } from '$http/types';
import type { Kv } from '$http/types/Kv';
import type { TokenResponse } from '$http/types/TokenResponse';
export type RequestArgsGet<TParam extends Kv> = {
  siteID: string;
  staffToken: TokenResponse;
  params: QueryParams<TParam>;
  autoPaginate?: boolean;
};

export type RequestArgsGetOptionalParams<TParam extends Kv> = {
  siteID: string;
  staffToken?: TokenResponse;
  params?: QueryParams<TParam>;
  autoPaginate?: boolean;
};

export type RequestArgsPost<TPayload extends Kv> = {
  siteID: string;
  staffToken?: TokenResponse;
  payload: TPayload;
};

export type RequestArgsDelete<TParam extends Kv> = {
  siteID: string;
  staffToken?: TokenResponse;
  params?: TParam;
};

export type WebhooksRequestsArgsPost<TParam extends Kv> = TParam;

export type WebhooksRequestsArgsPatch<TParam extends Kv> = TParam;
