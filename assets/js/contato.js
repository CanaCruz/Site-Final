// JavaScript específico para a página de contato
document.addEventListener('DOMContentLoaded', function() {
    // Validação e interatividade do formulário
    const form = document.getElementById('contactForm');
    const inputs = document.querySelectorAll('.futuristic-form input, .futuristic-form textarea, .futuristic-form select');
    
    // Efeito de foco nos inputs
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Verificar se já tem valor ao carregar
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Validação em tempo real
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
    
    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Validação de campo individual
    function validateField(field) {
        const value = field.value.trim();
        const fieldContainer = field.parentElement;
        let isValid = true;
        let errorMessage = '';
        
        // Remover classes de erro anteriores
        fieldContainer.classList.remove('error', 'success');
        
        // Validações específicas
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'E-mail inválido';
                break;
                
            case 'tel':
                const phoneRegex = /^[\d\s\(\)\-\+]+$/;
                isValid = phoneRegex.test(value) || value === '';
                errorMessage = 'Telefone inválido';
                break;
                
            default:
                if (field.required && value === '') {
                    isValid = false;
                    errorMessage = 'Campo obrigatório';
                }
        }
        
        // Aplicar classes de validação
        if (value !== '') {
            if (isValid) {
                fieldContainer.classList.add('success');
            } else {
                fieldContainer.classList.add('error');
                showFieldError(fieldContainer, errorMessage);
            }
        }
        
        return isValid;
    }
    
    // Mostrar erro do campo
    function showFieldError(container, message) {
        // Remover erro anterior
        const existingError = container.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Adicionar novo erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        container.appendChild(errorDiv);
    }
    
    // Validação completa do formulário
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        // Validar checkbox
        const checkbox = document.getElementById('aceito');
        if (!checkbox.checked) {
            isValid = false;
            showNotification('Você deve aceitar os termos para continuar', 'error');
        }
        
        return isValid;
    }
    
    // Submissão do formulário
    function submitForm() {
        const submitBtn = document.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('span');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Mostrar loading
        submitBtn.classList.add('loading');
        btnText.style.opacity = '0';
        btnLoading.style.opacity = '1';
        
        // Simular envio (substitua por sua lógica de envio real)
        setTimeout(() => {
            // Coletar dados do formulário
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simular envio bem-sucedido
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Resetar formulário
            form.reset();
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused', 'success', 'error');
            });
            
            // Remover loading
            submitBtn.classList.remove('loading');
            btnText.style.opacity = '1';
            btnLoading.style.opacity = '0';
            
            // Log dos dados (para desenvolvimento)
            console.log('Dados do formulário:', data);
            
        }, 2000);
    }
    
    // Efeito de hover nos cards de informação
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Efeito de digitação no título da página
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        const text = pageTitle.textContent;
        pageTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                pageTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Animações de entrada
    const animatedElements = document.querySelectorAll('.info-card, .contact-form-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});


// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     'fa-info-circle';
    
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
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${iconClass}" style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--soft-purple)'};"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
