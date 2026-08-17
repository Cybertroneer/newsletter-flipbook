// ==========================================
// NEWSLETTER FLIPBOOK
// ==========================================

// Original page dimensions
const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;

const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;


// ==========================================
// ELEMENTS
// ==========================================

const book = document.getElementById("book");

const pages = document.querySelectorAll(".page");


// ==========================================
// DEVICE DETECTION
// ==========================================

function isMobile() {
    return window.innerWidth < 768;
}


// ==========================================
// CALCULATE PAGE SIZE
// ==========================================

function calculateBookSize() {

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Keep 95% of the viewport available
    const availableWidth = viewportWidth * 0.95;
    const availableHeight = viewportHeight * 0.95;

    let pageWidth;
    let pageHeight;


    // ========================================
    // MOBILE
    // ========================================

    if (isMobile()) {

        // One portrait page

        pageWidth = availableWidth;

        pageHeight = pageWidth / PAGE_RATIO;


        // If page is too tall,
        // scale it down to fit viewport

        if (pageHeight > availableHeight) {

            pageHeight = availableHeight;

            pageWidth = pageHeight * PAGE_RATIO;
        }

    }


    // ========================================
    // TABLET / DESKTOP
    // ========================================

    else {

        // Two portrait pages side by side

        pageWidth = availableWidth / 2;

        pageHeight = pageWidth / PAGE_RATIO;


        // If the two-page spread is too tall,
        // scale the spread down

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


// ==========================================
// PAGE DENSITY
// ==========================================

function setupPageDensity() {

    pages.forEach((page, index) => {

        if (isMobile()) {

            // --------------------------------
            // MOBILE
            // --------------------------------
            // Every page is soft.

            page.removeAttribute("data-density");

        } else {

            // --------------------------------
            // DESKTOP / TABLET
            // --------------------------------
            // First and last pages are hard.

            if (
                index === 0 ||
                index === pages.length - 1
            ) {

                page.setAttribute(
                    "data-density",
                    "hard"
                );

            } else {

                page.removeAttribute(
                    "data-density"
                );

            }
        }

    });
}


// ==========================================
// SETUP
// ==========================================

setupPageDensity();


// Calculate dimensions

const size = calculateBookSize();


// ==========================================
// CREATE STPAGEFLIP
// ==========================================

const pageFlip = new St.PageFlip(
    book,
    {

        // ----------------------------------
        // PAGE SIZE
        // ----------------------------------

        width: size.width,

        height: size.height,


        // ----------------------------------
        // SIZE MODE
        // ----------------------------------

        size: "stretch",


        // ----------------------------------
        // RESPONSIVE
        // ----------------------------------

        usePortrait: true,


        // ----------------------------------
        // AUTO SIZE
        // ----------------------------------

        autoSize: false,


        // ----------------------------------
        // COVER
        // ----------------------------------

        showCover: false,


        // ----------------------------------
        // ANIMATION
        // ----------------------------------

        flippingTime: 750,


        // ----------------------------------
        // SHADOW
        // ----------------------------------

        drawShadow: true,

        maxShadowOpacity: 0.5,


        // ----------------------------------
        // MOBILE
        // ----------------------------------

        mobileScrollSupport: true,


        // ----------------------------------
        // PAGE LIMITS
        // ----------------------------------

        minWidth: 360,

        maxWidth: 2000,

        minHeight: 500,

        maxHeight: 3000

    }
);


// ==========================================
// LOAD HTML PAGES
// ==========================================

pageFlip.loadFromHTML(pages);
