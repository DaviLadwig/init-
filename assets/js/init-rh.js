"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("rhLoader");
    const header = document.getElementById("rhHeader");
    const menuToggle = document.getElementById("rhMenuToggle");
    const navigation = document.getElementById("rhNavigation");
    const navigationLinks = navigation
        ? navigation.querySelectorAll("a")
        : [];

    /*
     * Entrada curta e comercial.
     */
    window.setTimeout(() => {
        loader?.classList.add("is-finished");
    }, 1350);

    window.setTimeout(() => {
        loader?.remove();
    }, 2000);

    /*
     * Header ao rolar.
     */
    function updateHeader() {
        header?.classList.toggle(
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
     * Menu mobile.
     */
    function closeMenu() {
        menuToggle?.classList.remove("is-active");
        navigation?.classList.remove("is-open");
        document.body.classList.remove("menu-open");

        menuToggle?.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    menuToggle?.addEventListener("click", () => {
        const menuIsOpen =
            navigation?.classList.toggle("is-open") ?? false;

        menuToggle.classList.toggle(
            "is-active",
            menuIsOpen
        );

        document.body.classList.toggle(
            "menu-open",
            menuIsOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(menuIsOpen)
        );
    });

    navigationLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1150) {
            closeMenu();
        }
    });
});