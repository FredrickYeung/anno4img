// var anno4img_container = document.getElementById('anno4img-container');
// var canvas = document.createElement('canvas');
// anno4img_container.appendChild(canvas);
// drawRect(canvas);

// function drawRect(canvas) {
//     var ctx = canvas.getContext("2d");
//     ctx.fillStyle = "green";
//     ctx.fillRect(10, 10, 100, 100);
// }

(function() {
    var anno4img = function(selector) {
        return new anno4img.fn.init(selector);
    };

    var canvasInit = (function(anno4img) {
        return function(img, width, height) {
            function getMousePos(event) {
                var rect = canvas_t.getBoundingClientRect();
                return {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };
            }

            function getRect() {
                return {
                    x: Math.min(startX, endX),
                    y: Math.min(startY, endY),
                    width: Math.abs(startX - endX),
                    height: Math.abs(startY - endY)
                };
            }

            function drawingRect() {
                var ctx_t = canvas_t.getContext('2d');
                ctx_t.clearRect(0, 0, canvas_t.width, canvas_t.height);

                ctx_t.beginPath();
                ctx_t.strokeStyle = color;
                ctx_t.lineWidth = lineWidth;
                var rect = getRect();
                ctx_t.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }

            function drawedRect() {
                var ctx = canvas.getContext('2d');
                var ctx_t = canvas_t.getContext('2d');
                ctx_t.clearRect(0, 0, canvas_t.width, canvas_t.height);

                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                var rect = getRect();
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }

            function mousedown(event) {
                isDrawable = true;
                var mousePos = getMousePos(event);
                startX = mousePos.x;
                startY = mousePos.y;
                // var ctx_t = canvas_t.getContext('2d');
                // ctx_t.strokeStyle = color;
                // ctx_t.lineWidth = lineWidth;
                // ctx_t.strokeRect(15, 15, 50, 50);
            }

            function mousemove(event) {
                if (isDrawable) {
                    var mousePos = getMousePos(event);
                    endX = mousePos.x;
                    endY = mousePos.y;
                    var ctx_t = canvas_t.getContext('2d');
                    ctx_t.clearRect(0, 0, canvas_t.widht, canvas_t.height);
                    drawingRect();
                }
            }

            function mouseup(event) {
                if (isDrawable) {
                    isDrawable = false;
                    var mousePos = getMousePos(event);
                    endX = mousePos.x;
                    endY = mousePos.y;
                    drawedRect();
                }
            }

            function initPopup() {
                var anno_popup = document.createElement('div');
                anno_popup.setAttribute('id', 'anno-popup');
            }


            var i = 0;
            var color = 'red';
            var lineWidth = '1';
            var startX = 4;
            var startY = 4;
            var endX = 4;
            var endY = 4;
            var isDrawable = false;

            if (anno4img.canvas) {
                anno4img.ele.removeChild(anno4img.canvas);
                anno4img.canvas = null;
            }
            if (anno4img.canvas_t) {
                anno4img.ele.removeChild(anno4img.canvas_t);
                anno4img.canvas_t = null;
            }

            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.position = 'relative';
            anno4img.ele.appendChild(canvas);

            var canvas_t = document.createElement('canvas');
            canvas_t.width = width;
            canvas_t.height = height;
            canvas_t.style.position = 'absolute';
            canvas_t.style.zIndex = '999';
            canvas_t.style.left = '0px';
            canvas_t.style.top = '0px';
            anno4img.ele.appendChild(canvas_t);

            canvas_t.addEventListener('mousedown', mousedown.bind(this), false);
            canvas_t.addEventListener('mousemove', mousemove.bind(this), false);
            canvas_t.addEventListener('mouseup', mouseup.bind(this), false);

            anno4img.canvas = canvas;
            anno4img.canvas_t = canvas_t;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            // var ctx_t = canvas_t.getContext('2d');
            // ctx_t.strokeStyle = color;
            // ctx_t.lineWidth = lineWidth;
            // ctx_t.strokeRect(15, 15, 50, 50);
        }
    })(anno4img);

    anno4img.fn = anno4img.prototype = {
        constructor: anno4img,
        ele: null,
        canvas: null,
        canvas_t: null,
        drawStyle: {
            lineColor: 'black',
            lineWidth: '2'
        },
        img: null,
        annotations: [],
        init: function(selector) {
            selector.style.position = 'relative';
            anno4img.ele = selector;
        },
        loadImg: function(imgSrc) {
            var img = new Image();
            img.src = imgSrc;
            img.onload = function() {
                var ratio = anno4img.ele.clientWidth / img.width;
                var width = img.width * ratio;
                var height = img.height * ratio;

                canvasInit(img, width, height);
            }
        }
    };



    anno4img.fn.init.prototype = anno4img.prototype;
    window.anno4img = anno4img;
})()
