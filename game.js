let score = 0;
let foodEaten = true;
let headX = 200;
let headY = 200;
let headDir = 0;
const size = 20;
const headSpeed = size;
let foodX;
let foodY;
let tail = [];
let isOn = true;
let frameRate = 10;
let isMut = false;

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const toggleButton = document.getElementById('toggleButton');
const muteTog = document.getElementById('muteButton');
const frameRateSlider = document.getElementById('frameRateSlider');
const biteSound = document.getElementById('biteSound');

toggleButton.addEventListener('click', toggleAuto);
muteTog.addEventListener('click', togMut);
frameRateSlider.addEventListener('input', adjustFrameRate);
document.addEventListener('keydown', keyPressed);

function draw() {
    console.log("Drawing frame");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(0,0,0,0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height);
    tailF();
    head();
    food();
    if (isOn) {
        auto();
    }
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`score: ${score}`, canvas.width / 2, 30);
    setTimeout(() => {
        requestAnimationFrame(draw);
    }, 1000 / frameRate);
}

function tailF() {
    if (tail.length != 0) {
        for (let t = tail.length - 1; t > 0; t--) {
            tail[t].x = tail[t - 1].x;
            tail[t].y = tail[t - 1].y;
        }
        tail[0].x = headX;
        tail[0].y = headY;
    }

    for (let t of tail) {
        context.fillStyle = 'rgb(0, 220, 0)';
        context.beginPath();
        context.arc(t.x + size / 2, t.y + size / 2, size / 2, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
    }

    if (tail.length > 0) {
        let last = tail[tail.length - 1];
        context.fillStyle = 'rgb(0, 220, 0)';
        context.beginPath();
        context.arc(last.x + size / 2, last.y + size / 2, size / 2, 0, Math.PI * 2);
        context.fill();
    }
}

function food() {
    if (foodEaten) {
        foodX = Math.floor(Math.random() * (canvas.width / size)) * size;
        foodY = Math.floor(Math.random() * (canvas.height / size)) * size;
        foodEaten = false;
    }
    if (headX === foodX && headY === foodY) {
        if (!isMut) {
            biteSound.play();
        }
        tail.push({ x: headX, y: headY });
        score++;
        foodEaten = true;
    }
    context.fillStyle = 'rgb(220, 225, 0)';
    context.beginPath();
    context.arc(foodX + size / 2, foodY + size / 2, size / 2, 0, Math.PI * 2);
    context.fill();
}

function head() {
    console.log(`Head position: (${headX}, ${headY}), direction: ${headDir}`);

    // Draw the green body part of the head
    context.fillStyle = 'rgb(0, 220, 0)';
    context.beginPath();
    context.arc(headX + size / 2, headY + size / 2, size / 2, 0, Math.PI * 2);
    context.fill();

    // Save the current context state before rotating
    context.save();

    // Translate and rotate for the red head
    context.translate(headX + size / 2, headY + size / 2);
    context.rotate((headDir - 1) * (Math.PI / 2)); // Adjust rotation to be 90 degrees counterclockwise
    context.translate(-headX - size / 2, -headY - size / 2);

    // Draw the red head with eyes
    context.fillStyle = 'rgb(220, 0, 0)';
    context.beginPath();
    context.arc(headX + size / 4, headY + size / 4, 2, 0, Math.PI * 2);
    context.arc(headX + (3 * size) / 4, headY + size / 4, 2, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(headX + size / 2, headY + size / 2 + size / 4, size / 2, 0, Math.PI * 2);
    context.fill();

    // Restore the context state to prevent affecting other drawings
    context.restore();

    // Update head position
    if (headDir === 0) {
        headX += headSpeed;
    } else if (headDir === 1) {
        headY += headSpeed;
    } else if (headDir === 2) {
        headX -= headSpeed;
    } else if (headDir === 3) {
        headY -= headSpeed;
    }
    headX = Math.max(0, Math.min(canvas.width - size, headX));
    headY = Math.max(0, Math.min(canvas.height - size, headY));
}

function auto() {
    if (headX > foodX) {
        headDir = 2;
    } else if (headX < foodX) {
        headDir = 0;
    }
    if (headX === foodX && headY > foodY) {
        headDir = 3;
    } else if (headX === foodX && headY < foodY) {
        headDir = 1;
    }
}

function keyPressed(event) {
    console.log(`Key pressed: ${event.key}`);
    if (event.key === 'ArrowRight' && headDir !== 2) {
        headDir = 0;
    } else if (event.key === 'ArrowDown' && headDir !== 3) {
        headDir = 1;
    } else if (event.key === 'ArrowLeft' && headDir !== 0) {
        headDir = 2;
    } else if (event.key === 'ArrowUp' && headDir !== 1) {
        headDir = 3;
    }
}

function toggleAuto() {
    isOn = !isOn;
    if (isOn) {
        toggleButton.style.backgroundColor = '#4CAF50'; // Green
        toggleButton.textContent = 'AUTO ON';
    } else {
        toggleButton.style.backgroundColor = '#008CBA'; // Blue
        toggleButton.textContent = 'AUTO OFF';
    }

}
function togMut() {
    isMut = !isMut;
    if (!isMut) {
        muteTog.textContent= 'UNMUTE';
        muteTog.style.backgroundColor = "red"
      } else {
        muteTog.textContent= 'MUTE';
        muteTog.style.backgroundColor = "green"
      }    

}

function adjustFrameRate(event) {
    frameRate = event.target.value;
}

// Start the game
draw();
