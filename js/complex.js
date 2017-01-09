window.complex = function () {
    var scaleLock = false, skewLock = false, moveLock = false, focus = '';
    var _this;
    var complex = {
        init: function () {
            // this.wrapDom();
            this.initEvent();
        },
        wrapDom: function () {

        },
        initEvent: function () {
            _this = this;
            $(".comAddText").on("click", function () {
                $(".initial-warn").hide();
                var dom = $('<div class="editText"><div class="editText-main"><div class="edit_show"></div><i class="iconfont delete_area">&#xe642;</i> <i class="iconfont skew_area">&#xe666;</i> <i class="iconfont scale_area">&#xe667;</i></div><div class="editText-warn">双击这里以编辑文字</div></div>')
                $(".complex").append(dom);
                $(".editText").show();
                complex.startScale();
                complex.startSkew();
                complex.startMove();
                complex.fontEvent();
                complex.addClass();
            });

            $(".btn-add").on("click", function () {
                $(".cover").hide();
                $(".editText-edit").hide();
                var text = $(".font-complex").val();
                $(".edit_show").html(text);
                $(".font-complex").val('');
            });
            $(".btn-cancel").on("click", function () {
                $(".cover").hide();
                $(".editText-edit").hide();
            });

             $("#addPic_com").on("change", function () {
                // _this.showPic(this);
                alert("kdc")
            });
        },
        fontEvent: function () {
            $(".delete_area").on("click", function () {
                $(this).parent().parent().remove();
            })
            var touchtime = new Date().getTime();
            $(".editText-warn").on("click", function () {
                if (new Date().getTime() - touchtime < 500) {
                    $(".cover").show();
                    $(".editText-edit").show();
                } else {
                    touchtime = new Date().getTime();
                }
            });
        },
        startScale: function () {
           var editShow, editMain,areaX , areaY;
           var lock = false, currentX = 0, currentY = 0, scaleX = 0, scaleY = 0, disY = 0, disX = 0;
           $(".scale_area").on("touchstart", function (event) {
                lock = true;
                scaleLock = true;
                if (!event) {
                    event = window.event;
                }
                var e = event;
                editMain = $(this).parent();
                editShow = $(this).siblings().eq(0);
                console.log(editShow)
                areaX = editShow.width();
                areaY = editShow.height()
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
                e.preventDefault();
            });
            $(document).on("touchend", function () {
                if (scaleLock) {
                    lock = false;
                    scaleLock = false;
                }
            });
            $(document).on("touchmove", function (event) {
                if (scaleLock) {
                    var e = event || window.event;
                    var nowX = e.touches[0].clientX, nowY = e.touches[0].clientY;
                    disX = nowX - currentX, disY = nowY - currentY;
                    var x = editShow.width(), y = editShow.height();
                    if (lock) {
                        scaleX = disX / areaX + 1, scaleY = disY / areaY + 1;
                        if (scaleX > 1 && scaleY > 1) {
                            editShow.css("-webkit-transform", "scale(" + scaleX + "," + scaleY + ")");
                        }
                    }
                    editMain.css({ width: x, height: y })
                }
            });
        },
        startSkew: function () {
            var lock = false, currentX = 0, currentY = 0, rotate = 0;
            var editText;
            $(".skew_area").on("touchstart", function (event) {
                lock = true;
                skewLock = true;
                if (!event) {
                    event = window.event;
                }
                var e = event;
                editText = $(this).parent().parent();
                currentX = parseInt(editText.css("left"));
                currentY = parseInt(editText.css("top"));
                e.preventDefault();
            });

            $(document).on("touchend", function () {
                if (skewLock) {
                    lock = false;
                    skewLock = false;
                }
            });
            $(document).on("touchmove", function (event) {
                if (skewLock) {
                    var e = event || window.event;
                    var nowX = e.touches[0].clientX, nowY = e.touches[0].clientY;
                    var disX = Math.abs(nowX - currentX), disY = Math.abs(nowY - currentY);
                    var disZ = Math.sqrt(disX * disX + disY * disY);
                    rotate = Math.round((Math.asin(disY / disZ) / Math.PI * 180))
                    if (lock) {
                        if (currentX <= nowX && currentY <= nowY) {
                            rotate = rotate;
                        } else if (currentX >= nowX && currentY <= nowY) {
                            rotate = 180 - rotate;
                        } else if (currentX >= nowX && currentY >= nowY) {
                            rotate = 180 + rotate;
                        } else if (currentX <= nowX && currentY >= nowY) {
                            rotate = 360 - rotate;
                        }
                        editText.css("-webkit-transform", "rotate(" + rotate + "deg)");
                    }
                }
            });
        },
        startMove: function () {
            var editText, offX, offY;
            var lock = false, currentX = 0, currentY = 0;
            $(".edit_show").on("touchstart", function (event) {
                lock = true;
                moveLock = true;
                if (!event) {
                    event = window.event;

                }
                var e = event;
                editText = $(this).parent().parent();
                offX = editText.css("left");
                offY = editText.css("top");
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
                e.preventDefault();
            });

            $(document).on("touchend", function () {
                if (moveLock) {
                    lock = false;
                    moveLock = false
                    offX = editText.css("left"), offY = editText.css("top")
                }
            });
            $(document).on("touchmove", function (event) {
                if (moveLock) {
                    var e = event || window.event;
                    if (lock) {
                        var nowX = e.touches[0].clientX, nowY = e.touches[0].clientY;
                        var disX = nowX - currentX, disY = nowY - currentY;
                        var x = disX + parseFloat(offX), y = disY + parseFloat(offY);
                        editText.css({ top: y, left: x })
                    }
                }
            });
        },
        addClass: function () {
            $(".editText-edit").on('focus', 'textarea', function () {
                focus = $(this);
            });
            $('div.color-one,div.color-two,div.color-three,div.color-four,div.color-five,div.color-six').on('click', function () {
                var color = $(this).css('background-color');
                if (focus == '') {
                    $(".font-complex").css('color', color)
                } else {
                    focus.css('color', color);
                    $(".edit_show").css('color', color);
                }
            });
        },
        showPic: function (source) {
            var file = source.files[0];
            if (window.FileReader) {
                var fr = new FileReader();
                fr.onloadend = function (e) {
                    var img = e.target.result
                    $("#canvasArea").append("<img src='" + img + "' alt='from show' width='100%'/>");
                };
                fr.readAsDataURL(file);
            }
        },
        preImage: function (url, callback, pos) {
            var img = new Image();
            img.src = url;
            if (img.complte) {
                callback.call(img, pos.x, pos.y, pos.width, pos.height)
                return;
            }
            img.onload = function () {
                callback.call(img, pos.x, pos.y, pos.width, pos.height)
            }
        }
    }
    return complex;
} (); 