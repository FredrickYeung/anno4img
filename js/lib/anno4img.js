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
        //     rects: [{                        # 存储每个矩形的相关数据
        //         id: new Date().valueOf(),    # 采用时间戳作为id
        //         geometry: {                  # 矩形相关坐标
        //             startX: 0.0001,
        //             startY: 0.0001,
        //             endX: 0.22222,
        //             endY: 0.4444
        //         },
        //         o_geometry : {               #
        //             startX: data.startX,
        //             startY: data.startY,
        //             endX: data.endX,
        //             endY: data.endY
        //         },
        //         details: [{                  # 对矩形的相关描述
        //             name: '类别',
        //             value: 'box'
        //         }]
        //     }]
        // }
        data: {
            ele: null,
            img_size: {
                width: 0,
                height: 0
            },
            canvas: null,
            canvas_t: null,
            rects: []
        },
        tempData: null
    };

    var a4ip = anno4img.prototype;

    anno4img.fn.init = function (selector) {
        selector.style.position = 'relative';
        localVar.ele = selector;
    };

    // 获取所有数据
    anno4img.fn.getRectsAll = function () {
        return localVar;
    };

    // 事件组件类
    var eventUtil = (function () {
        return {
            on: function (obj, events, fn) {
                obj.listeners = obj.listeners || {};
                obj.listeners[events] = obj.listeners[events] || [];
                obj.listeners[events].push(fn);
            },
            fire: function (obj, events) {
                for (var i = 0, n = obj.listeners[events].length; i < n; i++) {
                    console.log(obj.listeners[events]);
                    obj.listeners[events][i] && obj.listeners[events][i]();
                }
            },
            off: function (obj, events) {
                for (var i = 0, n = obj.listeners[events].length; i < n; i++) {
                    obj.listeners[events][i] = null;
                }
            }
        };
    })();

    // 弹出框组件类
    var annoPopupUtil = (function () {
        function setDetails(popup_ele) {
            var groups = popup_ele.querySelectorAll('.groups .group');
            var result = [];
            for (var i = 0; i < groups.length; i++) {
                var name = groups[i].querySelector('[d-type="name"]').getAttribute('d-name');
                var value = groups[i].querySelector('[d-type="value"]').value;
                result.push({
                    name: name,
                    value: value
                });
            }
            rectUtil.setDetails(result);
        }

        // 初始化弹出编辑框 div#popup-edit
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
            group.setAttribute('detail-name', '类别');
            group.style.margin = '5px 0';
            groups.appendChild(group);

            var label = document.createElement('label');
            label.setAttribute('d-name', '类别');
            label.setAttribute('d-type', 'name');
            var text = document.createTextNode('类别：');
            label.appendChild(text);
            group.appendChild(label);

            var select = document.createElement('select');
            select.setAttribute('d-type', 'value');
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
            label.setAttribute('d-type', 'name');
            var text = document.createTextNode('其他：');
            label.appendChild(text);
            group.appendChild(label);

            var input = document.createElement('input');
            input.setAttribute('d-type', 'value');
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
            button.addEventListener('click', function () {
                annoPopupUtil.setDetails(annoPopupUtil.popup_edit);
                annoPopupUtil.hide_popup_edit();
            }, false);

            annoPopupUtil.popup_edit = popup_edit;
            localVar.ele.appendChild(popup_edit);
        }

        // 初始化信息框 div#popup-info
        function init_popup_info() {
            var popup_info = document.createElement('div');
            popup_info.setAttribute('id', 'popup-info');
            popup_info.style.display = 'none';
            popup_info.style.position = 'absolute';
            popup_info.style.float = 'none';
            popup_info.style.zIndex = '3';

            var groups = document.createElement('div');
            groups.setAttribute('class', 'groups');
            groups.style.border = '1px solid #ccc';
            groups.style.backgroundColor = '#fff';
            groups.style.padding = '3px';
            groups.style.width = '250px';
            groups.style.display = 'flex';
            groups.style.flexDirection = 'column';
            groups.style.minHeight = '0px';
            popup_info.appendChild(groups);

            var group = document.createElement('div');
            group.setAttribute('class', 'group');
            group.setAttribute('detail-name', '类别');
            group.style.margin = '5px 0';
            groups.appendChild(group);

            var label = document.createElement('label');
            label.setAttribute('name', '类别');
            label.setAttribute('d-type', 'name');
            label.setAttribute('d-name', '类别');
            var text = document.createTextNode('类别：');
            label.appendChild(text);
            group.appendChild(label);

            var select = document.createElement('select');
            select.setAttribute('d-type', 'value');
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
            label.setAttribute('d-type', 'name');
            var text = document.createTextNode('其他：');
            label.appendChild(text);
            group.appendChild(label);

            var input = document.createElement('input');
            input.setAttribute('d-type', 'value');
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
            var text = document.createTextNode('保存');
            button.addEventListener('click', function (event) {
                annoPopupUtil.setDetails(annoPopupUtil.popup_info);
                annoPopupUtil.hide_popup_info();
                canvasUtil.clearRect_t();
            }, false);
            button.appendChild(text);
            footer.appendChild(button);

            var button = document.createElement('button');
            var text = document.createTextNode('删除');
            button.addEventListener('click', function (event) {
                annoPopupUtil.hide_popup_info();
                canvasUtil.clearRect_t();
                canvasUtil.clearRect();
                rectUtil.removeRect();
                canvasUtil.drawAll();
            }, false);
            button.appendChild(text);
            footer.appendChild(button);

            var button = document.createElement('button');
            var text = document.createTextNode('取消');
            button.addEventListener('click', function (event) {
                annoPopupUtil.hide_popup_info();
                canvasUtil.clearRect_t();
            }, false);
            button.appendChild(text);
            footer.appendChild(button);

            annoPopupUtil.popup_info = popup_info;
            localVar.ele.appendChild(popup_info);
        }

        function getPopupPos(pos, ele) {

            // var x = pos.clientX - rect.left;
            // var y = pos.clientY - rect.top;
            var x = pos.x;
            var y = pos.y;
            var left = (pos.x > localVar.ele.clientWidth - ele.clientWidth) ? (localVar.ele.clientWidth - ele.clientWidth) : pos.x;
            var top = (pos.y > localVar.ele.clientHeight - ele.clientHeight) ? (localVar.ele.clientHeight - ele.clientHeight) : pos.y;
            return {
                left: left,
                top: top
            };
        }


        return {
            popup_info: null,
            popup_edit: null,
            is_edit_show: false,
            is_info_show: false,
            setDetails: setDetails,
            init: function () {
                init_popup_edit();
                init_popup_info();
            },
            show_popup_edit: function (pos) {
                annoPopupUtil.popup_edit.style.display = 'block';
                var popupPos = getPopupPos(pos, annoPopupUtil.popup_edit);
                annoPopupUtil.popup_edit.style.left = popupPos.left + 'px';
                annoPopupUtil.popup_edit.style.top = popupPos.top + 'px';
                annoPopupUtil.is_edit_show = true;
                setDetails(annoPopupUtil.popup_edit);
            },
            hide_popup_edit: function () {
                annoPopupUtil.is_edit_show = false;
                annoPopupUtil.popup_edit.style.display = 'none';
            },
            show_popup_info: function (pos) {
                annoPopupUtil.popup_info.style.display = 'block';
                var popupPos = getPopupPos(pos, annoPopupUtil.popup_info);
                annoPopupUtil.popup_info.style.left = popupPos.left + 'px';
                annoPopupUtil.popup_info.style.top = popupPos.top - 3 + 'px';
                var rect = null;
                localVar.rects.forEach(function (value) {
                    if (value.id == localVar.currentId) {
                        rect = value;
                    }
                });
                var groups = annoPopupUtil.popup_info.querySelectorAll('.group');
                for (var i = 0; i < groups.length; i++) {
                    rect.details.forEach(function (detail) {
                        var name = groups[i].getAttribute('detail-name');
                        if (detail.name == name) {
                            var v = groups[i].querySelector('[d-type="value"]');
                            v.value = detail.value;
                        }
                    });
                }

                annoPopupUtil.is_info_show = true;
            },
            hide_popup_info: function () {
                annoPopupUtil.is_info_show = false;
                annoPopupUtil.popup_info.style.display = 'none';
            }
        };

    })();

    // 数据项组件类
    var rectUtil = (function () {
        return {
            addRect: function (data) {
                var date = new Date();
                var rect = {};
                rect.id = date.valueOf();
                localVar.currentId = rect.id;
                rect.geometry = {
                    startX: data.startX / localVar.canvas.width,
                    startY: data.startY / localVar.canvas.height,
                    endX: data.endX / localVar.canvas.width,
                    endY: data.endY / localVar.canvas.height
                };
                rect.o_geometry = {
                    startX: data.startX,
                    startY: data.startY,
                    endX: data.endX,
                    endY: data.endY
                };
                localVar.rects.push(rect);
            },

            setDetails: function (data) {
                var currentId = localVar.currentId;
                var currentRect = localVar.rects.find(function (value) {
                    return value.id == currentId;
                });
                currentRect.details = data;
            },
            removeRect: function () {
                var currentId = localVar.currentId;
                var index = null;
                for (var i = 0; i < localVar.rects.length; i++) {
                    if (localVar.rects[i].id == currentId) {
                        index = i;
                        break;
                    }
                }
                localVar.rects.copyWithin(index, index + 1);
                localVar.rects.length--;
            }
        }
    })();

    // 画布组件类
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

        function on_mousedown(event) {
            if (isDrawable == true) {
                return;
            }
            isDrawable = true;
            var mousePos = getMousePos(event);
            startX = mousePos.x;
            startY = mousePos.y;

            annoPopupUtil.hide_popup_edit();
            annoPopupUtil.hide_popup_info();
        }

        function on_focus(event) {
            if (isDrawable) {
                return;
            }
            if (annoPopupUtil.is_edit_show) {
                return;
            }
            var mousePos = getMousePos(event);
            var rects = localVar.rects;
            var context = localVar.ctx_t;

            for (var i = 0; i < rects.length; i++) {
                var o = {
                    startX: rects[i].o_geometry.startX,
                    endX: rects[i].o_geometry.endX,
                    startY: rects[i].o_geometry.startY,
                    endY: rects[i].o_geometry.endY
                };

                if (mousePos.x > o.startX && mousePos.x < o.endX && mousePos.y > o.startY && mousePos.y < o.endY) {
                    localVar.currentId = rects[i].id;
                    canvasUtil.clearRect_t();
                    annoPopupUtil.hide_popup_info();

                    context.strokeStyle = 'blue';
                    context.strokeRect(o.startX, o.startY, o.endX - o.startX, o.endY - o.startY);
                    var rect = localVar.ele.getBoundingClientRect();
                    var rect_canvas = localVar.canvas.getBoundingClientRect();
                    var pos = {
                        x: o.startX + rect_canvas.left - rect.left,
                        y: o.endY + rect_canvas.top - rect.top
                    };
                    annoPopupUtil.show_popup_info(pos);


                    break;
                }
            }
        }

        function on_mousemove(event) {
            if (isDrawable) {
                var mousePos = getMousePos(event);
                endX = mousePos.x;
                endY = mousePos.y;
                var ctx_t = canvas_t.getContext('2d');
                ctx_t.clearRect(0, 0, canvas_t.widht, canvas_t.height);
                drawingRect();
            }
        }

        function on_mouseup(event) {
            if (isDrawable) {
                isDrawable = false;
                var mousePos = getMousePos(event);
                endX = mousePos.x;
                endY = mousePos.y;
                if (endX - startX <= 10 || endY - startY <= 10) {
                    canvasUtil.clearRect_t();
                    return;
                }
                drawedRect();
                rectUtil.addRect({
                    startX: startX,
                    startY: startY,
                    endX: endX,
                    endY: endY
                });

                var rect = localVar.ele.getBoundingClientRect();
                var pos = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };
                annoPopupUtil.show_popup_edit(pos);
            }
        }

        function drawAll() {
            localVar.ctx.drawImage(localVar.img, 0, 0, localVar.img_size.width, localVar.img_size.height);
            var rects = localVar.rects;
            for (var i = 0; i < rects.length; i++) {
                var o = {
                    x: rects[i].o_geometry.startX,
                    y: rects[i].o_geometry.startY,
                    width: rects[i].o_geometry.endX - rects[i].o_geometry.startX,
                    height: rects[i].o_geometry.endY - rects[i].o_geometry.startY
                };
                localVar.ctx.strokeStyle = 'red';
                localVar.ctx.strokeRect(o.x, o.y, o.width, o.height);
            }
        }

        var color = 'red';
        var lineWidth = '3';
        var startX = 4;
        var startY = 4;
        var endX = 4;
        var endY = 4;
        var isDrawable = false;
        var canvas;
        var canvas_t;
        var init = function (img, width, height) {
            if (localVar.canvas) {
                localVar.ele.removeChild(localVar.canvas);
                localVar.canvas = null;
            }
            if (localVar.canvas_t) {
                localVar.ele.removeChild(localVar.canvas_t);
                localVar.canvas_t = null;
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
            localVar.ele.appendChild(canvas);

            canvas_t = document.createElement('canvas');
            canvas_t.width = width;
            canvas_t.height = height;
            canvas_t.style.position = 'absolute';
            canvas_t.style.zIndex = '2';
            canvas_t.style.marginTop = -(height / 2) + 'px';
            canvas_t.style.marginLeft = -(width / 2) + 'px';
            canvas_t.style.left = '50%';
            canvas_t.style.top = '50%';
            localVar.ele.appendChild(canvas_t);

            canvas_t.addEventListener('mousedown', on_mousedown.bind(this), false);
            canvas_t.addEventListener('mousemove', on_mousemove.bind(this), false);
            canvas_t.addEventListener('mouseup', on_mouseup.bind(this), false);
            canvas_t.addEventListener('mousemove', on_focus.bind(this), false);

            var ctx = canvas.getContext('2d');
            var ctx_t = canvas_t.getContext('2d');
            localVar.canvas = canvas;
            localVar.canvas_t = canvas_t;
            localVar.ctx = ctx;
            localVar.ctx_t = ctx_t;

            localVar.img_size.width = canvas.width;
            localVar.img_size.height = canvas.height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            annoPopupUtil.init();
        };

        return {
            init: init,
            drawAll: drawAll,
            clearRect_t: function () {
                localVar.ctx_t.clearRect(0, 0, localVar.canvas_t.width, localVar.canvas_t.height);
            },
            removeRect: function () {
                annoPopupUtil.hide_popup_info();
                canvasUtil.clearRect_t();
                canvasUtil.clearRect();
                rectUtil.removeRect();
                drawAll();
            },
            clearRect: function () {
                localVar.ctx.clearRect(0, 0, localVar.canvas.width, localVar.canvas.height);
            }
        };
    })();

    var util = (function () {
        return {
            clearAll: function () {
                var children = localVar.ele.children;
                for (var i = 0; i < children.length; i++) {
                    localVar.ele.removeChild(localVar.ele.children[i]);
                }
            }

        };
    })();

    var localVar = {
        currentId: '',

        img_size: {
            width: 0,
            height: 0
        },
        rects: []
    };

    anno4img.fn.loadImg = function (imgSrc) {

        //util.clearAll();
        var img = new Image();
        img.src = imgSrc;
        img.onload = function () {
            var ratio = localVar.ele.clientWidth / img.width;

            var ratio_container = localVar.ele.clientWidth / localVar.ele.clientHeight;
            var ratio_img = img.width / img.height;

            var width, height;

            if (ratio_img > ratio_container) {
                width = localVar.ele.clientWidth;
                height = localVar.ele.clientWidth / img.width * img.height;
            } else {
                width = localVar.ele.clientHeight / img.height * img.width;
                height = localVar.ele.clientHeight;
            }
            localVar.img = img;
            canvasUtil.init(img, width, height);
        };
    };


    anno4img.fn.init.prototype = anno4img.prototype;
    window.anno4img = anno4img;
})
();
