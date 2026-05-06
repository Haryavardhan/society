import Link from 'next/link';
import { Users, HeartHandshake, CalendarClock, ArrowRight } from 'lucide-react';
import styles from './page.module.css';
import FoundingMembersMarquee from '@/components/FoundingMembersMarquee';
import SocietyFooter from '@/components/SocietyFooter';

export default async function Home() {
  return (
    <main className={styles.main}>
      {/* Dynamic background handled globally in globals.css */}

      <section className={`${styles.hero} animate-fade-in`}>
        <h1 className={styles.title}>
          Empowering Communities <br />
          <span className="gradient-text">Together</span>
        </h1>
        <p className={styles.subtitle}>
          Join our society management platform to volunteer for sevas, participate in programs, and build a stronger community.
        </p>
        
        <div className={styles.ctaGroup}>
          <Link href="/programs">
            <button className={styles.primaryBtn}>
              Explore Programs <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px' }} />
            </button>
          </Link>
          <Link href="/auth/login">
            <button className={styles.secondaryBtn}>
              Join as Volunteer
            </button>
          </Link>
        </div>
      </section>

      <section className={styles.featuresGrid}>
        <div className={`${styles.featureCard} glass-panel animate-fade-in`} style={{ animationDelay: '0.1s' }}>
          <div className={styles.featureIcon}>
            <HeartHandshake size={24} />
          </div>
          <h3>Volunteer for Sevas</h3>
          <p>
            Browse real-time listings of community tasks and sevas. Step up and make a difference where it's needed most.
          </p>
        </div>

        <div className={`${styles.featureCard} glass-panel animate-fade-in`} style={{ animationDelay: '0.2s' }}>
          <div className={styles.featureIcon}>
            <CalendarClock size={24} />
          </div>
          <h3>Upcoming Programs</h3>
          <p>
            Stay updated with the latest events, workshops, and society gatherings. Never miss an opportunity to connect.
          </p>
        </div>

        <div className={`${styles.featureCard} glass-panel animate-fade-in`} style={{ animationDelay: '0.3s' }}>
          <div className={styles.featureIcon}>
            <Users size={24} />
          </div>
          <h3>Member Dashboard</h3>
          <p>
            Access a personalized dashboard to track your contributions, request assistance, and interact with the community.
          </p>
        </div>
      </section>

      <FoundingMembersMarquee />
      <SocietyFooter />
    </main>
  );
}
