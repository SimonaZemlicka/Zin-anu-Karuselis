document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");
  const progressIcon = document.getElementById("progressIcon");

  // Noņem burkānu no punktu joslas ikonas
  progressIcon.innerHTML = "";
  progressIcon.style.backgroundImage = "none";

  const backgroundMusic = new Audio('speles_skana.mp3');
  backgroundMusic.volume = 0.2;

  backgroundMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);

  let soundEnabled = true;

  // Pārbauda, vai eksistē .button-wrapper
  const buttonWrapper = document.querySelector(".button-wrapper");
  if (buttonWrapper) {
    const muteButton = document.createElement("button");
    muteButton.className = "btn mute-btn";
    muteButton.innerHTML = "🔊 Ieslēgt skaņu";
    buttonWrapper.appendChild(muteButton);

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
  } else {
    console.error("Skaņas pogas konteiners (.button-wrapper) nav atrasts!");
  }

  backgroundMusic.play();

  let currentTrashIndex = 0;
  let score = 0;

  const trashItems = [
    { src: "partika1.png", type: "m1" },
    { src: "partika2.png", type: "m1" },
    { src: "stikls1.png", type: "m2" },
    { src: "metals1.png", type: "m3" },
    { src: "plast1.png", type: "m4" },
    { src: "papirs1.png", type: "m5" },
    { src: "bat1.png", type: "m6" }
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
    trashHolder.querySelectorAll(".trash-item").forEach(item => item.remove());

    if (currentTrashIndex >= trashItems.length) {
      trashHolder.innerHTML = `
        <div class="final-message">
          <h1>🎉 Visi atkritumi sašķiroti!</h1>
          <p>Tu ieguvi <span class="big-score">${score}</span> punktus no <span class="big-score">${trashItems.length}</span>.</p>
        </div>
      `;
      return;
    }

    const trash = trashItems[currentTrashIndex];
    const img = document.createElement("img");
    img.src = trash.src;
    img.className = "trash-item";
    img.dataset.type = trash.type;
    trashHolder.appendChild(img);

    img.addEventListener("mousedown", startDrag);
    img.addEventListener("touchstart", startDrag, { passive: false });
  }

  function startDrag(e) {
    e.preventDefault();
    const target = e.target;

    const move = (event) => {
      const x = event.touches ? event.touches[0].clientX : event.clientX;
      const y = event.touches ? event.touches[0].clientY : event.clientY;
      target.style.position = "absolute";
      target.style.left = `${x - 50}px`;
      target.style.top = `${y - 50}px`;
    };

    const end = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
      loadNextTrash();
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchend", end);
  }
});
