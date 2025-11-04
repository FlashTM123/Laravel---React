import React, { useState, useMemo } from 'react';

const Table = ({
	data = [],
	columns = [],
	title = "Bảng dữ liệu",
	searchable = true,
	sortable = true,
	pagination = true,
	itemsPerPage = 10,
	actions = [],
	onRowClick = null,
	loading = false,
	className = ""
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const [currentPage, setCurrentPage] = useState(1);

	// Search functionality
	const filteredData = useMemo(() => {
		if (!searchTerm) return data;

		return data.filter(item =>
			columns.some(column => {
				const value = item[column.key];
				return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
			})
		);
	}, [data, searchTerm, columns]);

	// Sort functionality
	const sortedData = useMemo(() => {
		if (!sortConfig.key) return filteredData;

		return [...filteredData].sort((a, b) => {
			const aValue = a[sortConfig.key];
			const bValue = b[sortConfig.key];

			if (aValue < bValue) {
				return sortConfig.direction === 'asc' ? -1 : 1;
			}
			if (aValue > bValue) {
				return sortConfig.direction === 'asc' ? 1 : -1;
			}
			return 0;
		});
	}, [filteredData, sortConfig]);

	// Pagination
	const totalPages = Math.ceil(sortedData.length / itemsPerPage);
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return sortedData.slice(startIndex, startIndex + itemsPerPage);
	}, [sortedData, currentPage, itemsPerPage]);

	const handleSort = (key) => {
		if (!sortable) return;

		setSortConfig(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
		}));
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const SortIcon = ({ column }) => {
		if (!sortable || !sortConfig.key || sortConfig.key !== column.key) {
			return (
				<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
				</svg>
			);
		}

		return sortConfig.direction === 'asc' ? (
			<svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
			</svg>
		) : (
			<svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
			</svg>
		);
	};

	const LoadingSpinner = () => (
		<div className="flex items-center justify-center py-8">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
			<span className="ml-2 text-gray-600">Đang tải...</span>
		</div>
	);

	const renderCellContent = (item, column) => {
		if (column.render) {
			return column.render(item[column.key], item);
		}

		const value = item[column.key];

		// Handle different data types
		if (column.type === 'date' && value) {
			return new Date(value).toLocaleDateString('vi-VN');
		}

		if (column.type === 'currency' && value) {
			return new Intl.NumberFormat('vi-VN', {
				style: 'currency',
				currency: 'VND'
			}).format(value);
		}

		if (column.type === 'badge' && value) {
			const badgeClass = column.badgeColors?.[value] || 'bg-gray-100 text-gray-800';
			return (
				<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
					{value}
				</span>
			);
		}

		return value || '-';
	};

	return (
		<div className={`bg-linear-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl border border-slate-200/50 ${className}`}>
			{/* Header */}
			<div className="px-8 py-6 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-white/10">
					<div className="absolute inset-0" style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
						backgroundSize: '20px 20px'
					}}></div>
				</div>

				{/* Floating Elements */}
				<div className="absolute top-2 right-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
				<div className="absolute -top-4 right-20 w-20 h-20 bg-cyan-300/20 rounded-full blur-lg"></div>

				<div className="relative flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<div>
							<h2 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h2>
							<p className="text-emerald-100 text-sm">Quản lý và theo dõi dữ liệu</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						{searchable && (
							<div className="relative group">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-white/70 group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
								<input
									type="text"
									placeholder="Tìm kiếm dữ liệu..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="block w-72 pl-12 pr-4 py-3 border-0 rounded-xl bg-white/15 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all duration-200 shadow-lg"
								/>
							</div>
						)}
						<div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
							<span className="text-white font-medium text-sm">
								{filteredData.length} kết quả
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				{loading ? (
					<LoadingSpinner />
				) : (
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{columns.map((column) => (
									<th
										key={column.key}
										onClick={() => handleSort(column.key)}
										className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
											sortable ? 'cursor-pointer hover:bg-gray-100' : ''
										}`}
									>
										<div className="flex items-center space-x-1">
											<span>{column.title}</span>
											{sortable && <SortIcon column={column} />}
										</div>
									</th>
								))}
								{actions.length > 0 && (
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Thao tác
									</th>
								)}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{paginatedData.length === 0 ? (
								<tr>
									<td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
										<div className="flex flex-col items-center">
											<svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											<p className="text-gray-500 text-lg">Không có dữ liệu</p>
											<p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc thêm dữ liệu mới</p>
										</div>
									</td>
								</tr>
							) : (
								paginatedData.map((item, index) => (
									<tr
										key={item.id || index}
										onClick={() => onRowClick && onRowClick(item)}
										className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
									>
										{columns.map((column) => (
											<td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{renderCellContent(item, column)}
											</td>
										))}
										{actions.length > 0 && (
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<div className="flex items-center justify-end space-x-2">
													{actions.map((action, actionIndex) => (
														<button
															key={actionIndex}
															onClick={(e) => {
																e.stopPropagation();
																action.onClick(item);
															}}
															className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors ${
																action.variant === 'danger'
																	? 'bg-red-100 text-red-700 hover:bg-red-200'
																	: action.variant === 'warning'
																	? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
																	: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
															}`}
															title={action.title}
														>
															{action.icon && (
																<span className="mr-1">{action.icon}</span>
															)}
															{action.label}
														</button>
													))}
												</div>
											</td>
										)}
									</tr>
								))
							)}
						</tbody>
					</table>
				)}
			</div>

			{/* Pagination */}
			{pagination && totalPages > 1 && (
				<div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-700">
							Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{' '}
							{Math.min(currentPage * itemsPerPage, sortedData.length)} trong tổng số{' '}
							{sortedData.length} kết quả
						</div>
						<div className="flex items-center space-x-2">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Trước
							</button>

							{/* Page numbers */}
							<div className="flex items-center space-x-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									let pageNum;
									if (totalPages <= 5) {
										pageNum = i + 1;
									} else if (currentPage <= 3) {
										pageNum = i + 1;
									} else if (currentPage >= totalPages - 2) {
										pageNum = totalPages - 4 + i;
									} else {
										pageNum = currentPage - 2 + i;
									}

									return (
										<button
											key={pageNum}
											onClick={() => handlePageChange(pageNum)}
											className={`px-3 py-1 text-sm rounded-md ${
												currentPage === pageNum
													? 'bg-indigo-600 text-white'
													: 'bg-white border border-gray-300 hover:bg-gray-50'
											}`}
										>
											{pageNum}
										</button>
									);
								})}
							</div>

							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Sau
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Table;
