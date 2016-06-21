/*! Image Map Resizer
 *  Desc: Resize HTML imageMap to scaled image.
 *  Copyright: (c) 2014 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

(function(){
    'use strict';

    function scaleImageMap(){
        
        function resizeMap() {
            function resizeAreaTag(cachedAreaCoords){
                function scaleCoord(e){
                    return e * scallingFactor[(1===(isWidth = 1-isWidth) ? 'width' : 'height')];
                }

                var isWidth = 0;

                return cachedAreaCoords.split(',').map(Number).map(scaleCoord).map(Math.floor).join(',');
            }

            var scallingFactor = {
                width  : displayedImage.width  / sourceImage.width,
                height : displayedImage.height / sourceImage.height
            };

            // alert("Resize: " + scallingFactor.width + ", " + scallingFactor.height);

            for (var i=0; i < areasLen ; i++) {
                areas[i].coords = resizeAreaTag(cachedAreaCoordsArray[i]);
            }
        }

        function start(){
            //WebKit asyncs image loading, so we have to catch the load event.
            sourceImage.onload = function sourceImageOnLoadF(){
                if ((displayedImage.width !== sourceImage.width) || (displayedImage.height !== sourceImage.height)) {
                    resizeMap();
                }
            };
            //Make copy of image, so we can get the actual size measurements
            sourceImage.src = displayedImage.src;
        }

        function listenForResize(){
            function debounce() {
                clearTimeout(timer);
                timer = setTimeout(resizeMap, 250);
            }
            if (window.addEventListener) { window.addEventListener('resize', debounce, false); }
            else if (window.attachEvent) { window.attachEvent('onresize', debounce); }

            // My hack to call resizeMap when the keyboard becomes visible
            $('#keyboardTab').on("click", debounce);
        }

        var
            /*jshint validthis:true */
            map                   = this, 
            areas                 = map.getElementsByTagName('area'),
            areasLen              = areas.length,
            cachedAreaCoordsArray = Array.prototype.map.call(areas,function (e) { return e.coords; }),
            displayedImage        = document.querySelector('img[usemap="#'+map.name+'"]'),
            sourceImage           = new Image(),
            timer                 = null;
        
        start();
        listenForResize();
    }

    window.imageMapResize = function imageMapResizeF(selector){
        function init(element){
            if('MAP' !== element.tagName) { 
                throw new TypeError('Expected <MAP> tag, found <'+element.tagName+'>.');
            }

            scaleImageMap.call(element);
        }
        Array.prototype.forEach.call(document.querySelectorAll(selector||'map'),init);
    };

    if('jQuery' in window) {
        jQuery.fn.imageMapResize = function $imageMapResizeF(){
            return this.filter('map').each(scaleImageMap);
        };
    }
})();
