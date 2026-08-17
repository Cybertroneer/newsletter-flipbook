const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;

const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");


// ==========================================
// MOBILE DETECTION
// ==========================================

const isMobile = window.innerWidth < 768;


// ==========================================
// PAGE DENSITY
// ==========================================

pages.forEach((page, index) => {

    if (isMobile) {

        // Mobile = all soft pages
        page.removeAttribute("data-density");

    } else {

        // Desktop / tablet
        // First + last = hard covers

        if (index === 0 || index === pages.length - 1) {

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


// ==========================================
// CALCULATE DIMENSIONS
// ==========================================

function calculateSize() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const margin = 0.95;

    const availableWidth = vw * margin;
    const availableHeight = vh * margin;

    let pageWidth;
    let pageHeight;


    // ========================================
    // MOBILE
    // ========================================

    if (vw < 768) {

        pageWidth = availableWidth;

        pageHeight =
            pageWidth / PAGE_RATIO;


        if (pageHeight > availableHeight) {

            pageHeight = availableHeight;

            pageWidth =
                pageHeight * PAGE_RATIO;
        }

    }


    // ========================================
    // DESKTOP / TABLET
    // ========================================

    else {

        // Two pages side-by-side

        pageWidth =
            availableWidth / 2;

        pageHeight =
            pageWidth / PAGE_RATIO;


        if (pageHeight > availableHeight) {

            pageHeight = availableHeight;

            pageWidth =
                pageHeight * PAGE_RATIO;
        }
    }


    return {
        width: Math.floor(pageWidth),
        height: Math.floor(pageHeight)
    };
}


const size = calculateSize();


// ==========================================
// CREATE FLIPBOOK
// ==========================================

const pageFlip = new St.PageFlip(
    book,
    {

        width: size.width,

        height: size.height,


        // IMPORTANT:
        // Do NOT stretch the book.
        size: "fixed",


        // Desktop/tablet = landscape spread
        // Mobile = portrait
        usePortrait: true,


        // Do not automatically resize
        autoSize: false,


        // We control covers ourselves
        showCover: false,


        // Animation
        flippingTime: 750,


        // Shadow
        drawShadow: true,

        maxShadowOpacity: 0.5,


        // Mobile touch
        mobileScrollSupport: true
    }
);


// ==========================================
// LOAD PAGES
// ==========================================

pageFlip.loadFromHTML(pages);
