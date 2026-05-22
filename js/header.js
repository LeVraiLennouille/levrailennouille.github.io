const headerHTML = `
    <header class="MainHeader">
        <nav class="NavBar">
            <a class="NavLogo" href="/index" aria-label="Retour à l'accueil"><img src="/assets/icon.svg" alt="Logo de Lenny Gadroy" /></a>
            <ul class="NavLinks">
                <li><a href="/index">Accueil</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/reals">Réalisations</a></li>
                <li><a href="/about">A propos</a></li>
            </ul>
            <div class="NavBtn"><a href="/contact" class="BtnSolid">Me contacter</a></div>
        </nav>
    </header>
`;

document.getElementById('HeaderPlaceHolder').innerHTML = headerHTML;