// Sistema de Login - Passa Bola
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.init();
    }

    init() {
        // Event listeners
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Enter key para login
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                this.handleLogin();
            }
        });
    }

    // Carregar usuários do localStorage
    loadUsers() {
        const defaultUsers = [
            {
                id: 1,
                email: 'admin@passabola.com',
                password: 'admin123',
                name: 'Administrador',
                role: 'admin',
                avatar: '👑',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                email: 'user@passabola.com',
                password: 'user123',
                name: 'Usuário',
                role: 'user',
                avatar: '⚽',
                createdAt: new Date().toISOString()
            }
        ];

        const storedUsers = localStorage.getItem('passabola_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            localStorage.setItem('passabola_users', JSON.stringify(defaultUsers));
            return defaultUsers;
        }
    }

    // Carregar usuário atual
    loadCurrentUser() {
        const user = localStorage.getItem('passabola_current_user');
        return user ? JSON.parse(user) : null;
    }

    // Salvar usuário atual
    saveCurrentUser(user) {
        localStorage.setItem('passabola_current_user', JSON.stringify(user));
    }

    // Salvar usuários
    saveUsers() {
        localStorage.setItem('passabola_users', JSON.stringify(this.users));
    }

    // Processar login
    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            this.showNotification('Por favor, preencha todos os campos!', 'error');
            return;
        }

        const loginBtn = document.querySelector('.login-btn');
        loginBtn.classList.add('loading');
        loginBtn.innerHTML = '<i class="fas fa-spinner"></i> Entrando...';

        // Simular delay de autenticação
        await new Promise(resolve => setTimeout(resolve, 1500));

        const user = this.authenticateUser(email, password);

        if (user) {
            this.currentUser = user;
            this.saveCurrentUser(user);
            
            if (rememberMe) {
                localStorage.setItem('passabola_remember_me', 'true');
            }

            this.showNotification(`Bem-vindo(a), ${user.name}!`, 'success');
            
            setTimeout(() => {
                this.redirectToDashboard();
            }, 1000);
        } else {
            this.showNotification('Email ou senha incorretos!', 'error');
            loginBtn.classList.remove('loading');
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        }
    }

    // Autenticar usuário
    authenticateUser(email, password) {
        return this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    }

    // Redirecionar para dashboard
    redirectToDashboard() {
        const currentPath = window.location.pathname;
        let dashboardPath;
        
        // Se estamos na raiz (index.html)
        if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '') {
            dashboardPath = `pages/${this.currentUser.role}-dashboard.html`;
        }
        // Se estamos em uma subpasta (pages/)
        else if (currentPath.includes('/pages/')) {
            dashboardPath = `${this.currentUser.role}-dashboard.html`;
        }
        // Fallback
        else {
            dashboardPath = `pages/${this.currentUser.role}-dashboard.html`;
        }
        
        window.location.href = dashboardPath;
    }

    // Preencher conta demo
    fillDemoAccount(type) {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');

        if (type === 'admin') {
            emailField.value = 'admin@passabola.com';
            passwordField.value = 'admin123';
        } else if (type === 'user') {
            emailField.value = 'user@passabola.com';
            passwordField.value = 'user123';
        }

        // Adicionar efeito visual
        emailField.style.borderColor = 'var(--soft-purple)';
        passwordField.style.borderColor = 'var(--soft-purple)';

        setTimeout(() => {
            emailField.style.borderColor = '';
            passwordField.style.borderColor = '';
        }, 1000);

        this.showNotification(`Conta ${type} preenchida!`, 'info');
    }


    // Mostrar notificação
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

    // Obter ícone da notificação
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Logout
    static logout() {
        localStorage.removeItem('passabola_current_user');
        localStorage.removeItem('passabola_remember_me');
        
        const currentPath = window.location.pathname;
        let homePath;
        
        // Se estamos na raiz (index.html)
        if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '') {
            homePath = 'index.html';
        }
        // Se estamos em uma subpasta (pages/)
        else if (currentPath.includes('/pages/')) {
            homePath = '../index.html';
        }
        // Fallback
        else {
            homePath = 'index.html';
        }
        
        window.location.href = homePath;
    }

    // Verificar autenticação
    static checkAuth() {
        const user = localStorage.getItem('passabola_current_user');
        return user ? JSON.parse(user) : null;
    }

    // Verificar se é admin
    static isAdmin() {
        const user = this.checkAuth();
        return user && user.role === 'admin';
    }

    // Verificar se é usuário
    static isUser() {
        const user = this.checkAuth();
        return user && user.role === 'user';
    }
}

// Função para alternar visibilidade da senha
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Função para preencher conta demo
function fillDemoAccount(type) {
    authSystem.fillDemoAccount(type);
}


// Inicializar sistema de autenticação
const authSystem = new AuthSystem();

// Adicionar estilos para notificações
const notificationStyles = `
    <style>
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
