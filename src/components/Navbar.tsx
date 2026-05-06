import Link from 'next/link';
import Image from 'next/image';
import { Home } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Image src="/logo.jpg" alt="Mishaye Pupil Society Logo" width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
        <span className="gradient-text">Mishaye Pupil Society</span>
      </Link>
      
      <div className={styles.navLinks}>
        <Link href="/programs" className={styles.link}>Programs</Link>
        <Link href="/sevas" className={styles.link}>Events</Link>
        <Link href="/auth/login">
          <button className={styles.loginBtn}>Login</button>
        </Link>
      </div>
    </nav>
  );
}
