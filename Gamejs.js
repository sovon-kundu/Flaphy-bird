const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const startOverlay = document.getElementById('startOverlay');

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -8.5,
    velocity: 0
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 130;
const pipeSpeed = 2;
const pipeSpawnInterval = 140;
let framesSinceLastPipe = 0;
let isGameRunning = false;

// Placeholder bird image as a rectangle
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    framesSinceLastPipe = 0;
}

function createPipe() {
    const minPipeHeight = 40;
    const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
    const gapPosition = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
    pipes.push({ x: canvas.width, y: gapPosition });
}

function startGame() {
    resetGame();
    isGameRunning = true;
    startOverlay.classList.add('hidden');
}

function gameOver() {
    isGameRunning = false;
    startOverlay.classList.remove('hidden');
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameRunning) {
        drawBird();
        requestAnimationFrame(gameLoop);
        return;
    }

    // Bird movement
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Draw bird
    drawBird();

    // Spawn pipes at a steady interval so the gaps are more evenly spaced.
    framesSinceLastPipe += 1;
    if (framesSinceLastPipe >= pipeSpawnInterval) {
        createPipe();
        framesSinceLastPipe = 0;
    }

    pipes.forEach((pipe) => {
        pipe.x -= pipeSpeed;
        drawPipe(pipe);

        // Collision detection
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)) {
            gameOver();
        }
    });

    while (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }

    // Bottom boundary check
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        gameOver();
    }

    // Top boundary check
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.code !== 'Space') {
        return;
    }

    event.preventDefault();

    if (!isGameRunning) {
        startGame();
    }

    bird.velocity = bird.lift;
});

playButton.addEventListener('click', startGame);

resetGame();
gameLoop();
