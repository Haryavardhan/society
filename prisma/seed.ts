import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const members = [
  "Shaik Shameem",
  "Shaik Roohi Rehana Begum",
  "Matte Rahul",
  "Konidena Swapna",
  "Nadendla Harsha Vardhan",
  "Pasam Gopi Chand",
  "Yakkaladevi Bhuvanesh",
  "Marepalli Harya Vardhan",
  "Shaik Sana Samyrah",
  "Shaik Munwar",
  "Shaik Abdul Khayyum",
  "Itta Harsha Vardhan",
  "Nelapati Noble Sujani",
  "Valla Bhargav",
  "Badam Malavika",
  "Badam Sushranth"
];

async function main() {
  console.log('Start seeding...');

  // Use a simple default password for seeded members
  const defaultPassword = await bcrypt.hash('Mishaye@2026', 12);

  for (const name of members) {
    const email = name.toLowerCase().replace(/\s+/g, '.') + '@mishayepupilsociety.com';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: defaultPassword,
          role: 'MEMBER',
          // Note: using UI Avatars for placeholder images
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`
        },
      });
      console.log(`Created user with email: ${user.email}`);
    } else {
      console.log(`User already exists: ${email}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
