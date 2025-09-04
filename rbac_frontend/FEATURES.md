# RBAC Frontend

This React application provides a modern light-themed admin dashboard to manage:
- User authentication and login
- Role management (create, edit, delete)
- Permission management (create, edit, delete)
- User-role assignment
- Permission assignment to roles
- Dashboard overview for users, roles, permissions
- Responsive UI with a sidebar layout

Color palette:
- Primary: #1976d2
- Secondary: #424242
- Accent: #ff9800

## Environment
Copy .env.example to .env and set:
- REACT_APP_API_BASE_URL
- REACT_APP_SITE_URL

## API
The app expects a backend exposing:
- POST /auth/login -> { token }
- GET /auth/me -> user
- GET/POST/PUT/DELETE /users
- PUT /users/:id/roles { role_ids: number[] }
- GET/POST/PUT/DELETE /roles
- PUT /roles/:id/permissions { permission_ids: number[] }
- GET/POST/PUT/DELETE /permissions
- GET /stats -> { users, roles, permissions, recent? }

Authorization via Bearer JWT in Authorization header.
