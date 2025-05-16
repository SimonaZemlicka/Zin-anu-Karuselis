document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");
  const progressIcon = document.getElementById("progressIcon");

  let currentTrashIndex = 0;
  let score = 0;
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

  trashItems.sort(() => Math.random() - 0.5);

  function loadNextTrash() {
    if (currentTrashIndex >= trashItems.length) return showCompletion();

    const { src, type } = trashItems[currentTrashIndex];
    trashHolder.innerHTML = `<img src="${src}" class="trash-item" data-type="${type}" draggable="true" onerror="handleImageError(this)" />`;

    const trashItem = trashHolder.querySelector(".trash-item");
    trashItem.addEventListener("dragstart", dragStart);
  }

  function handleImageError(img) {
    console.error("Neizdevās ielādēt attēlu:", img.src);
    currentTrashIndex++;
    loadNextTrash();
  }

  function dragStart(e) {
    e.dataTransfer.setData("type", e.target.dataset.type);
  }

  bins.forEach(bin => {
    bin.addEventListener("dragover", e => e.preventDefault());
    bin.addEventListener("drop", handleDrop);
  });

  function handleDrop(e) {
    const droppedType = e.dataTransfer.getData("type");
    const binType = e.target.getAttribute("src") ? e.target.getAttribute("src").replace(".png", "") : "";

    if (droppedType === binType) {
      score++;
      scoreDisplay.textContent = score;
      currentTrashIndex++;

      const progress = (score / trashItems.length) * 100;
      progressFill.style.width = `${progress}%`;
      progressIcon.style.left = `${progress}%`;

      loadNextTrash();
    }
  }

  function showCompletion() {
    trashHolder.innerHTML = `<h1>🎉 Visi atkritumi sašķiroti!</h1><p>Tu ieguvi <strong>${score}</strong> punktus no <strong>${trashItems.length}</strong>.</p>`;
  }

  loadNextTrash();
});
