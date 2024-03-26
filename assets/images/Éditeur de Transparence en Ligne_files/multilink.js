jQuery(document).ready(function () {
    $('a[data-json-urls]').unbind().on("click", openLinksByShortCode);
});

function openLinksByShortCode(e){
    let thisLink = $(this);
    let urls = thisLink.data('json-urls');
    let win, output;
    if (Array.isArray(urls)){
        for (let url of urls){
            console.log(url);
            switch (url.method) {
                case 'download':
                    // console.log('download');
                    window.open(url.url);
                    break;

                case 'blank':
                    // console.log('blank');
                    window.open(url.url, "_blank");
                    break;

                case 'self':
                    // console.log('self');
                    setTimeout(function(){
                        window.location.assign(url.url);
                    }, 700);
                    break;
            }
        }
    }
    e.preventDefault();
    return false;
}