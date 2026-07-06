/**
 * Nick Digital — Add More Prospects (Batch 8)
 * Run: NOTION_KEY=... node add-more-prospects-batch8.js
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
    label: '🔪 Plastic Surgery — Pittsburgh, PA',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Dr. Simona V. Pautler, MD',
        owner: 'Dr. Simona V. Pautler',
        location: 'McMurray, PA',
        phone: '(724) 969-0930',
        website: 'https://www.drpautler.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified female plastic surgeon near Pittsburgh. ABPS certified, ASPS member, Fellow of ACS. Solo boutique practice in affluent South Hills. No automated consultation booking or post-consult drip. Women-led practice in an underserved digital market — premium pitch with strong brand angle.',
      },
      {
        name: 'Pittsburgh Center for Plastic Surgery',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 802-6100',
        website: 'https://www.pittsburghplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Established cosmetic and plastic surgery center in Pittsburgh. Multi-surgeon practice. Good local reputation but no automated intake funnel or post-consult nurturing. Pittsburgh metro has a large affluent population (finance, healthcare, education sectors) — growing market for premium aesthetic procedures.',
      },
      {
        name: 'Bellissimo Plastic Surgery & Medi Spa',
        owner: 'Dr. Jeffrey Antimarino',
        location: 'Pittsburgh, PA',
        phone: '(412) 963-6677',
        website: 'https://bellissimoplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Pittsburgh plastic surgeon + attached MedSpa. Dual revenue streams (surgery + medspa) with no cross-sell automation between them. Perfect pitch: automated post-surgical patient journey that upsells medspa maintenance services — recurring revenue from each surgical patient.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Pittsburgh',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Goodrich & Geist, P.C.',
        owner: 'Bill Goodrich / Josh Geist',
        location: 'Pittsburgh, PA',
        phone: '(412) 837-8426',
        website: 'https://goodrichandgeist.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Pittsburgh PI firm founded by Bill Goodrich and Josh Geist. 50+ years combined experience. Strong reputation as "a different kind of law firm." No automated intake or post-settlement review collection. Small team = automated intake and communication is essential to stay competitive with bigger firms.',
      },
      {
        name: 'Pribanic & Pribanic',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 281-8844',
        website: 'https://pribanic.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Pittsburgh PI firm with 40+ years experience helping injury victims across Pennsylvania. Well-established brand but outdated digital presence. No automated client intake or 24/7 lead capture. Pittsburgh bridge closures, industrial accidents, and car crashes = constant PI case supply. Automated intake captures what their phone can\'t.',
      },
      {
        name: 'Kontos Mengine Killion & Hassen',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 709-6162',
        website: 'https://www.kontosmengine.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Pittsburgh PI firm with 80+ combined years fighting for injury victims. Team of experienced attorneys. No automated intake or review generation post-settlement. Multi-attorney team = high case volume that benefits massively from automated client communication and intake qualification.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Pittsburgh',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'DeLuca Roofing LLC',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 241-1643',
        website: 'https://www.delucaroofingllc.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Pittsburgh roofer since 1995. 30 years of local service in the Pittsburgh area. Basic website. Pittsburgh area has harsh winters with heavy snow and ice — ice dams + storm damage season creates surges in roofing demand. No automated storm damage intake or post-job review collection.',
      },
      {
        name: 'Cousins Roofing, Siding & Decks',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(724) 913-2665',
        website: 'https://www.callthecousins.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Pittsburgh roofing + siding + decking company. Multi-service model without cross-service automation. The roofing-to-deck upsell is one of the highest-ROI automation pitches for a home improvement contractor. Automated post-roof follow-up offering deck consultation = significant revenue lift.',
      },
      {
        name: 'Toth Roofing',
        owner: '',
        location: 'Oakmont, PA',
        phone: '(412) 826-1133',
        website: 'https://www.tothroofing.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Trusted family-owned roofing company serving Oakmont and greater Pittsburgh area. Residential + commercial. Basic website with no automated estimate requests or post-job review collection. Strong local reputation with no digital amplification. Google review automation alone would significantly differentiate them.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Columbus & Cincinnati, OH',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Five Star Heating & Cooling Group',
        owner: '',
        location: 'Columbus, OH',
        phone: '(614) 490-7550',
        website: 'https://www.fivestarheatingandcoolinggroup.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Local family-owned HVAC company in Columbus, OH. Residential + commercial HVAC services. Columbus is growing fast as Ohio\'s largest city. Good reviews but no automated seasonal maintenance campaigns or online booking. Columbus\'s hot humid summers + cold winters = year-round HVAC demand.',
      },
      {
        name: 'Columbus Worthington Air (CWA)',
        owner: '',
        location: 'Columbus, OH',
        phone: '(614) 405-7819',
        website: 'https://cwaohio.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Columbus HVAC company with 90+ years of service. Extraordinary longevity with minimal digital presence. No automated maintenance reminders or seasonal campaigns. 90 years of customer data with zero email/SMS marketing = an enormous re-engagement opportunity. Pitch: automated annual maintenance reminder campaigns to their full customer base.',
      },
      {
        name: 'Hauser Heating & Air Conditioning',
        owner: '',
        location: 'Cincinnati, OH',
        phone: '(513) 547-5777',
        website: 'https://www.hauserair.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cincinnati HVAC company since 1978. 45+ years serving the Greater Cincinnati area. Basic website. Cincinnati is a major metro with extreme seasonal weather (hot summers, cold winters). No automated maintenance plan upsells or seasonal tune-up campaigns. Large customer base = immediate revenue with automated re-engagement.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Pittsburgh & Cleveland',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Integrated Periodontics & Dental Implants',
        owner: 'Dr. James DiPerna / Dr. Amber Foronda / Dr. David Hay',
        location: 'Pittsburgh, PA',
        phone: '(412) 963-1911',
        website: 'https://www.integratedperioimplants.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Multi-doctor implant + periodontics specialty practice in Pittsburgh. High-ticket procedures (implants + periodontal surgery). No automated consultation follow-up or case acceptance drip. Implants average $3,000–$6,000+ per tooth — automated post-consult nurture sequence significantly improves case acceptance rate.',
      },
      {
        name: 'Uptown Dental Pittsburgh',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 344-4050',
        website: 'https://www.uptown.dental',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Cosmetic + implant dentistry in the Mt. Lebanon area of Pittsburgh. Veneers, porcelain crowns, dental implants. Basic website with no automated new patient intake or review collection. South Hills Pittsburgh is affluent = clients investing in premium cosmetic dental work. Pitch: automated smile consultation funnel.',
      },
      {
        name: 'Cleveland Periodontal Associates',
        owner: '',
        location: 'Lyndhurst, OH',
        phone: '(440) 461-3400',
        website: 'https://www.clevelandperio.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Periodontal implant specialty practice in the Cleveland metro. Dental implants + periodontal surgery. No automated post-consultation follow-up or case acceptance drip. Cleveland\'s east suburbs (Lyndhurst, Beachwood) are affluent — high-income patients willing to invest in implants and periodontal care just need the right follow-up.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Pittsburgh',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Pittsburgh Physical Medicine and Chiropractic',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 404-8337',
        website: 'https://www.pittsburghphysmed.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: '5-star chiro + physical therapy in East Liberty Pittsburgh. UPMC and Highmark in-network. Same-day appointments, no referral needed. No automated new patient intake or review collection. Strong quality + accessibility = just needs automation to scale patient acquisition and post-visit follow-up.',
      },
      {
        name: 'Pittsburgh Chiropractic & Massage Therapy Center',
        owner: 'Dr. Patrick Jones',
        location: 'Pittsburgh, PA',
        phone: '(412) 434-0790',
        website: 'https://www.pghchiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + massage therapy combined practice in downtown Pittsburgh. Multi-service model. No automated cross-sell between chiro and massage services. Downtown Pittsburgh = professional workforce with desk/sedentary pain issues. Pitch: automated wellness plan upsell — chiro patients automatically receive massage therapy recommendations.',
      },
      {
        name: 'The Pittsburgh Chiropractor',
        owner: 'Dr. Tauberg',
        location: 'Pittsburgh, PA',
        phone: '(724) 772-7246',
        website: 'https://www.thepittsburghchiropractor.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Dual-credentialed chiropractor (DC + RN) specializing in evidence-based spine care and sports medicine. Pittsburgh + Gibsonia locations. No automated patient communication or review collection. Unique dual-credential angle + multi-location model = strong pitch for location-specific automated funnels for each office.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Columbus, OH & Pittsburgh, PA',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Sorrell & Company',
        owner: '',
        location: 'Columbus, OH',
        phone: '(614) 488-0707',
        website: 'https://sorrellandco.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Family-owned independent boutique real estate brokerage in Columbus. Two locations (Columbus + Sugar Grove). Columbus is one of the fastest-growing US cities (Ohio State, large hospital systems, tech growth). No automated buyer/seller drip or lead nurturing. Growing city + boutique brand = strong automation pitch.',
      },
      {
        name: 'Piatt Sotheby\'s International Realty',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 471-4900',
        website: 'https://www.sothebysrealty.com/piatt/eng',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Only Sotheby\'s International Realty affiliate in Western Pennsylvania. Boutique luxury firm in Downtown Pittsburgh. Strong brand + global network but no automated buyer qualification or seller nurturing. Pittsburgh is a growing tech + healthcare hub — luxury market is expanding with new high-income residents who need premium digital touchpoints.',
      },
      {
        name: 'Berkshire Hathaway HomeServices The Preferred Realty',
        owner: '',
        location: 'Wexford, PA',
        phone: '(800) 860-7653',
        website: 'https://www.thepreferredrealty.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Pittsburgh area\'s Berkshire Hathaway affiliate with Luxury Collection division. Multi-location across SW Pennsylvania. No automated buyer/seller CRM sequences. Luxury Collection focus = high-ticket transactions where automated nurture converts hesitant buyers into closed deals. Scale of operation = massive automation ROI.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 8 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 8 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
