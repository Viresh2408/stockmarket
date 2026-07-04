# ============================================================
# POWER BI PYTHON VISUAL — Chart 3: Top Gainers & Losers
# ============================================================
# HOW TO USE IN POWER BI:
#   1. Insert > Python Visual
#   2. Drag these fields into "Values":
#        Company, Close (do NOT aggregate — keep raw)
#   3. Paste this entire script into the Python script editor
# ============================================================

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import pandas as pd

BG_DARK = "#111827"; CARD_BG = "#1F2937"; BORDER = "#374151"
WHITE   = "#F3F4F6"; MUTED   = "#9CA3AF"
GREEN   = "#10B981"; RED     = "#EF4444"

matplotlib.rcParams.update({
    "figure.facecolor": BG_DARK, "axes.facecolor": CARD_BG,
    "axes.edgecolor": BORDER, "axes.labelcolor": WHITE,
    "xtick.color": MUTED, "ytick.color": MUTED, "text.color": WHITE,
    "grid.color": BORDER, "grid.linewidth": 0.5, "grid.alpha": 0.6,
    "font.family": "sans-serif", "font.sans-serif": ["Segoe UI","Arial","DejaVu Sans"],
})

# Compute Total Return per company: (last - first) / first
# Power BI dataset columns: Company, Close
grp = dataset.groupby('Company')['Close'].agg(['first','last']).reset_index()
grp['Total_Return_Pct'] = (grp['last'] - grp['first']) / grp['first'] * 100
grp = grp.sort_values('Total_Return_Pct', ascending=True)

colors = [GREEN if r >= 0 else RED for r in grp['Total_Return_Pct']]

fig, ax = plt.subplots(figsize=(10, max(5, len(grp) * 0.5)))
fig.patch.set_facecolor(BG_DARK)

bars = ax.barh(grp['Company'], grp['Total_Return_Pct'],
               color=colors, edgecolor=BORDER, height=0.65)

for bar, val in zip(bars, grp['Total_Return_Pct']):
    sign   = '+' if val >= 0 else ''
    offset = 0.3 if val >= 0 else -0.3
    ax.text(bar.get_width() + offset,
            bar.get_y() + bar.get_height() / 2,
            f'{sign}{val:.1f}%', va='center',
            ha='left' if val >= 0 else 'right',
            fontsize=9, color=WHITE, fontweight='bold')

ax.axvline(0, color=BORDER, lw=1.5)
ax.set_facecolor(CARD_BG)
for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
ax.grid(True, axis='x', linestyle='--')
ax.set_title('Top Gainers & Losers — Total Return %',
             fontsize=12, fontweight='bold', color=WHITE, pad=10)
ax.set_xlabel('Total Return (%)', color=MUTED, fontsize=9)
ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'{x:+.0f}%'))
ax.tick_params(axis='y', labelsize=9, labelcolor=WHITE)

fig.tight_layout()
