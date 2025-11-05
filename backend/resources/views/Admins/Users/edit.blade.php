@extends('admins.app')
@section('title', 'Chỉnh sửa người dùng' . ' - ' . $user->name)
@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
            <p class="mt-2 text-gray-600">Cập nhật thông tin người dùng: <span class="font-medium text-gray-800">{{ $user->name }}</span></p>
        </div>
        <a href="{{ route('users.index') }}"
           class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
            <span class="text-xl">←</span>
            Quay lại
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Form Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="text-3xl">✏️</span>
                Thông tin chi tiết
            </h2>
            <p class="text-blue-100 mt-1">Chỉnh sửa thông tin người dùng</p>
        </div>

        <!-- Form Body -->
        <form action="{{ route('users.update', $user->id) }}" method="POST" class="p-8">
            @csrf
            @method('PUT')
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Họ và tên -->
                <div class="md:col-span-2">
                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">👤</span>
                            Họ và tên
                            <span class="text-red-500">*</span>
                        </span>
                    </label>
                    <input type="text" 
                           id="name" 
                           name="name" 
                           value="{{ old('name', $user->name) }}" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 @error('name') border-red-500 focus:ring-red-500 focus:border-red-500 @enderror"
                           placeholder="Nhập họ và tên"
                           required>
                    @error('name')
                        <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">📧</span>
                            Email
                            <span class="text-red-500">*</span>
                        </span>
                    </label>
                    <input type="email" 
                           id="email" 
                           name="email" 
                           value="{{ old('email', $user->email) }}" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 @error('email') border-red-500 focus:ring-red-500 focus:border-red-500 @enderror"
                           placeholder="Nhập email"
                           required>
                    @error('email')
                        <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Số điện thoại -->
                <div>
                    <label for="phone" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">📱</span>
                            Số điện thoại
                        </span>
                    </label>
                    <input type="tel" 
                           id="phone" 
                           name="phone" 
                           value="{{ old('phone', $user->phone) }}" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 @error('phone') border-red-500 focus:ring-red-500 focus:border-red-500 @enderror"
                           placeholder="Nhập số điện thoại">
                    @error('phone')
                        <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Vai trò -->
                <div>
                    <label for="role" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">🎭</span>
                            Vai trò
                        </span>
                    </label>
                    <select id="role" 
                            name="role" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 @error('role') border-red-500 focus:ring-red-500 focus:border-red-500 @enderror">
                        <option value="">-- Chọn vai trò --</option>
                        <option value="admin" {{ old('role', $user->role) == 'admin' ? 'selected' : '' }}>👑 Quản trị viên</option>
                        <option value="moderator" {{ old('role', $user->role) == 'moderator' ? 'selected' : '' }}>🛡️ Kiểm duyệt viên</option>
                        <option value="user" {{ old('role', $user->role) == 'user' ? 'selected' : '' }}>👤 Người dùng</option>
                    </select>
                    @error('role')
                        <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Trạng thái -->
                <div>
                    <label for="status" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">🔄</span>
                            Trạng thái
                        </span>
                    </label>
                    <select id="status" 
                            name="status" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 @error('status') border-red-500 focus:ring-red-500 focus:border-red-500 @enderror">
                        <option value="active" {{ old('status', $user->status) == 'active' ? 'selected' : '' }}>✅ Đang hoạt động</option>
                        <option value="inactive" {{ old('status', $user->status) == 'inactive' ? 'selected' : '' }}>🔒 Bị khóa</option>
                    </select>
                    @error('status')
                        <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Địa chỉ -->
                <div class="md:col-span-2">
                    <label for="address" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">🏠</span>
                            Địa chỉ
                        </span>
                    </label>
                    <textarea id="address" 
                              name="address" 
                              rows="4" 
                              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 resize-none @error('address') border-red-500 focus:ring-red-500 focus:border-red-500 @enderror"
                              placeholder="Nhập địa chỉ">{{ old('address', $user->address) }}</textarea>
                    @error('address')
                        <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Mật khẩu mới (tùy chọn) -->
                <div>
                    <label for="password" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">🔐</span>
                            Mật khẩu mới
                            <span class="text-gray-500 text-xs">(để trống nếu không đổi)</span>
                        </span>
                    </label>
                    <input type="password" 
                           id="password" 
                           name="password" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 @error('password') border-red-500 focus:ring-red-500 focus:border-red-500 @enderror"
                           placeholder="Nhập mật khẩu mới">
                    @error('password')
                        <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span>⚠️</span>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Xác nhận mật khẩu -->
                <div>
                    <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-3">
                        <span class="flex items-center gap-2">
                            <span class="text-lg">🔐</span>
                            Xác nhận mật khẩu
                        </span>
                    </label>
                    <input type="password" 
                           id="password_confirmation" 
                           name="password_confirmation" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                           placeholder="Nhập lại mật khẩu mới">
                </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="text-lg">ℹ️</span>
                    <span>Các trường có dấu <span class="text-red-500">*</span> là bắt buộc</span>
                </div>
                
                <div class="flex gap-4">
                    <a href="{{ route('users.index') }}" 
                       class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2">
                        <span class="text-lg">❌</span>
                        Hủy
                    </a>
                    <button type="submit" 
                            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center gap-2">
                        <span class="text-lg">💾</span>
                        Cập nhật người dùng
                    </button>
                </div>
            </div>
        </form>
    </div>

    <!-- User Info Card -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-xl">📊</span>
            Thông tin bổ sung
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600">ID người dùng</p>
                <p class="text-lg font-bold text-gray-900">#{{ $user->id }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600">Ngày tạo</p>
                <p class="text-lg font-bold text-gray-900">{{ $user->created_at ? $user->created_at->format('d/m/Y H:i') : 'Chưa có' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600">Cập nhật lần cuối</p>
                <p class="text-lg font-bold text-gray-900">{{ $user->updated_at ? $user->updated_at->format('d/m/Y H:i') : 'Chưa có' }}</p>
            </div>
        </div>
    </div>
</div>

<script>
// Form validation and UX improvements
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add focus animations
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('scale-105');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('scale-105');
        });
    });
    
    // Password validation
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('password_confirmation');
    
    function validatePassword() {
        if (password.value && passwordConfirmation.value) {
            if (password.value !== passwordConfirmation.value) {
                passwordConfirmation.setCustomValidity('Mật khẩu xác nhận không khớp');
            } else {
                passwordConfirmation.setCustomValidity('');
            }
        }
    }
    
    password.addEventListener('input', validatePassword);
    passwordConfirmation.addEventListener('input', validatePassword);
    
    // Form submission confirmation
    form.addEventListener('submit', function(e) {
        const hasPasswordChange = password.value.length > 0;
        if (hasPasswordChange) {
            if (!confirm('Bạn có chắc muốn thay đổi mật khẩu của người dùng này không?')) {
                e.preventDefault();
                return false;
            }
        }
    });
});
</script>
@endsection
