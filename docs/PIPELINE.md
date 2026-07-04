# Data Pipeline Architecture & Transformation Logic

This document describes the design, execution flow, and mathematical calculations of the Python data pipeline for the Stock Market Risk & Analytics Dashboard.

---

## 1. Architecture Flow

The pipeline operates in three distinct phases:

```
+--------------------+
|  Yahoo Finance API |  <-- Online extraction (yfinance)
+---------+----------+
          |
          v [fetch_data.py] or [generate_sample_data.py] (fallback)
+---------+----------+
|   data/raw_prices  |  <-- CSV format: Date, Ticker, Open, High, Low, Close, Volume
+---------+----------+
          |
          v [transform_data.py] (group-by transformations)
+---------+----------+
| data/stock_data    |  <-- CSV format: Cleaned & enriched with risk metrics
+---------+----------+
          |
          v
+---------+----------+
|   Power BI Desktop |  <-- Visual report & DAX metrics
+--------------------+
```

---

## 2. Extraction & Run-time Safety

- **Data Period:** Fetches historical daily prices starting **2 years + 75 calendar days** before today. The extra 75 days serves as a "warm-up" window for rolling calculations.
- **Tolerant Execution:** Individual tickers are fetched sequentially. If one stock download fails, the script retries up to 3 times before proceeding to avoid pipeline blockage.
- **Fallback Generator:** `generate_sample_data.py` uses Geometric Brownian Motion (GBM) to simulate prices, allowing the pipeline to be tested end-to-end without an active internet connection.

---

## 3. Data Transformation Logic

Calculations are computed on a per-ticker group basis and implemented in `transform_data.py`:

### A. Daily Return
Daily returns represent the percentage price change from the previous trading day:
$$R_t = \frac{\text{Close}_t - \text{Close}_{t-1}}{\text{Close}_{t-1}}$$
*Implemented as `.pct_change()` in pandas.*

### B. Moving Averages
Simple Moving Averages (SMA) smooth out short-term price fluctuations to reveal long-term trends:
- **20-Day SMA:** Short-term trend line.
- **50-Day SMA:** Medium-term trend line.
$$\text{SMA}_n = \frac{1}{n} \sum_{i=0}^{n-1} \text{Close}_{t-i}$$
*Implemented as `.rolling(window=n).mean()` in pandas.*

### C. Rolling Annualized Volatility
A rolling 20-day volatility measures the standard deviation of daily returns, annualized to represent the annual price variance:
$$\sigma_{20\text{D, Annualized}} = \text{StDev}(R_{t-19} \dots R_t) \times \sqrt{252}$$
*where $252$ represents the standard number of trading days in a calendar year.*

### D. Drawdown from Peak
Drawdown measures the percentage loss from the highest peak price reached by the stock up to that date:
$$\text{Peak}_t = \max_{i \le t}(\text{Close}_i)$$
$$\text{Drawdown}_t = \frac{\text{Close}_t - \text{Peak}_t}{\text{Peak}_t}$$

### E. Warm-up Truncation & Trimming
After computing the rolling metrics, the first 75 days of the time series are truncated. This ensures that the final dataset contains exactly **2 years** of historical data, with **zero starting NaN values** in rolling volatility or SMA metrics.

### F. Volatility Tercile Risk Categorization
Rather than daily risk rating adjustments, stocks are assigned a static risk rating for the reporting period:
1. The mean rolling volatility for each of the 15 stocks is calculated over the 2-year window.
2. The 15 stocks are sorted in ascending order of their mean volatility.
3. Stocks are partitioned into three equally-sized groups (terciles):
   - **Low Risk** (ranks 1–5): Bottom 33.3% of volatility.
   - **Medium Risk** (ranks 6–10): Middle 33.3% of volatility.
   - **High Risk** (ranks 11–15): Top 33.3% of volatility.

---

## 4. Final Output Schema (`data/stock_data_clean.csv`)

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Date` | Date (`YYYY-MM-DD`) | Business date of the trading session |
| `Ticker` | Text (e.g. `TCS.NS`) | National Stock Exchange (NSE) symbol |
| `Company` | Text (e.g. `Tata Consultancy Services`) | Full corporate name of the stock |
| `Sector` | Text (e.g. `IT`) | Sector classification of the company (7 total) |
| `Open` | Decimal (2 dec) | Opening price of the session |
| `High` | Decimal (2 dec) | Highest transaction price during the session |
| `Low` | Decimal (2 dec) | Lowest transaction price during the session |
| `Close` | Decimal (2 dec) | Closing price of the session |
| `Volume` | Integer | Total number of shares traded |
| `Daily_Return` | Decimal (6 dec) | Percentage change in close price ($R_t$) |
| `SMA_20` | Decimal (2 dec) | 20-day Simple Moving Average |
| `SMA_50` | Decimal (2 dec) | 50-day Simple Moving Average |
| `Rolling_Volatility` | Decimal (6 dec) | Annualized 20-day rolling volatility ($\sigma$) |
| `Drawdown` | Decimal (6 dec) | Drawdown percentage from peak price ($DD$) |
| `Risk_Category` | Text (`Low`/`Medium`/`High`) | Static risk bucket assigned by volatility ranking |
