const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;
const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

const book = document.getElementById("book");
const pages = Array.from(document.querySelectorAll(".page"));

const MOBILE_BREAKPOINT = 768;

let pageFlip = null;
let mobileMode = false;
let mobileIndex = 0;
let mobileBusy = false;


// ==================================================
// DEVICE
// ==================================================

function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}


// ==================================================
// PAGE SIZE
// ==================================================

function calculatePageSize() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const availableWidth = vw * 0.95;
    const availableHeight = vh * 0.95;

    let width;
    let height;

    if (vw < MOBILE_BREAKPOINT) {

        // -------------------------------
        // MOBILE = ONE PAGE
        // -------------------------------

        width = availableWidth;
        height = width / PAGE_RATIO;

        if (height > availableHeight) {
            height = availableHeight;
            width = height * PAGE_RATIO;
        }

    } else {

        // -------------------------------
        // TABLET / DESKTOP = TWO PAGES
        // -------------------------------

        width = availableWidth / 2;
        height = width / PAGE_RATIO;

        if (height > availableHeight) {
            height = availableHeight;
            width = height * PAGE_RATIO;
        }
    }

    return {
        width: Math.floor(width),
        height: Math.floor(height)
    };
}


// ==================================================
// MOBILE CSS
// ==================================================

function injectMobileCSS() {

    if (document.getElementById("mobile-flip-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "mobile-flip-styles";

    style.textContent = `

        #mobile-book {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            perspective: 1800px;
        }

        .mobile-page {
            position: absolute;
            overflow: hidden;

            background: #ffffff;

            transform-style: preserve-3d;

            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;

            will-change: transform, clip-path;
        }

        .mobile-page img {
            position: absolute;

            left: 0;
            top: 0;

            width: 100%;
            height: 100%;

            object-fit: contain;

            user-select: none;
            pointer-events: none;

            -webkit-user-drag: none;
        }

        /*
         * Individual vertical strips create the
         * soft/curling appearance rather than a
         * single rigid rotateY sheet.
         */

        .mobile-strip {
            position: absolute;

            top: 0;

            height: 100%;

            overflow: hidden;

            transform-style: preserve-3d;

            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;

            will-change: transform;
        }

        .mobile-strip img {
            position: absolute;

            top: 0;

            height: 100%;

            max-width: none;

            object-fit: fill;

            pointer-events: none;
            user-select: none;

            -webkit-user-drag: none;
        }

        /*
         * Prevent accidental selection while
         * dragging/flipping.
         */

        #mobile-book,
        #mobile-book * {
            user-select: none;
            -webkit-user-select: none;
        }

    `;

    document.head.appendChild(style);
}


// ==================================================
// CREATE MOBILE BOOK
// ==================================================

function createMobileBook() {

    injectMobileCSS();

    mobileMode = true;
    mobileIndex = 0;
    mobileBusy = false;

    // Hide original StPageFlip book.
    book.style.display = "none";

    // Remove old mobile book if one exists.
    const oldBook = document.getElementById("mobile-book");

    if (oldBook) {
        oldBook.remove();
    }

    const mobileBook = document.createElement("div");

    mobileBook.id = "mobile-book";

    document.body.appendChild(mobileBook);

    renderMobilePage();

    setupMobileControls();
}


// ==================================================
// GET IMAGE SOURCE
// ==================================================

function getPageImage(index) {

    if (!pages[index]) {
        return null;
    }

    const img = pages[index].querySelector("img");

    return img ? img.src : null;
}


// ==================================================
// GET MOBILE PAGE SIZE
// ==================================================

function getMobileDimensions() {

    const size = calculatePageSize();

    return {
        width: size.width,
        height: size.height
    };
}


// ==================================================
// RENDER CURRENT PAGE
// ==================================================

function renderMobilePage() {

    const mobileBook = document.getElementById("mobile-book");

    if (!mobileBook) {
        return;
    }

    mobileBook.innerHTML = "";

    const dimensions = getMobileDimensions();

    const page = document.createElement("div");

    page.className = "mobile-page";

    page.style.width = dimensions.width + "px";
    page.style.height = dimensions.height + "px";

    const img = document.createElement("img");

    img.src = getPageImage(mobileIndex);

    page.appendChild(img);

    mobileBook.appendChild(page);
}


// ==================================================
// CREATE FLIPPING SHEET
// ==================================================

function createFlipSheet(imageSrc, direction) {

    const mobileBook = document.getElementById("mobile-book");

    const dimensions = getMobileDimensions();

    const sheet = document.createElement("div");

    sheet.className = "mobile-page";

    sheet.style.width = dimensions.width + "px";
    sheet.style.height = dimensions.height + "px";

    /*
     * Put the sheet above the stationary page.
     */

    sheet.style.zIndex = "20";

    mobileBook.appendChild(sheet);


    // ------------------------------------------------
    // NUMBER OF VERTICAL STRIPS
    // ------------------------------------------------

    const STRIPS = 32;


    for (let i = 0; i < STRIPS; i++) {

        const strip = document.createElement("div");

        strip.className = "mobile-strip";

        const left = (i / STRIPS) * 100;
        const width = (1 / STRIPS) * 100;

        strip.style.left = left + "%";
        strip.style.width = width + "%";


        const img = document.createElement("img");

        img.src = imageSrc;

        /*
         * Every strip shows the correct portion
         * of the complete page image.
         */

        img.style.width = dimensions.width + "px";

        img.style.left =
            -(i / STRIPS) * dimensions.width + "px";

        strip.appendChild(img);

        sheet.appendChild(strip);
    }


    return sheet;
}


// ==================================================
// SOFT FORWARD FLIP
// ==================================================

function flipForward() {

    if (mobileBusy) {
        return;
    }

    if (mobileIndex >= pages.length - 1) {
        return;
    }

    mobileBusy = true;

    const mobileBook = document.getElementById("mobile-book");

    const currentPage = mobileBook.querySelector(".mobile-page");

    const nextIndex = mobileIndex + 1;

    const nextPage = document.createElement("div");

    nextPage.className = "mobile-page";

    const dimensions = getMobileDimensions();

    nextPage.style.width = dimensions.width + "px";
    nextPage.style.height = dimensions.height + "px";

    nextPage.style.zIndex = "5";

    const nextImg = document.createElement("img");

    nextImg.src = getPageImage(nextIndex);

    nextPage.appendChild(nextImg);

    mobileBook.appendChild(nextPage);


    /*
     * Current page becomes the soft flipping sheet.
     */

    const sheet = createFlipSheet(
        getPageImage(mobileIndex),
        "forward"
    );

    currentPage.style.visibility = "hidden";


    animateSoftFlip(
        sheet,
        "forward",
        () => {

            mobileIndex = nextIndex;

            renderMobilePage();

            mobileBusy = false;
        }
    );
}


// ==================================================
// SOFT BACKWARD FLIP
// ==================================================

function flipBackward() {

    if (mobileBusy) {
        return;
    }

    if (mobileIndex <= 0) {
        return;
    }

    mobileBusy = true;

    const mobileBook = document.getElementById("mobile-book");

    const currentPage = mobileBook.querySelector(".mobile-page");

    const previousIndex = mobileIndex - 1;

    /*
     * Put the previous page underneath FIRST.
     *
     * This is the crucial difference from the
     * StPageFlip portrait BACK renderer.
     */

    const previousPage = document.createElement("div");

    previousPage.className = "mobile-page";

    const dimensions = getMobileDimensions();

    previousPage.style.width = dimensions.width + "px";
    previousPage.style.height = dimensions.height + "px";

    previousPage.style.zIndex = "5";

    const previousImg = document.createElement("img");

    previousImg.src = getPageImage(previousIndex);

    previousPage.appendChild(previousImg);

    mobileBook.appendChild(previousPage);


    /*
     * Current page becomes the soft flipping sheet.
     */

    const sheet = createFlipSheet(
        getPageImage(mobileIndex),
        "backward"
    );

    currentPage.style.visibility = "hidden";


    animateSoftFlip(
        sheet,
        "backward",
        () => {

            mobileIndex = previousIndex;

            renderMobilePage();

            mobileBusy = false;
        }
    );
}


// ==================================================
// SOFT PAGE ANIMATION
// ==================================================

function animateSoftFlip(sheet, direction, finished) {

    const strips =
        Array.from(sheet.querySelectorAll(".mobile-strip"));

    const duration = 720;

    const startTime = performance.now();


    function animate(now) {

        const elapsed = now - startTime;

        let progress = elapsed / duration;

        if (progress > 1) {
            progress = 1;
        }


        /*
         * Smooth acceleration/deceleration.
         */

        const eased =
            progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;


        strips.forEach((strip, index) => {

            const position =
                index / (strips.length - 1);


            /*
             * The sine curve produces a gentle
             * bulge through the page rather than
             * making it behave like one rigid sheet.
             */

            const curve =
                Math.sin(position * Math.PI) *
                Math.sin(eased * Math.PI) *
                22;


            let angle;


            if (direction === "forward") {

                /*
                 * RIGHT → LEFT
                 */

                angle =
                    -180 * eased +
                    curve;

            } else {

                /*
                 * LEFT → RIGHT
                 *
                 * Exact reverse of the forward
                 * animation.
                 */

                angle =
                    180 * eased -
                    curve;
            }


            /*
             * Slight depth movement.
             */

            const depth =
                Math.sin(eased * Math.PI) *
                Math.sin(position * Math.PI) *
                18;


            strip.style.transform =
                `translateZ(${depth}px) rotateY(${angle}deg)`;

        });


        /*
         * Slight perspective/scale change gives
         * the page a more physical feel.
         */

        const scale =
            1 - Math.sin(eased * Math.PI) * 0.015;

        sheet.style.transform =
            `scaleX(${scale})`;


        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            sheet.remove();

            finished();
        }
    }


    requestAnimationFrame(animate);
}


// ==================================================
// MOBILE CLICK CONTROLS
// ==================================================

function setupMobileControls() {

    const mobileBook = document.getElementById("mobile-book");

    if (!mobileBook) {
        return;
    }


    mobileBook.addEventListener("click", function (event) {

        if (mobileBusy) {
            return;
        }


        const rect =
            mobileBook.getBoundingClientRect();


        const clickX =
            event.clientX - rect.left;


        const middle =
            rect.width / 2;


        /*
         * RIGHT HALF = NEXT PAGE
         * LEFT HALF  = PREVIOUS PAGE
         */

        if (clickX > middle) {

            flipForward();

        } else {

            flipBackward();

        }

    });


    // ------------------------------------------------
    // TOUCH SWIPE
    // ------------------------------------------------

    let touchStartX = null;


    mobileBook.addEventListener(
        "touchstart",
        function (event) {

            if (!event.touches.length) {
                return;
            }

            touchStartX =
                event.touches[0].clientX;

        },
        { passive: true }
    );


    mobileBook.addEventListener(
        "touchend",
        function (event) {

            if (
                touchStartX === null ||
                !event.changedTouches.length
            ) {
                return;
            }


            const touchEndX =
                event.changedTouches[0].clientX;


            const difference =
                touchEndX - touchStartX;


            touchStartX = null;


            /*
             * Swipe LEFT → NEXT
             */

            if (difference < -40) {

                flipForward();

            }


            /*
             * Swipe RIGHT → PREVIOUS
             */

            else if (difference > 40) {

                flipBackward();

            }

        },
        { passive: true }
    );
}


// ==================================================
// DESKTOP / TABLET STPAGEFLIP
// ==================================================

function createDesktopBook() {

    mobileMode = false;

    const mobileBook =
        document.getElementById("mobile-book");

    if (mobileBook) {
        mobileBook.remove();
    }

    book.style.display = "block";


    // ------------------------------------------------
    // PAGE DENSITY
    // ------------------------------------------------

    pages.forEach((page, index) => {

        if (index === 0 || index === pages.length - 1) {

            page.setAttribute("data-density", "hard");

        } else {

            page.removeAttribute("data-density");

        }
    });


    const size = calculatePageSize();


    // ------------------------------------------------
    // STPAGEFLIP
    // ------------------------------------------------

    pageFlip = new St.PageFlip(
        book,
        {

            width: size.width,
            height: size.height,

            size: "stretch",

            minWidth: 360,
            maxWidth: 2000,

            minHeight: 500,
            maxHeight: 3000,

            /*
             * Desktop/tablet can use landscape
             * two-page spreads.
             */

            usePortrait: true,

            autoSize: false,

            showCover: false,

            flippingTime: 750,

            drawShadow: true,

            maxShadowOpacity: 0.4,

            mobileScrollSupport: true,

            useMouseEvents: true,

            disableFlipByClick: false
        }
    );


    pageFlip.loadFromHTML(pages);
}


// ==================================================
// INITIALIZE
// ==================================================

function initializeFlipbook() {

    if (isMobile()) {

        createMobileBook();

    } else {

        createDesktopBook();

    }
}


initializeFlipbook();


// ==================================================
// RESPONSIVE MODE SWITCHING
// ==================================================

let resizeTimer = null;

window.addEventListener("resize", function () {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {

        const shouldBeMobile = isMobile();

        if (shouldBeMobile !== mobileMode) {

            /*
             * Reload the page when crossing the
             * mobile/desktop breakpoint.
             *
             * This prevents two different rendering
             * engines from existing simultaneously.
             */

            window.location.reload();

        }

    }, 250);

});
