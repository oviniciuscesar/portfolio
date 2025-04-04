class BrownianLine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reset();
  }

  reset() {
    this.points = [];
    this.maxPoints = 50 + Math.floor(Math.random() * 100);
    this.currentPoint = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    };
    this.color = `hsl(${Math.random() * 60 + 180}, 70%, 50%)`;
    this.width = 0.5 + Math.random() * 1.5;
  }

  update() {
    // Add randomness to movement (Brownian motion)
    this.currentPoint.vx += (Math.random() - 0.5) * 0.5;
    this.currentPoint.vy += (Math.random() - 0.5) * 0.5;
    
    // Limit speed
    const speed = Math.sqrt(this.currentPoint.vx * this.currentPoint.vx + 
                          this.currentPoint.vy * this.currentPoint.vy);
    if (speed > 2) {
      this.currentPoint.vx = (this.currentPoint.vx / speed) * 2;
      this.currentPoint.vy = (this.currentPoint.vy / speed) * 2;
    }

    // Update position
    this.currentPoint.x += this.currentPoint.vx;
    this.currentPoint.y += this.currentPoint.vy;

    // Bounce off edges
    if (this.currentPoint.x < 0 || this.currentPoint.x > this.canvas.width) {
      this.currentPoint.vx *= -1;
    }
    if (this.currentPoint.y < 0 || this.currentPoint.y > this.canvas.height) {
      this.currentPoint.vy *= -1;
    }

    // Add point to trail
    this.points.push({...this.currentPoint});
    
    // Remove oldest point if needed
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  draw() {
    if (this.points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.stroke();
  }
}

class BrownianBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.opacity = '0.3';
    document.body.appendChild(this.canvas);

    this.lines = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());

    for (let i = 0; i < 10; i++) {
      this.lines.push(new BrownianLine(this.canvas));
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.lines.forEach(line => {
      line.update();
      line.draw();
      
      // Randomly reset lines occasionally
      if (Math.random() < 0.005) {
        line.reset();
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Start animation when page loads
document.addEventListener('DOMContentLoaded', () => {
  new BrownianBackground();
});
