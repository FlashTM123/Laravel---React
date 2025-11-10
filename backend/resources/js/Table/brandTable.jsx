import React, { useEffect, useMemo, useState } from 'react'

/**
 * BrandTable
 * Props:
 * - initialData: required array of brands { id, name }
 * This component intentionally does NOT call any API. Provide data via props.
 */

const BrandTable = ({ initialData }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    if (!initialData) return setData([])
    try {
      const parsed = typeof initialData === 'string' ? JSON.parse(initialData) : initialData
      setData(Array.isArray(parsed) ? parsed : [])
    } catch (e) {
      console.error('Error parsing brands initialData:', e)
      setData([])
    }
  }, [initialData])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBrand, setNewBrand] = useState({ name: '' })
  const [adding, setAdding] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editBrand, setEditBrand] = useState({ id: null, name: '' })
  const [editing, setEditing] = useState(false)

  const filtered = useMemo(() => {
    if (!data || data.length === 0) return []
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((b) => {
      return (
        String(b.id).includes(q) ||
        (b.name || '').toLowerCase().includes(q)
      )
    })
  }, [data, query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  if (page > totalPages) setPage(1)

  const pageData = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  function exportCSV(rows) {
    const headers = ['id', 'name']
    const csv = [headers.join(',')].concat(
      rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
    ).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brands.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleAddBrand(e) {
    e.preventDefault()
    if (!newBrand.name.trim()) {
      alert('Vui lòng nhập tên thương hiệu')
      return
    }
    setAdding(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const res = await fetch('/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
        },
        body: JSON.stringify(newBrand)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`)
      }

      const ct = res.headers.get('content-type') || ''
      const created = ct.includes('application/json') ? await res.json() : null

      if (created && created.id) {
        setData(prev => [created, ...prev])
      } else {
        const temp = { id: Date.now(), ...newBrand }
        setData(prev => [temp, ...prev])
      }

      setNewBrand({ name: '' })
      setShowAddModal(false)
    } catch (err) {
      console.error('Add brand error:', err)
      alert('Không thể thêm thương hiệu: ' + (err.message || err))
    } finally {
      setAdding(false)
    }
  }

  async function handleEditBrand(e) {
    e.preventDefault()
    if (!editBrand.name.trim()) {
      alert('Vui lòng nhập tên thương hiệu')
      return
    }
    setEditing(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const res = await fetch(`/brands/${editBrand.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
        },
        body: JSON.stringify(editBrand)
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`)
      }

      const ct = res.headers.get('content-type') || ''
      const updated = ct.includes('application/json') ? await res.json() : null

      if (updated && updated.id) {
        setData(prev => prev.map(b => b.id === updated.id ? updated : b))
      } else {
        const temp = { ...editBrand }
        setData(prev => prev.map(b => b.id === temp.id ? temp : b))
      }
      setEditBrand({ id: null, name: '' })
      setShowEditModal(false)
      setEditing(false)
    } catch (error) {
      console.error('Edit brand error:', error)
      alert('Không thể cập nhật thương hiệu: ' + (error.message || error))
      setEditing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border-l-8 border-purple-500">
        {/* Header with Add button */}
        <div className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý thương hiệu</h1>
            <p className="text-gray-600 mt-1">{total} thương hiệu</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="search"
                aria-label="Tìm thương hiệu"
                className="w-64 pl-10 pr-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-purple-300 shadow-sm"
                placeholder="Tìm theo id hoặc tên..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              />
              <svg className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>

            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
              className="border rounded-lg px-3 py-2 text-sm"
              aria-label="Số dòng trên trang"
            >
              <option value={5}>5 / trang</option>
              <option value={10}>10 / trang</option>
              <option value={25}>25 / trang</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">➕</span>
              Thêm thương hiệu
            </button>

            <button
              onClick={() => exportCSV(filtered)}
              className="ml-2 inline-flex items-center gap-2 bg-white/90 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow"
            >
              ⤓ Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Tên thương hiệu</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-purple-700 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="mx-auto max-w-md">
                      {data.length === 0 ? (
                        <>
                          <div className="text-6xl mb-4">📦</div>
                          <p className="text-lg font-medium text-gray-800">Chưa có thương hiệu nào</p>
                          <p className="text-sm text-gray-500 mt-2">Thêm thương hiệu mới để bắt đầu quản lý.</p>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-2">🔍</div>
                          <p className="text-sm text-gray-500">Không tìm thấy kết quả phù hợp.</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {pageData.map((b, idx) => (
                <tr key={b.id} className={`transition-all duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'} hover:bg-purple-50 hover:shadow-md`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      #{b.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {(b.name || 'B').charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{b.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setEditBrand({ id: b.id, name: b.name || '' }); setShowEditModal(true); }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md mr-2 hover:bg-blue-100 transition-colors"
                    >
                      <span>✏️</span>
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`Bạn có chắc muốn xóa thương hiệu "${b.name}"?`)) return;
                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = `/brands/${b.id}`;
                        form.style.display = 'none';
                        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                        if (csrfToken) {
                          const csrfInput = document.createElement('input');
                          csrfInput.type = 'hidden';
                          csrfInput.name = '_token';
                          csrfInput.value = csrfToken;
                          form.appendChild(csrfInput);
                        }
                        const methodInput = document.createElement('input');
                        methodInput.type = 'hidden';
                        methodInput.name = '_method';
                        methodInput.value = 'DELETE';
                        form.appendChild(methodInput);
                        document.body.appendChild(form);
                        form.submit();
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <span>🗑️</span>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between gap-4 p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-purple-600">{pageData.length}</span> / <span className="font-semibold">{total}</span> thương hiệu
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-purple-50 transition-colors"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ← Trước
            </button>

            {/* page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded-lg transition-all ${pageNum === page ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border hover:bg-purple-50'}`}
                  >{pageNum}</button>
                )
              })}
            </div>

            <button
              className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-purple-50 transition-colors"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>

      {/* Add Brand Modal (AJAX) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4 rounded-t-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-400/20 to-teal-400/20 animate-pulse"></div>
              <div className="flex justify-between items-center relative z-10">
                <h3 className="text-xl font-bold text-white">Thêm thương hiệu mới</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold hover:rotate-90 transition-transform duration-300"
                >
                  ×
                </button>
              </div>
            </div>
            <form onSubmit={handleAddBrand} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Nhập tên thương hiệu"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {adding ? 'Đang thêm...' : 'Thêm thương hiệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Brand Modal (AJAX) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4 rounded-t-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-400/20 to-teal-400/20 animate-pulse"></div>
              <div className="flex justify-between items-center relative z-10">
                <h3 className="text-xl font-bold text-white">Chỉnh sửa thương hiệu</h3>
                <button
                  onClick={() => { setShowEditModal(false); setEditBrand({ id: null, name: '' }); setEditing(false); }}
                  className="text-white hover:text-gray-200 text-2xl font-bold hover:rotate-90 transition-transform duration-300"
                >
                  ×
                </button>
              </div>
            </div>
            <form onSubmit={handleEditBrand} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={editBrand.name}
                  onChange={(e) => setEditBrand(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Nhập tên thương hiệu"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditBrand({ id: null, name: '' }); setEditing(false); }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {editing ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandTable
