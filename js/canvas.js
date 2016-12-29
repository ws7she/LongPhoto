window.canvas = (function () {
    var _this;
    var focus = '';
    var easycanvas = document.getElementById("canvasMain");
    var ctx = easycanvas.getContext("2d");
    var draw = {
        init: function () {
            this.initEvent();
            this.startDrag();
            this.addClass();
            // this.addWarn();
        },
        drawCanvas: function () {
            easycanvas.width = $("#canvasArea").width();
            easycanvas.height = $("#canvasArea").height();
            for (var j = 0; j < $(".saveText").length; j++) {
                var textVal = $(".saveText").eq(j).val();
                var textTop = $(".saveText").eq(j).position().top;
                var textLeft = $(".saveText").eq(j).offset().left;
                var textCol = $(".saveText").eq(j).css("color");
                var textAli = $(".saveText").eq(j).css("text-align");
                var fontStyle = $(".saveText").eq(j).css("font-style");
                var fontWeight = $(".saveText").eq(j).css("font-weight");
                var fontSize = $(".saveText").eq(j).css("font-size");
                ctx.font = fontStyle + ' ' + fontWeight + ' ' + fontSize + ' arial';
                ctx.textAlign = textAli;
                ctx.fillStyle = textCol;
                var alignWid;
                if (textAli == "center") {
                    alignWid = easycanvas.width / 2
                } else if (textAli == "right") {
                    alignWid = easycanvas.width - 6
                } else {
                    alignWid = 6;
                }
                _this.canvasTextAutoLine(textVal, parseInt(textTop) + parseInt(fontSize) + 4, parseInt(fontSize) + 10, parseInt(fontSize) + 4, alignWid)
            }
            for (var i = 0; i < $("#canvasArea img").length; i++) {
                var imgSrc = $("#canvasArea img").eq(i).attr("src");
                var imgWid = $("#canvasArea img").eq(i).width();
                var imgHei = $("#canvasArea img").eq(i).height();
                var imgTop = $("#canvasArea img").eq(i).position().top;
                this.preImage(imgSrc, function (x, y, width, height) {
                    ctx.save();
                    ctx.drawImage(this, x, y, width, height);
                    ctx.restore();
                }, { "x": 0, "y": imgTop, "width": imgWid, "height": imgHei });
            }
            var saveImage = easycanvas.toDataURL("image/png");
        },
        initEvent: function () {
            _this = this;
            $(".packup").on("click", function () {
                $(".func-area").hide();
            });
            $("#show-area").on("click", function () {
                $(".func-area").show();
            });
            $(".text-input").on("click", function () {
                $(".edit-word").focus();
            });
            $("#addPic_one,#addPic_two").on("change", function () {
                _this.showPic(this);
            });
            $(".goview").on("click", function () {
                $("#canvasMain").show();
                $(".easy").css("opacity", 0);
                _this.drawCanvas();
            });
            $(".edit-word").on("blur", function () {
                if (this.value.length != 0) {
                    var color = $(this).css("color")
                    var align = $(this).css("text-align");
                    var bold = $(this).css("font-weight");
                    var skew = $(this).css("font-style");
                    var under = $(this).css("text-decoration")
                    var fsize = $(this).css("font-size");
                    var fheight = $(this).css("height");
                    _this.wrapDom(this.value, color, align, bold, skew, under, fsize, fheight);
                }
                $(this).attr("style",'');
                $(this).css("height", '40px');
                $(this).val('');
            });
            $(".goback").on("click", function () {
                $("#canvasMain").hide();
                $(".easy").css("opacity", 1);
            });
            this.fontAdjust($(".edit-word"));
        },
        fontAdjust: function (selector) {
            selector.each(function () {
                this.style.height = this.scrollHeight + 'px';
            });
            selector.bind({
                input: function () {
                    this.style.height = this.scrollHeight + 'px';
                },
                propertychange: function () {
                    this.style.height = this.scrollHeight + 'px';
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
        wrapDom: function (value, color, align, bold, skew, under, fsize, height) {
            $("#canvasArea").append("<textarea class='saveText' style = 'color:" + color + ";text-align:" + align + ";font-weight:" + bold + ";font-style:" + skew + ";text-decoration:" + under + ";font-size:" + fsize + ";height:" + height + "'>" + value + "</textarea>");
            this.fontAdjust($(".saveText"));
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
        },
        canvasTextAutoLine: function (str, lineHeight, width, height, align) {
            var lineWidth = 0;
            var c = document.getElementById("canvasMain");
            var canvasWidth = c.width;
            var lastSubStrIndex = 0;
            for (var i = 0; i < str.length; i++) {
                lineWidth += ctx.measureText(str[i]).width;
                if (lineWidth > canvasWidth) {//减去initX,防止边界出现的问题
                    ctx.fillText(str.substring(lastSubStrIndex, i), align, lineHeight);
                    lineHeight += height;
                    lineWidth = width;
                    lastSubStrIndex = i;
                }
                if (i == str.length - 1) {
                    ctx.fillText(str.substring(lastSubStrIndex, i + 1), align, lineHeight);
                }
            }
        },
        startDrag: function (callback) {
            var mlock = false, currentX = 0, posleft = $(".font-btn").css("left"), block = false, slock = false;
            var maxWid = $(".hand-move").width();
            var aveWid = maxWid / 6;
            $(".font-btn").on("touchstart", function (event) {
                mlock = true;
                if (!event) {
                    event = window.event;
                }
                var e = event;
                currentX = e.touches[0].clientX;
                e.preventDefault();
            });
            $(document).on("touchend", function () {
                mlock = false;
                posleft = $(".font-btn").css("left");
            });
            $(document).on("touchmove", function (event) {
                var e = event || window.event;
                if (mlock) {
                    var nowX = e.touches[0].clientX;
                    var disX = nowX - currentX;
                    var a = parseFloat(posleft) + disX;
                    if (a > 0 && a < maxWid) {
                        $(".font-btn").css("left", a + "px");
                        $(".font-now").css("left", a + "px");
                        if (a > 0 && a <= aveWid / 2) {
                            $(".font-now").html("10");
                            $(".edit-word").css("font-size", "10px")
                        } else if (a > aveWid / 2 && a <= aveWid / 2 * 3) {
                            $(".font-now").html("12");
                            $(".edit-word").css("font-size", "12px")
                        } else if (a > aveWid / 2 * 3 && a <= aveWid / 2 * 5) {
                            $(".font-now").html("14");
                            $(".edit-word").css("font-size", "14px")
                        } else if (a > aveWid / 2 * 5 && a <= aveWid / 2 * 7) {
                            $(".font-now").html("16");
                            $(".edit-word").css("font-size", "16px")
                        } else if (a > aveWid / 2 * 7 && a <= aveWid / 2 * 9) {
                            $(".font-now").html("18");
                            $(".edit-word").css("font-size", "18px")
                        } else if (a > aveWid / 2 * 9 && a <= aveWid / 2 * 11) {
                            $(".font-now").html("20");
                            $(".edit-word").css("font-size", "20px")
                        } else if (a > aveWid / 2 * 11 && a <= maxWid) {
                            $(".font-now").html("22");
                            $(".edit-word").css("font-size", "22px")
                        }
                    }
                }
            });
            $(".font-small").on("click", function () {
                if (!slock) {
                    var fs = parseInt($(".font-now").html());
                    fs = fs - 2;
                    if (fs < 10 || posleft < 0) {
                        olock = true;
                        return
                    }
                    $(".font-now").html(fs);
                    $(".font-btn,.font-now").css({ left: parseInt(posleft) - aveWid });
                    $(".edit-word").css("font-size", fs)
                }
                block = false;
            });
            $(".font-big").on("click", function () {
                if (!block) {
                    var fs = parseInt($(".font-now").html());
                    fs = fs + 2;
                    if (fs > 22 || posleft > maxWid) {
                        mlock = true;
                        return
                    }
                    $(".font-now").html(fs);
                    $(".font-btn,.font-now").css({ left: parseInt(posleft) + aveWid });
                    $(".edit-word").css("font-size", fs)
                }
                slock = false;
            });
        },
        addClass: function () {
            $("body").on('focus', 'textarea', function () {
                focus = $(this);
            });
            $('div.color-one,div.color-two,div.color-three,div.color-four,div.color-five,div.color-six').on('click', function () {
                var color = $(this).css('background-color');
                if (focus == '') {
                    $(".edit-word").css('color', color)
                } else {
                    focus.css('color', color);
                }
            });
            $('.left-align,.middle-align,.right-align').on('click', function () {
                var align = $(this).attr("name")
                if (focus == '') {
                    $(".edit-word").css('text-align', align)
                } else {
                    focus.css('text-align', align);
                }
            });
            $('.font-bold').on('click', function () {
                var weight = $(this).attr("name")
                if (focus == '') {
                    $(".edit-word").css('font-weight',weight)
                } else {
                    focus.css('font-weight',weight);
                }
            });
            $('.font-skew').on('click', function () {
                var skew = $(this).attr("name")
                if (focus == '') {
                    $(".edit-word").css('font-style', skew)
                } else {
                    focus.css('font-style', skew);
                }
            });
            $('.font-under').on('click', function () {
                var under = $(this).attr("name")
                if (focus == '') {
                    $(".edit-word").css('text-decoration', under)
                } else {
                    focus.css('text-decoration', under);
                }
            });
        }
    }
    return draw;
})();