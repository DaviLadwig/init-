document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) {
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");

            /*
             * Depois que o elemento aparece pela primeira vez,
             * ele deixa de ser observado.
             */
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
});