import { NextResponse } from 'next/server';

import { PERIOD_CONFIG } from '@/constants';
import { CoinGeckoError, getCoinOHLC } from '@/lib/coingecko/client';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_PERIODS = new Set(Object.keys(PERIOD_CONFIG));

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const periodParam = searchParams.get('period') ?? 'daily';

  if (!id) {
    return NextResponse.json({ error: 'Coin id is required' }, { status: 400 });
  }

  if (!VALID_PERIODS.has(periodParam)) {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
  }

  const period = periodParam as Period;
  const { days } = PERIOD_CONFIG[period];

  try {
    const data = await getCoinOHLC(id, days, 30);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof CoinGeckoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: 'Unable to load OHLC data' }, { status: 500 });
  }
}
