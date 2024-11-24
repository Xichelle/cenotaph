let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let squareGraphic;
let particleSystem;
let drawing = [];


function preload() {
  faceMesh = ml5.faceMesh(options);
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
}

function draw() {
push()
image(video, 0, 0, width, height);
filter(GRAY);
pop()
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
