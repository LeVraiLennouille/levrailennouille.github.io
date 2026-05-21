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