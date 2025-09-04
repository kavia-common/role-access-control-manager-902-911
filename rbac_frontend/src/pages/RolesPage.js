import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { Modal, Panel, Table, TextField, Select } from '../components/UI';

// PUBLIC_INTERFACE
export default function RolesPage() {
  /** Create, edit, delete roles and assign permissions to roles. */
  const [roles, setRoles] = useState([]);
  const [perms, setPerms] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [editing, setEditing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const [r, p] = await Promise.all([api.listRoles(), api.listPermissions()]);
      setRoles(r || []);
      setPerms(p || []);
    } catch (e) {
      setErr(e.message || 'Failed to load');
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setName(''); setDesc(''); setEditing(null); };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.updateRole(editing.id, { name, description: desc });
      else await api.createRole({ name, description: desc });
      resetForm();
      load();
    } catch (e) {
      setErr(e.message || 'Failed to save role');
    }
  };

  const onEdit = (role) => {
    setEditing(role);
    setName(role.name || '');
    setDesc(role.description || '');
  };

  const onDelete = async (role) => {
    if (!window.confirm(`Delete role "${role.name}"?`)) return;
    try {
      await api.deleteRole(role.id);
      load();
    } catch (e) {
      setErr(e.message || 'Failed to delete role');
    }
  };

  const openAssign = (role) => {
    setAssigning(role);
    const current = (role.permissions || []).map((p) => String(p.id));
    setSelectedPerms(current);
  };

  const doAssign = async () => {
    try {
      await api.assignPermissionsToRole(assigning.id, selectedPerms.map((x) => Number(x)));
      setAssigning(null);
      load();
    } catch (e) {
      setErr(e.message || 'Failed to assign permissions');
    }
  };

  const columns = useMemo(() => ([
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'permissions', label: 'Permissions', render: (val, row) => (row.permissions || []).map(p => p.name).join(', ') || '-' },
  ]), []);

  return (
    <div className="grid cols-2">
      <Panel
        title="Roles"
        subtitle={err || "Manage access roles"}
      >
        <Table
          columns={columns}
          data={roles}
          renderActions={(row) => ([
            <button key="assign" className="btn accent small" onClick={() => openAssign(row)}>Assign</button>,
            <button key="edit" className="btn secondary small" onClick={() => onEdit(row)}>Edit</button>,
            <button key="del" className="btn danger small" onClick={() => onDelete(row)}>Delete</button>
          ])}
        />
      </Panel>

      <Panel
        title={editing ? 'Edit Role' : 'Create Role'}
        subtitle="Define role name and description"
        right={editing && <button className="btn ghost small" onClick={resetForm}>Clear</button>}
      >
        <form onSubmit={onSave}>
          <div className="form-row">
            <div className="col-6">
              <TextField label="Name" value={name} onChange={setName} placeholder="e.g. Admin" />
            </div>
            <div className="col-6">
              <TextField label="Description" value={desc} onChange={setDesc} placeholder="What can this role do?" />
            </div>
          </div>
          <button className="btn primary" type="submit">{editing ? 'Save Changes' : 'Create Role'}</button>
        </form>
      </Panel>

      <Modal
        open={!!assigning}
        title={`Assign Permissions: ${assigning?.name || ''}`}
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
              label="Permissions"
              value={selectedPerms}
              onChange={setSelectedPerms}
              multiple
              options={perms.map((p) => ({ value: String(p.id), label: p.name }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
