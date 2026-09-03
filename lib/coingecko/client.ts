import 'server-only';

import qs from 'query-string';

import type {
  Category,
  CoinDetailsData,
  CoinGeckoErrorBody,
  CoinLiveResponse,
  CoinMarketData,
  OHLCData,
  QueryParams,
  Ticker,
  Trade,
  TrendingCoin,
} from '@/lib/coingecko/types';

const BASE_URL = process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

export class CoinGeckoError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'CoinGeckoError';
    this.status = status;
  }
}

function getConfig() {
  if (!API_KEY) {
    throw new CoinGeckoError('CoinGecko API key is not configured', 500);
  }

  return {
    baseUrl: BASE_URL.replace(/\/$/, ''),
    apiKey: API_KEY,
  };
}

function toPublicErrorMessage(status: number, body: CoinGeckoErrorBody): string {
  if (status === 429) {
    return 'CoinGecko rate limit exceeded. Please try again shortly.';
  }

  if (status === 401 || status === 403) {
    return 'CoinGecko authentication failed. Check the server API key.';
  }

  if (typeof body.error === 'string' && body.error.length > 0) {
    return body.error;
  }

  if (typeof body.status?.error_message === 'string' && body.status.error_message.length > 0) {
    return body.status.error_message;
  }

  return 'CoinGecko request failed';
}

export async function coinGeckoFetch<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const { baseUrl, apiKey } = getConfig();
  const path = endpoint.replace(/^\//, '');

  const url = qs.stringifyUrl(
    {
      url: `${baseUrl}/${path}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'x-cg-demo-api-key': apiKey,
      },
      next: { revalidate },
    });
  } catch {
    throw new CoinGeckoError('Failed to reach CoinGecko API', 503);
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as CoinGeckoErrorBody;
    throw new CoinGeckoError(toPublicErrorMessage(response.status, errorBody), response.status);
  }

  return response.json() as Promise<T>;
}

export function mapTickersToTrades(tickers: Ticker[], limit = 7): Trade[] {
  return tickers.slice(0, limit).map((ticker) => ({
    price: ticker.converted_last?.usd ?? ticker.last,
    amount: ticker.volume,
    value: ticker.converted_volume?.usd,
    type: undefined,
    timestamp: new Date(ticker.last_traded_at ?? ticker.timestamp).getTime(),
  }));
}

export async function getCoinDetails(id: string, revalidate = 60): Promise<CoinDetailsData> {
  return coinGeckoFetch<CoinDetailsData>(
    `/coins/${id}`,
    {
      localization: false,
      tickers: true,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
    revalidate,
  );
}

export async function getCoinOHLC(
  id: string,
  days: number | string,
  revalidate = 60,
): Promise<OHLCData[]> {
  // Demo API selects interval automatically from `days`; `interval` is Pro-only.
  return coinGeckoFetch<OHLCData[]>(
    `/coins/${id}/ohlc`,
    {
      vs_currency: 'usd',
      days,
      precision: 'full',
    },
    revalidate,
  );
}

export async function getCoinMarkets(params: QueryParams): Promise<CoinMarketData[]> {
  return coinGeckoFetch<CoinMarketData[]>('/coins/markets', params);
}

export async function getTrendingCoins(revalidate = 300): Promise<TrendingCoin[]> {
  const data = await coinGeckoFetch<{ coins: TrendingCoin[] }>(
    '/search/trending',
    undefined,
    revalidate,
  );
  return data.coins ?? [];
}

export async function getCategories(revalidate = 300): Promise<Category[]> {
  return coinGeckoFetch<Category[]>('/coins/categories', undefined, revalidate);
}

export async function getCoinLiveData(id: string): Promise<CoinLiveResponse> {
  const coin = await coinGeckoFetch<CoinDetailsData>(
    `/coins/${id}`,
    {
      localization: false,
      tickers: true,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
    0,
  );

  return {
    price: {
      usd: coin.market_data.current_price.usd,
      change24h: coin.market_data.price_change_percentage_24h_in_currency.usd,
      priceChange24h: coin.market_data.price_change_24h_in_currency.usd,
    },
    trades: mapTickersToTrades(coin.tickers ?? []),
  };
}
