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
        this.showNotification('Ações rápidas em desenvolvimento!', 'info');
    }

    manageUsers() {
        this.showNotification('Gerenciamento de usuários em desenvolvimento!', 'info');
    }

    manageGames() {
        this.showNotification('Gerenciamento de jogos em desenvolvimento!', 'info');
    }

    manageProducts() {
        this.showNotification('Gerenciamento de produtos em desenvolvimento!', 'info');
    }

    manageNews() {
        this.showNotification('Gerenciamento de notícias em desenvolvimento!', 'info');
    }

    viewAnalytics() {
        this.showNotification('Analytics em desenvolvimento!', 'info');
    }

    systemSettings() {
        this.showNotification('Configurações do sistema em desenvolvimento!', 'info');
    }

    showAdminProfile() {
        this.showNotification('Perfil admin em desenvolvimento!', 'info');
    }

    showAdminSettings() {
        this.showNotification('Configurações admin em desenvolvimento!', 'info');
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
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 500;
            }

            .notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }

            .notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }

            .notification-warning {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
            }

            .notification-info {
                background: linear-gradient(135deg, var(--soft-purple), var(--primary-purple));
                color: white;
            }

            .notification i {
                font-size: 1.2rem;
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
