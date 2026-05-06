'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Video, Plus, Trash2, Edit } from 'lucide-react';
import styles from '../../page.module.css';

type Seva = {
  id: string;
  title: string;
  description: string;
  status: string;
  videoUrl: string | null;
  createdAt: string;
};

export default function AdminSevasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sevas, setSevas] = useState<Seva[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sevaStatus, setSevaStatus] = useState('PLANNED');
  const [videoUrl, setVideoUrl] = useState('');
  const [membersEngaged, setMembersEngaged] = useState(0);
  const [fundsSpent, setFundsSpent] = useState(0);
  const [engagedUsersText, setEngagedUsersText] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const fetchSevas = async () => {
    try {
      const res = await fetch('/api/admin/sevas');
      if (res.ok) {
        const data = await res.json();
        setSevas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session.user?.role === 'ADMIN') {
      fetchSevas();
    }
  }, [status, session]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSevaStatus('PLANNED');
    setVideoUrl('');
    setMembersEngaged(0);
    setFundsSpent(0);
    setEngagedUsersText('');
  };

  const handleEdit = (seva: any) => {
    setIsEditing(true);
    setEditingId(seva.id);
    setTitle(seva.title);
    setDescription(seva.description);
    setSevaStatus(seva.status);
    setVideoUrl(seva.videoUrl || '');
    setMembersEngaged(seva.membersEngaged || 0);
    setFundsSpent(seva.fundsSpent || 0);
    setEngagedUsersText(seva.engagedUsers ? seva.engagedUsers.join('\n') : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/sevas/${editingId}` : '/api/admin/sevas';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const engagedUsersArray = engagedUsersText.split('\n').map(u => u.trim()).filter(u => u.length > 0);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status: sevaStatus, videoUrl, membersEngaged, fundsSpent, engagedUsers: engagedUsersArray }),
      });

      if (res.ok) {
        resetForm();
        fetchSevas();
      } else {
        alert('Failed to save Event');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/sevas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSevas();
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'loading' || loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.welcome}>Manage Events</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create events and attach YouTube/Vimeo links</p>
        </div>
        <button onClick={() => router.push('/dashboard/admin')} className={styles.btn} style={{ background: 'var(--text-secondary)' }}>
          Back to Admin
        </button>
      </header>

      <div className={styles.dashboardGrid}>
        <aside className={styles.sidebar}>
          <div className={`${styles.card} glass-panel`}>
            <h2 className={styles.cardTitle}>
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                <select value={sevaStatus} onChange={e => setSevaStatus(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: '#111', color: 'white' }}>
                  <option value="PLANNED">Planned</option>
                  <option value="INITIATED">Initiated</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}><Video size={14} style={{display: 'inline', marginRight: '4px'}}/> YouTube/Vimeo Embed URL</label>
                <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} type="text" placeholder="https://www.youtube.com/embed/..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} />
                <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Ensure you use the embed URL, not the standard watch link.</span>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Members/Volunteers Engaged</label>
                <input value={membersEngaged} onChange={e => setMembersEngaged(Number(e.target.value))} type="number" min="0" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Funds Spent (₹)</label>
                <input value={fundsSpent} onChange={e => setFundsSpent(Number(e.target.value))} type="number" min="0" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Engaged Member Names (One per line)</label>
                <textarea value={engagedUsersText} onChange={e => setEngagedUsersText(e.target.value)} rows={4} placeholder="Shaik Shameem&#10;Valla Bhargav" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" className={styles.btn} style={{ flex: 1, background: 'var(--primary)' }}>
                  {isEditing ? 'Update' : 'Create'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className={styles.btn} style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <main>
          <div className={`${styles.card} glass-panel`}>
            <h2 className={styles.cardTitle}>All Events ({sevas.length})</h2>
            <div className={styles.actionList} style={{ marginTop: '1rem' }}>
              {sevas.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No events found. Create one to get started.</p>
              ) : (
                sevas.map(seva => (
                  <div key={seva.id} className={styles.actionItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{seva.title}</strong>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{seva.description}</div>
                        
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.75rem' }}>
                            {seva.status}
                          </span>
                          {seva.videoUrl && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.75rem' }}>
                              <Video size={14} /> Video Attached
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(seva)} className={styles.btn} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(seva.id)} className={styles.btn} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
