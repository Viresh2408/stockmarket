# ============================================================
# POWER BI PYTHON VISUAL — Chart 2: Price Trends vs SMA-20/50
# ============================================================
# HOW TO USE IN POWER BI:
#   1. Insert > Python Visual
#   2. Drag these fields into "Values":
#        Date, Company, Close, SMA_20, SMA_50
#   3. Paste this entire script into the Python script editor
#   TIP: Use a Company slicer to filter to 1 or a few stocks
# ============================================================

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import pandas as pd
import numpy as np

BG_DARK = "#111827"; CARD_BG = "#1F2937"; BORDER = "#374151"
WHITE   = "#F3F4F6"; MUTED   = "#9CA3AF"
BLUE    = "#3B82F6"; AMBER   = "#F59E0B"; PURPLE = "#8B5CF6"

matplotlib.rcParams.update({
    "figure.facecolor": BG_DARK, "axes.facecolor": CARD_BG,
    "axes.edgecolor": BORDER, "axes.labelcolor": WHITE,
    "xtick.color": MUTED, "ytick.color": MUTED, "text.color": WHITE,
    "grid.color": BORDER, "grid.linewidth": 0.5, "grid.alpha": 0.6,
    "legend.facecolor": CARD_BG, "legend.edgecolor": BORDER,
    "font.family": "sans-serif", "font.sans-serif": ["Segoe UI","Arial","DejaVu Sans"],
})

# Power BI dataset columns: Date, Company, Close, SMA_20, SMA_50
dataset['Date'] = pd.to_datetime(dataset['Date'])
companies = dataset['Company'].unique()
n = len(companies); cols = min(3, n); rows = (n + cols - 1) // cols

fig, axes = plt.subplots(rows, cols, figsize=(7 * cols, 4 * rows), squeeze=False)
fig.patch.set_facecolor(BG_DARK)
fig.suptitle("Price Trends vs SMA-20 & SMA-50", fontsize=14,
             fontweight="bold", color=WHITE, y=1.01)

axes_flat = axes.flatten()

for i, company in enumerate(sorted(companies)):
    ax  = axes_flat[i]
    sub = dataset[dataset['Company'] == company].sort_values('Date')
    ax.plot(sub['Date'], sub['Close'],  color=BLUE,   lw=2.5, label='Close',  zorder=3)
    ax.plot(sub['Date'], sub['SMA_20'], color=AMBER,  lw=1.3, label='SMA-20', alpha=0.88)
    ax.plot(sub['Date'], sub['SMA_50'], color=PURPLE, lw=1.3, label='SMA-50',
            alpha=0.88, linestyle='--')
    ax.set_facecolor(CARD_BG)
    for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
    ax.grid(True, linestyle='--')
    ax.set_title(company, fontsize=11, fontweight='bold', color=WHITE, pad=8)
    ax.set_ylabel('Price (INR)', color=MUTED, fontsize=8)
    ax.xaxis.set_major_locator(mticker.MaxNLocator(4))
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'{x:,.0f}'))
    plt.setp(ax.get_xticklabels(), rotation=25, ha='right', fontsize=7)
    if i == 0:
        ax.legend(loc='upper left', fontsize=8, framealpha=0.5)

for j in range(i + 1, len(axes_flat)):
    axes_flat[j].set_visible(False)

fig.tight_layout(pad=2.0)
