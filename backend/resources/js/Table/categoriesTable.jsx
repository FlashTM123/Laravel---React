import React, { useEffect, useMemo, useState } from 'react'

/**
 * CategoriesTable
 * Props:
 * - initialData: required array of categories { id, name, description }
 * This component intentionally does NOT call any API. Provide data via props.
 */

const CategoriesTable = ({ initialData }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    if (!initialData) return setData([])
    try {
      const parsed = typeof initialData === 'string' ? JSON.parse(initialData) : initialData
      setData(Array.isArray(parsed) ? parsed : [])
    } catch (e) {
      console.error('Error parsing categories initialData:', e)
      setData([])
    }
  }, [initialData])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [adding, setAdding] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editCategory, setEditCategory] = useState({ id: null, name: '', description: '' })
  const [editing, setEditing] = useState(false)

  const filtered = useMemo(() => {
    if (!data || data.length === 0) return []
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((c) => {
      return (
        String(c.id).includes(q) ||
        (c.name || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
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
    const headers = ['id', 'name', 'description']
    const csv = [headers.join(',')].concat(
      rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
    ).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'categories.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleAddCategory(e) {
    e.preventDefault()
    if (!newCategory.name.trim()) {
      alert('Vui lòng nhập tên danh mục')
      return
    }
    setAdding(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const res = await fetch('/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
        },
        body: JSON.stringify(newCategory)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`)
      }

      // Expect JSON with created category; fallback to parsing text
      const ct = res.headers.get('content-type') || ''
      const created = ct.includes('application/json') ? await res.json() : null

      if (created && created.id) {
        setData(prev => [created, ...prev])
      } else {
        // If server didn't return JSON, add optimistic local category
        const temp = { id: Date.now(), ...newCategory }
        setData(prev => [temp, ...prev])
      }

      setNewCategory({ name: '', description: '' })
      setShowAddModal(false)
    } catch (err) {
      console.error('Add category error:', err)
      alert('Không thể thêm danh mục: ' + (err.message || err))
    } finally {
      setAdding(false)
    }
  }
  async function handleEditCategory(e) {
    e.preventDefault()
    if (!editCategory.name.trim()) {
      alert('Vui lòng nhập tên danh mục')
      return
    }
    setEditing(true)
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const res = await fetch(`/categories/${editCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
        },
        body: JSON.stringify(editCategory)
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`)

      }

      const ct = res.headers.get('content-type') || ''
      const updated = ct.includes('application/json') ? await res.json() : null

      if (updated && updated.id) {
        setData(prev => prev.map(c => c.id === updated.id ? updated : c))
      } else {
        const temp = { ...editCategory }
        setData(prev => prev.map(c => c.id === temp.id ? temp : c))
      }
  setEditCategory({ id: null, name: '', description: '' })
  setShowEditModal(false)
  setEditing(false)
    } catch (error) {
      console.error('Edit category error:', error)
      alert('Không thể cập nhật danh mục: ' + (error.message || error))
      setEditing(false)
    }
  }

  return (
    <>
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border-l-8 border-indigo-500">
      {/* Header / Toolbar */}
  <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-indigo-600 to-indigo-500 text-white">
        <div>
          <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
          <p className="text-sm text-indigo-100 mt-1">{total} mục</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="search"
              aria-label="Tìm danh mục"
              className="w-64 pl-10 pr-3 py-2 rounded-lg border  text-sm focus:ring-2 focus:ring-indigo-300 shadow-sm"
              placeholder="Tìm theo id hoặc tên..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            />
            <svg className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>

          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
            className="border rounded-lg px-3 py-2 text-sm "
            aria-label="Số dòng trên trang"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={25}>25 / trang</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="text-lg">➕</span>
            Thêm danh mục
          </button>

          <button
            onClick={() => exportCSV(filtered)}
            className="ml-2 inline-flex items-center gap-2 bg-white/90 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow"
          >
            ⤓ Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
  <div className="overflow-x-auto bg-linear-to-b from-white/60 to-white/80">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {pageData.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="mx-auto max-w-md">
                    {data.length === 0 ? (
                      <>
                        <p className="text-lg font-medium text-gray-800">Chưa có mục nào</p>
                        <p className="text-sm text-gray-500 mt-2">Thêm danh mục mới để bắt đầu quản lý.</p>
                        <div className="mt-4">
                          <button onClick={() => window.location.href = '/categories/create'} className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold shadow">Thêm danh mục</button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Không tìm thấy kết quả.</p>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {pageData.map((c, idx) => (
              <tr key={c.id} className={`transition-shadow duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:shadow-md`}> 
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{c.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{c.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => { setEditCategory({ id: c.id, name: c.name || '', description: c.description || '' }); setShowEditModal(true); }} className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md mr-2 hover:bg-indigo-100">Sửa</button>
                  <button onClick={() => {
                    if (!confirm(`Bạn có chắc muốn xóa danh mục "${c.name}"?`)) return;
                    const form = document.createElement('form');
                    // HTML forms only support GET or POST. Use POST + method spoofing via _method=DELETE
                    form.method = 'POST';
                    form.action = `/categories/${c.id}`;
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
                  }} className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      <div className="flex items-center justify-between gap-4 p-4 border-t">
        <div className="text-sm text-gray-600">Hiển thị {pageData.length} / {total}</div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ←
          </button>

          {/* page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded ${pageNum === page ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
                >{pageNum}</button>
              )
            })}
          </div>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>

    {/* Add Category Modal (AJAX) */}
    {showAddModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600 text-white">
            <h3 className="text-lg font-semibold">Thêm danh mục mới</h3>
          </div>
          <form onSubmit={handleAddCategory} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
              <input name="name" value={newCategory.name} onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea name="description" value={newCategory.description} onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded" rows={4} />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">Hủy</button>
              <button type="submit" disabled={adding} className="px-4 py-2 bg-indigo-600 text-white rounded">{adding ? 'Đang thêm...' : 'Thêm'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {/* Edit Category Modal (AJAX) */}
    {showEditModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600 text-white">
            <h3 className="text-lg font-semibold">Chỉnh sửa danh mục</h3>
          </div>
          <form onSubmit={handleEditCategory} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
              <input name="name" value={editCategory.name} onChange={(e) => setEditCategory(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea name="description" value={editCategory.description} onChange={(e) => setEditCategory(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded" rows={4} />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowEditModal(false); setEditCategory({ id: null, name: '', description: '' }); setEditing(false); }} className="px-4 py-2 border rounded">Hủy</button>
              <button type="submit" disabled={editing} className="px-4 py-2 bg-indigo-600 text-white rounded">{editing ? 'Đang lưu...' : 'Lưu'}</button>
            </div>
          </form>
        </div>
      </div>
    )}    
    </>
  )
}

export default CategoriesTable
