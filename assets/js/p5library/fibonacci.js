class Wave {
  constructor(amp, phase, period) {
    this.amplitude = amp;
    this.phase = phase;
    this.period = period;
  }

  calculateY(t) {
    return this.amplitude * sin((this.phase * t * TWO_PI) / this.period);
  }

  calculateX(t) {
    return this.amplitude * cos((this.phase * t * TWO_PI) / this.period);
  }
}

let time = 0;
let radius;
let period = 7;
let num_waves = 4;
let wave = [];
let waves = [];
let cwave = new Wave(1, 1, period);
let nwave_slider;
let circleX_centre;

function setup() {
  nwave_slider = createSlider(1, 400, 9, 1);
  // nwave_slider.position(20, 20);
  nwave_slider.style("width", "200px");
  createCanvas(900, 600);
  radius = 0.15 * height;
  circleX_centre = width / 5;
}

function draw() {
  background(20, 20, 34);
  textSize(20);
  fill(255);
  text("number of sines = " + String(nwave_slider.value()), 240, 30);

  for (let i = 0; i < nwave_slider.value(); i++) {
    waves[i] = new Wave(1 / (2 * i + 1), 2 * i + 1, period);
  }
  translate(circleX_centre, height / 2);

  //draw the circle
  noFill();
  stroke(255);

  //get x and y of the arm
  let y = 0;
  let x = 0;
  for (let i = 0; i < waves.length; i++) {
    circle(0, 0, (radius * 2) / (2 * i + 1));
    let x_temp = radius * waves[i].calculateX(time);
    let y_temp = radius * waves[i].calculateY(time);
    line(0, 0, x_temp, y_temp);
    y += y_temp;
    x += x_temp;
    translate(x_temp, y_temp);
  }
  //x = radius * cwave.calculateX(time);
  wave.unshift(y);

  resetMatrix();
  translate(circleX_centre, height / 2);

  stroke(255);
  fill(255);
  circle(x, y, 8);
  line(x, y, width / 5, y);

  beginShape();
  for (let i = 0; i < wave.length; i++) {
    stroke(255);
    noFill();
    vertex(circleX_centre + i, wave[i]);
  }
  endShape();

  if (wave.lenght > 500) {
    wave.pop();
  }

  time += TWO_PI / 30 / period;
  waves = [];
}

new p5(sk)
