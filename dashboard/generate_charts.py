"""
generate_charts.py
==================
Standalone script — reads stock_data_clean.csv and saves all 7
dashboard charts as high-resolution PNGs into:
    dashboard/screenshots/

Run from the project root:
    python dashboard/generate_charts.py
"""

import os
import sys
import matplotlib
matplotlib.use('Agg')                       # non-interactive backend (no window)
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.ticker as mticker
import matplotlib.dates as mdates
import matplotlib.colors as mcolors
import pandas as pd
import numpy as np

# ── Paths ────────────────────────────────────────────────────────
ROOT       = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH  = os.path.join(ROOT, 'data', 'stock_data_clean.csv')
OUT_DIR    = os.path.join(ROOT, 'dashboard', 'screenshots')
os.makedirs(OUT_DIR, exist_ok=True)

def save(fig, name):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches='tight',
                facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  [OK]  Saved -> {path}")

# ── Load Data ────────────────────────────────────────────────────
print("\n[DATA]  Loading data...")
if not os.path.exists(DATA_PATH):
    sys.exit(f"[ERR]  File not found: {DATA_PATH}\n    Run the pipeline first.")

df = pd.read_csv(DATA_PATH)
df['Date'] = pd.to_datetime(df['Date'], errors='coerce', dayfirst=True)
df = df.dropna(subset=['Date']).sort_values(['Company', 'Date'])
print(f"    {len(df):,} rows  |  {df['Company'].nunique()} companies\n")

# ── Colour Palette ───────────────────────────────────────────────
BG_DARK  = "#111827"
CARD_BG  = "#1F2937"
BORDER   = "#374151"
WHITE    = "#F3F4F6"
MUTED    = "#9CA3AF"
BLUE     = "#3B82F6"
AMBER    = "#F59E0B"
RED      = "#EF4444"
GREEN    = "#10B981"
PURPLE   = "#8B5CF6"

BASE_RC = {
    "figure.facecolor" : BG_DARK,
    "axes.facecolor"   : CARD_BG,
    "axes.edgecolor"   : BORDER,
    "axes.labelcolor"  : WHITE,
    "xtick.color"      : MUTED,
    "ytick.color"      : MUTED,
    "text.color"       : WHITE,
    "grid.color"       : BORDER,
    "grid.linewidth"   : 0.5,
    "grid.alpha"       : 0.6,
    "legend.facecolor" : CARD_BG,
    "legend.edgecolor" : BORDER,
    "legend.labelcolor": WHITE,
    "font.family"      : "sans-serif",
    "font.sans-serif"  : ["Segoe UI", "Arial", "DejaVu Sans"],
}
plt.rcParams.update(BASE_RC)

# ════════════════════════════════════════════════════════════════
# CHART 1 — KPI Summary Cards
# ════════════════════════════════════════════════════════════════
print("[CHART]  Chart 1 — KPI Summary Cards")

stock_count = df['Company'].nunique()
ret_df = df.groupby('Company')['Close'].agg(['first', 'last'])
ret_df['return'] = (ret_df['last'] - ret_df['first']) / ret_df['first']
avg_return = ret_df['return'].mean()
avg_vol    = df['Rolling_Volatility'].mean()
max_dd     = df['Drawdown'].min()

kpis = [
    ("Stocks Analysed", f"{stock_count}",      BLUE,                             "[CHART]"),
    ("Avg Return",      f"{avg_return:+.2%}",  GREEN if avg_return >= 0 else RED, "[+]"),
    ("Avg Volatility",  f"{avg_vol:.2%}",      AMBER,                            "[V]"),
    ("Max Drawdown",    f"{max_dd:.2%}",       RED,                              "[-]"),
]

fig, axes = plt.subplots(1, 4, figsize=(16, 3.5))
fig.patch.set_facecolor(BG_DARK)
fig.suptitle("Market Overview — KPI Summary",
             fontsize=14, fontweight="bold", color=WHITE, y=1.04)

for ax, (label, value, colour, icon) in zip(axes, kpis):
    ax.set_facecolor(CARD_BG)
    for spine in ax.spines.values():
        spine.set_edgecolor(colour); spine.set_linewidth(2.5)
    ax.set_xticks([]); ax.set_yticks([])
    ax.add_patch(mpatches.FancyBboxPatch(
        (0.0, 0.88), 1.0, 0.12, boxstyle="square,pad=0",
        transform=ax.transAxes, facecolor=colour, edgecolor="none", alpha=0.20))
    ax.text(0.5, 0.76, icon, ha="center", va="center",
            fontsize=20, transform=ax.transAxes)
    ax.text(0.5, 0.50, value, ha="center", va="center",
            fontsize=30, fontweight="bold", color=colour, transform=ax.transAxes)
    ax.axhline(y=0.30, xmin=0.08, xmax=0.92, color=BORDER, linewidth=1.0)
    ax.text(0.5, 0.15, label, ha="center", va="center",
            fontsize=10, color=MUTED, transform=ax.transAxes)

fig.tight_layout(pad=1.5)
save(fig, "chart1_kpi_cards.png")

# ════════════════════════════════════════════════════════════════
# CHART 2 — Price Trends vs SMA-20 & SMA-50
# ════════════════════════════════════════════════════════════════
print("[CHART]  Chart 2 — Price Trends vs SMA-20 & SMA-50")

companies = sorted(df['Company'].unique())
n    = len(companies)
cols = min(3, n)
rows = (n + cols - 1) // cols

fig, axes = plt.subplots(rows, cols,
                         figsize=(7 * cols, 4 * rows), squeeze=False)
fig.patch.set_facecolor(BG_DARK)
fig.suptitle("Price Trends vs SMA-20 & SMA-50",
             fontsize=16, fontweight="bold", color=WHITE, y=1.01)
axes_flat = axes.flatten()

for i, company in enumerate(companies):
    ax  = axes_flat[i]
    sub = df[df['Company'] == company].sort_values('Date')
    ax.plot(sub['Date'], sub['Close'],  color=BLUE,   lw=2.5, label='Close',  zorder=3)
    ax.plot(sub['Date'], sub['SMA_20'], color=AMBER,  lw=1.3, label='SMA-20', alpha=0.88)
    ax.plot(sub['Date'], sub['SMA_50'], color=PURPLE, lw=1.3, label='SMA-50',
            alpha=0.88, linestyle='--')
    ax.fill_between(sub['Date'], sub['Close'], sub['SMA_20'],
                    where=(sub['Close'] >= sub['SMA_20']),
                    alpha=0.08, color=BLUE, interpolate=True)
    ax.fill_between(sub['Date'], sub['Close'], sub['SMA_20'],
                    where=(sub['Close'] <  sub['SMA_20']),
                    alpha=0.08, color=AMBER, interpolate=True)
    ax.set_facecolor(CARD_BG)
    for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
    ax.grid(True, linestyle='--')
    ax.set_title(company, fontsize=11, fontweight='bold', color=WHITE, pad=8)
    ax.set_ylabel('Price (INR)', color=MUTED, fontsize=8)
    ax.xaxis.set_major_locator(mdates.AutoDateLocator(minticks=3, maxticks=5))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'{x:,.0f}'))
    plt.setp(ax.get_xticklabels(), rotation=25, ha='right', fontsize=7)
    if i == 0:
        ax.legend(loc='upper left', fontsize=8.5, framealpha=0.5, borderpad=0.6)

for j in range(i + 1, len(axes_flat)):
    axes_flat[j].set_visible(False)
fig.tight_layout(pad=2.0)
save(fig, "chart2_price_trends.png")

# ════════════════════════════════════════════════════════════════
# CHART 3 — Volatility Bar Chart
# ════════════════════════════════════════════════════════════════
print("[CHART]  Chart 3 — Volatility Bar Chart")

RISK_COLOUR = {"low": GREEN, "medium": AMBER, "high": RED}
agg3 = (df.groupby('Company')
          .agg(Avg_Vol=('Rolling_Volatility', 'mean'),
               Risk=('Risk_Category', lambda x: x.mode()[0] if not x.mode().empty else 'Medium'))
          .reset_index()
          .sort_values('Avg_Vol', ascending=True))
agg3['colour'] = agg3['Risk'].str.strip().str.lower().map(
    lambda r: RISK_COLOUR.get(r, AMBER))

fig, ax = plt.subplots(figsize=(12, max(5, len(agg3) * 0.52)))
fig.patch.set_facecolor(BG_DARK); ax.set_facecolor(CARD_BG)
bars = ax.barh(agg3['Company'], agg3['Avg_Vol'],
               color=agg3['colour'], edgecolor=BG_DARK, linewidth=0.6, height=0.65)
for bar, val in zip(bars, agg3['Avg_Vol']):
    ax.text(bar.get_width() + agg3['Avg_Vol'].max() * 0.008,
            bar.get_y() + bar.get_height() / 2,
            f"{val:.2%}", va='center', ha='left', fontsize=8, color=MUTED)
ax.set_xlabel('Average Rolling Volatility', color=MUTED, fontsize=9)
ax.set_title('Volatility by Stock — Risk Category Breakdown',
             fontsize=14, fontweight='bold', color=WHITE, pad=14)
ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'{x:.1%}'))
ax.grid(True, axis='x', linestyle='--'); ax.set_axisbelow(True)
for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
ax.legend(handles=[mpatches.Patch(color=GREEN, label='Low Risk'),
                   mpatches.Patch(color=AMBER, label='Medium Risk'),
                   mpatches.Patch(color=RED,   label='High Risk')],
          loc='lower right', fontsize=9, framealpha=0.4,
          facecolor=CARD_BG, edgecolor=BORDER)
fig.tight_layout(pad=2.0)
save(fig, "chart3_volatility_bar.png")

# ════════════════════════════════════════════════════════════════
# CHART 4 — Risk Category Donut
# ════════════════════════════════════════════════════════════════
print("[CHART]  Chart 4 — Risk Category Donut")

RISK_ORDER = ["Low", "Medium", "High"]
RISK_CLR   = {"Low": GREEN, "Medium": AMBER, "High": RED}
comp_risk4 = (df.groupby('Company')['Risk_Category']
                .agg(lambda x: x.mode()[0] if not x.mode().empty else 'Medium')
                .reset_index())
comp_risk4.columns = ['Company', 'Risk']
comp_risk4['Risk'] = comp_risk4['Risk'].str.strip().str.capitalize()
counts4  = comp_risk4.groupby('Risk')['Company'].count().reindex(RISK_ORDER, fill_value=0)
labels4  = [l for l, s in zip(counts4.index, counts4.values) if s > 0]
sizes4   = [s for s in counts4.values if s > 0]
colours4 = [RISK_CLR[l] for l in labels4]
total4   = sum(sizes4)

fig, ax = plt.subplots(figsize=(8, 6))
fig.patch.set_facecolor(BG_DARK); ax.set_facecolor(BG_DARK)
pie_out = ax.pie(
    sizes4, colors=colours4,
    autopct=lambda pct: f"{pct:.1f}%\n({int(round(pct*total4/100))})",
    pctdistance=0.78, startangle=90,
    wedgeprops=dict(width=0.52, edgecolor=BG_DARK, linewidth=2.5))
autotexts = pie_out[2]
for at in autotexts:
    at.set_fontsize(10); at.set_fontweight("bold"); at.set_color(WHITE)
ax.text(0,  0.10, str(total4), ha='center', va='center',
        fontsize=34, fontweight='bold', color=WHITE)
ax.text(0, -0.18, "Stocks\nAnalysed", ha='center', va='center',
        fontsize=9, color=MUTED)
ax.set_title("Stock Distribution by Risk Category",
             fontsize=14, fontweight='bold', color=WHITE, pad=18)
ax.legend(handles=[mpatches.Patch(color=RISK_CLR[l],
                                  label=f"{l} Risk  —  {s} stock{'s' if s!=1 else ''}")
                   for l, s in zip(labels4, sizes4)],
          loc='lower center', bbox_to_anchor=(0.5, -0.12),
          ncol=len(labels4), fontsize=9.5, framealpha=0.35,
          facecolor=CARD_BG, edgecolor=BORDER)
fig.tight_layout(pad=1.5)
save(fig, "chart4_risk_donut.png")

# ════════════════════════════════════════════════════════════════
# CHART 5 — Risk / Return Scatter
# ════════════════════════════════════════════════════════════════
print("[CHART]  Chart 5 — Risk/Return Scatter")

SECTOR_COLOURS = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6",
                  "#EC4899","#14B8A6","#F97316","#6366F1","#84CC16",
                  "#06B6D4","#A78BFA"]
agg5 = (df.groupby(['Company', 'Sector'])
          .agg(Avg_Return=('Daily_Return',      'mean'),
               Avg_Vol   =('Rolling_Volatility','mean'),
               Tot_Vol   =('Volume',            'sum'))
          .reset_index())
sectors5 = sorted(agg5['Sector'].unique())
sec_col  = {s: SECTOR_COLOURS[i % len(SECTOR_COLOURS)] for i, s in enumerate(sectors5)}
agg5['colour'] = agg5['Sector'].map(sec_col)
vmin, vmax = agg5['Tot_Vol'].min(), agg5['Tot_Vol'].max()
agg5['BubbleSize'] = 60 + 540*(agg5['Tot_Vol']-vmin)/(vmax-vmin+1e-9)

fig, ax = plt.subplots(figsize=(13, 7.5))
fig.patch.set_facecolor(BG_DARK); ax.set_facecolor(CARD_BG)
x_mid = agg5['Avg_Vol'].median(); y_mid = agg5['Avg_Return'].median()
xlim = (agg5['Avg_Vol'].min()*0.85,    agg5['Avg_Vol'].max()*1.12)
ylim = (agg5['Avg_Return'].min()*1.4,  agg5['Avg_Return'].max()*1.4)
ax.axvline(x_mid, color=BORDER, lw=1.0, linestyle='--', alpha=0.7)
ax.axhline(y_mid, color=BORDER, lw=1.0, linestyle='--', alpha=0.7)
ax.fill_between([xlim[0], x_mid],  y_mid, ylim[1], color=GREEN,  alpha=0.04)
ax.fill_between([x_mid,  xlim[1]], y_mid, ylim[1], color=AMBER,  alpha=0.04)
ax.fill_between([xlim[0], x_mid],  ylim[0], y_mid, color=PURPLE, alpha=0.04)
ax.fill_between([x_mid,  xlim[1]], ylim[0], y_mid, color=RED,    alpha=0.04)
for _, row in agg5.iterrows():
    ax.scatter(row['Avg_Vol'], row['Avg_Return'],
               s=row['BubbleSize'], color=row['colour'],
               alpha=0.82, edgecolors=WHITE, linewidths=0.6, zorder=3)
    ax.annotate(row['Company'],
                xy=(row['Avg_Vol'], row['Avg_Return']),
                xytext=(5, 5), textcoords='offset points',
                fontsize=7, color=WHITE, alpha=0.85)
ax.set_xlim(xlim); ax.set_ylim(ylim)
ax.set_xlabel('Average Rolling Volatility  ->  Higher Risk', color=MUTED, fontsize=9, labelpad=8)
ax.set_ylabel('Average Daily Return  ->  Higher Reward',     color=MUTED, fontsize=9, labelpad=8)
ax.set_title('Risk vs Return — Sector Bubble Chart',
             fontsize=14, fontweight='bold', color=WHITE, pad=14)
ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'{x:.1%}'))
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda y, _: f'{y:.2%}'))
ax.grid(True, linestyle='--')
for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
ax.legend(handles=[mpatches.Patch(color=sec_col[s], label=s) for s in sectors5],
          title='Sector', title_fontsize=8,
          loc='upper left', bbox_to_anchor=(1.01, 1.0),
          fontsize=8.5, framealpha=0.4, facecolor=CARD_BG, edgecolor=BORDER)
ax.text(0.99, 0.02, "Bubble size = Total Volume",
        transform=ax.transAxes, ha='right', va='bottom',
        fontsize=7.5, color=MUTED, style='italic')
fig.tight_layout(pad=2.0)
save(fig, "chart5_risk_return_scatter.png")

# ════════════════════════════════════════════════════════════════
# CHART 6 — Sector Avg Return Bar Chart
# ════════════════════════════════════════════════════════════════
print("[CHART]  Chart 6 — Sector Avg Return")

agg6 = (df.groupby('Sector')['Daily_Return'].mean()
          .reset_index()
          .rename(columns={'Daily_Return': 'Avg_Return'})
          .sort_values('Avg_Return', ascending=False)
          .reset_index(drop=True))
agg6['colour']    = agg6['Avg_Return'].apply(lambda r: GREEN if r >= 0 else RED)
agg6['colour_bg'] = agg6['Avg_Return'].apply(lambda r: "#064E3B" if r >= 0 else "#7F1D1D")
best6 = agg6.iloc[0]; worst6 = agg6.iloc[-1]

fig, ax = plt.subplots(figsize=(max(10, len(agg6)*1.1), 6))
fig.patch.set_facecolor(BG_DARK); ax.set_facecolor(CARD_BG)
x6 = np.arange(len(agg6))
ax.bar(x6, agg6['Avg_Return'], color=agg6['colour_bg'], width=0.80, zorder=2)
bars6 = ax.bar(x6, agg6['Avg_Return'], color=agg6['colour'],
               edgecolor=BG_DARK, linewidth=0.8, width=0.62, zorder=3)
ax.axhline(0, color=MUTED, linewidth=1.2, zorder=4)
for bar, val in zip(bars6, agg6['Avg_Return']):
    y_pos = val + abs(val)*0.05 if val >= 0 else val - abs(val)*0.05
    ax.text(bar.get_x()+bar.get_width()/2, y_pos, f"{val:+.3%}",
            ha='center', va='bottom' if val >= 0 else 'top',
            fontsize=8.5, fontweight='bold', color=WHITE)
ax.set_xticks(x6)
ax.set_xticklabels(agg6['Sector'], rotation=20, ha='right', fontsize=9)
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda y, _: f'{y:.2%}'))
ax.set_ylabel('Average Daily Return', color=MUTED, fontsize=9, labelpad=8)
ax.set_title('Sector Average Daily Return',
             fontsize=14, fontweight='bold', color=WHITE, pad=10)
ax.text(0.5, 1.035,
        f"Best: {best6['Sector']} ({best6['Avg_Return']:+.3%})   |   "
        f"Worst: {worst6['Sector']} ({worst6['Avg_Return']:+.3%})",
        transform=ax.transAxes, ha='center', fontsize=8.5, color=MUTED)
ax.grid(True, axis='y', linestyle='--'); ax.set_axisbelow(True)
for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
fig.tight_layout(pad=2.0)
save(fig, "chart6_sector_avg_return.png")

# ════════════════════════════════════════════════════════════════
# CHART 7 — Sector × Risk Category Matrix
# ════════════════════════════════════════════════════════════════
print("[CHART]  Chart 7 — Sector × Risk Matrix")

RISK_ORDER7 = ["Low", "Medium", "High"]
RISK_HDR7   = {"Low": GREEN, "Medium": AMBER, "High": RED}
COL_CMAPS7  = {
    "Low"    : mcolors.LinearSegmentedColormap.from_list("low",    ["#1F2937", "#10B981"]),
    "Medium" : mcolors.LinearSegmentedColormap.from_list("medium", ["#1F2937", "#F59E0B"]),
    "High"   : mcolors.LinearSegmentedColormap.from_list("high",   ["#1F2937", "#EF4444"]),
}
comp_risk7 = (df.groupby(['Company', 'Sector'])['Risk_Category']
                .agg(lambda x: x.mode()[0] if not x.mode().empty else 'Medium')
                .reset_index())
comp_risk7.columns = ['Company', 'Sector', 'Risk']
comp_risk7['Risk'] = comp_risk7['Risk'].str.strip().str.capitalize()
pivot7 = (comp_risk7.groupby(['Sector', 'Risk'])['Company']
                    .count()
                    .unstack(fill_value=0)
                    .reindex(columns=RISK_ORDER7, fill_value=0)
                    .sort_index())
sectors7    = pivot7.index.tolist()
row_totals7 = pivot7.sum(axis=1).values
col_totals7 = pivot7.sum(axis=0).values
grand7      = int(row_totals7.sum())

n_rows7 = len(sectors7)
cell_w7 = 1.8; cell_h7 = 0.62
fig, ax = plt.subplots(figsize=(cell_w7*(3+2.4), cell_h7*(n_rows7+2.8)))
fig.patch.set_facecolor(BG_DARK); ax.set_facecolor(BG_DARK)
ax.set_xlim(0, 3+2.4); ax.set_ylim(0, n_rows7+2.8); ax.axis('off')

ax.text((3+2.4)/2, n_rows7+2.45,
        "Sector × Risk Category — Stock Count Matrix",
        ha='center', va='center', fontsize=13, fontweight='bold', color=WHITE)
ax.text((3+2.4)/2, n_rows7+2.0, f"Total stocks analysed: {grand7}",
        ha='center', va='center', fontsize=8.5, color=MUTED)

for j, risk in enumerate(RISK_ORDER7):
    cx = 1.6 + j*cell_w7 + cell_w7/2
    ax.add_patch(plt.Rectangle((1.6+j*cell_w7+0.08, n_rows7+1.0),
                                cell_w7-0.16, 0.62,
                                facecolor=RISK_HDR7[risk], edgecolor='none', alpha=0.22))
    ax.text(cx, n_rows7+1.4, f"{risk} Risk",
            ha='center', va='center', fontsize=9.5, fontweight='bold',
            color=RISK_HDR7[risk])
    ax.text(cx, n_rows7+0.55, f"({int(col_totals7[j])} stocks)",
            ha='center', va='center', fontsize=7.5, color=MUTED)

ax.text(1.6+3*cell_w7+cell_w7/2, n_rows7+1.4, "Total",
        ha='center', va='center', fontsize=9.5, fontweight='bold', color=WHITE)

for i, sector in enumerate(sectors7):
    row_y = n_rows7 - i - 1
    ax.text(0.08, row_y+0.5, sector, ha='left', va='center', fontsize=8.8, color=WHITE,
            fontweight='bold' if row_totals7[i] == row_totals7.max() else 'normal')
    for j, risk in enumerate(RISK_ORDER7):
        count7  = int(pivot7.loc[sector, risk])
        col_max = int(pivot7[risk].max())
        norm    = count7/col_max if col_max > 0 else 0
        cx = 1.6 + j*cell_w7
        ax.add_patch(plt.Rectangle((cx+0.06, row_y+0.08), cell_w7-0.12, 0.78,
                                    facecolor=COL_CMAPS7[risk](norm*0.85+0.05),
                                    edgecolor=BORDER, linewidth=0.8))
        ax.text(cx+cell_w7/2, row_y+0.50, str(count7),
                ha='center', va='center',
                fontsize=16 if count7 > 0 else 11,
                fontweight='bold' if count7 > 0 else 'normal',
                color=WHITE if norm > 0.25 else MUTED)
        if row_totals7[i] > 0 and count7 > 0:
            ax.text(cx+cell_w7/2, row_y+0.20,
                    f"{count7/row_totals7[i]:.0%}",
                    ha='center', va='center', fontsize=7, color=MUTED)
    tx = 1.6 + 3*cell_w7
    ax.add_patch(plt.Rectangle((tx+0.06, row_y+0.08), cell_w7-0.12, 0.78,
                                facecolor=BORDER, edgecolor='none'))
    ax.text(tx+cell_w7/2, row_y+0.50, str(int(row_totals7[i])),
            ha='center', va='center', fontsize=13, fontweight='bold', color=WHITE)

total_y = -0.9
ax.text(0.08, total_y+0.5, "Total", ha='left', va='center',
        fontsize=8.8, fontweight='bold', color=WHITE)
for j, risk in enumerate(RISK_ORDER7):
    cx = 1.6 + j*cell_w7
    ax.add_patch(plt.Rectangle((cx+0.06, total_y+0.08), cell_w7-0.12, 0.78,
                                facecolor=RISK_HDR7[risk], edgecolor='none', alpha=0.18))
    ax.text(cx+cell_w7/2, total_y+0.50, str(int(col_totals7[j])),
            ha='center', va='center', fontsize=13, fontweight='bold',
            color=RISK_HDR7[risk])
tx = 1.6 + 3*cell_w7
ax.add_patch(plt.Rectangle((tx+0.06, total_y+0.08), cell_w7-0.12, 0.78,
                            facecolor="#3B82F6", edgecolor='none', alpha=0.25))
ax.text(tx+cell_w7/2, total_y+0.50, str(grand7),
        ha='center', va='center', fontsize=13, fontweight='bold', color="#3B82F6")

fig.tight_layout(pad=0.5)
save(fig, "chart7_sector_risk_matrix.png")

# ════════════════════════════════════════════════════════════════
print(f"\n[DONE]  All 7 charts saved to:\n    {OUT_DIR}\n")
