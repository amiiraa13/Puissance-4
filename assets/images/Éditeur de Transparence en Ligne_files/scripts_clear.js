$(function () {

    // YOUTUBE - VIMEO VIDEO

    // Added form main 28.08

    var pathToJsonCreator = "/blog/youtube/youtube-json-creator.php";

    function addNewLink(newId, newLink){
        $.ajax({
            type: "POST",
            url: pathToJsonCreator,
            data: {
                id: newId,
                link: newLink,
                action: "add"
            }
        }).done(function() {
            console.log("YOUTUBE (NEW Preview added to Json)");
        });
    }

    var videoCounter = 0;

    $("iframe, .tm-modal-youtube").each(function () {
        var el = $(this),
            elSrc = el.attr("src") + "",
            elQuality = el.attr("data-thumb");

        if (elSrc.indexOf("https://www.youtube.com/embed/") >= 0) {

            console.log("YOUTUBE VIDEO");

            if (!$(this).parents('.youtube-responsive').length) {
                $(this).wrap("<div class='youtube-responsive'></div>");
            }

            var youtubePreview;

            // Get video id
            var youtubeId = el.attr("src").substring(("https://www.youtube.com/embed/").length,
                el.attr("src").indexOf("?") >= 0 ? el.attr("src").indexOf("?") : el.attr("src").length);

            youtubeId = youtubeId.replace(/\n|\r|{|}|\||\\|\//g, "");

            // Youtube api key
            var apiKey = "AIzaSyD336ZOIfgGCBmz518JJX15VlW3GQTLuc8";

            var gUrl = "https://www.googleapis.com/youtube/v3/videos?id=" +
                youtubeId + "&key=" + apiKey + "&part=snippet,statistics,contentDetails",
                youtubeImgEl = "#image-"+youtubeId+"_"+videoCounter;

            var youtubeImage = "<div class='show-youtube-video' id='video_"+youtubeId+"_"+videoCounter+"' data-video='" + youtubeId + "'>" +
                "<div class='youtube-play-button'></div>" +
                "<img id='image-"+youtubeId+"_"+videoCounter+"' src='/images/placeholders/img-placeholder_640x480.svg' data-thumb='" + elQuality + "' class=''>" +
                "</div>";
            $(this).after(youtubeImage).remove();

            elQuality = $(youtubeImgEl).attr("data-thumb");

            if(elQuality.indexOf(".jpg") !== -1){
                //console.log("custom image");
                //console.log($(youtubeImgEl));

                youtubePreview = elQuality;
                $(youtubeImgEl).addClass("custom-img")
                    .attr("data-src", youtubePreview)
                    .lazyload();

            } else {
                switch (elQuality) {
                    case "high":
                        //console.log("high res image");

                        youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/maxresdefault.jpg";
                        $(youtubeImgEl).addClass("high-res")
                            .attr("data-src", youtubePreview)
                            .lazyload();
                        break;

                    case "default":
                        //console.log("default image");

                        youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/0.jpg";
                        $(youtubeImgEl).addClass("default-res")
                            .attr("data-src", youtubePreview)
                            .lazyload();
                        break;
                    default:
                        $.ajax({
                            type: "POST",
                            url: pathToJsonCreator,
                            data: { id: youtubeId, action: "check" }
                        }).done(function(isImage) {
                            if (isImage){

                                console.log("YOUTUBE (Preview in Json)");

                                if(isImage === "1"){
                                    youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/maxresdefault.jpg";
                                } else if (isImage === "0"){
                                    youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/0.jpg";
                                } else {
                                    youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/0.jpg";
                                }

                                $(youtubeImgEl)
                                    .attr("data-src", youtubePreview)
                                    .lazyload();

                            } else {

                                console.log("YOUTUBE (NO Preview in Json)");

                                $.ajax({
                                    url: gUrl,
                                    type: 'GET',
                                    success: function(data){
                                        console.log("YOUTUBE (API Loaded successfully)");

                                        if(data.items[0].snippet.thumbnails.maxres !== undefined){
                                            youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/maxresdefault.jpg";
                                            $(youtubeImgEl)
                                                .attr("data-src", youtubePreview)
                                                .lazyload();
                                            addNewLink(youtubeId, 1);
                                        } else{
                                            youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/0.jpg";
                                            $(youtubeImgEl)
                                                .attr("data-src", youtubePreview)
                                                .lazyload();
                                            addNewLink(youtubeId, 0);
                                        }
                                    },
                                    error: function(data) {
                                        console.log("YOUTUBE (API Failed to load)");

                                        youtubePreview = "https://img.youtube.com/vi/" + youtubeId + "/0.jpg";
                                        $(youtubeImgEl)
                                            .attr("data-src", youtubePreview)
                                            .lazyload();
                                        //addNewLink(youtubeId, youtubePreview);
                                    }
                                });

                            }
                            //////resize youtube slide
                            var maxHeight = function(elems){
                                return Math.max.apply(null, elems.map(function ()
                                {
                                    return $(this).height();
                                }).get());
                            }
                            $('.tm-blog-slider-new').each(function(){
                                let _this = $(this);
                                let sliderHeight = maxHeight(_this.find('li'));
                                let maxImgHeight = maxHeight( _this.find('.slide_image').find('img'));
                                if(sliderHeight > 0 && maxImgHeight > 0 && sliderHeight > maxImgHeight) _this.find('.youtube-responsive').css({'padding':'0', 'box-sizing':'border-box', 'border': 'none'});
                            });
                            //////resize youtube slide
                        });

                }
            }

        }
        else if (elSrc.indexOf("https://player.vimeo.com/video/") >= 0) {
            console.log("vimeo");

            if (!$(this).parents('.youtube-responsive').length) {
                $(this).wrap("<div class='youtube-responsive'></div>");
            }

            var vimeoId = el.attr("src").substring(("https://player.vimeo.com/video/").length, el.attr("src").indexOf("?") >= 0 ? el.attr("src").indexOf("?") : el.attr("src").length);
            $(this).after("<div id=\'vimeo_" + vimeoId + "\'" + " class=\'show-vimeo-video\' data-video='" + vimeoId + "'><div class='vimeo-play-button'></div></div>").remove();

            $.ajax({
                type: 'GET',
                url: 'https://vimeo.com/api/v2/video/' + vimeoId + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (data) {
                    var vimeoImage = data[0].thumbnail_large;
                    console.log(vimeoImage);
                    $("#vimeo_" + vimeoId + " .vimeo-play-button").after("<img src='" + vimeoImage + "'>");
                }
            });

        }
        else {
            console.log("other");
        }
        videoCounter++;
    });
    //uikit slider youtube
    $('.uk-slidenav').on('click', function(){
        $('.youtube-responsive').find('iframe').each(function(){
            let youtubeSrc = this.src;
            this.src = youtubeSrc.replace('autoplay=1', 'autoplay=0');
        });
    });

    //uikit slider youtube

    var $globalYoutubes = new Array();

    $(".show-youtube-video").on("click", function () {

        var youtubeVerApi = "";
        if ($(this).parents('.uk-modal-dialog').length) {
            youtubeVerApi = 'version=3&enablejsapi=1&';
        }
        var video = $(this).attr("data-video"),
            youtubeVideoLink = "https://www.youtube.com/embed/" + video +
                "?"
                + youtubeVerApi +
                "rel=0&showinfo=1&autoplay=1",
            $youtube = $(`
              <iframe src="` + youtubeVideoLink + `"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowscriptaccess="always" allowfullscreen="" width="560" height="315"></iframe>
            `);

        $globalYoutubes.push($youtube[0]);

        $(this).toggleClass("active").html("").append($youtube);

        youtubePauserForUikit();

    });

    var $htmlForYoutubePauser = $('html');


    function youtubePauserForUikit(){

        setTimeout(function(){
            youtubePauserForUikit();
        }.bind(this),250);

        if ( !$htmlForYoutubePauser.hasClass("uk-modal-page") ){
            $globalYoutubes.forEach( function($youtube){
                $youtube.contentWindow.postMessage(
                    '{"event":"command","func":"' + 'stopVideo' + '","args":""}',
                    '*'
                );
            });
        }
    }

    $(".show-vimeo-video").on("click", function () {
        var video = $(this).attr("data-video"),
            vimeoVideoLink = "https://player.vimeo.com/video/" + video + "?loop=1&amp;autopause=0&amp;autoplay=1";
        $(this)
            .toggleClass("active")
            .html("<iframe src=" + vimeoVideoLink + " width='640' height='360' frameborder='0' allow='autoplay; fullscreen' allowfullscreen=''></iframe>");
    });

    // Fix scroll position when exiting full screen mode

    if($.browser.webkit){
        console.log("webkit detected");
        $(".show-vimeo-video, .show-youtube-video").on("click", function () {
            var attrId = $(this).attr("id");
            $(document).bind("webkitfullscreenchange", function(){
                var scrollPosition = $("#" + attrId).offset().top;
                window.scrollTo(0, scrollPosition);
            });
        });
    }

    // END Youtube - Vimeo substitution with image

    //Настройка lazy для слайдера

    $(".small_sedcription_area img").addClass("no-lazy");

    $("img").each(function(){
        if (!$(this).hasClass('lazy') && !$(this).hasClass('lz-img') && !$(this).hasClass('no-lazy')){
            var imageSrc = $(this).attr("src");
            if($(this).hasClass('tm-blog-slider-img')){
                $(this)
                    .addClass('lazy')
                    .attr("data-src", imageSrc);
            } else {
                $(this)
                    .addClass('lazy')
                    .attr("src", "//fixthephoto.com/blog/images/missing-image.svg")
                    .attr("data-src", imageSrc);
            }
        }
    });

    $(".lazy, img.lz-img").lazyload();

    if (isDevicePortable) {
        // initialize editor for portable devices

        let peditorsdk;
        window.onload = function(){
            peditorsdk = _photoeditorsdk.PhotoEditorSDKUI.init({
                mainCanvasActions: ["undo", "redo", "export"],
                custom: {
                    languages: {
                        en: {
                            mainCanvasActions: {
                                buttonExport: 'Export',
                                buttonUndo: 'Undo',
                                buttonRedo: 'Redo',
                                buttonClose: 'Close',
                            },
                            library: {
                                title: 'Select Photo',
                                controls: {
                                    buttonUpload: 'Upload Image',
                                    buttonWebcamOpen: 'Open Webcam',
                                    buttonWebcamClose: 'Close Webcam',
                                    placeholderSearch: 'Search Library',
                                    noResults: 'No Results',
                                },
                            },
                        }
                    }
                },
                layout: 'basic',
                container: '#peditorsdk',
                assetBaseUrl: '/blog/assets/photoeditorsdk',
                image: 'start.png', // relative to assets directory
                library: {
                    enableWebcam: true,
                    enableUpload: true,
                },
                license: '{"api_token":"V2lMOLLKGpB51Ke7c6vXCA","app_identifiers":["fixthephoto.com","195.216.205.77","dev.fixthephoto.com","fixthephoto.vagrant"],"available_actions":[],"domains":["https://api.photoeditorsdk.com"],"enterprise_license":false,"expires_at":1601683200,"features":["camera","library","export","customassets","whitelabel","focus","textdesign","transform","brush","text","frame","overlay","sticker","adjustment","filter"],"issued_at":1599120272,"minimum_sdk_version":"1.0","owner":"fixthephoto dev","platform":"HTML5","products":["pesdk"],"version":"2.4","signature":"dVdyKboUkxB7D1PC2y1NuPgxQgZ2AgrIVEx/r1LA4JoS5xAuGrUoxhDzEhzEoIIf3ePbGo5VCqxQibVKINQOHd6IeW3ws0w6tBcw5USJFYNma1uBDlCKysNrn8tnlhGeI5jb2C8MuxbjFZnP5Torxfu+RqPfxtPpeU4Fq6pWbZhaJ5AoecMnk/vHBTv5laXCK3dnHoFdnj2RZSBJ9s7m5+w+rcoGxPbPXwd2g1YYycTkYmqWyzF9j8wqfRVLKkFUUkMzg+wEPEp4hl1PAaVSbHWUu01FYhOHR9Czu8PN2yyQSN+UjhQRlbemyNJfZPedAp9t84SwK0NhCeOcvSy2TacDDm3EEHXNcUnxxhLXUvakeAgjeMETdx+NgUGO7O1lpqTh1tNWuR+43VKmGIjfumRR1TLALUhJ1ezhW1aH2K/MRINFE4zx0CuEUus0IMBzIJhTVG/Z7sDFD4LnhhPplH59GRQcG2wgm+voObRjqA8ati29h8dap2/Oaerhf621r2/sqh4E/OpkMXbPMOiX6N1+CTYeLtJcb4nSkwsBcDybmqnqo0CfCtNFQ9wgwqH28Dr+s970ii+dRNejMeEb5nPz1HB/AcuJojExyedmGQVbZrMrdU68vG+N+9hwNaFlq3j5Ev4jzxDsjvloY1gRAYiGTNulso2VnnsV9GXPHDE="}',
            })
        };

    } else {

        // initialize editor for desktop
        window.onload = function () {
            setTimeout(function () {
                document.getElementById('ps-iframe').src = 'https://www.photopea.com/#%7B%22environment%22:%7B%22theme%22:5,%22intro%22:false%7D%7D';
                //console.log('показываем ссылку');
            }, 0);
        };
    }


});