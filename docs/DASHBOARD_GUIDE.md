# Power BI Widescreen Dashboard Assembly & Style Guide

This guide walks you through building the 3-page **Stock Market Risk & Analytics Dashboard** in Power BI Desktop to a premium, next-level design standard. It incorporates dynamic bookmark toggles, custom hover tooltips, and a cohesive dark theme.

---

## 1. Import Premium Dark Theme

To instantly apply a professional, modern Charcoal & Neon palette, save the JSON snippet below as a `.json` file (e.g. `dark_theme.json`) and import it via **View Ribbon** > **Themes Dropdown** > **Browse for Themes**:

```json
{
  "name": "Charcoal Neon",
  "dataColors": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F43F5E"],
  "background": "#111827",
  "foreground": "#F3F4F6",
  "tableAccent": "#3B82F6",
  "visualStyles": {
    "*": {
      "*": {
        "background": [
          {
            "show": true,
            "color": { "solid": { "color": "#1F2937" } },
            "transparency": 5
          }
        ],
        "border": [
          {
            "show": true,
            "color": { "solid": { "color": "#374151" } },
            "radius": 8
          }
        ],
        "title": [
          {
            "show": true,
            "fontColor": { "solid": { "color": "#FFFFFF" } },
            "fontFamily": "Segoe UI Semibold",
            "fontSize": 12
          }
        ]
      }
    }
  }
}
```

---

## 2. Page 1: Market Overview

This page provides an executive summary of market performance across all sectors and stocks.

### Layout Wireframe
```
+--------------------------------------------------------------------------+
|  [Header Band] LOGO & TITLE: Market Overview Dashboard   [Date Slicer]   |
+--------------------------------------------------------------------------+
|  KPI 1: Stock Count  | KPI 2: Total Return % | KPI 3: Avg Volatility | KPI 4: Max DD |
+--------------------------------------------------------------------------+
|                                  |                                       |
|  [Chart 1: Price Trends vs SMAs] | [Chart 2: Top Gainers (Bar Chart)]    |
|  X: Date                         | Y: Company                            |
|  Y: Close, SMA_20, SMA_50        | X: Total Return %                     |
|                                  | (Sorted Descending)                   |
+--------------------------------------------------------------------------+
|  [Slicer Panel - Collapsible or Left-Aligned]: Sector Slicer, Company Slicer
+--------------------------------------------------------------------------+
```

### Build Instructions:
1. **Slicers:** Place a Horizontal Date range slicer in the top right. Place dropdown slicers for `Sector` and `Company` in a left-hand navigation column.
2. **KPI Cards:** Use the new **Card (new)** visual to stack 4 cards:
   - **Analyzed Stocks:** `Stock Count`
   - **Cumulative Return:** `Total Return %`
   - **Avg Volatility:** `Avg Volatility`
   - **Max Drawdown:** `Max Drawdown`
3. **Price Trends vs SMAs (Line Chart):**
   - **X-Axis:** `Date`
   - **Y-Axis:** `Close`, `SMA_20`, `SMA_50`
   - **Formatting:** Line weights: Close (3pt, `#3B82F6` blue), SMA_20 (1.5pt, `#F59E0B` amber), SMA_50 (1.5pt, `#8B5CF6` purple, dashed). Turn on Zoom Slider.
4. **Top Gainers (Clustered Bar Chart):**
   - **Y-Axis:** `Company`
   - **X-Axis:** `Total Return %`
   - **Data Labels:** Turn on. Format as percentage.

---

## 3. Page 2: Volatility & Risk Analysis

This page focuses on volatility, drawdowns, and the risk profiles of individual stocks. It features a bookmark toggle to switch views between a Scatter Plot and a Matrix Table.

### Layout Wireframe
```
+--------------------------------------------------------------------------+
|  [Header Band] TITLE: Volatility & Risk Analysis   [Toggle: Scatter / Table]
+--------------------------------------------------------------------------+
|  [Main Pane - Grouped Visuals]                                           |
|  VIEW A (Scatter Plot):                                                  |
|  - X: Avg Volatility                                                     |
|  - Y: Total Return %                                                     |
|  - Size: Total Volume                                                    |
|  - Legend: Risk_Category                                                 |
|                                                                          |
|  VIEW B (Matrix Table):                                                  |
|  - Columns: Company, Sector, Risk_Category, Avg Volatility, Max DD       |
+--------------------------------------------------------------------------+
|  [Bottom Panel: Drawdowns Over Time (Line Chart - Red Accent)]           |
+--------------------------------------------------------------------------+
```

### Build Instructions & Bookmark Toggle Setup:
1. **Scatter Plot:**
   - **Values:** `Company`
   - **X-Axis:** `Avg Volatility`
   - **Y-Axis:** `Total Return %`
   - **Legend:** `Risk_Category`
   - **Reference Line:** Add a vertical constant X line at `0.20` (Low-to-Medium risk boundary) and `0.35` (Medium-to-High risk boundary). Add a horizontal Y reference line at `0.06` (6% Indian Market Risk-free Rate).
2. **Matrix Table:** Add a Table visual displaying `Company`, `Sector`, `Risk_Category`, `Avg Volatility`, `Max Drawdown`. Apply green-to-red conditional formatting to `Avg Volatility` and `Max Drawdown`.
3. **Setup the Toggle (Next-Level Feature):**
   - Open the **Selection Pane** and **Bookmark Pane** (View Ribbon).
   - Place the Scatter Plot and Matrix Table on top of each other in the layout.
   - **Bookmark 1 (Scatter View):** In the Selection Pane, hide the Matrix Table and show the Scatter Plot. In the Bookmark Pane, add a bookmark named `Show Scatter`. Ensure **Data** is unchecked (so it doesn't reset slicers) and **Selected Visuals** is checked.
   - **Bookmark 2 (Table View):** In the Selection Pane, hide the Scatter Plot and show the Matrix Table. In the Bookmark Pane, add a bookmark named `Show Table`.
   - Add two buttons (Insert > Buttons > Navigator > Bookmark Navigator or Blank Buttons) in the top-right. Assign their click actions to trigger `Show Scatter` and `Show Table`.
4. **Drawdowns Over Time (Line Chart):**
   - **X-Axis:** `Date`
   - **Y-Axis:** `Drawdown`
   - **Formatting:** Line color: `#EF4444` (Vibrant Red) with a shaded area below the line representing capital drop events.

---

## 4. Page 3: Sector & Benchmark Comparison

This page compares aggregate performance and sector risk concentrations, incorporating a hover tooltip.

### Layout Wireframe
```
+--------------------------------------------------------------------------+
|  [Header Band] TITLE: Cross-Sector Benchmarking                          |
+--------------------------------------------------------------------------+
|                                      |                                   |
|  [Chart 1: Sector Vol vs Return]     | [Chart 2: Volatility Distribution]|
|  Clustered Column Chart comparing   | Stacked Bar Chart showing number  |
|  Sector Average Vol & Sector Return  | of Low/Med/High stocks in sector  |
|                                      |                                   |
+--------------------------------------------------------------------------+
|                                                                          |
|  [Visual 3: Sector Outperformance Table]                                 |
|  Company | Sector | Total Return % | Outperformance vs Sector            |
|                                                                          |
+--------------------------------------------------------------------------+
```

### Build Instructions & Hover Tooltip Setup:
1. **Sector Performance (Clustered Column Chart):**
   - **X-Axis:** `Sector`
   - **Y-Axis:** `Avg Volatility` and `Total Return %`
   - **Formatting:** Color Volatility as `#EF4444` (red) and Return as `#10B981` (green).
2. **Risk Category Count by Sector (Stacked Column Chart):**
   - **X-Axis:** `Sector`
   - **Y-Axis:** `Stock Count`
   - **Legend:** `Risk_Category`
   - **Colors:** Low (Emerald), Medium (Amber), High (Red).
3. **Sector Outperformance Table:**
   - Add a Table visual displaying `Company`, `Sector`, `Total Return %`, and the measure `Outperformance vs Sector`.
   - **Formatting:** Apply green/red positive/negative font color formatting to the `Outperformance vs Sector` column.
4. **Setup Hover Tooltip Page (Next-Level Feature):**
   - Create a **new page** in Power BI named `Tooltip Page`.
   - In Page Info settings: set **Allow use as tooltip** to **On**. Under Canvas Settings, set Type to **Tooltip** (this changes canvas size to a small tooltip window).
   - In this Tooltip page, add a small Card displaying `Company` name, and a small line chart showing `Close` and `SMA_20` over time.
   - Go back to Page 3. Select the **Sector Performance Chart** and **Outperformance Table**.
   - Under Visual Properties > Tooltips: set Type to **Report Page**, and Page to `Tooltip Page`.
   - *Result:* When you hover over a sector bar or a company row, a pop-up window will instantly display their corresponding trend line.
