const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;
const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");


// --------------------------------------------------
// Detect device mode
// --------------------------------------------------

function isMobileDevice() {
    return window.innerWidth < 768;
}


// --------------------------------------------------
// Apply page density according to device
// --------------------------------------------------

function setPageDensity() {

    const mobile = isMobileDevice();

    pages.forEach((page, index) => {

        /*
         * MOBILE
         * -------
         * All pages become soft.
         *
         * This prevents the hard-cover 3D geometry
         * from producing the vertical jump seen
         * during the portrait flip.
         */
        if (mobile) {

            page.setAttribute("data-density", "soft");

        }

        /*
         * DESKTOP / TABLET
         * ----------------
         * Only the first and last pages behave
         * as physical covers.
         */
        else {

            if (index === 0 || index === pages.length - 1) {
                page.setAttribute("data-density", "hard");
            } else {
                page.setAttribute("data-density", "soft");
            }

        }

    });
}


// Apply density BEFORE StPageFlip loads the pages
setPageDensity();


// --------------------------------------------------
// Calculate page dimensions
// --------------------------------------------------

function calculatePageSize() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const availableWidth = vw * 0.95;
    const availableHeight = vh * 0.95;

    const mobile = vw < 768;

    let pageWidth;
    let pageHeight;


    if (mobile) {

        // ------------------------------------------
        // MOBILE = ONE PAGE
        // ------------------------------------------

        pageWidth = availableWidth;

        pageHeight = pageWidth / PAGE_RATIO;

        if (pageHeight > availableHeight) {

            pageHeight = availableHeight;
            pageWidth = pageHeight * PAGE_RATIO;

        }

    } else {

        // ------------------------------------------
        // TABLET / DESKTOP = TWO PAGE SPREAD
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
// Create flipbook
// --------------------------------------------------

const pageFlip = new St.PageFlip(
    book,
    {

        width: size.width,
        height: size.height,

        size: "stretch",

        autoSize: false,

        /*
         * StPageFlip switches to portrait when
         * the available width becomes too narrow.
         */
        usePortrait: true,

        minWidth: 360,
        maxWidth: 2000,

        minHeight: 500,
        maxHeight: 3000,

        /*
         * Keep this false because we want the
         * desktop/tablet newsletter to remain
         * a normal two-page spread.
         */
        showCover: false,

        flippingTime: 750,

        drawShadow: true,
        maxShadowOpacity: 0.4,

        mobileScrollSupport: true,

        useMouseEvents: true,

        disableFlipByClick: false
    }
);


// --------------------------------------------------
// Load pages
// --------------------------------------------------

pageFlip.loadFromHTML(pages);
