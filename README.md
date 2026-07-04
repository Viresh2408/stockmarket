# Stock Market Risk & Analytics Dashboard

> A end-to-end data analytics project — from raw market data to an interactive Power BI dashboard — analyzing **15 major NSE-listed stocks** across **7 sectors** using **2 years of daily OHLCV data**.

---

## Live Preview

> Run the Streamlit dashboard locally:
> ```bash
> streamlit run app.py
> ```

---

## Overview

This project implements a complete analytics workflow:

```
Yahoo Finance API  →  Python Pipeline  →  Clean Dataset  →  Power BI Dashboard
     (raw OHLCV)       (pandas/numpy)     (CSV, 3,120 rows)   (7 Python charts + DAX)
```

**15 NSE Stocks covered across 7 sectors:**

| Sector | Stocks |
|--------|--------|
| IT | TCS, Infosys, Wipro |
| Banking | HDFC Bank, ICICI Bank, Kotak Bank |
| FMCG | HUL, ITC, Nestle |
| Energy | Reliance, ONGC |
| Telecom | Bharti Airtel |
| Auto | Maruti Suzuki, Tata Motors |
| Infrastructure | Adani Ports |

---

## Dashboard — 7 Charts

### Chart 1 — KPI Summary Cards
![KPI Summary Cards](dashboard/screenshots/chart1_kpi_cards.png)

### Chart 2 — Price Trends vs SMA-20 & SMA-50
![Price Trends](dashboard/screenshots/chart2_price_trends.png)

### Chart 3 — Volatility by Stock (Risk Colour-Coded)
![Volatility Bar Chart](dashboard/screenshots/chart3_volatility_bar.png)

### Chart 4 — Risk Category Distribution
![Risk Donut](dashboard/screenshots/chart4_risk_donut.png)

### Chart 5 — Risk vs Return Bubble Chart
![Risk Return Scatter](dashboard/screenshots/chart5_risk_return_scatter.png)

### Chart 6 — Sector Average Daily Return
![Sector Avg Return](dashboard/screenshots/chart6_sector_avg_return.png)

### Chart 7 — Sector × Risk Category Matrix
![Sector Risk Matrix](dashboard/screenshots/chart7_sector_risk_matrix.png)

---

## Key Metrics Computed

| Metric | Description |
|--------|-------------|
| **Daily Return** $R_t$ | `(Close_t - Close_{t-1}) / Close_{t-1}` |
| **SMA-20 / SMA-50** | 20-day and 50-day simple moving averages of Close |
| **Rolling Volatility** $\sigma$ | 20-day rolling std of $R_t$, annualized × √252 |
| **Drawdown** | `(Close - Rolling Peak) / Rolling Peak` |
| **Risk Category** | Tercile split by mean volatility → Low / Medium / High |

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Data Source | Yahoo Finance API (`yfinance`) |
| Pipeline | Python 3.x · `pandas` · `numpy` |
| Visualization | `matplotlib` · Power BI Desktop · DAX |
| Web App | `streamlit` |
| Storage | CSV (flat-file, database-ready schema) |

---

## Project Structure

```
stockmarket/
├── app.py                          # Streamlit web dashboard
├── requirements.txt                # Python dependencies
│
├── scripts/
│   ├── fetch_data.py               # Pulls 2yr+ OHLCV data from Yahoo Finance
│   ├── transform_data.py           # Computes all metrics and risk classifications
│   ├── generate_sample_data.py     # Synthetic data fallback for offline testing
│   └── powerbi_python_visuals/     # Power BI Python visual scripts (Charts 1–3)
│
├── data/
│   └── stock_data_clean.csv        # Final enriched dataset (16 columns, 3,120 rows)
│
├── docs/
│   ├── PIPELINE.md                 # Data flow + mathematical transformation logic
│   ├── DAX_MEASURES.md             # All 13 custom DAX measure formulas
│   └── DASHBOARD_GUIDE.md          # Step-by-step Power BI build guide
│
└── dashboard/
    ├── generate_charts.py          # Exports all 7 charts as PNGs (no Power BI needed)
    ├── dark_theme.json             # Power BI dark theme file
    ├── README.md                   # Dashboard visual showcase
    └── screenshots/                # Chart PNGs referenced in this README
```

---

## Quick Start

### 1. Clone & set up environment
```bash
git clone https://github.com/Viresh2408/stockmarket.git
cd stockmarket

python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

### 2. Fetch data
```bash
# Live data from Yahoo Finance (requires internet)
python scripts/fetch_data.py

# OR — offline synthetic data for quick testing
python scripts/generate_sample_data.py
```

### 3. Run the pipeline
```bash
python scripts/transform_data.py
# Output: data/stock_data_clean.csv
```

### 4. View charts in the browser
```bash
streamlit run app.py
# Opens at http://localhost:8501
```

### 5. Build the Power BI Dashboard
Open **Power BI Desktop** → import `data/stock_data_clean.csv` → follow the step-by-step guide in [`docs/DASHBOARD_GUIDE.md`](docs/DASHBOARD_GUIDE.md).  
Use the Python visual scripts in `scripts/powerbi_python_visuals/` to embed charts directly inside Power BI.

---

## Dataset Schema

`data/stock_data_clean.csv` — 16 columns:

| Column | Type | Description |
|--------|------|-------------|
| `Date` | Date | Trading session date (YYYY-MM-DD) |
| `Ticker` | Text | NSE symbol (e.g. `TCS.NS`) |
| `Company` | Text | Full company name |
| `Sector` | Text | Sector classification (7 sectors) |
| `Open / High / Low / Close` | Decimal | OHLCV session prices |
| `Volume` | Integer | Shares traded |
| `Daily_Return` | Decimal | % price change from previous close |
| `SMA_20` | Decimal | 20-day simple moving average |
| `SMA_50` | Decimal | 50-day simple moving average |
| `Rolling_Volatility` | Decimal | 20-day annualized volatility |
| `Drawdown` | Decimal | % decline from rolling peak |
| `Risk_Category` | Text | `Low` / `Medium` / `High` |

---

## Documentation

| File | Contents |
|------|----------|
| [`docs/PIPELINE.md`](docs/PIPELINE.md) | Mathematical formulas, data flow, transformation logic |
| [`docs/DAX_MEASURES.md`](docs/DAX_MEASURES.md) | All 13 DAX measures used in Power BI |
| [`docs/DASHBOARD_GUIDE.md`](docs/DASHBOARD_GUIDE.md) | Step-by-step Power BI report build guide |
| [`dashboard/README.md`](dashboard/README.md) | Dashboard page-by-page visual showcase |
