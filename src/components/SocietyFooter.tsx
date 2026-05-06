import { Crown, BadgeCheck, Mail } from 'lucide-react';

export default function SocietyFooter() {
  return (
    <section style={{
      width: '100%',
      padding: '4rem 2rem 3rem',
      background: 'var(--surface-color)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '2rem',
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          fontWeight: 700,
        }}>
          Society Leadership
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Founder card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.1rem 1.5rem',
            borderRadius: '14px',
            background: 'var(--bg-color, #f8f9fa)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.12)', flexShrink: 0,
            }}>
              <Crown size={20} color="#f59e0b" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', margin: 0, marginBottom: '0.2rem' }}>
                Founder &amp; Co-Founder
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Shaik Shameem
              </p>
            </div>
          </div>

          {/* Registration card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.1rem 1.5rem',
            borderRadius: '14px',
            background: 'var(--bg-color, #f8f9fa)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.1)', flexShrink: 0,
            }}>
              <BadgeCheck size={20} color="#6366f1" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', margin: 0, marginBottom: '0.2rem' }}>
                Official Registration No.
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                118 of 2024
              </p>
            </div>
          </div>

          {/* Contact / Raise Query card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.1rem 1.5rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(99, 102, 241, 0.08))',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 2px 12px rgba(16,185,129,0.07)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)', flexShrink: 0,
            }}>
              <Mail size={20} color="#10b981" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', margin: 0, marginBottom: '0.2rem' }}>
                Raise a Query
              </p>
              <a
                href="mailto:mishayepupil@gmail.com"
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#10b981',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                mishayepupil@gmail.com
              </a>
            </div>
          </div>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Mishaye Pupil Society — Officially registered &amp; recognized.
        </p>
      </div>
    </section>
  );
}
