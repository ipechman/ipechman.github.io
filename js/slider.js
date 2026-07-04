/* Draggable star-trail gallery.
   Images are loaded dynamically from images/carousel/manifest.json
   (run tools/generate_manifest.py after adding photos to images/carousel/).
   Ordered by file name (natural sort). Falls back to a built-in list
   when the manifest can't be fetched (e.g. opening index.html directly). */
(function () {
	const track = document.getElementById("container");
	if (!track) return;

	const DIR = "images/carousel/";
	const FALLBACK = [
		{ src: "trail-3328.webp", alt: "Circular star-trail long exposure in warm tones" },
		{ src: "trail-3329.webp", alt: "Star trails arcing across the night sky" },
		{ src: "trail-3330.webp", alt: "Long-exposure star-trail astrophotography" },
		{ src: "trail-3331.webp", alt: "Concentric star trails around the celestial pole" }
	];

	/* natural sort: trail-2 < trail-10 */
	const naturalCompare = (a, b) =>
		a.src.localeCompare(b.src, undefined, { numeric: true, sensitivity: "base" });

	const render = (images) => {
		track.innerHTML = "";
		images.sort(naturalCompare).forEach((img) => {
			const el = document.createElement("img");
			el.className = "image";
			el.src = DIR + img.src;
			el.alt = img.alt || "";
			el.draggable = false;
			el.loading = "lazy";
			el.decoding = "async";
			track.appendChild(el);
		});
		track.dispatchEvent(new CustomEvent("gallery:ready", { bubbles: true }));
	};

	const init = async () => {
		try {
			const res = await fetch(DIR + "manifest.json", { cache: "no-cache" });
			if (!res.ok) throw new Error(res.status);
			const data = await res.json();
			if (Array.isArray(data.images) && data.images.length) {
				render(data.images);
				return;
			}
			throw new Error("empty manifest");
		} catch (_) {
			render(FALLBACK); // file:// or missing manifest
		}
	};

	/* ---------------- drag / pan logic ---------------- */
	let isDown = false;
	let startX = 0, startY = 0, axis = null; // axis: 'h' | 'v' for touch
	let moved = 0;                            // px travelled — distinguishes click from drag

	// Lowest (most negative) percentage we can pan to, based on overflow.
	const minPercentage = () => {
		const parentW = track.parentElement ? track.parentElement.clientWidth : window.innerWidth;
		const trackW = track.scrollWidth || 1;
		const overflow = Math.max(0, trackW - parentW);
		return -(overflow / trackW) * 100;
	};

	const pan = (x) => {
		const mouseDelta = parseFloat(track.dataset.mouseDownAt) - x;
		moved = Math.max(moved, Math.abs(mouseDelta));
		const maxDelta = window.innerWidth / 2;
		const percentage = (mouseDelta / maxDelta) * -100;
		const prev = parseFloat(track.dataset.prevPercentage) || 0;
		const next = Math.max(Math.min(prev + percentage, 0), minPercentage());

		track.dataset.percentage = next;
		track.animate(
			{ transform: `translateX(${next}%)` },
			{ duration: 1000, fill: "forwards" }
		);
		for (const image of track.getElementsByClassName("image")) {
			image.animate(
				{ objectPosition: `${100 + next}% center` },
				{ duration: 1000, fill: "forwards" }
			);
		}
	};

	const down = (x) => { isDown = true; moved = 0; track.dataset.mouseDownAt = x; };
	const up = () => {
		if (!isDown) return;
		isDown = false;
		track.dataset.mouseDownAt = "0";
		track.dataset.prevPercentage = track.dataset.percentage || "0";
	};

	/* Was the last pointer interaction a drag (vs. a click)? Used by the lightbox. */
	track.wasDragged = () => moved > 6;

	/* ---- Mouse ---- */
	track.addEventListener("mousedown", (e) => { e.preventDefault(); down(e.clientX); });
	window.addEventListener("mousemove", (e) => { if (isDown) pan(e.clientX); });
	window.addEventListener("mouseup", up);

	/* ---- Touch (let vertical swipes scroll the page) ---- */
	track.addEventListener("touchstart", (e) => {
		startX = e.touches[0].clientX;
		startY = e.touches[0].clientY;
		axis = null;
	}, { passive: true });

	track.addEventListener("touchmove", (e) => {
		const t = e.touches[0];
		if (axis === null) {
			axis = Math.abs(t.clientX - startX) > Math.abs(t.clientY - startY) ? "h" : "v";
			if (axis === "h") down(startX);
		}
		if (axis === "h") { e.preventDefault(); pan(t.clientX); }
	}, { passive: false });

	window.addEventListener("touchend", up);

	/* ---- Keyboard (accessibility) ---- */
	track.setAttribute("tabindex", "0");
	track.setAttribute("role", "region");
	track.setAttribute("aria-label", "Star trail photo gallery, use left and right arrow keys to pan");
	track.addEventListener("keydown", (e) => {
		if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		e.preventDefault();
		const prev = parseFloat(track.dataset.prevPercentage) || 0;
		const step = e.key === "ArrowRight" ? -8 : 8;
		const next = Math.max(Math.min(prev + step, 0), minPercentage());
		track.dataset.percentage = next;
		track.dataset.prevPercentage = next;
		track.animate({ transform: `translateX(${next}%)` }, { duration: 600, fill: "forwards" });
		for (const image of track.getElementsByClassName("image")) {
			image.animate({ objectPosition: `${100 + next}% center` }, { duration: 600, fill: "forwards" });
		}
	});

	init();
})();
