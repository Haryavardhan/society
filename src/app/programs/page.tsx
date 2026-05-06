import { Calendar, Users } from 'lucide-react';
import styles from './page.module.css';
import FoundingMembersMarquee from '@/components/FoundingMembersMarquee';
import SocietyFooter from '@/components/SocietyFooter';

// Mock data (we can replace this with Prisma DB calls later)
const programs = [
  {
    id: 1,
    title: 'Community Food Drive',
    description: 'Help us distribute food to those in need. We are targeting to serve 500 families in the upcoming weekend.',
    date: '2026-06-15',
    participants: 45
  },
  {
    id: 2,
    title: 'River Cleanup Drive',
    description: 'Join hands to clean up the local riverbed. Equipment will be provided. A small step for a greener future.',
    date: '2026-06-22',
    participants: 120
  },
  {
    id: 3,
    title: 'Free Health Checkup Camp',
    description: 'Organizing a free health checkup camp for the elderly members of our society in collaboration with City Hospital.',
    date: '2026-07-05',
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
