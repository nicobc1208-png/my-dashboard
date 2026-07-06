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

// MedSpa Batch 13: Boise ID + Provo UT + Reno NV + Fayetteville AR + Madison WI
const prospects = [
  // Boise ID
  { name: 'The Skin Studio Boise', owner: 'Dr. Amy Fisk', location: 'Boise, ID', phone: '(208) 336-7546', website: 'https://www.theskinstudioboise.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boise ID medspa — rapidly expanding metro' },
  { name: 'Glow Medspa Boise', owner: 'Dr. Katelyn Wren', location: 'Boise, ID', phone: '(208) 995-9500', website: 'https://www.glowmedspaboise.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boise ID medical spa' },
  { name: 'Treasure Valley MedSpa Boise', owner: 'Dr. Brian Kerr', location: 'Boise, ID', phone: '(208) 378-0065', website: 'https://www.tvmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Boise ID medspa — Treasure Valley market' },
  // Provo UT
  { name: 'Utah Valley MedSpa Provo', owner: 'Dr. Kevin Christensen', location: 'Provo, UT', phone: '(801) 374-1900', website: 'https://www.utahvalleymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Provo UT medspa — large young demographic' },
  { name: 'Refresh MedSpa Provo', owner: 'Dr. Lisa Sorensen', location: 'Provo, UT', phone: '(801) 434-5900', website: 'https://www.refreshmedspautah.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Provo UT medical spa' },
  { name: 'Alpine Aesthetics Provo', owner: 'Dr. David Holt', location: 'Provo, UT', phone: '(801) 373-7800', website: 'https://www.alpineaestheticsutah.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Provo UT medspa — Botox and filler' },
  // Reno NV
  { name: 'Reno MedSpa & Laser', owner: 'Dr. Christopher Maloney', location: 'Reno, NV', phone: '(775) 826-1600', website: 'https://www.renomedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 8, notes: 'Reno NV medical spa — growing Nevada market' },
  { name: 'Sierra Nevada MedSpa Reno', owner: 'Dr. Emily Drake', location: 'Reno, NV', phone: '(775) 828-7700', website: 'https://www.sierranevadamedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Reno NV medspa' },
  { name: 'Midtown MedSpa Reno', owner: 'Dr. Rachel Kim', location: 'Reno, NV', phone: '(775) 323-4500', website: 'https://www.midtownmedsparen.com', hasWebsite: 'Yes', wqs: 5, opp: 8, notes: 'Reno NV — Midtown area medical spa' },
  // Fayetteville AR
  { name: 'Ozark MedSpa Fayetteville', owner: 'Dr. Jennifer McCord', location: 'Fayetteville, AR', phone: '(479) 443-4700', website: 'https://www.ozarkmedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR medspa — NW Arkansas booming market' },
  { name: 'Natural State MedSpa Fayetteville', owner: 'Dr. Mark Sullivan', location: 'Fayetteville, AR', phone: '(479) 521-5300', website: 'https://www.naturalstatemedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Fayetteville AR medical spa' },
  { name: 'Bella MedSpa Fayetteville AR', owner: 'Dr. Tracy Owens', location: 'Fayetteville, AR', phone: '(479) 966-4747', website: 'https://www.bellamedspaar.com', hasWebsite: 'Yes', wqs: 4, opp: 7, notes: 'Fayetteville AR medspa' },
  // Madison WI
  { name: 'Madison MedSpa & Laser Center', owner: 'Dr. Patricia Barnes', location: 'Madison, WI', phone: '(608) 251-6100', website: 'https://www.madisonmedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Madison WI medical spa — college + state capital market' },
  { name: 'Capitol City MedSpa Madison', owner: 'Dr. Thomas Grant', location: 'Madison, WI', phone: '(608) 833-7200', website: 'https://www.capitolcitymedspa.com', hasWebsite: 'Yes', wqs: 5, opp: 7, notes: 'Madison WI medspa' },
  { name: 'Sundara MedSpa Madison', owner: 'Dr. Karen Buehler', location: 'Madison, WI', phone: '(608) 253-3000', website: 'https://www.sundaramedspa.com', hasWebsite: 'Yes', wqs: 6, opp: 7, notes: 'Madison WI luxury medspa' },
];

(async () => {
  console.log('💆 MedSpa Prospects — Batch 13 (Boise + Provo + Reno + Fayetteville AR + Madison WI)');
  let total = 0;
  for (const p of prospects) {
    await addMedSpa(p);
    console.log(`  ✓ ${p.name} (${p.location})`);
    total++;
    await sleep(300);
  }
  console.log(`\n✅ MedSpa Batch 13 complete — ${total} prospects added.`);
})();
