const HeroHTML = `
    <section class="Hero">
        <div id="Ground" class="Box"></div>
        <img src="assets/face.svg" alt="Visage du logo Lennouille">
        <div id="Air" class="Box"></div>
        <div id="Text" class="Box">
            <div class="SubBox">
                <div class="SubText" id="SubT1">Lennouille
                    <span class="T1A VT TS26">Wireframe</span>
                    <span class="T1B TS46">UX</span>
                    <span class="T1C VT TS30">Audits</span>
                    <span class="T1D TS26">Mapping</span>
                    <span class="T1E VT TS30">Parcours</span>
                </div>
                <div class="SubText" id="SubT2">DESIGN
                    <span class="T2A VT TS26">Optimiser</span>
                    <span class="T2B TS46">UI</span>
                    <span class="T2C VT TS30">Layout</span>
                    <span class="T2D TS26">Intégrer</span>
                    <span class="T2E VT TS30">Affiner</span>
                </div>
            </div>
        </div>
    </section>
`;

document.getElementById('HeroPlaceHolder').innerHTML = HeroHTML;