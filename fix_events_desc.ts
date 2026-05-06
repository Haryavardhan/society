import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updates = [
    {
      id: 'cmoomcnzy0000j05wn8vbxjjc',
      description: 'Mishaye Pupil Society organized a community food distribution drive on November 5, 2023, providing hot meals to underprivileged families and individuals in need.',
    },
    {
      id: 'cmoomco010001j05wzizvzbwp',
      description: 'Mishaye Pupil Society distributed bedsheets and warm blankets to needy families in January 2024, bringing comfort during the winter season.',
    },
    {
      id: 'cmoomco020002j05wck5t50qx',
      description: 'A generous food distribution drive supported by Naseeha Mam, where Mishaye Pupil Society members came together to serve nutritious meals to the community.',
    },
    {
      id: 'cmoomco030003j05wlelqtiwu',
      description: 'Mishaye Pupil Society distributed clothing essentials to the residents of Seetharamayya Ashram, ensuring dignity and warmth for those living there.',
    },
    {
      id: 'cmoomco040004j05w3081vynj',
      description: 'Mishaye Pupil Society members distributed fresh fruits to the elderly and underprivileged, promoting health and showing care for the community.',
    },
    {
      id: 'cmoomco050005j05wndkpqgui',
      description: 'On the occasion of Ramzan, Mishaye Pupil Society organised a special distribution event at the local Urdu School, sharing essential supplies and spreading joy during the holy month.',
    },
    {
      id: 'cmoomco070006j05w5g9zxlnk',
      description: 'Mishaye Pupil Society extended its reach to Nandyal with a food distribution drive, serving meals to those in need and strengthening community bonds across regions.',
    },
    // Fix Event 8 title — add event number prefix
    {
      id: 'cmoq2a6b20000j0s0ih9mmh72',
      title: 'Event 8: Food Donation at Dandupadu Ashram | Mishaye Pupil Society',
    },
    // Fix Event 9 title — add event number prefix
    {
      id: 'cmoq2a6dw0001j0s0mee0yl31',
      title: 'Event 9: School Support Program at Chirala | Mishaye Pupil Society',
    },
  ];

  for (const u of updates) {
    const data: any = {};
    if (u.description) data.description = u.description;
    if (u.title) data.title = u.title;

    await prisma.seva.update({ where: { id: u.id }, data });
    console.log(`✅ Updated: ${u.id}`);
  }

  console.log('\nAll done!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
