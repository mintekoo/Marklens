'use client';

import { useCallback, useEffect, useState } from 'react';

import type { CoinLiveResponse, Trade } from '@/lib/coingecko/types';

const POLL_INTERVAL_MS = 45_000;

interface UseCoinLiveDataProps {
  coinId: string;
  enabled?: boolean;
  initialTrades?: Trade[];
}

interface UseCoinLiveDataReturn {
  price: CoinLiveResponse['price'] | null;
  trades: Trade[];
  error: string | null;
  isLoading: boolean;
}

export const useCoinLiveData = ({
  coinId,
  enabled = true,
  initialTrades = [],
}: UseCoinLiveDataProps): UseCoinLiveDataReturn => {
  const [price, setPrice] = useState<CoinLiveResponse['price'] | null>(null);
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveData = useCallback(
    async (signal?: AbortSignal) => {
      if (!coinId) return;

      setIsLoading(true);

      try {
        const response = await fetch(`/api/coins/${encodeURIComponent(coinId)}/live`, {
          signal,
          cache: 'no-store',
        });

        const payload = (await response.json().catch(() => ({}))) as
          | CoinLiveResponse
          | { error?: string };

        if (!response.ok) {
          const message =
            'error' in payload && typeof payload.error === 'string'
              ? payload.error
              : 'Failed to load live data';
          throw new Error(message);
        }

        const data = payload as CoinLiveResponse;
        setPrice(data.price);
        setTrades(data.trades ?? []);
        setError(null);
      } catch (err) {
        if (signal?.aborted) return;

        const message = err instanceof Error ? err.message : 'Failed to load live data';
        setError(message);
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [coinId],
  );

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    void fetchLiveData(controller.signal);

    const intervalId = window.setInterval(() => {
      void fetchLiveData();
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [enabled, fetchLiveData]);

  return {
    price,
    trades,
    error,
    isLoading,
  };
};
