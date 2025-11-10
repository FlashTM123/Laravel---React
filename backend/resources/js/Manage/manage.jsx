import React, { useState, useEffect } from 'react'

/**
 * Manage Dashboard Component
 * Beautiful management dashboard with stats, quick actions, and recent activities
 */

const ManageDashboard = ({ statsData }) => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_categories: 0,
    total_brands: 0,
    total_customers: 0,
    active_users: 0,
    recent_signups: 0
  })

  useEffect(() => {
    if (statsData) {
      try {
        const parsed = typeof statsData === 'string' ? JSON.parse(statsData) : statsData
        setStats(parsed)
      } catch (e) {
        console.error('Error parsing stats:', e)
      }
    }
  }, [statsData])

  const quickActions = [
    {
      title: 'Quản lý người dùng',
      description: 'Xem và quản lý tài khoản người dùng',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      link: '/users',
      stats: stats.total_users || 0
    },
    {
      title: 'Quản lý danh mục',
      description: 'Thêm và chỉnh sửa danh mục sản phẩm',
      icon: '📁',
      color: 'from-indigo-500 to-indigo-600',
      link: '/categories',
      stats: stats.total_categories || 0
    },
    {
      title: 'Quản lý thương hiệu',
      description: 'Quản lý các thương hiệu và nhà sản xuất',
      icon: '📦',
      color: 'from-purple-500 to-purple-600',
      link: '/brands',
      stats: stats.total_brands || 0
    },
    {
      title: 'Quản lý khách hàng',
      description: 'Theo dõi thông tin khách hàng',
      icon: '🛍️',
      color: 'from-emerald-500 to-emerald-600',
      link: '/customers',
      stats: stats.total_customers || 0
    }
  ]

  const recentActivities = [
    {
      type: 'user',
      icon: '👤',
      color: 'bg-blue-100 text-blue-600',
      title: 'Người dùng mới đăng ký',
      description: `${stats.recent_signups || 0} người dùng mới trong 7 ngày qua`,
      time: 'Hôm nay'
    },
    {
      type: 'category',
      icon: '📋',
      color: 'bg-indigo-100 text-indigo-600',
      title: 'Danh mục đã cập nhật',
      description: 'Hệ thống danh mục được tối ưu',
      time: '2 giờ trước'
    },
    {
      type: 'brand',
      icon: '✨',
      color: 'bg-purple-100 text-purple-600',
      title: 'Thương hiệu mới',
      description: 'Thêm thương hiệu vào hệ thống',
      time: '5 giờ trước'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🎯 Dashboard Quản Lý
        </h1>
        <p className="text-gray-600 text-lg">
          Chào mừng bạn đến với trang quản trị hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Tổng người dùng
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total_users || 0}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +{stats.active_users || 0} hoạt động
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              👥
            </div>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Danh mục
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total_categories || 0}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                  Đang quản lý
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              📁
            </div>
          </div>
        </div>

        {/* Total Brands */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Thương hiệu
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total_brands || 0}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  Đa dạng
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              📦
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Khách hàng
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total_customers || 0}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  Tích cực
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              🛍️
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">⚡ Thao tác nhanh</h2>
              <span className="text-sm text-gray-500">Quản lý hệ thống</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.link}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-[2px] hover:scale-105 transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${action.color.split(' ')[0].replace('from-', '')} 0%, ${action.color.split(' ')[1].replace('to-', '')} 100%)`
                  }}
                >
                  <div className="bg-white rounded-xl p-5 h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {action.icon}
                      </div>
                      <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors">
                        {action.stats}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                      Truy cập
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities - 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📊 Hoạt động gần đây</h2>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className={`flex-shrink-0 w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center text-xl`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Xem tất cả hoạt động
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Hệ thống hoạt động bình thường</p>
              <p className="text-xs text-gray-500">Cập nhật lần cuối: Hôm nay</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">99.9%</p>
              <p className="text-xs text-gray-500">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">&lt;100ms</p>
              <p className="text-xs text-gray-500">Response</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">A+</p>
              <p className="text-xs text-gray-500">Performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageDashboard
