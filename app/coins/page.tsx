import Image from 'next/image';
import Link from 'next/link';

import CoinsPagination from '@/components/CoinsPagination';
import DataTable from '@/components/DataTable';
import { CoinGeckoError, getCoinMarkets } from '@/lib/coingecko/client';
import type { CoinMarketData } from '@/lib/coingecko/types';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';

interface NextPageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Coins = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const perPage = 10;

  let coinsData: CoinMarketData[] = [];

  try {
    coinsData = await getCoinMarkets({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page: currentPage,
      sparkline: false,
      price_change_percentage: '24h',
    });
  } catch (error) {
    const message = error instanceof CoinGeckoError ? error.message : 'Unable to load market data';

    return (
      <main id="coins-page">
        <div className="content">
          <h4>All Coins</h4>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            <p>{message}</p>
          </div>
        </div>
      </main>
    );
  }

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell',
      cell: (coin) => (
        <>
          #{coin.market_cap_rank}
          <Link href={`/coins/${coin.id}`} aria-label="View coin" />
        </>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: (coin) => (
        <div className="token-info">
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin) => {
        const change = coin.price_change_percentage_24h ?? 0;
        const isTrendingUp = change > 0;

        return (
          <span
            className={cn('change-value', {
              'text-green-600': isTrendingUp,
              'text-red-500': !isTrendingUp,
            })}
          >
            {isTrendingUp && '+'}
            {formatPercentage(change)}
          </span>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  const hasMorePages = coinsData.length === perPage;
  const estimatedTotalPages = currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable
          tableClassName="coins-table"
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default Coins;
