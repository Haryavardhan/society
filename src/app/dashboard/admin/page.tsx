'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, KeyRound, Shield, Bell, Trash2, ClipboardList, X } from 'lucide-react';
import styles from '../page.module.css';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  passwordResetRequest: boolean;
};

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type TaskModal = {
  userId: string;
  userName: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState<TaskModal | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskSaving, setTaskSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) setNotifications(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (status === 'authenticated' && session.user?.role === 'ADMIN') {
      fetchUsers();
      fetchNotifications();
      // Poll notifications every 15s
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [status, session]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (userId: string, userName: string) => {
    const first = confirm(`Are you sure you want to remove "${userName}" from the society?`);
    if (!first) return;
    const second = confirm(`This will permanently delete "${userName}" and all their data. Continue?`);
    if (!second) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) fetchUsers();
      else alert('Failed to delete user.');
    } catch (err) { console.error(err); }
  };

  const handleResetPassword = async (userId: string, newPassword: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reset-password', newPassword }),
      });
      if (res.ok) { alert('Password reset successfully!'); fetchUsers(); }
      else alert('Failed to reset password.');
    } catch (err) { console.error(err); }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskModal) return;
    setTaskSaving(true);
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle, description: taskDesc, userId: taskModal.userId }),
      });
      if (res.ok) {
        alert(`Task assigned to ${taskModal.userName} successfully!`);
        setTaskModal(null);
        setTaskTitle('');
        setTaskDesc('');
      } else {
        alert('Failed to assign task.');
      }
    } catch (err) { console.error(err); }
    finally { setTaskSaving(false); }
  };

  const handleMarkNotificationsRead = async () => {
    await fetch('/api/admin/notifications', { method: 'PATCH' });
    fetchNotifications();
  };

  if (status === 'loading' || loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  const pendingUsers = users.filter(u => u.role === 'USER');
  const activeMembers = users.filter(u => u.role !== 'USER');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.welcome}>Admin Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage society registrations and roles</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => router.push('/dashboard/admin/sevas')} className={styles.btn} style={{ background: 'var(--primary)' }}>
            Manage Events
          </button>
        </div>
      </header>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className={`${styles.card} glass-panel`} style={{
          marginBottom: '2rem',
          borderLeft: '4px solid #10b981',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.06))',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>
              <Bell size={20} style={{ color: '#10b981' }} />
              Task Completions
              {unreadCount > 0 && (
                <span style={{
                  background: '#ef4444', color: 'white', borderRadius: '50px',
                  fontSize: '0.7rem', padding: '0.15rem 0.5rem', fontWeight: 700,
                }}>
                  {unreadCount} New
                </span>
              )}
            </h2>
            {unreadCount > 0 && (
              <button onClick={handleMarkNotificationsRead} className={styles.btn}
                style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                Mark all read
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.slice(0, 5).map(n => (
              <div key={n.id} style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: n.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${n.isRead ? 'var(--border-color)' : 'rgba(16,185,129,0.3)'}`,
                fontSize: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.message}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                  {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.dashboardGrid}>
        <main style={{ gridColumn: '1 / -1' }}>
          {/* Pending Approvals */}
          <div className={`${styles.card} glass-panel`} style={{ marginBottom: '2rem' }}>
            <h2 className={styles.cardTitle}><Check size={20} /> Pending Approvals ({pendingUsers.length})</h2>
            {pendingUsers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No pending registrations.</p>
            ) : (
              <div className={styles.actionList}>
                {pendingUsers.map(user => (
                  <div key={user.id} className={styles.actionItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <strong>{user.name}</strong> ({user.email})
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Registered: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleUpdateRole(user.id, 'MEMBER')} className={styles.btn} style={{ background: 'var(--primary)' }}>
                        Approve as Member
                      </button>
                      <button onClick={() => handleUpdateRole(user.id, 'VOLUNTEER')} className={styles.btn} style={{ background: 'var(--secondary)' }}>
                        Approve as Volunteer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password Reset Requests */}
          {users.filter(u => u.passwordResetRequest).length > 0 && (
            <div className={`${styles.card} glass-panel`} style={{ marginBottom: '2rem', borderLeft: '4px solid #f59e0b' }}>
              <h2 className={styles.cardTitle}><KeyRound size={20} /> Password Reset Requests ({users.filter(u => u.passwordResetRequest).length})</h2>
              <div className={styles.actionList}>
                {users.filter(u => u.passwordResetRequest).map(user => (
                  <div key={user.id} className={styles.actionItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div>
                      <strong>{user.name}</strong> — <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input type="text" id={`reset-${user.id}`} placeholder="Enter new password"
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.875rem', minWidth: '200px' }} />
                      <button className={styles.btn} style={{ background: '#f59e0b' }}
                        onClick={() => {
                          const input = document.getElementById(`reset-${user.id}`) as HTMLInputElement;
                          if (input?.value) handleResetPassword(user.id, input.value);
                          else alert('Please enter a new password first.');
                        }}>
                        Set New Password
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Members & Volunteers */}
          <div className={`${styles.card} glass-panel`}>
            <h2 className={styles.cardTitle}><Shield size={20} /> Active Members &amp; Volunteers</h2>
            <div className={styles.actionList}>
              {activeMembers.map(user => (
                <div key={user.id} className={styles.actionItem}>
                  <div>
                    <strong>{user.name}</strong> ({user.email})
                    <span style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {user.role}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {/* Assign Task button */}
                    <button
                      onClick={() => { setTaskModal({ userId: user.id, userName: user.name || user.email || 'User' }); setTaskTitle(''); setTaskDesc(''); }}
                      className={styles.btn}
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <ClipboardList size={15} /> Assign Task
                    </button>
                    {user.role !== 'ADMIN' && (
                      <button onClick={() => handleUpdateRole(user.id, 'ADMIN')} className={styles.btn}
                        style={{ background: 'transparent', border: '1px solid var(--text-light)', color: 'var(--text-secondary)' }}>
                        Make Admin
                      </button>
                    )}
                    {/* Delete button */}
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleDelete(user.id, user.name || user.email || 'User')}
                        className={styles.btn}
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '0.5rem 0.75rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Assign Task Modal */}
      {taskModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
          <div style={{
            background: 'var(--surface-color)', borderRadius: '18px',
            padding: '2rem', maxWidth: '480px', width: '100%',
            border: '1px solid var(--border-color)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                <ClipboardList size={20} style={{ display: 'inline', marginRight: '0.5rem', color: '#10b981' }} />
                Assign Task
              </h2>
              <button onClick={() => setTaskModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={22} />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Assigning task to: <strong style={{ color: 'var(--text-primary)' }}>{taskModal.userName}</strong>
            </p>
            <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>Task Title</label>
                <input
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Organise food packets for next drive"
                  style={{
                    width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)', fontSize: '0.95rem',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Detailed instructions for the task..."
                  style={{
                    width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)', fontSize: '0.95rem', resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={taskSaving} className={styles.btn}
                  style={{ flex: 1, background: '#10b981', fontWeight: 700, fontSize: '1rem' }}>
                  {taskSaving ? 'Assigning...' : '✅ Assign Task'}
                </button>
                <button type="button" onClick={() => setTaskModal(null)} className={styles.btn}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
