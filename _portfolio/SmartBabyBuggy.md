---
layout: single
title: "Engineering Vision: The Journey of Creating the Smart Baby Buggy"
header: 
  teaser: /assets/images/babyBuggy/i_explain_stuff.png
  image: /assets/images/babyBuggy/i_explain_stuff.png
author_profile: true
---

This project shows my work in a real life engineering challenge. Desiginging a baby buggy that is suitable for visually impaired parents to use in a busy and hectic city like London. From gathering requirements from user groups to iterative testing, this project was a rewarding and challenging ride.

<iframe width="1487" height="846" src="https://www.youtube.com/embed/PRHf2Wq2_0M" title="Introducing the Smart Baby Buggy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Intro
I was lucky enough to be the lead of a dedicated team of student designers at Imperial College London, I'm thrilled to share the story behind the creation of the Smart Baby Buggy. This project, which started as a simple project assignment to aid the visually impaired, transformed into a great example of accessible technology. Let me take you through the inspiration, technical challenges, and collaborative efforts that fueled this endeavor.

## Inspiration and Conception
Our journey began with an encounter with Ramona Williams, a resident of Fulham with a visionary idea. Ramona, who has been significantly sight-impaired from birth due to congenital toxoplasmosis, highlighted a crucial gap in mobility solutions for visually impaired parents. She envisioned a baby buggy that could safely guide users through the complexities of urban environments.

Motivated by Ramona's passion and the clear need for such an innovation, my team and I embraced the challenge. It wasn't just about engineering a product; it was about creating a tool that could significantly improve the quality of life for visually impaired individuals.

## The Technical Deep Dive
The core of the Smart Baby Buggy lies in its use of LIDAR and ultrasound sensors, technologies typically found in the realm of self-driving cars. Integrating these into the compact form of a baby buggy presented its own set of challenges and learning opportunities.

<h3> LIDAR and Ultrasound: A Synergetic Approach</h3>
We chose LIDAR for its accuracy in mapping environments and ultrasound sensors for their efficiency in obstacle detection. Combining these technologies allowed us to develop a wide field of hazard perception, ensuring the safety of both the parent and the child. The Lidar sensor was located underneath the buggy, allowing for accurate hazard detection at the wheel level. We used the US sensors for both redundancy and to detect more voluminous objects that might be pertruding or dangerous at a height that would go undetected by the LIDAR sensor.

### Cost considerations:

As this is a rather niche product and there is an actual need behind it, we did not want to use expensive materials, sensors, or boards. While LIDAR is often considered expensive, this was a 2D LIDAR, inexpensive enough to be found in hose-hold cleaning robots. The ultrasound sensors, so commonly used in parking sensors for cars are very affordable and all the computation (besides the phone app) was done using arduino boards, keeping costs under 200$ for the extra materials requried for the buggy to be adapted. 

## The Haptic Feedback System

One of the most innovative aspects of the Smart Baby Buggy is the haptic feedback system integrated into the handlebar. This system communicates with the user through vibrations, alerting them to upcoming hazards. Designing this touch-based language was a fascinating process, conveying all the information that we usually get from visiual feedback to vibrations in your hands was probably one of my favourite challenges of the project.

## Smartphone Integration and Processing

Incorporating a smartphone cradle and designing an app to recognize specific landmarks such as braille bumps added another layer of navigational aid. The information processed by the app is relayed through the vibration motors via bluetooth, and for more complex information, such as approaching a crossing, it would convey this information through audio. This dual approach offered a comprehensive solution for spatial awareness.

<h2>CNNs and Image Segmentation:</h2>
To achieve an IPhone application that would be able to use Machine Learning models to do both simple segmentation and obstacle detection we used what at the time were cutting edge models and later provided some extra training data to fine-tune it. The final output aimed to look like this:
![App's vision](/assets/images/babyBuggy/ImageSegmentation.png)

This meant that we fine-tuned YOLOv3 for the object detection as we provided extra features to the last layer, incluiding braille bumps, crosswalks, etc. This simple model could run in the IPhone app by taking frequent pictures and feeding them to the model. This gave us a ~15Hz output from the model.

Based on the position of the IPhone, which was mounted to the buggy, we could get a rough estimate of the distance of the objects. Finally, we kept a buffer with the objects and the distance. This buffer was averaged every 1-5 seconds to provide auditory feedback. 

The segmentation was running intercalated with the YOLOv3 model, and consisted in another fine-tuned model. The dataset was easier to find as there are some great publicly avaialble models for self-driving cars. We enriched this with our own gathered data, to ensure we did not have any bias given that our model would mostly have a point of view from the side-walk instead of the road. However, we found the open-source datasets really useful. 

Finally, the estimated proximity to the side-walk was sent via bluetooth to the arduino main board, which was another input in the system, that was later combined with the Ultrasound and LIDAR information to provide the haptic feedback.


### A Collaborative Effort
Working closely with Ramona Williams was an invaluable part of this project. Her insights into the challenges faced by visually impaired individuals helped shape our design philosophy, ensuring we remained focused on the real-world impact of our work.

### Reflections
Reflecting on the development of the Smart Baby Buggy, I'm struck by the profound potential of engineering to make a real difference in people's lives. This project has been more than an academic exercise; it's a testament to the transformative power of empathetic design and innovation.