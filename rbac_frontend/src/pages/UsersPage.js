import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { Modal, Panel, Table, TextField, Select } from '../components/UI';

// PUBLIC_INTERFACE
export default function UsersPage() {
  /** Create, edit, delete users and assign roles to users. */
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [editing, setEditing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const [u, r] = await Promise.all([api.listUsers(), api.listRoles()]);
      setUsers(u || []);
      setRoles(r || []);
    } catch (e) {
      setErr(e.message || 'Failed to load');
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setEmail(''); setFullName(''); setEditing(null); };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.updateUser(editing.id, { email, full_name: fullName });
      else await api.createUser({ email, full_name: fullName });
      resetForm();
      load();
    } catch (e) {
      setErr(e.message || 'Failed to save user');
    }
  };

  const onEdit = (u) => {
    setEditing(u);
    setEmail(u.email || '');
    setFullName(u.full_name || '');
  };

  const onDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.email}"?`)) return;
    try {
      await api.deleteUser(u.id);
      load();
    } catch (e) {
      setErr(e.message || 'Failed to delete user');
    }
  };

  const openAssign = (u) => {
    setAssigning(u);
    const current = (u.roles || []).map((r) => String(r.id));
    setSelectedRoles(current);
  };

  const doAssign = async () => {
    try {
      await api.assignRolesToUser(assigning.id, selectedRoles.map((x) => Number(x)));
      setAssigning(null);
      load();
    } catch (e) {
      setErr(e.message || 'Failed to assign roles');
    }
  };

  const columns = useMemo(() => ([
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'roles', label: 'Roles', render: (val, row) => (row.roles || []).map(r => r.name).join(', ') || '-' },
  ]), []);

  return (
    <div className="grid cols-2">
      <Panel
        title="Users"
        subtitle={err || "Manage application users"}
      >
        <Table
          columns={columns}
          data={users}
          renderActions={(row) => ([
            <button key="assign" className="btn accent small" onClick={() => openAssign(row)}>Assign</button>,
            <button key="edit" className="btn secondary small" onClick={() => onEdit(row)}>Edit</button>,
            <button key="del" className="btn danger small" onClick={() => onDelete(row)}>Delete</button>
          ])}
        />
      </Panel>

      <Panel
        title={editing ? 'Edit User' : 'Create User'}
        subtitle="Provide user info"
        right={editing && <button className="btn ghost small" onClick={resetForm}>Clear</button>}
      >
        <form onSubmit={onSave}>
          <div className="form-row">
            <div className="col-6">
              <TextField label="Email" value={email} onChange={setEmail} placeholder="user@example.com" />
            </div>
            <div className="col-6">
              <TextField label="Full Name" value={fullName} onChange={setFullName} placeholder="Jane Doe" />
            </div>
          </div>
          <button className="btn primary" type="submit">{editing ? 'Save Changes' : 'Create User'}</button>
        </form>
      </Panel>

      <Modal
        open={!!assigning}
        title={`Assign Roles: ${assigning?.email || ''}`}
        onClose={() => setAssigning(null)}
        footer={
          <>
            <button className="btn ghost" onClick={() => setAssigning(null)}>Cancel</button>
            <button className="btn primary" onClick={doAssign}>Save</button>
          </>
        }
      >
        <div className="form-row">
          <div className="col-12">
            <Select
              label="Roles"
              value={selectedRoles}
              onChange={setSelectedRoles}
              multiple
              options={roles.map((r) => ({ value: String(r.id), label: r.name }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
