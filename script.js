/* ================== NAVIGATION ================== */
function openTool(tool) {
    document.getElementById('main-page').style.display = 'none';
    document.querySelectorAll('.tool-page').forEach(p => p.style.display = 'none');
    document.getElementById(tool + '-page').style.display = 'block';
}

function goHome() {
    document.getElementById('main-page').style.display = 'block';
    document.querySelectorAll('.tool-page').forEach(p => p.style.display = 'none');
}

/* ================== DARK MODE ================== */
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

/* ================== CALCULATOR ================== */
function press(val) {
    const display = document.getElementById('calc-display');
    display.value += val;
}

function calculate() {
    const display = document.getElementById('calc-display');
    try {
        display.value = eval(display.value);
    } catch {
        alert('Invalid input');
    }
}

function clearCalc() {
    document.getElementById('calc-display').value = '';
}

/* ================== CLOCK ================== */
let canvas = document.getElementById('clock-canvas');
let ctx = canvas.getContext('2d');

function drawClock() {
    if (document.getElementById('clock-page').style.display !== 'block') return;

    let radius = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(-Math.PI / 2);

    // Clock circle
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 10, 0, 2 * Math.PI);
    ctx.stroke();

    // Minute marks
    for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.lineWidth = (i % 5 === 0) ? 4 : 2;
        ctx.strokeStyle = "#333";
        ctx.moveTo(radius - 20, 0);
        ctx.lineTo(radius - 10, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 30);
    }

    ctx.rotate(Math.PI / 2);

    // Hour numbers
    ctx.font = radius * 0.12 + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let num = 1; num <= 12; num++) {
        let ang = num * Math.PI / 6;
        let x = Math.cos(ang - Math.PI / 2) * (radius - 40);
        let y = Math.sin(ang - Math.PI / 2) * (radius - 40);
        ctx.fillStyle = "#333";
        ctx.fillText(num.toString(), x, y);
    }

    let now = new Date();
    let sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours() % 12;

    // Hour hand
    ctx.save();
    ctx.rotate((Math.PI / 6) * hr + (Math.PI / 360) * min + (Math.PI / 21600) * sec - Math.PI / 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius * 0.5, 0);
    ctx.stroke();
    ctx.restore();

    // Minute hand
    ctx.save();
    ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec - Math.PI / 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius * 0.75, 0);
    ctx.stroke();
    ctx.restore();

    // Second hand
    ctx.save();
    ctx.rotate((Math.PI / 30) * sec - Math.PI / 2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius * 0.85, 0);
    ctx.stroke();
    ctx.restore();

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();

    ctx.restore();
}

setInterval(drawClock, 30);

/* ================== STOPWATCH ================== */
let stopwatchTime = 0, stopwatchInterval;

function startStopwatch() {
    if (stopwatchInterval) return;
    let startTime = Date.now() - stopwatchTime;
    stopwatchInterval = setInterval(() => {
        stopwatchTime = Date.now() - startTime;
        let min = Math.floor(stopwatchTime / 60000);
        let sec = Math.floor((stopwatchTime % 60000) / 1000);
        let ms = stopwatchTime % 1000;
        document.getElementById('stopwatch-display').innerText =
            `${min}:${sec.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`;
    }, 10);
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    document.getElementById('stopwatch-display').innerText = '0:00:000';
}

/* ================== NOTES ================== */
function saveNotes() {
    let text = document.getElementById('notes-text').value;
    localStorage.setItem('studentNotes', text);
    alert('Note saved!');
}

window.addEventListener('load', () => {
    let saved = localStorage.getItem('studentNotes');
    if (saved) document.getElementById('notes-text').value = saved;
});

/* ================== DICE GAME ================== */
let diceStage = 1; // 1 = Player1, 2 = Player2
let player1 = 0, player2 = 0;

function setDice(diceId, number) {
    let diceDiv = document.getElementById(diceId);
    diceDiv.innerHTML = "";
    const positions = {
        1: [4], 2: [0, 8], 3: [0, 4, 8],
        4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
    };
    let dots = positions[number] || [];
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement('div');
        if(dots.includes(i)) cell.classList.add('dot');
        diceDiv.appendChild(cell);
    }
}

// Show clean dice
function showCleanDice() {
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    dice1.innerHTML = ""; dice2.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        dice1.appendChild(document.createElement('div'));
        dice2.appendChild(document.createElement('div'));
    }

    // Reset game variables
    diceStage = 1;
    player1 = 0;
    player2 = 0;

    // Reset text and buttons
    document.getElementById('dice-rule').innerText = "Player 1: Roll the dice!";
    document.getElementById('dice-result').innerText = '';
    document.getElementById('dice-roll-btn').style.display = 'inline-block';
    document.getElementById('dice-restart-btn').style.display = 'none';
}

// Roll dice
function rollDice() {
    const diceRule = document.getElementById('dice-rule');
    const resultEl = document.getElementById('dice-result');
    const rollBtn = document.getElementById('dice-roll-btn');
    const restartBtn = document.getElementById('dice-restart-btn');

    let r1 = Math.floor(Math.random()*6)+1;
    let r2 = Math.floor(Math.random()*6)+1;

    if(diceStage === 1){
        player1 = r1 + r2;
        setDice('dice1', r1);
        setDice('dice2', r2);
        diceRule.innerText = "Player 2: Roll the dice!";
        diceStage = 2;
    } else if(diceStage === 2){
        player2 = r1 + r2;
        setDice('dice1', r1);
        setDice('dice2', r2);

        if(player1 > player2) resultEl.innerText = "Player 1 Wins! 🎉";
        else if(player2 > player1) resultEl.innerText = "Player 2 Wins! 🎉";
        else resultEl.innerText = "It's a Tie! 🤝";

        diceRule.innerText = "Game Finished!";
        diceStage = 3;
        rollBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
    }
}

// Restart dice game
function restartDice() {
    showCleanDice(); // fully reset everything
}

/* ================== SUGGESTION BOX ================== */
function saveSuggestion() {
    let suggestion = document.getElementById('suggestion-text').value;

    if (suggestion.trim() === '') {
        alert('Enter suggestion');
        return;
    }

    document.getElementById('thank-you-message').innerText =
    "Thank you for your suggestion!";

    document.getElementById('suggestion-text').value = '';
}