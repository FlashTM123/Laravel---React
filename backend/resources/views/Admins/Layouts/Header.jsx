import React, { useEffect, useRef, useState } from 'react';


const Header = ({ brand = 'Admin Panel', onToggleSidebar }) => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [userOpen, setUserOpen] = useState(false);
	const [notifications, setNotifications] = useState(2); // placeholder
	const userRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (userRef.current && !userRef.current.contains(e.target)) {
				setUserOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = async () => {
		// Try to use CSRF token from meta tag if available (Laravel default)
		const tokenMeta = document.querySelector('meta[name="csrf-token"]');
		const csrf = tokenMeta ? tokenMeta.getAttribute('content') : null;
		try {
			await fetch('/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
				},
				body: JSON.stringify({}),
			});
			window.location.href = '/login';
		} catch (err) {
			// fallback to GET logout link
			window.location.href = '/logout';
		}
	};

	return (
		<header className="bg-gradient-to-r from-indigo-900 to-purple-700 text-white shadow-lg">
			<div className="w-full px-0">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center space-x-4">
						{/* Sidebar toggle */}
						<button
							type="button"
							onClick={() => onToggleSidebar ? onToggleSidebar() : null}
							className="p-2 rounded-md hover:bg-gray-700 focus:outline-none"
							aria-label="Toggle sidebar"
						>
							<svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>

						<a href="#" className="flex items-center space-x-3 ml-0">
							<div className="h-11 w-11 rounded-lg bg-linear-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg ring-2 ring-white/20 transform transition-transform hover:-translate-y-1">A</div>
							<div>
								<div className="text-xl font-extrabold leading-none tracking-tight">{brand} <span className="ml-2 inline-block text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded">Pro</span></div>
								<div className="text-xs text-white/80">Administration • Analytics</div>
							</div>
						</a>

						{/* Primary nav (large screens) */}
						
					</div>

					{/* Right side */}
					<div className="flex items-center space-x-4">
						<div className="hidden md:block">
							<div className="relative">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/70">
									<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
									</svg>
								</span>
								<input
									type="search"
									placeholder="Search users, orders, reports..."
									className="block w-96 pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm transition"
								/>
							</div>
						</div>

						{/* Notifications */}
						<button
							type="button"
							className="relative p-2 rounded-md hover:bg-white/10 focus:outline-none transition"
							aria-label="Notifications"
						>
							<svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
							</svg>
							{notifications > 0 && (
								<span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full ring-2 ring-white animate-pulse">{notifications}</span>
							)}
						</button>

						{/* User */}
						<div className="relative" ref={userRef}>
							<button
								onClick={() => setUserOpen((s) => !s)}
								className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-700 focus:outline-none"
								aria-haspopup="true"
								aria-expanded={userOpen}
							>
								<img
									src="https://ui-avatars.com/api/?name=Admin&background=4c1d95&color=fff&rounded=true"
									alt="avatar"
									className="h-8 w-8 rounded-full"
								/>
								<div className="hidden sm:block text-sm text-gray-200">Admin</div>
								<svg className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
									<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
								</svg>
							</button>

							{userOpen && (
								<div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-50 z-20">
									<div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
										<a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" role="menuitem">Profile</a>
										<a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" role="menuitem">Settings</a>
										<button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Logout</button>
									</div>
								</div>
							)}
						</div>

						<div className="-mr-2 flex md:hidden">
							<button
								onClick={() => setMobileOpen((s) => !s)}
								className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700"
								aria-expanded={mobileOpen}
								aria-label="Toggle menu"
							>
								{mobileOpen ? (
									<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								) : (
									<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{mobileOpen && (
				<div className="md:hidden bg-gray-800">
					<div className="pt-2 pb-3 space-y-1 px-3">
						<a href="#" className="block px-4 py-2 text-base font-medium text-gray-200 hover:bg-gray-700">Dashboard</a>
						<a href="#" className="block px-4 py-2 text-base font-medium text-gray-200 hover:bg-gray-700">Users</a>
						<a href="#" className="block px-4 py-2 text-base font-medium text-gray-200 hover:bg-gray-700">Settings</a>
					</div>

					<div className="pt-4 pb-3 border-t border-gray-700 px-3">
						<div className="flex items-center">
							<div className="shrink-0">
								<img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Admin&background=4c1d95&color=fff&rounded=true" alt="Admin" />
							</div>
							<div className="ml-3">
								<div className="text-base font-medium text-gray-200">Admin</div>
								<div className="text-sm font-medium text-gray-400">admin@example.com</div>
							</div>
						</div>

						<div className="mt-3 space-y-1 px-2">
							<a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-gray-700">Profile</a>
							<a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-gray-700">Settings</a>
							<button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700">Logout</button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
