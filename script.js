// ! Functions ! //
// * Cursor * //
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

let dot  = null;
let ball = null;

if (isTouchDevice) {
    const _dot  = document.getElementById('CursorDot');
    const _ball = document.getElementById('CursorBall');
    if (_dot)  _dot.style.display  = 'none';
    if (_ball) _ball.style.display = 'none';
} else {
    dot  = document.getElementById('CursorDot');
    ball = document.getElementById('CursorBall');
}

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

if (!isTouchDevice) {

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
} // end if (!isTouchDevice)

// * NavBar Mobile* //
document.addEventListener('DOMContentLoaded', function () {
    initHamburger();
    if (typeof initScrollReveal === 'function')  initScrollReveal();
});

// ! Animations ! //
// * Hero * //
let select    = e => document.querySelector(e);
let selectAll = e => document.querySelectorAll(e);

let split     = [[], [], []];
let splitSpan = [[], [], []];
let stagger   = 0.04;

window.onload = () => {
    const heroSection = select(".Hero"); 
    gsap.set(heroSection, { "--Rotation": "120deg", transformOrigin: "50% 50%" });
    gsap.set(heroSection, { "--Thickness": "8px", "--Border": "8px", "--Gap": "30px" });

    gsap.set("#SubT1", {x: -600, opacity: 0});
    gsap.set("#SubT2", {x:  600, opacity: 0});

    selectAll(".SubText").forEach((textDiv, i) => {
        let spans = textDiv.querySelectorAll("span");
        split[i].push(spans);
        split[i].forEach(span => {
            let st = new SplitText(span, { type: "chars" });
            gsap.set(st.chars, { opacity: 0 });
            splitSpan[i].push(st);
        });
    });

    function callWriteText() {
        writeText(0, 0);
        writeText(1, 0);

        function writeText(i, j) {
            if (j >= 200) return;
            stagger = (i === 0) ? -0.04 : 0.04;

            let splitText = splitSpan[i][j];
            gsap.timeline({
                defaults: { repeatDelay: 0 },
                onComplete: () => {if (split[i][j + 1]) writeText(i, j + 1);}
            }).to(splitText.chars, {opacity: 1, stagger});
        }
    }

    gsap.set("section", {autoAlpha: 1});

    gsap.timeline({defaults: {ease: "elastic.inOut(1.6,0.6,1.3,1)"}})
        .delay(0.25)

        .to("#SubT1", {duration: 2.5, x: 0, opacity: 1})
        .to("#SubT2", {duration: 2.5, x: 0, opacity: 1}, "<")

        .to(heroSection, {duration: 2,   "--Rotation": "-60deg", transformOrigin: "50% 50%"}, 1.5)
        .to(heroSection, {duration: 0.5, "--Thickness": "20px", "--Border": "10px", "--Gap": "52px"}, 2.3)

        .add(() => callWriteText(), 2.5);
};

// * Scroll * //
const textElement = document.getElementById('TextReveal');
const textContent = textElement.innerText;

textElement.innerHTML = textContent.split(' ').map(Word => {
  	return `<span class="Word">${Word}</span>`;
}).join(' ');

const Words = document.querySelectorAll('.Word');
const Scroll = document.getElementById('Scroll');

function handleScroll() {
  	if (!Scroll) return;

  	const ScrollTop = Scroll.getBoundingClientRect().top;
  	const windowHeight = window.innerHeight;
  	const scrollableHeight = Scroll.offsetHeight - windowHeight;

  	let percentage = -ScrollTop / scrollableHeight; percentage = Math.max(0, Math.min(1, percentage));

  	const WordsToReveal = Math.floor(percentage * Words.length);
  	Words.forEach((Word, index) => {
	    if (index < WordsToReveal) {Word.classList.add('Revealed');}
		else {Word.classList.remove('Revealed');}
  	});
}

window.addEventListener('scroll', handleScroll);
handleScroll();

// * Work * //
document.addEventListener('DOMContentLoaded', () => {
	const lenis = new Lenis()
	lenis.on('scroll', ScrollTrigger.update)
	gsap.ticker.add(time => lenis.raf(time * 1e3))
	gsap.ticker.lagSmoothing(0)

	const workSection = document.querySelector('.Work')
	const cardsContainer = document.querySelector('.Container')
	const moveDistance = window.innerWidth * 5
	let currentXPosition = 0

	const lerp = (start, end, t) => start + (end - start) * t
	const gridCanvas = document.createElement('canvas')
	gridCanvas.id = 'CanvasGrid'
	workSection.appendChild(gridCanvas)

	const gridCtx = gridCanvas.getContext('2d')
	const resizeGridCanvas = () => {
		const dpr = window.devicePixelRatio || 1
		;[gridCanvas.width, gridCanvas.height] = [
			window.innerWidth * dpr,
			window.innerHeight * dpr,
		]

		;[gridCanvas.style.width, gridCanvas.style.height] = [
			`${window.innerWidth}px`,
			`${window.innerHeight}px`,
		]
		gridCtx.scale(dpr, dpr)
	}
    
	resizeGridCanvas()
	const drawGrid = (scrollProgress = 0) => {
		gridCtx.fillStyle = 'black'
		gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height)
		gridCtx.fillStyle = '#207EDE'
		const [dotSize, spacing] = [1, 30]
		const [rows, cols] = [
			Math.ceil(gridCanvas.height / spacing),
			Math.ceil(gridCanvas.width / spacing) + 15,
		]
        
		const offset = (scrollProgress * spacing * 10) % spacing
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				gridCtx.beginPath()
				gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2)
				gridCtx.fill()
			}
		}
	}

	const lettersScene = new THREE.Scene()
	const lettersCamera = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		1e3,
	)

	lettersCamera.position.z = 20
	const lettersRenderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	})

	lettersRenderer.setSize(window.innerWidth, window.innerHeight)
	lettersRenderer.setClearColor(0, 0)
	lettersRenderer.setPixelRatio(window.devicePixelRatio)
	lettersRenderer.domElement.id = 'CanvasLetters'
	workSection.appendChild(lettersRenderer.domElement)

	const createTextAnimationPath = (yPos, amplitude) => {
		const points = []
		for (let i = 0; i <= 20; i++) {
			const t = i / 20
			points.push(
				new THREE.Vector3(
					-25 + 50 * t,
					yPos + Math.sin(t * Math.PI) * -amplitude,
					(1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5,
				),
			)
		}

		const curve = new THREE.CatmullRomCurve3(points)
		const line = new THREE.Line(
			new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
			new THREE.LineBasicMaterial({ color: 0, linewidth: 1 }),
		)
		line.curve = curve
		return line
	}

	const path = [
		createTextAnimationPath(10, 2),
		createTextAnimationPath(3.5, 1),
		createTextAnimationPath(-3.5, -1),
		createTextAnimationPath(-10, -2),
	]
    
	path.forEach(line => lettersScene.add(line))
	const textContainer = document.querySelector('.Letters')
	const letterPositions = new Map()
	path.forEach((line, i) => {
		line.letterElements = Array.from({ length: 15 }, () => {
			const el = document.createElement('div')
			el.className = 'Letter'
			el.textContent = ['W', 'O', 'R', 'K'][i]
			textContainer.appendChild(el)
			letterPositions.set(el, {
				current: { x: 0, y: 0 },
				target: { x: 0, y: 0 },
			})
			return el
		})
	})

	const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9]
	const updateTargetPositions = (scrollProgress = 0) => {
		path.forEach((line, lineIndex) => {
			line.letterElements.forEach((element, i) => {
				const point = line.curve.getPoint(
					(i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1,
				)

				const vector = point.clone().project(lettersCamera)
				const positions = letterPositions.get(element)
				positions.target = {
					x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
					y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
				}
			})
		})
	}

	const updateLetterPositions = () => {
		letterPositions.forEach((positions, element) => {
			const distX = positions.target.x - positions.current.x
			if (Math.abs(distX) > window.innerWidth * 0.7) {
				;[positions.current.x, positions.current.y] = [
					positions.target.x,
					positions.target.y,
				]}

            else {
				positions.current.x = lerp(
					positions.current.x,
					positions.target.x,
					0.07,
				)
				positions.current.y = lerp(
					positions.current.y,
					positions.target.y,
					0.07,
				)
			}
            element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`
		})
	}

	const updateCardsPosition = () => {
		const targetX = -moveDistance * (ScrollTrigger.getAll()[0]?.progress || 0)
		currentXPosition = lerp(currentXPosition, targetX, 0.07)
		gsap.set(cardsContainer, {
			x: currentXPosition,
		})
	}

	const animate = () => {
		updateLetterPositions()
		updateCardsPosition()

		lettersRenderer.render(lettersScene, lettersCamera)
		requestAnimationFrame(animate)
	}

	ScrollTrigger.create({
		trigger: '.Work',
		start: 'top top',
		end: '+=700%',
		pin: true,
		pinSpacing: true,
		scrub: 1,

		onUpdate: self => {
			updateTargetPositions(self.progress)
			drawGrid(self.progress)
		},
	})

	drawGrid(0)
	animate()
	updateTargetPositions(0)

	window.addEventListener('resize', () => {
		resizeGridCanvas()
		drawGrid(ScrollTrigger.getAll()[0]?.progress || 0)
		lettersCamera.aspect = window.innerWidth / window.innerHeight
		lettersCamera.updateProjectionMatrix()
		lettersRenderer.setSize(window.innerWidth, window.innerHeight)
		updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0)
	})
})