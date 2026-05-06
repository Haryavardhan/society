'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { LogOut, Activity, User as UserIcon, ClipboardList, CheckCircle2, X, Bell } from 'lucide-react';
import styles from './page.module.css';

type Task = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const popupShown = useRef(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/user/tasks');
      if (res.ok) {
        const data: Task[] = await res.json();
        setTasks(data);
        setTasksLoaded(true);
        // Show popup automatically once on first load if there are pending tasks
        const pending = data.filter(t => !t.isCompleted);
        if (pending.length > 0 && !popupShown.current) {
          setShowPopup(true);
          popupShown.current = true;
        }
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchTasks();
  }, [status]);

  const handleComplete = async (taskId: string) => {
    setCompletingId(taskId);
    try {
      const res = await fetch('/api/user/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) {
        await fetchTasks();
      } else {
        alert('Failed to mark task as complete.');
      }
    } catch (err) { console.error(err); }
    finally { setCompletingId(null); }
  };

  if (status === 'loading' || !session) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  const isVolunteer = session.user?.role === 'VOLUNTEER';
  const isAdmin = session.user?.role === 'ADMIN';
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.welcome}>Hello, {session.user?.name || 'User'}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your community dashboard</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {pendingTasks.length > 0 && (
            <button
              onClick={() => setShowPopup(true)}
              style={{
                position: 'relative', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '50px', padding: '0.5rem 1rem', cursor: 'pointer',
                color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontWeight: 600, fontSize: '0.875rem',
              }}
            >
              <Bell size={16} />
              {pendingTasks.length} Pending {pendingTasks.length === 1 ? 'Task' : 'Tasks'}
            </button>
          )}
          <span className={styles.roleBadge}>{session.user?.role}</span>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <aside className={styles.sidebar}>
          <div className={`${styles.card} glass-panel`}>
            <h2 className={styles.cardTitle}><UserIcon size={20} /> Account</h2>
            <ul className={styles.actionList}>
              <li className={styles.actionItem}>
                <div>
                  <strong>Email</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{session.user?.email}</div>
                </div>
              </li>
              <li className={styles.actionItem}>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={`${styles.btn} ${styles.signOutBtn}`}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </li>
              {isAdmin && (
                <li className={styles.actionItem} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => router.push('/dashboard/admin')}
                    className={styles.btn}
                    style={{ width: '100%', background: 'var(--text-primary)' }}
                  >
                    Go to Admin Panel
                  </button>
                </li>
              )}
            </ul>
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* My Tasks Section */}
          <div className={`${styles.card} glass-panel`} style={{ borderTop: pendingTasks.length > 0 ? '3px solid #10b981' : undefined }}>
            <h2 className={styles.cardTitle}>
              <ClipboardList size={20} style={{ color: '#10b981' }} />
              My Tasks
              {pendingTasks.length > 0 && (
                <span style={{
                  background: '#ef4444', color: 'white', borderRadius: '50px',
                  fontSize: '0.7rem', padding: '0.15rem 0.5rem', fontWeight: 700,
                }}>
                  {pendingTasks.length} pending
                </span>
              )}
            </h2>

            {!tasksLoaded ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No tasks assigned yet. Check back later!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingTasks.map(task => (
                  <div key={task.id} style={{
                    padding: '1rem 1.25rem', borderRadius: '12px',
                    background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
                  }}>
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{task.title}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Assigned: {new Date(task.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleComplete(task.id)}
                      disabled={completingId === task.id}
                      className={styles.btn}
                      style={{
                        background: '#10b981', whiteSpace: 'nowrap', flexShrink: 0,
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      {completingId === task.id ? 'Saving...' : 'Mark Complete'}
                    </button>
                  </div>
                ))}

                {completedTasks.length > 0 && (
                  <>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Completed
                    </p>
                    {completedTasks.map(task => (
                      <div key={task.id} style={{
                        padding: '0.85rem 1.25rem', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                        opacity: 0.6,
                      }}>
                        <div>
                          <p style={{ fontWeight: 600, textDecoration: 'line-through', fontSize: '0.95rem' }}>{task.title}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                        </div>
                        <CheckCircle2 size={20} color="#10b981" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Activity Section */}
          <div className={`${styles.card} glass-panel`}>
            <h2 className={styles.cardTitle}><Activity size={20} /> My Activity</h2>
            {isVolunteer ? (
              <div className={styles.actionList}>
                <p style={{ color: 'var(--text-secondary)' }}>You are registered as a volunteer. Active events you accept will appear here.</p>
                <button className={styles.btn} style={{ marginTop: '1rem' }} onClick={() => router.push('/sevas')}>Browse Available Events</button>
              </div>
            ) : (
              <div className={styles.actionList}>
                <p style={{ color: 'var(--text-secondary)' }}>As a member, you can track programs you are attending and events you have requested.</p>
                <button className={styles.btn} style={{ marginTop: '1rem' }} onClick={() => router.push('/programs')}>Explore Programs</button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Auto Popup for Pending Tasks */}
      {showPopup && pendingTasks.length > 0 && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
          <div style={{
            background: 'var(--surface-color)', borderRadius: '20px',
            padding: '2rem', maxWidth: '500px', width: '100%',
            border: '1px solid rgba(16,185,129,0.3)',
            boxShadow: '0 0 0 1px rgba(16,185,129,0.1), 0 25px 60px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={22} style={{ color: '#10b981' }} />
                You have {pendingTasks.length} pending {pendingTasks.length === 1 ? 'task' : 'tasks'}!
              </h2>
              <button onClick={() => setShowPopup(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {pendingTasks.map(task => (
                <div key={task.id} style={{
                  padding: '0.9rem 1.1rem', borderRadius: '12px',
                  background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{task.title}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className={styles.btn}
              style={{ width: '100%', marginTop: '1.5rem', background: '#10b981', fontWeight: 700, fontSize: '1rem', padding: '0.75rem' }}
            >
              View My Tasks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
