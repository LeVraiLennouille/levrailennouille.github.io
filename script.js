// ! Functions ! //
// * Cursor * //
if (window.matchMedia('(pointer: coarse)').matches) {
    const _dot  = document.getElementById('CursorDot');
    const _ball = document.getElementById('CursorBall');

    if (_dot)  _dot.style.display  = 'none';
    if (_ball) _ball.style.display = 'none';
    throw new Error('Touch device — cursor disabled.');
}

const dot    = document.getElementById('CursorDot');
const ball   = document.getElementById('CursorBall');

let W = window.innerWidth;
let H = window.innerHeight;

window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
});

const mouse  = {x: W/2, y: H/2};
const dotPos = {x: W/2, y: H/2};
const pos    = {x: W/2, y: H/2};
const speed  = 0.08;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReduced  = reducedMotion.matches;
reducedMotion.addEventListener('change', e => { prefersReduced = e.matches; });

const rootStyles = getComputedStyle(document.documentElement);
const bgVarRaw = rootStyles.getPropertyValue('--Background').trim();

function resolveColorToRGB(cssValue) {
    const tmp = document.createElement('div');
    tmp.style.cssText = `position:absolute;width:0;height:0;background:${cssValue}`;
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

const bgVarRGB = bgVarResolved ? parseRGB(bgVarResolved) : null;
const whiteRGB = parseRGB(whiteResolved);

function isLightTarget(rgb) {
    if (!rgb) return false;
    if (whiteRGB && rgb[0] === whiteRGB[0] && rgb[1] === whiteRGB[1] && rgb[2] === whiteRGB[2]) return true;
    if (bgVarRGB && rgb[0] === bgVarRGB[0]  && rgb[1] === bgVarRGB[1]  && rgb[2] === bgVarRGB[2]) return true;
    return false;
}

function getEffectiveBgRGB(x, y) {
    const elements = document.elementsFromPoint(x, y).filter(el => el !== dot && el !== ball);
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
    dot.style.background = light ? '#000' : '#fff';
    ball.style.borderColor = light ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
    if (cursorState === 'text') {ball.style.background = light ? '#000' : '#fff';}
}

let cursorState = 'default';
let isHovering = false;
let isClicking = false;
let isDragging = false;

function applyCursorState() {
    let newState = 'default';
    if (isDragging) newState = 'drag';
    else if (isClicking) newState = 'click';
    else if (isHovering) newState = 'hover';
    if (newState === cursorState) return;

    cursorState = newState;
    const fg = lightMode ? '#000' : '#fff';
    const border = lightMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
    
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.opacity = '1';
    ball.style.width = '28px';
    ball.style.height = '28px';
    ball.style.borderRadius = '50%';
    ball.style.border = `1.5px solid ${border}`;
    ball.style.background = 'transparent';
    ball.style.opacity = '1';

    switch (newState) {
        case 'hover':
            ball.style.width = '52px';
            ball.style.height = '52px';
            dot.style.width = '4px';
            dot.style.height = '4px';
            break;

        case 'click':

            ball.style.width = '18px';
            ball.style.height = '18px';
            dot.style.width = '10px';
            dot.style.height = '10px';
            break;

        case 'drag':
            ball.style.width = '56px';
            ball.style.height = '56px';
            ball.style.opacity = '0.7';
            dot.style.width = '4px';
            dot.style.height = '4px';
            break;
    }
}

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (isClicking && !isDragging) {
        isDragging = true;
        applyCursorState();
    }
});

document.addEventListener('mousedown', () => {
    isClicking = true;
    isDragging = false;
    applyCursorState();
});

document.addEventListener('mouseup', () => {
    isClicking = false;
    isDragging = false;
    applyCursorState();
});

document.querySelectorAll('.CursorHover').forEach(el => {
    el.addEventListener('mouseenter', () => {
        isHovering = true;
        applyCursorState();
    });
    
    el.addEventListener('mouseleave', () => {
        isHovering = false;
        applyCursorState();
    });
});

let last = performance.now();
let frameCount = 0;
let rafId = null;

function loop(now) {
    const dt = Math.min(now - last, 50);
    last = now;

    const delta = dt * (60 / 1000);
    const lerpT = 1.0 - Math.pow(1.0 - speed, delta);

    if (prefersReduced) {
        pos.x = mouse.x;
        pos.y = mouse.y;
        dotPos.x = mouse.x;
        dotPos.y = mouse.y;
    } else {
        pos.x += (mouse.x - pos.x) * lerpT;
        pos.y += (mouse.y - pos.y) * lerpT;

        dotPos.x += (mouse.x - dotPos.x) * 0.85;
        dotPos.y += (mouse.y - dotPos.y) * 0.85;
    }

    dot.style.left = Math.round(dotPos.x) + 'px';
    dot.style.top = Math.round(dotPos.y) + 'px';
    ball.style.left = Math.round(pos.x) + 'px';
    ball.style.top = Math.round(pos.y) + 'px';

    if (frameCount++ % 3 === 0) {
        const bgRGB = getEffectiveBgRGB(Math.round(mouse.x), Math.round(mouse.y));
        applyTheme(bgRGB ? isLightTarget(bgRGB) : (bgVarRGB ? isLightTarget(bgVarRGB) : false));
    }

    rafId = requestAnimationFrame(loop);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = null;
    } else {
        last  = performance.now();
        rafId = requestAnimationFrame(loop);
    }
});
rafId = requestAnimationFrame(loop);