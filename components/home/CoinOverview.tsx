import Image from 'next/image';

import CandlestickChart from '@/components/CandlestickChart';
import { CoinOverviewFallback } from '@/components/home/fallback';
import { getCoinDetails, getCoinOHLC } from '@/lib/coingecko/client';
import { formatCurrency } from '@/lib/utils';

const CoinOverview = async () => {
  let coin;
  let coinOHLCData;

  try {
    [coin, coinOHLCData] = await Promise.all([
      getCoinDetails('bitcoin'),
      getCoinOHLC('bitcoin', 1),
    ]);
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }

  return (
    <div id="coin-overview">
      <CandlestickChart data={coinOHLCData} coinId="bitcoin">
        <div className="header pt-2">
          <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;
