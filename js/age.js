let ageEl = document.getElementById("age");

setInterval(() => {
	let time = dayjs().diff(dayjs(1086591060000), 'year', true);
	ageEl.innerText = time.toString().substring(0, 12);
}, 50);

// 1086591060000
