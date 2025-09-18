// Sistema de Registro - Passa Bola
class RegisterSystem {
    constructor() {
        this.init();
    }

    init() {
        // Verificar se já está logado
        const currentUser = AuthSystem.checkAuth();
        if (currentUser) {
            this.redirectToDashboard();
            return;
        }

        // Event listeners
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Validação em tempo real
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const email = document.getElementById('email');

        // Validação de senha
        password.addEventListener('input', () => {
            this.validatePassword();
        });

        // Validação de confirmação de senha
        confirmPassword.addEventListener('input', () => {
            this.validatePasswordMatch();
        });

        // Validação de email
        email.addEventListener('input', () => {
            this.validateEmail();
        });
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        const passwordField = document.getElementById('password');
        
        if (password.length < 6) {
            passwordField.style.borderColor = '#ef4444';
            return false;
        } else {
            passwordField.style.borderColor = '#10b981';
            return true;
        }
    }

    validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmField = document.getElementById('confirmPassword');
        
        if (password !== confirmPassword) {
            confirmField.style.borderColor = '#ef4444';
            return false;
        } else {
            confirmField.style.borderColor = '#10b981';
            return true;
        }
    }

    validateEmail() {
        const email = document.getElementById('email').value;
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            emailField.style.borderColor = '#ef4444';
            return false;
        } else {
            emailField.style.borderColor = '#10b981';
            return true;
        }
    }

    async handleRegister() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const position = document.getElementById('position').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Validações
        if (!name || !email || !password || !confirmPassword || !position) {
            this.showNotification('Por favor, preencha todos os campos!', 'error');
            return;
        }

        if (!acceptTerms) {
            this.showNotification('Você deve aceitar os termos de uso!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('As senhas não coincidem!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        if (!this.validateEmail()) {
            this.showNotification('Por favor, insira um email válido!', 'error');
            return;
        }

        const registerBtn = document.querySelector('.login-btn');
        registerBtn.classList.add('loading');
        registerBtn.innerHTML = '<i class="fas fa-spinner"></i> Criando conta...';

        // Simular delay de registro
        await new Promise(resolve => setTimeout(resolve, 2000));

        const success = this.createUser(name, email, password, position);

        if (success) {
            this.showNotification('Conta criada com sucesso! Redirecionando...', 'success');
            
            setTimeout(() => {
                this.redirectToLogin();
            }, 1500);
        } else {
            this.showNotification('Este email já está em uso!', 'error');
            registerBtn.classList.remove('loading');
            registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Criar Conta';
        }
    }

    createUser(name, email, password, position) {
        const users = JSON.parse(localStorage.getItem('passabola_users') || '[]');
        
        // Verificar se email já existe
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return false;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            email: email.toLowerCase(),
            password: password,
            name: name,
            role: 'user',
            position: position,
            avatar: '⚽',
            createdAt: new Date().toISOString(),
            stats: {
                gamesPlayed: 0,
                gamesWon: 0,
                rating: 5.0,
                totalHours: 0
            }
        };

        users.push(newUser);
        localStorage.setItem('passabola_users', JSON.stringify(users));

        // Adicionar atividade de registro
        this.addRegistrationActivity(newUser);

        return true;
    }

    addRegistrationActivity(user) {
        const activities = JSON.parse(localStorage.getItem('passabola_admin_activities') || '[]');
        const newActivity = {
            id: Date.now(),
            title: 'Novo usuário cadastrado',
            description: `${user.name} se cadastrou no sistema`,
            icon: 'user-plus',
            timestamp: new Date().toISOString()
        };

        activities.unshift(newActivity);
        
        // Manter apenas as últimas 15 atividades
        if (activities.length > 15) {
            activities.splice(15);
        }

        localStorage.setItem('passabola_admin_activities', JSON.stringify(activities));
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    redirectToDashboard() {
        const currentUser = AuthSystem.checkAuth();
        if (currentUser.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
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

        // Remover após 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
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

// Função para alternar visibilidade da senha
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.querySelector('#password + .toggle-password i');
    
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

// Função para alternar visibilidade da confirmação de senha
function toggleConfirmPassword() {
    const passwordField = document.getElementById('confirmPassword');
    const toggleBtn = document.querySelector('#confirmPassword + .toggle-password i');
    
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

// Inicializar sistema de registro
const registerSystem = new RegisterSystem();

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

        .terms-link {
            color: var(--soft-purple);
            text-decoration: none;
            font-weight: 600;
        }

        .terms-link:hover {
            color: var(--primary-purple);
            text-decoration: underline;
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
