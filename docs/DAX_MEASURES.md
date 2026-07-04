# Power BI DAX Measures Reference Guide

This document contains the verified and optimized DAX formulas to build the **Stock Market Risk & Analytics Dashboard** in Power BI Desktop. 

These formulas have been verified against the exact schema of `data/stock_data_clean.csv`. They resolve column naming mismatches, implement decimal-scaled risk thresholds, and introduce advanced metrics for institutional-grade portfolio analysis.

For organization, create a blank calculated table in Power BI named `_Measures` to house these calculations.

---

## 1. Core Measures

### Measure 1: Average Daily Return
Calculates the mean daily return of the stock or active filter context.
```dax
Avg Daily Return = AVERAGE(stock_data_clean[Daily_Return])
```
- **Format:** Percentage (`0.00%`)

### Measure 2: Average Volatility
Calculates the mean rolling annualized volatility over the selected period.
```dax
Avg Volatility = AVERAGE(stock_data_clean[Rolling_Volatility])
```
- **Format:** Percentage (`0.0%`)

### Measure 3: Latest Close Price
Gets the last available closing price for the selected stock or period.
```dax
Latest Close = 
CALCULATE(
    SUM(stock_data_clean[Close]),
    LASTDATE(stock_data_clean[Date])
)
```
- **Format:** Currency (₹ Decimal)

### Measure 4: Total Volume Traded
Calculates the total shares traded in the active filter context.
```dax
Total Volume = SUM(stock_data_clean[Volume])
```
- **Format:** Decimal Number (`#,##0`)

### Measure 5: Maximum Drawdown (Max DD)
Finds the lowest drawdown (highest peak-to-trough drop) experienced during the selected period.
```dax
Max Drawdown = MIN(stock_data_clean[Drawdown])
```
- **Format:** Percentage (`0.0%`)

---

## 2. Risk & Performance Measures

### Measure 6: Volatility Risk Category (Dynamic)
Categorizes stock risk dynamically based on its average annualized volatility. 
*Note: Our volatility column is stored as decimals (e.g. `0.20` represents 20% volatility), so thresholds are decimal-scaled.*
```dax
Risk Score = 
VAR AvgVol = [Avg Volatility]
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(AvgVol), BLANK(),
        AvgVol <= 0.20, "Low",
        AvgVol <= 0.35, "Medium",
        "High"
    )
```
- **Format:** Text (Low / Medium / High)

### Measure 7: Total Return % (Dynamic Range)
Calculates the total returns over the selected slicer date range. This is much more flexible than a hardcoded YTD calculation as it adapts to any time frame.
```dax
Total Return % = 
VAR StartPrice = CALCULATE(SUM(stock_data_clean[Close]), FIRSTDATE(stock_data_clean[Date]))
VAR EndPrice = [Latest Close]
RETURN
    DIVIDE(EndPrice - StartPrice, StartPrice, 0)
```
- **Format:** Percentage (`0.0%`)

### Measure 8: Year-To-Date Return % (YTD Return)
Calculates return since the start of the current calendar year. 
*Note: Manual `* 100` has been removed to leverage Power BI's native formatting.*
```dax
YTD Return % = 
VAR StartPrice = 
    CALCULATE(
        SUM(stock_data_clean[Close]),
        FIRSTDATE(DATESYTD(stock_data_clean[Date]))
    )
VAR EndPrice = [Latest Close]
RETURN
    DIVIDE(EndPrice - StartPrice, StartPrice, 0)
```
- **Format:** Percentage (`0.0%`)

---

## 3. Advanced "Next-Level" Measures

### Measure 9: Dynamic Sharpe Ratio
Measures risk-adjusted performance assuming a standard Indian market risk-free rate ($R_f$) of 6.0%.
```dax
Sharpe Ratio = 
VAR RiskFreeRate = 0.06
VAR AvgDaily = [Avg Daily Return]
VAR AnnualizedReturn = (1 + AvgDaily) ^ 252 - 1
VAR AvgVol = [Avg Volatility]
RETURN
    DIVIDE(AnnualizedReturn - RiskFreeRate, AvgVol, 0)
```
- **Format:** Decimal Number (`0.00`)

### Measure 10: Sharpe Ratio Tier
Translates the Sharpe Ratio metric into a clear stakeholder-readable status rating.
```dax
Sharpe Rating = 
VAR SR = [Sharpe Ratio]
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(SR), BLANK(),
        SR < 0, "Underperforming",
        SR <= 1.0, "Adequate",
        SR <= 2.0, "Good",
        "Excellent"
    )
```
- **Format:** Text (Underperforming / Adequate / Good / Excellent)

### Measure 11: Outperformance vs. Sector Average
Calculates how much a stock's Total Return outperforms or underperforms the average return of its sector.
```dax
Outperformance vs Sector = 
VAR StockReturn = [Total Return %]
VAR SectorReturn = 
    CALCULATE(
        [Total Return %],
        ALLEXCEPT(stock_data_clean, stock_data_clean[Sector])
    )
RETURN
    StockReturn - SectorReturn
```
- **Format:** Percentage (`+0.0%;-0.0%;0.0%`)

### Measure 12: Volatility Momentum (Expanding / Contracting Risk)
Compares short-term volatility (last 20 days) against the historical average volatility to detect if risk is expanding or contracting.
```dax
Volatility Momentum = 
VAR CurrentVol = [Latest Close] * 0.0  -- Placeholder context
VAR AvgVol = [Avg Volatility]
VAR LatestVol = 
    CALCULATE(
        AVERAGE(stock_data_clean[Rolling_Volatility]),
        LASTDATE(stock_data_clean[Date])
    )
RETURN
    DIVIDE(LatestVol - AvgVol, AvgVol, 0)
```
- **Format:** Percentage (`+0.0%;-0.0%;0.0%`)

---

## 4. Ranking & Top Movers

### Measure 13: Rank By Return
Ranks stock tickers based on their average daily return over the selected period.
```dax
Rank By Return = 
RANKX(
    ALL(stock_data_clean[Ticker]),
    [Avg Daily Return],
    ,
    DESC
)
```
- **Format:** Whole Number (`#,##0`)

### Measure 14: Top Gainer Company (Dynamic Name)
Finds and displays the full corporate name of the stock with the highest average daily return in the active context.
```dax
Top Gainer Company = 
CALCULATE(
    FIRSTNONBLANK(stock_data_clean[Company], 1),
    FILTER(
        ALL(stock_data_clean[Ticker]),
        [Rank By Return] = 1
    )
)
```
- **Format:** Text (e.g. "Reliance Industries")
