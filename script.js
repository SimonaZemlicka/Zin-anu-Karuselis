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
        <h1>🎉 Visi atkritumi sašķiroti!</h1>
        <p>Tu ieguvi <strong>${score}</strong> punktus no <strong>${trashItems.length}</strong>.</p>
      `;
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

    // Oriģinālais kļūst blāvs
    draggedOriginal.style.opacity = "0.5";

    // Spilgtais ghost
    draggedGhost = draggedOriginal.cloneNode(true);
    draggedGhost.style.opacity = "1"; // Ghost ir spilgts
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

    let clientX, clientY;
    if (e.type.startsWith("touch")) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    draggedGhost.style.left = `${clientX}px`;
    draggedGhost.style.top = `${clientY}px`;
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
      }
    });

    if (matched) {
      score++;
      currentTrashIndex++;
      scoreDisplay.textContent = score;

      const progress = (score / trashItems.length) * 100;
      progressFill.style.width = `${progress}%`;
      progressIcon.style.left = `${progress}%`;

      const holderRect = trashHolder.getBoundingClientRect();

      bins.forEach((bin) => {
        const binRect = bin.getBoundingClientRect();
        const binType = bin.getAttribute("src").replace(".png", "");

        if (trashType === binType) {
          const centerX = binRect.left + binRect.width / 2;
          const centerY = binRect.top + binRect.height / 2;

          const relativeCenterX = centerX - holderRect.left;
          const relativeCenterY = centerY - holderRect.top;

          draggedOriginal.style.position = "absolute";
          draggedOriginal.style.left = `${relativeCenterX}px`;
          draggedOriginal.style.top = `${relativeCenterY}px`;
          draggedOriginal.style.transform = "translate(-50%, -50%)";
          draggedOriginal.style.transition = "all 0.3s ease"; // Smooth pārbīdes animācija
        }
      });

      draggedGhost.remove();
      draggedGhost = null;
      draggedOriginal = null;

      loadNextTrash();
    } else {
      // Nepareizi - oriģināls kļūst atkal spilgts un paliek sākumā
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

  loadNextTrash();
});
