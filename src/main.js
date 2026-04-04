var pole = [[]];
var direction = "right";
var snake = [];
var lenghtOfSnake = 4;
var food = null;
var hasMoved = false;
var timeFromLastMove = 0;



function setupArray(pole)
{
  for (let i = 0; i < 20; i++) {
    pole[i] = [];
    for (let j = 0; j < 20; j++) {
      pole[i][j] = 0;
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function findHead(pole) {
  var head = [0, 0];
  var max = 0;
  for (let i = 0; i < pole.length; i++) {
    for (let j = 0; j < pole[i].length; j++) {
      if (pole[i][j] > max) {
        head[0] = i;
        head[1] = j;
        max = pole[i][j];
      }
    }
  }
  return head;
}

function move(head) {
  var newHead = [0, 0];
  if (direction == "right") {
    newHead[0] = head[0];
    newHead[1] = (head[1] + 1) % 20;
  }
  else if (direction == "left") {
    newHead[0] = head[0];
    newHead[1] = (head[1] - 1 + 20) % 20;
  }
  else if (direction == "up") {
    newHead[0] = (head[0] - 1 + 20) % 20;
    newHead[1] = head[1];
  }
  else if (direction == "down") {
    newHead[0] = (head[0] + 1) % 20;
    newHead[1] = head[1];
  }
  
  checkCollision(newHead);
  checkFood( [newHead[0],  newHead[1]]);
  pole[newHead[0]][newHead[1]] = lenghtOfSnake + 1;
  timeFromLastMove = Date.now();

  return newHead;
}

function moveBack(head) {
  var newHead = [0, 0];
  if (direction == "right") {
    newHead[0] = head[0];
    newHead[1] = (head[1] - 1) % 20;
  }
  else if (direction == "left") {
    newHead[0] = head[0];
    newHead[1] = (head[1] - 1) % 20;
  }
  else if (direction == "up") {
    newHead[0] = (head[0] - 1) % 20;
    newHead[1] = head[1];
  }
  else if (direction == "down") {
    newHead[0] = (head[0] - 1) % 20;
    newHead[1] = head[1];
  }
  
  //checkCollision(newHead);
  //checkFood( [newHead[0],  newHead[1]]);
  pole[newHead[0]][newHead[1]] = lenghtOfSnake + 1;
  //timeFromLastMove = Date.now();

  return newHead;
}

function checkCollision(head) {
  if (pole[head[0]][head[1]] > 0) {
    console.log("Game over!");
    pole = [[]];
    direction = "right";

    for (let i = 0; i < snake.length; i++) {
      snake[i].cube.dispose();
    }

    snake = [];
    lenghtOfSnake = 4;
    food = null;
    setupArray(pole);
    placeFood();
  }
}
function ageSnake() 
{
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (pole[i][j] > 0) 
      {
        pole[i][j] = pole[i][j] - 1;
      }
    }
  }
}

document.addEventListener('keydown', function(event) {
      hasMoved = true;

if(event.key == "d" && direction != "right") {
  direction = "left";
}
else if(event.key == "a" && direction != "left") {
  direction = "right";
}
else if(event.key == "w" && direction != "down") {
  direction = "up";
}
else if(event.key == "s" && direction != "up") {
  direction = "down";
}

var head = findHead(pole);
if(timeFromLastMove + 250 > Date.now()) 
{
  moveBack(head);
}
    move(head);
    ageSnake();
    placeHead(head);
    removeTail();

    hasMoved = false;
});
        
  const canvas = document.getElementById("renderCanvas"); // Get the canvas element
  var scena = 0;

      const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
  const createScene = function () { 
              // Creates a basic Babylon Scene object
        const scene = new BABYLON.Scene(engine);
        scena = scene;
              // Creates and positions a free camera 
      const camera = new BABYLON.FreeCamera("camera1",
      new BABYLON.Vector3(10, 25, 10), scene); // nad středem pole

    // Kamera bude mířit přímo dolů na střed hrací plochy
    camera.setTarget(new BABYLON.Vector3(10, 0, 10));

    // Zamknutí kamery (žádné ovládání myší ani dotykem)
    camera.detachControl();

    // (volitelné) úplné vypnutí rotace/pohybu
    camera.inputs.clear();
      // Creates a light, aiming 0,1,0 - to the sky
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  // Dim the light a small amount - 0 to 1
    light.intensity = 0.7; 
    
      // Built-in 'sphere' shape.
    //const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
  // Move the sphere upward 1/2 its height         
  //sphere.position.y = 1;
  // Built-in 'ground' shape.
   //const ground = BABYLON.MeshBuilder.CreateGround("ground",{width: 6, height: 6}, scene);            
   return scene;    
    };        
    const scene = createScene(); //Call the createScene function 
         // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
      scene.render(); 
    });        // Watch for browser/canvas resize events
       window.addEventListener("resize", function () {
        engine.resize();     
   });   
   startGame();



async function startGame()
{
  setupArray(pole);
  pole[getRandomInt(20)][getRandomInt(20)] = 1;
  var head = findHead(pole);
  placeFood();

  while (true) 
  {
    if (!hasMoved) {
    head = findHead(pole);
    move(head);
    ageSnake();
    placeHead(head);
    removeTail();
    } else {
      //hasMoved = false;
    }

    console.log(pole);
    await new Promise(r => setTimeout(r, 500));
  }
}

function placeHead(head)
{
  const cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scena);
  cube.position.y = 0.5;
  cube.position.x = head[1];
  cube.position.z = head[0];

  snake.push({cube, head});
}

function removeTail() {
  if (snake.length > lenghtOfSnake) {
    const tail = snake.shift();
    tail.cube.dispose();
  }
}

function placeFood() {
  var x = getRandomInt(20);
  var y = getRandomInt(20);
  while (pole[y][x] != 0) {
    x = getRandomInt(20);
    y = getRandomInt(20);
  }
  pole[y][x] = -1;

  const cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 0.5}, scena);
  cube.position.y = 0.5;
  cube.position.x = x;
  cube.position.z = y;

  food = cube;
}

function growSnake() {
  lenghtOfSnake++;
  placeFood();
}

function checkFood(head) {
  if (pole[head[0]][head[1]] == -1) {
    console.log("Food eaten!");
    food.dispose();
    food = null;
    growSnake();
    pole[head[0]][head[1]] = lenghtOfSnake + 1;
  }
}