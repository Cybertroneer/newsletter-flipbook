const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;

const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

const book = document.getElementById("book");


// --------------------------------------------------
// Calculate the maximum usable page size
// --------------------------------------------------

function calculatePageSize() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Keep a small breathing space around the newsletter
    const availableWidth = vw * 0.95;
    const availableHeight = vh * 0.95;

    let pageWidth = availableWidth / 2;
    let pageHeight = pageWidth / PAGE_RATIO;

    // If the calculated height is too large,
    // reduce the page width to fit the screen.
    if (pageHeight > availableHeight) {

        pageHeight = availableHeight;
        pageWidth = pageHeight * PAGE_RATIO;
    }

    return {
        width: Math.floor(pageWidth),
        height: Math.floor(pageHeight)
    };
}


const size = calculatePageSize();


// --------------------------------------------------
// Initialize StPageFlip
// --------------------------------------------------

const pageFlip = new St.PageFlip(
    book,
    {
        // Base page dimensions
        width: size.width,
        height: size.height,

        // Let StPageFlip calculate the actual size
        // from the available book/container space.
        size: "stretch",

        // These values control when stretch mode
        // changes into portrait mode.
        minWidth: 360,
        maxWidth: 2000,

        minHeight: 500,
        maxHeight: 3000,

        // IMPORTANT:
        // true = desktop/tablet landscape spread
        //      whenever there is enough room
        // true = portrait mode when space becomes too narrow
        usePortrait: true,

        // Prevent the library from resizing the parent
        // element itself.
        autoSize: false,

        // We want the first/last page to behave as covers
        // because they are explicitly marked "hard".
        showCover: false,

        // Slightly softer animation
        flippingTime: 750,

        // Keep the physical page shadow subtle
        maxShadowOpacity: 0.4,

        drawShadow: true,

        mobileScrollSupport: true,

        // Keep mouse/touch interaction enabled
        useMouseEvents: true,

        // Clicking the page can trigger the flip
        disableFlipByClick: false
    }
);


// --------------------------------------------------
// Load newsletter pages
// --------------------------------------------------

pageFlip.loadFromHTML(
    document.querySelectorAll(".page")
);


// --------------------------------------------------
// Optional: keep the flipbook responsive
// --------------------------------------------------

let resizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

        // StPageFlip recalculates its bounds internally
        // when the parent dimensions change.
        //
        // Calling update() forces the renderer to
        // recalculate the orientation and dimensions.
        if (pageFlip && pageFlip.getBoundsRect) {
            pageFlip.update();
        }

    }, 150);
});
