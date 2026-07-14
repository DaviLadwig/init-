document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const indicator = document.getElementById("navIndicator");

    const desktopLinks = Array.from(
        document.querySelectorAll(".floating-nav__link")
    );

    const mobileLinks = Array.from(
        document.querySelectorAll(
            ".mobile-menu__link, .mobile-menu__contact"
        )
    );

    const sections = Array.from(
        document.querySelectorAll("section[id]")
    );

    /*
     * Controle do comportamento de ocultar e exibir o header.
     */
    let lastScrollPosition = window.scrollY;
    let scrollTicking = false;

    /*
     * Evita que pequenos movimentos do scroll façam
     * o header ficar aparecendo e desaparecendo.
     */
    const scrollTolerance = 8;

    /*
     * O header só poderá ser ocultado depois
     * que o usuário ultrapassar esta posição.
     */
    const hideAfter = 130;

    /* =====================================================
       ESTADO VISUAL DO HEADER
    ===================================================== */

    function updateHeaderScrolledState(scrollPosition) {
        if (!header) {
            return;
        }

        header.classList.toggle(
            "is-scrolled",
            scrollPosition > 30
        );
    }

    function showHeader() {
        if (!header) {
            return;
        }

        header.classList.remove("is-hidden");
    }

    function hideHeader() {
        if (!header) {
            return;
        }

        /*
         * Não esconde o header enquanto
         * o menu mobile estiver aberto.
         */
        if (document.body.classList.contains("menu-open")) {
            return;
        }

        header.classList.add("is-hidden");
    }

    function updateHeaderVisibility(scrollPosition) {
        if (!header) {
            return;
        }

        const scrollDifference =
            scrollPosition - lastScrollPosition;

        /*
         * No começo da página, o header fica sempre visível.
         */
        if (scrollPosition <= hideAfter) {
            showHeader();
            lastScrollPosition = scrollPosition;
            return;
        }

        /*
         * Ignora pequenos movimentos para evitar oscilações.
         */
        if (Math.abs(scrollDifference) < scrollTolerance) {
            return;
        }

        if (scrollDifference > 0) {
            /*
             * Rolando para baixo.
             */
            hideHeader();
        } else {
            /*
             * Rolando para cima.
             */
            showHeader();
        }

        lastScrollPosition = scrollPosition;
    }

    /* =====================================================
       INDICADOR DA NAVEGAÇÃO
    ===================================================== */

    function positionIndicator(activeLink) {
        if (!activeLink || !indicator) {
            return;
        }

        indicator.style.width = `${activeLink.offsetWidth}px`;

        indicator.style.transform =
            `translateX(${activeLink.offsetLeft - 5}px)`;

        indicator.style.opacity = "1";
    }

    function setActiveLink(sectionId) {
        desktopLinks.forEach((link) => {
            const linkTarget = link.getAttribute("href");
            const isActive = linkTarget === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                positionIndicator(link);
            }
        });
    }

    function updateActiveSection() {
        if (!sections.length) {
            return;
        }

        const referencePosition =
            window.scrollY + window.innerHeight * 0.32;

        let currentSection = sections[0].id;

        sections.forEach((section) => {
            if (referencePosition >= section.offsetTop) {
                currentSection = section.id;
            }
        });

        setActiveLink(currentSection);
    }

    /* =====================================================
       MENU MOBILE
    ===================================================== */

    function openMobileMenu() {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        /*
         * Garante que o header reapareça antes
         * da abertura do menu.
         */
        showHeader();

        menuToggle.classList.add("is-active");
        mobileMenu.classList.add("is-open");
        document.body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu");
    }

    function closeMobileMenu() {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        menuToggle.classList.remove("is-active");
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    }

    menuToggle?.addEventListener("click", () => {
        const menuIsOpen =
            mobileMenu?.classList.contains("is-open");

        if (menuIsOpen) {
            closeMobileMenu();
            return;
        }

        openMobileMenu();
    });

    [...desktopLinks, ...mobileLinks].forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
            showHeader();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    /* =====================================================
       EVENTO DE SCROLL
    ===================================================== */

    window.addEventListener(
        "scroll",
        () => {
            if (scrollTicking) {
                return;
            }

            scrollTicking = true;

            window.requestAnimationFrame(() => {
                const currentScrollPosition = window.scrollY;

                updateHeaderScrolledState(
                    currentScrollPosition
                );

                updateHeaderVisibility(
                    currentScrollPosition
                );

                updateActiveSection();

                scrollTicking = false;
            });
        },
        {
            passive: true
        }
    );

    /* =====================================================
       REDIMENSIONAMENTO
    ===================================================== */

    window.addEventListener("resize", () => {
        const activeLink = document.querySelector(
            ".floating-nav__link.active"
        );

        positionIndicator(activeLink);

        if (window.innerWidth > 1100) {
            closeMobileMenu();
        }

        /*
         * Reexibe o header ao alterar a largura da tela.
         */
        showHeader();
    });

    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    updateHeaderScrolledState(window.scrollY);
    updateActiveSection();

    const initialActiveLink = document.querySelector(
        ".floating-nav__link.active"
    );

    window.requestAnimationFrame(() => {
        positionIndicator(initialActiveLink);
    });
});