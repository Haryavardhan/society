'use client';

import { useState } from 'react';
import styles from '../app/sevas/page.module.css';
import { Video, Users, IndianRupee } from 'lucide-react';

type Seva = {
  id: string;
  title: string;
  description: string;
  status: string;
  membersEngaged: number | null;
  fundsSpent: number;
  videoUrl: string | null;
  engagedUsers: any;
};

interface SevaFilterListProps {
  sevas: Seva[];
}

const getStatusClass = (status: string) => {
  switch(status) {
    case 'PLANNED': return styles.statusPlanned;
    case 'INITIATED': return styles.statusInitiated;
    case 'IN_PROGRESS': return styles.statusInProgress;
    case 'COMPLETED': return styles.statusCompleted;
    default: return styles.statusPlanned;
  }
};

export default function SevaFilterList({ sevas }: SevaFilterListProps) {
  const [activeTab, setActiveTab] = useState<'INITIATED' | 'ONGOING' | 'COMPLETED'>('COMPLETED');

  const filteredSevas = sevas.filter(seva => {
    if (activeTab === 'INITIATED') return seva.status === 'PLANNED' || seva.status === 'INITIATED';
    if (activeTab === 'ONGOING') return seva.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return seva.status === 'COMPLETED';
    return false;
  });

  return (
    <>
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'INITIATED' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('INITIATED')}
        >
          Initiated
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'ONGOING' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('ONGOING')}
        >
          Ongoing
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'COMPLETED' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          Completed
        </button>
      </div>

      <div className={styles.grid}>
        {filteredSevas.map((seva, index) => (
          <div 
            key={seva.id} 
            className={`${styles.card} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', zIndex: 1 }}>
              <span className={`${styles.statusBadge} ${getStatusClass(seva.status)}`}>
                {seva.status.replace('_', ' ')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(99, 102, 241, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                  <Users size={14} /> {seva.membersEngaged || 0} Engaged
                </div>
                {seva.fundsSpent > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                    <IndianRupee size={14} /> {seva.fundsSpent.toLocaleString('en-IN')} Spent
                  </div>
                )}
              </div>
            </div>
            
            <h2 className={styles.cardTitle}>{seva.title}</h2>
            <p className={styles.cardDesc}>{seva.description}</p>
            
            {seva.videoUrl && (
              <div className={styles.videoContainer}>
                <iframe
                  style={{ width: '100%', height: '100%', maxWidth: '400px' }}
                  src={seva.videoUrl}
                  title={seva.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {seva.engagedUsers && Array.isArray(seva.engagedUsers) && seva.engagedUsers.length > 0 && (
              <details style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.1)', zIndex: 1 }}>
                <summary style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}>
                  <Users size={14} style={{ color: 'var(--primary)' }} /> View Engaged Members ({seva.engagedUsers.length})
                </summary>
                <div style={{ marginTop: '0.75rem', maxHeight: '120px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {seva.engagedUsers.map((user: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{user}</li>
                    ))}
                  </ul>
                </div>
              </details>
            )}

            {seva.status !== 'COMPLETED' && (
              <button className={styles.volunteerBtn}>
                Offer to Help
              </button>
            )}
          </div>
        ))}
        {filteredSevas.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
            No {activeTab.toLowerCase()} events available at the moment.
          </p>
        )}
      </div>
    </>
  );
}
