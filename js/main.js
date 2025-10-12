// Main JavaScript for GameNest

document.addEventListener('DOMContentLoaded', function() {
    // Initialize music
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    // Enhanced automatic music playback
    function initializeMusic() {
        if (!backgroundMusic) return;
        
        // Set volume
        backgroundMusic.volume = 0.5;
        
        // Multiple strategies to play music automatically
        const playMusic = () => {
            backgroundMusic.play().then(() => {
                console.log("Music started automatically");
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                musicToggle.classList.remove('pulse');
            }).catch(error => {
                console.log("Automatic play failed:", error);
                // Show visual indicator that user needs to enable audio
                musicToggle.classList.add('pulse');
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            });
        };
        
        // Strategy 1: Try to play immediately (works in some browsers)
        playMusic();
        
        // Strategy 2: Try again after a short delay
        setTimeout(playMusic, 500);
        
        // Strategy 3: Use page visibility API to play when page becomes visible
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && backgroundMusic.paused) {
                setTimeout(playMusic, 300);
            }
        });
        
        // Strategy 4: Try on window focus
        window.addEventListener('focus', function() {
            if (backgroundMusic.paused) {
                setTimeout(playMusic, 200);
            }
        });
    }
    
    // Initialize music immediately when page loads
    initializeMusic();
    
    // Additional fallback: Try to play on any user interaction
    const interactiveElements = ['button', 'a', 'div', 'body'];
    interactiveElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('click', function() {
                if (backgroundMusic && backgroundMusic.paused) {
                    backgroundMusic.play().catch(e => console.log("Fallback play failed:", e));
                }
            }, { once: true });
        });
    });
    
    // Music toggle functionality
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                this.innerHTML = '<i class="fas fa-volume-up"></i>';
                this.classList.remove('pulse');
            }).catch(error => {
                console.log("Manual play failed:", error);
                this.innerHTML = '<i class="fas fa-volume-mute"></i>';
                this.classList.add('pulse');
            });
        } else {
            backgroundMusic.pause();
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Bot Assistant functionality
    const botToggle = document.getElementById('botToggle');
    const botAssistant = document.getElementById('botAssistant');
    const botClose = document.getElementById('botClose');
    
    if (botToggle && botAssistant) {
        botToggle.addEventListener('click', function() {
            botAssistant.classList.toggle('active');
        });
        
        botClose.addEventListener('click', function() {
            botAssistant.classList.remove('active');
        });
        
        // Close bot when clicking outside
        document.addEventListener('click', function(event) {
            if (!botAssistant.contains(event.target) && !botToggle.contains(event.target)) {
                botAssistant.classList.remove('active');
            }
        });
    }
    
    // Bot question handling
    const botQuestions = document.querySelectorAll('.bot-question');
    botQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const questionType = this.getAttribute('data-question');
            handleBotQuestion(questionType);
        });
    });
    
    // Navigation functionality
    const btnBack = document.getElementById('btnBack');
    const btnExit = document.getElementById('btnExit');
    const btnChooseGame = document.getElementById('btnChooseGame');
    const btnExitMain = document.getElementById('btnExitMain');
    
    if (btnBack) {
        btnBack.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    if (btnExit || btnExitMain) {
        const exitHandler = function() {
            if (confirm('Are you sure you want to exit GameNest?')) {
                // In a real app, this might close the app or redirect
                window.close();
                // Fallback for browsers that don't support window.close()
                window.location.href = 'about:blank';
            }
        };
        
        if (btnExit) btnExit.addEventListener('click', exitHandler);
        if (btnExitMain) btnExitMain.addEventListener('click', exitHandler);
    }
    
    if (btnChooseGame) {
        btnChooseGame.addEventListener('click', function() {
            window.location.href = 'games.html';
        });
    }
    
    // Game card selection
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            selectGame(game);
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Handle bot questions
function handleBotQuestion(questionType) {
    const botMessages = document.querySelector('.bot-messages');
    
    // Clear previous responses (keep the initial message)
    const initialMessage = botMessages.querySelector('.bot-message:first-child');
    botMessages.innerHTML = '';
    if (initialMessage) {
        botMessages.appendChild(initialMessage);
    }
    
    // Create new response
    const response = document.createElement('div');
    response.classList.add('bot-message');
    
    let responseText = '';
    
    switch(questionType) {
        case 'about':
            responseText = 'GameNest is a collection of fun and engaging games that you can play directly in your browser. No downloads required! We offer a variety of games from classics like Snake and Ludo to puzzle games.';
            break;
        case 'how-to-play':
            responseText = 'To play any game, simply click on the "Choose a Game" button, select your preferred game from the list, and start playing! Each game has its own simple instructions.';
            break;
        case 'snake-help':
            responseText = 'In Snake, use arrow keys to control the snake. Eat the food to grow longer. Avoid hitting the walls or your own tail!';
            break;
        case 'recommendation':
            responseText = 'Based on popularity, I recommend trying Snake or Ludo. If you prefer puzzle games, try Matching Cards or Arranging Boxes!';
            break;
        default:
            responseText = 'I\'m not sure how to help with that. Try asking about a specific game or feature.';
    }
    
    response.innerHTML = `<p>${responseText}</p>`;
    botMessages.appendChild(response);
    
    // Scroll to bottom of messages
    botMessages.scrollTop = botMessages.scrollHeight;
}

// Select and redirect to game
function selectGame(game) {
    // Add selection animation
    const gameCard = document.querySelector(`.game-card[data-game="${game}"]`);
    if (gameCard) {
        gameCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            gameCard.style.transform = '';
        }, 200);
    }
    
    // In a real implementation, this would redirect to the game page
    // For this example, we'll just show an alert
    setTimeout(() => {
        alert(`Redirecting to ${game} game...`);
        window.location.href = `game-${game}.html`;
    }, 300);
}

// Add CSS for ripple effect and music toggle pulse
const rippleStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

button {
    position: relative;
    overflow: hidden;
}

.music-toggle.pulse {
    animation: pulse 2s infinite;
    box-shadow: 0 0 0 rgba(0, 184, 148, 0.4);
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 184, 148, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(0, 184, 148, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 184, 148, 0);
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = rippleStyles;
document.head.appendChild(styleSheet);