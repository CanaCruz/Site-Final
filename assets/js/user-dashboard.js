// Dashboard do Usuário - Passa Bola
class UserDashboard {
    constructor() {
        this.currentUser = AuthSystem.checkAuth();
        this.userStats = this.loadUserStats();
        this.init();
    }

    init() {
        // Verificar autenticação
        if (!this.currentUser) {
            window.location.href = '../index.html';
            return;
        }

        // Verificar se é usuário comum
        if (this.currentUser.role !== 'user') {
            window.location.href = 'admin-dashboard.html';
            return;
        }

        this.loadUserData();
        this.loadUserStats();
        this.loadRecentActivity();
        this.loadUpcomingGames();
        this.setupEventListeners();
    }

    loadUserData() {
        // Atualizar nome do usuário
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('welcomeName').textContent = this.currentUser.name;
    }

    loadUserStats() {
        const stats = this.getUserStats();
        
        // Atualizar estatísticas
        document.getElementById('gamesPlayed').textContent = stats.gamesPlayed;
        document.getElementById('gamesWon').textContent = stats.gamesWon;
        document.getElementById('userRating').textContent = stats.rating.toFixed(1);
        document.getElementById('totalHours').textContent = `${stats.totalHours}h`;
    }

    getUserStats() {
        const storedStats = localStorage.getItem(`passabola_user_stats_${this.currentUser.id}`);
        
        if (storedStats) {
            return JSON.parse(storedStats);
        }

        // Estatísticas padrão
        const defaultStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            rating: 5.0,
            totalHours: 0,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem(`passabola_user_stats_${this.currentUser.id}`, JSON.stringify(defaultStats));
        return defaultStats;
    }

    loadRecentActivity() {
        const activities = this.getRecentActivities();
        const activityList = document.getElementById('recentActivity');
        
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Nenhuma atividade recente</h4>
                        <p>Suas atividades aparecerão aqui</p>
                    </div>
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
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

    getRecentActivities() {
        const storedActivities = localStorage.getItem(`passabola_user_activities_${this.currentUser.id}`);
        return storedActivities ? JSON.parse(storedActivities) : [];
    }

    addActivity(title, description, icon = 'info-circle') {
        const activities = this.getRecentActivities();
        const newActivity = {
            id: Date.now(),
            title,
            description,
            icon,
            timestamp: new Date().toISOString()
        };

        activities.unshift(newActivity);
        
        // Manter apenas as últimas 10 atividades
        if (activities.length > 10) {
            activities.splice(10);
        }

        localStorage.setItem(`passabola_user_activities_${this.currentUser.id}`, JSON.stringify(activities));
        this.loadRecentActivity();
    }

    loadUpcomingGames() {
        const games = this.getUpcomingGames();
        const gamesList = document.getElementById('upcomingGames');
        
        if (games.length === 0) {
            gamesList.innerHTML = `
                <div class="game-card">
                    <div class="game-info">
                        <h4>Nenhum jogo próximo</h4>
                        <p>Marque um jogo para vê-lo aqui</p>
                    </div>
                </div>
            `;
            return;
        }

        gamesList.innerHTML = games.map(game => `
            <div class="game-card">
                <div class="game-info">
                    <h4>${game.title}</h4>
                    <p><i class="fas fa-calendar"></i> ${this.formatDate(game.date)}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${game.location}</p>
                </div>
                <div class="game-status">
                    <span class="status-badge ${game.status}">${this.getStatusText(game.status)}</span>
                </div>
            </div>
        `).join('');
    }

    getUpcomingGames() {
        const storedGames = localStorage.getItem(`passabola_user_games_${this.currentUser.id}`);
        return storedGames ? JSON.parse(storedGames) : [];
    }

    addUpcomingGame(gameData) {
        const games = this.getUpcomingGames();
        const newGame = {
            id: Date.now(),
            title: gameData.title,
            date: gameData.date,
            location: gameData.location,
            status: 'confirmed',
            timestamp: new Date().toISOString()
        };

        games.unshift(newGame);
        localStorage.setItem(`passabola_user_games_${this.currentUser.id}`, JSON.stringify(games));
        this.loadUpcomingGames();
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

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusText(status) {
        const statusTexts = {
            confirmed: 'Confirmado',
            pending: 'Pendente',
            cancelled: 'Cancelado'
        };
        return statusTexts[status] || 'Desconhecido';
    }

    setupEventListeners() {
        // Dropdown do usuário
        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            userDropdown.addEventListener('click', (e) => {
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
    }

    // Métodos para ações do usuário
    showProfile() {
        this.showNotification('Perfil em desenvolvimento!', 'info');
    }

    showSettings() {
        this.showNotification('Configurações em desenvolvimento!', 'info');
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
function showProfile() {
    userDashboard.showProfile();
}

function showSettings() {
    userDashboard.showSettings();
}

// Inicializar dashboard do usuário
const userDashboard = new UserDashboard();

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
