document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");
  const progressIcon = document.getElementById("progressIcon");

  // Noņem burkānu no punktu joslas ikonas
  progressIcon.innerHTML = ""; // Ja tur bija emoji vai <img>
  progressIcon.style.backgroundImage = "none"; // Ja tur bija CSS fons

  const backgroundMusic = new Audio('speles_skana.mp3');
  backgroundMusic.volume = 0.2;

  backgroundMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);

  let soundEnabled = true;

  const muteButton = document.createElement("button");
  muteButton.className = "btn mute-btn";
  muteButton.innerHTML = "🔊 Ieslēgt skaņu";
  document.querySelector(".button-wrapper").appendChild(muteButton);

  muteButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      backgroundMusic.play();
      muteButton.innerHTML = "🔇 Izslēgt skaņu";
    } else {
      backgroundMusic.pause();
      muteButton.innerHTML = "🔊 Ieslēgt skaņu";
    }
  });

  backgroundMusic.play();

  let currentTrashIndex = 0;
  let score = 0;
  let draggedOriginal = null;
  let draggedGhost = null;
  let startLeft = "";
  let startTop = "";

  const trashItems = [
    { src: "partika1.png", type: "m1" },
    { src: "partika2.png", type: "m1" },
    { src: "partika3.png", type: "m1" },
    { src: "stikls1.png", type: "m2" },
    { src: "stikls2.png", type: "m2" },
    { src: "stikls3.png", type: "m2" },
    { src: "metals1.png", type: "m3" },
    { src: "metals2.png", type: "m3" },
    { src: "metals3.png", type: "m3" },
    { src: "plast1.png", type: "m4" },
    { src: "plast2.png", type: "m4" },
    { src: "plast3.png", type: "m4" },
    { src: "papirs1.png", type: "m5" },
    { src: "papirs2.png", type: "m5" },
    { src: "papirs3.png", type: "m5" },
    { src: "bat1.png", type: "m6" },
    { src: "bat2.png", type: "m6" },
    { src: "bat3.png", type: "m6" },
  ];

  shuffleArray(trashItems);
  loadNextTrash();

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function loadNextTrash() {
    trashHolder.innerHTML = "";

    if (currentTrashIndex >= trashItems.length) {
      trashHolder.innerHTML = 
        <div class="final-message">
          <h1>🎉 Visi atkritumi sašķiroti!</h1>
          <p>Tu ieguvi <span class="big-score">${score}</span> punktus no <span class="big-score">${trashItems.length}</span>.</p>
        </div>
      ;
      return;
    }

    const trash = trashItems[currentTrashIndex];
    const img = document.createElement("img");
    img.src = trash.src;
    img.className = "trash-item";
    img.setAttribute("data-type", trash.type);
    img.style.position = "fixed";
    img.style.left = "50%";
    img.style.top = "50%";
    img.style.transform = "translate(-50%, -50%)";

    trashHolder.appendChild(img);

    img.addEventListener("mousedown", startDrag);
    img.addEventListener("touchstart", startDrag, { passive: false });
  }

  function startDrag(e) {
    e.preventDefault();
    draggedOriginal = e.target;

    startLeft = draggedOriginal.style.left;
    startTop = draggedOriginal.style.top;

    draggedOriginal.style.opacity = "0.5";

    draggedGhost = draggedOriginal.cloneNode(true);
    draggedGhost.style.opacity = "1";
    draggedGhost.style.position = "fixed";
    draggedGhost.style.left = "0px";
    draggedGhost.style.top = "0px";
    draggedGhost.style.transform = "translate(-50%, -50%)";
    draggedGhost.style.pointerEvents = "none";
    draggedGhost.style.zIndex = "10000";

    document.body.appendChild(draggedGhost);

    moveGhost(e);

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", dragMove, { passive: false });
    document.addEventListener("touchend", endDrag);
  }

  function moveGhost(e) {
    if (!draggedGhost) return;

    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

    draggedGhost.style.left = ${clientX}px;
    draggedGhost.style.top = ${clientY}px;
  }

  function dragMove(e) {
    e.preventDefault();
    moveGhost(e);
  }

  function endDrag() {
    if (!draggedGhost) return;

    const trashType = draggedOriginal.dataset.type;
    const itemRect = draggedGhost.getBoundingClientRect();
    let matched = false;
    let matchedBin = null;

    bins.forEach((bin) => {
      const binRect = bin.getBoundingClientRect();
      const binType = bin.getAttribute("src").replace(".png", "");

      const overlap = !(
        itemRect.right < binRect.left ||
        itemRect.left > binRect.right ||
        itemRect.bottom < binRect.top ||
        itemRect.top > binRect.bottom
      );

      if (overlap && trashType === binType) {
        matched = true;
        matchedBin = bin;
      }
    });

    if (matched && matchedBin) {
      score++;
      currentTrashIndex++;
      scoreDisplay.textContent = score;

      const progress = (score / trashItems.length) * 100;
      progressFill.style.width = ${progress}%;
      progressIcon.style.left = ${progress}%;

      const holderRect = trashHolder.getBoundingClientRect();
      const binRect = matchedBin.getBoundingClientRect();
      const centerX = binRect.left + binRect.width / 2;
      const trashZoneY = holderRect.top + 40;

      const relativeCenterX = centerX - holderRect.left;
      const relativeCenterY = trashZoneY - holderRect.top;

      draggedOriginal.style.position = "absolute";
      draggedOriginal.style.left = ${relativeCenterX}px;
      draggedOriginal.style.top = ${relativeCenterY}px;
      draggedOriginal.style.transform = "translate(-50%, -50%) scale(1.1)";
      draggedOriginal.style.transition = "all 0.3s ease";

      setTimeout(() => {
        draggedOriginal.style.transform = "translate(-50%, -50%) scale(1)";
      }, 300);

      draggedGhost.remove();
      draggedGhost = null;
      draggedOriginal = null;

      loadNextTrash();
    } else {
      draggedOriginal.style.opacity = "1";
      draggedOriginal.style.left = startLeft;
      draggedOriginal.style.top = startTop;
      draggedOriginal.style.transform = "translate(-50%, -50%)";

      draggedGhost.remove();
      draggedGhost = null;
      draggedOriginal = null;
    }

    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("touchend", endDrag);
  }
});
