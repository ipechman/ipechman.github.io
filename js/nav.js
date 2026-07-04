/* Nav behaviour: scroll state, mobile menu, active link, reveal-on-scroll. */
(function () {
	document.documentElement.classList.add("js");

	const yearEl = document.getElementById("year");
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	const nav = document.getElementById("nav");
	const toggle = document.getElementById("nav-toggle");
	const links = document.getElementById("nav-links");

	/* Sticky-nav background once scrolled */
	const onScroll = () => {
		if (!nav) return;
		nav.classList.toggle("scrolled", window.scrollY > 24);
	};
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });

	/* Mobile menu */
	if (toggle && links) {
		toggle.addEventListener("click", () => {
			const open = links.classList.toggle("open");
			toggle.classList.toggle("open", open);
			toggle.setAttribute("aria-expanded", open ? "true" : "false");
		});
		links.querySelectorAll("a").forEach((a) => {
			a.addEventListener("click", () => {
				links.classList.remove("open");
				toggle.classList.remove("open");
				toggle.setAttribute("aria-expanded", "false");
			});
		});
	}

	/* Reveal sections on scroll */
	const revealEls = document.querySelectorAll(".reveal");
	if ("IntersectionObserver" in window) {
		const ro = new IntersectionObserver((entries) => {
			entries.forEach((en) => {
				if (en.isIntersecting) {
					en.target.classList.add("visible");
					ro.unobserve(en.target);
				}
			});
		}, { threshold: 0.12 });
		revealEls.forEach((el) => ro.observe(el));
	} else {
		revealEls.forEach((el) => el.classList.add("visible"));
	}

	/* Highlight the nav link for the section in view */
	const navMap = {};
	document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
		navMap[a.getAttribute("href").slice(1)] = a;
	});
	const sections = document.querySelectorAll("main section[id]");
	if ("IntersectionObserver" in window && sections.length) {
		const so = new IntersectionObserver((entries) => {
			entries.forEach((en) => {
				const link = navMap[en.target.id];
				if (en.isIntersecting && link) {
					Object.values(navMap).forEach((a) => a.classList.remove("active"));
					link.classList.add("active");
				}
			});
		}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
		sections.forEach((s) => so.observe(s));
	}
})();
