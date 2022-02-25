//creating all variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl ,girl_running ,girl_hurt;
var zombie,zombie_running,zombie_idle;

var bee,ground;
var beeImg,groundImg;

var invisibleGround;

var obstacleGroup,obstacle1,obstacle2,obstacle3,obstacle4,coinImg,coinGroup;

var gameOver,gameOverImg,restart,restartImg;

var jumpSound,dieSound,coinSound;

var score,speed;

function preload(){
  //loading all images and sounds
  girl_running = loadAnimation("Princess1.png","Princess2.png","Princess3.png","Princess4.png","Princess5.png");
  girl_hurt = loadAnimation("Princesshurt.png");

  groundImg = loadImage("Background.png");
  restartImg = loadImage("restart.png")

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("bomb.png");
  obstacle3 = loadImage("obstacle2.png");
  obstacle4 = loadImage("obstacle3.png");
  coinImg = loadImage("coin.png")

  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  coinSound = loadSound("coin.mp3");
}

function setup() {
  createCanvas(600,575);

  girl = createSprite(60,425,20,50);
  girl.addAnimation("running", girl_running);
  girl.addAnimation("hurt", girl_hurt);
  girl.scale = 0.3;
  girl.debug = true;
  girl.setCollider("rectangle",0,0,250,400);

  ground = createSprite(200,180,400,20);
  ground.addImage(groundImg);
  ground.x = ground.width /2;

  girl.depth = ground.depth;
  girl.depth +=1;

  invisibleGround = createSprite(600,520,600,10);
  invisibleGround.visible = false;
  invisibleGround.x = 300;

  gameOver = createSprite(300,275);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300,325);
  restart.addImage(restartImg);
  restart.scale = 0.7;

  obstacleGroup = createGroup();
  coinGroup = createGroup();

  score = 0;
  speed = 0;
}

function draw() {

  background(180);

  //if game state is play
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;

     //speed of ground
     ground.velocityX = -(3 + 3* speed/100);
     speed = speed + Math.round(getFrameRate()/60);
        
     //infinite ground
     if (ground.x < 150){
         ground.x = ground.width/2;
     }
        
     //jump when the space key is pressed
    if(keyDown("space")&& girl.y >= 440) {
        girl.velocityY = -15;
        jumpSound.play();
    }

    //gravity
    girl.velocityY = girl.velocityY + 0.8;
     
    //calling function
    spawnObstacle();

    //if girl touching coin
    if(coinGroup.isTouching(girl)){
      score = score + 1;
      coinGroup.destroyEach();
      coinSound.play();
    }
        
    //if girl touching obstacles
    if(obstacleGroup.isTouching(girl)){
      gameState = END;
      dieSound.play();
    }
  }
  //when game state is end
  if(gameState === END){
     gameOver.visible = true;
     restart.visible = true;

     girl.changeAnimation("hurt", girl_hurt);
     girl.y = 450;

     ground.velocityX = 0;
     obstacleGroup.setVelocityXEach(0); 
     coinGroup.setLifetimeEach(-1);
     coinGroup.setVelocityXEach(0); 
     obstacleGroup.setLifetimeEach(-1);
  }

  //girl collide with the invisible ground
  girl.collide(invisibleGround);

  //restart
  if(mousePressedOver(restart)) {
    reset();
  }

  drawSprites();

  //credit
  textSize(40);
  fill("red");
  text("By Bewin",10,50);

  //displaying score
  textSize(20);
  fill("red");
  text("Score: "+ score, 500,50);
}

function spawnObstacle(){
  if (frameCount % 120 === 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(5 + speed/100);
    
        
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
     }
     //assign scale and lifetime to the obstacle           
     obstacle.scale = 0.1;
     obstacle.lifetime = 300;
     obstacle.y = 500;

     obstacle.setCollider("rectangle",0,0,500,500);
    
     //add each obstacle to the group
     obstacleGroup.add(obstacle);
    }


     if(frameCount % 100 === 0){
        var coin = createSprite(600,165,10,40);
        coin.velocityX = -(5 + speed/100);
        coin.addImage(coinImg);
        coin.scale = 0.5;
        coin.lifetime = 300;
        coin.y = 350;
        coin.setCollider("rectangle",0,0,100,100);
        coinGroup.add(coin);
     }
  
}

function reset(){
  gameState = PLAY;
  speed = 0;
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  coinGroup.destroyEach();
  girl.changeAnimation("running", girl_running);
}