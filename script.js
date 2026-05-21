// ! Animations ! //
// * Hero * //
let select    = e => document.querySelector(e);
let selectAll = e => document.querySelectorAll(e);

let split     = [[], [], []];
let splitSpan = [[], [], []];
let stagger   = 0.04;

window.onload = () => {
    gsap.set("body",   {"--Rotation": "120deg", transformOrigin: "50% 50%"});
    gsap.set("body",   {"--Thickness": "8px", "--Border": "8px", "--Gap": "30px"});
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
                onComplete: () => {
                    if (split[i][j + 1]) writeText(i, j + 1);}
            }).to(splitText.chars, {opacity: 1, stagger});
        }
    }

    gsap.set("section", {autoAlpha: 1});
    gsap.timeline({defaults: {ease: "elastic.inOut(1.6,0.6,1.3,1)"}})
        .delay(0.25)
        .to("#SubT1", {duration: 2.5, x: 0, opacity: 1})
        .to("#SubT2", {duration: 2.5, x: 0, opacity: 1}, "<")
        .to("body",   {duration: 2,   "--Rotation": "-60deg", transformOrigin: "50% 50%"}, 1.5)
        .to("body",   {duration: 0.5, "--Thickness": "20px", "--Border": "10px", "--Gap": "52px"}, 2.3)
        .add(() => callWriteText(), 2.5);
};

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
