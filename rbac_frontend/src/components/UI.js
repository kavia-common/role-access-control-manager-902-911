import React from 'react';

// PUBLIC_INTERFACE
export function Panel({ title, subtitle, right, children }) {
  /** Card panel with title and optional right actions. */
  return (
    <div className="card">
      {(title || right || subtitle) && (
        <div className="flex items-center justify-between mb-12">
          <div>
            {title && <div className="page-title">{title}</div>}
            {subtitle && <div className="page-subtitle">{subtitle}</div>}
          </div>
          <div className="flex gap-8">{right}</div>
        </div>
      )}
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Table({ columns, data, renderActions }) {
  /** Simple table component. columns: [{key,label}], data: array */
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            {renderActions && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id || row.name || JSON.stringify(row)}>
              {columns.map((c) => (
                <td key={c.key}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
              {renderActions && <td><div className="row-actions">{renderActions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// PUBLIC_INTERFACE
export function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  /** Input with label */
  return (
    <div>
      <div className="label">{label}</div>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

// PUBLIC_INTERFACE
export function Select({ label, value, onChange, options, multiple }) {
  /** Select with options; supports multiple */
  return (
    <div>
      <div className="label">{label}</div>
      <select
        className="select"
        value={value}
        onChange={(e) => {
          if (multiple) {
            const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
            onChange(vals);
          } else {
            onChange(e.target.value);
          }
        }}
        multiple={multiple}
      >
        {!multiple && <option value="">Select...</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Modal({ open, title, children, onClose, footer }) {
  /** Basic modal dialog */
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,17,20,0.4)', display:'grid', placeItems:'center', zIndex:30 }}>
      <div className="card" style={{ width:'min(720px, 92vw)' }}>
        <div className="flex items-center justify-between mb-12">
          <div className="page-title">{title}</div>
          <button className="btn ghost small" onClick={onClose}>✕</button>
        </div>
        <div>{children}</div>
        {footer && <div className="flex items-center justify-between mt-8">{footer}</div>}
      </div>
    </div>
  );
}
