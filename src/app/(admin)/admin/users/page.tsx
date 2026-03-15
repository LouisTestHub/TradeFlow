'use client';

import { useState, useEffect, useCallback } from 'react';

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  farm: string | null;
  farmId: string | null;
  disabled: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { /* empty */ }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleUser = async (userId: string, disabled: boolean) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disabled: !disabled }),
    });
    fetchUsers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">{total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm min-h-[48px] flex-1 min-w-[200px]"
        />
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]"
        >
          <option value="">All Roles</option>
          <option value="FARMER">Farmer</option>
          <option value="FARM_MANAGER">Farm Manager</option>
          <option value="AGRONOMIST">Agronomist</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Role</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Farm</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5, 6].map(j => (
                      <td key={j} className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <button onClick={() => setSelectedUser(selectedUser === u.id ? null : u.id)} className="font-medium text-slate-800 hover:text-primary min-h-[44px] text-left">
                      {u.name || 'Unnamed'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      u.role === 'ADMIN' ? 'bg-red-50 text-red-600' :
                      u.role === 'DISABLED' ? 'bg-gray-100 text-gray-500' :
                      'bg-primary/10 text-primary'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.farm || '—'}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleUser(u.id, u.role === 'DISABLED')}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg min-h-[36px] ${
                        u.role === 'DISABLED'
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {u.role === 'DISABLED' ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 min-h-[44px] px-3"
            >
              ← Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 min-h-[44px] px-3"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetail userId={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

function UserDetail({ userId, onClose }: { userId: string; onClose: () => void }) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`).then(r => r.json()).then(setData);
  }, [userId]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">User Detail</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center">✕</button>
        </div>
        <div className="space-y-3 text-sm">
          <div><span className="text-slate-500">Name:</span> <span className="font-medium">{data.user.name || 'Unnamed'}</span></div>
          <div><span className="text-slate-500">Email:</span> <span className="font-medium">{data.user.email}</span></div>
          <div><span className="text-slate-500">Role:</span> <span className="font-medium">{data.user.role}</span></div>
          <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{data.user.phone || 'N/A'}</span></div>
          {data.user.farm && (
            <div><span className="text-slate-500">Farm:</span> <span className="font-medium">{typeof data.user.farm === 'object' ? data.user.farm?.name : data.user.farm}</span></div>
          )}
          <div><span className="text-slate-500">Joined:</span> <span className="font-medium">{new Date(data.user.createdAt).toLocaleDateString('en-GB')}</span></div>
          {data.stats && (
            <div className="pt-3 border-t border-gray-100">
              <p className="font-medium text-slate-700 mb-2">Farm Usage</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-lg font-bold">{data.stats.sprays}</p><p className="text-xs text-slate-500">Sprays</p></div>
                <div><p className="text-lg font-bold">{data.stats.medicines}</p><p className="text-xs text-slate-500">Medicine</p></div>
                <div><p className="text-lg font-bold">{data.stats.movements}</p><p className="text-xs text-slate-500">Movements</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
