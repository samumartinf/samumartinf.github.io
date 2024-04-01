---
layout: single
title: "ODE Composer: estimating ODE systems from data"
header:
  image: /assets/images/sbl/WideScreen_GP.jpg
  teaser: /assets/images/sbl/SBL-teaser.jpg
author_profile: true
---

This project was the result of my Master's thesis. It provides a framework for model identification in analytical form. Providing the user with a fully human understandable ODE describing the system.

# Abstract

The process of nonlinear system identification is and has always been extremely relevant in the fields of engineering and biology. Over the last few years Neural Networks (NN) have been leading the way to extract models. However, we may find ourselves in a situation where acquiring data is expensive or complicated to extract, making it more expensive or imopssible to train a Network; a commonplace situation in biology. Additionally, we may find relevant to obtain a human understandable model, such as an ODE system, that can be further analysed and fully describes the system dynamics. The focus of this project is to create a tool to aid researches with the task of system dynamics identification in noisy environments and with a restricted amount of data. As such, we propose a two step method. First, a novel way of estimating derivatives of noisy data with a noise estimation through Gaussian Processes. Second the use of Sparse Bayesian Learning as a feature selection algorithm, allowing the user to find analytical representations of the system using a dictionary of nonlinearities. The results are finally displayed back to the user in ODE form, making it simpler for the study of system properties such as stability or non-negativity and providing an explainable output.


## We are still working on this post...

<iframe src="/assets/sketches/fibonacci.html" width="950" height="650">
</iframe>
