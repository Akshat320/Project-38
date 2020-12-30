var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var dieSound, jumpSound, checkPointSound;

var score;
var plane1;
var plane2, plane3, plane4, plane5, plane6, plane7;

var bg, fire;
var fireImg;

//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver, restart, gameOverImage, restartImage;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  fireImg = loadImage("missile.png")
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");

  plane1 = loadImage("f1.png");
  //obstacle1 = loadImage("f2.png");
  obstacle1 = loadImage("f3.png");
  //obstacle3 = loadImage("f4.jpg");
  //obstacle4 = loadImage("f5.jpg");
 // obstacle5 = loadImage("f6.jpg");
  obstacle2 = loadImage("f7.png");

  bg = loadImage("bg1.png")
  
  dieSound = loadSound("die-1.mp3");
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(1000, 500);
  
  trex = createSprite(50,420,20,50);
  trex.addImage(plane1);
  trex.scale = 0.05;
  trex.addAnimation("collided", trex_collided)
  
  ground = createSprite(500, 300, width*5, height);
  ground.addImage(bg);
  ground.x = ground.width/5;
 // ground.velocityX = -4;
  
  invisibleGround = createSprite(200,430,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver = createSprite(300,100);
  restart = createSprite(300,140);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.5;
    restart.addImage(restartImage);
    restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

}

function draw() {
  background("grey");
  

  
 // ground.velocityX = -(6+3*score/100);
  
  if (gameState === PLAY) 
  {
  score = score + Math.round(getFrameRate()/60);
  if (score > 0 && score%100 === 0)  {
      checkPointSound.play();
    }
    
   
    
  if(keyWentDown(UP_ARROW)) {
    trex.velocityY = trex.velocityY - 1.8;
    invisibleGround.y = trex.y+10
    jumpSound.play();
    
  }

  if(keyWentUp(UP_ARROW)) {
    trex.velocityY = 0;
  }
 
    
  if(keyWentDown(DOWN_ARROW)) {
    trex.velocityY = trex.velocityY + 1.8;
    invisibleGround.y = trex.y+10
    jumpSound.play();
    
  }

  if(keyWentUp(DOWN_ARROW)) {
    trex.velocityY = 0;
  }

  if(trex.y<20 || trex.y > 480)
  {
    gameState = END;
  }
  
  trex.velocityX = 4;
  ground.x = trex.x;
  ground.y = trex.y;

  gameOver.x = trex.x;
  gameOver.y = trex.y+100;
  restart.x = trex.x;
  restart.y = trex.y+150

  trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
     
      dieSound.play();
      trex.velocityX = 0;
      gameState = END;
     
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    
    //change the trex animation
    //trex.changeAnimation("collided", trex_collided);
    trex.visible = false;
    trex.velocityX = 0;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  
    
   if(mousePressedOver(restart)) {
    reset();
  }


  if(keyWentDown("space"))
  {

   fire = createSprite(500, 250, 20, 20);
   fire.x = trex.x;
   fire.y = trex.y;
   fire.velocityX = 7;
   fire.addImage(fireImg);
   fire.scale = 0.04;
  } 

  if(keyWentDown("space"))
  {

   fire.addImage(fireImg);
   fire.velocityX = 7;
   fire.scale = 0.04;
  } 



  camera.position.x = trex.x;
  camera.position.y = trex.y;
  
  drawSprites();
  fill("red")
  textSize(20); 
  text("Score: "+ score, 450,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(trex.x+500,random(200,265),10,40);
    obstacle.velocityX = -(6+score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);     
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset()
{
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  trex.visible = true;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
  
}


