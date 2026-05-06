import { Calendar, Users } from 'lucide-react';
import styles from './page.module.css';
import FoundingMembersMarquee from '@/components/FoundingMembersMarquee';
import SocietyFooter from '@/components/SocietyFooter';

// Real program data updated for production
const programs = [
  {
    id: 1,
    title: 'Event 1: Annual Community Outreach',
    description: 'Our first major community outreach program focused on establishing connections and identifying key areas of need within the society.',
    date: '2023-11-05',
    participants: 50
  },
  {
    id: 4,
    title: 'Event 4: Clothes Distribution Drive',
    description: 'Mishaye Pupil Society organized a massive clothes distribution drive to support underprivileged families, ensuring warmth and dignity for all.',
    date: '2025-02-14',
    participants: 140
  },
  {
    id: 9,
    title: 'Event 9: School Support Program',
    description: 'A comprehensive educational initiative providing stationery, books, and essential resources to students in Chirala to empower their learning journey.',
    date: '2026-03-05',
    participants: 200
  }
];

export default function ProgramsPage() {
  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-fade-in`}>
        <h1 className={styles.title}>Society <span className="gradient-text">Programs</span></h1>
        <p className={styles.subtitle}>
          Discover and participate in upcoming programs and events organized by our society.
        </p>
      </header>

      <div className={styles.grid}>
        {programs.map((program, index) => (
          <div 
            key={program.id} 
            className={`${styles.card} glass-panel animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.cardDate}>
              <Calendar size={16} />
              {new Date(program.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <h2 className={styles.cardTitle}>{program.title}</h2>
            <p className={styles.cardDesc}>{program.description}</p>
            
            <div className={styles.cardFooter}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Users size={16} /> {program.participants} Attending
              </span>
            </div>
          </div>
        ))}
      </div>

      <FoundingMembersMarquee />
      <SocietyFooter />
    </div>
  );
}
