import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState('dashboard')
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [contacts, setContacts] = useState([])
    const [auditLogs, setAuditLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    // Search states
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('')

    // Bulk selection states
    const [selectedItems, setSelectedItems] = useState([])
    const [selectAll, setSelectAll] = useState(false)

    // Product Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isEditingProduct, setIsEditingProduct] = useState(false)
    const [editingProductId, setEditingProductId] = useState(null)
    const [productForm, setProductForm] = useState({
        idClient: '',
        title: '',
        description: '',
        price: '',
        oldPrice: '',
        badge: '',
        features: '',
        image: '',
        quantity: 0,
        inStock: true,
        category: ''
    })

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'products', label: 'Sản phẩm', icon: '📦' },
        { id: 'orders', label: 'Đơn hàng', icon: '🛒' },
        { id: 'users', label: 'Người dùng', icon: '👥' },
        { id: 'contacts', label: 'Liên hệ', icon: '✉️' },
        { id: 'audit', label: 'Audit Logs', icon: '📋' },
    ]

    const fetchData = async (endpoint, setter, page = 1, search = '', filters = {}) => {
        setLoading(true)
        setError('')
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search
            })

            // Add filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value)
            })

            const response = await fetch(`${endpoint}?${params}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('API Response:', endpoint, data) // Debug log

            // Handle different response structures
            if (data.products) setter(data.products)
            else if (data.orders) setter(data.orders)
            else if (data.users) setter(data.users)
            else if (data.contacts) setter(data.contacts)
            else if (data.logs) setter(data.logs)
            else setter(data)

            setTotalPages(data.pagination?.totalPages || 1)
            setTotalItems(data.pagination?.totalItems || data.length || 0)
        } catch (error) {
            console.error('Error fetching data:', error)
            setError(error.message || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    // Load dashboard statistics when component mounts or when dashboard tab is active
    useEffect(() => {
        if (activeTab === 'dashboard') {
            loadDashboardStats()
        }
    }, [activeTab])

    const loadDashboardStats = async () => {
        setLoading(true)
        setError('')
        try {
            // Load all data for dashboard statistics
            const [productsRes, ordersRes, usersRes, contactsRes] = await Promise.all([
                fetch(`${API_ENDPOINTS.adminProducts}?limit=1000`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('mangorush_token')}` }
                }),
                fetch(`${API_ENDPOINTS.adminOrders}?limit=1000`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('mangorush_token')}` }
                }),
                fetch(`${API_ENDPOINTS.adminUsers}?limit=1000`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('mangorush_token')}` }
                }),
                fetch(API_ENDPOINTS.adminContacts, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('mangorush_token')}` }
                })
            ])

            const [productsData, ordersData, usersData, contactsData] = await Promise.all([
                productsRes.json(),
                ordersRes.json(),
                usersRes.json(),
                contactsRes.json()
            ])

            console.log('Dashboard data:', { productsData, ordersData, usersData, contactsData }) // Debug log

            if (productsRes.ok && productsData.products) setProducts(productsData.products)
            if (ordersRes.ok && ordersData.orders) setOrders(ordersData.orders)
            if (usersRes.ok && usersData.users) setUsers(usersData.users)
            if (contactsRes.ok) setContacts(contactsData)

        } catch (error) {
            console.error('Error loading dashboard stats:', error)
            setError('Failed to load dashboard statistics')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setCurrentPage(1)
        setSearchTerm('')
        setStatusFilter('')
        setRoleFilter('')
        setSelectedItems([])
        setSelectAll(false)

        if (activeTab === 'products') {
            fetchData(API_ENDPOINTS.adminProducts, setProducts, 1, '', {})
        } else if (activeTab === 'orders') {
            fetchData(API_ENDPOINTS.adminOrders, setOrders, 1, '', { status: statusFilter })
        } else if (activeTab === 'users') {
            fetchData(API_ENDPOINTS.adminUsers, setUsers, 1, '', { role: roleFilter })
        } else if (activeTab === 'contacts') {
            fetchData(API_ENDPOINTS.adminContacts, setContacts, 1, '', {})
        } else if (activeTab === 'audit') {
            fetchData(API_ENDPOINTS.adminAuditLogs, setAuditLogs, 1, '', {})
        }
    }, [activeTab])

    // Effect for search and filters
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filters = {}
            if (activeTab === 'orders' && statusFilter) filters.status = statusFilter
            if (activeTab === 'users' && roleFilter) filters.role = roleFilter

            if (activeTab === 'products') {
                fetchData(API_ENDPOINTS.adminProducts, setProducts, currentPage, searchTerm, filters)
            } else if (activeTab === 'orders') {
                fetchData(API_ENDPOINTS.adminOrders, setOrders, currentPage, searchTerm, filters)
            } else if (activeTab === 'users') {
                fetchData(API_ENDPOINTS.adminUsers, setUsers, currentPage, searchTerm, filters)
            } else if (activeTab === 'contacts') {
                fetchData(API_ENDPOINTS.adminContacts, setContacts, currentPage, searchTerm, filters)
            } else if (activeTab === 'audit') {
                fetchData(API_ENDPOINTS.adminAuditLogs, setAuditLogs, currentPage, searchTerm, filters)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [currentPage, searchTerm, statusFilter, roleFilter])

    const confirmAction = (message) => {
        return window.confirm(message)
    }

    const showToast = (message, type = 'info') => {
        // Simple toast implementation
        alert(`${type.toUpperCase()}: ${message}`)
    }

    const handleBulkAction = async (action, endpoint, data) => {
        if (selectedItems.length === 0) {
            showToast('Vui lòng chọn ít nhất một mục', 'warning')
            return
        }

        const confirmed = confirmAction(`Bạn có chắc muốn ${action} ${selectedItems.length} mục đã chọn?`)
        if (!confirmed) return

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                showToast(`Đã ${action} thành công ${selectedItems.length} mục`, 'success')
                setSelectedItems([])
                setSelectAll(false)
                // Refresh data
                window.location.reload()
            } else {
                throw new Error('Operation failed')
            }
        } catch (error) {
            showToast(`Lỗi: ${error.message}`, 'error')
        }
    }

    const handleExport = async (endpoint, filename) => {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                }
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = filename
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
                showToast('Export thành công', 'success')
            } else {
                throw new Error('Export failed')
            }
        } catch (error) {
            showToast(`Lỗi export: ${error.message}`, 'error')
        }
    }

    const handleSelectAll = (items) => {
        if (selectAll) {
            setSelectedItems([])
        } else {
            setSelectedItems(items.map(item => item._id))
        }
        setSelectAll(!selectAll)
    }

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    // Product CRUD handlers
    const handleOpenAddModal = () => {
        setIsEditingProduct(false)
        setEditingProductId(null)
        setProductForm({
            idClient: '',
            title: '',
            description: '',
            price: '',
            oldPrice: '',
            badge: '',
            features: '',
            image: '',
            quantity: 0,
            inStock: true,
            category: ''
        })
        setIsProductModalOpen(true)
    }

    const handleOpenEditModal = (product) => {
        setIsEditingProduct(true)
        setEditingProductId(product._id)
        setProductForm({
            idClient: product.idClient || '',
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            oldPrice: product.oldPrice || '',
            badge: product.badge || '',
            features: Array.isArray(product.features) ? product.features.join(', ') : '',
            image: product.image || '',
            quantity: typeof product.quantity === 'number' ? product.quantity : 0,
            inStock: product.inStock !== undefined ? product.inStock : true,
            category: product.category || ''
        })
        setIsProductModalOpen(true)
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('mangorush_token')
            const method = isEditingProduct ? 'PUT' : 'POST'
            const endpoint = isEditingProduct
                ? `${API_ENDPOINTS.adminProducts}/${editingProductId}`
                : API_ENDPOINTS.adminProducts

            // Process features string to array
            const formattedData = {
                ...productForm,
                features: productForm.features.split(',').map(f => f.trim()).filter(f => f !== '')
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formattedData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Không thể lưu sản phẩm')
            }

            // Success
            showToast(isEditingProduct ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công', 'success')
            setIsProductModalOpen(false)
            // Refresh data
            fetchData(API_ENDPOINTS.adminProducts, setProducts, currentPage, searchTerm, {})
        } catch (error) {
            setError(error.message)
            showToast(error.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const deleteProduct = async (productId) => {
        const confirmed = confirmAction('Bạn có chắc muốn xóa sản phẩm này?')
        if (!confirmed) return

        setLoading(true)
        try {
            const token = localStorage.getItem('mangorush_token')
            const response = await fetch(`${API_ENDPOINTS.adminProducts}/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                showToast('Xóa sản phẩm thành công', 'success')
                setProducts(products.filter(p => p._id !== productId))
            } else {
                const data = await response.json()
                throw new Error(data.message || 'Xóa thất bại')
            }
        } catch (error) {
            showToast(error.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        const confirmed = confirmAction(`Bạn có chắc muốn cập nhật trạng thái đơn hàng thành "${status}"?`)
        if (!confirmed) return

        try {
            const response = await fetch(`${API_ENDPOINTS.adminOrders}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                },
                body: JSON.stringify({ status })
            })
            if (response.ok) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status } : order
                ))
                showToast('Cập nhật trạng thái thành công', 'success')
            } else {
                throw new Error('Update failed')
            }
        } catch (error) {
            console.error('Error updating order:', error)
            showToast('Lỗi cập nhật trạng thái', 'error')
        }
    }

    const updateUserRole = async (userId, role) => {
        const confirmed = confirmAction(`Bạn có chắc muốn thay đổi vai trò thành "${role}"?`)
        if (!confirmed) return

        try {
            const response = await fetch(`${API_ENDPOINTS.adminUsers}/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                },
                body: JSON.stringify({ role })
            })
            if (response.ok) {
                setUsers(users.map(u =>
                    u._id === userId ? { ...u, role } : u
                ))
                showToast('Cập nhật vai trò thành công', 'success')
            } else {
                throw new Error('Update failed')
            }
        } catch (error) {
            console.error('Error updating user role:', error)
            showToast('Lỗi cập nhật vai trò', 'error')
        }
    }

    const deleteOrder = async (orderId) => {
        const confirmed = confirmAction('Bạn có chắc muốn xóa đơn hàng này?')
        if (!confirmed) return

        try {
            const response = await fetch(`${API_ENDPOINTS.adminOrders}/${orderId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                }
            })
            if (response.ok) {
                setOrders(orders.filter(order => order._id !== orderId))
                showToast('Xóa đơn hàng thành công', 'success')
            } else {
                throw new Error('Delete failed')
            }
        } catch (error) {
            console.error('Error deleting order:', error)
            showToast('Lỗi xóa đơn hàng', 'error')
        }
    }

    const deleteUser = async (userId) => {
        const confirmed = confirmAction('Bạn có chắc muốn xóa người dùng này?')
        if (!confirmed) return

        try {
            const response = await fetch(`${API_ENDPOINTS.adminUsers}/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                }
            })
            if (response.ok) {
                setUsers(users.filter(u => u._id !== userId))
                showToast('Xóa người dùng thành công', 'success')
            } else {
                throw new Error('Delete failed')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            showToast('Lỗi xóa người dùng', 'error')
        }
    }

    const deleteContact = async (contactId) => {
        const confirmed = confirmAction('Bạn có chắc muốn xóa tin nhắn này?')
        if (!confirmed) return

        try {
            const response = await fetch(`${API_ENDPOINTS.adminContacts}/${contactId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                }
            })
            if (response.ok) {
                setContacts(contacts.filter(c => c._id !== contactId))
                showToast('Xóa tin nhắn thành công', 'success')
            } else {
                throw new Error('Delete failed')
            }
        } catch (error) {
            console.error('Error deleting contact:', error)
            showToast('Lỗi xóa tin nhắn', 'error')
        }
    }

    const toggleContactRead = async (contactId, isRead) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.adminContacts}/${contactId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('mangorush_token')}`
                },
                body: JSON.stringify({ isRead: !isRead })
            })
            if (response.ok) {
                setContacts(contacts.map(c =>
                    c._id === contactId ? { ...c, isRead: !isRead } : c
                ))
                showToast(isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc', 'success')
            } else {
                throw new Error('Update failed')
            }
        } catch (error) {
            console.error('Error updating contact:', error)
            showToast('Lỗi cập nhật trạng thái', 'error')
        }
    }

    const handleLogout = () => {
        logout()
    }

    const getStatusClass = (status) => {
        const statusMap = {
            'Pending': 'status-pending',
            'Processing': 'status-processing',
            'Shipped': 'status-shipped',
            'Delivered': 'status-delivered',
        }
        return statusMap[status] || ''
    }

    const unreadContacts = contacts.filter(c => !c.isRead).length
    const pendingOrders = orders.filter(o => o.status === 'Pending').length

    const revenueOrders = orders.filter(o => o.status !== 'Cancelled')
    const totalRevenue = revenueOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0)
    const totalSoldItems = revenueOrders.reduce((sum, order) => sum + (order.items?.reduce((itemSum, item) => itemSum + (Number(item.quantity) || 0), 0) || 0), 0)

    const productSalesMap = revenueOrders.reduce((acc, order) => {
        (order.items || []).forEach((item) => {
            const productKey = item.idClient || item.title || 'unknown'
            const title = item.title || 'Unknown product'
            const quantity = Number(item.quantity) || 0
            const revenue = (Number(item.price) || 0) * quantity

            if (!acc[productKey]) {
                acc[productKey] = {
                    idClient: item.idClient,
                    title,
                    quantity: 0,
                    revenue: 0
                }
            }
            acc[productKey].quantity += quantity
            acc[productKey].revenue += revenue
        })
        return acc
    }, {})

    const bestSellingProducts = Object.values(productSalesMap)
        .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
        .slice(0, 5)

    if (user?.role !== 'admin') {
        return (
            <div className="admin-access-denied">
                <div className="access-denied-content">
                    <h1>🚫 Access Denied</h1>
                    <p>Bạn không có quyền truy cập trang quản trị.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>🟢 InnoGreenLife</h2>
                    <p>Admin Panel</p>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {item.id === 'orders' && pendingOrders > 0 && (
                                <span className="badge">{pendingOrders}</span>
                            )}
                            {item.id === 'contacts' && unreadContacts > 0 && (
                                <span className="badge">{unreadContacts}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <span>👤 {user?.name}</span>
                    </div>
                    <div className="sidebar-actions">
                        <button onClick={() => window.location.href = '/'} className="back-to-store-btn">
                            🏪 Quay lại cửa hàng
                        </button>
                        <button onClick={handleLogout} className="logout-btn">
                            🚪 Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>
                        {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
                    </h1>
                </header>

                <div className="admin-content">
                    {error && <div className="error-message">{error}</div>}
                    {loading && <div className="loading">Đang tải...</div>}

                    {/* Search and Filter Controls */}
                    {activeTab !== 'dashboard' && activeTab !== 'audit' && (
                        <div className="controls-bar">
                            <div className="search-controls">
                                <input
                                    type="text"
                                    placeholder={`Tìm kiếm ${activeTab}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                {activeTab === 'orders' && (
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="Pending">Chờ xử lý</option>
                                        <option value="Processing">Đang xử lý</option>
                                        <option value="Shipped">Đang giao</option>
                                        <option value="Delivered">Đã giao</option>
                                    </select>
                                )}
                                {activeTab === 'users' && (
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="">Tất cả vai trò</option>
                                        <option value="customer">Khách hàng</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                )}
                            </div>
                            <div className="action-controls">
                                {selectedItems.length > 0 && (
                                    <div className="bulk-actions">
                                        <span>{selectedItems.length} mục đã chọn</span>
                                        {activeTab === 'orders' && (
                                            <button
                                                onClick={() => handleBulkAction('cập nhật trạng thái', API_ENDPOINTS.adminBulkUpdateOrders, { orderIds: selectedItems, status: 'Processing' })}
                                                className="bulk-btn"
                                            >
                                                Cập nhật trạng thái
                                            </button>
                                        )}
                                        {activeTab === 'products' && (
                                            <button
                                                onClick={() => handleBulkAction('xóa', API_ENDPOINTS.adminBulkDeleteProducts, { productIds: selectedItems })}
                                                className="bulk-btn delete"
                                            >
                                                Xóa sản phẩm
                                            </button>
                                        )}
                                        {activeTab === 'users' && (
                                            <button
                                                onClick={() => handleBulkAction('cập nhật vai trò', API_ENDPOINTS.adminBulkUpdateUsers, { userIds: selectedItems, role: 'customer' })}
                                                className="bulk-btn"
                                            >
                                                Cập nhật vai trò
                                            </button>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'products' && (
                                    <button
                                        onClick={handleOpenAddModal}
                                        className="add-btn"
                                    >
                                        ➕ Thêm sản phẩm
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (activeTab === 'products') handleExport(API_ENDPOINTS.adminExportProducts, 'products.csv')
                                        if (activeTab === 'orders') handleExport(API_ENDPOINTS.adminExportOrders, 'orders.csv')
                                        if (activeTab === 'users') handleExport(API_ENDPOINTS.adminExportUsers, 'users.csv')
                                    }}
                                    className="export-btn"
                                >
                                    📊 Export CSV
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="page-btn"
                            >
                                ‹ Trước
                            </button>
                            <span className="page-info">
                                Trang {currentPage} / {totalPages} ({totalItems} mục)
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="page-btn"
                            >
                                Sau ›
                            </button>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <>
                            <div className="dashboard-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">📦</div>
                                    <div className="stat-info">
                                        <h3>{products.length}</h3>
                                        <p>Tổng sản phẩm</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🛒</div>
                                    <div className="stat-info">
                                        <h3>{orders.length}</h3>
                                        <p>Tổng đơn hàng</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <h3>{users.length}</h3>
                                        <p>Tổng người dùng</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">✉️</div>
                                    <div className="stat-info">
                                        <h3>{contacts.length}</h3>
                                        <p>Tin nhắn liên hệ</p>
                                    </div>
                                </div>
                                <div className="stat-card pending">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>{pendingOrders}</h3>
                                        <p>Đơn chờ xử lý</p>
                                    </div>
                                </div>
                                <div className="stat-card unread">
                                    <div className="stat-icon">📩</div>
                                    <div className="stat-info">
                                        <h3>{unreadContacts}</h3>
                                        <p>Tin chưa đọc</p>
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-analytics">
                                <div className="analytics-card revenue-card">
                                    <div className="analytics-title">Tổng doanh thu</div>
                                    <div className="analytics-value">{totalRevenue.toLocaleString('vi-VN')} VNĐ</div>
                                    <div className="analytics-subtitle">Không tính đơn hủy</div>
                                </div>
                                <div className="analytics-card sold-card">
                                    <div className="analytics-title">Số lượng đã bán</div>
                                    <div className="analytics-value">{totalSoldItems}</div>
                                    <div className="analytics-subtitle">Sản phẩm bán ra</div>
                                </div>
                                <div className="analytics-card top-products-card">
                                    <div className="analytics-title">Top sản phẩm ưa chuộng</div>
                                    <ol className="top-products-list">
                                        {bestSellingProducts.length === 0 ? (
                                            <li>Chưa có dữ liệu</li>
                                        ) : (
                                            bestSellingProducts.map((product) => (
                                                <li key={product.idClient || product.title}>
                                                    <strong>{product.title}</strong> — {product.quantity} bán ra
                                                </li>
                                            ))
                                        )}
                                    </ol>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'products' && (
                        <div className="data-section">
                            <div className="section-header">
                                <h2>Quản lý sản phẩm</h2>
                                <span className="count">{products.length} sản phẩm</span>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={() => handleSelectAll(products)}
                                                />
                                            </th>
                                            <th>STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Giá</th>
                                            <th>Số lượng</th>
                                            <th>Trạng thái</th>
                                            <th>Danh mục</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(product._id)}
                                                        onChange={() => handleSelectItem(product._id)}
                                                    />
                                                </td>
                                                <td>{(currentPage - 1) * 20 + index + 1}</td>
                                                <td className="product-name">{product.title}</td>
                                                <td>{product.price?.toLocaleString()} VNĐ</td>
                                                <td>{typeof product.quantity === 'number' ? product.quantity : '-'}</td>
                                                <td>
                                                    <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                                                    </span>
                                                </td>
                                                <td>{product.category || '-'}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => handleOpenEditModal(product)}
                                                            className="edit-btn"
                                                        >
                                                            ✏️ Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(product._id)}
                                                            className="delete-btn"
                                                        >
                                                            🗑️ Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="data-section">
                            <div className="section-header">
                                <h2>Quản lý đơn hàng</h2>
                                <span className="count">{orders.length} đơn hàng</span>
                            </div>
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <h3>Đơn hàng #{order._id.slice(-6)}</h3>
                                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="order-details">
                                            <div className="detail-row">
                                                <span className="label">Khách hàng:</span>
                                                <span className="value">{order.customerDetail?.name || '-'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Email:</span>
                                                <span className="value">{order.customerDetail?.email || '-'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Điện thoại:</span>
                                                <span className="value">{order.customerDetail?.phone || '-'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Địa chỉ:</span>
                                                <span className="value">{order.customerDetail?.address || '-'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Tổng tiền:</span>
                                                <span className="value total">{order.totalAmount?.toLocaleString()} VNĐ</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Thanh toán:</span>
                                                <span className="value">{order.paymentMethod}</span>
                                            </div>
                                        </div>
                                        <div className="order-actions">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="Pending">Chờ xử lý</option>
                                                <option value="Processing">Đang xử lý</option>
                                                <option value="Shipped">Đang giao</option>
                                                <option value="Delivered">Đã giao</option>
                                            </select>
                                            <button
                                                onClick={() => deleteOrder(order._id)}
                                                className="delete-btn"
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="data-section">
                            <div className="section-header">
                                <h2>Quản lý người dùng</h2>
                                <span className="count">{users.length} người dùng</span>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên</th>
                                            <th>Email</th>
                                            <th>Vai trò</th>
                                            <th>Ngày tạo</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, index) => (
                                            <tr key={u._id}>
                                                <td>{index + 1}</td>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'customer'}`}>
                                                        {u.role === 'admin' ? 'Admin' : 'Khách hàng'}
                                                    </span>
                                                </td>
                                                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                                                <td>
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => updateUserRole(u._id, e.target.value)}
                                                        className="role-select"
                                                    >
                                                        <option value="customer">Khách hàng</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <button
                                                        onClick={() => deleteUser(u._id)}
                                                        className="delete-btn"
                                                    >
                                                        🗑️ Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contacts' && (
                        <div className="data-section">
                            <div className="section-header">
                                <h2>Quản lý liên hệ</h2>
                                <span className="count">{contacts.length} tin nhắn</span>
                            </div>
                            <div className="contacts-list">
                                {contacts.map(contact => (
                                    <div key={contact._id} className={`contact-card ${contact.isRead ? 'read' : 'unread'}`}>
                                        <div className="contact-header">
                                            <div className="contact-info">
                                                <h3>{contact.name}</h3>
                                                <span className="email">{contact.email}</span>
                                            </div>
                                            <span className={`read-badge ${contact.isRead ? 'read' : 'unread'}`}>
                                                {contact.isRead ? 'Đã đọc' : 'Chưa đọc'}
                                            </span>
                                        </div>
                                        <div className="contact-message">
                                            <p>{contact.message}</p>
                                        </div>
                                        <div className="contact-date">
                                            {contact.createdAt && new Date(contact.createdAt).toLocaleString('vi-VN')}
                                        </div>
                                        <div className="contact-actions">
                                            <button
                                                onClick={() => toggleContactRead(contact._id, contact.isRead)}
                                                className={`read-btn ${contact.isRead ? 'mark-unread' : 'mark-read'}`}
                                            >
                                                {contact.isRead ? '📖 Đánh dấu chưa đọc' : '✅ Đánh dấu đã đọc'}
                                            </button>
                                            <button
                                                onClick={() => deleteContact(contact._id)}
                                                className="delete-btn"
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div className="data-section">
                            <div className="section-header">
                                <h2>Audit Logs</h2>
                                <span className="count">{auditLogs.length} logs</span>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Thời gian</th>
                                            <th>Admin</th>
                                            <th>Hành động</th>
                                            <th>Tài nguyên</th>
                                            <th>Mô tả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map((log) => (
                                            <tr key={log._id}>
                                                <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                                <td>{log.adminName}</td>
                                                <td>
                                                    <span className={`action-badge ${log.action.toLowerCase()}`}>
                                                        {log.action.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td>{log.resourceType}</td>
                                                <td className="log-description">{log.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>{isEditingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                            <button className="close-modal" onClick={() => setIsProductModalOpen(false)}>×</button>
                        </div>
                        <form className="modal-form" onSubmit={handleSaveProduct}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Mã sản phẩm (idClient) *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ví dụ: premium-mango"
                                        value={productForm.idClient}
                                        onChange={(e) => setProductForm({ ...productForm, idClient: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tên sản phẩm *</label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.title}
                                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giá (VNĐ) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giá cũ (VNĐ)</label>
                                    <input
                                        type="number"
                                        value={productForm.oldPrice}
                                        onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Danh mục</label>
                                    <input
                                        type="text"
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Badge (Nhãn)</label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Bán chạy, Mới"
                                        value={productForm.badge}
                                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số lượng tồn kho</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={productForm.quantity}
                                        onChange={(e) => setProductForm({ ...productForm, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Đường dẫn ảnh (URL) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.image}
                                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Mô tả ngắn *</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <label>Đặc điểm (Features) - Phân cách bằng dấu phẩy</label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Tự nhiên, Không đường, Giàu vitamin"
                                        value={productForm.features}
                                        onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={productForm.inStock}
                                            onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                                        />
                                        Còn hàng
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsProductModalOpen(false)}>Hủy</button>
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
