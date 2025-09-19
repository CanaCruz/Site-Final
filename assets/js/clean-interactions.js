/* ========================================
   INTERAÇÕES LIMPAS E PROFISSIONAIS
   ======================================== */

class CleanInteractions {
    constructor() {
        this.init();
        this.setupScrollEffects();
        this.setupHoverEffects();
        this.setupScrollAnimations();
    }

    init() {
        console.log('✨ Clean Interactions initialized');
        
        // Adicionar classes de animação aos elementos
        this.addAnimationClasses();
        
        // Configurar eventos de scroll otimizados
        this.setupOptimizedScrollEvents();
    }

    addAnimationClasses() {
        // Adicionar classes de animação aos elementos do hero
        const heroElements = [
            { selector: '.hero-title', delay: 0 },
            { selector: '.hero-subtitle', delay: 200 },
            { selector: '.hero-buttons', delay: 400 },
            { selector: '.hero-stats', delay: 600 }
        ];

        heroElements.forEach(({ selector, delay }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.8s ease-out';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            }
        });

        // Configurar animações de scroll para cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.classList.add('scroll-reveal');
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    setupScrollEffects() {
        // Efeito de scroll na navegação
        let ticking = false;

        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const nav = document.querySelector('.futuristic-nav');
            
            if (nav) {
                if (scrolled > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }

            ticking = false;
        };

        this.scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
    }

    setupHoverEffects() {
        // Efeitos de hover nos cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 8px 30px rgba(168, 85, 247, 0.2)';
                
                const icon = card.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.15)';
                
                const icon = card.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });

        // Efeitos nos botões
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Efeitos nas estatísticas
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px)';
                item.style.boxShadow = '0 8px 30px rgba(168, 85, 247, 0.2)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.15)';
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observar elementos com scroll-reveal
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    setupOptimizedScrollEvents() {
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    // Método para limpeza
    destroy() {
        window.removeEventListener('scroll', this.scrollHandler);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new CleanInteractions();
});

// Exportar para uso global
window.CleanInteractions = CleanInteractions;
