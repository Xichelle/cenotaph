let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let squareGraphic;
let particleSystem;
let drawing = [];

let gifs = {};
let activeAnimations = [];
const MAX_ACTIVE_ANIMATIONS = 10;

let currentScene = "opening"; // 'opening' or 'main'

// Button
let startButton;

function preload() {
  faceMesh = ml5.faceMesh(options);

  gifs['a'] = loadImage('animation/a.gif'); // GIF for key 'A'
  gifs['b'] = loadImage('animation/b.gif'); // GIF for key 'B'
  gifs['c'] = loadImage('animation/c.gif'); // GIF for key 'C'
  gifs['d'] = loadImage('animation/d.gif'); // GIF for key 'D'
  gifs['e'] = loadImage('animation/e.gif'); // GIF for key 'E'
  gifs['f'] = loadImage('animation/f.gif'); // GIF for key 'F'
  gifs['g'] = loadImage('animation/g.gif'); // GIF for key 'G'
  gifs['h'] = loadImage('animation/h.gif'); // GIF for key 'H'
  gifs['i'] = loadImage('animation/i.gif'); // GIF for key 'I'
  gifs['j'] = loadImage('animation/j.gif'); // GIF for key 'J'
  gifs['k'] = loadImage('animation/k.gif'); // GIF for key 'K'
  gifs['l'] = loadImage('animation/l.gif'); // GIF for key 'L'
  gifs['m'] = loadImage('animation/m.gif'); // GIF for key 'M'
  gifs['n'] = loadImage('animation/n.gif'); // GIF for key 'N'
  gifs['o'] = loadImage('animation/o.gif'); // GIF for key 'O'
  gifs['p'] = loadImage('animation/p.gif'); // GIF for key 'P'
  gifs['q'] = loadImage('animation/q.gif'); // GIF for key 'Q'
  gifs['r'] = loadImage('animation/r.gif'); // GIF for key 'R'
  gifs['s'] = loadImage('animation/s.gif'); // GIF for key 'S'
  gifs['t'] = loadImage('animation/t.gif'); // GIF for key 'T'
  gifs['u'] = loadImage('animation/u.gif'); // GIF for key 'U'
  gifs['v'] = loadImage('animation/v.gif'); // GIF for key 'V'
  gifs['w'] = loadImage('animation/w.gif'); // GIF for key 'W'
  gifs['x'] = loadImage('animation/x.gif'); // GIF for key 'X'
  gifs['y'] = loadImage('animation/y.gif'); // GIF for key 'Y'
  gifs['z'] = loadImage('animation/z.gif'); // GIF for key 'Z'

  openingImage = loadImage('tear.png'); // Replace with your image path
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER)
  // Create video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);

  // Create square graphic for displaying eye section
  squareGraphic = createGraphics(300, 300);

  // Initialize particle system
  particleSystem = new ParticleSystem();

  // Start detecting faces
  faceMesh.detect(video, gotFaces);
  startButton = createButton('...');
  startButton.position(width / 2 - 80 , height / 2 + 25);
  startButton.style('font-size', '20px');
  startButton.style('padding', '10px 20px');
  startButton.style('background-color', '#0a0a0a');
  startButton.style('color', '#fff');
  startButton.style('border', 'none');
  startButton.style('border-radius', '5px');
  startButton.style('cursor', 'pointer');

  startButton.mousePressed(() => {
    currentScene = "main"; // Switch to the main project
    startButton.hide(); // Hide the button
  });
}



function draw() {
  if (currentScene === "opening") {
    drawOpeningScene();
  } else if (currentScene === "main") {
    drawMainProject();
  }
}

function drawOpeningScene() {
  background(200);
  imageMode(CENTER);
  image(openingImage, width / 2, height / 2, width, height);

}


function drawMainProject() {
  //video
  push()
  image(video, 0, 0, width, height);
  filter(GRAY);
  pop()
 
  //background color
  background(255)
  
  

  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let leftEye = face.leftEye
    console.log(face)
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      console.log(face.leftEye)
      push()
      // noFill()
      // stroke("red")
      translate(width/2, height/2)
      // translate(leftEye.x, leftEye.y)
      scale(4)
      copy(video,leftEye.x-10, leftEye.y-10, leftEye.width+20, leftEye.height+20, 0-leftEye.width/2, 0-leftEye.height/2, leftEye.width+20, leftEye.height+20)
      // rect(0, 0, leftEye.width, leftEye.height, 0, 0, leftEye.width, leftEye.height)
      // copy(video,leftEye.x, leftEye.y, leftEye.width, leftEye.height, 0, 0, leftEye.width, leftEye.height)
      // rect(0, 0, leftEye.width, leftEye.height, 0, 0, leftEye.width, leftEye.height)
      pop()
          }
  }
// Update and display all active animations
for (let i = activeAnimations.length - 1; i >= 0; i--) {
  let anim = activeAnimations[i];
  anim.update();
  anim.show();

  // Remove finished or out-of-bounds animations
  if (anim.isFinished() || anim.y > height) {
    activeAnimations.splice(i, 1);
  }
}

  // Draw the particle system
  particleSystem.update();
  particleSystem.show();

  // Draw the mouse trail
  noFill();
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (let v of drawing) {
    vertex(v.x, v.y);
  }
  endShape();

  // Add new particles when the mouse is pressed
  if (mouseIsPressed) {
    drawing.push(createVector(mouseX, mouseY));
  } else if (drawing.length > 0) {
    particleSystem.addParticles(drawing);
    drawing = [];
  }

}

function keyPressed() {
  if (gifs[key]) {
    // Create a new animation instance below the eye section
    let x = random(width / 4, (3 * width) / 4);
    let y = random(height / 2, (3 * height) / 4); // Start below the eye section
    activeAnimations.push(new AnimationInstance(gifs[key], x, y));
  }
}

class AnimationInstance {
  constructor(gif, x, y) {
    this.gif = gif; // The GIF to display
    this.x = x;
    this.y = y;
    this.finished = false;
    this.speed = 1; // Falling speed

    // Set the GIF to play and stop looping
    this.gif.play();
    this.gif.reset();
    this.gif.looping = false;
  }

  update() {
    // Move the animation down
    this.y += this.speed;

    // Check if the GIF has finished playing
    if (this.gif.getCurrentFrame() === this.gif.numFrames() - 1) {
      this.finished = true;
    }
  }

  show() {
    if (!this.finished) {
      image(this.gif, this.x, this.y);
    }
  }

  isFinished() {
    return this.finished;
  }
}
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  particleSystem.adjust();
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.1, 0.1), random(0.3, 0.8)); // Almost vertical fall
    this.acc = createVector(0, 0.02); // Slight downward acceleration
    this.lifespan = 300; // Long lifespan for trailing effects
    this.stopped = false;
    this.offset = random(0.5, 1.5); // Offset for subtle movement
  }

  update() {
    if (!this.stopped) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      // Slight sinusoidal movement for a subtle distortion effect
      this.pos.x += sin(frameCount * this.offset) * 0.3;

      if (this.pos.y >= height - 10) {
        this.stopped = true; // Stop the particle at the bottom
        this.pos.y = height - 10;
      }
    } else {
      this.lifespan -= 1; // Gradually fade out the particle
    }
  }

  show() {
    noStroke();
    fill(0, map(this.lifespan, 0, 300, 0, 100)); // Trailing transparency
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticles(points) {
    for (let v of points) {
      this.particles.push(new Particle(v.x, v.y));
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  show() {
    for (let p of this.particles) {
      p.show();
    }
  }

  adjust() {
    for (let p of this.particles) {
      p.pos.x = (p.pos.x / width) * windowWidth;
      p.pos.y = (p.pos.y / height) * windowHeight;
    }
  }
}
