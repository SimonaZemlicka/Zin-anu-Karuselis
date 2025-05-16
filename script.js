document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");

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
    { src: "metals3.png", type: "m3" }
  ];

  shuffleArray(trashItems);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function loadNextTrash() {
    trashHolder.innerHTML = "";

    if (currentTrashIndex >= trashItems.length) {
      trashHolder.innerHTML = `<h1>🎉 Visi atkritumi sašķiroti!</h1>`;
      return;
    }

    const trash = trashItems[currentTrashIndex];
    const img = document.createElement("img");
    img.src = trash.src;
    img.className = "trash-item";
    img.setAttribute("data-type", trash.type);

    trashHolder.appendChild(img);

    img.addEventListener("mousedown", startDrag);
    img.addEventListener("touchstart", startDrag, { passive: false });
  }

  const audio = new Audio("your-music-file.mp3");
  const musicButton = document.createElement("button");
  musicButton.textContent = "Ieslēgt mūziku";
  musicButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      musicButton.textContent = "Izslēgt mūziku";
    } else {
      audio.pause();
      musicButton.textContent = "Ieslēgt mūziku";
    }
  });
  document.body.appendChild(musicButton);

  loadNextTrash();
});
