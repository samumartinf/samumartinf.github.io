---
layout: single
title: An interactive simulation for BIOE97156
author_profile: true
permalink: /robot/
---

This is meant to be an axiliary short explanation and discussion about target interception for Imperial College's module on Animal Locomotion and Bioinspired Robotics (ALBiR).

## The Simulation
Like in periodism, I will take the inverted pyramid approach for this writing. Let's start straight away with the more interesting and fun stuff, here is a simulation of a robot catching stuff.

<div id="sketch-holder"></div>

## Problem Specification
During the spring term of 2020 in ALBiR we have studied the different ways locomotion and environment perception and interaction works in the animal kingdom. From biped motion, to visual recognition and targer pursuit, we have explored Nature's solution for these problem. ~~Copying Nature~~ Inspired by Nature we were expected to take what we had learnt and take it to the real world. A small robot was built using two servo motors, a Raspberry Pi and a Pixy2 camera. 


<script src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.js"></script>
<script src="https://raw.githubusercontent.com/processing/p5.js/1.0.0/src/dom/dom.js"></script>
<script src="/assets/js/p5library/p5.clickable.js"></script>

<script>
let robot;
let prey;
let obstacle;
let canvas;
let w = 800;
let h = 600;
let dGain = 0.002;
let pGain = 0.08;
var just_restarted = false;
var setup_complete;
var robot_setup = true;
var prey_setup = false;
var obstacle_setup = false;
var bool_bearing = false;
var bool_speedy = false;
var bool_proportional = false;
var bool_sinusoidal = false;
var caught = false;
var bool_counting = false;
var time = 0;

function setup() {
	let buttonLength = 120;
	let buttonHeight = 35;
  canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');
	
	myButton = new Clickable();     //Create button
	myButton.text = "Reset";
	myButton.locate(w-buttonLength - 15, 10);        //Position Button
	myButton.width = buttonLength;
	myButton.height = buttonHeight;
	myButton.onPress = function(){  //When myButton is pressed
	  //this.color = "#AAAAFF";       //Change button color
	  resetSketch();                //Show an alert message
	}

	constantButton = new Clickable();
	constantButton.text = "C. Bearing"
	constantButton.locate(w-buttonLength - 15, 55);
	constantButton.width = buttonLength;
	constantButton.height = buttonHeight;
	constantButton.onPress = function(){
		constantBearing();
	}

	proportionalButton = new Clickable();
	proportionalButton.text = "Proportional"
	proportionalButton.locate(w-buttonLength - 15, 100);
	proportionalButton.width = buttonLength;
	proportionalButton.height = buttonHeight;
	proportionalButton.onPress = function(){
		proportional();
	}

	fastButton = new Clickable();
	fastButton.text = "Fast prey"
	fastButton.locate(w-buttonLength - 15, 145);
	fastButton.width = buttonLength;
	fastButton.height = buttonHeight;
	fastButton.onPress = function(){
		makeFast();
	}


	sinusoidalButton = new Clickable();
	sinusoidalButton.text = "Sinusoidal Prey"
	sinusoidalButton.locate(w-buttonLength - 15, 190);
	sinusoidalButton.width = buttonLength;
	sinusoidalButton.height = buttonHeight;
	sinusoidalButton.onPress = function(){
		activateSinusoid();
	}

	resetSketch();

}

function draw() {
  background(235);

  // Display buttons
  push();
  myButton.draw();
  constantButton.draw();
  fastButton.draw();
  proportionalButton.draw();
  sinusoidalButton.draw();
  pop();
  //Display the button
 

  if(setup_complete == false){
  	time = 0;
    position_stuff();
  } else {

  	if(caught == false){
  		time += + 1/30;
  	}
  	fill(0);
  	if (time > 10){
  		var message = ['Time to capture = ', nf(time,2,2), 's'];
  	} else {
  		var message = ['Time to capture = ', nf(time,1,2), 's'];
  	}
  	
  	text(join(message, ''), 10, 30);
  	print(join(message, ''));

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

    // Check if caught
    if ( distance(tipX, tipY, prey.xpos, prey.ypos) < prey.radius) {
    	caught = true;
      robot.speed = 0;
      prey.yspeed = 0;
      prey.xspeed = 0;
    }
  }
}

function resetSketch(){
	caught = false;
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

	if (bool_bearing){
		robot.constantBearing = -PI/10;
	} else {
		robot.constantBearing = 0;
	}
}

function constantBearing(){
	if (bool_bearing){
		robot.constantBearing = 0;
		constantButton.color = "#FFFFFF";
		bool_bearing = false;
	} else {
		robot.constantBearing = -PI/10;
		constantButton.color = "#A3A3FF";
		bool_bearing = true;
	}
}

function makeFast(){
	if(caught == false){
		if (bool_speedy){
			prey.xspeed = 3;
			fastButton.color = "#FFFFFF";
			bool_speedy = false;
		} else {
			prey.xspeed = 4;
			fastButton.color = "#A3A3FF";
			bool_speedy = true;
		} 
	} else {
		if (bool_speedy){
			fastButton.color = "#FFFFFF";
			bool_speedy = false;
		} else {
			fastButton.color = "#A3A3FF";
			bool_speedy = true;
		} 
	}
}

function proportional(){
	if (bool_proportional){
		robot.controller = new PID_controller(pGain, dGain, 0);
		proportionalButton.color = "#FFFFFF";
		bool_proportional = false;
	} else {
		robot.controller = new PID_controller(0, dGain, 0);
		proportionalButton.color = "#A3A3FF";
		bool_proportional = true;
	} 
}

function activateSinusoid(){
	if (bool_sinusoidal){
		prey.yspeed = 0;
		sinusoidalButton.color = "#FFFFFF";
		bool_sinusoidal = false;
	} else {
		prey.yspeed = 3;
		sinusoidalButton.color = "#A3A3FF";
		bool_sinusoidal = true;
	} 
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
  noStroke();
  fill(0, 102, 153);
  
  if(robot_setup){
  	noStroke();
  	fill(0, 102, 153);
    text('Place robot by clicking with the mouse', 10, 30);
    robot.show();
    robot.xpos = mouseX;
    robot.ypos = mouseY;
    } 
  else if(prey_setup){
  	noStroke();
  	fill(0, 102, 153);
    text('Place prey by clicking with the mouse', 10, 30);
  	robot.show();
    prey.show();
    prey.xpos = mouseX;
    prey.ypos = mouseY;
  } 
  
  else if (obstacle_setup){
  	noStroke();
  	fill(0, 102, 153);
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

	    //Set prey speed accordingly
	    if(bool_speedy){
	    	prey.xspeed = 4;
	    } else {
	    	prey.xspeed = 3;
	    }

	    if(bool_sinusoidal){
	    	prey.yspeed = 3;
	    } else {
	    	prey.yspeed = 0;
	    }

	    //set robot PID accordingly
	    if (bool_proportional){
	    	robot.controller = new PID_controller(0,dGain,0);
	    } else {
	    	robot.controller = new PID_controller(pGain,dGain,0);
	    }
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
   this.radius = 40;
   this.xpos = xpos;
   this.ypos = ypos;
   this.yspeed = 0;
   this.xspeed = 2;
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
   this.controller = new PID_controller(pGain, 0.0, 0.0);
   this.angle = PI/2;
   this.wid = 30;
   this.len = 40;
   this.rotation = 0;
   this.xspeed = 0;
   this.yspeed = 0;
   this.xpos = xpos;
   this.ypos = ypos;
   this.speed = 0;
   this.thresholdDist = 120;
   this.constantBearing = 0;
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
      var rotation = this.controller.update(w1*(targetAngle  + this.constantBearing) + w2*(-obstacleAngle) );
      this.rotation = rotation;
      this.angle += this.rotation;
      
    } else {
      var rotation = this.controller.update(targetAngle + this.constantBearing);
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

