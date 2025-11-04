import React, { useState, useEffect } from "react";
import Table from "../TableLayouts/table";

const UserTable = ({ initialData = null, statsData = null }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Không cần loading vì data đã có sẵn
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (initialData) {
      try {
        // Parse data nếu là string
        const userData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
        setUsers(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setUsers([]);
      }
    }

    if (statsData) {
      try {
        const statsObject = typeof statsData === 'string' ? JSON.parse(statsData) : statsData;
        setStats(statsObject);
      } catch (e) {
        console.error('Error parsing stats data:', e);
        setStats({});
      }
    }
  }, [initialData, statsData]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const statusText = newStatus === 'active' ? 'kích hoạt' : 'khóa';

    if (!confirm(`Bạn có chắc muốn ${statusText} người dùng "${user.name}"?`)) {
      return;
    }

    // Cập nhật trong state (trong thực tế sẽ gọi API)
    setUsers(users.map(u =>
      u.id === user.id
        ? { ...u, status: newStatus }
        : u
    ));

    alert(`${statusText === 'kích hoạt' ? 'Kích hoạt' : 'Khóa'} người dùng thành công!`);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.name}"?`)) {
      return;
    }

    // Xóa từ state (hoặc có thể gọi API để xóa thật)
    setUsers(users.filter(u => u.id !== user.id));
    alert('Xóa người dùng thành công!');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      // Tạo ID mới (tạm thời)
      const newId = Math.max(...users.map(u => u.id), 0) + 1;

      const userToAdd = {
        ...newUser,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Thêm vào state
      setUsers([...users, userToAdd]);

      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
      });

      setShowAddModal(false);
      alert('Thêm người dùng thành công!');

    } catch (error) {
      console.error('Error adding user:', error);
      alert('Có lỗi xảy ra khi thêm người dùng!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Họ và tên' },
    {
      key: 'email',
      title: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800">
          {value}
        </a>
      )
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      render: (value) => value && value !== 'Chưa có' ? (
        <a href={`tel:${value}`} className="text-green-600 hover:text-green-800">
          {value}
        </a>
      ) : (
        <span className="text-gray-400">Chưa có</span>
      )
    },
    {
      key: 'address',
      title: 'Địa chỉ',
      render: (value) => value && value !== 'Chưa có' ? (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ) : (
        <span className="text-gray-400">Chưa có</span>
      )
    },
    {
        key: 'role',
        title: 'Vai trò',
        render: (value) => {
          if (!value || value === 'Chưa có') {
            return <span className="text-gray-400">Chưa có</span>;
          }

          const roleConfig = {
            'admin': { label: 'Quản trị viên', color: 'bg-red-100 text-red-800' },
            'moderator': { label: 'Kiểm duyệt viên', color: 'bg-yellow-100 text-yellow-800' },
            'user': { label: 'Người dùng', color: 'bg-blue-100 text-blue-800' }
          };

          const config = roleConfig[value] || { label: value, color: 'bg-gray-100 text-gray-800' };

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        }
    },
    {
        key: 'status',
        title: 'Trạng thái',
        render: (value) => {
          const statusConfig = {
            'active': { label: 'Đang hoạt động', color: 'bg-green-100 text-green-800' },
            'inactive': { label: 'Bị khóa', color: 'bg-red-100 text-red-800' }
          };

          const config = statusConfig[value] || statusConfig['active'];

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        }
    }

  ];

  const actions = [
    {
      label: 'Xem',
      variant: 'primary',
      icon: '👁️',
      onClick: (user) => {
        window.location.href = `/admin/users/${user.id}`;
      }
    },
    {
      label: 'Sửa',
      variant: 'warning',
      icon: '✏️',
      onClick: (user) => {
        window.location.href = `/admin/users/${user.id}/edit`;
      }
    },
    {
      label: (user) => user.status === 'active' ? 'Khóa' : 'Kích hoạt',
      variant: (user) => user.status === 'active' ? 'danger' : 'success',
      icon: (user) => user.status === 'active' ? '🔒' : '✅',
      onClick: handleToggleStatus
    },
    {
      label: 'Xóa',
      variant: 'danger',
      icon: '🗑️',
      onClick: handleDelete
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add User button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin người dùng hệ thống</p>
        </div>
        <button
          onClick={() => window.location.href = '/users/create'}
          className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">➕</span>
          Thêm người dùng
        </button>
      </div>

      {/* Stats cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">🔒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bị khóa</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🆕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mới tháng này</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new_users_this_month || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main table */}
      <Table
        title="Danh sách người dùng"
        data={users}
        columns={columns}
        actions={actions}
        loading={loading}
        searchable={true}
        sortable={true}
        pagination={true}
        itemsPerPage={10}
        onRowClick={(user) => window.location.href = `/admin/users/${user.id}`}
      />

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4 rounded-t-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-400/20 to-teal-400/20 animate-pulse"></div>
              <div className="flex justify-between items-center relative z-10">
                <h3 className="text-xl font-bold text-white animate-slideInLeft">Thêm người dùng mới</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold hover:rotate-90 transition-transform duration-300 hover:scale-110"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4 animate-fadeInUp">
              <div className="animate-slideInLeft" style={{animationDelay: '0.1s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 focus:scale-105 transform"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="animate-slideInRight" style={{animationDelay: '0.2s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 focus:scale-105 transform"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="animate-slideInLeft" style={{animationDelay: '0.3s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 focus:scale-105 transform"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="animate-slideInRight" style={{animationDelay: '0.4s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 focus:scale-105 transform"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="animate-slideInLeft" style={{animationDelay: '0.5s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={newUser.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 focus:scale-105 transform resize-none"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="flex gap-3 pt-4 animate-slideInUp" style={{animationDelay: '0.6s'}}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  Thêm người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
