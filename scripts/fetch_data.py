import os
import time
from datetime import datetime, timedelta
import pandas as pd
import yfinance as yf

# 15 NSE tickers mapped to Company Name and Sector
TICKERS_METADATA = {
    'TCS.NS': {'company': 'Tata Consultancy Services', 'sector': 'IT'},
    'INFY.NS': {'company': 'Infosys', 'sector': 'IT'},
    'WIPRO.NS': {'company': 'Wipro', 'sector': 'IT'},
    'HDFCBANK.NS': {'company': 'HDFC Bank', 'sector': 'Banking'},
    'ICICIBANK.NS': {'company': 'ICICI Bank', 'sector': 'Banking'},
    'SBIN.NS': {'company': 'State Bank of India', 'sector': 'Banking'},
    'HINDUNILVR.NS': {'company': 'Hindustan Unilever', 'sector': 'FMCG'},
    'ITC.NS': {'company': 'ITC', 'sector': 'FMCG'},
    'RELIANCE.NS': {'company': 'Reliance Industries', 'sector': 'Energy'},
    'POWERGRID.NS': {'company': 'Power Grid Corporation', 'sector': 'Energy'},
    'BHARTIARTL.NS': {'company': 'Bharti Airtel', 'sector': 'Telecom'},
    'MARUTI.NS': {'company': 'Maruti Suzuki', 'sector': 'Auto'},
    'M&M.NS': {'company': 'Mahindra & Mahindra', 'sector': 'Auto'},
    'LT.NS': {'company': 'Larsen & Toubro', 'sector': 'Infrastructure'},
    'ADANIPORTS.NS': {'company': 'Adani Ports & SEZ', 'sector': 'Infrastructure'}
}

def fetch_stock_data(ticker, company, start_date, end_date, retries=3):
    """Fetches historical price data for a single ticker with retries."""
    for attempt in range(retries):
        try:
            print(f"Fetching {ticker} ({company}) (attempt {attempt + 1}/{retries})...")
            df = yf.download(ticker, start=start_date, end=end_date, progress=False)
            
            if df.empty:
                print(f"  Warning: No data returned for {ticker}.")
                return None
                
            df = df.reset_index()
            df['Ticker'] = ticker
            df['Company'] = company
            
            # Handle potential multi-index column headers in newer yfinance versions
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            
            # Standardize columns
            required_cols = ['Date', 'Ticker', 'Company', 'Open', 'High', 'Low', 'Close', 'Volume']
            missing_cols = [col for col in required_cols if col not in df.columns]
            if missing_cols:
                print(f"  Error: Missing columns {missing_cols} for {ticker}")
                return None
                
            df = df[required_cols].copy()
            
            # Standardize data types
            df['Date'] = pd.to_datetime(df['Date']).dt.date
            df['Open'] = df['Open'].astype(float)
            df['High'] = df['High'].astype(float)
            df['Low'] = df['Low'].astype(float)
            df['Close'] = df['Close'].astype(float)
            df['Volume'] = df['Volume'].astype(int)
            
            return df
            
        except Exception as e:
            print(f"  Error fetching {ticker}: {str(e)}")
            if attempt < retries - 1:
                time.sleep(2)
            else:
                print(f"  Failed to fetch data for {ticker} after {retries} attempts.")
    return None

def main():
    print("Starting historical data fetch from Yahoo Finance...")
    
    # Calculate dates: 2 years + 75 days to accommodate rolling calculations (50D SMA, etc.)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=2 * 365 + 75)
    
    start_str = start_date.strftime('%Y-%m-%d')
    end_str = end_date.strftime('%Y-%m-%d')
    
    print(f"Date range: {start_str} to {end_str}")
    
    all_dfs = []
    
    for ticker, metadata in TICKERS_METADATA.items():
        df = fetch_stock_data(ticker, metadata['company'], start_str, end_str)
        if df is not None:
            all_dfs.append(df)
            print(f"  Successfully retrieved {len(df)} rows for {ticker}.")
        # Be polite to the API rate limits
        time.sleep(1)
        
    if not all_dfs:
        print("Error: No data retrieved for any ticker. Exiting.")
        return
        
    # Combine and save
    combined_df = pd.concat(all_dfs)
    combined_df = combined_df.sort_values(by=['Ticker', 'Date']).reset_index(drop=True)
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    output_path = 'data/raw_prices.csv'
    combined_df.to_csv(output_path, index=False)
    print(f"\nData fetch complete. Saved {len(combined_df)} total rows to {output_path}.")

if __name__ == '__main__':
    main()
