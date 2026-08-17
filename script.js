const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;
const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");


// --------------------------------------------------
// DEVICE DETECTION
// --------------------------------------------------

const isMobile = window.innerWidth < 768;


// --------------------------------------------------
// PAGE DENSITY
// --------------------------------------------------

pages.forEach((page, index) => {

    if (isMobile) {

        // MOBILE
        // All pages are soft.
        // This gives the cover the same soft flip
        // behavior in both forward and backward directions.

        page.removeAttribute("data-density");

    } else {

        // DESKTOP / TABLET
        // Only the first and last pages behave as
        // physical hard covers.

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

    // Keep 95% breathing space around the book
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

        // If the page is taller than the viewport,
        // reduce it until it fits.

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

        // If the spread is too tall, scale both
        // pages down to fit the viewport.

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
// INITIALIZE STPAGEFLIP
// --------------------------------------------------

const pageFlip = new St.PageFlip(
    book,
    {

        width: size.width,
        height: size.height,

        // Let StPageFlip handle the responsive
        // spread/portrait rendering.
        size: "stretch",

        // These control the minimum/maximum
        // dimensions of the rendered page.
        minWidth: 360,
        maxWidth: 2000,

        minHeight: 500,
        maxHeight: 3000,

        // TRUE allows:
        //
        // Desktop / tablet:
        //      TWO PAGE SPREAD
        //
        // Mobile:
        //      SINGLE PAGE
        //
        usePortrait: true,

        // Prevent StPageFlip from resizing
        // the parent container.
        autoSize: false,

        // IMPORTANT:
        // Keep false because we are controlling
        // hard/soft density ourselves.
        showCover: false,

        // Animation duration in milliseconds.
        flippingTime: 750,

        // Page shadow.
        drawShadow: true,
        maxShadowOpacity: 0.4,

        // Touch support.
        mobileScrollSupport: true,

        // Mouse click/drag support.
        useMouseEvents: true,

        // Clicking the page can initiate a flip.
        disableFlipByClick: false
    }
);


// --------------------------------------------------
// LOAD PAGES
// --------------------------------------------------

pageFlip.loadFromHTML(pages);
