/* ==========================================
   ARU'S LOVE WORDLE LOGIC
   ========================================== */

(function () {
    const wordsPool = [
        "BAUNI", "HEART", "SMILE", "DREAM", "SWEET", 
        "ROSES", "ANGEL", "PEACE", "TRUST", "CHARM"
    ];

    let targetWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    let currentRow = 0;
    let currentTile = 0;
    let isGameOver = false;

    const board = document.getElementById('wordleBoard');
    const winModal = document.getElementById('wordleWinModal');
    const winWordEl = document.getElementById('wordleWinWord');

    function buildBoard() {
        if (!board) return;
        board.innerHTML = '';
        for (let r = 0; r < 6; r++) {
            const row = document.createElement('div');
            row.className = 'wordle-row';
            row.id = `row-${r}`;
            for (let c = 0; c < 5; c++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-tile';
                tile.id = `tile-${r}-${c}`;
                row.appendChild(tile);
            }
            board.appendChild(row);
        }
    }

    function addLetter(letter) {
        if (currentTile < 5 && currentRow < 6 && !isGameOver) {
            const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
            if (tile) {
                tile.textContent = letter;
                tile.classList.add('pop');
                setTimeout(() => tile.classList.remove('pop'), 150);
                currentTile++;
            }
        }
    }

    function deleteLetter() {
        if (currentTile > 0 && !isGameOver) {
            currentTile--;
            const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
            if (tile) {
                tile.textContent = '';
            }
        }
    }

    function submitGuess() {
        if (isGameOver) return;

        if (currentTile < 5) {
            shakeRow(currentRow);
            showWordleToast("Too short! Enter a 5-letter word 🌸");
            return;
        }

        let guess = "";
        for (let c = 0; c < 5; c++) {
            guess += document.getElementById(`tile-${currentRow}-${c}`).textContent;
        }

        const targetArr = targetWord.split('');
        const guessArr = guess.split('');
        const rowId = currentRow;

        // Pass 1: Greens
        const status = Array(5).fill('absent');
        for (let i = 0; i < 5; i++) {
            if (guessArr[i] === targetArr[i]) {
                status[i] = 'correct';
                targetArr[i] = null;
            }
        }

        // Pass 2: Yellows
        for (let i = 0; i < 5; i++) {
            if (status[i] !== 'correct') {
                const foundIdx = targetArr.indexOf(guessArr[i]);
                if (foundIdx !== -1) {
                    status[i] = 'present';
                    targetArr[foundIdx] = null;
                }
            }
        }

        // Animate Tile Flips
        for (let c = 0; c < 5; c++) {
            const tile = document.getElementById(`tile-${rowId}-${c}`);
            const letter = guessArr[c];
            setTimeout(() => {
                tile.classList.add('flip');
                tile.classList.add(status[c]);
                updateKeyColor(letter, status[c]);
            }, c * 200);
        }

        setTimeout(() => {
            if (guess === targetWord) {
                isGameOver = true;
                triggerWordleWin(true);
            } else if (rowId === 5) {
                isGameOver = true;
                triggerWordleWin(false);
            } else {
                currentRow++;
                currentTile = 0;
            }
        }, 5 * 200 + 100);
    }

    function updateKeyColor(letter, state) {
        const key = document.querySelector(`.key-btn[data-key="${letter}"]`);
        if (!key) return;

        if (state === 'correct') {
            key.className = 'key-btn correct';
        } else if (state === 'present' && !key.classList.contains('correct')) {
            key.className = 'key-btn present';
        } else if (state === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.className = 'key-btn absent';
        }
    }

    function shakeRow(rowIdx) {
        const row = document.getElementById(`row-${rowIdx}`);
        if (!row) return;
        row.classList.add('row-shake');
        setTimeout(() => row.classList.remove('row-shake'), 400);
    }

    function triggerWordleWin(won) {
        if (winModal) winModal.style.display = 'flex';
        if (winWordEl) winWordEl.textContent = targetWord;

        const winMsg = document.getElementById('wordleWinMsg');
        if (won) {
            if (winMsg) winMsg.textContent = "Brilliant, Aru! You guessed the secret love word! 💖";
            if (window.confetti) window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } else {
            if (winMsg) winMsg.textContent = `Good try! The word was: ${targetWord}. Try another word! 💕`;
        }
    }

    window.closeWordleModal = function () {
        if (winModal) winModal.style.display = 'none';
    };

    window.playNextWord = function () {
        closeWordleModal();
        targetWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
        currentRow = 0;
        currentTile = 0;
        isGameOver = false;
        buildBoard();
        document.querySelectorAll('.key-btn').forEach(k => {
            if (!k.classList.contains('wide')) k.className = 'key-btn';
        });
    };

    // Keyboard Click Handlers
    document.querySelectorAll('.key-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            if (key === 'ENTER') {
                submitGuess();
            } else if (key === 'BACK') {
                deleteLetter();
            } else {
                addLetter(key);
            }
        });
    });

    // Physical Keyboard Listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitGuess();
        } else if (e.key === 'Backspace') {
            deleteLetter();
        } else {
            const char = e.key.toUpperCase();
            if (/^[A-Z]$/.test(char)) {
                addLetter(char);
            }
        }
    });

    function showWordleToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
            background: rgba(255, 75, 145, 0.95); color: #fff; padding: 10px 22px;
            border-radius: 50px; font-size: 13px; font-weight: 600; z-index: 99999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: fadeIn 0.3s ease;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2200);
    }

    document.addEventListener('DOMContentLoaded', buildBoard);
})();
