"""
app.py — Streamlit Dashboard
Run locally:   streamlit run app.py
Deploy free:   https://streamlit.io/cloud (sign in with GitHub)
"""

import streamlit as st
import pandas as pd
import os

st.set_page_config(
    page_title="Stock Market Risk Dashboard",
    page_icon="📈",
    layout="wide",
)

# ── Header ────────────────────────────────────────────────────────
st.title("📊 Stock Market Risk & Analytics Dashboard")
st.markdown("*15 NSE stocks · 7 sectors · 2-year daily data · Volatility-based risk scoring*")
st.divider()

# ── Screenshot directory ──────────────────────────────────────────
SHOTS = os.path.join(os.path.dirname(__file__), "dashboard", "screenshots")

def show_chart(path, caption):
    if os.path.exists(path):
        st.image(path, caption=caption, use_container_width=True)
    else:
        st.warning(f"Chart not found: {path}. Run `python dashboard/generate_charts.py` first.")

# ── Page 1: Market Overview ───────────────────────────────────────
st.header("Page 1 — Market Overview")

col1, col2 = st.columns([1, 1])
with col1:
    show_chart(os.path.join(SHOTS, "chart1_kpi_cards.png"),
               "Chart 1 — KPI Summary Cards")
with col2:
    st.markdown("### Key Performance Indicators")
    st.markdown("""
    - **Stocks Analysed** — Total unique companies
    - **Avg Return** — Mean price return across all stocks
    - **Avg Volatility** — Mean annualized rolling volatility
    - **Max Drawdown** — Worst peak-to-trough decline
    """)

st.divider()
show_chart(os.path.join(SHOTS, "chart2_price_trends.png"),
           "Chart 2 — Price Trends vs SMA-20 & SMA-50")

# ── Page 2: Risk Analysis ─────────────────────────────────────────
st.header("Page 2 — Risk Analysis")

show_chart(os.path.join(SHOTS, "chart3_volatility_bar.png"),
           "Chart 3 — Volatility by Stock (colour-coded by Risk Category)")
st.divider()

col3, col4 = st.columns([1, 1])
with col3:
    show_chart(os.path.join(SHOTS, "chart4_risk_donut.png"),
               "Chart 4 — Risk Category Distribution")
with col4:
    st.markdown("### Risk Classification")
    st.markdown("""
    Stocks are classified into **three equal terciles** based on their
    average 20-day annualized rolling volatility:

    | Category | Rank | Volatility |
    |---|---|---|
    | 🟢 Low Risk | 1–5 | Bottom 33% |
    | 🟡 Medium Risk | 6–10 | Middle 33% |
    | 🔴 High Risk | 11–15 | Top 33% |
    """)

# ── Page 3: Sector Comparison ─────────────────────────────────────
st.header("Page 3 — Sector Comparison")

show_chart(os.path.join(SHOTS, "chart5_risk_return_scatter.png"),
           "Chart 5 — Risk vs Return Bubble Chart (size = Total Volume)")
st.divider()

col5, col6 = st.columns([1, 1])
with col5:
    show_chart(os.path.join(SHOTS, "chart6_sector_avg_return.png"),
               "Chart 6 — Sector Average Daily Return")
with col6:
    show_chart(os.path.join(SHOTS, "chart7_sector_risk_matrix.png"),
               "Chart 7 — Sector x Risk Category Matrix")

# ── Raw Data Preview ──────────────────────────────────────────────
st.divider()
st.header("Raw Data Preview")
data_path = os.path.join(os.path.dirname(__file__), "data", "stock_data_clean.csv")
if os.path.exists(data_path):
    df = pd.read_csv(data_path)
    st.markdown(f"**{len(df):,} rows · {df['Company'].nunique()} companies · {df['Sector'].nunique()} sectors**")
    st.dataframe(
        df.head(50),
        use_container_width=True,
        hide_index=True,
    )
else:
    st.warning("data/stock_data_clean.csv not found. Run the pipeline first.")

# ── Footer ────────────────────────────────────────────────────────
st.divider()
st.caption("Built with Python · pandas · matplotlib · Streamlit | Data: Yahoo Finance (yfinance)")
