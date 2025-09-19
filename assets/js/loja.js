// JavaScript específico para a página da loja
class ShopManager {
    constructor() {
        this.products = [];
        this.cart = [];
        this.currentCategory = 'all';
        this.currentSort = 'popular';
        this.favorites = JSON.parse(localStorage.getItem('shopFavorites')) || [];
        this.isAdminMode = this.checkAdminMode();
        this.init();
    }

    checkAdminMode() {
        // Verificar se está em modo admin via URL ou localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminUrl = urlParams.get('admin') === 'true';
        const currentUser = JSON.parse(localStorage.getItem('passabola_current_user') || '{}');
        const isAdminUser = currentUser.role === 'admin';
        
        return isAdminUrl && isAdminUser;
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.loadCartFromStorage();
        this.updateCartDisplay();
        this.updateFavoritesDisplay();
        
        // Se estiver em modo admin, mostrar controles especiais
        if (this.isAdminMode) {
            this.showAdminControls();
        }
    }

    showAdminControls() {
        // Adicionar banner de modo admin
        const adminBanner = document.createElement('div');
        adminBanner.className = 'admin-banner';
        adminBanner.innerHTML = `
            <div class="admin-banner-content">
                <div class="admin-info">
                    <i class="fas fa-crown"></i>
                    <span>Modo Administrador - Gerenciamento da Loja</span>
                </div>
                <button class="btn-admin-exit" onclick="shopManager.exitAdminMode()">
                    <i class="fas fa-times"></i>
                    Sair do Modo Admin
                </button>
            </div>
        `;
        
        // Inserir banner no topo da página
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(adminBanner, mainContent.firstChild);
        }
        
        // Adicionar botão de adicionar produto
        const filtersContainer = document.querySelector('.filters-container');
        if (filtersContainer) {
            const addProductBtn = document.createElement('button');
            addProductBtn.className = 'btn-add-product-admin';
            addProductBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                Adicionar Produto
            `;
            addProductBtn.onclick = () => this.showAddProductModal();
            filtersContainer.appendChild(addProductBtn);
        }
        
        // Criar um produto de exemplo se não existir nenhum produto do admin
        this.createExampleProduct();
    }

    createExampleProduct() {
        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        
        // Verificar se já existe um produto de exemplo
        const hasExampleProduct = products.some(p => p.name === 'Produto de Exemplo Admin');
        
        if (!hasExampleProduct) {
            const exampleProduct = {
                id: Date.now().toString(),
                name: 'Produto de Exemplo Admin',
                description: 'Este é um produto criado automaticamente para demonstração do sistema de gerenciamento',
                price: 199.90,
                stock: 15,
                category: 'equipamentos',
                createdAt: new Date().toISOString(),
                published: true
            };
            
            products.push(exampleProduct);
            localStorage.setItem('passabola_products', JSON.stringify(products));
            
            // Recarregar produtos para mostrar o novo produto
            this.loadProducts();
            
            this.showNotification('Produto de exemplo criado! Agora você pode testar editar e excluir.', 'success');
        }
    }

    exitAdminMode() {
        // Remover parâmetro admin da URL e recarregar
        const url = new URL(window.location);
        url.searchParams.delete('admin');
        window.location.href = url.toString();
    }

    loadProducts() {
        // Carregar produtos padrão
        const defaultProducts = [
            {
                id: 1,
                name: "Kit de Treinamento Completo",
                category: "equipamentos",
                price: 299.90,
                originalPrice: 399.90,
                description: "Kit completo com cones, escadas de agilidade e equipamentos profissionais",
                rating: 5,
                ratingCount: 127,
                badge: "Novo",
                badgeType: "new",
                image: "",
                features: ["15 cones coloridos", "Escada de agilidade", "Bolas de treino", "Bolsa transportadora"]
            },
            {
                id: 2,
                name: "Óculos VR Training",
                category: "tecnologia",
                price: 599.90,
                originalPrice: 799.90,
                description: "Treinamento imersivo com realidade virtual para jogadores profissionais",
                rating: 4,
                ratingCount: 89,
                badge: "-25%",
                badgeType: "sale",
                image: "",
                features: ["Realidade virtual", "Simulação de jogos", "Análise de movimento", "Controle por gestos"]
            },
            {
                id: 3,
                name: "Smart Watch Esportivo",
                category: "acessorios",
                price: 149.90,
                originalPrice: null,
                description: "Relógio inteligente com GPS e monitoramento de performance",
                rating: 5,
                ratingCount: 203,
                badge: null,
                badgeType: null,
                image: "",
                features: ["GPS integrado", "Monitor cardíaco", "Resistente à água", "Bateria de 7 dias"]
            },
            {
                id: 4,
                name: "Camisa Técnica Esportiva",
                category: "uniformes",
                price: 89.90,
                originalPrice: null,
                description: "Camisa técnica com material respirável e design moderno",
                rating: 4,
                ratingCount: 156,
                badge: "Popular",
                badgeType: "popular",
                image: "",
                features: ["Material respirável", "Secagem rápida", "Design moderno", "Lavagem fácil"]
            },
            {
                id: 5,
                name: "Tênis Smart Pro",
                category: "equipamentos",
                price: 199.90,
                originalPrice: null,
                description: "Tênis com sensores de pressão e análise de movimento",
                rating: 5,
                ratingCount: 94,
                badge: null,
                badgeType: null,
                image: "",
                features: ["Sensores de pressão", "Análise de movimento", "Sola inteligente", "Conforto máximo"]
            },
            {
                id: 6,
                name: "Comunicador de Campo",
                category: "tecnologia",
                price: 399.90,
                originalPrice: null,
                description: "Sistema de comunicação sem fio para treinadores e jogadores",
                rating: 4,
                ratingCount: 67,
                badge: "Novo",
                badgeType: "new",
                image: "",
                features: ["Comunicação sem fio", "Alcance de 500m", "Resistente à água", "Bateria de 8 horas"]
            },
            {
                id: 7,
                name: "Tênis de Corrida Premium",
                category: "equipamentos",
                price: 249.90,
                originalPrice: 299.90,
                description: "Tênis de corrida com tecnologia de amortecimento e design moderno",
                rating: 5,
                ratingCount: 142,
                badge: "-17%",
                badgeType: "sale",
                image: "",
                features: ["Amortecimento avançado", "Material respirável", "Sola antiderrapante", "Design moderno"]
            },
            {
                id: 8,
                name: "Tablet Esportivo Pro",
                category: "tecnologia",
                price: 799.90,
                originalPrice: null,
                description: "Tablet profissional para análise de jogos e treinamentos",
                rating: 5,
                ratingCount: 45,
                badge: "Premium",
                badgeType: "premium",
                image: "",
                features: ["Tela 12 polegadas", "Processador rápido", "Resistente à água", "App esportivo incluído"]
            },
            {
                id: 9,
                name: "Kit de Treinamento",
                category: "equipamentos",
                price: 179.90,
                originalPrice: null,
                description: "Kit completo com cones, escadas e equipamentos de treinamento",
                rating: 4,
                ratingCount: 78,
                badge: null,
                badgeType: null,
                image: "",
                features: ["10 cones coloridos", "Escada de agilidade", "Bolas de treino", "Bolsa inclusa"]
            },
            {
                id: 10,
                name: "Fones de Ouvido Esportivos",
                category: "acessorios",
                price: 129.90,
                originalPrice: 159.90,
                description: "Fones de ouvido com cancelamento de ruído e qualidade premium",
                rating: 4,
                ratingCount: 89,
                badge: "-19%",
                badgeType: "sale",
                image: "",
                features: ["Cancelamento de ruído", "Qualidade premium", "Resistente à água", "Bateria de 20 horas"]
            },
            {
                id: 11,
                name: "Uniforme Completo",
                category: "uniformes",
                price: 199.90,
                originalPrice: null,
                description: "Kit completo com camisa, short e meião para times",
                rating: 5,
                ratingCount: 156,
                badge: "Combo",
                badgeType: "combo",
                image: "",
                features: ["Camisa personalizada", "Short esportivo", "Meião técnico", "Personalização grátis"]
            },
            {
                id: 12,
                name: "Câmera de Campo",
                category: "tecnologia",
                price: 499.90,
                originalPrice: null,
                description: "Câmera 4K para análise de jogos e treinamentos",
                rating: 5,
                ratingCount: 67,
                badge: "Pro",
                badgeType: "pro",
                image: "",
                features: ["Gravação 4K", "Estabilização", "Zoom óptico", "Armazenamento em nuvem"]
            },
            {
                id: 13,
                name: "Bola de Treino",
                category: "equipamentos",
                price: 79.90,
                originalPrice: null,
                description: "Bola oficial para treinamentos e práticas",
                rating: 4,
                ratingCount: 234,
                badge: null,
                badgeType: null,
                image: "",
                features: ["Material premium", "Durabilidade", "Grip superior", "Tamanho oficial"]
            },
            {
                id: 14,
                name: "Relógio Esportivo Digital",
                category: "acessorios",
                price: 99.90,
                originalPrice: 129.90,
                description: "Relógio digital com cronômetro e alarmes para treinos",
                rating: 4,
                ratingCount: 112,
                badge: "-23%",
                badgeType: "sale",
                image: "",
                features: ["Cronômetro preciso", "Alarmes múltiplos", "Resistente à água", "Bateria de 2 anos"]
            },
            {
                id: 15,
                name: "Moletom Esportivo",
                category: "uniformes",
                price: 119.90,
                originalPrice: null,
                description: "Moletom com tecnologia de aquecimento e design moderno",
                rating: 5,
                ratingCount: 89,
                badge: "Conforto",
                badgeType: "comfort",
                image: "",
                features: ["Tecnologia de aquecimento", "Material macio", "Design moderno", "Lavagem fácil"]
            }
        ];

        // Carregar produtos criados pelo admin (apenas os publicados)
        const adminProducts = JSON.parse(localStorage.getItem('passabola_products') || '[]')
            .filter(product => product.published === true); // Só produtos publicados
        
        // Converter produtos do admin para o formato da loja
        const convertedAdminProducts = adminProducts.map(product => ({
            id: parseInt(product.id) + 10000, // IDs únicos para produtos do admin
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: null,
            description: product.description,
            rating: 4, // Rating padrão
            ratingCount: Math.floor(Math.random() * 50) + 10, // Rating count aleatório
            badge: "Admin",
            badgeType: "admin",
            image: "",
            features: ["Produto criado pelo admin", "Qualidade garantida", "Suporte especializado"],
            stock: product.stock,
            adminCreated: true,
            adminId: product.id
        }));

        // Combinar produtos padrão com produtos do admin
        this.products = [...defaultProducts, ...convertedAdminProducts];
        
        this.displayProducts();
    }

    setupEventListeners() {
    // Filtros de categoria
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentCategory = e.target.dataset.category;
                this.filterAndSortProducts();
        });
    });

    // Busca
    const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
    });
        }

    // Ordenação
    const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.filterAndSortProducts();
            });
        }
    }

    setActiveFilter(activeBtn) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        this.displayProducts(filteredProducts);
    }

    filterAndSortProducts() {
        let filteredProducts = [...this.products];

        // Filtrar por categoria
        if (this.currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === this.currentCategory
            );
        }

        // Ordenar
        switch (this.currentSort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => {
                    const aIsNew = a.badgeType === 'new';
                    const bIsNew = b.badgeType === 'new';
                return bIsNew - aIsNew;
                });
                break;
            case 'popular':
            default:
                filteredProducts.sort((a, b) => b.ratingCount - a.ratingCount);
                break;
        }

        this.displayProducts(filteredProducts);
    }

    displayProducts(products = this.products) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card ${this.isAdminMode ? 'admin-mode' : ''}" data-category="${product.category}" data-price="${product.price}">
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : '<div class="no-image-placeholder"><i class="fas fa-image"></i></div>'}
                    ${product.badge ? `<div class="product-badge ${product.badgeType}">${product.badge}</div>` : ''}
                    <div class="product-actions">
                        ${this.isAdminMode ? `
                            <button class="action-btn admin-btn" onclick="shopManager.editProductAdmin(${product.id})" title="Editar Produto">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn admin-btn" onclick="shopManager.deleteProductAdmin(${product.id})" title="Excluir Produto">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : `
                            <button class="action-btn" onclick="shopManager.toggleWishlist(${product.id})">
                                <i class="fas fa-heart ${this.favorites.includes(product.id) ? 'active' : ''}"></i>
                            </button>
                            <button class="action-btn" onclick="shopManager.quickView(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        `}
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.ratingCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                        ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                    </div>
                    ${this.isAdminMode ? `
                        ${product.adminCreated ? `
                            <div class="admin-product-controls">
                                <button class="btn-admin-edit" onclick="shopManager.editProductAdmin(${product.id})">
                                    <i class="fas fa-edit"></i>
                                    Editar
                                </button>
                                <button class="btn-admin-delete" onclick="shopManager.deleteProductAdmin(${product.id})">
                                    <i class="fas fa-trash"></i>
                                    Excluir
                                </button>
                            </div>
                        ` : `
                            <div class="product-info-standard">
                                <span class="standard-product-label">Produto Padrão</span>
                                <span class="standard-product-info">Produto do sistema - não editável</span>
                            </div>
                        `}
                    ` : `
                        <button class="btn-add-cart" onclick="shopManager.addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Adicionar ao Carrinho
                        </button>
                    `}
                </div>
            </div>
        `).join('');
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    toggleWishlist(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(productId);
        }
        localStorage.setItem('shopFavorites', JSON.stringify(this.favorites));
        this.updateFavoritesDisplay();
        this.displayProducts();
        
        const product = this.products.find(p => p.id === productId);
        const message = this.favorites.includes(productId) ? 
            `${product.name} adicionado aos favoritos` : 
            `${product.name} removido dos favoritos`;
        this.showNotification(message, 'success');
    }

    updateFavoritesDisplay() {
        // Atualizar ícones de favoritos nos produtos
        const heartIcons = document.querySelectorAll('.action-btn .fa-heart');
        heartIcons.forEach(icon => {
            const productCard = icon.closest('.product-card');
            const productId = parseInt(productCard.querySelector('.btn-add-cart').onclick.toString().match(/\d+/)[0]);
            if (this.favorites.includes(productId)) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }

    quickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${product.name}</h3>
                    <button class="close-modal" onclick="this.closest('.quick-view-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="product-image-large">
                        ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div class="no-image-placeholder-large"><i class="fas fa-image"></i></div>'}
                    </div>
                    <div class="product-details">
                        <p class="product-description">${product.description}</p>
                        <div class="product-rating">
                            <div class="stars">
                                ${this.generateStars(product.rating)}
                            </div>
                            <span class="rating-count">(${product.ratingCount} avaliações)</span>
                        </div>
                        <div class="product-features">
                            <h4>Características:</h4>
                            <ul>
                                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="product-price">
                            <span class="current-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                            ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                        </div>
                        <button class="btn-add-cart" onclick="shopManager.addToCart(${product.id}); this.closest('.quick-view-modal').remove();">
                            <i class="fas fa-shopping-cart"></i>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showNotification(`${product.name} adicionado ao carrinho!`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCartToStorage();
                this.updateCartDisplay();
            }
        }
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('shopCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCartToStorage() {
        localStorage.setItem('shopCart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
        const floatingCart = document.getElementById('floatingCart');
    
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        if (floatingCart) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            floatingCart.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        if (cartItems) {
            if (this.cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    } else {
                cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="item-image">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="no-image-placeholder-small"><i class="fas fa-image"></i></div>'}
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                            <p class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                            <div class="quantity-controls">
                                <button onclick="shopManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="shopManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                </div>
                        <button class="remove-item" onclick="shopManager.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
            </div>
        `).join('');
    }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toFixed(2).replace('.', ',');
        }
    }

    toggleCart() {
    const cartModal = document.getElementById('cartModal');
        if (cartModal) {
    cartModal.classList.toggle('active');
}
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Seu carrinho está vazio!', 'error');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.showNotification(`Compra finalizada! Total: R$ ${total.toFixed(2).replace('.', ',')}`, 'success');
        
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.toggleCart();
    }

    // Funções de Admin para Gerenciar Produtos
    showAddProductModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 10000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: rgba(0, 0, 0, 0.5) !important;
            padding: 1rem !important;
            box-sizing: border-box !important;
            margin: 0 !important;
        `;
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Adicionar Novo Produto</h3>
                    <button class="modal-close" onclick="this.closest('.admin-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="admin-form" onsubmit="shopManager.createProduct(event)">
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
                            <button type="button" class="btn-secondary" onclick="this.closest('.admin-modal').remove()">Cancelar</button>
                            <button type="submit" class="btn-primary">Criar Produto</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
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
            published: true
        };

        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        products.push(productData);
        localStorage.setItem('passabola_products', JSON.stringify(products));

        this.showNotification('Produto criado com sucesso!', 'success');
        this.loadProducts(); // Recarregar produtos
        event.target.closest('.admin-modal').remove();
    }

    editProductAdmin(productId) {
        console.log('Editando produto com ID:', productId);
        
        // Encontrar o produto na lista atual da loja
        const currentProduct = this.products.find(p => p.id === productId);
        if (!currentProduct) {
            this.showNotification('Produto não encontrado na loja!', 'error');
            return;
        }
        
        // Se é um produto do admin, converter ID
        let adminId;
        if (currentProduct.adminCreated) {
            adminId = currentProduct.adminId;
        } else {
            // Produto padrão - não pode ser editado
            this.showNotification('Apenas produtos criados pelo admin podem ser editados!', 'error');
            return;
        }
        
        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        const product = products.find(p => p.id === adminId);
        
        if (!product) {
            this.showNotification('Produto não encontrado no sistema!', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 10000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: rgba(0, 0, 0, 0.5) !important;
            padding: 1rem !important;
            box-sizing: border-box !important;
            margin: 0 !important;
        `;
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Editar Produto</h3>
                    <button class="modal-close" onclick="this.closest('.admin-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="admin-form" onsubmit="shopManager.updateProduct(event, '${product.id}')">
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
                            <button type="button" class="btn-secondary" onclick="this.closest('.admin-modal').remove()">Cancelar</button>
                            <button type="submit" class="btn-primary">Atualizar Produto</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
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

        products[productIndex].name = formData.get('name');
        products[productIndex].description = formData.get('description');
        products[productIndex].price = parseFloat(formData.get('price'));
        products[productIndex].stock = parseInt(formData.get('stock'));
        products[productIndex].category = formData.get('category');
        products[productIndex].updatedAt = new Date().toISOString();

        localStorage.setItem('passabola_products', JSON.stringify(products));

        this.showNotification('Produto atualizado com sucesso!', 'success');
        this.loadProducts(); // Recarregar produtos
        event.target.closest('.admin-modal').remove();
    }

    deleteProductAdmin(productId) {
        console.log('Excluindo produto com ID:', productId);
        
        // Encontrar o produto na lista atual da loja
        const currentProduct = this.products.find(p => p.id === productId);
        if (!currentProduct) {
            this.showNotification('Produto não encontrado na loja!', 'error');
            return;
        }
        
        // Se é um produto do admin, converter ID
        let adminId;
        if (currentProduct.adminCreated) {
            adminId = currentProduct.adminId;
        } else {
            // Produto padrão - não pode ser excluído
            this.showNotification('Apenas produtos criados pelo admin podem ser excluídos!', 'error');
            return;
        }
        
        const products = JSON.parse(localStorage.getItem('passabola_products') || '[]');
        const product = products.find(p => p.id === adminId);
        
        if (!product) {
            this.showNotification('Produto não encontrado no sistema!', 'error');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
            const filteredProducts = products.filter(p => p.id !== adminId);
            localStorage.setItem('passabola_products', JSON.stringify(filteredProducts));

            this.showNotification('Produto excluído com sucesso!', 'success');
            this.loadProducts(); // Recarregar produtos
        }
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

// Funções globais para compatibilidade com HTML
let shopManager;

document.addEventListener('DOMContentLoaded', function() {
    shopManager = new ShopManager();
});

// Função para recarregar produtos (chamada pelo admin dashboard)
function reloadShopProducts() {
    if (shopManager) {
        shopManager.loadProducts();
    }
}

// Funções globais para os botões do HTML
function toggleCart() {
    if (shopManager) shopManager.toggleCart();
}

function toggleWishlist(element) {
    // Esta função será chamada pelo HTML, mas agora é gerenciada pela classe
    const productCard = element.closest('.product-card');
    const productId = parseInt(productCard.querySelector('.btn-add-cart').onclick.toString().match(/\d+/)[0]);
    if (shopManager) shopManager.toggleWishlist(productId);
}

function quickView(productId) {
    if (shopManager) shopManager.quickView(productId);
}

function addToCart(productId) {
    if (shopManager) shopManager.addToCart(productId);
}

function checkout() {
    if (shopManager) shopManager.checkout();
}

function changePage(direction) {
    // Implementar paginação se necessário
    console.log('Paginação:', direction);
}