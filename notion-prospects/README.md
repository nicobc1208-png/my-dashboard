# Nick Digital — Notion Prospect Pages Builder

Creates **7 new prospect pages** in your Notion workspace (same structure as your
existing "medspas prospects" page), each pre-loaded with 10 researched prospect
businesses in high-value niches that can easily afford the $1,500–$3,000 setup +
$500–$1,000/month pricing.

## Niches Included

| # | Niche | Avg Ticket | Why They Pay |
|---|-------|-----------|--------------|
| 1 | 🔪 Plastic Surgery & Cosmetic Clinics | $3K–$15K/patient | Near-identical to medspa model |
| 2 | ⚖️ Personal Injury Law Firms | $15K–$100K/case fee | 1 signed case = massive ROI |
| 3 | 🏠 Roofing Companies | $8K–$25K/job | Storm seasons = lead volume pressure |
| 4 | ❄️ HVAC Contractors | $3K–$12K/job | 400K+ businesses, most have no automation |
| 5 | 🦷 Cosmetic Dentists & Implant Centers | $3K–$8K/procedure | Closest to medspa model |
| 6 | 🦴 Chiropractors & Physical Therapy | Recurring patients | 26.3% CAGR market, no-show problem |
| 7 | 🏡 Real Estate Teams & Boutique Brokerages | $10K–$30K/commission | Lead nurture automation = huge ROI |

Each page includes:
- A pitch summary (why Nick Digital is a perfect fit)
- A filterable database with 10 prospect businesses per niche
- Properties: Business Name, City, State, Website, Revenue Estimate, Status,
  Priority, Services Needed, Setup Price, Monthly Retainer, Notes

## Setup (5 minutes)

### 1. Install dependencies
```bash
cd notion-prospects
npm install
```

### 2. Create a Notion Integration
1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**
3. Name it "Nick Digital Prospects Builder"
4. Copy the **Internal Integration Secret** (starts with `secret_`)

### 3. Share your parent page with the integration
1. Open the Notion page that contains your "medspas prospects" page
2. Click **Share** (top right) → **Invite**
3. Search for your integration name → **Invite**

### 4. Get your parent page ID
1. Open that same parent page in Notion
2. Click the **⋯** menu → **Copy link**
3. The page ID is the 32-character string at the end of the URL

### 5. Configure your `.env` file
```bash
cp .env.example .env
# Edit .env with your NOTION_KEY and PARENT_PAGE_ID
```

### 6. Run the script
```bash
node create-pages.js
```

The script will create all 7 niche pages with 70 total prospects (~2-3 minutes).

## After Running

- Open Notion and find the 7 new pages next to your "medspas prospects" page
- Switch each database to **Table** view for a spreadsheet layout
- Update the **Status** field as you work each lead (New Lead → Contacted → Won ✅)
- Filter by **Priority: High** to start with the hottest prospects first
- Add phone numbers as you find them via Google Maps / LinkedIn

## Customizing

Edit `create-pages.js` to:
- Add more prospects to any niche (copy the existing object format)
- Add new niches (copy the full niche object structure)
- Adjust pricing options (Setup Price / Monthly Retainer select options)
