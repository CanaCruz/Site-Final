// JavaScript específico para a página Marcar Jogo
let currentDate = new Date();
let scheduledGames = [];
let selectedGame = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeBooking();
    loadScheduledGames();
    generateCalendar();
    loadAvailableGames();
    setMinDate();
});

function initializeBooking() {
    // Validação e interatividade do formulário
    const form = document.getElementById('bookingForm');
    const inputs = document.querySelectorAll('.booking-form input, .booking-form textarea, .booking-form select');
    
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
    
    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateBookingForm()) {
            showBookingConfirmation();
        }
    });
    
    // Validação em tempo real
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

function setMinDate() {
    const dateInput = document.getElementById('gameDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldContainer = field.parentElement;
    let isValid = true;
    let errorMessage = '';
    
    // Remover classes de erro anteriores
    fieldContainer.classList.remove('error', 'success');
    
    // Validações específicas
    switch (field.type) {
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (value && selectedDate < today) {
                isValid = false;
                errorMessage = 'Data não pode ser no passado';
            }
            break;
            
        case 'time':
            if (value) {
                const [hours, minutes] = value.split(':');
                const gameTime = new Date();
                gameTime.setHours(parseInt(hours), parseInt(minutes));
                
                const now = new Date();
                const selectedDate = new Date(document.getElementById('gameDate').value);
                const isToday = selectedDate.toDateString() === now.toDateString();
                
                if (isToday && gameTime <= now) {
                    isValid = false;
                    errorMessage = 'Horário deve ser no futuro';
                }
            }
            break;
            
        case 'number':
            if (field.id === 'maxPlayers') {
                const num = parseInt(value);
                if (num < 2 || num > 22) {
                    isValid = false;
                    errorMessage = 'Entre 2 e 22 jogadores';
                }
            }
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

function validateBookingForm() {
    const inputs = document.querySelectorAll('.booking-form input[required], .booking-form select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showBookingConfirmation() {
    const formData = new FormData(document.getElementById('bookingForm'));
    const data = Object.fromEntries(formData);
    
    selectedGame = data;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="booking-summary">
            <h4>Resumo do Jogo</h4>
            <div class="summary-item">
                <strong>Título:</strong> ${data.gameTitle}
            </div>
            <div class="summary-item">
                <strong>Tipo:</strong> ${getGameTypeName(data.gameType)}
            </div>
            <div class="summary-item">
                <strong>Data:</strong> ${formatDate(data.gameDate)}
            </div>
            <div class="summary-item">
                <strong>Horário:</strong> ${data.gameTime}
            </div>
            <div class="summary-item">
                <strong>Local:</strong> ${getLocationName(data.location)}
            </div>
            <div class="summary-item">
                <strong>Máximo de Jogadores:</strong> ${data.maxPlayers}
            </div>
            <div class="summary-item">
                <strong>Tipo:</strong> ${data.publicGame ? 'Público' : 'Privado'}
            </div>
            ${data.gameDescription ? `
                <div class="summary-item">
                    <strong>Descrição:</strong> ${data.gameDescription}
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('bookingModal').classList.add('active');
}

function confirmBooking() {
    const submitBtn = document.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('span');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (!selectedGame) {
        showNotification('Erro: dados do jogo não encontrados!', 'error');
        return;
    }
    
    // Mostrar loading
    submitBtn.classList.add('loading');
    btnText.style.opacity = '0';
    btnLoading.style.opacity = '1';
    
    // Simular criação do jogo
    setTimeout(() => {
        try {
            // Adicionar jogo à lista
            const newGame = {
                id: Date.now(),
                gameTitle: selectedGame.gameTitle,
                gameType: selectedGame.gameType,
                gameDate: selectedGame.gameDate,
                gameTime: selectedGame.gameTime,
                location: selectedGame.location,
                maxPlayers: parseInt(selectedGame.maxPlayers),
                gameDescription: selectedGame.gameDescription || '',
                publicGame: selectedGame.publicGame === 'on',
                createdAt: new Date().toISOString(),
                players: [],
                status: 'open'
            };
            
            scheduledGames.push(newGame);
            saveScheduledGames();
            
            // Resetar formulário
            const form = document.getElementById('bookingForm');
            if (form) {
                form.reset();
                const inputs = document.querySelectorAll('.booking-form input, .booking-form textarea, .booking-form select');
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused', 'success', 'error');
                });
            }
            
            // Atualizar displays
            generateCalendar();
            loadAvailableGames();
            
            // Fechar modal
            closeModal();
            
            showNotification('Jogo criado com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao criar jogo:', error);
            showNotification('Erro ao criar jogo. Tente novamente.', 'error');
        } finally {
            // Remover loading
            submitBtn.classList.remove('loading');
            btnText.style.opacity = '1';
            btnLoading.style.opacity = '0';
        }
        
    }, 2000);
}

function closeModal() {
    const bookingModal = document.getElementById('bookingModal');
    const gameModal = document.getElementById('gameModal');
    
    if (bookingModal) {
        bookingModal.classList.remove('active');
    }
    if (gameModal) {
        gameModal.style.display = 'none';
        // Limpar o conteúdo do modal
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = '';
        }
    }
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthElement) {
        console.error('Elementos do calendário não encontrados');
        return;
    }
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Atualizar título do mês
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Gerar calendário
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    let calendarHTML = '';
    
    // Dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Dias vazios do início
    for (let i = 0; i < startingDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayGames = getGamesForDate(dateStr);
        const gameCount = dayGames.length;
        
        let dayClass = 'calendar-day';
        if (gameCount > 0) {
            dayClass += gameCount >= 3 ? ' full' : ' booked';
        } else {
            dayClass += ' available';
        }
        
        calendarHTML += `
            <div class="${dayClass}" onclick="showDayGames('${dateStr}')">
                <span class="day-number">${day}</span>
                ${gameCount > 0 ? `<span class="game-count">${gameCount}</span>` : ''}
            </div>
        `;
    }
    
    calendarGrid.innerHTML = calendarHTML;
}

function getGamesForDate(dateStr) {
    return scheduledGames.filter(game => game.gameDate === dateStr);
}

function showDayGames(dateStr) {
    const games = getGamesForDate(dateStr);
    if (games.length === 0) {
        showNotification(`Nenhum jogo agendado para ${formatDate(dateStr)}`, 'info');
        return;
    }
    
    const gameList = games.map(game => `
        <div class="day-game-item">
            <div class="game-time">${game.gameTime}</div>
            <div class="game-title">${game.gameTitle}</div>
            <div class="game-type">${getGameTypeName(game.gameType)}</div>
            <div class="game-players">${game.players ? game.players.length : 0}/${game.maxPlayers}</div>
        </div>
    `).join('');
    
    // Criar modal para mostrar jogos do dia
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="day-games-modal">
            <h4>Jogos do dia ${formatDate(dateStr)}</h4>
            <div class="day-games-list">
                ${gameList}
            </div>
        </div>
    `;
    
    document.getElementById('bookingModal').classList.add('active');
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

function loadAvailableGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    
    if (!gamesGrid) {
        console.error('Elemento gamesGrid não encontrado');
        return;
    }
    
    if (scheduledGames.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum jogo disponível no momento</p>
                <small>Crie o primeiro jogo!</small>
            </div>
        `;
        return;
    }
    
    const availableGames = scheduledGames.filter(game => {
        const gameDateTime = new Date(game.gameDate + 'T' + game.gameTime);
        const now = new Date();
        
        return game.status === 'open' && 
               game.players.length < parseInt(game.maxPlayers) &&
               gameDateTime > now;
    });
    
    if (availableGames.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-calendar-check"></i>
                <p>Todos os jogos estão lotados</p>
                <small>Verifique novamente mais tarde</small>
            </div>
        `;
        return;
    }
    
    gamesGrid.innerHTML = availableGames.map(game => `
        <div class="game-card">
            <div class="game-header">
                <h3>${game.gameTitle}</h3>
                <span class="game-type-badge">${getGameTypeName(game.gameType)}</span>
            </div>
            <div class="game-details">
                <div class="game-info">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(game.gameDate)}</span>
                </div>
                <div class="game-info">
                    <i class="fas fa-clock"></i>
                    <span>${game.gameTime}</span>
                </div>
                <div class="game-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${getLocationName(game.location)}</span>
                </div>
                <div class="game-info">
                    <i class="fas fa-users"></i>
                    <span>${game.players ? game.players.length : 0}/${game.maxPlayers} jogadores</span>
                </div>
            </div>
            ${game.gameDescription ? `
                <div class="game-description">
                    <p>${game.gameDescription}</p>
                </div>
            ` : ''}
            <div class="game-actions">
                <button class="btn-join" onclick="joinGame(${game.id})">
                    <i class="fas fa-user-plus"></i>
                    Participar
                </button>
                <button class="btn-details" onclick="showGameDetails(${game.id})">
                    <i class="fas fa-info-circle"></i>
                    Detalhes
                </button>
                <button class="btn-delete" onclick="deleteGame(${game.id})">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function joinGame(gameId) {
    const game = scheduledGames.find(g => g.id === gameId);
    
    if (!game) {
        showNotification('Jogo não encontrado!', 'error');
        return;
    }
    
    // Garantir que o array de players existe
    if (!game.players) {
        game.players = [];
    }
    
    if (game.players.length >= parseInt(game.maxPlayers)) {
        showNotification('Este jogo já está lotado!', 'error');
        return;
    }
    
    // Armazenar o gameId para usar no formulário
    window.currentGameId = gameId;
    
    // Mostrar modal simples
    const modal = document.getElementById('joinModal');
    modal.style.display = 'flex';
    
    // Limpar campos
    document.getElementById('playerName').value = '';
    document.getElementById('playerPosition').value = '';
}

function closeJoinModal() {
    const modal = document.getElementById('joinModal');
    modal.style.display = 'none';
}

function processSimpleJoin() {
    const gameId = window.currentGameId;
    const game = scheduledGames.find(g => g.id === gameId);
    
    if (!game) {
        showNotification('Jogo não encontrado!', 'error');
        return;
    }
    
    const playerName = document.getElementById('playerName').value.trim();
    const playerPosition = document.getElementById('playerPosition').value;
    
    if (!playerName || !playerPosition) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    // Adicionar jogador ao jogo
    game.players.push({
        id: Date.now(),
        name: playerName,
        position: playerPosition,
        joinedAt: new Date().toISOString()
    });
    
    // Salvar dados
    saveScheduledGames();
    generateCalendar();
    loadAvailableGames();
    
    // Fechar modal e mostrar sucesso
    closeJoinModal();
    showNotification(`Você foi adicionado ao jogo "${game.gameTitle}"!`, 'success');
}


function showGameDetails(gameId) {
    const game = scheduledGames.find(g => g.id === gameId);
    if (!game) return;
    
    // Contar jogadores por posição
    const positionCounts = {};
    const positions = ['goleiro', 'zagueiro', 'lateral', 'volante', 'meio-campo', 'atacante', 'qualquer'];
    
    // Inicializar contadores
    positions.forEach(pos => {
        positionCounts[pos] = 0;
    });
    
    // Contar jogadores por posição
    if (game.players) {
        game.players.forEach(player => {
            if (player.position && positionCounts.hasOwnProperty(player.position)) {
                positionCounts[player.position]++;
            }
        });
    }
    
    // Criar lista de jogadores com posições
    const playersList = game.players ? game.players.map(player => 
        `<div class="player-item">
            <span class="player-name">${player.name}</span>
            ${player.position ? `<span class="player-position">${getPositionName(player.position)}</span>` : ''}
        </div>`
    ).join('') : '';
    
    // Criar seção de vagas por posição
    const positionsSection = `
        <div class="positions-section">
            <strong>Vagas por Posição:</strong>
            <div class="positions-grid">
                ${positions.map(pos => `
                    <div class="position-item">
                        <span class="position-name">${getPositionName(pos)}</span>
                        <span class="position-count">${positionCounts[pos]}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="game-details-modal">
            <h4>${game.gameTitle}</h4>
            <div class="details-grid">
                <div class="detail-item">
                    <strong>Tipo:</strong> ${getGameTypeName(game.gameType)}
                </div>
                <div class="detail-item">
                    <strong>Data:</strong> ${formatDate(game.gameDate)}
                </div>
                <div class="detail-item">
                    <strong>Horário:</strong> ${game.gameTime}
                </div>
                <div class="detail-item">
                    <strong>Local:</strong> ${getLocationName(game.location)}
                </div>
                <div class="detail-item">
                    <strong>Total:</strong> ${game.players.length}/${game.maxPlayers} jogadores
                </div>
                <div class="detail-item">
                    <strong>Tipo:</strong> ${game.publicGame ? 'Público' : 'Privado'}
                </div>
            </div>
            ${game.gameDescription ? `
                <div class="description-section">
                    <strong>Descrição:</strong>
                    <p>${game.gameDescription}</p>
                </div>
            ` : ''}
            ${positionsSection}
            <div class="players-section">
                <strong>Jogadores Participantes:</strong>
                <div class="players-list">
                    ${playersList || '<p>Nenhum jogador ainda</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('bookingModal').classList.add('active');
}

function getPositionName(position) {
    const positionNames = {
        'goleiro': 'Goleiro',
        'zagueiro': 'Zagueiro',
        'lateral': 'Lateral',
        'volante': 'Volante',
        'meio-campo': 'Meio-Campo',
        'atacante': 'Atacante',
        'qualquer': 'Qualquer Posição'
    };
    return positionNames[position] || position;
}

function getGameTypeName(type) {
    const types = {
        'futebol': 'Futebol',
        'futsal': 'Futsal',
        'society': 'Society',
        'beach-soccer': 'Beach Soccer'
    };
    return types[type] || type;
}

function getLocationName(location) {
    const locations = {
        'campo-central': 'Campo Central',
        'quadra-society': 'Quadra Society',
        'campo-beach': 'Campo Beach Soccer',
        'quadra-futsal': 'Quadra Futsal'
    };
    return locations[location] || location;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function saveScheduledGames() {
    localStorage.setItem('passaBolaGames', JSON.stringify(scheduledGames));
}

function loadScheduledGames() {
    const savedGames = localStorage.getItem('passaBolaGames');
    if (savedGames) {
        scheduledGames = JSON.parse(savedGames);
    }
}

// Efeitos visuais
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de digitação no título
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
    const animatedElements = document.querySelectorAll('.booking-form-container, .calendar-container');
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
function deleteGame(gameId) {
    const game = scheduledGames.find(g => g.id === gameId);
    if (!game) {
        showNotification('Jogo não encontrado!', 'error');
        return;
    }
    
    // Mostrar modal de confirmação personalizado
    showDeleteConfirmation(game);
}

function showDeleteConfirmation(game) {
    // Criar modal de confirmação
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    modal.innerHTML = `
        <div class="delete-modal-content">
            <div class="delete-modal-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Confirmar Exclusão</h3>
            </div>
            <div class="delete-modal-body">
                <p>Tem certeza que deseja excluir o jogo:</p>
                <div class="game-to-delete">
                    <strong>"${game.gameTitle}"</strong>
                    <div class="game-info">
                        <span><i class="fas fa-calendar"></i> ${formatDate(game.gameDate)}</span>
                        <span><i class="fas fa-clock"></i> ${game.gameTime}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${getLocationName(game.location)}</span>
                    </div>
                </div>
                <p class="warning-text">Esta ação não pode ser desfeita.</p>
            </div>
            <div class="delete-modal-actions">
                <button class="btn-cancel-delete" onclick="closeDeleteConfirmation()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="btn-confirm-delete" onclick="confirmDeleteGame(${game.id})">
                    <i class="fas fa-trash"></i>
                    Excluir Jogo
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);
    
    // Fechar ao clicar fora do modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeDeleteConfirmation();
        }
    });
    
    // Fechar com tecla ESC
    const handleEscKey = function(e) {
        if (e.key === 'Escape') {
            closeDeleteConfirmation();
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    document.addEventListener('keydown', handleEscKey);
}

function confirmDeleteGame(gameId) {
    // Remover jogo da lista
    scheduledGames = scheduledGames.filter(g => g.id !== gameId);
    saveScheduledGames();
    
    // Atualizar displays
    generateCalendar();
    loadAvailableGames();
    
    // Fechar modal
    closeDeleteConfirmation();
    
    // Mostrar notificação de sucesso
    showNotification('Jogo excluído com sucesso!', 'success');
}

function closeDeleteConfirmation() {
    const modal = document.querySelector('.delete-confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
}

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
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        max-width: 400px;
        font-weight: 500;
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
