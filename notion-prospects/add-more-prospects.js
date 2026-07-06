/**
 * Nick Digital — Add More Prospects (Batch 1)
 * Adds newly researched real US businesses to the existing 7 niche databases.
 *
 * Run: NOTION_KEY=... node add-more-prospects.js
 */

const { Client } = require('@notionhq/client');

const NOTION_KEY = process.env.NOTION_KEY;
const notion = new Client({ auth: NOTION_KEY });

const rt = (text) => [{ type: 'text', text: { content: String(text || '') } }];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, label, retries = 4) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries) throw e;
      const wait = 1000 * Math.pow(2, i);
      console.log(`    ⚠ Error on "${label}", retry ${i + 1} in ${wait}ms… (${e.message})`);
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

  await withRetry(() => notion.pages.create({
    parent: { database_id: dbId },
    properties: props,
  }), `add: ${p.name}`);
}

// ─── Database IDs for each niche ─────────────────────────────────────────────
const DB = {
  plasticSurgery: '38d657af-efa9-81da-b04c-d4910b784937',
  personalInjury: '38d657af-efa9-81f3-92d6-d1a72328a513',
  roofing:        '38d657af-efa9-816e-9ba1-d06c5b7b7d70',
  hvac:           '38d657af-efa9-81f8-840f-f41b7774f06e',
  cosmeticDentist:'38d657af-efa9-8130-a9cc-f66d785d4fa0',
  chiroPT:        '38d657af-efa9-8163-aa10-ee5005b0f56c',
  realEstate:     '38d657af-efa9-8101-b4c4-f401f9a61122',
};

// ─── New prospects per niche ──────────────────────────────────────────────────

const BATCHES = [
  // ── 1. PLASTIC SURGERY ────────────────────────────────────────────────────
  {
    label: '🔪 Plastic Surgery & Cosmetic Clinics',
    dbId: DB.plasticSurgery,
    prospects: [
      {
        name: 'Valley Plastic Surgery',
        owner: 'Dr. Kyle Sanniec',
        location: 'Scottsdale, AZ',
        phone: '(602) 786-1144',
        website: 'https://valleyaesthetics.com',
        hasWebsite: 'Yes', wqs: 6, opp: 9,
        notes: 'Multi-location AZ practice (Scottsdale, Phoenix, Glendale, Mesa). Voted best aesthetic practice. Active Instagram. Lacks automated consultation funnel and post-visit review automation.',
      },
      {
        name: 'Tessler Plastic Surgery',
        owner: 'Dr. Oren Tessler',
        location: 'Scottsdale, AZ',
        phone: '(480) 561-6185',
        website: 'https://www.tesslerplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'ASPS member, boutique Scottsdale practice. Basic website, no chatbot or booking automation. Solo practice = high decision speed. Good full-suite pitch target.',
      },
      {
        name: 'Desert Plastic Surgery',
        owner: 'Dr. John Pierce',
        location: 'Scottsdale, AZ',
        phone: '(480) 990-8808',
        website: 'https://desertplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Boutique Scottsdale practice. Explant surgery specialty plus full cosmetic suite. No lead nurturing or intake automation. Affluent market = strong ROI story.',
      },
      {
        name: 'Sound Plastic Surgery',
        owner: 'Dr. Cooper & Dr. Sattler',
        location: 'Seattle, WA',
        phone: '(206) 729-2248',
        website: 'https://www.soundplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Top-rated Seattle plastic surgery duo. Combined thousands of cosmetic procedures. Website is clean but no automated consultation flow or after-hours lead capture.',
      },
      {
        name: 'DeLozier Cosmetic Surgery Center',
        owner: 'Dr. Joseph DeLozier III',
        location: 'Nashville, TN',
        phone: '(615) 565-9000',
        website: 'https://drdelozier.com',
        instagram: 'https://www.instagram.com/drjdelozier',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Established Nashville practice. Double board-certified. Active Instagram. Website needs redesign. No automated patient intake or review generation. Nashville market growing fast.',
      },
      {
        name: 'Broadway Plastic Surgery',
        owner: 'Dr. Broadway',
        location: 'Lone Tree (Denver), CO',
        phone: '(303) 680-8989',
        website: 'https://broadwayplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Denver metro area practice. 25+ years experience. Website is dated, no online booking or chatbot. Denver cosmetic market is growing — strong pitch window.',
      },
      {
        name: 'The Plastic Surgery Center of Nashville',
        owner: 'Dr. Mary Gingrass / Dr. Melinda Haws',
        location: 'Nashville, TN',
        phone: '(615) 354-5555',
        website: 'https://www.theplasticsurgerycenterofnashville.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Premier female-led practice in Nashville. Strong reputation, dual board-certified surgeons. No automated consultation request or drip follow-up. Full-suite automation pitch.',
      },
      {
        name: 'Nashville Cosmetic Surgery (Dr. Don Griffin)',
        owner: 'Dr. Don Griffin',
        location: 'Nashville, TN',
        phone: '(615) 206-2937',
        website: 'https://www.nashvillecosmeticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Double board-certified, 30+ years experience in Nashville. Very dated website. No automation whatsoever. Quick win: full redesign + intake chatbot + review automation.',
      },
      {
        name: 'Dr. J.J. Wendel Plastic Surgery',
        owner: 'Dr. J.J. Wendel',
        location: 'Nashville, TN',
        phone: '(615) 712-8899',
        website: 'https://www.drjjwendel.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Award-winning Nashville surgeon, 22+ years. Has decent digital presence but lacks automated after-consult drip and review collection. Premium market.',
      },
      {
        name: 'Richards Cosmetic Surgery',
        owner: 'Dr. Bryson G. Richards',
        location: 'Las Vegas, NV',
        phone: '(702) 228-6262',
        website: 'https://richardscosmeticsurgery.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Full-service Las Vegas plastic surgery practice. Also serves Bullhead City + Pahrump. Multi-location model with no automation. High-volume LV market = big lead generation opportunity.',
      },
      {
        name: 'Atelier Plastic Surgery',
        owner: 'Dr. Rohit Jaiswal',
        location: 'Las Vegas, NV',
        phone: '(702) 430-7754',
        website: 'https://drjvegas.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'TopDoctor-rated LV surgeon. Boutique concierge practice. Active online but no automated lead nurture. Luxury LV market = high avg case value. Premium website + CRM pitch.',
      },
      {
        name: 'The Oaks Plastic Surgery',
        owner: 'Dr. Danielle Andry / Dr. Nandi Wijay',
        location: 'Houston, TX',
        phone: '(281) 970-1700',
        website: 'https://theoaksplasticsurgery.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Group practice, multiple surgeons. Good website but no automated consultation follow-up. Houston cosmetic market is extremely competitive — automation is a differentiator.',
      },
      {
        name: 'Body by Ravi',
        owner: 'Dr. Ravi Somayazula',
        location: 'Houston, TX',
        phone: '(713) 794-0368',
        website: 'https://www.bodybyravi.com',
        instagram: 'https://www.instagram.com/bodybyravi',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Board-certified Houston surgeon with strong personal brand. Active Instagram. No post-consultation drip or booking automation. Personality-driven brand is a perfect fit for automation.',
      },
      {
        name: 'Houston Plastic Surgery (Dr. Balinger)',
        owner: 'Dr. Christopher Balinger',
        location: 'Houston, TX',
        phone: '(713) 552-0555',
        website: 'https://www.houstonplasticsurgerytx.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Boutique-level customized care, Houston. No online booking. Every client is fully custom — automation that qualifies leads before consult = big time saver for this model.',
      },
      {
        name: 'Aesthetic Center for Plastic Surgery (ACPS)',
        owner: '',
        location: 'Houston, TX',
        phone: '(713) 799-9999',
        website: 'https://www.mybeautifulbody.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'Voted best aesthetic practice in TX. Multi-surgeon group. Has a decent site but no chatbot or automated lead scoring. Their scale = automation ROI is massive.',
      },
      {
        name: 'Center for Dermatology & Plastic Surgery',
        owner: '',
        location: 'Scottsdale, AZ',
        phone: '(480) 948-8400',
        website: 'https://azcdps.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Dual specialty practice (derm + plastics), Scottsdale. 142 Google reviews. Strong reputation but no automated review generation or consultation booking funnel. Combined derm + plastics = large service catalog to automate.',
      },
    ],
  },

  // ── 2. PERSONAL INJURY ────────────────────────────────────────────────────
  {
    label: '⚖️ Personal Injury Law Firms',
    dbId: DB.personalInjury,
    prospects: [
      {
        name: 'Passen Powell Jenkins',
        owner: 'Scott Passen / Joel Powell',
        location: 'Chicago, IL',
        phone: '(312) 527-4500',
        website: 'https://www.passenpowell.com',
        hasWebsite: 'Yes', wqs: 6, opp: 9,
        notes: 'Boutique-by-design PI firm in Chicago. Takes limited cases for maximum attention. No automated intake or after-hours lead capture. Premium positioning = premium automation pitch.',
      },
      {
        name: 'Duncan Law Group',
        owner: '',
        location: 'Chicago, IL',
        phone: '(312) 202-3283',
        website: 'https://www.duncanlawgroup.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Boutique + extensive experience combo in Chicago. Has website but no chatbot, no after-hours form automation. Chicago PI market = high case values. Lead capture automation is critical.',
      },
      {
        name: 'Argionis & Associates',
        owner: 'George Argionis',
        location: 'Chicago, IL',
        phone: '(312) 800-4257',
        website: 'https://www.argionislaw.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Experienced Chicago PI team. Basic website, no lead nurturing. Injured victims often search at night — a 24/7 chatbot + SMS follow-up would dramatically increase conversions.',
      },
      {
        name: 'Karnas Law Firm',
        owner: '',
        location: 'Tucson / Phoenix, AZ',
        phone: '(602) 402-5207',
        website: 'https://karnaslaw.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Boutique civil litigation PI firm in AZ. Has offices in both Tucson and Phoenix. Multi-location, no automation between offices. Intake automation + CRM would help both locations.',
      },
      {
        name: 'Gage Mathers Law Group',
        owner: 'Gage Mathers',
        location: 'Phoenix, AZ',
        phone: '(602) 258-0646',
        website: 'https://gagemathers.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Top-rated Phoenix PI firm. Has good website and branding. Missing automated intake bot and lead scoring system. Award-winning team with strong social proof = prime target for automation upgrade.',
      },
      {
        name: 'KRLG Injury Lawyers (Kurtz Riley Law)',
        owner: 'Austin Kurtz / Brian Riley',
        location: 'Phoenix, AZ',
        phone: '(602) 707-1200',
        website: 'https://www.kurtzriley.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Self-described boutique PI firm, Phoenix. Trial attorneys committed to personalized service. Website is clean but no after-hours chatbot. Boutique model = fast decision maker for services.',
      },
      {
        name: 'Sargon Law Group',
        owner: '',
        location: 'Phoenix, AZ / Denver, CO',
        phone: '(623) 552-7300',
        website: 'https://www.sargonlawgroup.com',
        instagram: 'https://www.instagram.com/sargonlawgroup',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Multi-state PI firm: Phoenix, Chandler, Encino CA, Denver. Active Instagram. No multi-location CRM or automated intake. Multi-city practice = massive automation ROI potential.',
      },
      {
        name: 'Reyna Law Firm',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 765-3181',
        website: 'https://www.reynainjurylaw.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Boutique Austin PI firm, 20+ years, Board Certified trial law. Basic website. Austin is one of the fastest-growing US cities — new residents = new accident victims who search online. Lead automation pitch is strong.',
      },
      {
        name: 'Zinda Law Group',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 601-4349',
        website: 'https://www.zdfirm.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: '$400M+ recovered in TX. Hundreds of 5-star Google reviews. Growing Austin firm. Decent website but no automated intake qualification or after-hours lead capture flow.',
      },
      {
        name: 'The Patel Firm',
        owner: 'Minesh J. Patel',
        location: 'San Antonio, TX',
        phone: '(210) 325-9990',
        website: 'https://thepatelfirm.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Personal injury firm serving SA and Corpus Christi. 24/7 availability claim but no automated chat. Bilingual market opportunity (EN/ES) + automated intake bot = compelling pitch.',
      },
    ],
  },

  // ── 3. ROOFING ────────────────────────────────────────────────────────────
  {
    label: '🏠 Roofing Companies',
    dbId: DB.roofing,
    prospects: [
      {
        name: 'Horn Brothers Roofing',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 274-1111',
        website: 'https://hornbrothersroofing.com',
        instagram: 'https://www.instagram.com/hornbrothers',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Locally-owned CO roofer since 1994. A+ BBB rating. Active Instagram. Website is okay but no online estimate form automation or review drip. Hail season = peak lead demand in CO.',
      },
      {
        name: 'Roofcorp of Metro Denver',
        owner: '',
        location: 'Denver, CO',
        phone: '(303) 766-2444',
        website: 'https://roofcorpofmetrodenver.com',
        hasWebsite: 'Yes', wqs: 4, opp: 8,
        notes: 'Family-owned Denver roofer since 1996. Serves entire Denver metro + surrounding communities. Basic website. Free estimate follow-up automation + review sequence = strong ROI pitch.',
      },
      {
        name: 'MidSouth Construction',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 712-8893',
        website: 'https://roofingbymidsouth.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: '100% local Nashville roofer since 2010. GAF Master Elite Contractor (top 2% in US). Decent site but no automated estimate follow-up or lead nurturing. Strong brand to automate.',
      },
      {
        name: 'Bill Ragan Roofing',
        owner: 'Bill Ragan',
        location: 'Nashville, TN',
        phone: '(615) 242-0333',
        website: 'https://www.billraganroofing.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: '35+ years in Nashville. A+ BBB. Angie\'s List Super Service award. Has a solid website but no automation. High-trust brand = review automation + referral drip sequence would be transformative.',
      },
      {
        name: 'H.E. Parmer Company',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 250-2436',
        website: 'https://heparmer.com',
        hasWebsite: 'Yes', wqs: 4, opp: 8,
        notes: 'Oldest roofing company in Nashville. Legacy brand with very outdated digital presence. Full redesign + modern estimate automation is a perfect pitch for a storied local brand.',
      },
      {
        name: 'L&L Contractors',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 988-5065',
        website: 'https://landlcontractors.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Nashville roofing + siding + remodeling. Founded 2006. A+ BBB. Basic website. Diversified services = multiple automation entry points (roofing, siding, storm damage leads).',
      },
      {
        name: 'Quick Roofing',
        owner: '',
        location: 'Denver, CO / Austin, TX / DFW, TX',
        phone: '(303) 264-2832',
        website: 'https://www.quickroofing.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: '42+ years, 300K+ projects. Multi-location: Denver, Austin, DFW. Has a decent website but no location-specific landing pages or automated local SEO strategy per city. Multi-location automation pitch.',
      },
      {
        name: 'A.G. Roofing Company',
        owner: '',
        location: 'Vail Valley, CO',
        phone: '(970) 949-1890',
        website: 'https://www.agroofingcompany.com',
        hasWebsite: 'Yes', wqs: 4, opp: 9,
        notes: 'Local Vail Valley roofer, 25+ years. Serves ski resort affluent market. Basic website with no online estimate form. Luxury mountain market = high-ticket roofing jobs. Easy premium pitch.',
      },
    ],
  },

  // ── 4. HVAC ───────────────────────────────────────────────────────────────
  {
    label: '❄️ HVAC Contractors',
    dbId: DB.hvac,
    prospects: [
      {
        name: 'Semper Fi Heating & Cooling',
        owner: '',
        location: 'Mesa, AZ',
        phone: '(480) 616-3636',
        website: 'https://www.semperfiheatingcooling.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Veteran-owned, 5-star rated Mesa HVAC company. 534 Yelp reviews. Strong brand and reputation. Website is decent but no automated maintenance plan drip or review collection system.',
      },
      {
        name: 'Way Cool Plumbing & Air',
        owner: '',
        location: 'Phoenix, AZ',
        phone: '(623) 250-6492',
        website: 'https://www.callwaycool.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Family-owned Phoenix HVAC + plumbing since 1982. Classic "mom and pop" feel in a big market. Has a Trane-dealer site but weak web presence beyond that. Redesign + booking automation pitch.',
      },
      {
        name: 'Comfort Monster Heating & Air',
        owner: '',
        location: 'Raleigh, NC',
        phone: '(919) 666-7837',
        website: 'https://comfortmonster.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Self-described "mom-and-pop" HVAC experience in Raleigh. Has membership plans already. 110 Yelp reviews. No automated renewal reminder or maintenance drip. Membership model = automation ROI story.',
      },
      {
        name: 'Hoffmann Brothers HVAC',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 515-3015',
        website: 'https://www.hoffmannbros.com/nashville',
        hasWebsite: 'Yes', wqs: 6, opp: 7,
        notes: '40+ year company expanding into Nashville. Full HVAC + plumbing offering. Has good website but no personalized local marketing automation. New Nashville expansion = urgency to build local brand fast.',
      },
      {
        name: 'Carolina Comfort Air',
        owner: '',
        location: 'Clayton (Raleigh), NC',
        phone: '(919) 367-3818',
        website: 'https://www.carolinacomfortair.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Private NC HVAC contractor founded 2007. Serves Raleigh, Fayetteville, Wilmington, Jacksonville markets. Multi-city coverage. No automated city-specific landing pages or seasonal campaign automation.',
      },
    ],
  },

  // ── 5. COSMETIC DENTISTS ──────────────────────────────────────────────────
  {
    label: '🦷 Cosmetic Dentists & Implant Centers',
    dbId: DB.cosmeticDentist,
    prospects: [
      {
        name: 'Advanced Cosmetic & Implant Dentistry',
        owner: 'Dr. Dan McKay / Dr. Allen Liu',
        location: 'Seattle, WA',
        phone: '(206) 381-3055',
        website: 'https://www.acidentistry.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Two-doctor boutique practice in the heart of Seattle. Cosmetic, implants + orthodontics. Has a decent site but no automated consultation request or new patient intake form. Implant avg $5K+ per case.',
      },
      {
        name: 'Centerport Cosmetic & Implant Dentistry',
        owner: 'Dr. Benjamin Wang',
        location: 'Portland, OR',
        phone: '(503) 447-8036',
        website: 'https://www.centerportdental.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Portland implant + cosmetic specialist. High-tech digital dentistry workflow. Good website but no chatbot or automated new patient journey. Downtown Portland location = high foot traffic opportunity.',
      },
      {
        name: 'Central Valley Dentistry',
        owner: 'Dr. Babak Behbahani',
        location: 'Phoenix, AZ',
        phone: '(602) 562-0783',
        website: 'https://www.centralvalleydentistry.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Phoenix dental implant + cosmetic specialist. Same-day implants + veneers with in-house lab. No automated consultation funnel or follow-up. In-house lab = faster treatment = stronger automation closing argument.',
      },
      {
        name: 'Bionic Teeth (Adam Cottrill DMD)',
        owner: 'Dr. Adam Cottrill',
        location: 'Nashville, TN',
        phone: '(615) 297-5577',
        website: 'https://www.bionicteeth.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Nashville prosthodontist + implant specialist. Unique brand name ("Bionic Teeth") = strong personal brand ready for automation. No intake bot or review automation. Great pitch for brand-aligned marketing automation.',
      },
      {
        name: 'David Wickness DMD',
        owner: 'Dr. David Wickness',
        location: 'Nashville, TN',
        phone: '(615) 297-5090',
        website: 'https://davidwicknessdmd.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Nashville dental implant specialist. Leading cosmetic dentist. Basic website with no booking automation or patient journey flow. Implants avg $4K-$6K/arch — automated follow-up = significant revenue recovery.',
      },
      {
        name: 'East Nashville Aesthetic & Implant Dentistry',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 208-4447',
        website: 'https://eastnashvilledentistry.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Top-rated East Nashville dental practice. General + cosmetic + implants + emergency. Covers multiple services — multiple automation entry points. Good reviews but no automated follow-up system.',
      },
      {
        name: 'Cosmetic Dentistry of San Antonio',
        owner: 'Dr. Edward Camacho',
        location: 'San Antonio, TX',
        phone: '(210) 493-9944',
        website: 'https://cosmeticdentistryofsa.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Led by Dr. Camacho who designed the practice around patient comfort. Modern tech + warm environment. No automated intake. SA is fast-growing metro — automated new patient acquisition is critical.',
      },
      {
        name: 'Same Day Smiles Nashville',
        owner: '',
        location: 'Nashville, TN',
        phone: '(615) 852-3177',
        website: 'https://www.samedaysmilesnashville.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Implants, veneers, crowns with same-day service. Strong value proposition. Basic website — the "same day" angle needs better landing page + urgency-based lead funnel. Perfect for redesign + automated qualification chat.',
      },
    ],
  },

  // ── 6. CHIROPRACTORS & PHYSICAL THERAPY ──────────────────────────────────
  {
    label: '🦴 Chiropractors & Physical Therapy Clinics',
    dbId: DB.chiroPT,
    prospects: [
      {
        name: 'Active Lifestyle Clinic',
        owner: '',
        location: 'Phoenix, AZ',
        phone: '(480) 704-1050',
        website: 'https://activelifestyleclinic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Chiropractic + naturopathic care in Phoenix. Integrative approach. 46 Yelp reviews. Basic website. Multi-service model = multiple automation touchpoints: injury intake, wellness plans, review drip.',
      },
      {
        name: 'AFC Physical Medicine & Chiropractic Centers',
        owner: '',
        location: 'Phoenix, AZ',
        phone: '(480) 571-5679',
        website: 'https://www.afcchiropractic.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Multi-location Phoenix metro chiro + PT group (8+ locations: Phoenix, Gilbert, Mesa, Surprise, Peoria, Tempe, Desert Ridge). No multi-location booking automation. Scale = big automation ROI story.',
      },
      {
        name: 'Phoenix Chiropractic Injury Clinic',
        owner: '',
        location: 'Phoenix, AZ',
        phone: '(623) 742-9793',
        website: 'https://phoenixchiropracticinjuryclinic.com',
        hasWebsite: 'Yes', wqs: 4, opp: 9,
        notes: 'PI + auto accident injury focus. Chiro + Tolleson coverage. Basic website. Post-accident patients search frantically online — automated after-hours intake bot = massive lead recovery.',
      },
      {
        name: 'Comprehensive Chiropractic & Osteopathy',
        owner: 'Dr. Oliver',
        location: 'San Antonio, TX',
        phone: '(210) 545-1810',
        website: 'https://www.chiroandosteopathy.com',
        hasWebsite: 'Yes', wqs: 5, opp: 9,
        notes: 'Only combined chiro + physical therapist in SA metro. Unique dual-license positioning. Basic website. Rare specialty = strong case for a polished website that communicates the value of the dual-credential advantage.',
      },
      {
        name: 'HillTop Integrated Healthcare',
        owner: '',
        location: 'San Antonio, TX',
        phone: '(210) 475-3198',
        website: 'https://www.hilltopintegratedhealthcare.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'San Antonio chiropractic clinic known for post-accident recovery. Has good reviews but basic website. Auto accident patients are the highest-value chiro leads — automated intake form for "were you in an accident?" flow.',
      },
    ],
  },

  // ── 7. REAL ESTATE ────────────────────────────────────────────────────────
  {
    label: '🏡 Real Estate Teams & Boutique Brokerages',
    dbId: DB.realEstate,
    prospects: [
      {
        name: 'Avanti Way Realty',
        owner: '',
        location: 'Miami, FL',
        phone: '(305) 229-1146',
        website: 'https://avantiway.com',
        hasWebsite: 'Yes', wqs: 7, opp: 7,
        notes: 'One of FL\'s largest independent brokerages operating as boutique at scale. Multiple Miami locations. Has good digital presence but no automated buyer/seller drip per agent. Agent-level automation pitch at scale.',
      },
      {
        name: 'The Boutique Real Estate',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 481-0800',
        website: 'https://www.theboutiquerealestate.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Austin boutique specializing in downtown + central Austin residential. Top producer team. Good branding but no automated lead nurture or CRM drip campaigns. Austin is one of the hottest RE markets in the US.',
      },
      {
        name: 'MY Denver Real Estate',
        owner: 'Andrew Johnsen',
        location: 'Denver, CO',
        phone: '(303) 503-2116',
        website: 'https://mydenverrealestate.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Boutique Denver brokerage with personalized service focus. Decent reviews but minimal website. No CRM automation or buyer/seller drip. Denver RE market competitive — automation = key differentiator.',
      },
      {
        name: 'Colorado and Company Real Estate',
        owner: '',
        location: 'Denver, CO',
        phone: '(720) 227-4222',
        website: 'https://coloradoandcompany.com',
        hasWebsite: 'Yes', wqs: 6, opp: 8,
        notes: 'Full-service boutique office, Denver/Boulder/Front Range. Also handles rentals. 50 Yelp photos. No automated seller/buyer follow-up sequences. Multi-service (buy + rent + sell) = multiple automation flows to propose.',
      },
      {
        name: 'Austin Boutique Realty',
        owner: '',
        location: 'Austin, TX',
        phone: '(512) 771-6898',
        website: 'https://www.austinboutiquerealty.com',
        hasWebsite: 'Yes', wqs: 5, opp: 8,
        notes: 'Austin boutique focused on residential sales + leasing. Clean branding but minimal web presence. No IDX-integrated lead capture or automated buyer consultation funnel. Austin\'s fast market = automated urgency alerts for buyers would be a huge draw.',
      },
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Nick Digital — Adding new prospects to existing Notion databases…');
  console.log('══════════════════════════════════════════════════════════════════\n');

  let grandTotal = 0;

  for (const batch of BATCHES) {
    console.log(`\n${batch.label} (${batch.prospects.length} prospects)`);
    let added = 0;

    for (let i = 0; i < batch.prospects.length; i++) {
      const p = batch.prospects[i];
      try {
        await addProspect(batch.dbId, p, i + 1);
        process.stdout.write(`  ✓ [${i + 1}/${batch.prospects.length}] ${p.name}\n`);
        added++;
      } catch (err) {
        console.error(`  ✗ Failed to add "${p.name}": ${err.message}`);
      }
      await sleep(300);
    }

    console.log(`  → ${added}/${batch.prospects.length} added`);
    grandTotal += added;
    await sleep(500);
  }

  console.log(`\n\n✅ Done! ${grandTotal} new prospects added across ${BATCHES.length} niches.\n`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
