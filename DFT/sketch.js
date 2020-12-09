/*
   Based on the Daniel Shiffman code
*/
let signal = [];
let fourier = []

let time = 0;
let path = [];
let drawing = [];
let angle = 0;

let state = -1;

const USER = 0;
const FOURIER = 1;

function setup() {
   createCanvas(800, 600);
}

function epicycles(x, y, rot, fourier) {
   for (let i = 0; i < fourier.length; i++) {
      let prevx = x;
      let prevy = y;

      let freq = fourier[i].freq;
      let radius = fourier[i].amp;
      let phase = fourier[i].phase;

      x += radius * cos(freq * time + phase + rot);
      y += radius * sin(freq * time + phase + rot);

      stroke(255, 100);
      noFill();
      ellipse(prevx, prevy, radius * 2);

      fill(255);
      stroke(255);
      line(prevx, prevy, x, y);
   }

   return createVector(x, y);
}

function mousePressed() {
   state = USER;
   drawing = [];
   signal = [];
   time = 0;
   path = [];
}

function mouseReleased() {
   state = FOURIER;
   const skip = 1;
   for (let i = 0; i < drawing.length; i += skip) {
      signal.push(new Complex(drawing[i].x, drawing[i].y));
   }

   fourier = dft(signal);

   fourier.sort((a, b) => b.amp - a.amp);
}

function draw() {
   background(0);

   if (state == USER) {
      let point = createVector(mouseX - width/2, mouseY - height/2);
      drawing.push(point);
      stroke(255);
      noFill();
      beginShape();
      for(let v of drawing){
         vertex(v.x + width/2, v.y + height/2);
      }
      endShape();
   } else if (state == FOURIER) {

      let v = epicycles(width / 2, height / 2, 0, fourier);
      path.unshift(v);

      beginShape();
      noFill();
      for (let i = 0; i < path.length; i++) {
         vertex(path[i].x, path[i].y);
      }
      endShape();

      const dt = TWO_PI / signal.length;
      time += dt;
   }
}