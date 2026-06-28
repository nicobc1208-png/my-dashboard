/**
 * Nick Digital — Add More Prospects (Batch 20)
 * Run: NOTION_KEY=... node add-more-prospects-batch20.js
 */

const { Client } = require('@notionhq/client');

const NOTION_KEY = process.env.NOTION_KEY;
const notion = new Client({ auth: NOTION_KEY });

const rt = (text) => [{ type: 'text', text: { content: String(text || '') } }];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, label, retries = 4) {
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (e) {
      if (i === retries) throw e;
      const wait = 1000 * Math.pow(2, i);
      console.log(`    ⚠ Retry ${i + 1} in ${wait}ms for "${label}"…`);
      await sleep(wait);
    }
  }
}

async function addProspect(dbId, p, index) {
  const props = {
    'Business Name': { title: rt(p.name) },
    '#':             { number: index },
    'Status':        { select: { name: 'New' } },
    'Notes':         { rich_text: rt(p.notes || '') },
    'Has Website':   { select: { name: p.hasWebsite || 'No' } },
  };
  if (p.owner)     props['Owner Name']           = { rich_text: rt(p.owner) };
  if (p.location)  props['Location']              = { rich_text: rt(p.location) };
  if (p.phone)     props['Phone']                 = { rich_text: rt(p.phone) };
  if (p.website)   props['Website']               = { url: p.website };
  if (p.instagram) props['Instagram']             = { url: p.instagram };
  if (p.wqs)       props['Website Quality Score'] = { number: p.wqs };
  if (p.opp)       props['Opportunity Score']     = { number: p.opp };
  await withRetry(() => notion.pages.create({ parent: { database_id: dbId }, properties: props }), `add: ${p.name}`);
}

const DB = {
  plasticSurgery: '38d657af-efa9-81da-b04c-d4910b784937',
  personalInjury: '38d657af-efa9-81f3-92d6-d1a72328a513',
  roofing:        '38d657af-efa9-816e-9ba1-d06c5b7b7d70',
  hvac:           '38d657af-efa9-81f8-840f-f41b7774f06e',
  cosmeticDentist:'38d657af-efa9-8130-a9cc-f66d785d4fa0',
  chiroPT:        '38d657af-efa9-8163-aa10-ee5005b0f56c',
  realEstate:     '38d657af-efa9-8101-b4c4-f401f9a61122',
};

const BATCHES = [
  {
    label: '🔪 Plastic Surgery — Buffalo, NY & Omaha, NE',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Aesthetic Associates Centre for Plastic Surgery',
        owner: 'Dr. Bradley Calobrace / Dr. Mary Gingrass',
        location: 'Buffalo, NY',
        phone: '(716) 636-3326',
        website: 'https://www.aesthetic-associates.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified plastic surgeons in Buffalo, NY. Western New York is often overlooked but has a strong healthcare (ECMC, Roswell Park), university (UB), and manufacturing professional base. No automated consultation booking or post-consult follow-up. Buffalo has significantly lower cost-of-living than NYC = clients have more disposable income for aesthetics. Underserved market.',
      },
      {
        name: 'Eastern Niagara Plastic Surgery',
        owner: 'Dr. Robert Skalicky',
        location: 'Lockport, NY',
        phone: '(716) 439-9990',
        website: 'https://www.enplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Board-certified plastic surgeon in Lockport (Niagara County near Buffalo). Solo boutique practice serving Western New York. No automated consultation funnel or post-procedure nurturing. Western NY is massively underserved by digital marketing agencies for plastic surgery. Being first to pitch automation here = clear market advantage with little competition.',
      },
      {
        name: 'Omaha Plastic Surgery',
        owner: 'Dr. R. Gregory Smith',
        location: 'Omaha, NE',
        phone: '(402) 829-6384',
        website: 'https://www.omahaplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Omaha plastic surgeon with a well-established practice. Omaha is a major Midwest financial hub (Warren Buffett\'s home, Berkshire Hathaway, Union Pacific HQ) with significant high-income population. No automated consultation booking or post-consult drip. Omaha has a strong affluent professional class that is underserved by aesthetic digital marketing.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Buffalo, NY & Omaha, NE',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Cellino Law',
        owner: '',
        location: 'Buffalo, NY',
        phone: '(716) 888-8888',
        website: 'https://www.cellinolaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'One of Buffalo\'s most recognized personal injury firms — formerly Cellino & Barnes, now operating independently. Heavy TV advertising in Western NY. No automated after-hours intake chatbot or post-settlement review collection. Buffalo receives significant winter weather — car accidents on icy roads are a major PI case driver. Automated intake converts their large ad spend more efficiently.',
      },
      {
        name: 'Brown Chiari LLP',
        owner: '',
        location: 'Lancaster, NY',
        phone: '(716) 681-7190',
        website: 'https://www.brownchiari.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Western New York personal injury and medical malpractice firm. Handles car accidents, medical malpractice, workers\' comp. Buffalo-area industries (steel, auto, chemical) = significant workplace injury caseload. No automated intake or 24/7 lead capture. WNY industrial workforce = constant supply of PI cases. Automated chatbot captures after-hours accident leads.',
      },
      {
        name: 'Hauptman, O\'Brien, Wolf & Lathrop',
        owner: '',
        location: 'Omaha, NE',
        phone: '(402) 390-9000',
        website: 'https://www.hauptmanobrien.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Nebraska\'s leading personal injury firm with decades of major verdicts. High-profile cases, respected in the Omaha legal community. No automated 24/7 intake or post-settlement review automation. Omaha sits on I-80, one of the busiest trucking corridors in the US — trucking accident cases are high-value and frequent. Automated intake = capturing leads around the clock.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Buffalo, NY & Omaha, NE',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Buffalo Restoration',
        owner: '',
        location: 'Buffalo, NY',
        phone: '(716) 832-1100',
        website: 'https://www.buffalorestoration.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Buffalo roofing + restoration contractor. Buffalo is one of the snowiest cities in the US — lake-effect snow from Lake Erie creates massive ice dam and roof damage every winter. No automated storm/winter damage intake page or ice dam emergency campaigns. Buffalo winter roofing damage is highly predictable — automated pre-winter check-in campaigns + post-storm outreach = strong ROI.',
      },
      {
        name: 'Forino Roofing',
        owner: '',
        location: 'Buffalo, NY',
        phone: '(716) 856-1232',
        website: 'https://www.forinoroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established Buffalo roofing company. Western New York receives among the most snow in the continental US — roofing demand driven by ice dams, heavy snow loads, and spring leaks. No automated seasonal maintenance campaigns or review collection. Long-tenured company with no digital automation = strong re-engagement + new season campaigns pitch.',
      },
      {
        name: 'Academy Roofing',
        owner: '',
        location: 'Omaha, NE',
        phone: '(402) 614-9999',
        website: 'https://www.academyroofingomaha.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Omaha roofing contractor with strong local reputation. Nebraska receives significant hail storms — Omaha is in the Great Plains hail belt. No automated storm damage intake or post-storm lead capture campaigns. Nebraska hail season creates massive, predictable demand spikes. Automated storm alert text campaigns + insurance claim landing pages = owning the post-hail lead capture window.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Buffalo, NY & Omaha, NE',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Emerald Isle Plumbing & Heating',
        owner: '',
        location: 'Buffalo, NY',
        phone: '(716) 876-3999',
        website: 'https://www.emeraldisleplumbing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Buffalo plumbing + heating contractor. Buffalo winters are extreme — heating failures can be life-threatening emergencies. Strong demand for heating service + emergency repairs. No automated maintenance plan upsells or seasonal tune-up reminders. Buffalo homeowners = highly motivated to lock in maintenance agreements before winter. Annual heating plan pitch = very high conversion rate.',
      },
      {
        name: 'Grand Island Heating & Air',
        owner: '',
        location: 'Grand Island, NY',
        phone: '(716) 773-7616',
        website: 'https://www.grandisl​andheating.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'HVAC company in Grand Island (island community between Niagara Falls and Buffalo). Serving Niagara County and Buffalo suburbs. Western NY winters = extreme heating demand. No automated seasonal reminders or maintenance plan campaigns. Grand Island\'s suburban community = homeowners who value reliable, local HVAC service with strong automation pitch for annual plan enrollment.',
      },
      {
        name: 'Thompson Heating and Cooling',
        owner: '',
        location: 'Omaha, NE',
        phone: '(402) 800-4822',
        website: 'https://www.thompsonheatingandcooling.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Omaha HVAC company serving the greater metro. Nebraska has extreme weather — polar vortex winters and hot, humid summers — creating year-round HVAC demand. No automated seasonal maintenance reminders or post-service review collection. Omaha is underserved by HVAC digital automation. Being first to implement automated maintenance campaigns = significant market share capture.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Buffalo & Omaha',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Buffalo Dental Group',
        owner: '',
        location: 'Williamsville, NY',
        phone: '(716) 633-3600',
        website: 'https://www.buffalodental.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + implant + family dental practice in Williamsville (affluent Buffalo suburb, Erie County). Williamsville is one of WNY\'s most desirable communities. No automated new patient intake or smile consultation funnel. Buffalo\'s professional population — healthcare, law, finance — is the target demographic for cosmetic dentistry. Strong pitch for automated consultation follow-up.',
      },
      {
        name: 'Dental Associates of Western New York',
        owner: '',
        location: 'Buffalo, NY',
        phone: '(716) 837-7770',
        website: 'https://www.dawny.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-location dental group serving Western New York with multiple Buffalo-area offices. General + cosmetic + orthodontics. Multi-location model without location-specific automation. WNY has a large unserved cosmetic dental market — most practices in the region have basic websites with zero follow-up automation. First to automate = dominant position.',
      },
      {
        name: 'Vetter Dentistry',
        owner: 'Dr. Tim Vetter',
        location: 'Omaha, NE',
        phone: '(402) 330-4780',
        website: 'https://www.vetterdentistry.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Cosmetic + dental implant specialist in West Omaha. West Omaha is the city\'s most affluent corridor (Millard, Elkhorn, Gretna). No automated consultation booking or post-procedure follow-up. Omaha\'s financial and tech workforce (Berkshire Hathaway, TD Ameritrade, PayPal offices) = premium demographic for cosmetic dental investment. Strong automation pitch in an underserved market.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Buffalo, NY & Omaha, NE',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Orchard Park Chiropractic',
        owner: '',
        location: 'Orchard Park, NY',
        phone: '(716) 677-5108',
        website: 'https://www.orchardparkchiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice in Orchard Park (home of the Buffalo Bills — NFL team). Sports-adjacent community with active families and athletes. Bills fans and local athletes = sports injury chiro demand. No automated new patient intake or post-visit review collection. Sports community = pitch: automated sports injury intake form + athletic performance follow-up sequences.',
      },
      {
        name: 'Lancaster Chiropractic Center',
        owner: '',
        location: 'Lancaster, NY',
        phone: '(716) 681-1555',
        website: 'https://www.lancasterchiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic practice in Lancaster (Erie County suburb east of Buffalo). Serving the Eastern Buffalo suburbs. WNY\'s active sports culture (hockey, skiing, football) = consistent sports injury and musculoskeletal chiro demand. No automated appointment reminders or post-visit follow-up. Suburban Buffalo market with no digital automation = strong pitch for patient communication system.',
      },
      {
        name: 'Midwest Chiropractic Center — Omaha',
        owner: '',
        location: 'Omaha, NE',
        phone: '(402) 493-5544',
        website: 'https://www.midwestchiro.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established chiropractic practice in Omaha serving the metro area. Omaha has a large corporate workforce (finance, insurance, agriculture) with sedentary desk jobs = high chronic back and neck pain. No automated patient intake or post-visit review collection. Pitch: automated corporate wellness positioning — desk worker pain solutions + automated follow-up sequences targeting the office worker demographic.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Buffalo, NY & Omaha, NE Luxury',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Hunt Real Estate ERA — Buffalo',
        owner: '',
        location: 'Buffalo, NY',
        phone: '(716) 631-6000',
        website: 'https://www.huntrealestate.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Western New York\'s largest real estate company. Hunt ERA dominates the Buffalo market with the most agents and offices in the region. No automated buyer/seller CRM or lead nurture at the individual agent level. Buffalo\'s real estate market is surging as remote workers from NYC discover its affordability. Market leader = automation pitch = lift across their entire agent base.',
      },
      {
        name: 'Gurney Becker & Bourne Real Estate',
        owner: '',
        location: 'Buffalo, NY',
        phone: '(716) 884-9540',
        website: 'https://www.gurneybecker.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Buffalo real estate firm specializing in historic architecture and Buffalo\'s classic neighborhoods (Delaware Avenue, Elmwood Village, Allentown). Niche market = niche automation: automated buyer drip for historic home buyers, preservation-focused content. Buffalo\'s architectural heritage is attracting buyers from across the Northeast — automation captures and nurtures this growing audience.',
      },
      {
        name: 'Nebraska Realty — Omaha',
        owner: '',
        location: 'Omaha, NE',
        phone: '(402) 333-7777',
        website: 'https://www.nebraskarealty.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'One of Omaha\'s largest independent real estate companies. Omaha\'s real estate market is strong and growing — low cost of living + strong job market (Berkshire Hathaway, Union Pacific, Mutual of Omaha) attracts corporate relocations. No automated buyer/seller CRM sequences. Large agent network = automation at scale = significant GCI lift across the entire organization.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 20 — Adding more real US businesses to Notion…\n');
  let grandTotal = 0;

  for (const batch of BATCHES) {
    console.log(`${batch.label} (${batch.prospects.length})`);
    let added = 0;
    for (let i = 0; i < batch.prospects.length; i++) {
      const p = batch.prospects[i];
      try {
        await addProspect(batch.dbId, p, i + 1);
        process.stdout.write(`  ✓ ${p.name}\n`);
        added++;
      } catch (err) {
        console.error(`  ✗ ${p.name}: ${err.message}`);
      }
      await sleep(300);
    }
    console.log(`  → ${added}/${batch.prospects.length} added\n`);
    grandTotal += added;
    await sleep(400);
  }

  console.log(`\n✅ Batch 20 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
