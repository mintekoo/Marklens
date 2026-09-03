'use client';

import { Separator } from '@/components/ui/separator';
import CandlestickChart from '@/components/CandlestickChart';
import DataTable from '@/components/DataTable';
import CoinHeader from '@/components/CoinHeader';
import { useCoinLiveData } from '@/hooks/useCoinLiveData';
import type { CoinDetailsData, OHLCData, Trade } from '@/lib/coingecko/types';
import { formatCurrency, timeAgo } from '@/lib/utils';

interface LiveDataProps {
  coinId: string;
  coin: CoinDetailsData;
  coinOHLCData?: OHLCData[];
  initialTrades?: Trade[];
}

const LiveDataWrapper = ({ coinId, coin, coinOHLCData, initialTrades = [] }: LiveDataProps) => {
  const { trades, price } = useCoinLiveData({ coinId, initialTrades });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : '-'),
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade) => trade.amount?.toFixed(4) ?? '-',
    },
    {
      header: 'Value',
      cellClassName: 'value-cell',
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : '-'),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
      cell: (trade) =>
        trade.type ? (
          <span className={trade.type === 'b' ? 'text-green-500' : 'text-red-500'}>
            {trade.type === 'b' ? 'Buy' : 'Sell'}
          </span>
        ) : (
          <span className="text-purple-100/50">—</span>
        ),
    },
    {
      header: 'Time',
      cellClassName: 'time-cell',
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : '-'),
    },
  ];

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={price?.priceChange24h ?? coin.market_data.price_change_24h_in_currency.usd}
      />
      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          mode="live"
          initialPeriod="daily"
          pollIntervalMs={45_000}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      <div className="trades">
        <h4>Recent Market Activity</h4>

        <DataTable
          columns={tradeColumns}
          data={trades}
          rowKey={(_, index) => index}
          tableClassName="trades-table"
        />
      </div>
    </section>
  );
};

export default LiveDataWrapper;
