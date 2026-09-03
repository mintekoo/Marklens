import { NextResponse } from 'next/server';

import { CoinGeckoError, getCoinLiveData } from '@/lib/coingecko/client';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Coin id is required' }, { status: 400 });
  }

  try {
    const data = await getCoinLiveData(id);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof CoinGeckoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: 'Unable to load live coin data' }, { status: 500 });
  }
}
