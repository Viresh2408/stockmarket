# ============================================================
# POWER BI PYTHON VISUAL — Chart 1: KPI Summary Cards
# ============================================================
# HOW TO USE IN POWER BI:
#   1. Insert > Python Visual
#   2. Drag these fields into "Values":
#        Company, Close (avg), Rolling_Volatility (avg),
#        Drawdown (min), Volume (sum)
#   3. Paste this entire script into the Python script editor
# ============================================================

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# ── Dark Theme Colours ───────────────────────────────────────
BG_DARK   = "#111827"
CARD_BG   = "#1F2937"
BORDER    = "#374151"
WHITE     = "#F3F4F6"
MUTED     = "#9CA3AF"
BLUE      = "#3B82F6"
AMBER     = "#F59E0B"
RED       = "#EF4444"
GREEN     = "#10B981"

matplotlib.rcParams.update({
    "figure.facecolor": BG_DARK,
    "axes.facecolor":   CARD_BG,
    "text.color":       WHITE,
    "font.family":      "sans-serif",
    "font.sans-serif":  ["Segoe UI", "Arial", "DejaVu Sans"],
})

# ── Compute KPIs from Power BI dataset ──────────────────────
# Power BI sends: dataset  (a pandas DataFrame)
stock_count = dataset['Company'].nunique()

# Total Return: (last Close - first Close) / first Close per company
ret = dataset.groupby('Company')['Close'].agg(['first','last'])
ret['return'] = (ret['last'] - ret['first']) / ret['first']
avg_return = ret['return'].mean()

avg_vol = dataset['Rolling_Volatility'].mean()
max_dd  = dataset['Drawdown'].min()

kpis = [
    ("Stocks\nAnalysed",  f"{stock_count}",        BLUE),
    ("Avg\nReturn",        f"{avg_return:+.1%}",    GREEN if avg_return >= 0 else RED),
    ("Avg\nVolatility",    f"{avg_vol:.1%}",        AMBER),
    ("Max\nDrawdown",      f"{max_dd:.1%}",         RED),
]

fig, axes = plt.subplots(1, 4, figsize=(14, 3.2))
fig.patch.set_facecolor(BG_DARK)
fig.suptitle("Market Overview — KPI Summary", fontsize=13,
             fontweight="bold", color=WHITE, y=1.02)

for ax, (label, value, colour) in zip(axes, kpis):
    ax.set_facecolor(CARD_BG)
    for spine in ax.spines.values():
        spine.set_edgecolor(colour)
        spine.set_linewidth(2.5)
    ax.set_xticks([]); ax.set_yticks([])
    ax.text(0.5, 0.60, value, ha="center", va="center",
            fontsize=30, fontweight="bold", color=colour, transform=ax.transAxes)
    ax.text(0.5, 0.22, label, ha="center", va="center",
            fontsize=9.5, color=MUTED, transform=ax.transAxes)

fig.tight_layout()
