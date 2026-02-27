
let step = 0;
let busy = false;

const stage = document.getElementById("stage");
const bird = document.getElementById("bird");
const caretaker = document.getElementById("caretaker");
const tunnel = document.getElementById("tunnel");

gsap.to(bird, { x: 320, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
gsap.to(bird, { y: 10, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

function drop() {
  if (busy) return;
  if (step >= 3) return; // already complete; wait for reset
  busy = true;

  const poop = document.createElement("div");
  poop.className = "poop";
  stage.appendChild(poop);

  // Position poop under bird (account for transforms)
  const b = bird.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  const startX = (b.left - s.left) + b.width * 0.6;
  const startY = (b.top - s.top) + b.height * 0.9;
  poop.style.left = `${startX}px`;
  poop.style.top = `${startY}px`;

  // Target: tunnel center
  const t = tunnel.getBoundingClientRect();
  const targetX = (t.left - s.left) + t.width * 0.5;
  const targetY = (t.top - s.top) + t.height * 0.35;

  gsap.to(poop, {
    x: targetX - startX,
    y: targetY - startY,
    duration: 0.45,
    ease: "power1.in",
    onComplete: () => cleanAndGrow(poop)
  });
}


function setCaretakerSprite(frames = 4) {
  const img = new Image();
  img.src = "./assets/caretaker.png"; // <-- direct
  img.onload = () => {
    const frameW = img.naturalWidth / frames;
    const frameH = img.naturalHeight;

    caretaker.style.width = `${frameW}px`;
    caretaker.style.height = `${frameH}px`;
    caretaker.style.backgroundImage = `url(${img.src})`;
    caretaker.style.backgroundSize = `${img.naturalWidth}px ${img.naturalHeight}px`;

    caretaker.dataset.sheetW = img.naturalWidth;
    caretaker.dataset.frames = frames;
  };
  img.onerror = () => console.error("Could not load caretaker sprite:", img.src);
}

setCaretakerSprite(4);


function playCaretakerOnce() {
  const frames = Number(caretaker.dataset.frames) || 4;
  const sheetW = Number(caretaker.dataset.sheetW) || 0;
  if (!sheetW) return null;

  const frameW = sheetW / frames;
  let last = -1;

  // animate a dummy tween and snap backgroundPosition to exact integers
  return gsap.to({}, {
    duration: 0.32,
    ease: "none",
    onUpdate() {
      const idx = Math.min(frames - 1, Math.floor(this.progress() * frames));
      if (idx !== last) {
        last = idx;
        gsap.set(caretaker, { backgroundPosition: `-${Math.round(idx * frameW)}px 0px` });
      }
    }
  });
}

function cleanAndGrow(poopEl) {
  gsap.set(caretaker, { opacity: 1, backgroundPosition: "0px 0px" });

  const sheetW = Number(caretaker.dataset.sheetW) || 0;

  const tl = gsap.timeline({
    onComplete: () => {
      poopEl.remove();
      step += 1;
      revealStep(step);
      busy = false;
      if (step === 3) finishAndReset();
    }
  });

  // fallback if sprite hasn't loaded yet
  if (!sheetW) {
    tl.to(caretaker, { x: 8, duration: 0.12, yoyo: true, repeat: 3, ease: "steps(1)" }, 0)
      .to(poopEl, { scale: 0, duration: 0.12, ease: "back.in(2)" }, 0.25)
      .to(caretaker, { opacity: 0, duration: 0.12 }, 0.44);
    return;
  }

  tl.add(playCaretakerOnce(), 0) // <-- plays sprite frames once
    .to(poopEl, { scale: 0, duration: 0.12, ease: "back.in(2)" }, 0.22)
    .set(caretaker, { backgroundPosition: "0px 0px" }, 0.36)
    .to(caretaker, { opacity: 0, duration: 0.12 }, 0.44);
}


function revealStep(n) {
  const flower = stage.querySelector(`.flower[data-step="${n}"]`);
  const line = stage.querySelector(`.line[data-step="${n}"]`);

  gsap.to(flower, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2)", from: { scale: 0.2 } });
  gsap.to(line, { opacity: 1, y: -4, duration: 0.22, ease: "power1.out" });
}

function finishAndReset() {
  const tl = gsap.timeline();

  tl.to(stage, { scale: 1.01, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" })
    .to({}, { duration: 1.2 }) // hold
    .to(stage.querySelectorAll(".line, .flower"), { opacity: 0, duration: 0.35, stagger: 0.03 })
    .add(() => { step = 0; }, "+=0");
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); drop(); }
});


// mobile-friendly: tap anywhere on the stage
stage.addEventListener("pointerdown", drop);
