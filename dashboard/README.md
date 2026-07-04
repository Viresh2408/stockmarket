# Dashboard — Stock Market Risk & Analytics

Visual exports of all 7 Python charts from the Power BI dashboard.
Generated from `stock_data_clean.csv` using `generate_charts.py`.

To regenerate all charts:
```bash
python dashboard/generate_charts.py
```

---

## Page 1 — Market Overview

### Chart 1 — KPI Summary Cards
> Stocks analysed · Avg Return · Avg Volatility · Max Drawdown

![KPI Summary Cards](screenshots/chart1_kpi_cards.png)

---

### Chart 2 — Price Trends vs SMA-20 & SMA-50
> Close price vs short and medium-term moving averages for each stock

![Price Trends](screenshots/chart2_price_trends.png)

---

## Page 2 — Risk Analysis

### Chart 3 — Volatility by Stock
> Sorted by average rolling volatility, colour-coded by risk category

![Volatility Bar Chart](screenshots/chart3_volatility_bar.png)

---

### Chart 4 — Risk Category Distribution
> Proportion of stocks classified as Low / Medium / High risk

![Risk Category Donut](screenshots/chart4_risk_donut.png)

---

## Page 3 — Sector Comparison

### Chart 5 — Risk vs Return Bubble Chart
> X = Avg Volatility · Y = Avg Daily Return · Size = Total Volume · Colour = Sector

![Risk Return Scatter](screenshots/chart5_risk_return_scatter.png)

---

### Chart 6 — Sector Average Daily Return
> Green = positive return · Red = negative return · Sorted descending

![Sector Avg Return](screenshots/chart6_sector_avg_return.png)

---

### Chart 7 — Sector x Risk Category Matrix
> Count of stocks per sector/risk cell · Row & column totals included

![Sector Risk Matrix](screenshots/chart7_sector_risk_matrix.png)

---

## Files in this Directory

| File | Description |
|------|-------------|
| `generate_charts.py` | Standalone script — reads CSV, saves all 7 PNGs |
| `screenshots/` | Auto-generated chart images (150 dpi) |
| `stock_risk_dashboard.pbix` | Power BI project file *(save here after building)* |
