export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface CoinGeckoErrorBody {
  error?: string;
  status?: {
    error_code?: number;
    error_message?: string;
  };
}

export type OHLCData = [number, number, number, number, number];

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
    large: string;
    data: {
      price: number;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
}

export interface Ticker {
  market: {
    name: string;
  };
  base: string;
  target: string;
  last: number;
  volume: number;
  converted_last: {
    usd: number;
  };
  converted_volume: {
    usd: number;
  };
  timestamp: string;
  last_traded_at?: string;
  trade_url: string | null;
}

export interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id?: string | null;
  detail_platforms?: Record<
    string,
    {
      geckoterminal_url?: string;
      contract_address: string;
    }
  >;
  image: {
    large: string;
    small: string;
  };
  market_data: {
    current_price: {
      usd: number;
      [key: string]: number;
    };
    price_change_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_30d_in_currency: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
  };
  market_cap_rank: number | null;
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string | null;
  };
  tickers: Ticker[];
}

export interface Category {
  name: string;
  top_3_coins: string[];
  market_cap_change_24h: number | null;
  market_cap: number | null;
  volume_24h: number | null;
}

export interface Trade {
  price?: number;
  timestamp?: number;
  type?: string;
  amount?: number;
  value?: number;
}

export interface LivePriceData {
  usd: number;
  change24h: number;
  priceChange24h: number;
}

export interface CoinLiveResponse {
  price: LivePriceData;
  trades: Trade[];
}
