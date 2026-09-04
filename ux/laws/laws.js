(function () {
    const CATS = {
        percept: {label: "Perception & Gestalt"},
        memoire: {label: "Mémoire & charge cognitive"},
        decision: {label: "Décision & comportement"},
        principes: {label: "Principes de conception"}
    };

    const LAWS = [
        {
            code: "01",
            name: "Attention sélective",
            cat: "decision",
            slug: "attention-selective",
            def: "On ne remarque qu’une partie des stimuli d’un écran, en général ceux liés à ce qu’on cherche à faire.",
            ex: "Un habitué du web ignore instinctivement tout ce qui ressemble à une bannière publicitaire, même utile."
        }, {
            code: "02",
            name: "Biais cognitif",
            cat: "decision",
            slug: "biais-cognitif",
            def: "Nos jugements suivent des raccourcis mentaux systématiques, pas toujours rationnels, qui influencent nos décisions.",
            ex: "Un utilisateur garde les réglages par défaut simplement parce qu’ils sont déjà cochés — le biais du statu quo."
        }, {
            code: "03",
            name: "Charge cognitive",
            cat: "memoire",
            slug: "charge-cognitive",
            def: "C’est l’effort mental nécessaire pour comprendre une interface&nbsp;; au-delà d’un certain seuil, l’utilisateur décroche.",
            ex: "Un tableau de bord qui affiche 40 indicateurs d’un coup demande plus d’effort qu’un tri par priorité."
        }, {
            code: "04",
            name: "Chunking",
            cat: "memoire",
            slug: "chunking",
            def: "Découper une masse d’information en petits groupes cohérents la rend plus facile à retenir et à traiter.",
            ex: "Un numéro de téléphone se lit mieux en blocs (06 12 34 56 78) que sous la forme d’un bloc de dix chiffres."
        }, {
            code: "05",
            name: "Effet de gradient d’objectif",
            cat: "decision",
            slug: "effet-gradient-objectif",
            def: "La motivation à atteindre un but augmente à mesure qu’on s’en rapproche, même si l’effort réel reste constant.",
            ex: "Une barre de fidélité déjà remplie à 80&nbsp;% pousse à finir ses achats pour débloquer la récompense."
        }, {
            code: "06",
            name: "Effet de position sérielle",
            cat: "memoire",
            slug: "effet-position-serielle",
            def: "Dans une liste, on retient mieux les premiers et les derniers éléments que ceux du milieu.",
            ex: "Les options les plus importantes d’un menu déroulant gagnent à être placées en tête ou en fin de liste."
        }, {
            code: "07",
            name: "Effet Esthétique-Utilisabilité",
            cat: "percept",
            slug: "effet-esthetique-usabilite",
            def: "Une interface soignée visuellement est perçue comme plus facile à utiliser, même quand ses fonctionnalités réelles n’ont pas changé.",
            ex: "Un formulaire bien aligné semble plus simple à remplir qu’un formulaire brouillon, à champs identiques."
        }, {
            code: "08",
            name: "Effet Von Restorff",
            cat: "memoire",
            slug: "effet-von-restorff",
            def: "Dans un ensemble d’éléments similaires, celui qui se distingue est celui dont on se souvient le mieux.",
            ex: "Le seul bouton coloré au milieu de boutons gris capte l’œil et reste en mémoire après la visite."
        }, {
            code: "09",
            name: "Effet Zeigarnik",
            cat: "memoire",
            slug: "effet-zeigarnik",
            def: "Une tâche interrompue ou inachevée reste plus longtemps en mémoire qu’une tâche terminée.",
            ex: "Une barre de progression de profil à 70&nbsp;% donne envie de revenir compléter les 30&nbsp;% restants."
        }, {
            code: "10",
            name: "Flow",
            cat: "decision",
            slug: "flow",
            def: "C’est l’état d’immersion totale dans une tâche, où l’effort semble juste et les distractions disparaissent.",
            ex: "Un jeu qui ajuste sa difficulté à mesure que le joueur progresse entretient cet état sans le rompre."
        }, {
            code: "11",
            name: "Loi de connexion uniforme",
            cat: "percept",
            slug: "loi-connexion-uniforme",
            def: "Des éléments reliés visuellement, par une ligne ou un fond commun, paraissent plus liés que des éléments isolés.",
            ex: "Une frise chronologique où une ligne traverse chaque étape rend la progression plus lisible qu’une simple liste."
        }, {
            code: "12",
            name: "Loi de Fitts",
            cat: "principes",
            slug: "loi-de-fitts",
            def: "Le temps pour atteindre une cible dépend de sa distance et de sa taille&nbsp;: plus elle est loin ou petite, plus c’est lent.",
            ex: "Un bouton d’action principal, large et proche du pouce, se touche plus vite qu’un lien minuscule en coin d’écran."
        }, {
            code: "13",
            name: "Loi de Hick",
            cat: "decision",
            slug: "loi-de-hick",
            def: "Plus il y a d’options, et plus elles sont complexes, plus la décision prend de temps.",
            ex: "Un menu de navigation à 5 rubriques claires se parcourt plus vite qu’un menu à 20 entrées mélangées."
        }, {
            code: "14",
            name: "Loi de Jakob",
            cat: "principes",
            slug: "loi-de-jakob",
            def: "Les utilisateurs passent le plus clair de leur temps sur d’autres sites&nbsp;: ils attendent que le vôtre fonctionne pareil.",
            ex: "Un logo cliquable en haut à gauche qui ramène à l’accueil, comme partout ailleurs, évite toute confusion."
        }, {
            code: "15",
            name: "Loi de la région commune",
            cat: "percept",
            slug: "loi-region-commune",
            def: "Des éléments regroupés dans une zone visuellement délimitée sont perçus comme liés, même sans autre indice.",
            ex: "Un encadré autour d’un formulaire indique d’un coup d’œil que ces champs forment un même bloc."
        }, {
            code: "16",
            name: "Loi de Miller",
            cat: "memoire",
            slug: "loi-de-miller",
            def: "La mémoire de travail ne retient en moyenne que 7 éléments à la fois, à deux près.",
            ex: "Un parcours de commande découpé en 4 étapes claires reste gérable, contrairement à un formulaire de 20 champs d’un bloc."
        }, {
            code: "17",
            name: "Loi de Parkinson",
            cat: "principes",
            slug: "loi-de-parkinson",
            def: "Une tâche s’étire pour occuper tout le temps qu’on lui accorde, même sans en avoir réellement besoin.",
            ex: "Fixer un délai de session de 10 minutes plutôt que 60 pousse à remplir un formulaire sans traîner."
        }, {
            code: "18",
            name: "Loi de Postel",
            cat: "principes",
            slug: "loi-de-postel",
            def: "Soyez tolérant sur ce que vous acceptez en entrée, rigoureux sur ce que vous produisez en sortie.",
            ex: "Un champ de téléphone qui accepte espaces, points ou tirets évite de bloquer l’utilisateur pour une erreur de format."
        }, {
            code: "19",
            name: "Loi de Prägnanz",
            cat: "percept",
            slug: "loi-de-pragnanz",
            def: "Face à une forme ambiguë, l’œil retient toujours l’interprétation la plus simple possible.",
            ex: "Cinq points alignés en arc sont perçus comme une courbe unique plutôt que cinq points isolés."
        }, {
            code: "20",
            name: "Loi de proximité",
            cat: "percept",
            slug: "loi-de-proximite",
            def: "Des objets rapprochés dans l’espace sont perçus comme un groupe, indépendamment de leur forme ou de leur couleur.",
            ex: "Un label collé à son champ de saisie est lu comme sa légende, pas comme un élément séparé."
        }, {
            code: "21",
            name: "Loi de similarité",
            cat: "percept",
            slug: "loi-de-similarite",
            def: "Des éléments qui se ressemblent par leur couleur, leur forme ou leur taille sont perçus comme appartenant au même ensemble.",
            ex: "Tous les liens en bleu souligné sont reconnus comme cliquables, même répartis dans toute la page."
        }, {
            code: "22",
            name: "Loi de Tesler",
            cat: "principes",
            slug: "loi-de-tesler",
            def: "Toute tâche a un niveau de complexité incompressible&nbsp;: elle ne disparaît pas, elle se déplace entre le système et l’utilisateur.",
            ex: "Un correcteur d’adresse automatique déplace la complexité du côté du système plutôt que de la laisser à l’utilisateur."
        }, {
            code: "23",
            name: "Mémoire de travail",
            cat: "memoire",
            slug: "memoire-de-travail",
            def: "C’est la mémoire à court terme qui retient temporairement les informations nécessaires pour réaliser une tâche en cours.",
            ex: "Garder le récapitulatif de commande visible évite à l’utilisateur de devoir se souvenir de ses choix précédents."
        }, {
            code: "24",
            name: "Modèle mental",
            cat: "decision",
            slug: "modele-mental",
            def: "C’est la représentation simplifiée qu’un utilisateur se fait du fonctionnement d’un système, à partir de son expérience passée.",
            ex: "Une corbeille à l’écran pour supprimer un fichier s’appuie sur un modèle mental déjà connu du bureau physique."
        }, {
            code: "25",
            name: "Paradoxe de l’utilisateur actif",
            cat: "decision",
            slug: "paradoxe-utilisateur-actif",
            def: "Personne ne lit le mode d’emploi&nbsp;: les utilisateurs se lancent directement dans l’interface, quitte à faire des erreurs.",
            ex: "Une interface doit rester compréhensible sans notice, avec des indices visibles directement à l’écran."
        }, {
            code: "26",
            name: "Principe de Pareto",
            cat: "principes",
            slug: "principe-de-pareto",
            def: "Environ 80&nbsp;% des usages viennent de 20&nbsp;% des fonctionnalités&nbsp;: mieux vaut soigner l’essentiel que tout traiter à égalité.",
            ex: "Optimiser en priorité le tunnel d’achat plutôt qu’une page FAQ peu consultée rapporte davantage de résultats."
        }, {
            code: "27",
            name: "Rasoir d’Occam",
            cat: "principes",
            slug: "rasoir-doccam",
            def: "Entre deux solutions qui répondent aussi bien au besoin, la plus simple est presque toujours la meilleure.",
            ex: "Un formulaire d’inscription à 3 champs convertit mieux qu’un formulaire à 10 champs pour le même objectif."
        }, {
            code: "28",
            name: "Règle du pic et de la fin",
            cat: "decision",
            slug: "regle-pic-et-fin",
            def: "On juge une expérience surtout sur son moment le plus fort et sur la façon dont elle se termine, pas sur sa moyenne.",
            ex: "Un message de confirmation soigné après un achat laisse un bon souvenir, même si le parcours avant l’était moins."
        }, {
            code: "29",
            name: "Seuil de Doherty",
            cat: "principes",
            slug: "seuil-de-doherty",
            def: "Un système qui répond en moins de 400 ms maintient l’attention&nbsp;; au-delà, la productivité et l’engagement chutent.",
            ex: "Un indicateur de frappe instantané garde une conversation fluide, contrairement à un chat qui traîne à charger."
        }, {
            code: "30",
            name: "Surcharge de choix",
            cat: "decision",
            slug: "surcharge-de-choix",
            def: "Trop d’options présentées à la fois ralentit la décision et peut pousser à l’abandon plutôt qu’au choix.",
            ex: "Une carte de restaurant de 80 plats fatigue plus qu’une sélection de 12 suggestions du chef."
        }
    ];

    function cardHTML(law) {
        const cat = CATS[law.cat];
        return "" +
            '<a class="LawCard" href="ux/laws/">' +
                '<img class="CardCover" src="img/ux/laws/' + law.slug + '.png" alt="' + law.name + '" loading="lazy" onerror="this.onerror=null;this.src=\'assets/og-preview.png\';">' +
                '<span class="CardTop"><span class="Category">' + cat.label + '</span><span class="Code">UX n°' + law.code + '</span></span>' +
                "<h3>" + law.name + "</h3>" +
                "<p>" + law.def + "</p>" +
                '<span class="CardFooter">Voir la fiche <span class="Arrow">→</span></span>' +
            "</a>";
    }

    function relatedCardHTML(law) {
        return '<a class="Card RelatedCard" href="' + law.slug + '/">' +
            '<span class="RelatedCode">UX·' + law.code + '</span>' +
            "<h3>" + law.name + "</h3>" +
            "<p>" + law.def + "</p>" +
        "</a>";
    }

    function pageNavHTML(prevLaw, nextLaw) {
        return '<a href="' + prevLaw.slug + '.html" class="PageNavLink Prev">← ' + prevLaw.name + '</a>' +
            '<a href="../comprendre-ux.html#catalogue" class="PageNavLink Home">Toutes les lois</a>' +
            '<a href="' + nextLaw.slug + '.html" class="PageNavLink Next">' + nextLaw.name + ' →</a>';
    }

    window.LennouilleUX = {laws: LAWS, cats: CATS, cardHTML: cardHTML, relatedCardHTML: relatedCardHTML, pageNavHTML: pageNavHTML};

    const grid = document.getElementById("grid");

    if (grid) {
        const searchInput = document.getElementById("search");
        const tabs = Array.from(document.querySelectorAll(".Tab"));
        let activeCat = "all";
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function filtered() {
            const term = searchInput.value.trim().toLowerCase();
            return LAWS.filter(function (law) {
                const catOk = activeCat === "all" || law.cat === activeCat;
                const textOk = !term || law.name.toLowerCase().indexOf(term) !== -1 ||
                    law.def.toLowerCase().indexOf(term) !== -1;
                return catOk && textOk;
            });
        }

        function render() {
            const list = filtered();
            grid.innerHTML = list.length
                ? list.map(cardHTML).join("")
                : '<p class="Empty">Aucune fiche ne correspond à cette recherche.</p>';
            observeCards();
        }

        const io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    io.unobserve(entry.target);
                }
            });
        }, {threshold: 0.12}) : null;

        function observeCards() {
            const cards = grid.querySelectorAll(".LawCard");
            cards.forEach(function (card) {
                if (reduceMotion || !io) {
                    card.classList.add("in-view");
                } else {
                    io.observe(card);
                }
            });
        }

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                tabs.forEach(function (t) {t.classList.remove("active"); t.setAttribute("aria-pressed", "false");});
                tab.classList.add("active");
                tab.setAttribute("aria-pressed", "true");
                activeCat = tab.getAttribute("data-cat");
                render();
            });
        });

        searchInput.addEventListener("input", render);

        render();
    }

    const currentSlug = (window.location.pathname.split("/").pop() || "").replace(/\.html$/, "");
    const currentLaw = LAWS.find(function (law) { return law.slug === currentSlug; });

    if (currentLaw) {
        const relatedGrid = document.querySelector(".RelatedGrid");
        if (relatedGrid) {
            const sameCat = LAWS.filter(function (law) {return law.cat === currentLaw.cat;});
            const idx = sameCat.indexOf(currentLaw);
            const picks = [1, 2, 3].map(function (offset) {return sameCat[(idx + offset) % sameCat.length];});
            relatedGrid.innerHTML = picks.map(relatedCardHTML).join("");
        }

        const pageNav = document.querySelector(".PageNav");
        if (pageNav) {
            const idx = LAWS.indexOf(currentLaw);
            const prevLaw = LAWS[(idx - 1 + LAWS.length) % LAWS.length];
            const nextLaw = LAWS[(idx + 1) % LAWS.length];
            pageNav.innerHTML = pageNavHTML(prevLaw, nextLaw);
        }
    }
})();