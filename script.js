document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const cells = document.querySelectorAll('.cell');
    const playerScoreEl = document.getElementById('playerScore');
    const aiScoreEl = document.getElementById('aiScore');
    const turnIndicator = document.getElementById('turnIndicator');
    const resetBtn = document.getElementById('resetBtn');
    const difficultyBtns = {
        easy: document.getElementById('easyBtn'),
        medium: document.getElementById('mediumBtn'),
        hard: document.getElementById('hardBtn')
    };

    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'x'; // Player is always X, AI is O
    let gameActive = true;
    let scores = { player: 0, ai: 0 };
    let difficulty = 'easy'; // Default difficulty

    // Initialize game
    initGame();

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);

    for (const [diff, btn] of Object.entries(difficultyBtns)) {
        btn.addEventListener('click', () => setDifficulty(diff));
    }

    // Game functions
    function initGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'x';
        gameActive = true;
        updateBoard();
        updateTurnIndicator();
    }

    function handleCellClick(e) {
        const index = e.target.dataset.index;
        
        if (board[index] !== '' || !gameActive || currentPlayer !== 'x') return;
        
        makeMove(index, 'x');
        
        if (gameActive && currentPlayer === 'o') {
            setTimeout(aiMove, 500);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].classList.add(player);
        cells[index].textContent = player.toUpperCase();
        
        if (checkWin(player)) {
            endGame(player);
            return;
        }
        
        if (checkDraw()) {
            endGame(null);
            return;
        }
        
        currentPlayer = player === 'x' ? 'o' : 'x';
        updateTurnIndicator();
    }

    function aiMove() {
        let move;
        
        switch (difficulty) {
            case 'easy':
                move = findRandomMove();
                break;
            case 'medium':
                // 50% chance to make a smart move or random move
                move = Math.random() < 0.5 ? findBestMove() : findRandomMove();
                break;
            case 'hard':
                move = findBestMove();
                break;
        }
        
        if (move !== null) {
            makeMove(move, 'o');
        }
    }

    function findBestMove() {
        // Try to win first
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'o';
                if (checkWin('o')) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        // Block player from winning
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'x';
                if (checkWin('x')) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        // Take center if available
        if (board[4] === '') return 4;
        
        // Take a corner if available
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available edge
        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(i => board[i] === '');
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }
        
        return null;
    }

    function findRandomMove() {
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') availableMoves.push(i);
        }
        return availableMoves.length > 0 ? 
            availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
    }

    function checkWin(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            if (board[a] === player && board[b] === player && board[c] === player) {
                // Highlight winning cells
                cells[a].classList.add('winning-cell');
                cells[b].classList.add('winning-cell');
                cells[c].classList.add('winning-cell');
                return true;
            }
            return false;
        });
    }

    function checkDraw() {
        return board.every(cell => cell !== '');
    }

    function endGame(winner) {
        gameActive = false;
        
        if (winner === 'x') {
            scores.player++;
            playerScoreEl.textContent = scores.player;
            turnIndicator.textContent = 'You win!';
        } else if (winner === 'o') {
            scores.ai++;
            aiScoreEl.textContent = scores.ai;
            turnIndicator.textContent = 'AI wins!';
        } else {
            turnIndicator.textContent = "It's a draw!";
        }
    }

    function resetGame() {
        initGame();
        cells.forEach(cell => {
            cell.className = 'cell';
            cell.textContent = '';
        });
    }

    function updateBoard() {
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.className = 'cell';
            if (board[index] !== '') {
                cell.classList.add(board[index]);
            }
        });
    }

    function updateTurnIndicator() {
        turnIndicator.textContent = currentPlayer === 'x' ? 'Your turn (X)' : 'AI thinking...';
    }

    function setDifficulty(level) {
        difficulty = level;
        for (const [diff, btn] of Object.entries(difficultyBtns)) {
            if (diff === level) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
        resetGame();
    }
});