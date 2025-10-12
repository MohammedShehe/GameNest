// Games page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animations to game cards
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate in with delay
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Add hover sound effect to game cards (optional)
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // In a real implementation, you might play a subtle sound here
        });
    });
});