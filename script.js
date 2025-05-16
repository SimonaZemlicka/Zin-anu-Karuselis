document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");
  const progressIcon = document.getElementById("progressIcon");
  progressIcon.style.display = "none";

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
    { src: "bat3.png", type: "m6" }
  ];

  // ✅ Advanced Image Preloading with Cache Control
  const preloadImages = () => {
    trashItems.forEach(item => {
      const img = new Image();
      img.src = `${item.src}?cache-bust=${Date.now()}`; // Cache-bust for fresh load
      img.loading = "eager";
      img.decoding = "async";
      img.style.display = "none";
      document.body.appendChild(img);
    });
  };

  preloadImages();
  shuffleArray(trashItems);
  loadNextTrash();

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function loadNextTrash() {
    if (currentTrashIndex >= trashItems.length) {
      trashHolder.innerHTML = `<div class="final-message" style="text-align:center;">🎉 Visi atkritumi sašķiroti!<br>Tu ieguvi <strong>${score}</strong> punktus no <strong>${trashItems.length}</strong>.</div>`;
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

    trashHolder.innerHTML = "";
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

    if (!draggedGhost) {
      draggedGhost = draggedOriginal.cloneNode(true);
      draggedGhost.classList.add("ghost");
      document.body.appendChild(draggedGhost);
    }

    moveGhost(e);

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", dragMove);
    document.addEventListener("touchend", endDrag);
  }

  function moveGhost(e) {
    if (!draggedGhost) return;
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

    draggedGhost.style.left = `${clientX}px`;
    draggedGhost.style.top = `${clientY}px`;
  }

  function endDrag() {
    if (!draggedGhost) return;

    draggedGhost.remove();
    draggedGhost = null;
    draggedOriginal = null;

    currentTrashIndex++;
    loadNextTrash();
  }
});
