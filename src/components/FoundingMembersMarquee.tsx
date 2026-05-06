import React from 'react';
import Image from 'next/image';
import styles from './FoundingMembersMarquee.module.css';
import { prisma } from '@/lib/db';

const FOUNDING_MEMBERS = [
  "Shaik Shameem", "Shaik Roohi Rehana Begum", "Matte Rahul", "Konidena Swapna", 
  "Nadendla Harsha Vardhan", "Pasam Gopi Chand", "Yakkaladevi Bhuvanesh", 
  "Marepalli Harya Vardhan", "Shaik Sana Samyrah", "Shaik Munwar", 
  "Shaik Abdul Khayyum", "Itta Harsha Vardhan", "Nelapati Noble Sujani", 
  "Valla Bhargav", "Badam Malavika", "Badam Sushranth", "Chimata Uday Kiran"
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default async function FoundingMembersMarquee() {
  // Fetch any of these members who have registered and have an image/role
  const dbUsers = await prisma.user.findMany({
    where: { name: { in: FOUNDING_MEMBERS } },
    select: { name: true, image: true, role: true }
  });

  // Map the hardcoded list to display data
  const displayMembers = FOUNDING_MEMBERS.map(name => {
    // We use a case-insensitive check just in case the registration had different casing
    const dbUser = dbUsers.find(u => u.name?.toLowerCase() === name.toLowerCase());
    return {
      id: name,
      name: name,
      image: dbUser?.image || null,
      role: dbUser?.role || 'Founding Member' // Fallback role if not registered
    };
  });

  // Create two differently shuffled rows
  const row1 = shuffleArray(displayMembers);
  const row2 = shuffleArray(displayMembers);

  return (
    <section className={styles.membersSection}>
      <h2 className={styles.membersTitle}>Our Founding Members</h2>
      <div className={styles.marqueeContainer}>
        {/* Row 1: Left to Right */}
        <div className={`${styles.marqueeTrack} ${styles.marqueeTrackLeft}`}>
          {/* Triplicate the list for infinite scrolling effect */}
          {[...row1, ...row1, ...row1].map((member, index) => (
            <div key={`row1-${member.id}-${index}`} className={styles.memberCard}>
              <img 
                src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=150`} 
                alt={member.name} 
                className={styles.memberAvatar}
              />
              <span className={styles.memberName}>{member.name}</span>
              <span className={styles.memberRole}>{member.role}</span>
            </div>
          ))}
        </div>

        {/* Row 2: Right to Left */}
        <div className={`${styles.marqueeTrack} ${styles.marqueeTrackRight}`}>
          {/* Triplicate the list for infinite scrolling effect */}
          {[...row2, ...row2, ...row2].map((member, index) => (
            <div key={`row2-${member.id}-${index}`} className={styles.memberCard}>
              <img 
                src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=150`} 
                alt={member.name} 
                className={styles.memberAvatar}
              />
              <span className={styles.memberName}>{member.name}</span>
              <span className={styles.memberRole}>{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
