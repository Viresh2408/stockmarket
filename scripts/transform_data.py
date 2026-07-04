import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Sector mapping
SECTOR_MAP = {
    'TCS.NS': 'IT',
    'INFY.NS': 'IT',
    'WIPRO.NS': 'IT',
    'HDFCBANK.NS': 'Banking',
    'ICICIBANK.NS': 'Banking',
    'SBIN.NS': 'Banking',
    'HINDUNILVR.NS': 'FMCG',
    'ITC.NS': 'FMCG',
    'RELIANCE.NS': 'Energy',
    'POWERGRID.NS': 'Energy',
    'BHARTIARTL.NS': 'Telecom',
    'MARUTI.NS': 'Auto',
    'M&M.NS': 'Auto',
    'LT.NS': 'Infrastructure',
    'ADANIPORTS.NS': 'Infrastructure'
}

def main():
    print("Starting data transformation pipeline...")
    
    input_path = 'data/raw_prices.csv'
    if not os.path.exists(input_path):
        print(f"Error: Raw data file {input_path} not found. Please run fetch_data.py or generate_sample_data.py first.")
        return
        
    # Read raw prices
    df = pd.read_csv(input_path)
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values(by=['Ticker', 'Date']).reset_index(drop=True)
    
    print(f"Loaded {len(df)} rows of raw price data.")
    
    transformed_dfs = []
    
    # Process each ticker
    for ticker, group in df.groupby('Ticker'):
        group = group.copy().sort_values(by='Date')
        
        # 1. Daily Return (decimal format)
        group['Daily_Return'] = group['Close'].pct_change()
        
        # 2. Moving Averages
        group['SMA_20'] = group['Close'].rolling(window=20).mean()
        group['SMA_50'] = group['Close'].rolling(window=50).mean()
        
        # 3. Rolling Annualized Volatility (20-day rolling std of returns * sqrt(252))
        group['Rolling_Volatility'] = group['Daily_Return'].rolling(window=20).std() * np.sqrt(252)
        
        # 4. Drawdown from Peak
        rolling_peak = group['Close'].cummax()
        group['Drawdown'] = (group['Close'] - rolling_peak) / rolling_peak
        
        transformed_dfs.append(group)
        
    combined_df = pd.concat(transformed_dfs)
    
    # Add Sector Column
    combined_df['Sector'] = combined_df['Ticker'].map(SECTOR_MAP)
    
    # 5. Filter to keep exactly 2 years of daily data (cutoff is today - 2 years)
    # This removes the warm-up period (first 75 days) where SMA and rolling std are NaN.
    cutoff_date = datetime.now() - timedelta(days=2 * 365)
    
    print(f"Applying 2-year cutoff date: {cutoff_date.strftime('%Y-%m-%d')}")
    final_df = combined_df[combined_df['Date'] >= cutoff_date].copy()
    
    # 6. Assign Risk Category based on mean rolling volatility over the 2-year period
    print("Computing volatility-based risk categories...")
    avg_vol = final_df.groupby('Ticker')['Rolling_Volatility'].mean().reset_index()
    avg_vol = avg_vol.sort_values(by='Rolling_Volatility').reset_index(drop=True)
    
    # Divide into terciles (5 lowest = Low, 5 middle = Medium, 5 highest = High)
    avg_vol['Risk_Category'] = 'Medium'
    avg_vol.loc[avg_vol.index < 5, 'Risk_Category'] = 'Low'
    avg_vol.loc[avg_vol.index >= 10, 'Risk_Category'] = 'High'
    
    # Print the risk categorization
    print("\nRisk Classification Results (Based on 2-Year Average Volatility):")
    for idx, row in avg_vol.iterrows():
        print(f"  - {row['Ticker']}: {row['Rolling_Volatility']:.2%} Volatility -> {row['Risk_Category']} Risk")
        
    # Map Risk Category back to final_df
    risk_map = dict(zip(avg_vol['Ticker'], avg_vol['Risk_Category']))
    final_df['Risk_Category'] = final_df['Ticker'].map(risk_map)
    
    # Final data cleaning (check for any unexpected NaNs and drop them)
    initial_len = len(final_df)
    final_df = final_df.dropna(subset=['SMA_50', 'Rolling_Volatility'])
    dropped_rows = initial_len - len(final_df)
    if dropped_rows > 0:
        print(f"Dropped {dropped_rows} rows due to NaN values in rolling calculations.")
        
    # Format Date column back to YYYY-MM-DD string
    final_df['Date'] = final_df['Date'].dt.strftime('%Y-%m-%d')
    
    # Round calculations for clean importing and viewing in Power BI
    final_df['Open'] = final_df['Open'].round(2)
    final_df['High'] = final_df['High'].round(2)
    final_df['Low'] = final_df['Low'].round(2)
    final_df['Close'] = final_df['Close'].round(2)
    final_df['Daily_Return'] = final_df['Daily_Return'].round(6)
    final_df['SMA_20'] = final_df['SMA_20'].round(2)
    final_df['SMA_50'] = final_df['SMA_50'].round(2)
    final_df['Rolling_Volatility'] = final_df['Rolling_Volatility'].round(6)
    final_df['Drawdown'] = final_df['Drawdown'].round(6)
    
    # Reorder columns to include Company Name
    final_df = final_df[[
        'Date', 'Ticker', 'Company', 'Sector', 'Open', 'High', 'Low', 'Close', 'Volume',
        'Daily_Return', 'SMA_20', 'SMA_50', 'Rolling_Volatility', 'Drawdown', 'Risk_Category'
    ]]
    
    # Save clean dataset
    output_path = 'data/stock_data_clean.csv'
    final_df.to_csv(output_path, index=False)
    print(f"\nTransformation complete. Saved {len(final_df)} rows of clean data to {output_path}.")

if __name__ == '__main__':
    main()
