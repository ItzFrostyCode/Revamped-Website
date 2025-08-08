const player1 = {
    cards: [],
    hearts: 5,
    hasStayed: false
  };
  
  const player2 = {
    cards: [],
    hearts: 5,
    hasStayed: false
  };

  let undoUsed = false;
  let botUndoUsed = false;
  let gamedeck = [];
  let usedCards = [];

  // Initialize deck with all possible cards
  function initializeDeck() {
    gamedeck = [];
    usedCards = [];
    
    // Create a deck with all card values and suits
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    suits.forEach(suit => {
      values.forEach(value => {
        gamedeck.push({ value: value, suit: suit });
      });
    });
    
    // Shuffle the deck
    shuffleDeck();
  }

  function shuffleDeck() {
    for (let i = gamedeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gamedeck[i], gamedeck[j]] = [gamedeck[j], gamedeck[i]];
    }
  }

  function drawCard() {
    if (gamedeck.length === 0) {
      // If deck is empty, reinitialize (shouldn't happen in normal gameplay)
      initializeDeck();
    }
    
    const card = gamedeck.pop();
    usedCards.push(card);
    return card;
  }

  function getCardValue(card) {
    // Convert card object to numeric value for scoring
    if (card.value === 'A') return 1;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
  }  // Game event listeners
  document.getElementById('hitButton').addEventListener('click', playerHit);
  document.getElementById('stayButton').addEventListener('click', playerStay);
  document.getElementById('undoButton').addEventListener('click', playerUndo);
  
  function startGame() {
    // Initialize deck first
    initializeDeck();
    
    // Reset game state
    undoUsed = false;
    botUndoUsed = false;
    player1.cards = [drawCard(), drawCard()];
    player2.cards = [drawCard(), drawCard()];
    player1.hasStayed = false;
    player2.hasStayed = false;
    
    console.log('Game started - Player cards:', player1.cards, 'Bot cards:', player2.cards);
    console.log('Initial scores - Player:', calculateScore(player1.cards), 'Bot:', calculateScore(player2.cards));
  
    updateUI();
  
    setTimeout(() => {
      document.getElementById('bankerMessage').innerText = "Banker: YOUR TURN. . . .";
      enableChoices();
    }, 2000);
  }
  
  function playerHit() {
    const currentScore = calculateScore(player1.cards);
    
    // Prevent hitting if player already has 21
    if (currentScore === 21) {
      document.getElementById('bankerMessage').innerText = "Banker: You can't HIT with 21! Please STAY.";
      return;
    }
    
    // Prevent hitting if player has already stayed
    if (player1.hasStayed) {
      document.getElementById('bankerMessage').innerText = "Banker: You already stayed!";
      return;
    }
    
    player1.cards.push(drawCard());
    updateUI();
    
    const newScore = calculateScore(player1.cards);
    console.log(`Player hit - new score: ${newScore}`);
    
    // Check for immediate bust
    if (newScore > 21) {
      console.log('Player busted, enabling undo option if available');
      // Don't end game immediately, give player chance to undo
      setTimeout(() => enableChoices(), 1000);
    } else {
      setTimeout(() => botTurn(), 1000);
    }
  }
  
  function playerStay() {
    if (player1.hasStayed) {
      document.getElementById('bankerMessage').innerText = "Banker: You already stayed!";
      return;
    }
    
    player1.hasStayed = true;
    console.log('Player chose to stay');
    disableChoices();
    document.getElementById('bankerMessage').innerText = "Banker: YOU STAYED, BOT'S TURN...";
    setTimeout(() => checkIfGameCanDecide(), 1000);
  }
  
  function playerUndo() {
    const currentScore = calculateScore(player1.cards);
    
    // Allow undo if player is busted (over 21) or has less than 21
    // Only prevent undo if player has exactly 21 (perfect score)
    if (currentScore === 21) {
      document.getElementById('bankerMessage').innerText = "Banker: You can't UNDO with perfect 21! Please STAY.";
      return;
    }
    
    // Prevent undo if already used
    if (undoUsed) {
      document.getElementById('bankerMessage').innerText = "Banker: You already used UNDO!";
      return;
    }
    
    // Prevent undo if player has stayed
    if (player1.hasStayed) {
      document.getElementById('bankerMessage').innerText = "Banker: You can't UNDO after staying!";
      return;
    }
    
    // Need at least 3 cards to undo (can't undo starting hand)
    if (player1.cards.length <= 2) {
      document.getElementById('bankerMessage').innerText = "Banker: You need at least 3 cards to UNDO!";
      return;
    }
    
    // Perform undo
    const removedCard = player1.cards.pop();
    undoUsed = true;
    console.log('Player used undo, removed card:', removedCard);
    console.log('Player score after undo:', calculateScore(player1.cards));
    updateUI();
    
    const newScore = calculateScore(player1.cards);
    if (newScore > 21) {
      document.getElementById('bankerMessage').innerText = `Banker: UNDO USED! Still busted with ${newScore}. YOUR TURN...`;
    } else {
      document.getElementById('bankerMessage').innerText = `Banker: UNDO USED! Score now ${newScore}. YOUR TURN...`;
    }
    
    // Don't automatically go to bot turn, let player choose again
    setTimeout(() => {
      enableChoices();
    }, 1500);
  }
  
  function botTurn() {
    disableChoices();
    document.getElementById('bankerMessage').innerText = "Banker: BOT IS THINKING...";

    setTimeout(() => {
        // Skip bot turn if bot has already stayed
        if (player2.hasStayed) {
            console.log('Bot has already stayed, skipping turn');
            checkIfGameCanDecide();
            return;
        }

        const botScore = calculateScore(player2.cards);
        const playerScore = calculateScore(player1.cards);

        console.log(`Bot turn - Bot score: ${botScore}, Player score: ${playerScore}, Player stayed: ${player1.hasStayed}`);

        // Bot decision logic
        if (botScore === 21) {
            // Bot has perfect score, must stay
            player2.hasStayed = true;
            document.getElementById('bankerMessage').innerText = "Banker: BOT HAS 21 AND STAYS, YOUR TURN";
        } else if (botScore > 21) {
            // Bot busted, check if it can undo
            if (!botUndoUsed && player2.cards.length > 2) {
                // Bot uses undo to try to save itself
                const removedCard = player2.cards.pop();
                botUndoUsed = true;
                const newBotScore = calculateScore(player2.cards);
                console.log(`Bot used undo! Removed card: ${removedCard.value}${removedCard.suit}, new score: ${newBotScore}`);
                document.getElementById('bankerMessage').innerText = `Banker: BOT USED UNDO! Score now ${newBotScore}, YOUR TURN`;
            } else {
                // Bot busted and can't undo
                player2.hasStayed = true;
                document.getElementById('bankerMessage').innerText = "Banker: BOT BUSTED AND STAYS, YOUR TURN";
            }
        } else if (botScore < 17) {
            // Bot hits if score is below 17
            player2.cards.push(drawCard());
            document.getElementById('bankerMessage').innerText = "Banker: BOT CHOSE HIT, YOUR TURN";
        } else if (player1.hasStayed && playerScore <= 21 && botScore < playerScore) {
            // Player has stayed with valid score, bot tries to beat it
            player2.cards.push(drawCard());
            document.getElementById('bankerMessage').innerText = "Banker: BOT CHOSE HIT, YOUR TURN";
        } else {
            // Bot stays in all other cases
            player2.hasStayed = true;
            document.getElementById('bankerMessage').innerText = "Banker: BOT CHOSE STAY, YOUR TURN";
        }

        updateUI();
        
        // Add a small delay before checking game state
        setTimeout(() => {
            checkIfGameCanDecide();
        }, 500);
    }, 1500);
}
  
  function checkIfGameCanDecide() {
    const playerScore = calculateScore(player1.cards);
    const botScore = calculateScore(player2.cards);
    
    console.log(`Game state check - Player: ${playerScore} (stayed: ${player1.hasStayed}), Bot: ${botScore} (stayed: ${player2.hasStayed})`);
    
    // Check for immediate game ending conditions
    if (playerScore > 21) {
      // Player busted, end game immediately
      document.getElementById('bankerMessage').innerText = "Banker: YOU BUSTED! BOT WINS!";
      setTimeout(() => decideWinner(), 2000);
      return;
    }
    
    if (botScore > 21) {
      // Bot busted, end game immediately
      document.getElementById('bankerMessage').innerText = "Banker: BOT BUSTED! YOU WIN!";
      setTimeout(() => decideWinner(), 2000);
      return;
    }
    
    // If player gets exactly 21, they should automatically stay
    if (playerScore === 21 && !player1.hasStayed) {
      document.getElementById('bankerMessage').innerText = "Banker: PERFECT 21! Auto-staying...";
      setTimeout(() => {
        player1.hasStayed = true;
        checkIfGameCanDecide();
      }, 1500);
      return;
    }
    
    // If bot gets exactly 21, they should automatically stay
    if (botScore === 21 && !player2.hasStayed) {
      player2.hasStayed = true;
      document.getElementById('bankerMessage').innerText = "Banker: BOT HAS 21 AND STAYS";
      setTimeout(() => {
        checkIfGameCanDecide();
      }, 1500);
      return;
    }
    
    // Check if both players have stayed or game should end
    if (player1.hasStayed && player2.hasStayed) {
      document.getElementById('bankerMessage').innerText = "Banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), 3000);
      return;
    }
    
    // If player has stayed but bot hasn't, continue bot's turn
    if (player1.hasStayed && !player2.hasStayed) {
      setTimeout(() => botTurn(), 1000);
      return;
    }
    
    // If neither has stayed or only bot has stayed, enable player choices
    if (!player1.hasStayed) {
      enableChoices();
    } else {
      // This shouldn't happen, but just in case
      console.warn('Unexpected game state reached');
      setTimeout(() => botTurn(), 1000);
    }
  }
  
  function decideWinner() {
    // Reveal bot's hidden card
    updateUI(true);
  
    const playerScore = calculateScore(player1.cards);
    const botScore = calculateScore(player2.cards);
  
    if ((playerScore > 21 && botScore <= 21) || (botScore > playerScore && botScore <= 21)) {
      loseHeart(player1);
      document.getElementById('bankerMessage').innerText = "Banker: BOT WINS";
    } else if ((botScore > 21 && playerScore <= 21) || (playerScore > botScore && playerScore <= 21)) {
      loseHeart(player2);
      document.getElementById('bankerMessage').innerText = "Banker: YOU WIN";
    } else {
      document.getElementById('bankerMessage').innerText = "Banker: IT'S A TIE";
    }
  
    setTimeout(() => checkGameOver(), 5000);
  }
  
  function calculateScore(cards) {
    return cards.reduce((sum, card) => sum + getCardValue(card), 0);
  }
  
  function loseHeart(player) {
    player.hearts -= 1;
    if (player.hearts === 0) {
      showPopup(player === player1 ? "YOU LOST :( DO YOU WANT TO PLAY AGAIN?" : "YOU WIN! DO YOU WANT TO PLAY AGAIN?");
    }
  }
  
  function checkGameOver() {
    if (player1.hearts > 0 && player2.hearts > 0) {
      startGame();
    }
  }
  
  function showPopup(message) {
    document.getElementById('popupMessage').innerText = message;
    document.getElementById('popup').style.display = 'block';
    document.getElementById('playAgainYes').addEventListener('click', restartGame);
    document.getElementById('playAgainNo').addEventListener('click', thankYou);
  }
  
  function restartGame() {
    document.getElementById('popup').style.display = 'none';
    player1.hearts = 5;
    player2.hearts = 5;
    startGame();
  }
  
  function thankYou() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('bankerMessage').innerText = "Thank you for playing!";
  }
  
  function updateUI(revealBot = false) {
    // Update player
    const playerScore = calculateScore(player1.cards);
    document.getElementById('playerScore').innerText = playerScore;
    renderCards('playerCardsContainer', player1.cards, false);
    renderHearts('playerHeartsContainer', player1.hearts);

    // Update bot
    const botScore = calculateScore(player2.cards);
    const botScoreDisplay = revealBot ? botScore : calculateScore(player2.cards.slice(1));
    document.getElementById('botScore').innerText = botScoreDisplay;
    renderCards('botCardsContainer', player2.cards, !revealBot);
    renderHearts('botHeartsContainer', player2.hearts);
    
    // Update undo button text to show usage status
    const undoButton = document.getElementById('undoButton');
    if (undoUsed) {
      undoButton.innerText = 'Undo (Used)';
      undoButton.style.opacity = '0.5';
    } else {
      undoButton.innerText = 'Undo';
      undoButton.style.opacity = '1';
    }
  }  function renderCards(containerId, cards, hideFirstCard = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'playing-card';
      
      if (hideFirstCard && index === 0) {
        // Show card back for hidden card
        cardElement.className += ' card-back';
        cardElement.innerHTML = '🂠';
      } else {
        // Show actual card
        const { value, suit, color } = getCardDetails(card);
        cardElement.className += ` ${color}`;
        cardElement.innerHTML = `
          <div class="card-value">${value}</div>
          <div class="card-suit">${suit}</div>
          <div class="card-value" style="transform: rotate(180deg);">${value}</div>
        `;
      }
      
      // Add animation for new cards
      if (index === cards.length - 1 && cards.length > 2) {
        cardElement.classList.add('card-new');
        setTimeout(() => {
          cardElement.classList.remove('card-new');
        }, 600);
      }
      
      container.appendChild(cardElement);
    });
  }
  
  function renderHearts(containerId, heartCount) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
      const heartElement = document.createElement('div');
      heartElement.className = 'heart-icon';
      heartElement.innerHTML = '♥';
      
      if (i >= heartCount) {
        heartElement.className += ' lost';
      }
      
      container.appendChild(heartElement);
    }
  }
  
  function getCardDetails(card) {
    // Card is now an object with value and suit properties
    const suitColors = {
      '♠': 'black', // Spades
      '♣': 'black', // Clubs  
      '♥': 'red',   // Hearts
      '♦': 'red'    // Diamonds
    };
    
    const color = suitColors[card.suit] || 'black';
    
    return {
      value: card.value,
      suit: card.suit,
      color: color
    };
  }
  
  function enableChoices() {
    const playerScore = calculateScore(player1.cards);
    
    // Don't enable choices if player has already stayed
    if (player1.hasStayed) {
      console.log('Player has already stayed, not enabling choices');
      disableChoices();
      return;
    }
    
    // If player is busted, only allow undo (if available)
    if (playerScore > 21) {
      console.log('Player is busted, only allowing undo if available');
      document.getElementById('hitButton').disabled = true;
      document.getElementById('stayButton').disabled = true;
      document.getElementById('undoButton').disabled = undoUsed || player1.cards.length <= 2;
      
      if (!undoUsed && player1.cards.length > 2) {
        document.getElementById('bankerMessage').innerText = `Banker: BUSTED with ${playerScore}! You can UNDO or the game ends.`;
      } else {
        document.getElementById('bankerMessage').innerText = `Banker: BUSTED with ${playerScore}! Game over.`;
        setTimeout(() => checkIfGameCanDecide(), 2000);
      }
      return;
    }
    
    // If player has exactly 21, disable Hit and Undo buttons
    if (playerScore === 21) {
      document.getElementById('hitButton').disabled = true;
      document.getElementById('stayButton').disabled = false;
      document.getElementById('undoButton').disabled = true;
      
      // Update banker message to indicate perfect score
      document.getElementById('bankerMessage').innerText = "Banker: PERFECT 21! You can only STAY.";
    } else {
      // Normal behavior when score is not 21
      document.getElementById('hitButton').disabled = false;
      document.getElementById('stayButton').disabled = false;
      document.getElementById('undoButton').disabled = undoUsed;
    }
    
    console.log('Choices enabled for player with score:', playerScore);
  }
  
  function disableChoices() {
    document.getElementById('hitButton').disabled = true;
    document.getElementById('stayButton').disabled = true;
    document.getElementById('undoButton').disabled = true;
  }
  
  startGame();
  
  // Theme and mobile menu functionality
  document.addEventListener('DOMContentLoaded', function() {
      // How to Play Modal
      const howToPlayBtn = document.getElementById('howToPlayBtn');
      const howToPlayModal = document.getElementById('howToPlayModal');
      const closeModal = document.getElementById('closeModal');
      
      if (howToPlayBtn && howToPlayModal && closeModal) {
          howToPlayBtn.addEventListener('click', function() {
              howToPlayModal.classList.add('active');
          });
          
          closeModal.addEventListener('click', function() {
              howToPlayModal.classList.remove('active');
          });
          
          // Close modal when clicking outside
          howToPlayModal.addEventListener('click', function(e) {
              if (e.target === howToPlayModal) {
                  howToPlayModal.classList.remove('active');
              }
          });
          
          // Close modal with Escape key
          document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape' && howToPlayModal.classList.contains('active')) {
                  howToPlayModal.classList.remove('active');
              }
          });
      }
  });
  
    