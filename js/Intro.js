let header = document.querySelector('#intro');
let anim = [
    { t: "{ }", ms: 3000 },
    { t: "{_}", ms: 700 },
    { t: "{ }", ms: 700 },
    { t: "{_}", ms: 700 },
	{ t: "{ }", ms: 700 },
    { t: "{_}", ms: 700 },
	{ t: "{ }", ms: 700 },
    { t: "{I_}", ms: 500 },
    { t: "{IP_}", ms: 500 },
    { t: "{IPE_}", ms: 500 },
    { t: "{IPEC_}", ms: 500 },
    { t: "{IPECH_}", ms: 500 },
    { t: "{IPECHM_}", ms: 500 },
    { t: "{IPECHMA_}", ms: 500 },
    { t: "{IPECHMAN_}", ms: 700 },
    { t: "{IPECHMAN }", ms: 700 },
    { t: "{IPECHMAN_}", ms: 700 },
    { t: "{IPECHMAN }", ms: 700 },
    { t: "{IPECHMAN_}", ms: 700 },
	{ t: "{IPECHMAN }", ms: 400 },
    { t: "{IPECHMAN}", ms: 2000 }
];
let stepDenominator = 1;
if (window.localStorage.stepDenominator)
    stepDenominator = window.localStorage.stepDenominator;
let i = 0;
let update = () => {
    let step = anim[i];
    header.innerText = step.t;
    i++;

    if (i < anim.length)
        setTimeout(update, step.ms / stepDenominator);
    else {
        window.localStorage.stepDenominator = 2; // Infinity loop? maybe dont?
    }
}
update();