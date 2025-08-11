const canvasBackground = document.getElementById('canvas1');
const ctxB = canvasBackground.getContext('2d');
const canvasWidth1 = canvasBackground.width = 1400;
const canvasHeight1 = canvasBackground.height = 700;

let gameSpeed = 15;

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'Resources/cracks1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'Resources/cracks2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'Resources/houses1.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'Resources/houses2.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'Resources/houses3.png';
const backgroundLayer6 = new Image();
backgroundLayer6.src = 'Resources/houses4.png';
const backgroundLayer7 = new Image();
backgroundLayer7.src = 'Resources/road.png';
const backgroundLayer8 = new Image();
backgroundLayer8.src = 'Resources/sky.png';
const backgroundLayer9 = new Image();
backgroundLayer9.src = 'Resources/wall.png';

class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 1400; // Replace with image.width once loaded
        this.height = 700;
        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = this.width + this.x2 - this.speed;
        }
        if (this.x2 <= -this.width) {
            this.x2 = this.width + this.x - this.speed;
        }
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw() {
        ctxB.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctxB.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.5);
const layer2 = new Layer(backgroundLayer2, 0.3);
const layer3 = new Layer(backgroundLayer3, 0.3);
const layer4 = new Layer(backgroundLayer4, 0.5);
const layer5 = new Layer(backgroundLayer5, 0.4);
const layer6 = new Layer(backgroundLayer6, 0.5);
const layer7 = new Layer(backgroundLayer7, 0.5);
const layer8 = new Layer(backgroundLayer8, 1.5);
const layer9 = new Layer(backgroundLayer9, 0.5);


const layers = [layer9,layer8,layer6,layer5, layer4, layer3, layer2, layer7,layer1];

function backgroundAnimate() {
    ctxB.clearRect(0, 0, canvasWidth1, canvasHeight1);
    layers.forEach(layer => {
        layer.update();
        layer.draw();
    });
    requestAnimationFrame(backgroundAnimate);
}

// Start animation only after all images load
Promise.all([
    backgroundLayer1.decode(),
    backgroundLayer2.decode(),
    backgroundLayer3.decode(),
    backgroundLayer4.decode(),
    backgroundLayer5.decode(),
    backgroundLayer6.decode(),
    backgroundLayer7.decode(),
    backgroundLayer8.decode(),
    backgroundLayer9.decode(),
]).then(() => {
    backgroundAnimate();
});



const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
canvas.width = 1400;
canvas.height = 700;

const playerImage = new Image();
playerImage.src = "Resources/Warrior_Sheet-Effect.png";

const playerWidth = 69;
const playerHeight = 44;
let gameFrames = 0;
const staggerFrames = 5; // controls animation speed
const gravity=0.8
// Key states
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    Space: false
};

window.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});
window.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});
window.addEventListener('keydown', e => {
    if (e.key === " ") keys.Space = true;
    else if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener('keyup', e => {
    if (e.key === " ") keys.Space = false;
    else if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

//include stamina and remove jump limiters and have jump cos that as well as attacks, add mana too and health
// Animation states definition
const animationState = [
    { name: 'idle', frames: 6 }, 
    { name: 'run', frames: 6 }, 
    { name: 'fall', frames: 9 },
    { name: 'dizzy', frames: 11 },
    { name: 'sit', frames: 5 },
    { name: 'roll', frames: 7 },
    { name: 'jump', frames: 4 },
    { name: 'bite', frames: 7 },
    { name: 'ko', frames: 12 },
    { name: 'getHit', frames: 4 }
];

// Build animation lookup
const playerAnimation = {};
animationState.forEach((state, index) => {
    let frames = { loc: [] };
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * playerWidth;
        let positionY = index * playerHeight;
        frames.loc.push({ x: positionX, y: positionY });
    }
    playerAnimation[state.name] = frames;
});

class Player {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.state = "idle";
        this.speed = 15;

        this.speedY = 0;
        this.gravity = gravity;  // tweak this for jump feel
        this.jumpStrength = 15;
        this.isOnGround = false;
        this.groundY = this.y;  // The "floor" y position
    }

    update() {
        // Horizontal movement
        if (keys.ArrowRight || keys.d) {
            this.x += this.speed;
            if (this.isOnGround) this.state = "run";
            this.facingLeft = false;
        } else if (keys.ArrowLeft || keys.a) {
            this.x -= this.speed;
            this.facingLeft = true;
            if (this.isOnGround) this.state = "run";
        } else {
            if (this.isOnGround) this.state = "idle";
        }

        // Jumping
        if (keys.Space && this.isOnGround) {
            this.speedY = -this.jumpStrength;
            this.isOnGround = false;
            this.state = "jump";
        }
        // double jump
        if (keys.Space && !this.isOnGround && this.y>canvas.height*0.3) {
            this.speedY = -this.jumpStrength;
            this.isOnGround = false;
            this.state = "jump";
            
        }
         if(this.y<canvas.height*0.3){
            this.gravity=10
            this.speedY += this.gravity;
            this.y += this.speedY;
        }

        // Apply gravity
        this.speedY += this.gravity;
        this.y += this.speedY;
       
        // Landing on ground
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.speedY = 0;
            this.gravity=gravity
            this.isOnGround = true;
            if (!(keys.ArrowLeft || keys.a || keys.ArrowRight || keys.d)) {
                this.state = "idle";
            } else {
                this.state = "run";
            }
        } else {
            // In air and falling
            if (this.speedY > 0) {
                this.state = "fall";
            }
        }

        // Prevent going off screen horizontally
        this.x = Math.max(0, Math.min(canvas.width - playerWidth * this.scale, this.x));
        // Prevent going above top of canvas
        this.y = Math.max(0, this.y);
    }

    draw() {
    let position = Math.floor(gameFrames / staggerFrames) % playerAnimation[this.state].loc.length;
    let frameX = playerAnimation[this.state].loc[position].x;
    let frameY = playerAnimation[this.state].loc[position].y;

    ctx.save();
    //facing left mechanics
    if (this.facingLeft) {
        // Move to player's center, flip horizontally, then move back
        ctx.translate(this.x + playerWidth * this.scale / 2, this.y);
        ctx.scale(-1, 1);
        // Move to player's center, flip horizontally, then move back
        ctx.drawImage(
            playerImage,
            frameX, frameY, playerWidth, playerHeight,
            -playerWidth * this.scale / 2, 0,
            playerWidth * this.scale, playerHeight * this.scale
        );
    } else {
        ctx.drawImage(
            playerImage,
            frameX, frameY, playerWidth, playerHeight,
            this.x, this.y,
            playerWidth * this.scale, playerHeight * this.scale
        );
    }
    ctx.restore();
}

}

const player = new Player(200, 550, 3);

function animate() {
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    player.draw();
    gameFrames++;
    requestAnimationFrame(animate);
    ctx.restore()
}

playerImage.onload = () => {
    animate();
};