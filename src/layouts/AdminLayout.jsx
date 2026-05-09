import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <>
      {
        location.pathname !== '/admin/login' ? (
          <>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
              {/* Sidebar */}
              <aside style={{
                width: 220,
                background: '#111',
                color: '#fff',
                padding: 20
              }}>
                <h2>🔥 Admin</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link to="/admin" style={{ color: '#fff' }}>Dashboard</Link>
                  <Link to="/admin/orders" style={{ color: '#fff' }}>Orders</Link>
                </nav>
              </aside>

              {/* Content */}
              <main style={{ flex: 1, padding: 20 }}>
                <Outlet />
              </main>
            </div>
          </>
        ) : (
          <Outlet />
        )
      }
    </>
  );
}