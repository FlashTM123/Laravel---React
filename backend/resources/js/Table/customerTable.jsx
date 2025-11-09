import React, { useEffect, useMemo, useState } from 'react'

/**
 * CustomerTable
 * Props:
 * - data: optional array of customer objects (id, name, email, phone, address, status, password)
 * If no data prop provided, component will try to fetch /api/customers (GET, expected JSON array)
 */
export default function CustomerTable({ data: initialData }) {
  const [data, setData] = useState(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState(null)

  // UI state
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    if (initialData) return
    let mounted = true
    setLoading(true)
    fetch('/api/customers')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`)
        const ct = r.headers.get('content-type') || ''
        if (ct.includes('application/json')) return r.json()
        // If server returned HTML (for example a Blade view), read text and throw an informative error
        return r.text().then((text) => {
          // include a short excerpt to avoid huge messages
          const excerpt = text.slice(0, 1000)
          throw new Error(`Expected JSON but received: ${excerpt}`)
        })
      })
      .then((json) => {
        if (!mounted) return
        setData(Array.isArray(json) ? json : [])
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Failed to load')
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [initialData])

  // Filtered and paginated data
  const filtered = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((c) => {
      return (
        String(c.id).includes(q) ||
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.address || '').toLowerCase().includes(q) ||
        (String(c.status) || '').toLowerCase().includes(q)
      )
    })
  }, [data, query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages])

  const pageData = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  function maskPassword(pw) {
    if (!pw) return ''
    return '•'.repeat(Math.max(4, String(pw).length))
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold">Quản lý khách hàng</h3>
            <p className="text-sm text-gray-500">{total} khách hàng</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="search"
              aria-label="Tìm khách hàng"
              className="w-64 pl-10 pr-3 py-2 rounded-lg border bg-gray-50 text-sm focus:ring focus:ring-indigo-100"
              placeholder="Tìm theo id, tên, email, phone..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>

          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            aria-label="Số dòng trên trang"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={25}>25 / trang</option>
            <option value={50}>50 / trang</option>
          </select>

         
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading && (
              Array.from({ length: Math.min(perPage, 5) }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-44" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-6 py-4" />
                </tr>
              ))
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-red-600">
                  Lỗi khi tải dữ liệu: {error}
                </td>
              </tr>
            )}

            {!loading && !error && pageData.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="mx-auto max-w-md">
                    <p className="text-lg font-medium text-gray-700">Chưa có khách hàng</p>
                  
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && pageData.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{c.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.phone}</td>
                <td className="px-6 py-4 truncate max-w-xs text-sm text-gray-600">{c.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  { (c.status === 'active' || c.status === 1) ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => console.log('Edit', c.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button onClick={() => console.log('Delete', c.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
            Trước
          </button>
          <div className="px-3">{page} / {totalPages}</div>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>
  )
}
