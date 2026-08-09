let particles = [];

function setup() {
  const canvasContainer = document.getElementById('p5-canvas');
  if (!canvasContainer) return;

  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-canvas');
  
  // Create an initial set of subtle interactive dust particles
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  clear(); // Keep background transparent to view HTML video beneath
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
    particles[i].edges();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.4, 0.4);
    this.vy = random(-0.4, 0.4);
    this.alpha = random(40, 130);
    this.size = random(2, 5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Add minor interaction with the cursor location
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 150) {
      let forceX = (this.x - mouseX) * 0.01;
      let forceY = (this.y - mouseY) * 0.01;
      this.x += forceX;
      this.y += forceY;
    }
  }

  display() {
    noStroke();
    fill(94, 167, 255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  edges() {
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
}