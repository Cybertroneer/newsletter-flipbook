const pageFlip = new St.PageFlip(
    document.getElementById("book"),
    {
        width:1080,
        height:1350,

        size:"stretch",

        minWidth:300,
        maxWidth:1080,

        minHeight:375,
        maxHeight:1350,

        showCover:true,

        usePortrait:true,

        autoSize:true,

        mobileScrollSupport:true,

        maxShadowOpacity:0.6
    }
);

pageFlip.loadFromHTML(
    document.querySelectorAll(".page")
);