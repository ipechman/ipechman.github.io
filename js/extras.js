/* QOL extras: copy-email button + Konami code easter egg. */
(function () {
	/* ---------------- copy email ---------------- */
	const copyBtn = document.getElementById("copy-email");
	if (copyBtn) {
		copyBtn.addEventListener("click", async () => {
			const text = copyBtn.dataset.copy;
			try {
				await navigator.clipboard.writeText(text);
			} catch (_) {
				const ta = document.createElement("textarea"); // http / older browsers
				ta.value = text;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				ta.remove();
			}
			copyBtn.classList.add("copied");
			copyBtn.textContent = "copied!";
			setTimeout(() => {
				copyBtn.classList.remove("copied");
				copyBtn.textContent = "copy email";
			}, 1600);
		});
	}

	/* ---------------- Konami code: ↑ ↑ ↓ ↓ ← → ← → B A ---------------- */
	const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
		"ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
	let pos = 0;
	let running = false;

	document.addEventListener("keydown", (e) => {
		const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
		pos = key === KONAMI[pos] ? pos + 1 : (key === KONAMI[0] ? 1 : 0);
		if (pos === KONAMI.length) {
			pos = 0;
			if (!running) hyperspace();
		}
	});

	/* Warp-speed starfield, tinted with the current theme accent. */
	function hyperspace() {
		running = true;
		const accent = getComputedStyle(document.documentElement)
			.getPropertyValue("--accent").trim() || "#d9a441";

		const canvas = document.createElement("canvas");
		canvas.style.cssText =
			"position:fixed;inset:0;z-index:300;background:#000;opacity:0;transition:opacity .4s;cursor:pointer";
		document.body.appendChild(canvas);
		requestAnimationFrame(() => (canvas.style.opacity = "1"));

		const msg = document.createElement("div");
		msg.textContent = "{ hyperspace engaged }";
		msg.style.cssText =
			"position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:301;" +
			`color:${accent};font-family:inherit;font-weight:700;letter-spacing:2px;` +
			"font-size:clamp(1.1rem,4vw,2rem);text-shadow:0 0 24px currentColor;" +
			"pointer-events:none;opacity:0;transition:opacity .8s";
		document.body.appendChild(msg);
		setTimeout(() => (msg.style.opacity = "1"), 600);

		const ctx = canvas.getContext("2d");
		const fit = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
		fit();
		addEventListener("resize", fit);

		const N = 350;
		const stars = Array.from({ length: N }, () => ({
			x: (Math.random() - 0.5) * canvas.width,
			y: (Math.random() - 0.5) * canvas.height,
			z: Math.random() * canvas.width
		}));

		let speed = 4;
		let alive = true;
		const start = performance.now();
		const DURATION = 7000;

		const tick = (now) => {
			if (!alive) return;
			const t = now - start;
			speed = Math.min(28, 4 + t / 180);                 // accelerate
			const cx = canvas.width / 2, cy = canvas.height / 2;

			ctx.fillStyle = "rgba(0,0,0,0.32)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = accent;
			ctx.lineCap = "round";

			for (const s of stars) {
				const pz = s.z;
				s.z -= speed;
				if (s.z <= 1) {
					s.x = (Math.random() - 0.5) * canvas.width;
					s.y = (Math.random() - 0.5) * canvas.height;
					s.z = canvas.width;
					continue;
				}
				const sx = cx + (s.x / s.z) * cx;
				const sy = cy + (s.y / s.z) * cy;
				const px = cx + (s.x / pz) * cx;
				const py = cy + (s.y / pz) * cy;
				const depth = 1 - s.z / canvas.width;
				ctx.globalAlpha = Math.min(1, depth * 1.4);
				ctx.lineWidth = depth * 2.6;
				ctx.beginPath();
				ctx.moveTo(px, py);
				ctx.lineTo(sx, sy);
				ctx.stroke();
			}
			ctx.globalAlpha = 1;

			if (t > DURATION) { end(); return; }
			requestAnimationFrame(tick);
		};

		const end = () => {
			if (!alive) return;
			alive = false;
			canvas.style.opacity = "0";
			msg.style.opacity = "0";
			setTimeout(() => {
				canvas.remove();
				msg.remove();
				removeEventListener("resize", fit);
				running = false;
			}, 450);
		};

		canvas.addEventListener("click", end);
		document.addEventListener("keydown", function esc(e) {
			if (e.key === "Escape") { end(); document.removeEventListener("keydown", esc); }
		});

		requestAnimationFrame(tick);
	}
})();
