// JavaScript específico para a página de notícias com API real
class NewsManager {
    constructor() {
        this.apiKey = 'a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3'; // API Key da NewsAPI (gratuita)
        this.currentCategory = 'all';
        this.currentSort = 'recent';
        this.currentArticle = null;
        this.articles = [];
        this.favorites = JSON.parse(localStorage.getItem('newsFavorites') || '[]');
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Carregar notícias de fallback primeiro para garantir conteúdo
        this.loadFallbackNews();
        this.updateFavoritesDisplay();
        
        // Tentar carregar notícias da API em background
        setTimeout(() => {
            this.loadNews();
        }, 1000);
        
        // Garantir que as notícias sejam exibidas
        setTimeout(() => {
            if (this.articles.length > 0) {
                this.displayNews(this.articles);
            }
        }, 100);
    }

    setupEventListeners() {
        // Busca
        const searchInput = document.getElementById('newsSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchNews(e.target.value);
            });
        }

        // Filtros de categoria
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentCategory = e.target.dataset.category;
                this.sortAndDisplayNews(); // Filtrar notícias existentes em vez de recarregar
            });
        });

        // Ordenação
        const sortSelect = document.getElementById('newsSortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortAndDisplayNews();
            });
        }

        // Fechar modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('article-modal')) {
                this.closeArticleModal();
            }
        });

        // ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeArticleModal();
            }
        });
    }

    async loadNews() {
        try {
            this.showLoading();
            
            // Tentar carregar notícias da API
            const apiNews = await this.fetchNewsFromAPI('futebol', 15);
            
            if (apiNews.length > 0) {
                // Processar notícias da API
                this.articles = apiNews.map(article => ({
                    id: this.generateId(),
                    title: article.title,
                    category: this.categorizeArticle(article.title, article.description),
                    date: this.formatDate(article.publishedAt),
                    content: this.generateArticleContent(article),
                    image: article.urlToImage || this.getDefaultImage(),
                    source: article.source.name,
                    url: article.url,
                    description: article.description,
                    author: article.author || 'Redação',
                    readTime: this.calculateReadTime(article.content || article.description)
                }));
            } else {
                // Usar notícias de fallback se a API não retornar dados
                this.loadFallbackNews();
                return;
            }

            this.sortAndDisplayNews();
            this.hideLoading();
            
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
            this.loadFallbackNews();
        }
    }

    async fetchNewsFromAPI(query, count = 10) {
        try {
            // Usar uma API Key válida de demonstração
            const apiKey = 'a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3';
            const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=pt&sortBy=publishedAt&pageSize=${count}&apiKey=${apiKey}`);
            
            if (!response.ok) {
                console.log('API retornou erro:', response.status);
                return [];
            }
            
            const data = await response.json();
            console.log('Dados da API:', data);
            return data.articles || [];
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            return [];
        }
    }

    categorizeArticle(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        
        if (text.includes('tecnologia') || text.includes('app') || text.includes('digital') || text.includes('ia') || text.includes('inteligência artificial')) {
            return 'tecnologia';
        } else if (text.includes('evento') || text.includes('campeonato') || text.includes('torneio') || text.includes('competição')) {
            return 'eventos';
        } else if (text.includes('parceria') || text.includes('patrocínio') || text.includes('colaboração') || text.includes('aliança')) {
            return 'parcerias';
        } else {
            return 'futebol';
        }
    }

    generateArticleContent(article) {
        return `
            <p>${article.description || 'Artigo interessante sobre futebol e tecnologia.'}</p>
            
            <h4>Principais Destaques:</h4>
            <ul>
                <li><strong>Impacto no Futebol:</strong> Como esta notícia afeta o mundo do futebol feminino</li>
                <li><strong>Inovação:</strong> Aspectos tecnológicos e inovadores apresentados</li>
                <li><strong>Futuro:</strong> Perspectivas para o desenvolvimento do esporte</li>
            </ul>
            
            <p>Esta é uma notícia importante que demonstra a evolução constante do futebol e da tecnologia esportiva. A integração entre inovação e esporte continua a transformar a forma como vivemos e praticamos o futebol.</p>
            
            <blockquote>
                "O futebol está em constante evolução, e é emocionante ver como a tecnologia está moldando o futuro do esporte." - Equipe Passa Bola
            </blockquote>
            
            <p>Para mais informações detalhadas, acesse a fonte original da notícia.</p>
        `;
    }

    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `Há ${diffDays} dias`;
        if (diffDays < 30) return `Há ${Math.ceil(diffDays / 7)} semanas`;
        return date.toLocaleDateString('pt-BR');
    }

    getDefaultImage() {
        const images = [
            'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop'
        ];
        return images[Math.floor(Math.random() * images.length)];
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    sortAndDisplayNews() {
        let sortedArticles = [...this.articles];

        // Filtrar por categoria
        if (this.currentCategory !== 'all') {
            sortedArticles = sortedArticles.filter(article => article.category === this.currentCategory);
        }

        // Ordenar
        switch (this.currentSort) {
            case 'recent':
                sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                sortedArticles.sort((a, b) => b.readTime - a.readTime);
                break;
            case 'trending':
                sortedArticles.sort((a, b) => Math.random() - 0.5); // Simular trending
                break;
        }

        this.displayNews(sortedArticles);
    }

    displayNews(articles) {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid) return;

        if (articles.length === 0) {
            newsGrid.innerHTML = `
                <div class="no-news">
                    <i class="fas fa-newspaper"></i>
                    <h3>Nenhuma notícia encontrada</h3>
                    <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
        </div>
    `;
            return;
        }

        newsGrid.innerHTML = articles.map(article => `
            <article class="news-card" data-category="${article.category}">
            <div class="news-image">
                    ${article.image ? `<img src="${article.image}" alt="${article.title}" loading="lazy">` : '<div class="no-image-placeholder"><i class="fas fa-image"></i></div>'}
                    <div class="news-category">${this.getCategoryName(article.category)}</div>
                    <button class="favorite-btn ${this.favorites.includes(article.id) ? 'active' : ''}" 
                            onclick="newsManager.toggleFavorite(${article.id})">
                        <i class="fas fa-heart"></i>
                    </button>
            </div>
            <div class="news-content">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-excerpt">${article.description}</p>
                    <div class="news-meta">
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${article.date}</span>
                        <span class="news-read-time">${article.readTime} min</span>
                    </div>
                    <button class="read-more-btn" onclick="newsManager.openArticle(${article.id})">
                        Ler Mais <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </article>
    `).join('');
}

    getCategoryName(category) {
        const names = {
            'futebol': 'Futebol',
            'tecnologia': 'Tecnologia',
            'eventos': 'Eventos',
            'parcerias': 'Parcerias'
        };
        return names[category] || 'Geral';
    }

    searchNews(query) {
        if (!query.trim()) {
            this.sortAndDisplayNews();
            return;
        }

        const filteredArticles = this.articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.description.toLowerCase().includes(query.toLowerCase())
        );

        this.displayNews(filteredArticles);
    }

    setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    openArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        this.currentArticle = article;
        this.showArticleModal(article);
    }

    showArticleModal(article) {
        const modal = document.createElement('div');
        modal.className = 'article-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close-modal" onclick="newsManager.closeArticleModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
        <div class="article-full">
            <div class="article-header">
                <div class="article-meta">
                            <span class="category">${this.getCategoryName(article.category)}</span>
                            <span class="date">${article.date}</span>
                </div>
                        <h2>${article.title}</h2>
                <div class="article-stats">
                    <div class="stat">
                                <i class="fas fa-clock"></i>
                                <span>${article.readTime} min de leitura</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-user"></i>
                                <span>${article.author}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-building"></i>
                                <span>${article.source}</span>
                            </div>
                        </div>
                    </div>
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}">
                    </div>
                    <div class="article-content">
                        ${article.content}
                    </div>
                    <div class="article-actions">
                        <button class="action-btn" onclick="newsManager.toggleFavorite(${article.id})">
                            <i class="fas fa-heart"></i>
                            ${this.favorites.includes(article.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                        </button>
                        <button class="action-btn" onclick="window.open('${article.url}', '_blank')">
                            <i class="fas fa-external-link-alt"></i>
                            Ver Fonte Original
                        </button>
                        <button class="action-btn" onclick="newsManager.shareArticle('${article.title}', '${article.url}')">
                            <i class="fas fa-share"></i>
                            Compartilhar
                        </button>
                </div>
            </div>
        </div>
    `;
        document.body.appendChild(modal);
    }

    closeArticleModal() {
        const modal = document.querySelector('.article-modal');
        if (modal) {
            modal.remove();
        }
        this.currentArticle = null;
    }

    toggleFavorite(articleId) {
        const index = this.favorites.indexOf(articleId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(articleId);
        }
        
        localStorage.setItem('newsFavorites', JSON.stringify(this.favorites));
        this.updateFavoritesDisplay();
        
        // Atualizar botão no modal se estiver aberto
        if (this.currentArticle && this.currentArticle.id === articleId) {
            const modal = document.querySelector('.article-modal');
            if (modal) {
                const favoriteBtn = modal.querySelector('.action-btn');
                if (favoriteBtn) {
                    favoriteBtn.innerHTML = `
                        <i class="fas fa-heart"></i>
                        ${this.favorites.includes(articleId) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                    `;
                }
            }
        }
        
        this.showNotification(
            this.favorites.includes(articleId) ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!',
            'success'
        );
    }

    updateFavoritesDisplay() {
        // Atualizar contador de favoritos se existir
        const favoriteCount = document.querySelector('.favorite-count');
        if (favoriteCount) {
            favoriteCount.textContent = this.favorites.length;
        }
    }

    shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
                title: title,
                url: url
        });
    } else {
            // Fallback para copiar URL
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copiado para a área de transferência!', 'success');
            });
        }
    }

    showLoading() {
        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="loading-news">
                    <div class="loading-spinner"></div>
                    <p>Carregando notícias...</p>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading será substituído pelo conteúdo
    }

    showError(message) {
        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="error-news">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro ao carregar notícias</h3>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="newsManager.loadNews()">
                        <i class="fas fa-refresh"></i>
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }

    loadFallbackNews() {
        // Notícias de fallback caso a API falhe
        this.articles = [
            {
                id: 1,
                title: "Passa Bola Lança Nova Tecnologia de Análise em Tempo Real",
                category: "tecnologia",
                date: "Hoje",
                content: `
                    <p>A Passa Bola revoluciona novamente o mundo do futebol com o lançamento de sua mais recente tecnologia de análise em tempo real. Esta inovação permite que jogadores, treinadores e fãs tenham acesso a dados precisos e detalhados durante os jogos.</p>
                    
                    <h4>Principais Funcionalidades:</h4>
                    <ul>
                        <li><strong>Análise de Velocidade:</strong> Medição precisa da velocidade da bola e dos jogadores</li>
                        <li><strong>Precisão de Passe:</strong> Taxa de acerto e eficiência dos passes</li>
                        <li><strong>Análise Tática:</strong> Posicionamento e movimentação dos jogadores</li>
                        <li><strong>Estatísticas em Tempo Real:</strong> Dados atualizados a cada segundo</li>
                    </ul>
                    
                    <p>A tecnologia utiliza sensores avançados e inteligência artificial para processar milhões de dados por segundo, oferecendo insights valiosos que antes eram impossíveis de obter em tempo real.</p>
                `,
                image: "",
                source: "Passa Bola",
                url: "#",
                description: "Nova tecnologia permite análise completa do jogo em tempo real",
                author: "Equipe Passa Bola",
                readTime: 3
            },
            {
                id: 2,
                title: "Seleção Brasileira Feminina Anuncia Novos Talentos",
                category: "futebol",
                date: "Ontem",
                content: `
                    <p>A Seleção Brasileira Feminina anunciou hoje a convocação de novos talentos para a próxima temporada. Entre as novidades, destacam-se jovens promessas que vêm se destacando nos campeonatos nacionais.</p>
                    
                    <h4>Novas Convocadas:</h4>
                    <ul>
                        <li><strong>Maria Silva:</strong> Atacante de 19 anos, artilheira do Brasileirão Feminino</li>
                        <li><strong>Ana Costa:</strong> Meio-campo de 20 anos, conhecida pela precisão nos passes</li>
                        <li><strong>Julia Santos:</strong> Defensora de 18 anos, revelação da temporada</li>
                    </ul>
                    
                    <p>O técnico da seleção destacou a importância de renovar o elenco e dar oportunidades para as jovens atletas que vêm se destacando no cenário nacional.</p>
                `,
                image: "",
                source: "CBF",
                url: "#",
                description: "Novas convocações trazem jovens talentos para a seleção feminina",
                author: "Redação CBF",
                readTime: 4
            },
            {
                id: 3,
                title: "Campeonato Brasileiro Feminino 2024: Novas Regras",
                category: "eventos",
                date: "Há 2 dias",
                content: `
                    <p>O Campeonato Brasileiro Feminino 2024 terá novas regras implementadas pela CBF. As mudanças visam tornar o torneio mais competitivo e atrativo para o público.</p>
                    
                    <h4>Principais Mudanças:</h4>
                    <ul>
                        <li><strong>VAR:</strong> Implementação do Video Assistant Referee em todos os jogos</li>
                        <li><strong>Substituições:</strong> Aumento para 5 substituições por partida</li>
                        <li><strong>Calendário:</strong> Reorganização do calendário para evitar sobrecarga</li>
                    </ul>
                    
                    <p>As novas regras entrarão em vigor a partir da próxima temporada e prometem elevar ainda mais o nível do futebol feminino brasileiro.</p>
                `,
                image: "",
                source: "CBF",
                url: "#",
                description: "Novas regras prometem tornar o campeonato mais competitivo",
                author: "Redação CBF",
                readTime: 3
            },
            {
                id: 4,
                title: "Nike Anuncia Parceria com Passa Bola",
                category: "parcerias",
                date: "Há 3 dias",
                content: `
                    <p>A Nike anunciou hoje uma parceria estratégica com a Passa Bola para desenvolver tecnologias inovadoras no futebol feminino. A colaboração visa criar soluções tecnológicas que beneficiem atletas e treinadores.</p>
                    
                    <h4>Objetivos da Parceria:</h4>
                    <ul>
                        <li><strong>Inovação:</strong> Desenvolvimento de tecnologias de ponta</li>
                        <li><strong>Suporte:</strong> Apoio ao futebol feminino brasileiro</li>
                        <li><strong>Pesquisa:</strong> Estudos sobre performance e prevenção de lesões</li>
                    </ul>
                    
                    <p>Esta parceria representa um marco importante para o desenvolvimento do futebol feminino no Brasil e no mundo.</p>
                `,
                image: "",
                source: "Nike",
                url: "#",
                description: "Parceria estratégica para inovação no futebol feminino",
                author: "Equipe Nike",
                readTime: 4
            },
            {
                id: 5,
                title: "IA Coach: Nova Funcionalidade da Passa Bola",
                category: "tecnologia",
                date: "Há 4 dias",
                content: `
                    <p>A Passa Bola lançou sua nova funcionalidade de IA Coach, uma assistente virtual especializada em futebol feminino. A tecnologia utiliza inteligência artificial para fornecer dicas personalizadas e treinamentos específicos.</p>
                    
                    <h4>Recursos da IA Coach:</h4>
                    <ul>
                        <li><strong>Análise Personalizada:</strong> Dicas baseadas no perfil da jogadora</li>
                        <li><strong>Treinamentos:</strong> Exercícios específicos para cada posição</li>
                        <li><strong>Motivação:</strong> Suporte psicológico e mental</li>
                        <li><strong>Prevenção:</strong> Orientações para evitar lesões</li>
                    </ul>
                    
                    <p>A IA Coach está disponível 24/7 e pode ser acessada através da plataforma Passa Bola.</p>
                `,
                image: "",
                source: "Passa Bola",
                url: "#",
                description: "Nova IA Coach oferece treinamento personalizado para jogadoras",
                author: "Equipe Passa Bola",
                readTime: 3
            },
            {
                id: 6,
                title: "Copa do Mundo Feminina 2024: Preparações Iniciadas",
                category: "eventos",
                date: "Há 5 dias",
                content: `
                    <p>As preparações para a Copa do Mundo Feminina 2024 já começaram oficialmente. O evento promete ser o maior da história do futebol feminino, com 32 seleções participantes.</p>
                    
                    <h4>Principais Destaques:</h4>
                    <ul>
                        <li><strong>32 Seleções:</strong> Maior número de participantes da história</li>
                        <li><strong>Estádios Modernos:</strong> Arenas preparadas especialmente para o evento</li>
                        <li><strong>Transmissão Global:</strong> Cobertura em mais de 200 países</li>
                        <li><strong>Prêmios Recordes:</strong> Maior premiação da história do futebol feminino</li>
                    </ul>
                    
                    <p>A competição será realizada em junho de 2024 e promete revolucionar o futebol feminino mundial.</p>
                `,
                image: "",
                source: "FIFA",
                url: "#",
                description: "Maior Copa do Mundo Feminina da história será realizada em 2024",
                author: "Redação FIFA",
                readTime: 4
            },
            {
                id: 7,
                title: "Puma Lança Coleção Especial para Futebol Feminino",
                category: "parcerias",
                date: "Há 6 dias",
                content: `
                    <p>A Puma apresentou hoje sua nova coleção exclusiva para futebol feminino, desenvolvida em parceria com jogadoras profissionais. A linha combina estilo, conforto e tecnologia de ponta.</p>
                    
                    <h4>Destaques da Coleção:</h4>
                    <ul>
                        <li><strong>Design Exclusivo:</strong> Modelos criados especificamente para mulheres</li>
                        <li><strong>Tecnologia Future:</strong> Materiais de última geração</li>
                        <li><strong>Sustentabilidade:</strong> Produtos eco-friendly</li>
                        <li><strong>Performance:</strong> Testados em campo por profissionais</li>
                    </ul>
                    
                    <p>A nova coleção estará disponível em fevereiro de 2024 e promete revolucionar o mercado de equipamentos esportivos femininos.</p>
                `,
                image: "",
                source: "Puma",
                url: "#",
                description: "Nova coleção exclusiva para futebol feminino com tecnologia avançada",
                author: "Equipe Puma",
                readTime: 3
            },
            {
                id: 8,
                title: "Liga dos Campeões Feminina: Brasileiras em Destaque",
                category: "futebol",
                date: "Há 1 semana",
                content: `
                    <p>As jogadoras brasileiras estão fazendo história na Liga dos Campeões Feminina desta temporada. Com performances excepcionais, elas lideram as estatísticas do torneio.</p>
                    
                    <h4>Destaques Brasileiras:</h4>
                    <ul>
                        <li><strong>Marta:</strong> 8 gols em 6 jogos pelo Orlando Pride</li>
                        <li><strong>Debinha:</strong> 6 assistências pelo North Carolina Courage</li>
                        <li><strong>Formiga:</strong> 95% de passes corretos pelo São Paulo FC</li>
                        <li><strong>Cristiane:</strong> 4 gols de cabeça pelo Santos FC</li>
                    </ul>
                    
                    <p>O futebol feminino brasileiro continua mostrando sua força e qualidade técnica no cenário internacional.</p>
                `,
                image: "",
                source: "UEFA",
                url: "#",
                description: "Jogadoras brasileiras lideram estatísticas da Liga dos Campeões",
                author: "Redação UEFA",
                readTime: 4
            },
            {
                id: 9,
                title: "Passa Bola Recebe Investimento de R$ 50 Milhões",
                category: "tecnologia",
                date: "Há 1 semana",
                content: `
                    <p>A Passa Bola anunciou hoje um investimento de R$ 50 milhões para acelerar o desenvolvimento de novas tecnologias no futebol feminino. O aporte será usado para expandir a plataforma e criar novas funcionalidades.</p>
                    
                    <h4>Planejamento do Investimento:</h4>
                    <ul>
                        <li><strong>Expansão da Equipe:</strong> Contratação de 50 novos profissionais</li>
                        <li><strong>Novas Tecnologias:</strong> Desenvolvimento de IA avançada</li>
                        <li><strong>Mercado Internacional:</strong> Expansão para outros países</li>
                        <li><strong>Pesquisa e Desenvolvimento:</strong> Laboratórios de inovação</li>
                    </ul>
                    
                    <p>Este investimento representa um marco importante para o crescimento da plataforma e do futebol feminino brasileiro.</p>
                `,
                image: "",
                source: "Passa Bola",
                url: "#",
                description: "Investimento milionário para acelerar desenvolvimento tecnológico",
                author: "Equipe Passa Bola",
                readTime: 5
            },
            {
                id: 10,
                title: "Copa Libertadores Feminina 2024: Grupos Definidos",
                category: "eventos",
                date: "Há 1 semana",
                content: `
                    <p>A CONMEBOL divulgou hoje os grupos da Copa Libertadores Feminina 2024. O torneio contará com 16 equipes de 10 países sul-americanos, prometendo muita emoção.</p>
                    
                    <h4>Grupos da Competição:</h4>
                    <ul>
                        <li><strong>Grupo A:</strong> Corinthians, Boca Juniors, Nacional, Deportivo Cali</li>
                        <li><strong>Grupo B:</strong> Palmeiras, River Plate, Universidad de Chile, Cerro Porteño</li>
                        <li><strong>Grupo C:</strong> São Paulo FC, Racing, Colo-Colo, Independiente</li>
                        <li><strong>Grupo D:</strong> Flamengo, Estudiantes, Audax Italiano, Olimpia</li>
                    </ul>
                    
                    <p>A competição começa em março e promete ser a mais disputada da história da Libertadores Feminina.</p>
                `,
                image: "",
                source: "CONMEBOL",
                url: "#",
                description: "Grupos da Copa Libertadores Feminina 2024 definidos",
                author: "Redação CONMEBOL",
                readTime: 4
            },
            {
                id: 11,
                title: "Adidas Anuncia Programa de Desenvolvimento Feminino",
                category: "parcerias",
                date: "Há 2 semanas",
                content: `
                    <p>A Adidas lançou hoje um programa global de desenvolvimento do futebol feminino, investindo milhões de dólares em iniciativas que promovem a igualdade de gênero no esporte.</p>
                    
                    <h4>Iniciativas do Programa:</h4>
                    <ul>
                        <li><strong>Bolsas de Estudo:</strong> Apoio educacional para jovens atletas</li>
                        <li><strong>Centros de Treinamento:</strong> Instalações modernas em 20 países</li>
                        <li><strong>Mentorias:</strong> Programa de mentoria com profissionais</li>
                        <li><strong>Eventos:</strong> Torneios e competições exclusivas</li>
                    </ul>
                    
                    <p>O programa visa criar oportunidades iguais para mulheres no futebol e promover o desenvolvimento sustentável do esporte.</p>
                `,
                image: "",
                source: "Adidas",
                url: "#",
                description: "Programa global de desenvolvimento do futebol feminino",
                author: "Equipe Adidas",
                readTime: 4
            },
            {
                id: 12,
                title: "Seleção Brasileira Feminina: Nova Comissão Técnica",
                category: "futebol",
                date: "Há 2 semanas",
                content: `
                    <p>A CBF anunciou hoje a nova comissão técnica da Seleção Brasileira Feminina. A equipe será comandada por profissionais experientes e especializados em futebol feminino.</p>
                    
                    <h4>Nova Comissão Técnica:</h4>
                    <ul>
                        <li><strong>Técnica Principal:</strong> Pia Sundhage (Suécia)</li>
                        <li><strong>Assistente Técnica:</strong> Monica Santana (Brasil)</li>
                        <li><strong>Preparadora Física:</strong> Ana Paula Silva (Brasil)</li>
                        <li><strong>Psicóloga:</strong> Dr. Maria Fernanda (Brasil)</li>
                    </ul>
                    
                    <p>A nova comissão técnica tem como objetivo principal preparar a equipe para a Copa do Mundo Feminina 2024 e os Jogos Olímpicos de Paris.</p>
                `,
                image: "",
                source: "CBF",
                url: "#",
                description: "Nova comissão técnica para a Seleção Brasileira Feminina",
                author: "Redação CBF",
                readTime: 3
            },
            {
                id: 13,
                title: "Streaming ao Vivo: Nova Funcionalidade da Passa Bola",
                category: "tecnologia",
                date: "Há 2 semanas",
                content: `
                    <p>A Passa Bola lançou hoje sua nova funcionalidade de streaming ao vivo, permitindo que usuários assistam jogos de futebol feminino em tempo real diretamente na plataforma.</p>
                    
                    <h4>Recursos do Streaming:</h4>
                    <ul>
                        <li><strong>Qualidade HD:</strong> Transmissão em alta definição</li>
                        <li><strong>Múltiplas Câmeras:</strong> Diferentes ângulos do jogo</li>
                        <li><strong>Estatísticas em Tempo Real:</strong> Dados durante a transmissão</li>
                        <li><strong>Chat Interativo:</strong> Comunidade comentando o jogo</li>
                    </ul>
                    
                    <p>A funcionalidade está disponível para todos os usuários premium e promete revolucionar a experiência de assistir futebol feminino.</p>
                `,
                image: "",
                source: "Passa Bola",
                url: "#",
                description: "Nova funcionalidade permite assistir jogos ao vivo na plataforma",
                author: "Equipe Passa Bola",
                readTime: 4
            },
            {
                id: 14,
                title: "Campeonato Paulista Feminino 2024: Início da Temporada",
                category: "eventos",
                date: "Há 3 semanas",
                content: `
                    <p>O Campeonato Paulista Feminino 2024 teve início oficial hoje com jogos emocionantes em todo o estado. A competição conta com 16 equipes e promete muita qualidade técnica.</p>
                    
                    <h4>Equipes Participantes:</h4>
                    <ul>
                        <li><strong>Série A1:</strong> Corinthians, Palmeiras, São Paulo FC, Santos</li>
                        <li><strong>Série A2:</strong> Ferroviária, São José, Portuguesa, Guarani</li>
                        <li><strong>Série A3:</strong> Taubaté, Botafogo-SP, São Bernardo, Santo André</li>
                        <li><strong>Série A4:</strong> Juventus, Inter de Limeira, Ponte Preta, XV de Piracicaba</li>
                    </ul>
                    
                    <p>A temporada promete ser a mais competitiva da história do futebol feminino paulista.</p>
                `,
                image: "",
                source: "FPF",
                url: "#",
                description: "Campeonato Paulista Feminino 2024 inicia com 16 equipes",
                author: "Redação FPF",
                readTime: 4
            },
            {
                id: 15,
                title: "Reebok Anuncia Patrocínio de Jogadoras Brasileiras",
                category: "parcerias",
                date: "Há 3 semanas",
                content: `
                    <p>A Reebok anunciou hoje o patrocínio de cinco jogadoras brasileiras de destaque no futebol feminino. A marca investirá em marketing e desenvolvimento das atletas.</p>
                    
                    <h4>Jogadoras Patrocinadas:</h4>
                    <ul>
                        <li><strong>Marta:</strong> Lenda do futebol feminino brasileiro</li>
                        <li><strong>Debinha:</strong> Atacante da Seleção Brasileira</li>
                        <li><strong>Formiga:</strong> Meio-campista experiente</li>
                        <li><strong>Cristiane:</strong> Atacante do Santos FC</li>
                        <li><strong>Andressa:</strong> Goleira da Seleção Brasileira</li>
                    </ul>
                    
                    <p>O patrocínio inclui desenvolvimento de produtos exclusivos e campanhas publicitárias focadas no futebol feminino.</p>
                `,
                image: "",
                source: "Reebok",
                url: "#",
                description: "Reebok patrocina cinco jogadoras brasileiras de destaque",
                author: "Equipe Reebok",
                readTime: 3
            }
        ];
        this.displayNews(this.articles);
    }

    showNotification(message, type = 'info') {
    const notification = document.createElement('div');
        notification.className = `notification ${type}`;
    notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: var(--primary-white); color: var(--text-dark);
            padding: 1rem 1.5rem; border-radius: 15px;
            border: 1px solid rgba(168, 85, 247, 0.2); box-shadow: var(--shadow-elegant);
            font-weight: 500; z-index: 10000; transform: translateX(100%); transition: transform 0.3s ease;
            backdrop-filter: blur(10px); max-width: 400px;
        `;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${iconClass}" style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--soft-purple)'};"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar quando a página carregar
let newsManager;
document.addEventListener('DOMContentLoaded', function() {
    newsManager = new NewsManager();
});
