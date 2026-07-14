document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("solutionsTrack");
    const previousButton = document.getElementById("solutionsPrev");
    const nextButton = document.getElementById("solutionsNext");

    const progress = document.getElementById("solutionsProgress");
    const currentElement = document.getElementById("solutionsCurrent");
    const totalElement = document.getElementById("solutionsTotal");

    if (!track) {
        return;
    }

    const cards = Array.from(
        track.querySelectorAll(".solution-card")
    );

    let isDragging = false;
    let dragStartX = 0;
    let initialScrollLeft = 0;
    let hasDragged = false;

    function formatNumber(number) {
        return String(number).padStart(2, "0");
    }

    function getCardStep() {
        const firstCard = cards[0];

        if (!firstCard) {
            return track.clientWidth;
        }

        const trackStyles = window.getComputedStyle(track);
        const gap = Number.parseFloat(trackStyles.columnGap) || 0;

        return firstCard.offsetWidth + gap;
    }

    function getCurrentIndex() {
        const step = getCardStep();

        if (!step) {
            return 0;
        }

        return Math.min(
            cards.length - 1,
            Math.max(0, Math.round(track.scrollLeft / step))
        );
    }

    function updateSliderStatus() {
        const currentIndex = getCurrentIndex();
        const maximumScroll = track.scrollWidth - track.clientWidth;

        const scrollPercentage =
            maximumScroll > 0
                ? track.scrollLeft / maximumScroll
                : 0;

        const minimumProgress = 1 / cards.length;
        const progressValue =
            minimumProgress +
            scrollPercentage * (1 - minimumProgress);

        if (progress) {
            progress.style.width = `${progressValue * 100}%`;
        }

        if (currentElement) {
            currentElement.textContent = formatNumber(currentIndex + 1);
        }

        if (totalElement) {
            totalElement.textContent = formatNumber(cards.length);
        }

        if (previousButton) {
            previousButton.disabled = track.scrollLeft <= 4;
        }

        if (nextButton) {
            nextButton.disabled =
                track.scrollLeft >= maximumScroll - 4;
        }
    }

    function scrollCards(direction) {
        const step = getCardStep();

        track.scrollBy({
            left: step * direction,
            behavior: "smooth"
        });
    }

    previousButton?.addEventListener("click", () => {
        scrollCards(-1);
    });

    nextButton?.addEventListener("click", () => {
        scrollCards(1);
    });

    track.addEventListener(
        "scroll",
        updateSliderStatus,
        { passive: true }
    );

    track.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") {
            return;
        }

        isDragging = true;
        hasDragged = false;

        dragStartX = event.clientX;
        initialScrollLeft = track.scrollLeft;

        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
    });

    track.addEventListener("pointermove", (event) => {
        if (!isDragging) {
            return;
        }

        const distance = event.clientX - dragStartX;

        if (Math.abs(distance) > 5) {
            hasDragged = true;
        }

        track.scrollLeft = initialScrollLeft - distance;
    });

    function stopDragging(event) {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        track.classList.remove("is-dragging");

        if (
            event.pointerId !== undefined &&
            track.hasPointerCapture(event.pointerId)
        ) {
            track.releasePointerCapture(event.pointerId);
        }
    }

    track.addEventListener("pointerup", stopDragging);
    track.addEventListener("pointercancel", stopDragging);
    track.addEventListener("pointerleave", stopDragging);

    track.addEventListener(
        "click",
        (event) => {
            if (hasDragged) {
                event.preventDefault();
                event.stopPropagation();
                hasDragged = false;
            }
        },
        true
    );

    track.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollCards(1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollCards(-1);
        }
    });

    window.addEventListener("resize", updateSliderStatus);

    updateSliderStatus();
});