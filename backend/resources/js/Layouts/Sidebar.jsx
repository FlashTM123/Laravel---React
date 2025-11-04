import React, { useState, useEffect } from 'react';

const Sidebar = ({ active, counts = {}, theme = 'indigo' }) => {
	const [currentPath, setCurrentPath] = useState('');

	useEffect(() => {
		// Get current path and update state
		setCurrentPath(window.location.pathname);

		// Listen for navigation changes
		const handleLocationChange = () => {
			setCurrentPath(window.location.pathname);
		};

		window.addEventListener('popstate', handleLocationChange);
		return () => window.removeEventListener('popstate', handleLocationChange);
	}, []);

	// counts may include: users, customers, products, categories, brands, orders
	const items = [
		{ key: 'dashboard', label: 'Thống kê', href: '/dashboard', icon: 'chart' },
		{ key: 'users', label: 'Quản lý người dùng', href: '/users', icon: 'users', countKey: 'users' },
		{ key: 'customers', label: 'Quản lý khách hàng', href: '/Admins/Customers', icon: 'customers', countKey: 'customers' },
		{ key: 'products', label: 'Quản lý sản phẩm', href: '/Admins/Products', icon: 'box', countKey: 'products' },
		{ key: 'categories', label: 'Quản lý danh mục', href: '/Admins/Categories', icon: 'tag', countKey: 'categories' },
		{ key: 'brands', label: 'Quản lý thương hiệu', href: '/Admins/Brands', icon: 'badge', countKey: 'brands' },
		{ key: 'orders', label: 'Quản lý đơn hàng', href: '/admin/orders', icon: 'order', countKey: 'orders' },
	];

	const Icon = ({ name }) => {
		switch (name) {
			case 'chart':
				return (
					<svg className="h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3m0 8v8m-4-4v4m8-8v8M3 21h18" />
					</svg>
				);
			case 'users':
				return (
					<svg className="h-5 w-5 text-white/90" viewBox="0 0 20 20" fill="currentColor">
						<path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM2 14s1-2 6-2 6 2 6 2v1H2v-1z" />
					</svg>
				);
			case 'customers':
				return (
					<svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V8a2 2 0 00-2-2h-3M2 20h5V4H4a2 2 0 00-2 2v14z" />
					</svg>
				);
			case 'box':
				return (
					<svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7" />
					</svg>
				);
			case 'tag':
				return (
					<svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l10 10M5 12l6-6 6 6" />
					</svg>
				);
			case 'badge':
				return (
					<svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 7h7l-5 4 2 7-7-4-7 4 2-7-5-4h7z" />
					</svg>
				);
			case 'order':
				return (
					<svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v4H3V3zm0 8h18v10H3V11z" />
					</svg>
				);
			default:
				return null;
		}
	};

	const themes = {
		indigo: {
			gradient: 'bg-linear-to-r from-indigo-900 to-purple-700',
			logoBg: 'bg-white/10',
		},
		emerald: {
			gradient: 'bg-linear-to-r from-emerald-900 to-emerald-600',
			logoBg: 'bg-white/10',
		},
		cyan: {
			gradient: 'bg-linear-to-r from-cyan-900 to-sky-600',
			logoBg: 'bg-white/10',
		},
		rose: {
			gradient: 'bg-linear-to-r from-rose-900 to-orange-500',
			logoBg: 'bg-white/10',
		},
	};

	const themeClasses = themes[theme] || themes.indigo;

	return (
		<aside className={`min-h-screen w-64 ${themeClasses.gradient} text-white shadow-xl hidden md:block`}>
			<div className="px-4 py-6">


				<nav className="space-y-1">
					{items.map((it) => {
						// Check if current path matches this item's href or if explicitly set as active
						const isActive = active === it.key || currentPath === it.href || currentPath.startsWith(it.href + '/');

						return (
							<a
								href={it.href}
								key={it.key}
								className={`flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 ${
									isActive
										? 'bg-white/20 ring-1 ring-white/30 shadow-lg transform scale-[1.02]'
										: 'hover:bg-white/10 hover:transform hover:scale-[1.01]'
								}`}
								onClick={(e) => {
									// Update current path immediately for better UX
									setCurrentPath(it.href);
								}}
							>
								<div className="flex items-center space-x-3">
									<div className="w-6 flex items-center justify-center">
										<Icon name={it.icon} />
									</div>
									<div className={`text-sm font-medium ${isActive ? 'text-white font-semibold' : 'text-white/95'}`}>
										{it.label}
									</div>
								</div>
								{it.countKey && (
									<span className={`ml-3 inline-flex items-center justify-center min-w-[34px] px-2 py-0.5 rounded-full text-xs font-semibold ${
										isActive ? 'bg-white/30 text-white' : 'bg-white/10 text-white/90'
									}`}>
										{counts[it.countKey] ?? 0}
									</span>
								)}
							</a>
						);
					})}
				</nav>
			</div>
			{/* Footer quick links */}

		</aside>
	);
};

export default Sidebar;

