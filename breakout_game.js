const canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

let dx = 2;
let dy = -2;

let x = canvas.width/2;
let y = canvas.height - 30;

const paddleWidth = 75;
const paddleHeight = 10;
let paddleX = (canvas.width-paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

const ballRadius = 10;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;

let bricks = [];
for (let c=0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r=0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

const drawBricks = () => {
    for (let c=0; c < brickColumnCount; c++) {
        for (let r=0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                bricks[c][r].x = c*(brickWidth + brickPadding) + brickOffsetLeft;
                bricks[c][r].y = r*(brickHeight + brickPadding) + brickOffsetTop;
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

const collisionDetection = () => {
    for (let c=0; c < brickColumnCount; c++) {
        for (let r=0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickColumnCount*brickRowCount) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}


const drawScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    collisionDetection();
    drawScore();
    drawPaddle();
    drawBall();

    if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    // if (y + dy < ballRadius) {
    //     dy = -dy;
    // }
    // else if (y + dy > canvas.height-ballRadius) {
    //     if (x > paddleX && x < paddleX + paddleWidth) {
    //         dy = -dy;
    //     }
    //     else {
    //         alert('GAME OVER');
    //         document.location.reload();
    //         x = canvas.width/2;
    //         y = canvas.height - 30;
    //     }
    // }

    if (y + dy < ballRadius || (x + ballRadius > paddleX && x-ballRadius < paddleX + paddleWidth && y + ballRadius === canvas.height-paddleHeight)) {
        dy = -dy;
    }
    else if (y + dy > canvas.height-ballRadius) {
        alert('GAME OVER');
        document.location.reload();
        x = canvas.width/2;
        y = canvas.height - 30;
    }

    x += dx;
    y += dy;

    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

const keydownHandler = (e) => {
    if (e.keyCode === 39) 
        rightPressed = true;
    else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

const keyupHandler = (e) => {
    if (e.keyCode === 39) 
        rightPressed = false;
    else if (e.keyCode === 37) {
        leftPressed = false;
    }
}

const mousemoveHandler = (e) => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}


document.addEventListener('keydown', keydownHandler, false);
document.addEventListener('keyup', keyupHandler, false);
document.addEventListener('mousemove', mousemoveHandler, false);



setInterval(draw, 10);

