const headerHTML = `
    <header class="MainHeader">
        <nav class="NavBar">
            <a class="NavLogo" href="/index" aria-label="Retour à l'accueil"><img src="/assets/icon.svg" alt="Logo de Lenny Gadroy" /></a>
            <ul class="NavLinks">
                <li><a href="/index">Accueil</a></li>
                <li class="Dropdown">
                    <a href="#!">Réalisations <span class="Chevron">▼</span></a>
                    <ul class="DropdownMenu">
                        <li><a href="/projets">Projets</a></li>
                        <li><a href="/designs">Designs</a></li>
                        <li><a href="/albums">Albums</a></li>
                    </ul>
                </li>
                <li><a href="/skills">Compétences</a></li>
                <li><a href="/cv">Curriculum</a></li>
            </ul>
            <div class="NavBtn"><a href="/contact" class="BtnSolid">Me contacter</a></div>
        </nav>
    </header>
`;

document.getElementById('HeaderPlaceHolder').innerHTML = headerHTML;