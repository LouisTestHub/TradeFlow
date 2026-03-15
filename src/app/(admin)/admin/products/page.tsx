'use client';

import { useState, useEffect, useCallback } from 'react';

type Tab = 'ppp' | 'medicine';

interface Product {
  id: string;
  name: string;
  activeIngredient?: string | null;
  [key: string]: unknown;
}

export default function AdminProductsPage() {
  const [tab, setTab] = useState<Tab>('ppp');
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    try {
      const res = await fetch(`/api/admin/products/${tab}?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { /* empty */ }
    setLoading(false);
  }, [tab, page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${tab}?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const saveProduct = async (data: Record<string, string>) => {
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...data, id: editing.id } : data;
    await fetch(`/api/admin/products/${tab}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setShowForm(false);
    setEditing(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Database Management</h1>
          <p className="text-sm text-slate-500">{total} products</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[48px]"
        >
          + Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTab('ppp'); setPage(1); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium min-h-[48px] transition-colors ${tab === 'ppp' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'}`}
        >
          🌾 PPP Products
        </button>
        <button
          onClick={() => { setTab('medicine'); setPage(1); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium min-h-[48px] transition-colors ${tab === 'medicine' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'}`}
        >
          💊 Medicine Products
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm min-h-[48px] mb-4"
      />

      {/* Product List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Active Ingredient</th>
                {tab === 'ppp' && <th className="text-left py-3 px-4 font-medium text-slate-500">MAPP</th>}
                {tab === 'medicine' && <th className="text-left py-3 px-4 font-medium text-slate-500">Species</th>}
                {tab === 'medicine' && <th className="text-left py-3 px-4 font-medium text-slate-500">POM Status</th>}
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    {[1, 2, 3, 4].map(j => <td key={j} className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No products found</td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-slate-800">{p.name}</td>
                  <td className="py-3 px-4 text-slate-600">{p.activeIngredient || '—'}</td>
                  {tab === 'ppp' && <td className="py-3 px-4 text-slate-600">{(p as Record<string, unknown>).mapp as string || '—'}</td>}
                  {tab === 'medicine' && <td className="py-3 px-4 text-slate-600">{(p as Record<string, unknown>).species as string || '—'}</td>}
                  {tab === 'medicine' && <td className="py-3 px-4 text-slate-600">{(p as Record<string, unknown>).pomStatus as string || '—'}</td>}
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => { setEditing(p); setShowForm(true); }}
                      className="text-xs text-primary hover:underline min-h-[36px] px-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-xs text-red-500 hover:underline min-h-[36px] px-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-slate-500 disabled:opacity-30 min-h-[44px]">← Prev</button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-slate-500 disabled:opacity-30 min-h-[44px]">Next →</button>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <ProductForm
          tab={tab}
          product={editing}
          onSave={saveProduct}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ProductForm({ tab, product, onSave, onClose }: { tab: Tab; product: Product | null; onSave: (data: Record<string, string>) => void; onClose: () => void }) {
  const [name, setName] = useState(product?.name || '');
  const [activeIngredient, setActiveIngredient] = useState((product?.activeIngredient as string) || '');
  const [extra1, setExtra1] = useState(tab === 'ppp' ? ((product as Record<string, unknown>)?.mapp as string || '') : ((product as Record<string, unknown>)?.species as string || ''));
  const [extra2, setExtra2] = useState(tab === 'ppp' ? ((product as Record<string, unknown>)?.manufacturer as string || '') : ((product as Record<string, unknown>)?.pomStatus as string || ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, string> = { name, activeIngredient };
    if (tab === 'ppp') {
      data.mapp = extra1;
      data.manufacturer = extra2;
    } else {
      data.species = extra1;
      data.pomStatus = extra2;
    }
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{product ? 'Edit' : 'Add'} {tab === 'ppp' ? 'PPP' : 'Medicine'} Product</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Product Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Active Ingredient</label>
            <input type="text" value={activeIngredient} onChange={e => setActiveIngredient(e.target.value)} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{tab === 'ppp' ? 'MAPP Number' : 'Species'}</label>
            <input type="text" value={extra1} onChange={e => setExtra1(e.target.value)} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{tab === 'ppp' ? 'Manufacturer' : 'POM Status'}</label>
            <input type="text" value={extra2} onChange={e => setExtra2(e.target.value)} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm min-h-[48px]" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 min-h-[48px]">
              {product ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm border border-gray-300 text-slate-600 min-h-[48px]">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
