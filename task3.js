document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const gameBoard = document.getElementById('game-board');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restart-button');
    const modeButton = document.getElementById('mode-button');
    
    let currentPlayer = 'x';
    let boardState = Array(9).fill(null);
    let playWithComputer = false;

    function startGame() {
        cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'glow');
            cell.style.borderColor = '';
            cell.addEventListener('click', handleClick, { once: true });
        });
        boardState.fill(null);
        currentPlayer = 'x';
        status.textContent = "Player X's turn";
        status.classList.remove('winner-announcement');
        const confetti = document.querySelector('.confetti');
        if (confetti) confetti.remove();
    }

    function handleClick(e) {
        const cell = e.target;
        const cellIndex = Array.from(cells).indexOf(cell);
        
        if (!boardState[cellIndex]) {
            makeMove(cell, cellIndex, currentPlayer);

            if (checkWin()) {
                status.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
                status.classList.add('winner-announcement');
                displayConfetti();
                cells.forEach(cell => cell.removeEventListener('click', handleClick));
            } else if (boardState.every(cell => cell !== null)) {
                status.textContent = "It's a draw!";
            } else {
                currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
                status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;

                if (playWithComputer && currentPlayer === 'o') {
                    setTimeout(computerMove, 500);
                }
            }
        }
    }

    function makeMove(cell, cellIndex, player) {
        boardState[cellIndex] = player;
        cell.style.borderColor = player === 'x' ? '#ff4081' : '#00bcd4';
        cell.classList.add(player);
    }

    function computerMove() {
        let availableCells = [];
        boardState.forEach((cell, index) => {
            if (!cell) availableCells.push(index);
        });

        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        const cell = cells[randomIndex];
        makeMove(cell, randomIndex, currentPlayer);

        if (checkWin()) {
            status.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
            status.classList.add('winner-announcement');
            displayConfetti();
            cells.forEach(cell => cell.removeEventListener('click', handleClick));
        } else if (boardState.every(cell => cell !== null)) {
            status.textContent = "It's a draw!";
        } else {
            currentPlayer = 'x';
            status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
        }
    }

    function checkWin() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                [a, b, c].forEach(index => cells[index].classList.add('glow'));
                return true;
            }
            return false;
        });
    }

    function displayConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        document.body.appendChild(confetti);
    }

    modeButton.addEventListener('click', () => {
        playWithComputer = !playWithComputer;
        modeButton.textContent = playWithComputer ? 'Two Player' : 'Play with Computer';
        startGame();
    });

    restartButton.addEventListener('click', startGame);

    startGame();
});
