// IA Coach Personalizada - Integração com Google Gemini
class AICoach {
    constructor() {
        this.apiKey = 'AIzaSyDfV7Wcvxyx76FlgwrfFWopYNCKG8E7cYQ'; // API Key configurada
        this.conversationHistory = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadConversationHistory();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        const input = document.querySelector('.ai-input input');
        const sendBtn = document.querySelector('.send-ai-btn');
        const messagesContainer = document.querySelector('.ai-messages');

        // Enviar mensagem ao pressionar Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enviar mensagem ao clicar no botão
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Auto-scroll para a última mensagem
        const observer = new MutationObserver(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
        observer.observe(messagesContainer, { childList: true });
    }

    async sendMessage() {
        const input = document.querySelector('.ai-input input');
        const message = input.value.trim();

        if (!message) return;

        // API Key já configurada - prosseguir diretamente

        // Adicionar mensagem do usuário
        this.addUserMessage(message);
        input.value = '';

        // Mostrar indicador de digitação
        this.showTypingIndicator();

        try {
            // Enviar para a IA
            const response = await this.callGeminiAPI(message);
            
            // Remover indicador de digitação
            this.hideTypingIndicator();
            
            // Adicionar resposta da IA
            this.addAIMessage(response);
            
            // Salvar no histórico
            this.saveConversationHistory();
            
        } catch (error) {
            console.error('Erro ao comunicar com IA:', error);
            this.hideTypingIndicator();
            this.addAIMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.');
        }
    }

    async callGeminiAPI(message) {
        try {
            // Adicionar contexto de futebol feminino
            const systemPrompt = `Você é uma IA Coach especializada em futebol feminino. 
            Responda sempre em português de forma motivadora, técnica e amigável.
            Foque em:
            - Técnicas de futebol feminino
            - Treinamentos específicos para mulheres
            - Motivação e mentalidade esportiva
            - Prevenção de lesões
            - Nutrição esportiva feminina
            - Desenvolvimento de habilidades técnicas
            
            Seja sempre positiva, encorajadora e técnica. Use emojis ocasionalmente para tornar a conversa mais amigável.`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: `Você é uma IA Coach especializada em futebol feminino. Responda sempre em português de forma motivadora e técnica. Usuário: ${message}`
                    }]
                }]
            };

            console.log('Enviando requisição para Gemini API...');
            console.log('API Key:', this.apiKey ? 'Configurada' : 'Não configurada');
            console.log('API Key completa:', this.apiKey);

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                mode: 'cors'
            });

            console.log('Status da resposta:', response.status);
            console.log('Headers da resposta:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                throw new Error(`Erro na API: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Resposta da API:', data);

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Resposta inválida da API');
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Erro detalhado na API:', error);
            throw error;
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.querySelector('.ai-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
    }

    addAIMessage(message) {
        const messagesContainer = document.querySelector('.ai-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'ai-message';
        messageElement.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${this.formatMessage(message)}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
    }

    showTypingIndicator() {
        const messagesContainer = document.querySelector('.ai-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'ai-message typing-indicator';
        typingElement.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingElement);
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingElement = document.querySelector('.typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
        this.isTyping = false;
    }

    showWelcomeMessage() {
        // Verificar se já há mensagens
        const messagesContainer = document.querySelector('.ai-messages');
        if (messagesContainer.children.length === 0) {
            this.addAIMessage('Olá! Sou sua IA Coach personalizada! 💪 Estou aqui para te ajudar com treinamentos, técnicas de futebol feminino e motivação. Como posso te ajudar hoje?');
        }
    }


    loadConversationHistory() {
        // API Key já configurada no construtor
    }

    saveConversationHistory() {
        // Implementar salvamento do histórico se necessário
    }

    formatMessage(message) {
        // Formatar mensagem com quebras de linha e emojis
        return this.escapeHtml(message)
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Inicializar IA Coach quando a página carregar
let aiCoach;
document.addEventListener('DOMContentLoaded', function() {
    aiCoach = new AICoach();
});
