const RelatedHTML = `
    <section class="RelatedProjects" data-related-reals>
        <div class="RelatedBlock" data-related-block="similar">
            <div class="RelatedHeader">
                <span class="RelatedEyebrow">Projets similaires</span>
                <h2 class="RelatedTitle">Vous pourriez aussi aimer</h2>
            </div>
            <div class="RelatedGrid" data-related-grid="similar"></div>
        </div>
        <div class="RelatedBlock" data-related-block="latest">
            <div class="RelatedHeader">
                <span class="RelatedEyebrow">Nouveauté</span>
                <h2 class="RelatedTitle">Mes derniers travaux</h2>
            </div>
            <div class="RelatedGrid" data-related-grid="latest"></div>
        </div>
        <div class="RelatedFooter">
            <a href="/reals" class="BtnSolid">Voir tous les projets →</a>
        </div>
    </section>
`;

document.getElementById('RelatedPlaceHolder').innerHTML = RelatedHTML;