---
layout: single
title: An interactive simulation for BIOE97156
author_profile: true
permalink: /robots/
---

This is meant to be an axiliary short explanation and discussion about target interception for Imperial College's module on Animal Locomotion and Bioinspired Robotics (ALBiR).

## The Simulation
Like in periodism, I will take the inverted pyramid approach for this writing. This report will start with the simulation and my current implementation of the robot, hopefully this will showing some results 
<div id="sketch-holder"></div>

## Problem Specification
During the spring term of 2020 in ALBiR we have studied the different ways locomotion and environment perception and interaction works in the animal kingdom. From biped motion, to visual recognition and targer pursuit, we have explored Nature's solution for these problem. ~~Copying Nature~~ Inspired by Nature we were expected to take what we had learnt and use it to the real world. A small robot was built using two brush motors, a Raspberry Pi and a Pixy2 camera attached to a servo. 


We are tasked with 

## Real-life Implementation - Sensing the environment
For the real-life assessment we were expected to catch a red robot

### Distance estimation
One of the most important pieces of the algorithm is a precise distance estimation function. Without it critical information such as angles with respect to obstacles and target would be impossble to acquire. Our only input for estimating said distance is the camera feed, therefore, we are determining the distance by the angular declination below the horizon. As it can be seen from the figure below (Ooi et al. 2001), we can find the distance to the target (d) by measuring its angle with respect to the horizon. 

![Distance estimation](/assets/images/robotSimulation/horizontalDistance.jpg){:class="img-responsive"}

For the robot, we know the camera to be tilted by 20 degrees, which will be our initial angle (alpha). To that alpha, we would like to add another angle (beta) that will be the infered angle within the robot's field of view as seen below.

![Distance calculation](/assets/images/robotSimulation/distanceCalculation.png){:class="img-responsive"}

This calculations allow us to find distance d, that will aid us with the rest of the inference. 

### Angle estimation
Similarly to the distance estimation, the angle estimation is infered by the pixel distance to the centre of the feed and the camera's FoV. 

![Distance calculation](/assets/images/robotSimulation/angleCalculation.png){:class="img-responsive"}
The final angle will be gamma + servoPosition, the servo position is returned in angles already by the servo library in Python, therefore it is very easy to find. 

### The controllers
The robot requires two different controllers to work properly. The first controller manages the "head" (the servo motor attached to the camera), whereas the second controller is in charge of the robot's body position by setting the turning rate of the wheels to steer left or right. 

The different controllers require different behaviour, the head controller needs to be both smooth and precise, as any rapid movement of the robot (especially when close) should be tracked properly as we do not want the prey to leave the robot's FoV. Leaving the FoV would mean that we lose the ability to estimate both distance and angle, which would significantly handicap our robot's ability to catch the prey. Therefore the head cotroller PID(0.04, 0, 0.08) has a higher pGain and dGain and can even allow for some overshoot if necessary to keep the prey in the FoV (it is set slightly underdamped).

The wheel's controller needs to be smoother and it shoud not make abrupt changes PID(0.005, 0, 0.04) so it is set to be overdamped. This overdamped wheel controller also helps in the obstacle avoidance, when the obstacle leaves the FoV, the robot has no way of knowing where the obstacle is. Therefore, this overdamped behaviour allows for smooth turning around the obstacle without turning into it even if the prey is close. (This behaviour is especially noticeable in the simulation and videos, so the reader is encouraged to inspect those)

### Making predictions
As stated before, the robot will be able to extract information about angle and distance only if the prey is in the FoV of the camera, but what happens when the prey is obstructed by an obstacle or if the prey make a sharp move? In this instance we would like to make predicitons based on our previous information about the prey and obstacles. While the prey is seen, the robot will not only chase it, but also save information about the prey's angle, distance, change in angle over time, and change in distance over time. Similarly, once the obstacle is whithin the 

## Real-life Implementation - The Robot Behaviour
Once the sensing of the environment and the controllers are in place, the last thing to orchestrate is the interaction between them. As soon as the 

<script src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.js"></script>
<script src="https://raw.githubusercontent.com/processing/p5.js/1.0.0/src/dom/dom.js"></script>
<script src="/assets/js/p5library/p5.clickable.js"></script>
<script src="/assets/js/p5library/robotSimulation.js"></script>

