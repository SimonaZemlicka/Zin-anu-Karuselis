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

  const buttonWrapper = document.querySelector(".button-wrapper");
  if (buttonWrapper) {
    const muteButton = document.createElement("button");
    muteButton.className = "btn mute-btn";
    muteButton.innerHTML = "🔊 Ieslēgt skaņu";

    muteButton.style.display = "block";
    muteButton.style.marginTop = "10px";

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
  }

  backgroundMusic.play();

  let currentTrashIndex = 0;
  let score = 0;

  const trashItems = [
    { src: "partika1.png", type: "m1" }, { src: "partika2.png", type: "m1" }, { src: "partika3.png", type: "m1" },
    { src: "stikls1.png", type: "m2" }, { src: "stikls2.png", type: "m2" }, { src: "stikls3.png", type: "m2" },
    { src: "metals1.png", type: "m3" }, { src: "metals2.png", type: "m3" }, { src: "metals3.png", type: "m3" },
    { src: "plast1.png", type: "m4" }, { src: "plast2.png", type: "m4" }, { src: "plast3.png", type: "m4" },
    { src: "papirs1.png", type: "m5" }, { src: "papirs2.png", type: "m5" }, { src: "papirs3.png", type: "m5" },
    { src: "bat1.png", type: "m6" }, { src: "bat2.png", type: "m6" }, { src: "bat3.png", type: "m6" }
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
    img.style.position = "absolute";
    img.style.left = "50%";
    img.style.top = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.width = "100px";
    img.style.height = "100px";

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
      target.style.left = `${x - 50}px`;
      target.style.top = `${y - 50}px`;
    };

    const end = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);

      checkDrop(target);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchend", end);
  }

  function checkDrop(trash) {
    const bin = [...bins].find(b => b.dataset.type === trash.dataset.type);
    if (bin) {
      score++;
      scoreDisplay.textContent = score;
      currentTrashIndex++;
      loadNextTrash();
    } else {
      trash.remove();
      loadNextTrash();
    }
  }
});
