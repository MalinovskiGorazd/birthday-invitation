const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const colors = ["#f47fa4", "#ffd166", "#8fd6c2", "#c9a7f0", "#ffb38a"];

const envelope = document.getElementById("envelope");
const card = document.getElementById("card");
const cake = document.getElementById("cake");
const cakeLabel = document.getElementById("cake-label");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function pickColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function launchBalloons()
{
  const container = document.getElementById("balloons");

  for (let i = 0; i < 8; i++) {
    const balloon = document.createElement("span");
    const duration = random(14, 24);

    balloon.className = "balloon";
    balloon.style.left = `${random(2, 92)}%`;
    balloon.style.backgroundColor = pickColor();
    balloon.style.animationDuration = `${duration}s`;
    
    balloon.style.animationDelay = `${-random(0, duration)}s`;

    balloon.addEventListener("click", () => popBalloon(balloon));
    
    balloon.addEventListener("animationiteration", () => {
      if (balloon.classList.contains("is-popped")) {
        balloon.classList.remove("is-popped");
        balloon.style.left = `${random(2, 92)}%`;
      }
    });

    container.append(balloon);
  }
}

function popBalloon(balloon) 
{
  const { left, top, width, height } = balloon.getBoundingClientRect();

  burstHearts(left + width / 2, top + height / 2, 14, 110);
  balloon.classList.add("is-popped");
}

function burstHearts(x, y, count, reach) 
{
  if (reducedMotion) return;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    const angle = (i / count) * Math.PI * 2 + random(-0.2, 0.2);
    const distance = random(reach * 0.5, reach);

    heart.className = "click-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "♥";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.color = pickColor();
    heart.style.fontSize = `${random(12, 20)}px`;
    heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    heart.style.setProperty("--spin", `${random(-90, 90)}deg`);

    heart.addEventListener("animationend", () => heart.remove());
    document.body.append(heart);
  }
}

function burstConfetti() 
{
  if (reducedMotion) return;

  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    const isHeart = i % 4 === 0;

    piece.className = "confetti";
    piece.setAttribute("aria-hidden", "true");
    piece.style.left = `${random(0, 100)}vw`;
    piece.style.animationDuration = `${random(2, 4)}s`;
    piece.style.animationDelay = `${random(0, 0.6)}s`;
    piece.style.setProperty("--drift", `${random(-80, 80)}px`);
    piece.style.setProperty("--spin", `${random(-540, 540)}deg`);

    if (isHeart) {
      piece.textContent = "♥";
      piece.style.color = pickColor();
      piece.style.fontSize = `${random(14, 22)}px`;
    } else {
      piece.style.width = "9px";
      piece.style.height = "13px";
      piece.style.borderRadius = "3px";
      piece.style.backgroundColor = pickColor();
    }

    piece.addEventListener("animationend", () => piece.remove());
    document.body.append(piece);
  }
}

function openInvitation() 
{
  envelope.classList.add("is-open");

  setTimeout(() => {
    envelope.hidden = true;
    card.hidden = false;
    card.focus({ preventScroll: true });
    burstConfetti();
  }, reducedMotion ? 0 : 1000);
}

function makeWish() 
{
  cake.classList.add("is-blown");
  cake.disabled = true;
  cakeLabel.textContent = "Your wish is on its way!";
  burstConfetti();
}

envelope.addEventListener("click", openInvitation, { once: true });
cake.addEventListener("click", makeWish, { once: true });

document.addEventListener("touchstart", () => {}, { passive: true });

document.addEventListener("pointerup", (event) => {
  if (event.button !== 0) return;

  if (!event.target.closest(".balloon")) {
    burstHearts(event.clientX, event.clientY, 8, 60);
  }

  const tile = event.target.closest(".detail");

  if (tile && event.pointerType === "touch" && !reducedMotion) {
    tile.classList.add("is-tapped");
  }
});

document.addEventListener("animationend", (event) => {
  if (event.animationName === "tile-tap") {
    event.target.classList.remove("is-tapped");
  }
});

if (!reducedMotion) {
  launchBalloons();
}