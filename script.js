document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");
  const progressIcon = document.getElementById("progressIcon");

  let currentTrashIndex = 0;
  let score = 0;
  let draggedOriginal = null;
  let draggedGhost = null;
  let startLeft = "";
  let startTop = "";

  const trashItems = [
    { src: "partika1.png", type: "m1" },
    { src: "partika2.png", type: "m1" },
    { src: "partika3.png", type: "m1" }
  ];

  shuffleArray(trashItems);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function updateProgress() {
    progressFill.style.width = `${(score / trashItems.length) * 100}%`;
    progressFill.style.visibility = "visible";
    progressFill.style.opacity = "1";
    progressIcon.style.left = `${(score / trashItems.length) * 100}%`;
  }

  function loadNextTrash() {
    trashHolder.innerHTML = "";
    updateProgress();

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

  loadNextTrash();
});
