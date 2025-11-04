import React, { useState } from 'react';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		remember: false
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Email là bắt buộc';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email không hợp lệ';
		}

		if (!formData.password) {
			newErrors.password = 'Mật khẩu là bắt buộc';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			// Get CSRF token
			const tokenMeta = document.querySelector('meta[name="csrf-token"]');
			const csrf = tokenMeta ? tokenMeta.getAttribute('content') : null;

			const response = await fetch('/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					remember: formData.remember
				})
			});

			const data = await response.json();

			if (response.ok) {
				// Redirect to dashboard on success
				window.location.href = '/admin/dashboard';
			} else {
				// Handle validation errors
				if (data.errors) {
					setErrors(data.errors);
				} else {
					setErrors({ general: data.message || 'Đăng nhập thất bại' });
				}
			}
		} catch (error) {
			setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
			{/* Background pattern */}
			<div className="absolute inset-0 bg-black/20"></div>
			<div className="absolute inset-0 opacity-50" style={{
				backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
			}}></div>

			<div className="relative w-full max-w-md">
				{/* Login Card */}
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="mx-auto w-16 h-16 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
							<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<h1 className="text-3xl font-bold text-white mb-2">Đăng nhập</h1>
						<p className="text-white/70">Chào mừng trở lại hệ thống quản trị</p>
					</div>

					{/* Error message */}
					{errors.general && (
						<div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
							<p className="text-red-200 text-sm">{errors.general}</p>
						</div>
					)}

					{/* Login Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								</div>
								<input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-white/10 border ${
										errors.email ? 'border-red-400' : 'border-white/20'
									} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition`}
									placeholder="admin@example.com"
								/>
							</div>
							{errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
								Mật khẩu
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={handleChange}
									className={`block w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border ${
										errors.password ? 'border-red-400' : 'border-white/20'
									} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition`}
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
										</svg>
									) : (
										<svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
							{errors.password && <p className="mt-1 text-sm text-red-300">{errors.password}</p>}
						</div>

						{/* Remember me & Forgot password */}
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember"
									name="remember"
									type="checkbox"
									checked={formData.remember}
									onChange={handleChange}
									className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-white/30 rounded bg-white/10"
								/>
								<label htmlFor="remember" className="ml-2 block text-sm text-white/70">
									Ghi nhớ đăng nhập
								</label>
							</div>
							
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02] active:scale-[0.98]"
						>
							{isLoading ? (
								<>
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Đang đăng nhập...
								</>
							) : (
								'Đăng nhập'
							)}
						</button>
					</form>

					{/* Footer */}
					<div className="mt-8 text-center">
						<p className="text-white/50 text-sm">
							© 2025 Admin Panel. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
