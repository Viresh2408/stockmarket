import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def main():
    print("Generating synthetic stock price data...")
    
    # 15 NSE stocks, company name, sector, starting price, volatility, drift
    stocks = {
        'TCS.NS': {'company': 'Tata Consultancy Services', 'sector': 'IT', 'start_price': 3200.0, 'vol': 0.18, 'drift': 0.12},
        'INFY.NS': {'company': 'Infosys', 'sector': 'IT', 'start_price': 1400.0, 'vol': 0.22, 'drift': 0.10},
        'WIPRO.NS': {'company': 'Wipro', 'sector': 'IT', 'start_price': 400.0, 'vol': 0.25, 'drift': 0.08},
        'HDFCBANK.NS': {'company': 'HDFC Bank', 'sector': 'Banking', 'start_price': 1500.0, 'vol': 0.18, 'drift': 0.14},
        'ICICIBANK.NS': {'company': 'ICICI Bank', 'sector': 'Banking', 'start_price': 900.0, 'vol': 0.20, 'drift': 0.15},
        'SBIN.NS': {'company': 'State Bank of India', 'sector': 'Banking', 'start_price': 550.0, 'vol': 0.28, 'drift': 0.12},
        'HINDUNILVR.NS': {'company': 'Hindustan Unilever', 'sector': 'FMCG', 'start_price': 2500.0, 'vol': 0.15, 'drift': 0.09},
        'ITC.NS': {'company': 'ITC', 'sector': 'FMCG', 'start_price': 400.0, 'vol': 0.18, 'drift': 0.11},
        'RELIANCE.NS': {'company': 'Reliance Industries', 'sector': 'Energy', 'start_price': 2300.0, 'vol': 0.20, 'drift': 0.13},
        'POWERGRID.NS': {'company': 'Power Grid Corporation', 'sector': 'Energy', 'start_price': 220.0, 'vol': 0.16, 'drift': 0.10},
        'BHARTIARTL.NS': {'company': 'Bharti Airtel', 'sector': 'Telecom', 'start_price': 800.0, 'vol': 0.22, 'drift': 0.14},
        'MARUTI.NS': {'company': 'Maruti Suzuki', 'sector': 'Auto', 'start_price': 10000.0, 'vol': 0.24, 'drift': 0.13},
        'M&M.NS': {'company': 'Mahindra & Mahindra', 'sector': 'Auto', 'start_price': 1400.0, 'vol': 0.28, 'drift': 0.16},
        'LT.NS': {'company': 'Larsen & Tourbro', 'sector': 'Infrastructure', 'start_price': 2400.0, 'vol': 0.22, 'drift': 0.15},
        'ADANIPORTS.NS': {'company': 'Adani Ports & SEZ', 'sector': 'Infrastructure', 'start_price': 700.0, 'vol': 0.38, 'drift': 0.17}
    }

    # Generate dates (last 2 years + 75 days buffer for SMAs)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=2 * 365 + 75)
    
    # Generate business days
    date_range = pd.bdate_range(start=start_date, end=end_date)
    num_days = len(date_range)
    print(f"Generating data for {num_days} trading days per stock.")

    all_data = []

    # Random seed for reproducibility
    np.random.seed(42)

    for ticker, info in stocks.items():
        prices = [info['start_price']]
        vol = info['vol']
        drift = info['drift']
        dt = 1 / 252.0
        
        # Geometric Brownian Motion
        for i in range(1, num_days):
            z = np.random.normal(0, 1)
            pct_change = np.exp((drift - 0.5 * vol**2) * dt + vol * np.sqrt(dt) * z)
            new_price = prices[-1] * pct_change
            prices.append(new_price)
            
        prices = np.array(prices)
        
        # Generate Open, High, Low, Volume based on Close
        df = pd.DataFrame(index=date_range)
        df['Ticker'] = ticker
        df['Company'] = info['company']
        df['Close'] = prices
        
        # Open (Close of previous day with small gap)
        gaps = np.random.normal(0, 0.005, num_days)
        opens = prices * (1 + gaps)
        opens[0] = info['start_price'] * 0.995
        df['Open'] = opens
        
        # High and Low
        high_pct = np.random.exponential(0.015, num_days)
        low_pct = np.random.exponential(0.015, num_days)
        
        df['High'] = np.maximum(df['Open'], df['Close']) * (1 + high_pct)
        df['Low'] = np.minimum(df['Open'], df['Close']) * (1 - low_pct)
        
        # Volume
        base_vol = np.random.randint(100000, 2000000)
        df['Volume'] = np.random.poisson(base_vol, num_days)
        
        # Reorder columns
        df = df.reset_index().rename(columns={'index': 'Date'})
        df = df[['Date', 'Ticker', 'Company', 'Open', 'High', 'Low', 'Close', 'Volume']]
        
        all_data.append(df)

    # Combine all stocks
    combined_df = pd.concat(all_data)
    combined_df = combined_df.sort_values(by=['Ticker', 'Date']).reset_index(drop=True)
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    # Save to raw CSV
    output_path = 'data/raw_prices.csv'
    combined_df.to_csv(output_path, index=False)
    print(f"Synthetic data saved successfully to {output_path} ({len(combined_df)} rows).")

if __name__ == '__main__':
    main()
