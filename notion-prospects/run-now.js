/**
 * Nick Digital — Notion Prospect Pages (Live Runner)
 * Creates 7 niche pages under the BUSINESSES parent, each with a database
 * matching the exact Medspa Prospects schema.
 *
 * Run: NOTION_KEY=... PARENT_PAGE_ID=... node run-now.js
 */

const { Client } = require('@notionhq/client');

const NOTION_KEY = process.env.NOTION_KEY;
const PARENT_PAGE_ID = process.env.PARENT_PAGE_ID;

const notion = new Client({ auth: NOTION_KEY });

// ─── Helpers ─────────────────────────────────────────────────────────────────

const rt = (text) => [{ type: 'text', text: { content: String(text || '') } }];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, label, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries) throw e;
      const wait = 1000 * (i + 1);
      console.log(`    ⚠ Rate limit / error on "${label}", retrying in ${wait}ms…`);
      await sleep(wait);
    }
  }
}

// ─── Database schema (mirrors Medspa Prospects exactly) ──────────────────────

function buildProperties() {
  return {
    'Business Name': { title: {} },
    'Owner Name':    { rich_text: {} },
    'Location':      { rich_text: {} },
    'Phone':         { rich_text: {} },
    'Email':         { email: {} },
    'Website':       { url: {} },
    'Facebook':      { url: {} },
    'Instagram':     { url: {} },
    'Google Maps Link': { url: {} },
    'Has Website':   { select: { options: [{ name: 'Yes', color: 'green' }, { name: 'No', color: 'red' }] } },
    'Website Quality Score': { number: { format: 'number' } },
    'Rating':        { number: { format: 'number' } },
    'Reviews':       { number: { format: 'number' } },
    'Opportunity Score': { number: { format: 'number' } },
    'Status': {
      select: {
        options: [
          { name: 'New',           color: 'blue'   },
          { name: 'Contacted',     color: 'yellow' },
          { name: 'Replied',       color: 'orange' },
          { name: 'Call Booked',   color: 'purple' },
          { name: 'Won',           color: 'green'  },
          { name: 'Not Interested',color: 'gray'   },
        ],
      },
    },
    'Outreach Channel': {
      select: {
        options: [
          { name: 'Email',        color: 'blue'   },
          { name: 'Instagram DM', color: 'pink'   },
          { name: 'SMS',          color: 'green'  },
          { name: 'Called',       color: 'orange' },
        ],
      },
    },
    'Replied?': {
      select: {
        options: [
          { name: 'Yes',           color: 'green' },
          { name: 'No',            color: 'red'   },
          { name: 'Not Interested',color: 'gray'  },
        ],
      },
    },
    'Booked Call?': {
      select: {
        options: [
          { name: 'Yes', color: 'green' },
          { name: 'No',  color: 'red'   },
        ],
      },
    },
    'Closed?': {
      select: {
        options: [
          { name: 'Yes - Won', color: 'green' },
          { name: 'No',        color: 'gray'  },
          { name: 'Lost',      color: 'red'   },
        ],
      },
    },
    'Follow-up #1': { date: {} },
    'Follow-up #2': { date: {} },
    'Notes': { rich_text: {} },
    '#':     { number: { format: 'number' } },
  };
}

// ─── Prospect data ────────────────────────────────────────────────────────────

const NICHES = [
  // ── 1. Plastic Surgery ────────────────────────────────────────────────────
  {
    icon: '🔪',
    name: 'Plastic Surgery & Cosmetic Clinics',
    prospects: [
      {
        name: 'Houston Cosmetic Surgery Center',
        owner: 'Dr. David D. Davila',
        location: 'Houston, TX',
        phone: '(281) 970-1111',
        website: 'https://www.cosmeticsurgerytx.com',
        instagram: 'https://www.instagram.com/houstoncosmeticsurgerycenter',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 9,
        notes: 'Independent practice, 2 TX locations. Website is functional but no booking automation or consultation funnel. High-ticket rhinoplasty + breast aug market.',
      },
      {
        name: 'Face Forward Houston',
        owner: 'Dr. Regina Rodman',
        location: 'Houston, TX',
        phone: '(713) 783-4040',
        website: 'https://www.faceforwardhouston.com',
        instagram: 'https://www.instagram.com/faceforwardhouston',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'Dual-board certified facial specialist. Solid social presence but no automated follow-up or after-hours chatbot. Facial procedures + hair restoration.',
      },
      {
        name: 'Sage Plastic Surgery',
        owner: 'Dr. Fred Duffy',
        location: 'Dallas, TX',
        phone: '(214) 528-8800',
        website: 'https://sageplasticsurgery.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: '30+ years in Dallas private practice. Website is dated, no online booking, no chatbot. Strong candidate for full redesign + automation suite.',
      },
      {
        name: 'Perimeter Plastic Surgery',
        owner: 'Dr. Mark F. Deutsch',
        location: 'Atlanta, GA',
        phone: '(770) 457-6840',
        website: 'https://www.perimeterplasticsurgery.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: '2025 Top Doctor by Castle Connolly. Solo practice with 2 GA locations. Great reputation — no automation, no review generation system.',
      },
      {
        name: 'Southern Plastic Surgery',
        owner: 'Dr. David Whiteman',
        location: 'Atlanta, GA',
        phone: '(770) 457-4677',
        website: 'https://www.southernplasticsurgery.com',
        instagram: 'https://www.instagram.com/southernplasticsurgery',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'One of SE\'s most respected practices. Decent website but no patient intake automation. Full-suite pitch.',
      },
      {
        name: 'Artisan Plastic Surgery',
        owner: 'Dr. Diane Alexander / Dr. Bernadette Wang Ashraf',
        location: 'Atlanta, GA',
        phone: '(404) 355-3566',
        website: 'https://artisanplasticsurgery.com',
        instagram: 'https://www.instagram.com/artisanplasticsurgery',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 9,
        notes: 'Female-led practice — strong Instagram. No consultation request automation. Perfect candidate for funnel + before/after automation.',
      },
      {
        name: 'Silk Plastic Surgery',
        owner: '',
        location: 'Sandy Springs, GA',
        phone: '(770) 457-6840',
        website: 'https://silkplasticsurgery.com',
        instagram: 'https://www.instagram.com/silkplasticsurgery',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'Double board-certified surgeons, concierge care model. Active IG. Needs booking automation + CRM follow-up.',
      },
      {
        name: 'Charlotte Plastic Surgery',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 372-6846',
        website: 'https://www.charlotteplasticsurgery.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Multi-surgeon Charlotte practice. Good candidate for full website redesign + patient journey automation.',
      },
      {
        name: 'Southeastern Plastic Surgery, PA',
        owner: '',
        location: 'Tallahassee, FL',
        phone: '(850) 219-2000',
        website: 'https://www.se-plasticsurgery.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: 'Serves FL/GA/AL — multi-state reach. Very dated website. Massive opportunity for redesign + multi-location automation.',
      },
      {
        name: 'Plastic Surgery Group of Atlanta',
        owner: 'Dr. John Connors',
        location: 'Atlanta, GA',
        phone: '(404) 255-0666',
        website: 'https://www.plasticsurgerygroupatl.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Established Atlanta group practice. Board-certified. Website works but has no automation or lead nurturing. Good upsell target.',
      },
    ],
  },

  // ── 2. Personal Injury Law Firms ──────────────────────────────────────────
  {
    icon: '⚖️',
    name: 'Personal Injury Law Firms',
    prospects: [
      {
        name: 'Simmons and Fletcher, P.C.',
        owner: 'Paul Cannon / Sharon Simmons-Cantrell',
        location: 'Houston, TX',
        phone: '(713) 932-0777',
        website: 'https://www.simmonsandfletcher.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 9,
        notes: 'Founded 1979. 3-attorney boutique with over 40 yrs in Houston PI market. No 24/7 chatbot, no automated intake. Huge missed lead opportunity.',
      },
      {
        name: 'Kemp Law Group',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 725-6000',
        website: 'https://www.kemplaw.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'FL + GA licensed. Good reputation, limited digital automation. Needs intake chatbot + SMS follow-up for after-hours leads.',
      },
      {
        name: 'Farah & Farah',
        owner: '',
        location: 'Jacksonville, FL',
        phone: '(904) 222-1111',
        website: 'https://farahandfarah.com',
        instagram: 'https://www.instagram.com/farahandfarah',
        hasWebsite: 'Yes',
        wqs: 7,
        opp: 7,
        notes: 'One of FL\'s largest PI firms. Has website but individual regional office sub-sites are weak. Regional office targeting is the play.',
      },
      {
        name: 'GOLDLAW',
        owner: '',
        location: 'West Palm Beach, FL',
        phone: '(561) 222-2222',
        website: 'https://goldlaw.com',
        instagram: 'https://www.instagram.com/goldlawflorida',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'Recovered $1B+ for clients. Good site, strong brand. No automated lead scoring or intake bot. Premium automation pitch.',
      },
      {
        name: 'The Injury Firm',
        owner: '',
        location: 'Fort Lauderdale, FL',
        phone: '(754) 213-8000',
        website: 'https://www.flinjuryfirm.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 9,
        notes: '2-partner, 7-associate boutique. Licensed in FL, GA, TX and more. No automation at all. Strong candidate for full intake + drip automation.',
      },
      {
        name: 'Mani Ellis & Layne, LLC',
        owner: '',
        location: 'Columbus, OH',
        phone: '(614) 924-8060',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 10,
        notes: 'AV Preeminent rated firm. No strong website found. Cold outreach with website demo could be a fast close.',
      },
      {
        name: 'Andy Citrin Injury Attorneys',
        owner: 'Andy Citrin',
        location: 'Mobile, AL',
        phone: '(251) 888-8888',
        website: '',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Recovered $650M+ for AL/MS clients. 5 offices. Dated multi-location site, no automation. Multi-location website + automation pitch.',
      },
      {
        name: 'Omar Ochoa Law Firm',
        owner: 'Omar Ochoa',
        location: 'McAllen, TX',
        phone: '(956) 867-9225',
        website: '',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: 'Recovered $1B+ in TX. 2025 Super Lawyers recognition. Bilingual market (English/Spanish) = huge automation opportunity with bilingual chatbot.',
      },
      {
        name: 'Clifford Law Offices',
        owner: '',
        location: 'Chicago, IL',
        phone: '(312) 899-9090',
        website: 'https://www.cliffordlaw.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 7,
        notes: 'Established Chicago firm. Decent website, no intake automation. Chicago market is huge — drip + chatbot automation play.',
      },
      {
        name: 'The Dominguez Firm',
        owner: '',
        location: 'Los Angeles, CA',
        phone: '(800) 818-1818',
        website: 'https://dominguezfirm.com',
        instagram: 'https://www.instagram.com/dominguezfirm',
        hasWebsite: 'Yes',
        wqs: 7,
        opp: 7,
        notes: '96% success rate. LA market. Good site but 24/7 chatbot is missing — they advertise 24/7 but no automated chat. Clear gap to pitch.',
      },
    ],
  },

  // ── 3. Roofing Companies ─────────────────────────────────────────────────
  {
    icon: '🏠',
    name: 'Roofing Companies',
    prospects: [
      {
        name: 'Battalion Roofing Houston',
        owner: '',
        location: 'Houston, TX',
        phone: '(832) 244-6132',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 10,
        notes: '52 Yelp reviews. Very active in Houston market. No proper website found — easy cold pitch with a website demo.',
      },
      {
        name: 'Houston Roofing & Construction',
        owner: '',
        location: 'Houston, TX',
        phone: '(832) 237-3737',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 10,
        notes: '20 Yelp reviews. Doing business without a real website. Website + lead capture + review automation = huge ROI pitch.',
      },
      {
        name: 'Tadlock Roofing',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 373-9088',
        website: 'https://www.tadlockroofing.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Top-rated Tampa roofer. Has a site but no online estimate request automation. Storm season = peak demand period, seasonal campaign pitch.',
      },
      {
        name: 'Westfall Roofing',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 879-3512',
        website: 'https://www.westfallroofing.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Established Tampa roofer, residential + commercial. Basic website. Automated estimate follow-up + review sequence would be a quick win.',
      },
      {
        name: 'Steadfast Roofing',
        owner: '',
        location: 'Clearwater, FL',
        phone: '(727) 726-4999',
        website: 'https://www.steadfastroofing.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: 'Tampa Bay area residential specialist. Dated website, no lead capture form automation. FL hurricane market = high urgency leads.',
      },
      {
        name: 'Bumble Roofing Charlotte',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 396-8828',
        website: 'https://www.bumbleroofing.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Fast-growing Charlotte roofer. Young company, basic website. Full redesign + automated estimate-to-close pipeline pitch.',
      },
      {
        name: 'SouthPark Roofing',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 540-7663',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 10,
        notes: 'Operates in affluent Charlotte suburb (SouthPark). No website found. Easy premium website pitch — homeowners in this zip code expect a pro site.',
      },
      {
        name: 'Kuykendall Roofing',
        owner: '',
        location: 'Port Charlotte, FL',
        phone: '(941) 766-3039',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 9,
        notes: 'Charlotte County, FL roofing company. No online presence found. Post-hurricane Ian area = massive replacement demand. Easy cold pitch.',
      },
      {
        name: 'Roman Roofing',
        owner: '',
        location: 'Naples, FL',
        phone: '(239) 597-9500',
        website: 'https://www.romanroofing.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Naples area roofer, affluent market. Website is basic. No chatbot, no automated follow-up. High-ticket market — premium website pitch.',
      },
      {
        name: 'Compass Roofing Services',
        owner: '',
        location: 'Tampa, FL',
        phone: '(813) 863-2239',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 9,
        notes: 'Top Yelp roofing company Tampa Bay area. No proper website. Outreach with a sample site demo = likely fast close.',
      },
    ],
  },

  // ── 4. HVAC Contractors ───────────────────────────────────────────────────
  {
    icon: '❄️',
    name: 'HVAC Contractors',
    prospects: [
      {
        name: 'Advanced Air Care Heating and Cooling',
        owner: '',
        location: 'Tallahassee, FL',
        phone: '(850) 894-0033',
        website: 'https://www.advancedaircarefl.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: 'Residential + commercial HVAC in Tallahassee market. Website is dated and slow. No scheduling automation. Easy redesign + booking automation pitch.',
      },
      {
        name: 'Air Docs Heating & Cooling',
        owner: '',
        location: 'Vero Beach, FL',
        phone: '(772) 569-1010',
        website: 'https://www.airdocsac.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Trusted Vero Beach HVAC contractor. Decent reviews. Basic website, no lead capture or maintenance reminder automation.',
      },
      {
        name: 'Conditioned Air Company, LLC',
        owner: '',
        location: 'Naples, FL',
        phone: '(239) 574-8150',
        website: 'https://www.conditionedair.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 7,
        notes: 'In business since 1962, SW Florida. Decent site. Age of business = good for maintenance plan automation — annual reminders, seasonal tune-up campaigns.',
      },
      {
        name: '1st Class Heat & Air',
        owner: '',
        location: 'Plano, TX',
        phone: '(972) 633-0030',
        website: 'https://www.1stclassac.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: 'Family-owned, serving Dallas metro. Very basic website. TX summer heat drives massive AC demand — automated emergency service landing page pitch.',
      },
      {
        name: 'Airforce Heating and Air',
        owner: '',
        location: 'Atlanta, GA',
        phone: '(770) 532-9130',
        website: 'https://www.airforcehvac.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: 'Serving GA/AL since 2000. Strong local reputation but very outdated digital presence. Full redesign + maintenance email automation campaign.',
      },
      {
        name: 'Air Systems USA LLC',
        owner: '',
        location: 'Apopka, FL',
        phone: '(407) 880-1400',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 10,
        notes: 'Orlando-area HVAC provider. No proper website found. FL heat = urgent demand. Build a site with online booking + 24/7 lead form as the core pitch.',
      },
      {
        name: 'A Superior Air Conditioning Company',
        owner: '',
        location: 'Panama City Beach, FL',
        phone: '(850) 784-9999',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 10,
        notes: 'Self-described #1 local HVAC in Panama City Beach. No website found. Tourist/seasonal market = online visibility is critical. Easy pitch.',
      },
      {
        name: 'Dallas Plumbing Company (HVAC Division)',
        owner: '',
        location: 'Dallas, TX',
        phone: '(214) 388-6810',
        website: 'https://www.dallasplumbingcompany.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 7,
        notes: 'In business since 1903. Residential + commercial. Offers HVAC alongside plumbing. Old brand that needs modern website + automated scheduling.',
      },
      {
        name: 'Advanced Home Comfort',
        owner: '',
        location: 'Dallas, TX',
        phone: '(972) 388-4822',
        website: 'https://www.advancedhomecomfort.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Residential HVAC, Dallas + surrounding areas. Generic template website. Maintenance plan automation + seasonal reminder sequence is a strong pitch.',
      },
      {
        name: 'Advanced Cooling TX',
        owner: '',
        location: 'Houston, TX',
        phone: '(281) 351-0900',
        website: 'https://www.advancedcoolingtx.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Serving Houston + Oklahoma since 2001. Friendly brand but minimal online marketing. Website redesign + Google review automation is the play.',
      },
    ],
  },

  // ── 5. Cosmetic Dentists & Implant Centers ────────────────────────────────
  {
    icon: '🦷',
    name: 'Cosmetic Dentists & Implant Centers',
    prospects: [
      {
        name: 'Miami Center for Cosmetic and Implant Dentistry',
        owner: 'Dr. Ryan Ziegler',
        location: 'Miami, FL',
        phone: '(305) 306-9250',
        website: 'https://www.miamicosmeticdentalcare.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 9,
        notes: 'Miami cosmetic dental artist, full implant services. Decent site but no online booking or consultation funnel. Implant avg $4K-$6K per patient.',
      },
      {
        name: 'Cosmetic and Implant Dentistry of Connecticut',
        owner: 'Dr. Aaron Gross',
        location: 'Hamden, CT',
        phone: '(203) 288-4400',
        website: 'https://www.cidct.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Multi-location CT practice (Hamden, East Haven, Branford). Crowns-in-a-day + implants. No chatbot, no automated consultation follow-up.',
      },
      {
        name: 'Independence Family & Cosmetic Dentistry',
        owner: 'Dr. Roberson',
        location: 'Independence, MO',
        phone: '(816) 350-0808',
        website: 'https://independencefamilycosmeticdentistry.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: '35+ years in practice. Good reputation, very dated website. No digital booking. Full redesign + no-show automation pitch. Quick win.',
      },
      {
        name: 'Innovative Dental',
        owner: '',
        location: 'Springfield, MO',
        phone: '(417) 889-4746',
        website: 'https://www.idspringfield.com',
        instagram: 'https://www.instagram.com/innovativedental',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'Life-changing implants + cosmetic enhancements. Active Instagram. Website is decent but consultation funnel is weak. Full implant practice = high avg case value.',
      },
      {
        name: 'Independence Dental Group',
        owner: 'Dr. Steven Gelbart',
        location: 'Philadelphia, PA',
        phone: '(215) 676-6767',
        website: 'https://idgpa.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 7,
        notes: 'Cosmetic + general dentistry, Philadelphia. Uses cutting-edge tech. No patient journey automation. Review automation + virtual consult funnel pitch.',
      },
      {
        name: 'Bright Smile Design Dental',
        owner: '',
        location: 'Los Angeles, CA',
        phone: '(310) 275-6113',
        website: 'https://www.brightsmiledesign.com',
        instagram: 'https://www.instagram.com/brightsmiledesigndental',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'Digital dentistry leader in Beverly Hills area. Active IG. No automated intake or no-show reduction system. High-ticket cosmetic market.',
      },
      {
        name: 'Dentist Tree Heights (Houston Implant Specialists)',
        owner: '',
        location: 'Houston, TX',
        phone: '(713) 864-3463',
        website: 'https://dentisttreeheights.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 9,
        notes: 'Houston implant specialist. Lists competitor clinics on their site (interesting insight into market). Outdated site, no automation. Strong pitch target.',
      },
      {
        name: 'Smile Partners USA',
        owner: '',
        location: 'Multiple Locations, US',
        phone: '',
        website: 'https://smilepartnersusa.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 7,
        notes: 'Multi-location cosmetic + implant group. Spanish-language capability needed. Full-mouth implants avg $25K per case. Automation at scale pitch.',
      },
      {
        name: 'CDICD Dental (Orange County)',
        owner: '',
        location: 'Huntington Beach, CA',
        phone: '(714) 846-1757',
        website: 'https://www.cdicdental.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Serves Huntington Beach, Placentia, Cypress, Brea. Multi-location OC practice. Basic site, no lead nurturing or booking automation.',
      },
      {
        name: 'Beyond Dental Care Plano',
        owner: '',
        location: 'Plano, TX',
        phone: '(972) 378-4141',
        website: 'https://beyonddentalcare.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Cosmetic + implants, Plano TX. Covers dental evolution trends. Decent site but no patient intake automation or review management system.',
      },
    ],
  },

  // ── 6. Chiropractors & Physical Therapy ───────────────────────────────────
  {
    icon: '🦴',
    name: 'Chiropractors & Physical Therapy Clinics',
    prospects: [
      {
        name: 'Peak Potential Chiropractic and Physical Therapy',
        owner: '',
        location: 'Severna Park, MD',
        phone: '(410) 421-5544',
        website: 'https://www.peakpotentialchiropt.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Small private practice self-described. Basic website, no booking automation. No-show automation + review management would be transformative.',
      },
      {
        name: 'Pittsburgh Physical Medicine',
        owner: '',
        location: 'Pittsburgh, PA',
        phone: '(412) 661-2550',
        website: 'https://www.pittsburghphysmed.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Chiropractic + physical therapy, Pittsburgh. Dated website. PT clinics lose $15K/mo to no-shows on avg — automated reminder pitch is a fast ROI story.',
      },
      {
        name: 'Physical Therapy & Chiropractic of Miami Beach',
        owner: '',
        location: 'Miami Beach, FL',
        phone: '(305) 673-8248',
        website: 'https://ptcmiami.com',
        instagram: 'https://www.instagram.com/ptcmiami',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 9,
        notes: 'Boutique-style clinic, Miami Beach + Wynwood. Active on IG. No online booking or intake form automation. High-traffic tourist area = seasonal leads.',
      },
      {
        name: 'Balanced Chiropractic, PT & Massage',
        owner: '',
        location: 'Charlottesville, VA',
        phone: '(434) 293-6600',
        website: 'https://www.balancechiropracticva.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Chiropractic + PT + massage combo. Basic site. Multi-service means multiple automation entry points: booking, intake, review gen, membership upsell.',
      },
      {
        name: 'Lake Mary Chiropractic Center',
        owner: '',
        location: 'Lake Mary, FL',
        phone: '(407) 333-2786',
        website: 'https://lakemarychiropractic.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Lake Mary, FL suburban practice. Blog content is decent but site is outdated, no booking system. Orlando metro area — high demand for chiro services.',
      },
      {
        name: 'MN Spine and Sport',
        owner: '',
        location: 'Minneapolis, MN',
        phone: '(612) 823-3800',
        website: 'https://mnspineandsport.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 7,
        notes: 'Sports-focused chiropractic + PT in Minneapolis. Active athlete client base. Seasonal (winter sports injuries) automation pitch + booking funnel.',
      },
      {
        name: 'Action Physical Therapy & Chiropractic',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 436-5959',
        website: 'https://www.actionphysical.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'LV area. Active entertainment/sports injury market. Basic website. No intake automation. High-volume market = automated follow-up is a game changer.',
      },
      {
        name: 'Physical Medicine & Rehab (PMR)',
        owner: '',
        location: 'Multiple Locations, US',
        phone: '(888) 767-3227',
        website: 'https://physicalmedicineandrehab.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 7,
        notes: 'Multi-location chiro + PT group. Website is basic for the scale of operation. Insurance pre-auth automation + multi-location scheduling pitch.',
      },
      {
        name: 'Perimeter Chiropractic',
        owner: '',
        location: 'Atlanta, GA',
        phone: '(770) 395-0116',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 10,
        notes: 'Operates in affluent Perimeter district, Atlanta. No website found. Clean demo site + booking automation = very compelling pitch for this market.',
      },
      {
        name: 'OrthoSport Physical Therapy',
        owner: '',
        location: 'Houston, TX',
        phone: '(713) 529-8819',
        website: 'https://orthosportphysicaltherapy.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 4,
        opp: 8,
        notes: 'Houston orthopedic PT. Sports + post-surgery rehab. Decent Google reviews but weak website with no intake automation or new patient funnel.',
      },
    ],
  },

  // ── 7. Real Estate Teams & Boutique Brokerages ───────────────────────────
  {
    icon: '🏡',
    name: 'Real Estate Teams & Boutique Brokerages',
    prospects: [
      {
        name: 'The Boutique Real Estate Group',
        owner: '',
        location: 'Orange County, CA',
        phone: '(949) 243-6299',
        website: 'https://www.theboutiquere.com',
        instagram: 'https://www.instagram.com/theboutiquere',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'Independent luxury brokerage est. 2013, OC CA. Has website but no automated buyer/seller drip campaigns. Luxury market = high commission per deal.',
      },
      {
        name: 'MGS Group Real Estate',
        owner: '',
        location: 'Boston, MA',
        phone: '(617) 375-7900',
        website: 'https://mgsgrouprealestate.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Boutique luxury brokerage in Boston, NYC, Miami. No automated lead nurturing. Multi-city = multi-location automation pitch + CRM drip campaigns.',
      },
      {
        name: 'Broad Street Boutique Realty',
        owner: '',
        location: 'Boston, MA',
        phone: '(617) 517-7800',
        website: 'https://www.broadboutique.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: 'Hyper-local Boston luxury boutique. Personal approach to RE. Good branding but no buyer/seller automation. IDX website + nurture sequences pitch.',
      },
      {
        name: 'IS LUXURY Real Estate',
        owner: '',
        location: 'Las Vegas, NV',
        phone: '(702) 538-3800',
        website: 'https://isluxury.com',
        instagram: 'https://www.instagram.com/isluxury',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 8,
        notes: 'Boutique luxury brokerage in LV + Henderson. Modern architecture + historic home specialty. Has IG. Needs automated buyer nurture + CRM integration.',
      },
      {
        name: 'Engel & Völkers Charlotte',
        owner: '',
        location: 'Charlotte, NC',
        phone: '(704) 814-9200',
        website: 'https://www.evrealestate.com/en/nc/charlotte',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 7,
        notes: 'Luxury residential + new construction Charlotte. Converted from Henderson Ventures (boutique). Local office automation + lead nurture pitch.',
      },
      {
        name: 'SPiRALNY Real Estate',
        owner: '',
        location: 'New York, NY',
        phone: '(212) 960-9590',
        website: 'https://spiralny.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 7,
        notes: 'NYC boutique brokerage. Agents keep 90% commission. Attracts independent agents — pitch could be website + automation tools for the whole agent network.',
      },
      {
        name: 'Liz Wood Realty',
        owner: 'Liz Wood',
        location: 'New Orleans, LA',
        phone: '(504) 810-4100',
        website: '',
        instagram: '',
        hasWebsite: 'No',
        wqs: 0,
        opp: 9,
        notes: 'Boutique NOLA brokerage deliberately small agent roster since 2011. No proper website found. Premium local brand = premium website is a natural pitch.',
      },
      {
        name: 'Nest Realty',
        owner: '',
        location: 'Charlottesville, VA',
        phone: '(434) 566-0121',
        website: 'https://nestrealty.com',
        instagram: 'https://www.instagram.com/nestrealty',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 7,
        notes: 'Independent boutique brokerage, strong local brand. Multi-market in Mid-Atlantic. Has IG. Lacks automated seller/buyer drip. Good for full automation pitch.',
      },
      {
        name: 'Speicher Group (Keller Williams)',
        owner: '',
        location: 'Baltimore, MD',
        phone: '(410) 972-4000',
        website: 'https://www.speichergroup.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 6,
        opp: 7,
        notes: 'One of the top-producing KW teams in the US. Decent digital presence. Needs custom CRM automation for buyer drip and seller follow-up campaigns.',
      },
      {
        name: 'Abrams Realty',
        owner: '',
        location: 'Atlanta, GA',
        phone: '(404) 213-3000',
        website: 'https://www.abramshomes.com',
        instagram: '',
        hasWebsite: 'Yes',
        wqs: 5,
        opp: 8,
        notes: '100% commission model brokerage in Atlanta. Independent agents need their own digital presence — pitch individual agent websites + shared automation tools.',
      },
    ],
  },
];

// ─── Build Notion page + database per niche ──────────────────────────────────

async function createNichePage(parentId, niche, index) {
  // 1. Create a top-level page for the niche
  const page = await withRetry(() => notion.pages.create({
    parent: { type: 'page_id', page_id: parentId },
    icon: { type: 'emoji', emoji: niche.icon },
    properties: {
      title: { title: rt(`${niche.icon} ${niche.name} Prospects`) },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: rt(`Nick Digital pitch: $1,500–$3,000 setup  •  $500–$1,000/month retainer`),
          icon: { type: 'emoji', emoji: '💰' },
          color: 'green_background',
        },
      },
      {
        object: 'block',
        type: 'divider',
        divider: {},
      },
    ],
  }), `create page: ${niche.name}`);

  await sleep(300);

  // 2. Create the prospects database inside the page
  const db = await withRetry(() => notion.databases.create({
    parent: { type: 'page_id', page_id: page.id },
    title: rt(`${niche.name} — Prospects`),
    properties: buildProperties(),
  }), `create db: ${niche.name}`);

  await sleep(300);

  // 3. Insert each prospect as a row
  for (let i = 0; i < niche.prospects.length; i++) {
    const p = niche.prospects[i];
    const props = {
      'Business Name': { title: rt(p.name) },
      '#': { number: i + 1 },
      'Status': { select: { name: 'New' } },
      'Notes': { rich_text: rt(p.notes || '') },
      'Has Website': { select: { name: p.hasWebsite || 'No' } },
    };

    if (p.owner)    props['Owner Name']            = { rich_text: rt(p.owner) };
    if (p.location) props['Location']               = { rich_text: rt(p.location) };
    if (p.phone)    props['Phone']                  = { rich_text: rt(p.phone) };
    if (p.website)  props['Website']                = { url: p.website };
    if (p.instagram) props['Instagram']             = { url: p.instagram };
    if (p.wqs)      props['Website Quality Score']  = { number: p.wqs };
    if (p.opp)      props['Opportunity Score']      = { number: p.opp };

    await withRetry(() => notion.pages.create({
      parent: { database_id: db.id },
      properties: props,
    }), `add prospect: ${p.name}`);

    process.stdout.write(`    [${i + 1}/${niche.prospects.length}] ${p.name}\n`);
    await sleep(250);
  }

  return page;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Nick Digital — Writing prospect pages to Notion…');
  console.log('══════════════════════════════════════════════════════\n');

  for (let i = 0; i < NICHES.length; i++) {
    const niche = NICHES[i];
    console.log(`\n${niche.icon}  [${i + 1}/${NICHES.length}] ${niche.name}`);
    try {
      await createNichePage(PARENT_PAGE_ID, niche, i);
      console.log(`  ✅ ${niche.prospects.length} prospects added`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      console.error(err.body || '');
    }
    await sleep(500);
  }

  const total = NICHES.reduce((s, n) => s + n.prospects.length, 0);
  console.log(`\n\n✅ All done! ${NICHES.length} niche pages + ${total} prospect businesses added to Notion.\n`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
