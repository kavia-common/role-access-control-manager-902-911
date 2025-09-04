import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Panel } from '../components/UI';

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /** Overview of key RBAC statistics: users, roles, permissions and assignments. */
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.stats()
      .then(setStats)
      .catch((e) => setErr(e.message || 'Failed to load stats'));
  }, []);

  return (
    <div className="grid cols-3">
      <div className="card">
        <div className="page-title">Users</div>
        <div className="page-subtitle">Total users in the system</div>
        <div style={{ fontSize:36, fontWeight:800, color:'#1976d2' }}>{stats?.users ?? '—'}</div>
      </div>
      <div className="card">
        <div className="page-title">Roles</div>
        <div className="page-subtitle">Defined access roles</div>
        <div style={{ fontSize:36, fontWeight:800, color:'#1976d2' }}>{stats?.roles ?? '—'}</div>
      </div>
      <div className="card">
        <div className="page-title">Permissions</div>
        <div className="page-subtitle">Granular permissions</div>
        <div style={{ fontSize:36, fontWeight:800, color:'#1976d2' }}>{stats?.permissions ?? '—'}</div>
      </div>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <Panel
          title="Recent Activity"
          subtitle={err ? err : "Latest assignments and changes (sample from backend)"}
        >
          {!stats && !err && <div>Loading...</div>}
          {stats?.recent && stats.recent.length > 0 ? (
            <ul>
              {stats.recent.map((item, idx) => (
                <li key={idx} className="mb-8">• {item}</li>
              ))}
            </ul>
          ) : !err && <div className="page-subtitle">No recent entries</div>}
        </Panel>
      </div>
    </div>
  );
}
