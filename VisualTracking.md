---
layout: single
title: A small simulation for BIOE97156
author_profile: true
permalink: /robot/
---

This is meant to be a short trial for the simulation of the tracking report for the Imperial College module on Animal Locomotion and Bioinspired Robotics.


<div id="sketch-holder"></div>
<div id="buttons-holder"></div>

Here is my implementation

<script src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.js"></script>
<script src="https://raw.githubusercontent.com/processing/p5.js/1.0.0/src/dom/dom.js"></script>
<script src="/assets/js/p5library/p5.clickable.js"></script>

<script>
let button;
let robot;
let prey;
let obstacle;
let canvas;
let w = 800;
let h = 600;
var just_restarted = false;
var setup_complete;
var robot_setup = true;
var prey_setup = false;
var obstacle_setup = false;

function setup() {
  canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');
	resetSketch();

	myButton = new Clickable();     //Create button
	myButton.text = "Reset";
	myButton.locate(w-90, 10);        //Position Button
	myButton.width = 80;
	myButton.height = 35;
	myButton.onPress = function(){  //When myButton is pressed
	  //this.color = "#AAAAFF";       //Change button color
	  resetSketch();                //Show an alert message
	}

}

function draw() {
  background(235);
  push();
  myButton.draw();
  pop();
  //Display the button
 

  if(setup_complete == false){
    position_stuff();
  } else {
    // Set angle of prey
    targetAngle = getAngle();
    obstacleAngle = getObstacleAngle();
    obstacleDist = getDistance(obstacle);
    robot.update(targetAngle, obstacleAngle, obstacleDist);
    robot.moveForward();
    robot.show();
    
    prey.show();
    prey.update();
    obstacle.show();
    
    tipX = robot.xpos + (robot.len/2)*cos(robot.angle);
    tipY = robot.ypos + (robot.len/2)*sin(robot.angle);
    if ( distance(tipX, tipY, prey.xpos, prey.ypos) < prey.radius - 10) {
      robot.speed = 0;
      prey.yspeed = 0;
      prey.xspeed = 0;
    }
    
  }
  
  
}

function resetSketch(){
	robot_setup = true;
	prey_setup = false;
	obstacle_setup = false;
	prey = new Prey();
	obstacle = new Obstacle();
	frameRate(30);
	setup_complete = false;
	just_restarted = true;

	robot = new Robot(mouseX, mouseY);
	robot.speed = 0;

}

function distance(x1, y1, x2, y2){
  deltaX = x2 - x1;
  deltaY = y2 - y1;
  var dist = sqrt(deltaX*deltaX + deltaY*deltaY);
  return dist;
}

function getAngle(){
  
  push();
  translate(robot.xpos, robot.ypos);
  rotate(robot.angle);
  translate(0, robot.len/2 + 10);
  
  // Chase mouse
  deltaX = mouseX - robot.xpos;
  deltaY = mouseY - robot.ypos;
  
  // Same but with prey
  deltaX = prey.xpos - robot.xpos;
  deltaY = prey.ypos - robot.ypos;
  
  var angle = atan2(deltaY, deltaX);
  var angle_diff = angle - robot.angle;
  
  //Set angle limits
  if(angle_diff >= PI){
    angle_diff = -2*PI + angle_diff;
  } else if (angle_diff < -PI){
    angle_diff = 2*PI + angle_diff;
  }
  pop();
  return angle_diff;
}

function getObstacleAngle(){
  push();
  translate(robot.xpos, robot.ypos);
  rotate(robot.angle);
  translate(0, robot.len/2 + 10);
  
  // Same but with obstacle
  deltaX = obstacle.xpos - robot.xpos;
  deltaY = obstacle.ypos - robot.ypos;
  
  var angle = atan2(deltaY, deltaX);
  var angle_diff = angle - robot.angle;
  
  //Set angle limits
  if(angle_diff >= PI){
    angle_diff = -2*PI + angle_diff;
  } else if (angle_diff < -PI){
    angle_diff = 2*PI + angle_diff;
  }
  pop();
  return angle_diff;
}

function preyLocation(){
  let x = floor(random(w));
  let y = floor(random(h));  
}

function getDistance(object){
  deltaX = object.xpos - robot.xpos;
  deltaY = object.ypos - robot.ypos;
  var dist = sqrt(deltaX*deltaX + deltaY*deltaY);
  return dist;
}

function position_stuff(){
  
  textSize(32);
  fill(0, 102, 153);
  
  if(robot_setup){
    text('Place robot by clicking with the mouse', 10, 30);
    robot.show();
    robot.xpos = mouseX;
    robot.ypos = mouseY;
    } 
  else if(prey_setup){
    text('Place prey by clicking with the mouse', 10, 30);
  robot.show();
    prey.show();
    prey.xpos = mouseX;
    prey.ypos = mouseY;
  } 
  
  else if (obstacle_setup){
    text('Place obstacle by clicking with the mouse', 10, 30);
    prey.show();
    robot.show();
    obstacle.show();
    obstacle.xpos = mouseX;
    obstacle.ypos = mouseY;
    
  }
}

function mouseReleased(){
	if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
		if (just_restarted){
			just_restarted = false;
		}
		else if (robot_setup){
	    //text('Place robot by clicking with the mouse', 10, 30);
	    robot_setup = false;
	    prey_setup = true; 
	    prey = new Prey(mouseX, mouseY);
	    prey.xspeed = 0;
	  } 

	  else if(prey_setup){
	    //text('Place prey by clicking with the mouse', 10, 30);
	    
	    prey_setup = false;
	    obstacle_setup = true;
	    obstacle = new Obstacle(mouseX, mouseY);
	  } 
	  
	  else if (obstacle_setup){
	    prey.show();
	    robot.show();
	    
	    //text('Place obstacle by clicking with the mouse', 10, 30);
	    obstacle_setup = false;
	    setup_complete = true;
	    prey.xspeed = 1.5;
	    robot.speed = 5.0;
	  }
	}
 
}

class Obstacle{
  
  constructor(xpos, ypos){
   this.wid = 30;
   this.len = 30;
   this.xpos = xpos;
   this.ypos = ypos;
  }
  
  show(){
    stroke(0);
    fill(0,255,127);
    ellipse(this.xpos, this.ypos, this.wid, this.len);
  }
  
}

class PID_controller{
  
  constructor(pGain, iGain, dGain){
   this.pGain = pGain;
   this.iGain = iGain;
   this.dGain = dGain;
   this.prevError = 0.0;
   this.iError = 0.0;
  }
  
  update(error){
    var control = 0.0;
    control = this.pGain*error + this.dGain*(error - this.prevError) + this.iGain*(this.iError + error);
    this.iError = error + this.iError;
    this.prevError = error;
    return control;
  }   
  
  test(error){
    return error;
  }
}

class Prey{
  
  constructor(xpos, ypos){
   this.radius = 50;
   this.xpos = xpos;
   this.ypos = ypos;
   this.yspeed = 3;
   this.xspeed = 2.7;
   this.angle = 0;
  }
  
  show(){
    stroke(0);
    fill(139,0,0);
    ellipse(this.xpos, this.ypos, this.radius, this.radius);
  }
  
  update(){
    this.angle += 1;
    this.xpos += this.xspeed;
    this.ypos +=this.yspeed*sin(this.angle/10);
  }
  
  setSpeed(x,y){
    this.xspeed = x;
    this.yspeed = y;
  }
  
  cought(){
    
  }
}

class Robot{
  
  constructor(xpos, ypos){
   this.controller = new PID_controller(0.08, 0.0, 0.0);
   this.angle = 0;
   this.wid = 30;
   this.len = 40;
   this.rotation = 0;
   this.xspeed = 0;
   this.yspeed = 0;
   this.xpos = xpos;
   this.ypos = ypos;
   this.speed = 3;
   this.thresholdDist = 120;
  } 
  
  show(){
    push();
    
    translate(this.xpos, this.ypos);
    rotate(this.angle);
    rectMode(CENTER);
    stroke(0);
    fill(255,215,0);
    rect(0, 0, this.len, this.wid);
    fill(30,144,255);
    rect(this.len/2 + 5,0, 10, this.wid);
    fill(255);
    ellipse(this.len/2 + 10,0,5,5);
    
    pop();
  }
  
  update(targetAngle, obstacleAngle, obstacleDist){
    if(obstacleDist < this.thresholdDist && abs(obstacleAngle) < (this.thresholdDist/(obstacleDist + 30) * PI/6)){
      var w1 = (this.thresholdDist)/(this.thresholdDist + (this.thresholdDist-obstacleDist));
      var w2 = (this.thresholdDist - obstacleDist)/(this.thresholdDist + (this.thresholdDist-obstacleDist));

      //w1 = (PI/6)/(abs(obstacleAngle) + PI/6);
     // w2 = abs(obstacleAngle)/(PI/6 + abs(obstacleAngle));
      
      if(obstacleAngle < 0){
        obstacleAngle = -10 + obstacleAngle;
      } else if (obstacleAngle >= 0){
        obstacleAngle = 10 + obstacleAngle;
      }
      var rotation = this.controller.update(w1*targetAngle + w2*(-obstacleAngle));
      this.rotation = rotation;
      this.angle += this.rotation;
      
    } else {
      var rotation = this.controller.update(targetAngle);
      this.rotation = rotation;
      this.angle += this.rotation;
     
    }
    
    //Set angle limits
    if(this.angle > PI){
      this.angle = -2*PI + this.angle;
    } else if(this.angle <= -PI){
      this.angle =  2*PI + this.angle;
    }
  }
  
  moveForward(){
    push();
    rotate(this.angle);
    this.xpos += (this.speed * cos(this.angle));
    this.ypos += (this.speed * sin(this.angle));
    pop();
  }
}

</script>

