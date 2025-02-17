const radius = 200;
const blobs = [];
const unusedBlobs = [];
const template = document.querySelector(".particle");
const center = [400, 400];

class Blob {
  constructor() {
    const circle = template.cloneNode(true);
    template.parentElement.appendChild(circle);
    const animations = circle.querySelectorAll("animate");
    animations[0].addEventListener("endEvent", () => this.done());
    this.y = animations[0];
    this.x = animations[1];
    this.opacity = animations[2];
  }

  // updates vector and starts animation
  begin() {
    const angle = Math.PI * 2 * Math.random();
    const xOffset = Math.cos(angle) * radius;
    this.x.setAttribute("to", `${center[0] + xOffset}`);
    this.x.beginElement();
    const yOffset = Math.sin(angle) * radius;
    this.y.setAttribute("to", `${center[1] + yOffset}`);
    this.y.beginElement();
    this.opacity.beginElement();
  }

  done() {
    const index = blobs.indexOf(this);
    if (index === -1) {
      return;
    }
    blobs.splice(index, 1);
    unusedBlobs.push(this);
  }
}

function loop() {
  const level = Math.floor(Math.random() * 6);
  for (let i = 0; i < level; i++) {
    const blob = unusedBlobs.pop();
    if (blob) {
      blobs.push(blob);
      blob.begin();
    }
  }

  requestAnimationFrame(loop);
}

for (let i = 0; i < 320; i++) {
  unusedBlobs.push(new Blob());
}

loop();
