// Dashboard do Admin - Passa Bola
class AdminDashboard {
    constructor() {
        this.currentUser = AuthSystem.checkAuth();
        this.adminStats = this.loadAdminStats();
        this.init();
    }

    init() {
        // Verificar autenticação
        if (!this.currentUser) {
            window.location.href = '../index.html';
            return;
        }

        // Verificar se é admin
        if (this.currentUser.role !== 'admin') {
            window.location.href = 'user-dashboard.html';
            return;
        }

        this.loadAdminData();
        this.loadAdminStats();
        this.loadAdminActivity();
        this.setupEventListeners();
    }

    loadAdminData() {
        // Atualizar nome do admin
        document.getElementById('adminName').textContent = this.currentUser.name;
    }

    loadAdminStats() {
        const stats = this.getAdminStats();
        
        // Atualizar estatísticas
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalGames').textContent = stats.totalGames;
        document.getElementById('totalSales').textContent = `R$ ${stats.totalSales.toLocaleString('pt-BR')}`;
        document.getElementById('growthRate').textContent = `+${stats.growthRate}%`;
    }

    getAdminStats() {
        const storedStats = localStorage.getItem('passabola_admin_stats');
        
        if (storedStats) {
            return JSON.parse(storedStats);
        }

        // Estatísticas padrão
        const defaultStats = {
            totalUsers: 2, // admin + user padrão
            totalGames: 0,
            totalSales: 0,
            growthRate: 0,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('passabola_admin_stats', JSON.stringify(defaultStats));
        return defaultStats;
    }

    updateStats() {
        const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
        const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
        const sales = JSON.parse(localStorage.getItem('passabola_sales') || '[]');
        
        const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
        const growthRate = this.calculateGrowthRate();

        const stats = {
            totalUsers: users.length,
            totalGames: games.length,
            totalSales: totalSales,
            growthRate: growthRate,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('passabola_admin_stats', JSON.stringify(stats));
        this.loadAdminStats();
    }

    calculateGrowthRate() {
        // Simular taxa de crescimento baseada em dados
        const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
        const baseUsers = 2; // usuários padrão
        const currentUsers = users.length;
        
        if (currentUsers <= baseUsers) return 0;
        
        return Math.round(((currentUsers - baseUsers) / baseUsers) * 100);
    }

    loadAdminActivity() {
        const activities = this.getAdminActivities();
        const activityList = document.getElementById('adminActivity');
        
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item admin-activity">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Nenhuma atividade recente</h4>
                        <p>As atividades do sistema aparecerão aqui</p>
                    </div>
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item admin-activity">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${this.formatTimeAgo(activity.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    getAdminActivities() {
        const storedActivities = localStorage.getItem('passabola_admin_activities');
        return storedActivities ? JSON.parse(storedActivities) : [];
    }

    addAdminActivity(title, description, icon = 'info-circle') {
        const activities = this.getAdminActivities();
        const newActivity = {
            id: Date.now(),
            title,
            description,
            icon,
            timestamp: new Date().toISOString()
        };

        activities.unshift(newActivity);
        
        // Manter apenas as últimas 15 atividades
        if (activities.length > 15) {
            activities.splice(15);
        }

        localStorage.setItem('passabola_admin_activities', JSON.stringify(activities));
        this.loadAdminActivity();
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Agora mesmo';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
        
        return time.toLocaleDateString('pt-BR');
    }

    setupEventListeners() {
        // Dropdown do admin
        const adminDropdown = document.querySelector('.user-dropdown');
        if (adminDropdown) {
            adminDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', () => {
            const dropdown = document.querySelector('.dropdown-menu');
            if (dropdown) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            }
        });

        // Atualizar estatísticas periodicamente
        setInterval(() => {
            this.updateStats();
        }, 30000); // A cada 30 segundos
    }

    // Métodos para ações do admin
    showQuickActions() {
        this.showQuickActionsModal();
    }

    manageUsers() {
        this.showUsersManagementModal();
    }

    manageGames() {
        this.showGamesManagementModal();
    }

    manageProducts() {
        this.goToShopManagement();
    }

    goToShopManagement() {
        // Redirecionar para a página da loja com parâmetro de admin
        window.location.href = '../pages/loja.html?admin=true';
    }

    manageNews() {
        this.showNewsManagementModal();
    }

    viewAnalytics() {
        this.showAnalyticsModal();
    }

    systemSettings() {
        this.showSystemSettingsModal();
    }

    showAdminProfile() {
        this.showAdminProfileModal();
    }

    showAdminSettings() {
        this.showAdminSettingsModal();
    }

    // Modal de Ações Rápidas
    showQuickActionsModal() {
        const modal = this.createModal('Ações Rápidas', `
            <div class="quick-actions-grid">
                <button class="quick-action-btn" onclick="adminDashboard.addNewUser()">
                    <i class="fas fa-user-plus"></i>
                    <span>Adicionar Usuário</span>
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.approveGame()">
                    <i class="fas fa-check-circle"></i>
                    <span>Aprovar Jogo</span>
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.sendNotification()">
                    <i class="fas fa-bell"></i>
                    <span>Enviar Notificação</span>
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.viewAccessStats()">
                    <i class="fas fa-chart-line"></i>
                    <span>Estatísticas de Acesso</span>
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.manageMessages()">
                    <i class="fas fa-comments"></i>
                    <span>Central de Mensagens</span>
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.manageRankings()">
                    <i class="fas fa-trophy"></i>
                    <span>Gerenciar Rankings</span>
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.viewCalendar()">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Calendário de Eventos</span>
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.systemBackup()">
                    <i class="fas fa-download"></i>
                    <span>Backup Sistema</span>
                </button>
            </div>
        `);
        this.showModal(modal);
    }

    // Modal de Gerenciamento de Usuários
    showUsersManagementModal() {
        const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
        const usersList = users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                        <span class="user-role ${user.role}">${user.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn-small btn-primary" onclick="adminDashboard.editUser('${user.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="adminDashboard.deleteUser('${user.email}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const modal = this.createModal('Gerenciar Usuários', `
            <div class="users-management">
                <div class="management-header">
                    <button class="btn-primary" onclick="adminDashboard.addNewUser()">
                        <i class="fas fa-plus"></i>
                        Adicionar Usuário
                    </button>
                </div>
                <div class="users-list">
                    ${usersList || '<p>Nenhum usuário encontrado</p>'}
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    // Modal de Gerenciamento de Jogos
    showGamesManagementModal() {
        const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
        const gamesList = games.map(game => `
            <div class="game-item">
                <div class="game-info">
                    <h4>${game.title}</h4>
                    <p><i class="fas fa-calendar"></i> ${new Date(game.date).toLocaleDateString('pt-BR')}</p>
                    <p><i class="fas fa-clock"></i> ${game.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${game.location}</p>
                </div>
                <div class="game-actions">
                    <button class="btn-small btn-success" onclick="adminDashboard.approveGame('${game.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-small btn-warning" onclick="adminDashboard.editGame('${game.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="adminDashboard.deleteGame('${game.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const modal = this.createModal('Gerenciar Jogos', `
            <div class="games-management">
                <div class="management-header">
                    <button class="btn-primary" onclick="adminDashboard.createGame()">
                        <i class="fas fa-plus"></i>
                        Criar Jogo
                    </button>
                </div>
                <div class="games-list">
                    ${gamesList || '<p>Nenhum jogo encontrado</p>'}
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    // Modal de Analytics
    showAnalyticsModal() {
        const stats = this.getAdminStats();
        const modal = this.createModal('Analytics do Sistema', `
            <div class="analytics-content">
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h3>Usuários</h3>
                        <div class="analytics-number">${stats.totalUsers}</div>
                        <div class="analytics-change positive">+${stats.growthRate}%</div>
                    </div>
                    <div class="analytics-card">
                        <h3>Jogos</h3>
                        <div class="analytics-number">${stats.totalGames}</div>
                        <div class="analytics-change">Este mês</div>
                    </div>
                    <div class="analytics-card">
                        <h3>Vendas</h3>
                        <div class="analytics-number">R$ ${stats.totalSales.toLocaleString('pt-BR')}</div>
                        <div class="analytics-change">Total</div>
                    </div>
                </div>
                <div class="analytics-chart">
                    <h4>Atividade Recente</h4>
                    <div class="chart-placeholder">
                        <i class="fas fa-chart-line"></i>
                        <p>Gráfico de atividade em desenvolvimento</p>
                    </div>
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    // Modal de Gerenciamento de Produtos
    showProductsManagementModal() {
        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        
        // Se não há produtos, criar um produto de exemplo para demonstração
        if (products.length === 0) {
            const exampleProduct = {
                id: 'example-1',
                name: 'Produto de Exemplo',
                description: 'Este é um produto criado automaticamente para demonstração',
                price: 99.90,
                stock: 10,
                category: 'equipamentos',
                published: true,
                createdAt: new Date().toISOString()
            };
            products.push(exampleProduct);
            localStorage.setItem('passabola_products', JSON.stringify(products));
        }
        
        const productsList = products.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <div class="product-image">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="product-details">
                        <h4>${product.name}</h4>
                        <p>${product.description}</p>
                        <span class="product-price">R$ ${product.price.toLocaleString('pt-BR')}</span>
                        <span class="product-stock">Estoque: ${product.stock}</span>
                        <span class="product-status ${product.published ? 'published' : 'draft'}">
                            ${product.published ? 'Publicado na Loja' : 'Rascunho'}
                        </span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-small btn-success" onclick="adminDashboard.toggleProductPublish('${product.id}')" title="${product.published ? 'Despublicar da Loja' : 'Publicar na Loja'}">
                        <i class="fas fa-${product.published ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn-small btn-primary" onclick="adminDashboard.editProduct('${product.id}')" title="Editar Produto">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="adminDashboard.deleteProduct('${product.id}')" title="Excluir Produto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        console.log('Criando modal de produtos com', products.length, 'produtos');
        console.log('HTML dos produtos:', productsList);
        
        const modal = this.createModal('Gerenciar Produtos', `
            <div class="products-management">
                <div class="management-header">
                    <button class="btn-primary" onclick="adminDashboard.addNewProduct()">
                        <i class="fas fa-plus"></i>
                        Adicionar Produto
                    </button>
                </div>
                <div class="products-list">
                    ${productsList || '<p>Nenhum produto encontrado</p>'}
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    // Modal de Gerenciamento de Notícias
    showNewsManagementModal() {
        const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');
        const newsList = news.map(article => `
            <div class="news-item">
                <div class="news-info">
                    <div class="news-image">
                        <i class="fas fa-newspaper"></i>
                    </div>
                    <div class="news-details">
                        <h4>${article.title}</h4>
                        <p>${article.summary}</p>
                        <span class="news-date">${new Date(article.date).toLocaleDateString('pt-BR')}</span>
                        <span class="news-status ${article.published ? 'published' : 'draft'}">${article.published ? 'Publicado' : 'Rascunho'}</span>
                    </div>
                </div>
                <div class="news-actions">
                    <button class="btn-small btn-success" onclick="adminDashboard.publishNews('${article.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-small btn-primary" onclick="adminDashboard.editNews('${article.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="adminDashboard.deleteNews('${article.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const modal = this.createModal('Gerenciar Notícias', `
            <div class="news-management">
                <div class="management-header">
                    <button class="btn-primary" onclick="adminDashboard.addNewNews()">
                        <i class="fas fa-plus"></i>
                        Criar Notícia
                    </button>
                </div>
                <div class="news-list">
                    ${newsList || '<p>Nenhuma notícia encontrada</p>'}
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    // Funções específicas do admin
    addNewUser() {
        const modal = this.createModal('Adicionar Usuário', `
            <form class="admin-form" onsubmit="adminDashboard.createUser(event)">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Senha</label>
                    <input type="password" name="password" required>
                </div>
                <div class="form-group">
                    <label>Tipo de Usuário</label>
                    <select name="role">
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Criar Usuário</button>
                </div>
            </form>
        `);
        this.showModal(modal);
    }

    createUser(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
            createdAt: new Date().toISOString()
        };

        const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
        users.push(userData);
        localStorage.setItem('passabola_users', JSON.stringify(users));

        this.updateStats();
        this.addAdminActivity('Novo usuário criado', `Usuário ${userData.name} foi criado pelo admin`, 'user-plus');
        this.closeModal();
        this.showNotification('Usuário criado com sucesso!', 'success');
    }

    editUser(email) {
        const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            this.showNotification('Usuário não encontrado!', 'error');
            return;
        }

        const modal = this.createModal('Editar Usuário', `
            <form class="admin-form" onsubmit="adminDashboard.updateUser(event, '${email}')">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" name="name" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label>Nova Senha (deixe em branco para manter a atual)</label>
                    <input type="password" name="password" placeholder="Digite nova senha">
                </div>
                <div class="form-group">
                    <label>Tipo de Usuário</label>
                    <select name="role">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Atualizar Usuário</button>
                </div>
            </form>
        `);
        this.showModal(modal);
    }

    updateUser(event, oldEmail) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
        const userIndex = users.findIndex(u => u.email === oldEmail);
        
        if (userIndex === -1) {
            this.showNotification('Usuário não encontrado!', 'error');
            return;
        }

        const newEmail = formData.get('email');
        const newPassword = formData.get('password');
        
        // Verificar se o novo email já existe (exceto para o próprio usuário)
        if (newEmail !== oldEmail && users.some(u => u.email === newEmail)) {
            this.showNotification('Este email já está em uso!', 'error');
            return;
        }

        // Atualizar dados do usuário
        users[userIndex].name = formData.get('name');
        users[userIndex].email = newEmail;
        users[userIndex].role = formData.get('role');
        
        // Atualizar senha apenas se fornecida
        if (newPassword && newPassword.trim() !== '') {
            users[userIndex].password = newPassword;
        }
        
        users[userIndex].updatedAt = new Date().toISOString();

        localStorage.setItem('passabola_users', JSON.stringify(users));

        this.updateStats();
        this.addAdminActivity('Usuário atualizado', `Usuário ${users[userIndex].name} foi atualizado pelo admin`, 'user-edit');
        this.closeModal();
        this.showNotification('Usuário atualizado com sucesso!', 'success');
        
        // Recarregar modal de usuários
        setTimeout(() => {
            this.showUsersManagementModal();
        }, 500);
    }

    deleteUser(email) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
            const filteredUsers = users.filter(user => user.email !== email);
            localStorage.setItem('passabola_users', JSON.stringify(filteredUsers));

            this.updateStats();
            this.addAdminActivity('Usuário excluído', `Usuário ${email} foi excluído pelo admin`, 'user-minus');
            this.showNotification('Usuário excluído com sucesso!', 'success');
            this.showUsersManagementModal(); // Recarregar modal
        }
    }

    editGame(gameId) {
        const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
        const game = games.find(g => g.id === gameId);
        
        if (!game) {
            this.showNotification('Jogo não encontrado!', 'error');
            return;
        }

        const modal = this.createModal('Editar Jogo', `
            <form class="admin-form" onsubmit="adminDashboard.updateGame(event, '${gameId}')">
                <div class="form-group">
                    <label>Título do Jogo</label>
                    <input type="text" name="title" value="${game.title}" required>
                </div>
                <div class="form-group">
                    <label>Data</label>
                    <input type="date" name="date" value="${game.date}" required>
                </div>
                <div class="form-group">
                    <label>Horário</label>
                    <input type="time" name="time" value="${game.time}" required>
                </div>
                <div class="form-group">
                    <label>Local</label>
                    <input type="text" name="location" value="${game.location}" required>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea name="description" rows="3">${game.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="pending" ${game.status === 'pending' ? 'selected' : ''}>Pendente</option>
                        <option value="approved" ${game.status === 'approved' ? 'selected' : ''}>Aprovado</option>
                        <option value="rejected" ${game.status === 'rejected' ? 'selected' : ''}>Rejeitado</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Atualizar Jogo</button>
                </div>
            </form>
        `);
        this.showModal(modal);
    }

    updateGame(event, gameId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
        const gameIndex = games.findIndex(g => g.id === gameId);
        
        if (gameIndex === -1) {
            this.showNotification('Jogo não encontrado!', 'error');
            return;
        }

        // Atualizar dados do jogo
        games[gameIndex].title = formData.get('title');
        games[gameIndex].date = formData.get('date');
        games[gameIndex].time = formData.get('time');
        games[gameIndex].location = formData.get('location');
        games[gameIndex].description = formData.get('description');
        games[gameIndex].status = formData.get('status');
        games[gameIndex].updatedAt = new Date().toISOString();
        
        // Se foi aprovado, adicionar dados de aprovação
        if (games[gameIndex].status === 'approved') {
            games[gameIndex].approved = true;
            games[gameIndex].approvedBy = this.currentUser.name;
            games[gameIndex].approvedAt = new Date().toISOString();
        }

        localStorage.setItem('passabola_scheduled_games', JSON.stringify(games));

        this.updateStats();
        this.addAdminActivity('Jogo atualizado', `Jogo "${games[gameIndex].title}" foi atualizado`, 'calendar-check');
        this.closeModal();
        this.showNotification('Jogo atualizado com sucesso!', 'success');
        
        // Recarregar modal de jogos
        setTimeout(() => {
            this.showGamesManagementModal();
        }, 500);
    }

    approveGame() {
        // Mostrar modal com jogos pendentes para aprovação
        let games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
        
        // Se não há jogos, criar alguns exemplos para demonstração
        if (games.length === 0) {
            const exampleGames = [
                {
                    id: 'game-1',
                    title: 'Pelada de Domingo',
                    date: '2024-01-15',
                    time: '10:00',
                    location: 'Campo do Bairro',
                    description: 'Pelada tradicional de domingo',
                    createdBy: 'João Silva',
                    createdAt: new Date().toISOString(),
                    approved: false,
                    status: 'pending'
                },
                {
                    id: 'game-2',
                    title: 'Torneio de Futebol',
                    date: '2024-01-20',
                    time: '14:00',
                    location: 'Quadra Municipal',
                    description: 'Torneio entre times do bairro',
                    createdBy: 'Maria Santos',
                    createdAt: new Date().toISOString(),
                    approved: false,
                    status: 'pending'
                }
            ];
            games = exampleGames;
            localStorage.setItem('passabola_scheduled_games', JSON.stringify(games));
        }
        
        const pendingGames = games.filter(game => !game.approved && game.status !== 'rejected');
        
        if (pendingGames.length === 0) {
            this.showNotification('Não há jogos pendentes para aprovação!', 'info');
            return;
        }

        const gamesList = pendingGames.map(game => `
            <div class="game-item">
                <div class="game-info">
                    <h4>${game.title}</h4>
                    <p><strong>Data:</strong> ${game.date} às ${game.time}</p>
                    <p><strong>Local:</strong> ${game.location}</p>
                    <p><strong>Criado por:</strong> ${game.createdBy || 'Sistema'}</p>
                    ${game.description ? `<p><strong>Descrição:</strong> ${game.description}</p>` : ''}
                </div>
                <div class="game-actions">
                    <button class="btn-small btn-success" onclick="adminDashboard.approveSpecificGame('${game.id}')">
                        <i class="fas fa-check"></i>
                        Aprovar
                    </button>
                    <button class="btn-small btn-danger" onclick="adminDashboard.rejectGame('${game.id}')">
                        <i class="fas fa-times"></i>
                        Rejeitar
                    </button>
                </div>
            </div>
        `).join('');

        const modal = this.createModal('Aprovar Jogos', `
            <div class="games-management">
                <div class="management-header">
                    <p>Jogos pendentes de aprovação (${pendingGames.length})</p>
                </div>
                <div class="games-list">
                    ${gamesList}
                </div>
            </div>
        `);
        this.showModal(modal);
    }

    approveSpecificGame(gameId) {
        const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
        const gameIndex = games.findIndex(game => game.id === gameId);
        
        if (gameIndex !== -1) {
            games[gameIndex].approved = true;
            games[gameIndex].approvedBy = this.currentUser.name;
            games[gameIndex].approvedAt = new Date().toISOString();
            games[gameIndex].status = 'approved';
            
            localStorage.setItem('passabola_scheduled_games', JSON.stringify(games));
            
            this.updateStats();
            this.addAdminActivity('Jogo aprovado', `Jogo "${games[gameIndex].title}" foi aprovado`, 'check-circle');
            this.showNotification('Jogo aprovado com sucesso!', 'success');
            
            // Recarregar modal
            setTimeout(() => {
                this.approveGame();
            }, 500);
        }
    }

    rejectGame(gameId) {
        if (confirm('Tem certeza que deseja rejeitar este jogo?')) {
            const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
            const gameIndex = games.findIndex(game => game.id === gameId);
            
            if (gameIndex !== -1) {
                games[gameIndex].status = 'rejected';
                games[gameIndex].rejectedBy = this.currentUser.name;
                games[gameIndex].rejectedAt = new Date().toISOString();
                
                localStorage.setItem('passabola_scheduled_games', JSON.stringify(games));
                
                this.updateStats();
                this.addAdminActivity('Jogo rejeitado', `Jogo "${games[gameIndex].title}" foi rejeitado`, 'times-circle');
                this.showNotification('Jogo rejeitado!', 'success');
                
                // Recarregar modal
                setTimeout(() => {
                    this.approveGame();
                }, 500);
            }
        }
    }

    deleteGame(gameId) {
        if (confirm('Tem certeza que deseja excluir este jogo?')) {
            const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
            const filteredGames = games.filter(game => game.id !== gameId);
            localStorage.setItem('passabola_scheduled_games', JSON.stringify(filteredGames));

            this.updateStats();
            this.addAdminActivity('Jogo excluído', `Jogo foi excluído pelo admin`, 'trash');
            this.showNotification('Jogo excluído com sucesso!', 'success');
            this.showGamesManagementModal();
        }
    }

    systemBackup() {
        const backupData = {
            users: JSON.parse(localStorage.getItem('passabola_users') || '[]'),
            games: JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]'),
            products: JSON.parse(localStorage.getItem('passabola_products') || '[]'),
            news: JSON.parse(localStorage.getItem('passabola_news') || '[]'),
            stats: this.getAdminStats(),
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `passabola-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.addAdminActivity('Backup realizado', 'Backup do sistema foi realizado', 'download');
        this.showNotification('Backup realizado com sucesso!', 'success');
    }

    // Funções para Produtos
    addNewProduct() {
        const modal = this.createModal('Adicionar Produto', `
            <form class="admin-form" onsubmit="adminDashboard.createProduct(event)">
                <div class="form-group">
                    <label>Nome do Produto</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea name="description" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Preço (R$)</label>
                    <input type="number" name="price" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label>Estoque</label>
                    <input type="number" name="stock" min="0" required>
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select name="category">
                        <option value="equipamentos">Equipamentos</option>
                        <option value="roupas">Roupas</option>
                        <option value="acessorios">Acessórios</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Criar Produto</button>
                </div>
            </form>
        `);
        this.showModal(modal);
    }

    createProduct(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const productData = {
            id: Date.now().toString(),
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            category: formData.get('category'),
            createdAt: new Date().toISOString(),
            published: true // Produtos criados pelo admin são automaticamente publicados na loja
        };

        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        products.push(productData);
        localStorage.setItem('passabola_products', JSON.stringify(products));

        this.updateStats();
        this.addAdminActivity('Novo produto criado', `Produto "${productData.name}" foi criado e publicado na loja`, 'box');
        this.closeModal();
        this.showNotification('Produto criado e publicado na loja com sucesso!', 'success');
        
        // Recarregar loja se estiver aberta
        if (typeof reloadShopProducts === 'function') {
            reloadShopProducts();
        }
        
        // Recarregar modal de produtos
        setTimeout(() => {
            this.showProductsManagementModal();
        }, 500);
    }

    editProduct(productId) {
        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            this.showNotification('Produto não encontrado!', 'error');
            return;
        }

        const modal = this.createModal('Editar Produto', `
            <form class="admin-form" onsubmit="adminDashboard.updateProduct(event, '${productId}')">
                <div class="form-group">
                    <label>Nome do Produto</label>
                    <input type="text" name="name" value="${product.name}" required>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea name="description" rows="3" required>${product.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Preço (R$)</label>
                    <input type="number" name="price" step="0.01" min="0" value="${product.price}" required>
                </div>
                <div class="form-group">
                    <label>Estoque</label>
                    <input type="number" name="stock" min="0" value="${product.stock}" required>
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select name="category">
                        <option value="equipamentos" ${product.category === 'equipamentos' ? 'selected' : ''}>Equipamentos</option>
                        <option value="roupas" ${product.category === 'roupas' ? 'selected' : ''}>Roupas</option>
                        <option value="acessorios" ${product.category === 'acessorios' ? 'selected' : ''}>Acessórios</option>
                        <option value="outros" ${product.category === 'outros' ? 'selected' : ''}>Outros</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Atualizar Produto</button>
                </div>
            </form>
        `);
        this.showModal(modal);
    }

    updateProduct(event, productId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            this.showNotification('Produto não encontrado!', 'error');
            return;
        }

        // Atualizar dados do produto
        products[productIndex].name = formData.get('name');
        products[productIndex].description = formData.get('description');
        products[productIndex].price = parseFloat(formData.get('price'));
        products[productIndex].stock = parseInt(formData.get('stock'));
        products[productIndex].category = formData.get('category');
        products[productIndex].updatedAt = new Date().toISOString();

        localStorage.setItem('passabola_products', JSON.stringify(products));

        this.updateStats();
        this.addAdminActivity('Produto atualizado', `Produto "${products[productIndex].name}" foi atualizado`, 'box');
        this.closeModal();
        this.showNotification('Produto atualizado com sucesso!', 'success');
        
        // Recarregar modal de produtos
        setTimeout(() => {
            this.showProductsManagementModal();
        }, 500);
    }

    toggleProductPublish(productId) {
        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            this.showNotification('Produto não encontrado!', 'error');
            return;
        }

        products[productIndex].published = !products[productIndex].published;
        products[productIndex].updatedAt = new Date().toISOString();
        
        localStorage.setItem('passabola_products', JSON.stringify(products));

        const action = products[productIndex].published ? 'publicado' : 'despublicado';
        this.updateStats();
        this.addAdminActivity('Produto atualizado', `Produto "${products[productIndex].name}" foi ${action} da loja`, 'eye');
        this.showNotification(`Produto ${action} da loja com sucesso!`, 'success');
        
        // Recarregar loja se estiver aberta
        if (typeof reloadShopProducts === 'function') {
            reloadShopProducts();
        }
        
        // Recarregar modal de produtos
        setTimeout(() => {
            this.showProductsManagementModal();
        }, 500);
    }

    deleteProduct(productId) {
        console.log('Função deleteProduct chamada para ID:', productId);
        
        if (confirm('Tem certeza que deseja excluir este produto? Ele será removido permanentemente da loja.')) {
            const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
            const product = products.find(p => p.id === productId);
            
            if (!product) {
                this.showNotification('Produto não encontrado!', 'error');
                return;
            }
            
            const filteredProducts = products.filter(p => p.id !== productId);
            localStorage.setItem('passabola_products', JSON.stringify(filteredProducts));

            this.updateStats();
            this.addAdminActivity('Produto excluído', `Produto "${product.name}" foi excluído permanentemente`, 'trash');
            this.showNotification('Produto excluído permanentemente da loja!', 'success');
            
            // Recarregar loja se estiver aberta
            if (typeof reloadShopProducts === 'function') {
                reloadShopProducts();
            }
            
            // Recarregar modal de produtos
            setTimeout(() => {
                this.showProductsManagementModal();
            }, 500);
        }
    }

    // Funções para Notícias
    addNewNews() {
        const modal = this.createModal('Criar Notícia', `
            <form class="admin-form" onsubmit="adminDashboard.createNews(event)">
                <div class="form-group">
                    <label>Título da Notícia</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Resumo</label>
                    <textarea name="summary" rows="2" required></textarea>
                </div>
                <div class="form-group">
                    <label>Conteúdo</label>
                    <textarea name="content" rows="6" required></textarea>
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select name="category">
                        <option value="esportes">Esportes</option>
                        <option value="eventos">Eventos</option>
                        <option value="anuncios">Anúncios</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="published" value="true">
                        Publicar imediatamente
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Criar Notícia</button>
                </div>
            </form>
        `);
        this.showModal(modal);
    }

    createNews(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newsData = {
            id: Date.now().toString(),
            title: formData.get('title'),
            summary: formData.get('summary'),
            content: formData.get('content'),
            category: formData.get('category'),
            published: formData.get('published') === 'true',
            date: new Date().toISOString(),
            author: this.currentUser.name,
            createdAt: new Date().toISOString()
        };

        const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');
        news.push(newsData);
        localStorage.setItem('passabola_news', JSON.stringify(news));

        this.updateStats();
        this.addAdminActivity('Nova notícia criada', `Notícia "${newsData.title}" foi criada`, 'newspaper');
        this.closeModal();
        this.showNotification('Notícia criada com sucesso!', 'success');
    }

    publishNews(newsId) {
        const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');
        const newsIndex = news.findIndex(article => article.id === newsId);
        
        if (newsIndex !== -1) {
            news[newsIndex].published = !news[newsIndex].published;
            news[newsIndex].publishedAt = news[newsIndex].published ? new Date().toISOString() : null;
            
            localStorage.setItem('passabola_news', JSON.stringify(news));
            
            this.updateStats();
            this.addAdminActivity('Notícia atualizada', `Notícia "${news[newsIndex].title}" foi ${news[newsIndex].published ? 'publicada' : 'despublicada'}`, 'eye');
            this.showNotification(`Notícia ${news[newsIndex].published ? 'publicada' : 'despublicada'} com sucesso!`, 'success');
        }
    }

    editNews(newsId) {
        const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');
        const article = news.find(n => n.id === newsId);
        
        if (!article) {
            this.showNotification('Notícia não encontrada!', 'error');
            return;
        }

        const modal = this.createModal('Editar Notícia', `
            <form class="admin-form" onsubmit="adminDashboard.updateNews(event, '${newsId}')">
                <div class="form-group">
                    <label>Título da Notícia</label>
                    <input type="text" name="title" value="${article.title}" required>
                </div>
                <div class="form-group">
                    <label>Resumo</label>
                    <textarea name="summary" rows="2" required>${article.summary}</textarea>
                </div>
                <div class="form-group">
                    <label>Conteúdo</label>
                    <textarea name="content" rows="6" required>${article.content}</textarea>
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select name="category">
                        <option value="esportes" ${article.category === 'esportes' ? 'selected' : ''}>Esportes</option>
                        <option value="eventos" ${article.category === 'eventos' ? 'selected' : ''}>Eventos</option>
                        <option value="anuncios" ${article.category === 'anuncios' ? 'selected' : ''}>Anúncios</option>
                        <option value="outros" ${article.category === 'outros' ? 'selected' : ''}>Outros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="published" value="true" ${article.published ? 'checked' : ''}>
                        Publicado
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Atualizar Notícia</button>
                </div>
            </form>
        `);
        this.showModal(modal);
    }

    updateNews(event, newsId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');
        const newsIndex = news.findIndex(n => n.id === newsId);
        
        if (newsIndex === -1) {
            this.showNotification('Notícia não encontrada!', 'error');
            return;
        }

        // Atualizar dados da notícia
        news[newsIndex].title = formData.get('title');
        news[newsIndex].summary = formData.get('summary');
        news[newsIndex].content = formData.get('content');
        news[newsIndex].category = formData.get('category');
        news[newsIndex].published = formData.get('published') === 'true';
        news[newsIndex].updatedAt = new Date().toISOString();
        
        // Atualizar data de publicação se foi publicada agora
        if (news[newsIndex].published && !news[newsIndex].publishedAt) {
            news[newsIndex].publishedAt = new Date().toISOString();
        }

        localStorage.setItem('passabola_news', JSON.stringify(news));

        this.updateStats();
        this.addAdminActivity('Notícia atualizada', `Notícia "${news[newsIndex].title}" foi atualizada`, 'newspaper');
        this.closeModal();
        this.showNotification('Notícia atualizada com sucesso!', 'success');
        
        // Recarregar modal de notícias
        setTimeout(() => {
            this.showNewsManagementModal();
        }, 500);
    }

    deleteNews(newsId) {
        if (confirm('Tem certeza que deseja excluir esta notícia?')) {
            const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');
            const filteredNews = news.filter(article => article.id !== newsId);
            localStorage.setItem('passabola_news', JSON.stringify(filteredNews));

            this.updateStats();
            this.addAdminActivity('Notícia excluída', `Notícia foi excluída pelo admin`, 'trash');
            this.showNotification('Notícia excluída com sucesso!', 'success');
            this.showNewsManagementModal();
        }
    }


    // Utilitários para modais
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        modal.innerHTML = `
            <div class="modal-overlay" onclick="adminDashboard.closeModal()"></div>
            <div class="modal-content" style="position: relative !important; margin: auto !important;">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="adminDashboard.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        return modal;
    }

    showModal(modal) {
        // Remover qualquer modal existente
        const existingModal = document.querySelector('.admin-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.appendChild(modal);
        
        // Forçar estilos inline para garantir centralização
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        
        setTimeout(() => {
            modal.classList.add('show');
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
        }, 100);
    }

    closeModal() {
        const modal = document.querySelector('.admin-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Funções globais
function showQuickActions() {
    adminDashboard.showQuickActions();
}

function manageUsers() {
    adminDashboard.manageUsers();
}

function manageGames() {
    adminDashboard.manageGames();
}

function manageProducts() {
    adminDashboard.manageProducts();
}

function manageNews() {
    adminDashboard.manageNews();
}

function viewAnalytics() {
    adminDashboard.viewAnalytics();
}

function systemSettings() {
    adminDashboard.systemSettings();
}

function showAdminProfile() {
    adminDashboard.showAdminProfile();
}

function showAdminSettings() {
    adminDashboard.showAdminSettings();
}

// Inicializar dashboard do admin
const adminDashboard = new AdminDashboard();

// Adicionar estilos para notificações se não existirem
if (!document.querySelector('#notification-styles')) {
    const notificationStyles = `
        <style id="notification-styles">
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 10000;
                padding: 1rem 1.5rem;
                border-radius: 15px;
                box-shadow: var(--shadow-elegant);
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 350px;
                backdrop-filter: none;
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }

            .notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            .notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            .notification-warning {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            .notification-info {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            .notification i {
                font-size: 1.2rem;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
            }

            @media (max-width: 768px) {
                .notification {
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                    transform: translateY(-100px);
                }
                
                .notification.show {
                    transform: translateY(0);
                }
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', notificationStyles);
}

// Funções para os novos botões das ações rápidas
function sendNotification() {
    if (typeof adminDashboard !== 'undefined') {
        adminDashboard.sendNotification();
    }
}

function viewAccessStats() {
    if (typeof adminDashboard !== 'undefined') {
        adminDashboard.viewAccessStats();
    }
}

function manageMessages() {
    if (typeof adminDashboard !== 'undefined') {
        adminDashboard.manageMessages();
    }
}

function manageRankings() {
    if (typeof adminDashboard !== 'undefined') {
        adminDashboard.manageRankings();
    }
}

function viewCalendar() {
    if (typeof adminDashboard !== 'undefined') {
        adminDashboard.viewCalendar();
    }
}

// Implementar função sendNotification na classe AdminDashboard
AdminDashboard.prototype.sendNotification = function() {
    const modal = this.createModal('Enviar Notificação', `
        <div class="notification-form">
            <div class="form-group">
                <label for="notificationTitle">Título da Notificação:</label>
                <input type="text" id="notificationTitle" placeholder="Ex: Novo jogo agendado!" required>
            </div>
            <div class="form-group">
                <label for="notificationMessage">Mensagem:</label>
                <textarea id="notificationMessage" rows="4" placeholder="Digite sua mensagem aqui..." required></textarea>
            </div>
            <div class="form-group">
                <label for="notificationType">Tipo de Notificação:</label>
                <select id="notificationType">
                    <option value="info">Informação</option>
                    <option value="success">Sucesso</option>
                    <option value="warning">Aviso</option>
                    <option value="urgent">Urgente</option>
                </select>
            </div>
            <div class="form-group">
                <label for="notificationTarget">Destinatários:</label>
                <select id="notificationTarget">
                    <option value="all">Todos os usuários</option>
                    <option value="admins">Apenas administradores</option>
                    <option value="users">Apenas usuários</option>
                </select>
            </div>
            <div class="form-actions">
                <button class="btn-primary" onclick="adminDashboard.sendNotificationMessage()">
                    <i class="fas fa-paper-plane"></i>
                    Enviar Notificação
                </button>
                <button class="btn-secondary" onclick="adminDashboard.closeModal()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
            </div>
        </div>
    `);
    this.showModal(modal);
};

AdminDashboard.prototype.sendNotificationMessage = function() {
    const title = document.getElementById('notificationTitle').value;
    const message = document.getElementById('notificationMessage').value;
    const type = document.getElementById('notificationType').value;
    const target = document.getElementById('notificationTarget').value;

    if (!title || !message) {
        this.showNotification('Preencha todos os campos!', 'error');
        return;
    }

    // Salvar notificação
    const notifications = JSON.parse(localStorage.getItem('passabola_notifications') || '[]');
    const newNotification = {
        id: 'notif-' + Date.now(),
        title: title,
        message: message,
        type: type,
        target: target,
        sentBy: this.currentUser.name,
        sentAt: new Date().toISOString(),
        read: false
    };

    notifications.push(newNotification);
    localStorage.setItem('passabola_notifications', JSON.stringify(notifications));

    this.addAdminActivity('Notificação enviada', `"${title}" enviada para ${target}`, 'bell');
    this.showNotification('Notificação enviada com sucesso!', 'success');
    this.closeModal();
};

AdminDashboard.prototype.viewAccessStats = function() {
    // Calcular estatísticas para relatórios
    const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
    const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
    const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
    const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');

    // Estatísticas de usuários
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;

    // Estatísticas de jogos
    const totalGames = games.length;
    const approvedGames = games.filter(g => g.approved).length;
    const pendingGames = games.filter(g => !g.approved && g.status !== 'rejected').length;
    const rejectedGames = games.filter(g => g.status === 'rejected').length;

    // Estatísticas de produtos
    const totalProducts = products.length;
    const publishedProducts = products.filter(p => p.published).length;
    const draftProducts = products.filter(p => !p.published).length;

    // Estatísticas de notícias
    const totalNews = news.length;
    const publishedNews = news.filter(n => n.published).length;
    const draftNews = news.filter(n => !n.published).length;

    // Calcular crescimento (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;
    const recentGames = games.filter(g => new Date(g.createdAt) > thirtyDaysAgo).length;
    const recentProducts = products.filter(p => new Date(p.createdAt) > thirtyDaysAgo).length;

    const modal = this.createModal('Relatórios e Estatísticas', `
        <div class="analytics-content">
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="analytics-info">
                        <h3>Usuários</h3>
                        <div class="analytics-number">${totalUsers}</div>
                        <div class="analytics-details">
                            <p>Administradores: ${adminUsers}</p>
                            <p>Usuários: ${regularUsers}</p>
                            <p>Novos (30 dias): ${recentUsers}</p>
                        </div>
                    </div>
                </div>

                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="analytics-info">
                        <h3>Jogos</h3>
                        <div class="analytics-number">${totalGames}</div>
                        <div class="analytics-details">
                            <p>Aprovados: ${approvedGames}</p>
                            <p>Pendentes: ${pendingGames}</p>
                            <p>Rejeitados: ${rejectedGames}</p>
                            <p>Novos (30 dias): ${recentGames}</p>
                        </div>
                    </div>
                </div>

                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="analytics-info">
                        <h3>Produtos</h3>
                        <div class="analytics-number">${totalProducts}</div>
                        <div class="analytics-details">
                            <p>Publicados: ${publishedProducts}</p>
                            <p>Rascunhos: ${draftProducts}</p>
                            <p>Novos (30 dias): ${recentProducts}</p>
                        </div>
                    </div>
                </div>

                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-newspaper"></i>
                    </div>
                    <div class="analytics-info">
                        <h3>Notícias</h3>
                        <div class="analytics-number">${totalNews}</div>
                        <div class="analytics-details">
                            <p>Publicadas: ${publishedNews}</p>
                            <p>Rascunhos: ${draftNews}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="reports-actions">
                <button class="btn-primary" onclick="adminDashboard.exportReport()">
                    <i class="fas fa-download"></i>
                    Exportar Relatório
                </button>
                <button class="btn-secondary" onclick="adminDashboard.closeModal()">
                    <i class="fas fa-times"></i>
                    Fechar
                </button>
            </div>
        </div>
    `);
    this.showModal(modal);
};

AdminDashboard.prototype.exportReport = function() {
    // Criar relatório em formato texto
    const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
    const games = JSON.parse(localStorage.getItem('passabola_scheduled_games') || '[]');
    const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
    const news = JSON.parse(localStorage.getItem('passabola_news') || '[]');

    const report = `
RELATÓRIO DO SISTEMA PASSA BOLA
Gerado em: ${new Date().toLocaleString('pt-BR')}

=== RESUMO GERAL ===
Total de Usuários: ${users.length}
Total de Jogos: ${games.length}
Total de Produtos: ${products.length}
Total de Notícias: ${news.length}

=== USUÁRIOS ===
${users.map(u => `- ${u.name} (${u.email}) - ${u.role}`).join('\n')}

=== JOGOS ===
${games.map(g => `- ${g.title} - ${g.date} ${g.time} - ${g.location} - Status: ${g.approved ? 'Aprovado' : 'Pendente'}`).join('\n')}

=== PRODUTOS ===
${products.map(p => `- ${p.name} - R$ ${p.price} - Estoque: ${p.stock} - Status: ${p.published ? 'Publicado' : 'Rascunho'}`).join('\n')}

=== NOTÍCIAS ===
${news.map(n => `- ${n.title} - ${n.category} - Status: ${n.published ? 'Publicada' : 'Rascunho'}`).join('\n')}
    `;

    // Criar e baixar arquivo
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-passabola-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.showNotification('Relatório exportado com sucesso!', 'success');
};
