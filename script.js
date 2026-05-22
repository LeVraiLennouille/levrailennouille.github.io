// ! Functions ! //
// * Cursor * //
	const dot    = document.getElementById('CursorDot');
const ball   = document.getElementById('CursorBall');
const canvas = document.getElementById('Trail');
const ctx    = canvas.getContext('2d');

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  	W = canvas.width  = window.innerWidth;
  	H = canvas.height = window.innerHeight;
});

const mouse  = {x: W/2, y: H/2};
const dotPos = {x: W/2, y: H/2};
const pos    = {x: W/2, y: H/2};
const speed  = 0.08;

const trail = [];
const MAX_TRAIL = 32;

const rootStyles = getComputedStyle(document.documentElement);
const bgVarRaw = rootStyles.getPropertyValue('--Background').trim();

function resolveColorToRGB(cssValue) {
  	const tmp = document.createElement('div');
  	tmp.style.cssText  = `position:absolute;width:0;height:0;background:${cssValue}`;
  	document.body.appendChild(tmp);
  	const computed = getComputedStyle(tmp).backgroundColor;
  	document.body.removeChild(tmp);
	return computed;
}

const bgVarResolved = bgVarRaw ? resolveColorToRGB(bgVarRaw) : null;
const whiteResolved = resolveColorToRGB('white');

function parseRGB(str) {
  	const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  	return m ? [+m[1], +m[2], +m[3]] : null;
}

const bgVarRGB  = bgVarResolved ? parseRGB(bgVarResolved) : null;
const whiteRGB  = parseRGB(whiteResolved);

function luminance([r, g, b]) {return (0.299 * r + 0.587 * g + 0.114 * b) / 255;}

function isLightTarget(rgb) {
  	if (!rgb) return false;
  	if (whiteRGB && rgb[0] === whiteRGB[0] && rgb[1] === whiteRGB[1] && rgb[2] === whiteRGB[2]) return true;
  	if (bgVarRGB  && rgb[0] === bgVarRGB[0]  && rgb[1] === bgVarRGB[1]  && rgb[2] === bgVarRGB[2])  return true;
  	return false;
}

function getEffectiveBgRGB(x, y) {
  	const elements = document.elementsFromPoint(x, y).filter(el => el !== dot && el !== ball && el !== canvas);
  	for (const el of elements) {
	    const bg = getComputedStyle(el).backgroundColor;
    	const rgb = parseRGB(bg);
		
	    if (!rgb) continue;
    	const alphaMatch = bg.match(/rgba?\(\d+,\s*\d+,\s*\d+,?\s*([\d.]+)?/);
	    const alpha = alphaMatch?.[1] !== undefined ? +alphaMatch[1] : 1;

    	if (alpha === 0) continue;
	    return rgb;
  	}
	return null;
}

let lightMode = false;

function applyTheme(light) {
  	if (light === lightMode) return;
  	lightMode = light;
  	const dotColor  = light ? '#000' : '#fff';
  	const ballColor = light ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
  	dot.style.background  = dotColor;
  	ball.style.borderColor = ballColor;
}

window.addEventListener('mousemove', e => {
  	mouse.x = e.clientX;
  	mouse.y = e.clientY;
});

document.querySelectorAll('.CursorHover').forEach(el => {
  	el.addEventListener('mouseenter', () => {
	    ball.style.width = '52px';
    	ball.style.height = '52px';
	    dot.style.width = '4px';
    	dot.style.height = '4px';
  	});
  	el.addEventListener('mouseleave', () => {
	    ball.style.width = '28px';
    	ball.style.height = '28px';
	    dot.style.width = '8px';
    	dot.style.height = '8px';
  	});
});

let last = performance.now();
let frameCount = 0;

function loop(now) {
  	const dt = Math.min(now - last, 50);
  	last = now;

  	const delta = dt * (60 / 1000);
  	const lerpT = 1.0 - Math.pow(1.0 - speed, delta);

  	pos.x += (mouse.x - pos.x) * lerpT;
  	pos.y += (mouse.y - pos.y) * lerpT;

  	dotPos.x += (mouse.x - dotPos.x) * 0.85;
  	dotPos.y += (mouse.y - dotPos.y) * 0.85;

  	dot.style.left  = Math.round(dotPos.x) + 'px';
  	dot.style.top   = Math.round(dotPos.y) + 'px';
  	ball.style.left = Math.round(pos.x) + 'px';
  	ball.style.top  = Math.round(pos.y) + 'px';

  	if (frameCount++ % 3 === 0) {
	    const bgRGB = getEffectiveBgRGB(Math.round(mouse.x), Math.round(mouse.y));
    	applyTheme(bgRGB ? isLightTarget(bgRGB) : false);
  	}

  	trail.push({ x: pos.x, y: pos.y });
  	if (trail.length > MAX_TRAIL) trail.shift();

	const trailColor = lightMode ? '0,0,0' : '255,255,255';

  	ctx.clearRect(0, 0, W, H);
  	for (let i = 1; i < trail.length; i++) {
	    const ratio = i / trail.length;
    	ctx.beginPath();
	    ctx.arc(trail[i].x, trail[i].y, ratio * 6, 0, Math.PI * 2);
    	ctx.fillStyle = `rgba(${trailColor},${ratio * 0.18})`;
	    ctx.fill();
  	}
  	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);