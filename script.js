document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");

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

  function loadNextTrash() {
    trashHolder.innerHTML = "";

    if (currentTrashIndex >= trashItems.length) {
      trashHolder.innerHTML = `<h1 style='text-align: center;'>🎉 Visi atkritumi sašķiroti!</h1><p style='text-align: center;'>Tu ieguvi <strong>${score}</strong> punktus no <strong>${trashItems.length}</strong>.</p>`;
      return;
    }

    const trash = trashItems[currentTrashIndex];
    const img = document.createElement("img");
    img.src = trash.src;
    img.className = "trash-item";
    img.setAttribute("data-type", trash.type);
    img.style.position = "absolute";
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

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", endDrag);
  }

  function dragMove(e) {
    e.preventDefault();
    if (draggedOriginal) {
      draggedOriginal.style.left = `${e.clientX}px`;
      draggedOriginal.style.top = `${e.clientY}px`;
    }
  }

  function endDrag() {
    if (draggedOriginal) {
      currentTrashIndex++;
      loadNextTrash();
    }

    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", endDrag);
    draggedOriginal = null;
  }

  loadNextTrash();
});
