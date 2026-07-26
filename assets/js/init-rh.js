"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("rhHeader");
    const hero = document.querySelector(".rh-hero");
    const visual = document.getElementById("rhHeroVisual");
    const brandCard = document.querySelector(".rh-brand-card");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    /*
     * Remove a entrada do documento depois que
     * todas as animações forem concluídas.
     */
    const intro = document.getElementById("rhIntro");

    if (intro) {
        window.setTimeout(() => {
            intro.remove();
        }, 5600);
    }

    /*
     * Header compacto ao rolar a página.
     */
    function updateHeader() {
        if (!header) {
            return;
        }

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 24
        );
    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    /*
     * Iluminação do hero seguindo o ponteiro.
     */
    function updateHeroSpotlight(event) {
        if (!hero || reducedMotion.matches) {
            return;
        }

        const bounds = hero.getBoundingClientRect();

        const x =
            ((event.clientX - bounds.left) / bounds.width) * 100;

        const y =
            ((event.clientY - bounds.top) / bounds.height) * 100;

        hero.style.setProperty(
            "--rh-mouse-x",
            `${x.toFixed(2)}%`
        );

        hero.style.setProperty(
            "--rh-mouse-y",
            `${y.toFixed(2)}%`
        );
    }

    if (hero) {
        hero.addEventListener(
            "pointermove",
            updateHeroSpotlight
        );
    }

    /*
     * Movimento tridimensional discreto no card da logo.
     */
    function moveBrandCard(event) {
        if (
            !visual ||
            !brandCard ||
            reducedMotion.matches ||
            window.innerWidth <= 1100
        ) {
            return;
        }

        const bounds = visual.getBoundingClientRect();

        const horizontal =
            (event.clientX - bounds.left) / bounds.width - 0.5;

        const vertical =
            (event.clientY - bounds.top) / bounds.height - 0.5;

        const rotateY = horizontal * 5;
        const rotateX = vertical * -4;

        brandCard.style.transform = `
            perspective(1100px)
            rotateX(${rotateX.toFixed(2)}deg)
            rotateY(${rotateY.toFixed(2)}deg)
        `;
    }

    function resetBrandCard() {
        if (!brandCard) {
            return;
        }

        brandCard.style.transform = "";
    }

    if (visual) {
        visual.addEventListener(
            "pointermove",
            moveBrandCard
        );

        visual.addEventListener(
            "pointerleave",
            resetBrandCard
        );
    }

    /*
     * Remove o movimento caso o usuário altere
     * a preferência de acessibilidade.
     */
    reducedMotion.addEventListener?.(
        "change",
        resetBrandCard
    );
});