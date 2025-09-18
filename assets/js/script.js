// JavaScript para interatividade futurista
document.addEventListener('DOMContentLoaded', function() {
    // Menu Circular Futurista
    const menuToggle = document.getElementById('menuToggle');
    const menuItems = document.getElementById('menuItems');
    
    if (menuToggle && menuItems) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            menuItems.classList.toggle('active');
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !menuItems.contains(e.target)) {
                menuToggle.classList.remove('active');
                menuItems.classList.remove('active');
            }
        });
    }
    
    // Efeito de scroll suave
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Efeito parallax no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-particles');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .stat-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Funcionalidade de clique nos cards de recursos
    const featureCards = document.querySelectorAll('.feature-card.clickable');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            handleFeatureClick(feature);
        });
    });
    
    // Efeito de digitação no título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Partículas flutuantes interativas
    createFloatingParticles();
    
    // Efeito de brilho nos botões
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.5)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
});

// Função para criar partículas flutuantes
function createFloatingParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-purple);
            border-radius: 50%;
            opacity: 0.6;
            animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        heroSection.appendChild(particle);
    }
    
    // Adicionar CSS para animação das partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.6;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Função para scroll suave para seções
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Efeito de cursor personalizado
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Criar cursor personalizado
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--primary-purple), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.7;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    // Efeito de hover
    const hoverElements = document.querySelectorAll('a, button, .menu-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, var(--neon-pink), transparent)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, var(--primary-purple), transparent)';
        });
    });
}

// Inicializar cursor personalizado
createCustomCursor();

// Efeito de loading da página
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Sistema de notificações futurista
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-white);
        color: var(--text-dark);
        padding: 1rem 1.5rem;
        border-radius: 15px;
        border: 1px solid rgba(168, 85, 247, 0.2);
        box-shadow: var(--shadow-elegant);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-info-circle" style="color: var(--soft-purple);"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Efeito de brilho no logo
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', function() {
        this.style.textShadow = '0 0 20px var(--primary-purple), 0 0 40px var(--primary-purple)';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.textShadow = 'var(--shadow-neon)';
    });
}

// Animações de entrada para elementos específicos
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .stat-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Adicionar CSS para animação de entrada
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyle);

// Função para lidar com cliques nos cards de recursos
function handleFeatureClick(feature) {
    const featureData = {
        'analise': {
            title: 'Análise em Tempo Real',
            description: 'Acesse estatísticas detalhadas e análises avançadas de performance durante os jogos.',
            action: 'Ver Dashboard',
            page: 'pages/analise.html'
        },
        'comunidade': {
            title: 'Comunidade Global',
            description: 'Conecte-se com jogadores de todo o mundo, forme equipes e participe de discussões.',
            action: 'Entrar na Comunidade',
            page: 'pages/comunidade.html'
        },
        'competicoes': {
            title: 'Competições',
            description: 'Participe de torneios, campeonatos e eventos especiais com premiações incríveis.',
            action: 'Ver Competições',
            page: 'pages/competicoes.html'
        },
        'mobile': {
            title: 'App Mobile',
            description: 'Baixe nosso aplicativo móvel e tenha acesso completo a todas as funcionalidades.',
            action: 'Em Desenvolvimento',
            page: 'mobile',
            special: 'development'
        },
        'treinamento': {
            title: 'Treinamento Inteligente',
            description: 'Programas de treino personalizados com IA para melhorar sua performance no campo.',
            action: 'Começar Treino',
            page: 'pages/treinamento.html'
        },
        'streaming': {
            title: 'Streaming ao Vivo',
            description: 'Transmita seus jogos e acompanhe partidas de outros jogadores em tempo real.',
            action: 'Acessar YouTube',
            page: 'https://www.youtube.com/@passabola',
            special: 'external'
        }
    };

    const data = featureData[feature];
    if (data) {
        if (data.special === 'development') {
            showDevelopmentModal(data);
        } else if (data.special === 'external') {
            window.open(data.page, '_blank');
        } else {
            showFeatureModal(data);
        }
    }
}

// Função para mostrar modal de recurso
function showFeatureModal(data) {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'feature-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'feature-modal';
    modal.style.cssText = `
        background: var(--primary-white);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: var(--shadow-elegant);
        transform: scale(0.8);
        transition: transform 0.3s ease;
        border: 1px solid rgba(168, 85, 247, 0.2);
    `;

    modal.innerHTML = `
        <div class="modal-icon" style="
            width: 80px;
            height: 80px;
            background: var(--gradient-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 2rem;
            color: var(--primary-white);
        ">
            <i class="fas fa-${getFeatureIcon(data.title)}"></i>
        </div>
        <h2 style="
            color: var(--text-dark);
            margin-bottom: 1rem;
            font-family: 'Orbitron', monospace;
        ">${data.title}</h2>
        <p style="
            color: var(--text-gray);
            margin-bottom: 2rem;
            line-height: 1.6;
        ">${data.description}</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn-primary" onclick="window.location.href='${data.page}'" style="
                background: var(--gradient-primary);
                color: var(--primary-white);
                border: none;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-smooth);
            ">
                <i class="fas fa-arrow-right"></i>
                ${data.action}
            </button>
            <button class="btn-secondary" onclick="closeFeatureModal()" style="
                background: transparent;
                color: var(--soft-purple);
                border: 2px solid var(--soft-purple);
                padding: 1rem 2rem;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-smooth);
            ">
                <i class="fas fa-times"></i>
                Fechar
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 100);

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeFeatureModal();
        }
    });

    // Armazenar referência para fechamento
    window.currentFeatureModal = overlay;
}

// Função para fechar modal
function closeFeatureModal() {
    const overlay = window.currentFeatureModal;
    if (overlay) {
        overlay.style.opacity = '0';
        const modal = overlay.querySelector('.feature-modal');
        modal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            document.body.removeChild(overlay);
            window.currentFeatureModal = null;
        }, 300);
    }
}

// Função para mostrar modal de desenvolvimento
function showDevelopmentModal(data) {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'development-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'development-modal';
    modal.style.cssText = `
        background: var(--primary-white);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: var(--shadow-elegant);
        transform: scale(0.8);
        transition: transform 0.3s ease;
        border: 1px solid rgba(168, 85, 247, 0.2);
    `;

    modal.innerHTML = `
        <div class="modal-icon" style="
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #f59e0b, #fbbf24);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 2rem;
            color: var(--primary-white);
        ">
            <i class="fas fa-tools"></i>
        </div>
        <h2 style="
            color: var(--text-dark);
            margin-bottom: 1rem;
            font-family: 'Orbitron', monospace;
        ">${data.title}</h2>
        <div style="
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 1px solid #f59e0b;
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        ">
            <i class="fas fa-hammer" style="
                font-size: 2rem;
                color: #f59e0b;
                margin-bottom: 1rem;
            "></i>
            <h3 style="
                color: #92400e;
                margin-bottom: 0.5rem;
                font-family: 'Orbitron', monospace;
            ">Em Desenvolvimento</h3>
            <p style="
                color: #92400e;
                margin: 0;
                line-height: 1.6;
            ">Estamos trabalhando duro para trazer esta funcionalidade em breve!</p>
        </div>
        <p style="
            color: var(--text-gray);
            margin-bottom: 2rem;
            line-height: 1.6;
        ">${data.description}</p>
        <button class="btn-secondary" onclick="closeDevelopmentModal()" style="
            background: transparent;
            color: var(--soft-purple);
            border: 2px solid var(--soft-purple);
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-smooth);
        ">
            <i class="fas fa-times"></i>
            Fechar
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 100);

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeDevelopmentModal();
        }
    });

    // Armazenar referência para fechamento
    window.currentDevelopmentModal = overlay;
}

// Função para fechar modal de desenvolvimento
function closeDevelopmentModal() {
    const overlay = window.currentDevelopmentModal;
    if (overlay) {
        overlay.style.opacity = '0';
        const modal = overlay.querySelector('.development-modal');
        modal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            document.body.removeChild(overlay);
            window.currentDevelopmentModal = null;
        }, 300);
    }
}

// Função para obter ícone baseado no título
function getFeatureIcon(title) {
    const iconMap = {
        'Análise em Tempo Real': 'chart-line',
        'Comunidade Global': 'users',
        'Competições': 'trophy',
        'App Mobile': 'mobile-alt',
        'Treinamento Inteligente': 'dumbbell',
        'Streaming ao Vivo': 'video'
    };
    return iconMap[title] || 'star';
}


