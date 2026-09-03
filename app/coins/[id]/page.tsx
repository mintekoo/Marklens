import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import LiveDataWrapper from '@/components/LiveDataWrapper';
import Converter from '@/components/Converter';
import {
  CoinGeckoError,
  getCoinDetails,
  getCoinOHLC,
  mapTickersToTrades,
} from '@/lib/coingecko/client';
import type { CoinDetailsData, OHLCData } from '@/lib/coingecko/types';
import { formatCurrency } from '@/lib/utils';

interface NextPageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  let coinData: CoinDetailsData;
  let coinOHLCData: OHLCData[] = [];

  try {
    [coinData, coinOHLCData] = await Promise.all([getCoinDetails(id), getCoinOHLC(id, 1)]);
  } catch (error) {
    const message = error instanceof CoinGeckoError ? error.message : 'Unable to load coin details';

    return (
      <main id="coin-details-page" className="main-container py-10">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h4 className="mb-2 font-semibold">Unable to load coin</h4>
          <p>{message}</p>
        </div>
      </main>
    );
  }

  const initialTrades = mapTickersToTrades(coinData.tickers ?? []);

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: coinData.market_cap_rank ? `# ${coinData.market_cap_rank}` : '—',
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url ?? undefined,
      linkText: 'Community',
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <LiveDataWrapper
          coinId={id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
          initialTrades={initialTrades}
        />
      </section>

      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        <div className="details">
          <h4>Coin Details</h4>

          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linkText }) => (
              <li key={label}>
                <p className={label}>{label}</p>

                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Page;
