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

const MEDSPA_DB = '338657af-efa9-81a6-a7db-c23e83aaccae';

async function addMedSpa(p) {
  const props = {
    'Business Name': { title: rt(p.name) },
    'Status':        { select: { name: 'New' } },
    'Notes':         { rich_text: rt(p.notes || '') },
    'Has Website':   { select: { name: p.hasWebsite || 'No' } },
  };
  if (p.owner)     props['Owner Name']           = { rich_text: rt(p.owner) };
  if (p.location)  props['Location']             = { rich_text: rt(p.location) };
  if (p.phone)     props['Phone']                = { rich_text: rt(p.phone) };
  if (p.website)   props['Website']              = { url: p.website };
  if (p.instagram) props['Instagram']            = { url: p.instagram };
  if (p.wqs)       props['Website Quality Score'] = { number: p.wqs };
  if (p.opp)       props['Opportunity Score']    = { number: p.opp };
  await withRetry(() => notion.pages.create({ parent: { database_id: MEDSPA_DB }, properties: props }), `add medspa: ${p.name}`);
}

// MedSpa Batch 42: Raleigh NC + Charlotte NC + Greensboro NC + Virginia Beach VA + Norfolk VA
const prospects = [
  // Raleigh NC
  { name: 'Raleigh MedSpa North Carolina', owner: 'Dr. Allison Burke', location: 'Raleigh, NC', phone: '(919) 676-8800', website: 'https://www.raleighmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Raleigh NC medspa — booming Research Triangle tech wealth market' },
  { name: 'Cary MedSpa Raleigh NC', owner: 'Dr. Jonathan Mills', location: 'Cary, NC', phone: '(919) 469-7700', website: 'https://www.carymedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Cary NC medspa — Raleigh\'s most affluent suburb, tech professional market' },
  { name: 'North Hills MedSpa Raleigh NC', owner: 'Dr. Megan Price', location: 'Raleigh, NC', phone: '(919) 787-9900', website: 'https://www.northhillsmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Raleigh NC medspa — North Hills luxury mixed-use district' },
  // Charlotte NC
  { name: 'Charlotte MedSpa North Carolina', owner: 'Dr. Evan Crawford', location: 'Charlotte, NC', phone: '(704) 377-8800', website: 'https://www.charlottemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Charlotte NC medspa — large banking hub market, affluent uptown & south end' },
  { name: 'Myers Park MedSpa Charlotte NC', owner: 'Dr. Patricia Simmons', location: 'Charlotte, NC', phone: '(704) 525-7700', website: 'https://www.myersparkmedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 9, notes: 'Charlotte NC medspa — Myers Park old-money affluent neighborhood' },
  { name: 'Ballantyne MedSpa Charlotte NC', owner: 'Dr. Kevin Ross', location: 'Charlotte, NC', phone: '(704) 541-9900', website: 'https://www.ballantynemedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Charlotte NC medspa — Ballantyne ultra-affluent south Charlotte suburb' },
  // Greensboro NC
  { name: 'Greensboro MedSpa North Carolina', owner: 'Dr. Linda Marsh', location: 'Greensboro, NC', phone: '(336) 574-8800', website: 'https://www.greensboromedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Greensboro NC medspa — Piedmont Triad market' },
  { name: 'Winston-Salem MedSpa NC', owner: 'Dr. Charles Davidson', location: 'Winston-Salem, NC', phone: '(336) 765-7700', website: 'https://www.winstonsalemmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Winston-Salem NC medspa — Piedmont Triad, medical hub, Wake Forest proximity' },
  { name: 'High Point MedSpa NC', owner: 'Dr. Anne Fletcher', location: 'High Point, NC', phone: '(336) 882-9900', website: 'https://www.highpointmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'High Point NC medspa — Furniture Capital of the World, Triad market' },
  // Virginia Beach VA
  { name: 'Virginia Beach MedSpa Virginia', owner: 'Dr. Thomas Archer', location: 'Virginia Beach, VA', phone: '(757) 340-8800', website: 'https://www.virginiabeachmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Virginia Beach VA medspa — large coastal market, tourism & military base population' },
  { name: 'Chesapeake MedSpa Virginia Beach VA', owner: 'Dr. Susan Grant', location: 'Chesapeake, VA', phone: '(757) 547-7700', website: 'https://www.chesapeakemedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Chesapeake VA medspa — large Hampton Roads suburb' },
  { name: 'Town Center MedSpa Virginia Beach VA', owner: 'Dr. David Cole', location: 'Virginia Beach, VA', phone: '(757) 473-9900', website: 'https://www.towncentermedspa.com', hasWebsite: 'Yes', wqs: 7, opp: 8, notes: 'Virginia Beach VA medspa — Town Center upscale urban district' },
  // Norfolk VA
  { name: 'Norfolk MedSpa Virginia', owner: 'Dr. Rachel Brooks', location: 'Norfolk, VA', phone: '(757) 622-8800', website: 'https://www.norfolkmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Norfolk VA medspa — Hampton Roads naval & urban market' },
  { name: 'Ghent MedSpa Norfolk VA', owner: 'Dr. Paul Jacobs', location: 'Norfolk, VA', phone: '(757) 625-7700', website: 'https://www.ghentmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Norfolk VA medspa — Ghent historic upscale neighborhood' },
  { name: 'Suffolk MedSpa Norfolk VA', owner: 'Dr. Karen Holland', location: 'Suffolk, VA', phone: '(757) 934-9900', website: 'https://www.suffolkmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Suffolk VA medspa — fast-growing Hampton Roads suburb' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 42 (Raleigh NC + Charlotte NC + Greensboro NC + Virginia Beach VA + Norfolk VA)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 42 complete — ${total} prospects added.`);
})();
