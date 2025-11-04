@extends('Admins.app')

@section('title', 'Thêm người dùng mới')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Thêm người dùng mới</h1>
            <p class="text-gray-600 mt-1">Tạo tài khoản người dùng mới cho hệ thống</p>
        </div>
        <a href="{{ route('users.index') }}"
           class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
            <span class="text-xl">←</span>
            Quay lại
        </a>
    </div>

    <!-- Main form -->
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="px-8 py-6 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
            <div class="absolute inset-0 bg-linear-to-r from-emerald-400/20 to-teal-400/20"></div>
            <div class="relative z-10">
                <h2 class="text-2xl font-bold text-white">Thông tin người dùng</h2>
                <p class="text-emerald-100 mt-1">Điền đầy đủ thông tin để tạo tài khoản mới</p>
            </div>
        </div>

        <!-- Form -->
        <div class="p-8">
            @if ($errors->any())
                <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <span class="text-red-400 text-xl">⚠️</span>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">
                                Có lỗi xảy ra:
                            </h3>
                            <div class="mt-2 text-sm text-red-700">
                                <ul class="list-disc list-inside space-y-1">
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            @endif

            @if (session('success'))
                <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <span class="text-green-400 text-xl">✅</span>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">
                                {{ session('success') }}
                            </p>
                        </div>
                    </div>
                </div>
            @endif

            <form action="{{ route('users.store') }}" method="POST" class="space-y-6">
                @csrf

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Họ và tên -->
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên <span class="text-red-500">*</span>
                        </label>
                        <input type="text"
                               id="name"
                               name="name"
                               value="{{ old('name') }}"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 @error('name') border-red-500 @enderror"
                               placeholder="Nhập họ và tên"
                               required>
                        @error('name')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                            Email <span class="text-red-500">*</span>
                        </label>
                        <input type="email"
                               id="email"
                               name="email"
                               value="{{ old('email') }}"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 @error('email') border-red-500 @enderror"
                               placeholder="Nhập địa chỉ email"
                               required>
                        @error('email')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Mật khẩu -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu <span class="text-red-500">*</span>
                        </label>
                        <input type="password"
                               id="password"
                               name="password"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 @error('password') border-red-500 @enderror"
                               placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                               required>
                        @error('password')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Xác nhận mật khẩu -->
                    <div>
                        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu <span class="text-red-500">*</span>
                        </label>
                        <input type="password"
                               id="password_confirmation"
                               name="password_confirmation"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300"
                               placeholder="Nhập lại mật khẩu"
                               required>
                    </div>

                    <!-- Số điện thoại -->
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                        </label>
                        <input type="tel"
                               id="phone"
                               name="phone"
                               value="{{ old('phone') }}"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 @error('phone') border-red-500 @enderror"
                               placeholder="Nhập số điện thoại">
                        @error('phone')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Vai trò -->
                    <div>
                        <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                            Vai trò
                        </label>
                        <select id="role"
                                name="role"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 @error('role') border-red-500 @enderror">
                            <option value="user" {{ old('role') == 'user' ? 'selected' : '' }}>Người dùng</option>
                            <option value="moderator" {{ old('role') == 'moderator' ? 'selected' : '' }}>Kiểm duyệt viên</option>
                            <option value="admin" {{ old('role') == 'admin' ? 'selected' : '' }}>Quản trị viên</option>
                        </select>
                        @error('role')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                <!-- Địa chỉ -->
                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                    </label>
                    <textarea id="address"
                              name="address"
                              rows="3"
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 resize-none @error('address') border-red-500 @enderror"
                              placeholder="Nhập địa chỉ">{{ old('address') }}</textarea>
                    @error('address')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Buttons -->
                <div class="flex gap-4 pt-6 border-t border-gray-200">
                    <button type="button"
                            onclick="window.location.href='{{ route('users.index') }}'"
                            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
                        Hủy
                    </button>
                    <button type="submit"
                            class="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                        Tạo người dùng
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
