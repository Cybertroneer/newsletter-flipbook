const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;
const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");


// --------------------------------------------------
// DEVICE
// --------------------------------------------------

const isMobile = window.innerWidth < 768;


// --------------------------------------------------
// PAGE DENSITY
// --------------------------------------------------

pages.forEach((page, index) => {

    if (isMobile) {

        // MOBILE
        // Every page is soft.
        // This gives the mobile newsletter a consistent
        // flexible-page animation.

        page.removeAttribute("data-density");

    } else {

        // DESKTOP / TABLET
        // First and last pages are physical covers.

        if (index === 0 || index === pages.length - 1) {

            page.setAttribute("data-density", "hard");

        } else {

            page.removeAttribute("data-density");

        }
    }
});


// --------------------------------------------------
// CALCULATE PAGE SIZE
// --------------------------------------------------

function calculatePageSize() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const availableWidth = vw * 0.95;
    const availableHeight = vh * 0.95;

    let pageWidth;
    let pageHeight;


    if (vw < 768) {

        // ------------------------------------------
        // MOBILE
        // ONE PAGE
        // ------------------------------------------

        pageWidth = availableWidth;
        pageHeight = pageWidth / PAGE_RATIO;

        if (pageHeight > availableHeight) {

            pageHeight = availableHeight;
            pageWidth = pageHeight * PAGE_RATIO;

        }

    } else {

        // ------------------------------------------
        // TABLET / DESKTOP
        // TWO PAGE SPREAD
        // ------------------------------------------

        pageWidth = availableWidth / 2;
        pageHeight = pageWidth / PAGE_RATIO;

        if (pageHeight > availableHeight) {

            pageHeight = availableHeight;
            pageWidth = pageHeight * PAGE_RATIO;

        }
    }


    return {
        width: Math.floor(pageWidth),
        height: Math.floor(pageHeight)
    };
}


const size = calculatePageSize();


// --------------------------------------------------
// STPAGEFLIP
// --------------------------------------------------

const pageFlip = new St.PageFlip(
    book,
    {

        width: size.width,
        height: size.height,

        size: "stretch",

        minWidth: 360,
        maxWidth: 2000,

        minHeight: 500,
        maxHeight: 3000,

        // Automatically switch between:
        //
        // Desktop / Tablet → two pages
        // Mobile            → one page
        //
        usePortrait: true,

        autoSize: false,

        // We control hard/soft pages ourselves.
        showCover: false,

        // Flip animation speed.
        flippingTime: 750,

        drawShadow: true,
        maxShadowOpacity: 0.4,

        mobileScrollSupport: true,

        useMouseEvents: true,

        disableFlipByClick: false
    }
);


// --------------------------------------------------
// LOAD PAGES
// --------------------------------------------------

pageFlip.loadFromHTML(pages);


// --------------------------------------------------
// MOBILE BACKWARD-FLIP FIX
// --------------------------------------------------

/*
 * StPageFlip 2.0.7 intentionally skips drawing the
 * bottom page when:
 *
 *      orientation = PORTRAIT
 *      direction  = BACK
 *
 * This causes the backward mobile animation to appear
 * like a flat sheet instead of the soft fold.
 *
 * We override ONLY drawBottomPage().
 *
 * Desktop / tablet behavior remains untouched.
 */

if (isMobile) {

    const render = pageFlip.getRender();

    // Save the original renderer method.
    const originalDrawBottomPage =
        render.drawBottomPage.bind(render);


    render.drawBottomPage = function () {

        // If there is no bottom page, do nothing.
        if (this.bottomPage === null) {
            return;
        }


        /*
         * Get the density of the page currently
         * being flipped.
         *
         * On mobile this will be SOFT.
         */
        const tempDensity =
            this.flippingPage != null
                ? this.flippingPage.getDrawingDensity()
                : null;


        /*
         * Put the bottom page behind the flipping page.
         *
         * StPageFlip normally does this itself, but
         * skips the entire operation during a portrait
         * BACK flip.
         */
        this.bottomPage
            .getElement()
            .style.zIndex = (
                this.getSettings().startZIndex + 3
            ).toString(10);


        /*
         * Draw the underlying page.
         *
         * THIS is the important fix.
         *
         * The previous page is now present underneath
         * the soft flipping page, allowing StPageFlip's
         * normal fold geometry to remain visible.
         */
        this.bottomPage.draw(tempDensity);
    };
}
