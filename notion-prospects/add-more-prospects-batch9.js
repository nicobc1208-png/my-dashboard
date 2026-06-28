/**
 * Nick Digital — Add More Prospects (Batch 9)
 * Run: NOTION_KEY=... node add-more-prospects-batch9.js
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
    label: '🔪 Plastic Surgery — Raleigh, NC',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Lyle Plastic Surgery & Aesthetic Center',
        owner: 'Dr. Glenn Lyle',
        location: 'Raleigh, NC',
        phone: '(919) 307-8585',
        website: 'https://drglennlyle.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Board-certified plastic surgeon Dr. Glenn Lyle, MD, FACS in Raleigh with an attached aesthetic center. Surgery + medspa under one roof. Good website but no automated cross-sell between plastic surgery and aesthetics. Raleigh is one of America\'s fastest-growing cities — booming population of young, high-income tech + biotech professionals.',
      },
      {
        name: 'Raleigh Plastic Surgery Center',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 872-2616',
        website: 'https://raleighplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Multi-surgeon board-certified plastic surgery center in Raleigh. Breast, body, and facial procedures. Affiliated with WakeMed and UNC Health. No automated consultation booking or post-consult follow-up sequence. Research Triangle\'s educated, affluent population = high demand for premium cosmetic procedures.',
      },
      {
        name: 'North Raleigh Plastic Surgery',
        owner: 'Dr. Juan A. Ortiz',
        location: 'Raleigh, NC',
        phone: '(919) 256-0500',
        website: 'https://www.northraleighplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Board-certified plastic surgeon Dr. Juan A. Ortiz serving Raleigh, Greensboro and surrounding NC cities. Solo boutique practice. Basic website with no automated intake or consultation follow-up. North Raleigh is one of the fastest-growing, most affluent suburban corridors in NC.',
      },
    ],
  },

  {
    label: '⚖️ Personal Injury — Raleigh / Durham',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Hyland, Padilla & Fowler, PLLC',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 891-8361',
        website: 'https://www.hpf-nclaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique Raleigh personal injury firm — North Carolina personal injury specialists. Strong local reputation. No automated intake or post-settlement review collection. Research Triangle has the highest traffic accident rate in NC — Raleigh\'s rapid growth means more new drivers + more accidents every year. Automated intake is critical.',
      },
      {
        name: 'Abrams & Abrams, P.A.',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 755-9166',
        website: 'https://www.abramslawfirm.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Raleigh personal injury law firm with established local reputation. Handles car accidents, medical malpractice, wrongful death. No automated 24/7 intake chatbot. Raleigh is one of the fastest-growing metro areas in the US — growing population = growing accident volume that needs an automated intake pipeline to capture.',
      },
      {
        name: 'Younce, Vtipil, Baznik & Banks, P.A.',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(877) 941-0886',
        website: 'https://www.attorneync.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Well-established Raleigh PI firm. Multi-attorney practice handling serious NC injury cases. No automated post-consultation follow-up or client communication sequences. Multi-attorney = high volume that benefits from automated lead qualification before it reaches the attorneys\' desks. Automated intake pitch.',
      },
    ],
  },

  {
    label: '🏠 Roofing — Raleigh, NC',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Tom Buzzard Co.',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 231-6088',
        website: 'https://www.tombuzzard.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Triangle area roofer for 30+ years. Strong reputation across the Raleigh-Durham corridor. Basic website with no automated estimate requests or review collection. 30 years of customer data with zero email/SMS marketing = huge re-engagement opportunity. NC hail + hurricane remnant storms drive seasonal spikes.',
      },
      {
        name: 'Honour Roofing',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 885-0245',
        website: 'https://honourroofing.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Female-led, family-owned roofing company in Raleigh. Strong brand story — women-owned, exceptional craftsmanship, trustworthy. No automated estimate funnel or review drip. The women-owned angle is a powerful differentiator in roofing — automated marketing that leads with that story would capture a distinct market segment.',
      },
      {
        name: 'Modern Roofing',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(984) 370-5424',
        website: 'https://modernroofingusa.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-run Raleigh roofing company focused on quality craftsmanship and honest service. Growing business. No automated estimate requests or post-job follow-up. Raleigh is one of the fastest-growing metros in the US — new construction + storm damage season = year-round roofing demand. Automated storm damage intake pitch.',
      },
    ],
  },

  {
    label: '❄️ HVAC — Raleigh / Research Triangle',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'SantaAir Heating and Air',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 522-3567',
        website: 'https://www.santaair.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Independent family-owned Raleigh HVAC company since 2013. Consistently ranked among the most trusted in Raleigh-Durham. Good reputation but no automated seasonal maintenance campaigns or online booking. Raleigh summers are hot and humid — AC is essential, and automated seasonal tune-up campaigns fill the calendar year-round.',
      },
      {
        name: 'Boer Brothers Heating & Cooling',
        owner: '',
        location: 'Chapel Hill, NC',
        phone: '(919) 813-2556',
        website: 'https://boerbrothershvac.com',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: 'Family-owned Triangle HVAC, named best in the Triangle multiple times by The Independent. Serves Chapel Hill, Cary, Carrboro, Durham, and surrounding areas. Multi-city coverage without location-specific automation. Strong reviews = easy pitch: automated Google review requests post-service to maintain their top ranking.',
      },
      {
        name: 'Allen Kelly & Company',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 779-5419',
        website: 'https://allenkelly.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Raleigh HVAC experts with decades of service in the Triangle area. Residential + light commercial HVAC. Basic website. Research Triangle\'s rapid population growth = massive new customer acquisition opportunity. No automated new resident outreach or seasonal maintenance campaigns. Strong growth market pitch.',
      },
    ],
  },

  {
    label: '🦷 Cosmetic Dentists — Raleigh / Durham',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Chapman Dentistry',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 782-7333',
        website: 'https://www.raleighncdental.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Full-range implant + cosmetic + general dental care in Raleigh. Good reputation, established practice. No automated new patient intake or consultation follow-up. Raleigh is the fastest-growing major city in NC — constant stream of new residents looking for a dental home. Automated new patient welcome campaigns are essential in this market.',
      },
      {
        name: 'Falls Pointe Dentistry',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 322-3589',
        website: 'https://www.fallspointedentistry.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'North Raleigh implant + cosmetic dentistry practice. High-income North Raleigh area clientele. No automated consultation follow-up or review collection post-treatment. North Raleigh is home to many of the highest-earning tech + pharmaceutical professionals in NC — premium patients who expect premium communication.',
      },
      {
        name: 'Raleigh Prosthodontics',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 510-4959',
        website: 'https://raleighprosthodontics.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Prosthodontic specialty practice in Raleigh — dentures, veneers, implants, crowns. Specialty focus = higher-ticket procedures with longer patient decision cycles. No automated post-consultation follow-up. Long decision cycle = automated drip sequence keeps this practice top-of-mind while the patient decides, dramatically improving case acceptance.',
      },
    ],
  },

  {
    label: '🦴 Chiro/PT — Raleigh / Durham',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Carolina Pain and Performance',
        owner: '',
        location: 'Durham, NC',
        phone: '(919) 237-3008',
        website: 'https://carolinapainandperformance.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + pain management + performance clinic in Durham. Research Triangle has a massive athletic and active professional population (university sports, running clubs, cyclists). No automated patient intake or injury recovery follow-up. Pitch: automated injury-specific intake forms that route patients to the right care path.',
      },
      {
        name: 'Holistic Vitality Center',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 848-3333',
        website: 'https://www.holisticvitalitycenter.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-discipline Raleigh clinic: chiropractic + acupuncture + nutrition + muscle rehab + massage therapy. Multi-service model with no cross-service automation. Every service is a potential upsell for another. Automated cross-sell sequences between services + post-visit review collection would dramatically increase revenue per patient.',
      },
      {
        name: 'Broad Street Chiropractic',
        owner: 'Dr. Edward Washington Jr.',
        location: 'Durham, NC',
        phone: '(919) 286-9430',
        website: 'https://www.holistichelpinghands.com',
        hasWebsite: 'Yes', wqs: 4, opp: 9,
        notes: 'Black-owned Durham chiropractor in business since 1982. Dr. Edward Washington Jr. has served the Raleigh-Durham-Chapel Hill triangle for 40+ years. Basic website with zero digital automation. 40-year patient database with no email or SMS outreach. Enormous re-engagement opportunity — automated re-activation campaign to past patients alone would generate significant revenue.',
      },
    ],
  },

  {
    label: '🏡 Real Estate — Raleigh / Triangle',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Bespoke Realty Group',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 283-1122',
        website: 'https://bespokerealtygroup.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique luxury real estate team in the Triangle region. Experienced agents helping buyers + sellers at premium price points. No automated buyer/seller drip or CRM sequences. Research Triangle is one of the hottest real estate markets in the US — boutique firm + automation = competitive advantage against national franchises.',
      },
      {
        name: 'Linda Craft Team',
        owner: 'Linda Craft',
        location: 'Raleigh, NC',
        phone: '(919) 235-6308',
        website: 'https://www.lindacraft.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'One of the Triangle\'s top luxury real estate teams with 20+ years of experience. Large team, high volume. Good website but no automated buyer qualification or seller lead nurturing at scale. At this team\'s production level, automating even 10% of follow-up = significant revenue lift. Premium team = premium pitch for comprehensive CRM automation.',
      },
      {
        name: 'Hodge & Kittrell Sotheby\'s International Realty',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 832-3019',
        website: 'https://hodgekittrellsir.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Raleigh\'s Sotheby\'s International Realty affiliate — boutique luxury brokerage in one of NC\'s fastest-growing metro areas. Strong brand + global network but no automated buyer/seller CRM. Research Triangle luxury market is booming with tech executives and biotech investors. Automation pitch: white-glove digital experience to match the Sotheby\'s premium brand.',
      },
    ],
  },
];

async function main() {
  console.log('\n🚀 Batch 9 — Adding more real US businesses to Notion…\n');
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

  console.log(`\n✅ Batch 9 complete! ${grandTotal} new prospects added.\n`);
}

main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
