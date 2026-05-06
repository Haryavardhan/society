import styles from './page.module.css';
import FoundingMembersMarquee from '@/components/FoundingMembersMarquee';
import { prisma } from '@/lib/db';
import SocietyFooter from '@/components/SocietyFooter';
import SevaFilterList from '@/components/SevaFilterList';

export const dynamic = 'force-dynamic';

export default async function SevasPage() {
  const sevas = await prisma.seva.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-fade-in`}>
        <h1 className={styles.title}>Community <span className="gradient-text">Events</span></h1>
        <p className={styles.subtitle}>
          Browse active events and track community volunteer activities in real-time.
        </p>
      </header>

      <SevaFilterList sevas={sevas.map(s => ({
        ...s,
        engagedUsers: s.engagedUsers as any // Handle Json type
      }))} />

      <FoundingMembersMarquee />
      <SocietyFooter />
    </div>
  );
}
