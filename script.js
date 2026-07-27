const PAGE_WIDTH = 2481;
const PAGE_HEIGHT = 3508;
const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

function calculateBookSize() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Leave 5% margin around the book
    const availableWidth = vw * 0.95;
    const availableHeight = vh * 0.95;

    const isMobile = vw < 768;

    let pageWidth;
    let pageHeight;

    if (isMobile) {

        // ONE PAGE

        pageWidth = availableWidth;
        pageHeight = pageWidth / PAGE_RATIO;

        if (pageHeight > availableHeight) {
            pageHeight = availableHeight;
            pageWidth = pageHeight * PAGE_RATIO;
        }

    } else {

        // TWO PAGE SPREAD

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

const size = calculateBookSize();

const pageFlip = new St.PageFlip(
    document.getElementById("book"),
    {
        width: size.width,
        height: size.height,

        size: "stretch",

        autoSize: true,

        showCover: false,

        usePortrait: true,

        mobileScrollSupport: true,

        maxShadowOpacity: 0.6
    }
);

pageFlip.loadFromHTML(
    document.querySelectorAll(".page")
);