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
        // # 存储的数据样例
        // data: {
        //     ele: element,                    # div元素
        //     canvas: canvas,                  # 底层canvas，用于显示绘制完的图层
        //     canvas_t: canvas_t,              # 顶层canvas，用于绘制中的图层
        //     items: [{                        # 存储每个矩形的相关数据
        //         id: new Date().valueOf(),    # 采用时间戳作为id
        //         geometry: {                  # 矩形相关坐标
        //             startX: 0.0001,
        //             startY: 0.0001,
        //             endX: 0.22222,
        //             endY: 0.4444
        //         },
        //         details: [{                  # 对矩形的相关描述
        //             name: '类别',
        //             value: 'box'
        //         }]
        //     }]
        // }
        data: {
            ele: null,
            canvas: null,
            canvas_t: null,
            items: []
        }
    };


    var a4ip = anno4img.prototype;

    anno4img.fn.init = function (selector) {
        selector.style.position = 'relative';
        a4ip.data.ele = selector;
    };

    var annoPopupUtil = (function () {
        function addDetails() {
            var groups = annoPopupUtil.popup_edit.querySelectorAll('.groups .group');
            console.log(groups);
            var result = [];
            for (var i = 0; i < groups.length; i++) {
                var name = groups[i].querySelector('label').getAttribute('name');
                var v_ele;
                if (groups[i].querySelector('input')) {
                    v_ele = groups[i].querySelector('input');
                } else if (groups[i].querySelector('select')) {
                    v_ele = groups[i].querySelector('select');
                }
                var value = v_ele.value;
                result.push({
                    name: name,
                    value: value
                });
            }
            itemUtil.addDetails(result);
            annoPopupUtil.hide();
        }

        function init_popup_edit() {
            var popup_edit = document.createElement('div');
            popup_edit.setAttribute('id', 'popup-edit');
            popup_edit.style.display = 'none';
            popup_edit.style.position = 'absolute';
            popup_edit.style.float = 'none';
            popup_edit.style.zIndex = '3';

            var groups = document.createElement('div');
            groups.setAttribute('class', 'groups');
            groups.style.border = '1px solid #ccc';
            groups.style.backgroundColor = '#fff';
            groups.style.padding = '3px';
            groups.style.width = '250px';
            groups.style.display = 'flex';
            groups.style.flexDirection = 'column';
            groups.style.minHeight = '0px';
            popup_edit.appendChild(groups);

            var group = document.createElement('div');
            group.setAttribute('class', 'group');
            group.style.margin = '5px 0';
            groups.appendChild(group);

            var label = document.createElement('label');
            label.setAttribute('name', '类别');
            var text = document.createTextNode('类别：');
            label.appendChild(text);
            group.appendChild(label);

            var select = document.createElement('select');
            var arr = ['box', 'can', 'bottle', 'cup'];
            arr.forEach(function (value) {
                var option = document.createElement('option');
                option.setAttribute('value', value);
                var text = document.createTextNode(value);

                option.appendChild(text);
                select.appendChild(option);
            });
            group.appendChild(select);

            var group = document.createElement('div');
            group.setAttribute('class', 'group');
            group.style.margin = '5px 0';
            groups.appendChild(group);

            var label = document.createElement('label');
            label.setAttribute('name', '其他');
            var text = document.createTextNode('其他：');
            label.appendChild(text);
            group.appendChild(label);

            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', '......');
            group.appendChild(input);

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
            button.addEventListener('click', addDetails, false);

            annoPopupUtil.popup_edit = popup_edit;
            a4ip.data.ele.appendChild(popup_edit);
        }

        return {
            popup_edit: null,
            init: function () {
                init_popup_edit();
            },
            show: function (event, parent) {
                annoPopupUtil.popup_edit.style.display = 'block';
                var rect = parent.getBoundingClientRect();
                var x = event.clientX - rect.left;
                var y = event.clientY - rect.top;
                var left = (x > parent.clientWidth - annoPopupUtil.popup_edit.clientWidth) ? (parent.clientWidth - annoPopupUtil.popup_edit.clientWidth) : x;
                var top = (y > parent.clientHeight + annoPopupUtil.popup_edit.clientHeight) ? (parent.clientHeight + annoPopupUtil.popup_edit.clientHeight) : y;
                console.log(x + ',' + y);
                annoPopupUtil.popup_edit.style.left = left + 'px';
                annoPopupUtil.popup_edit.style.top = top + 'px';
            },
            hide: function () {
                annoPopupUtil.popup_edit.style.display = 'none';
            }
        };

    })();

    var itemUtil = (function () {
        return {
            addItem: function (data) {
                var date = new Date();
                var item = {};
                item.id = date.valueOf();
                localVar.currentId = item.id;
                item.geometry = {
                    startX: data.startX / a4ip.data.canvas.width,
                    startY: data.startY / a4ip.data.canvas.height,
                    endX: data.endX / a4ip.data.canvas.width,
                    endY: data.endY / a4ip.data.canvas.height
                };
                a4ip.data.items.push(item);
            },
            addDetails: function (data) {
                var currentId = localVar.currentId;
                var currentItem = a4ip.data.items.find(function (value) {
                    return value.id == currentId;
                });
                currentItem.details = data;
            }
        }
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
            if (isDrawable == true) {
                return;
            }
            isDrawable = true;
            var mousePos = getMousePos(event);
            startX = mousePos.x;
            startY = mousePos.y;

            annoPopupUtil.hide();
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
                itemUtil.addItem({
                    startX: startX,
                    startY: startY,
                    endX: endX,
                    endY: endY
                });
                annoPopupUtil.show(event, a4ip.data.ele);
            }
        }

        var color = 'red';
        var lineWidth = '2';
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

                annoPopupUtil.init();
            }
        };
    })();

    var util = (function () {
        return {
            clearAll: function () {
                var children = a4ip.data.ele.children;
                for (var i = 0; i < children.length; i++) {
                    a4ip.data.ele.removeChild(a4ip.data.ele.children[i]);
                }
            }

        };
    })();

    var localVar = {
        currentId: ''
    };

    anno4img.fn.loadImg = function (imgSrc) {

        //util.clearAll();
        var img = new Image();
        img.src = imgSrc;
        img.onload = function () {
            var ratio = a4ip.data.ele.clientWidth / img.width;

            var ratio_container = a4ip.data.ele.clientWidth / a4ip.data.ele.clientHeight;
            var ratio_img = img.width / img.height;

            var width, height;

            if (ratio_img > ratio_container) {
                width = a4ip.data.ele.clientWidth;
                height = a4ip.data.ele.clientWidth / img.width * img.height;
            } else {
                width = a4ip.data.ele.clientHeight / img.height * img.width;
                height = a4ip.data.ele.clientHeight;
            }

            canvasUtil.init(img, width, height);
        };
    };


    anno4img.fn.init.prototype = anno4img.prototype;
    window.anno4img = anno4img;
})
();
