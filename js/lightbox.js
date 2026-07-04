/* Lightbox for the photography gallery.
   Click a photo (without dragging) to open it full screen.
   Keys: Esc closes, ←/→ navigate. */
(function () {
	const track = document.getElementById("container");
	if (!track) return;

	/* Build overlay once */
	const overlay = document.createElement("div");
	overlay.className = "lightbox";
	overlay.setAttribute("role", "dialog");
	overlay.setAttribute("aria-modal", "true");
	overlay.setAttribute("aria-label", "Photo viewer");
	overlay.innerHTML = `
		<button class="lb-close" aria-label="Close">&times;</button>
		<button class="lb-prev" aria-label="Previous photo">&larr;</button>
		<img class="lb-img" alt="" />
		<button class="lb-next" aria-label="Next photo">&rarr;</button>
		<div class="lb-caption"><span class="lb-alt"></span><span class="lb-count"></span></div>
	`;
	document.body.appendChild(overlay);

	const lbImg = overlay.querySelector(".lb-img");
	const lbAlt = overlay.querySelector(".lb-alt");
	const lbCount = overlay.querySelector(".lb-count");

	let idx = 0;
	const imgs = () => Array.from(track.getElementsByClassName("image"));

	const show = (i) => {
		const list = imgs();
		if (!list.length) return;
		idx = (i + list.length) % list.length;
		lbImg.src = list[idx].src;
		lbImg.alt = list[idx].alt;
		lbAlt.textContent = list[idx].alt;
		lbCount.textContent = `${idx + 1} / ${list.length}`;
	};

	const open = (i) => {
		show(i);
		overlay.classList.add("open");
		document.body.style.overflow = "hidden";
		overlay.querySelector(".lb-close").focus();
	};

	const close = () => {
		overlay.classList.remove("open");
		document.body.style.overflow = "";
		lbImg.src = "";
	};

	/* Open on click — but not after a drag */
	track.addEventListener("click", (e) => {
		const img = e.target.closest(".image");
		if (!img) return;
		if (typeof track.wasDragged === "function" && track.wasDragged()) return;
		open(imgs().indexOf(img));
	});

	overlay.querySelector(".lb-close").addEventListener("click", close);
	overlay.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
	overlay.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
	overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

	document.addEventListener("keydown", (e) => {
		if (!overlay.classList.contains("open")) return;
		if (e.key === "Escape") close();
		else if (e.key === "ArrowLeft") show(idx - 1);
		else if (e.key === "ArrowRight") show(idx + 1);
	});
})();
