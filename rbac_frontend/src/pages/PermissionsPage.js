import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { Panel, Table, TextField } from '../components/UI';

// PUBLIC_INTERFACE
export default function PermissionsPage() {
  /** Create, edit, delete granular permissions. */
  const [perms, setPerms] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const p = await api.listPermissions();
      setPerms(p || []);
    } catch (e) {
      setErr(e.message || 'Failed to load permissions');
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setName(''); setDesc(''); setEditing(null); };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.updatePermission(editing.id, { name, description: desc });
      else await api.createPermission({ name, description: desc });
      resetForm();
      load();
    } catch (e) {
      setErr(e.message || 'Failed to save permission');
    }
  };

  const onEdit = (p) => {
    setEditing(p);
    setName(p.name || '');
    setDesc(p.description || '');
  };

  const onDelete = async (p) => {
    if (!window.confirm(`Delete permission "${p.name}"?`)) return;
    try {
      await api.deletePermission(p.id);
      load();
    } catch (e) {
      setErr(e.message || 'Failed to delete permission');
    }
  };

  const columns = useMemo(() => ([
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
  ]), []);

  return (
    <div className="grid cols-2">
      <Panel
        title="Permissions"
        subtitle={err || "Manage granular permissions"}
      >
        <Table
          columns={columns}
          data={perms}
          renderActions={(row) => ([
            <button key="edit" className="btn secondary small" onClick={() => onEdit(row)}>Edit</button>,
            <button key="del" className="btn danger small" onClick={() => onDelete(row)}>Delete</button>
          ])}
        />
      </Panel>

      <Panel
        title={editing ? 'Edit Permission' : 'Create Permission'}
        subtitle="Define permission name and description"
        right={editing && <button className="btn ghost small" onClick={resetForm}>Clear</button>}
      >
        <form onSubmit={onSave}>
          <div className="form-row">
            <div className="col-6">
              <TextField label="Name" value={name} onChange={setName} placeholder="e.g. read:reports" />
            </div>
            <div className="col-6">
              <TextField label="Description" value={desc} onChange={setDesc} placeholder="What can this permission do?" />
            </div>
          </div>
          <button className="btn primary" type="submit">{editing ? 'Save Changes' : 'Create Permission'}</button>
        </form>
      </Panel>
    </div>
  );
}
