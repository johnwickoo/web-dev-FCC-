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


function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
     ctx.drawImage(bg, 0,-200, canvasWidth*1.3, canvasHeight*1.3);
    for (const obj of placedObjects) {
        ctx.strokeRect(obj.x,obj.y,obj.width,obj.height)
        ctx.drawImage(objectSprite,obj.spriteX,obj.spriteY,obj.width,obj.height, obj.x, obj.y,obj.width, obj.height); }
    requestAnimationFrame(animate);
}
animate()
 
// building a function that make sure only the max instance of an image is present
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