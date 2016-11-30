// var anno4img_container = document.getElementById('anno4img-container');
// var canvas = document.createElement('canvas');
// anno4img_container.appendChild(canvas);
// drawRect(canvas);

// function drawRect(canvas) {
//     var ctx = canvas.getContext("2d");
//     ctx.fillStyle = "green";
//     ctx.fillRect(10, 10, 100, 100);
// }

(function () {

    var anno4img = function (selector) {
        return new anno4img.fn.init(selector);
    };

    anno4img.fn = anno4img.prototype = {
        constructor: anno4img,
        data: {
            ele: null,
            canvas: null,
            canvas_t: null
        }
    };

    var a4ip = anno4img.prototype;

    anno4img.fn.init = function (selector) {
        selector.style.position = 'relative';
        a4ip.data.ele = selector;
    };

    var annoPopupUtil = (function () {

        return {
            ele: null,
            init: function () {
                anno_popup = document.createElement('div');
                anno_popup.setAttribute('id', 'anno-popup');
                anno_popup.style.display = 'none';
                anno_popup.style.position = 'absolute';
                anno_popup.style.float = 'none';
                anno_popup.style.zIndex = '3';

                var groups = document.createElement('div');
                groups.setAttribute('class', 'groups');
                groups.style.border = '1px solid #ccc';
                groups.style.padding = '3px';
                groups.style.width = '250px';
                groups.style.display = 'flex';
                groups.style.flexDirection = 'column';
                groups.style.minHeight = '0px';

                anno_popup.appendChild(groups);

                var group = document.createElement('div');
                group.setAttribute('class', 'group');
                group.style.margin = '5px 0';

                groups.appendChild(group);

                var label = document.createElement('label');
                var text = document.createTextNode('类别');

                label.appendChild(text);

                var select = document.createElement('select');
                var arr = ['box', 'can', 'bottle', 'cup'];
                arr.forEach(function (value, index) {
                    var option = document.createElement('option');
                    option.setAttribute('value', index);
                    var text = document.createTextNode(value);

                    option.appendChild(text);
                    select.appendChild(option);
                });

                group.appendChild(select);

                var h_divider = document.createElement('div');
                h_divider.setAttribute('class', 'h-divider');
                h_divider.style.height = '1px';
                h_divider.style.width = '100%';
                h_divider.style.backgroundColor = '#ccc';

                groups.appendChild(h_divider);

                var footer = document.createElement('footer');
                footer.setAttribute('class', 'footer');
                footer.style.marginTop = '5px';

                groups.appendChild(footer);

                var button = document.createElement('button');
                var text = document.createTextNode('确定');

                button.appendChild(text);
                footer.appendChild(button);

                var button = document.createElement('button');
                var text = document.createTextNode('取消');

                button.appendChild(text);
                footer.appendChild(button);

                annoPopupUtil.ele = anno_popup;
                a4ip.data.ele.appendChild(anno_popup);
            },
            show: function (event, ele) {
                var rect = ele.getBoundingClientRect();
                var x = event.clientX - rect.left;
                var y = event.clientY - rect.top;
                var left = (260 + x > ele.offsetWidth + rect.left) ? (parent.offsetWidth + rect.left - 260) : x;
                var top = (70 + y > parent.offsetHeight + rect.top) ? (parent.offsetHeight + rect.top - 70) : x;
                console.log(x + ',' + y);
                annoPopupUtil.ele.style.left = left + 'px';
                annoPopupUtil.ele.style.top = top + 'px';
                annoPopupUtil.ele.style.display = 'flex';
            }
        };

    })();

    var canvasUtil = (function () {
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
                annoPopupUtil.show(event, a4ip.data.ele);
            }
        }

        var color = 'red';
        var lineWidth = '1';
        var startX = 4;
        var startY = 4;
        var endX = 4;
        var endY = 4;
        var isDrawable = false;
        var canvas;
        var canvas_t;

        return {
            init: function (img, width, height) {
                if (a4ip.data.canvas) {
                    a4ip.data.ele.removeChild(a4ip.data.canvas);
                    a4ip.data.canvas = null;
                }
                if (a4ip.data.canvas_t) {
                    a4ip.data.ele.removeChild(a4ip.data.canvas_t);
                    a4ip.data.canvas_t = null;
                }

                canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.style.position = 'absolute';
                canvas.style.zIndex = '1';
                canvas.style.left = '50%';
                canvas.style.top = '50%';
                canvas.style.marginTop = -(height / 2) + 'px';
                canvas.style.marginLeft = -(width / 2) + 'px';
                a4ip.data.ele.appendChild(canvas);

                canvas_t = document.createElement('canvas');
                canvas_t.width = width;
                canvas_t.height = height;
                canvas_t.style.position = 'absolute';
                canvas_t.style.zIndex = '2';
                canvas_t.style.marginTop = -(height / 2) + 'px';
                canvas_t.style.marginLeft = -(width / 2) + 'px';
                canvas_t.style.left = '50%';
                canvas_t.style.top = '50%';
                a4ip.data.ele.appendChild(canvas_t);

                canvas_t.addEventListener('mousedown', mousedown.bind(this), false);
                canvas_t.addEventListener('mousemove', mousemove.bind(this), false);
                canvas_t.addEventListener('mouseup', mouseup.bind(this), false);

                a4ip.data.canvas = canvas;
                a4ip.data.canvas_t = canvas_t;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // anno_popup.init();
                // console.log(anno_popup.ele);
                annoPopupUtil.init();
            }
        };
    })();

    // var canvasInit = (function () {
    //     return function canvasInit (img, width, height) {
    //         function getMousePos(event) {
    //             var rect = canvas_t.getBoundingClientRect();
    //             return {
    //                 x: event.clientX - rect.left,
    //                 y: event.clientY - rect.top
    //             };
    //         }
    //
    //         function getRect() {
    //             return {
    //                 x: Math.min(startX, endX),
    //                 y: Math.min(startY, endY),
    //                 width: Math.abs(startX - endX),
    //                 height: Math.abs(startY - endY)
    //             };
    //         }
    //
    //         function drawingRect() {
    //             var ctx_t = canvas_t.getContext('2d');
    //             ctx_t.clearRect(0, 0, canvas_t.width, canvas_t.height);
    //
    //             ctx_t.beginPath();
    //             ctx_t.strokeStyle = color;
    //             ctx_t.lineWidth = lineWidth;
    //             var rect = getRect();
    //             ctx_t.strokeRect(rect.x, rect.y, rect.width, rect.height);
    //         }
    //
    //         function drawedRect() {
    //             var ctx = canvas.getContext('2d');
    //             var ctx_t = canvas_t.getContext('2d');
    //             ctx_t.clearRect(0, 0, canvas_t.width, canvas_t.height);
    //
    //             ctx.beginPath();
    //             ctx.strokeStyle = color;
    //             ctx.lineWidth = lineWidth;
    //             var rect = getRect();
    //             ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    //         }
    //
    //         function mousedown(event) {
    //             isDrawable = true;
    //             var mousePos = getMousePos(event);
    //             startX = mousePos.x;
    //             startY = mousePos.y;
    //             // var ctx_t = canvas_t.getContext('2d');
    //             // ctx_t.strokeStyle = color;
    //             // ctx_t.lineWidth = lineWidth;
    //             // ctx_t.strokeRect(15, 15, 50, 50);
    //         }
    //
    //         function mousemove(event) {
    //             if (isDrawable) {
    //                 var mousePos = getMousePos(event);
    //                 endX = mousePos.x;
    //                 endY = mousePos.y;
    //                 var ctx_t = canvas_t.getContext('2d');
    //                 ctx_t.clearRect(0, 0, canvas_t.widht, canvas_t.height);
    //                 drawingRect();
    //             }
    //         }
    //
    //         function mouseup(event) {
    //             if (isDrawable) {
    //                 isDrawable = false;
    //                 var mousePos = getMousePos(event);
    //                 endX = mousePos.x;
    //                 endY = mousePos.y;
    //                 drawedRect();
    //             }
    //         }
    //
    //         var i = 0;
    //         var color = 'red';
    //         var lineWidth = '1';
    //         var startX = 4;
    //         var startY = 4;
    //         var endX = 4;
    //         var endY = 4;
    //         var isDrawable = false;
    //
    //         if (a4ip.data.canvas) {
    //             a4ip.data.ele.removeChild(a4ip.data.canvas);
    //             a4ip.data.canvas = null;
    //         }
    //         if (a4ip.data.canvas_t) {
    //             a4ip.data.ele.removeChild(a4ip.data.canvas_t);
    //             a4ip.data.canvas_t = null;
    //         }
    //
    //         var canvas = document.createElement('canvas');
    //         canvas.width = width;
    //         canvas.height = height;
    //         canvas.style.position = 'relative';
    //         a4ip.data.ele.appendChild(canvas);
    //
    //         var canvas_t = document.createElement('canvas');
    //         canvas_t.width = width;
    //         canvas_t.height = height;
    //         canvas_t.style.position = 'absolute';
    //         canvas_t.style.zIndex = '999';
    //         canvas_t.style.left = '0px';
    //         canvas_t.style.top = '0px';
    //         a4ip.data.ele.appendChild(canvas_t);
    //
    //         canvas_t.addEventListener('mousedown', mousedown.bind(this), false);
    //         canvas_t.addEventListener('mousemove', mousemove.bind(this), false);
    //         canvas_t.addEventListener('mouseup', mouseup.bind(this), false);
    //
    //         a4ip.data.canvas = canvas;
    //         a4ip.data.canvas_t = canvas_t;
    //
    //         var ctx = canvas.getContext('2d');
    //         ctx.drawImage(img, 0, 0, width, height);
    //         anno_popup.init();
    //         console.log(anno_popup.ele);
    //     };
    // })();


    anno4img.fn.loadImg = function (imgSrc) {
        var img = new Image();
        img.src = imgSrc;
        img.onload = function () {
            var ratio = a4ip.data.ele.clientWidth / img.width;
            var width = img.width * ratio;
            var height = img.height * ratio;

            canvasUtil.init(img, width, height);
        };
    };


    anno4img.fn.init.prototype = anno4img.prototype;
    window.anno4img = anno4img;
})();
