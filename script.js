const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = canvas.clientWidth;
const canvasHeight = canvas.height = canvas.clientHeight;

const bg=new Image();
bg.src='background.jpg'

const sizeModifier=Math.random()*1.3 +0.7

const tileStats = [
  {
    name: "giantSkeleton",
    spriteX: 0,
    spriteY: 4,
    width: 159,
    height: 129,
    walkable: false,
    damage: 10,
    maxInstances:1

  },
  {
    name: "collapsedTemple",
    spriteX: 0,
    spriteY: 120,
    width: 80,
    height: 103,
    walkable: false,
    damage:3,
    maxInstances:2

  },
  {
    name: "smallTree",
    spriteX: 0,
    spriteY: 230,
    width: 61,
    height: 73,
    walkable: true,
    damage:0,
    maxInstances:4

  },
  {
    name: "collapsedSmallTemple",
    spriteX: 0,
    spriteY: 340,
    width: 78,
    height: 68,
    walkable: true,
    damage:0,
    maxInstances:5

  },
  {
    name: "stone",
    spriteX: 0,
    spriteY: 368,
    width: 63,
    height: 66,
    walkable: true,
    damage:0,
    maxInstances:8

    
  },
  {
    name: "boneHandRed",
    spriteX: 0,
    spriteY: 432,
    width: 64,
    height: 66,
    walkable: false,
    damage: 10,
    maxInstances:4

  },
  {
    name: "stoneSmall",
    spriteX: 0,
    spriteY: 496,
    width: 51,
    height: 49,
    walkable: true,
    damage: 0,
    maxInstances:15

  },
  {
    name: "creepyTree",
    spriteX: 242,
    spriteY: 129,
    width: 65,
    height: 91,
    walkable: false,
    damage: 10,
    maxInstances:5

  },
  {
    name: "ribCage",
    spriteX: 480,
    spriteY: 110,
    width: 67,
    height: 69,
    walkable: false,
    damage: 10,
    maxInstances:3

  },
  {
    name: "boneHandBlue",
    spriteX: 622,
    spriteY: 307,
    width: 48,
    height: 56,
    walkable: false,
    damage: 10,
    maxInstances:5

  },
  {
    name: "skullHead",
    spriteX: 622,
    spriteY: 374,
    width: 48,
    height: 56,
    walkable: false,
    damage: 10,
    maxInstances:2

  },
  {
    name: "grass",
    spriteX: 191,
    spriteY: 438,
    width: 50,
    height: 49,
    walkable: true,
    damage: 0,
    maxInstances:20

  },
  {
    name: "treeStomp",
    spriteX: 61,
    spriteY: 590,
    width: 53,
    height: 35,
    walkable: true,
    damage: 0,
    maxInstances:4

  },
  {
    name: "skullPack",
    spriteX: 194,
    spriteY: 373,
    width: 79,
    height: 58,
    walkable: false,
    damage: 10,
    maxInstances:3

  },{
    name: "redVine",
    spriteX: 478,
    spriteY: 0,
    width: 97,
    height: 67,
    walkable: true,
    damage: 4,
    maxInstances:7

  },
  {
    name: "bushell",
    spriteX: 495,
    spriteY: 373,
    width: 67,
    height: 60,
    walkable: true,
    damage: 0,
    maxInstances:20

  },
  {
    name: "skullJaw",
    spriteX: 390,
    spriteY: 548,
    width: 35,
    height: 36,
    walkable: true,
    damage: 0,
    maxInstances:3

  },
  {
    name: "trunk",
    spriteX: 484,
    spriteY: 179,
    width: 97,
    height: 43,
    walkable: true,
    damage: 0,
    maxInstances:4

  },
  {
    name: "graveLeft",
    spriteX: 326,
    spriteY: 659,
    width: 24,
    height: 23,
    walkable: true,
    damage: 0,
    maxInstances:10

  },
  {
    name: "graveRight",
    spriteX: 354,
    spriteY: 659,
    width: 24,
    height: 23,
    walkable: true,
    damage: 0,
    maxInstances:10

  },
  {
    name: "ramSkull",
    spriteX: 719,
    spriteY: 500,
    width: 49,
    height: 44,
    walkable: false,
    damage: 0,
    maxInstances:2

  }
];
const placedObjects = [];
const objectSprite = new Image();
objectSprite.src = 'Objects.png';

const getRandomObject=(array)=> {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}
function getRandomPosition(stats, minSpacing = 50, maxAttempts = 30) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = Math.random() * (canvas.width - stats.width);
    const y = Math.random() * (canvas.height - stats.height);

    const tooClose = placedObjects.some(obj => {
      const dx = obj.x - x;
      const dy = obj.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Minimum distance is based on both object sizes
      const spacing = Math.max(minSpacing, Math.sqrt(stats.width**2 + stats.height**2) * 0.5);
      return dist < spacing;
    });

    if (!tooClose) {
      return { x, y };
    }
  }
  // Fallback — if we can't find a spot after many tries
  return { 
    x: Math.random() * (canvas.width - stats.width), 
    y: Math.random() * (canvas.height - stats.height) 
  };
}


for (let i = 0; i < 50; i++) {
  const availableObjects = maxInstancesFilter();
  if (availableObjects.length === 0) break;

  const stats = getRandomObject(availableObjects);
  const pos = getRandomPosition(stats);

  if(pos.y<=600&&pos.y+350+stats.height*0.5<canvasHeight){
    pos.y+=350
  }
  
  placedObjects.push({
    ...stats,
    x: pos.x,
    y: pos.y
  });
}

class Player {
  constructor(x, y, width, height, color = 'blue') {
    this.x = x;
    this.y = y;
    this.initialY = y;  
    this.width = width;
    this.height = height;
    this.color = color;

    this.speedX = 0;
    this.speedY = 0;

    this.moveSpeed = 4;
    this.dashMultiplier = 2;
    this.isDashing = false;
    this.friction = 0.8;
    
    this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
    this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
  
  }

  update() {
  
  
  // Apply tentative position
  this.x += this.speedX;
  this.y += this.speedY;
  const groundY = this.initialY;
  
  // Check collision with objects
  this.checkCollision(placedObjects);
  
  // Prevent falling below floor
  if (this.y + this.height > canvas.height) {
    this.y = canvas.height - this.height;
    this.speedY = 0;
    this.isOnGround = true;
  } else if (!this.isOnGround) {
    this.isOnGround = false;
  }
  
  // Friction for horizontal speed handled in animate()
}
  checkCollision(objects) {
  for (const obj of objects) {
    if (!obj.walkable && isColliding(this, obj)) {
      // Simple collision response: stop horizontal movement
      // You can also try to push the player outside the object bounds

      // Horizontal collision check
      if (this.x + this.width > obj.x+obj.width/2 && this.x < obj.x + obj.width/2) {
        if (this.speedX > 0) {
          // Moving right — place player to left of object
          this.x = obj.x+obj.width/2 - this.width;
          this.speedX = 0;
        } else if (this.speedX < 0) {
          // Moving left — place player to right of object
          this.x = obj.x + obj.width/2;
          this.speedX = 0;
        }
      }

      // Vertical collision check
      if (this.y + this.height > obj.y + obj.height / 2 && this.y < obj.y + obj.height / 2) {
  if (this.speedY > 0) {
    // Moving down: stop movement if player bottom would go past center
    if (this.y + this.height >= obj.y + obj.height / 2) {
      this.speedY = 0;
      this.y = obj.y + obj.height / 2 - this.height; // stop exactly at center line
    }
  } else if (this.speedY < 0) {
    // Moving up: stop movement if player top would go above center
    if (this.y <= obj.y + obj.height / 2) {
      this.speedY = 0;
      this.y = obj.y + obj.height / 2; // stop just below center line
    }
  }
}

    }
  }

}
draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
setMovement(keys) {
    const speed = this.isDashing ? this.moveSpeed * this.dashMultiplier : this.moveSpeed;

    // Reset speeds
    this.speedX = 0;
    this.speedY = 0;

    if (keys.left) this.speedX = -speed;
    if (keys.right) this.speedX = speed;
    if (keys.up) this.speedY = -speed;
    if (keys.down) this.speedY = speed;
  }

  setDash(isDashing) {
    this.isDashing = isDashing;
  }
}





function maxInstancesFilter(){
    let count=placedObjects.reduce((acc,curr)=>{
    acc[curr.name]=(acc[curr]||0)+1;
    return acc;
  },{})
  return tileStats.filter((stat) => {
    return (count[stat.name] || 0) < stat.maxInstances;
  });

 }

console.log(placedObjects)
const player = new Player(50, 50, 10, 10);

const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  dash: false,
};


window.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
  if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
  if (e.shiftKey) keys.dash = true;

  player.setDash(keys.dash);
  player.setMovement(keys);
});

window.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  if (!e.shiftKey) keys.dash = false;

  player.setDash(keys.dash);
  player.setMovement(keys);
});

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}


function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
     ctx.drawImage(bg, 0,-200, canvasWidth*1.3, canvasHeight*1.3);
    
  
    for (const obj of placedObjects) {
        ctx.drawImage(objectSprite,obj.spriteX,obj.spriteY,obj.width,obj.height, obj.x, obj.y,obj.width, obj.height); }


    if (keys.left) player.speedX = -player.moveSpeed;
    else if (keys.right) player.speedX = player.moveSpeed;
    else player.speedX *= player.friction; 
    player.update();
    player.draw(ctx);
    requestAnimationFrame(animate);
}
animate()
 
// building a function that make sure only the max instance of an image is present
 