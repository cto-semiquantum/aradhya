/* ==========================================
   LOVE CROSSWORD LOGIC — ARU & HARSH
   ========================================== */

(function () {
    const words = [
        {
            id: 1,
            word: "BAUNII",
            clue: "Harsh's most affectionate teasing nickname for Aru 🤏",
            dir: "across",
            row: 1,
            col: 2
        },
        {
            id: 2,
            word: "CAFE",
            clue: "Our special table #0411 place for hot chocolate & samose ☕",
            dir: "across",
            row: 3,
            col: 2
        },
        {
            id: 3,
            word: "HARSH",
            clue: "The boy who will wait and love you till his last breath 💖",
            dir: "across",
            row: 5,
            col: 3
        },
        {
            id: 4,
            word: "MAY",
            clue: "The fateful 22nd month when silence began 🥀",
            dir: "across",
            row: 7,
            col: 2
        },
        {
            id: 5,
            word: "LOVE",
            clue: "The eternal vow that never ends between us ❤️",
            dir: "across",
            row: 9,
            col: 3
        },
        {
            id: 6,
            word: "ARADHYA",
            clue: "The queen and brightest star of Harsh's entire universe 👑",
            dir: "down",
            row: 1,
            col: 3
        },
        {
            id: 7,
            word: "HEART",
            clue: "The place where you will always live rent-free 💓",
            dir: "down",
            row: 2,
            col: 5
        },
        {
            id: 8,
            word: "SMILE",
            clue: "The cute curve on Baunii's face that heals all pain 😊",
            dir: "down",
            row: 5,
            col: 6
        }
    ];

    const gridEl = document.getElementById('cwGrid');
    const acrossList = document.getElementById('acrossClues');
    const downList = document.getElementById('downClues');
    const winModal = document.getElementById('winModal');

    const cellMap = {}; // "r-c": { correctLetter, inputs: [] }

    function buildCrossword() {
        if (!gridEl) return;
        gridEl.innerHTML = '';

        // Build letter map
        words.forEach(w => {
            for (let i = 0; i < w.word.length; i++) {
                const r = w.dir === 'across' ? w.row : w.row + i;
                const c = w.dir === 'across' ? w.col + i : w.col;
                const key = `${r}-${c}`;
                if (!cellMap[key]) {
                    cellMap[key] = {
                        char: w.word[i],
                        number: i === 0 ? w.id : null,
                        wordIds: [w.id]
                    };
                } else {
                    if (i === 0 && !cellMap[key].number) cellMap[key].number = w.id;
                    cellMap[key].wordIds.push(w.id);
                }
            }
        });

        // 10x10 Grid Render
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                const key = `${r}-${c}`;
                const cell = document.createElement('div');
                cell.className = 'cw-cell';
                cell.id = `cell-${r}-${c}`;

                if (cellMap[key]) {
                    cell.classList.add('letter-cell');
                    if (cellMap[key].number) {
                        const num = document.createElement('span');
                        num.className = 'cw-cell-num';
                        num.textContent = cellMap[key].number;
                        cell.appendChild(num);
                    }

                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.className = 'cw-input';
                    input.dataset.row = r;
                    input.dataset.col = c;
                    input.autocomplete = 'off';

                    input.addEventListener('input', (e) => handleInput(e, r, c));
                    input.addEventListener('keydown', (e) => handleNav(e, r, c));
                    input.addEventListener('focus', () => highlightWordForCell(cellMap[key].wordIds[0]));

                    cell.appendChild(input);
                } else {
                    cell.classList.add('empty');
                }

                gridEl.appendChild(cell);
            }
        }

        renderClues();
    }

    function renderClues() {
        if (!acrossList || !downList) return;
        acrossList.innerHTML = '';
        downList.innerHTML = '';

        words.forEach(w => {
            const item = document.createElement('div');
            item.className = 'clue-item';
            item.id = `clue-${w.id}`;
            item.innerHTML = `<strong>${w.id}.</strong> ${w.clue} <span style="color: #ff99ac; font-size: 11px;">(${w.word.length} letters)</span>`;
            item.onclick = () => highlightWord(w);

            if (w.dir === 'across') {
                acrossList.appendChild(item);
            } else {
                downList.appendChild(item);
            }
        });
    }

    function highlightWord(w) {
        document.querySelectorAll('.cw-cell').forEach(c => c.classList.remove('active-word'));
        document.querySelectorAll('.clue-item').forEach(c => c.classList.remove('active'));

        const clueEl = document.getElementById(`clue-${w.id}`);
        if (clueEl) clueEl.classList.add('active');

        for (let i = 0; i < w.word.length; i++) {
            const r = w.dir === 'across' ? w.row : w.row + i;
            const c = w.dir === 'across' ? w.col + i : w.col;
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) cell.classList.add('active-word');
        }

        // Focus first cell
        const firstInput = document.querySelector(`#cell-${w.row}-${w.col} input`);
        if (firstInput) firstInput.focus();
    }

    function highlightWordForCell(wordId) {
        const w = words.find(item => item.id === wordId);
        if (w) highlightWord(w);
    }

    function handleInput(e, r, c) {
        const val = e.target.value.toUpperCase();
        e.target.value = val;

        if (val) {
            // Auto advance
            const key = `${r}-${c}`;
            const wordId = cellMap[key]?.wordIds[0];
            const w = words.find(item => item.id === wordId);

            let nextR = r;
            let nextC = c;
            if (w && w.dir === 'across') nextC = c + 1;
            else nextR = r + 1;

            const nextInput = document.querySelector(`#cell-${nextR}-${nextC} input`);
            if (nextInput) nextInput.focus();
        }

        checkBoard();
    }

    function handleNav(e, r, c) {
        if (e.key === 'Backspace' && !e.target.value) {
            const prevR = r > 0 ? r - 1 : r;
            const prevC = c > 0 ? c - 1 : c;
            const prevInput = document.querySelector(`#cell-${r}-${prevC} input`) || document.querySelector(`#cell-${prevR}-${c} input`);
            if (prevInput) prevInput.focus();
        }
    }

    function checkBoard() {
        let allCorrect = true;
        let filledCount = 0;
        let totalCells = Object.keys(cellMap).length;

        Object.keys(cellMap).forEach(key => {
            const [r, c] = key.split('-').map(Number);
            const input = document.querySelector(`#cell-${r}-${c} input`);
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (!input || !cell) return;

            const val = input.value.trim().toUpperCase();
            if (val) filledCount++;

            if (val === cellMap[key].char) {
                cell.classList.add('correct');
            } else {
                cell.classList.remove('correct');
                allCorrect = false;
            }
        });

        if (allCorrect && filledCount === totalCells) {
            triggerWin();
        }
    }

    window.revealHint = function () {
        const emptyOrWrongKeys = Object.keys(cellMap).filter(key => {
            const [r, c] = key.split('-').map(Number);
            const input = document.querySelector(`#cell-${r}-${c} input`);
            return input && input.value.toUpperCase() !== cellMap[key].char;
        });

        if (emptyOrWrongKeys.length > 0) {
            const randomKey = emptyOrWrongKeys[Math.floor(Math.random() * emptyOrWrongKeys.length)];
            const [r, c] = randomKey.split('-').map(Number);
            const input = document.querySelector(`#cell-${r}-${c} input`);
            if (input) {
                input.value = cellMap[randomKey].char;
                const cell = document.getElementById(`cell-${r}-${c}`);
                if (cell) cell.classList.add('correct');
                checkBoard();
            }
        }
    };

    window.clearPuzzle = function () {
        if (!confirm("Start puzzle over?")) return;
        document.querySelectorAll('.cw-input').forEach(i => i.value = '');
        document.querySelectorAll('.cw-cell').forEach(c => c.classList.remove('correct', 'active-word'));
    };

    function triggerWin() {
        if (winModal) winModal.style.display = 'flex';
        if (window.confetti) {
            window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    }

    window.closeWinModal = function () {
        if (winModal) winModal.style.display = 'none';
    };

    document.addEventListener('DOMContentLoaded', buildCrossword);
})();
