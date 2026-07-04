/* Theme switcher — cycles themes, persists choice in localStorage. */
(function () {
	const THEMES = [
		{ id: "night",  label: "night",  color: "#000000" }, // gold on black (default)
		{ id: "matrix", label: "matrix", color: "#020503" }, // green on black
		{ id: "nebula", label: "nebula", color: "#08060e" }, // violet on deep space
		{ id: "paper",  label: "paper",  color: "#f6f3ec" }  // light
	];

	const metaTheme = document.querySelector('meta[name="theme-color"]');

	const apply = (id) => {
		const theme = THEMES.find((t) => t.id === id) || THEMES[0];
		document.documentElement.setAttribute("data-theme", theme.id);
		if (metaTheme) metaTheme.setAttribute("content", theme.color);
		try { localStorage.setItem("theme", theme.id); } catch (_) {}
		const btn = document.getElementById("theme-toggle");
		if (btn) {
			btn.querySelector(".theme-name").textContent = theme.label;
			btn.setAttribute("aria-label", `Switch theme (current: ${theme.label})`);
			btn.title = `theme: ${theme.label} — click to switch`;
		}
		return theme;
	};

	let saved = null;
	try { saved = localStorage.getItem("theme"); } catch (_) {}
	apply(saved || "night");

	const btn = document.getElementById("theme-toggle");
	if (btn) {
		apply(document.documentElement.getAttribute("data-theme")); // sync label
		btn.addEventListener("click", () => {
			const current = document.documentElement.getAttribute("data-theme");
			const i = THEMES.findIndex((t) => t.id === current);
			apply(THEMES[(i + 1) % THEMES.length].id);
		});
	}
})();
