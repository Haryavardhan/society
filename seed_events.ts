import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
  { title: 'Event 1: Food Distribution Drive | Mishaye Pupil Society | Nov 5, 2023', description: 'Community Event 1', videoUrl: 'https://www.youtube.com/embed/bbmV90ugNog', status: 'COMPLETED' as const },
  { title: 'Event 2: Bedsheet Distribution Drive | Mishaye Pupil Society | Jan 2024', description: 'Community Event 2', videoUrl: 'https://www.youtube.com/embed/fF9xnhfNnBc', status: 'COMPLETED' as const },
  { title: 'Event 3: Food Distribution Drive | Supported by Navya Mam | Mishaye Pupil Society', description: 'Community Event 3', videoUrl: 'https://www.youtube.com/embed/blwSjJX8jy8', status: 'COMPLETED' as const },
  { title: 'Event 4: Clothing Distribution at Seetharamayya Ashram | Mishaye Pupil Society', description: 'Community Event 4', videoUrl: 'https://www.youtube.com/embed/a0TS_0lTIjY', status: 'COMPLETED' as const },
  { title: 'Event 5: Fruit Distribution Drive | Mishaye Pupil Society', description: 'Community Event 5', videoUrl: 'https://www.youtube.com/embed/RL6xVkI6mu0', status: 'COMPLETED' as const },
  { title: 'Event 6: Ramzan Special Distribution at Urdu School | Mishaye Pupil Society', description: 'Community Event 6', videoUrl: 'https://www.youtube.com/embed/YBwXRrbSW3s', status: 'COMPLETED' as const },
  { title: 'Event 7: Food Distribution Drive in Nandyal | Mishaye Pupil Society', description: 'Community Event 7', videoUrl: 'https://www.youtube.com/embed/Sm4eYz2i6J4', status: 'COMPLETED' as const },
];

async function main() {
  console.log('Clearing existing sevas/events...');
  await prisma.seva.deleteMany();

  console.log('Inserting new events...');
  for (const event of events) {
    await prisma.seva.create({
      data: event
    });
  }
  
  console.log('Successfully inserted 7 events!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
