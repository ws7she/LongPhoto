window.complex = function () {
    var scaleLock = false, skewLock = false, moveLock = false;
    var complex = {
        init: function () {
            // this.wrapDom();
            this.initEvent();
            this.startScale();
            this.startSkew();
            this.startMove();
        },
        wrapDom: function () {

        },
        initEvent: function () {
            $(".delete_area").on("click", function () {
                // alert("Dsa")
            });
            var touchtime = new Date().getTime();
            $(".editText-warn").on("click", function () {
                if (new Date().getTime() - touchtime < 500) {
                    $(".cover").show();
                } else {
                    touchtime = new Date().getTime();
                }
            })
        },
        startScale: function (callback) {
            var lock = false, currentX = 0, currentY = 0, scaleX = 0, scaleY = 0, areaX = $(".edit_show").width(), areaY = $(".edit_show").height(), disY = 0, disX = 0;
            $(".scale_area").on("touchstart", function (event) {
                lock = true;
                scaleLock = true;
                if (!event) {
                    event = window.event;
                }
                var e = event;
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
                    var x = $(".edit_show").width(), y = $(".edit_show").height();
                    if (lock) {
                        scaleX = disX / areaX + 1, scaleY = disY / areaY + 1;
                        if (scaleX > 1 && scaleY > 1) {
                            $(".edit_show").css("-webkit-transform", "scale(" + scaleX + "," + scaleY + ")")
                        }
                    }
                    $(".editText-main").css({ width: x, height: y })
                }
            });
        },
        startSkew: function (callback) {
            var lock = false, currentX = 0, currentY = 0, rotate = 0;
            $(".skew_area").on("touchstart", function (event) {
                lock = true;
                skewLock = true;
                if (!event) {
                    event = window.event;
                }
                var e = event;
                currentX = parseInt($(".editText").css("left"));
                currentY = parseInt($(".editText").css("top"));
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
                        $(".editText").css("-webkit-transform", "rotate(" + rotate + "deg)");
                    }
                }
            });
        },
        startMove: function (callback) {
            var lock = false, currentX = 0, currentY = 0, offX = $(".editText").css("left"), offY = $(".editText").css("top");
            $(".edit_show").on("touchstart", function (event) {
                lock = true;
                moveLock = true;
                if (!event) {
                    event = window.event;

                }
                var e = event;
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
                e.preventDefault();
            });

            $(document).on("touchend", function () {
                if (moveLock) {
                    lock = false;
                    moveLock = false
                    offX = $(".editText").css("left"), offY = $(".editText").css("top")
                }
            });
            $(document).on("touchmove", function (event) {
                if (moveLock) {
                    var e = event || window.event;
                    if (lock) {
                        var nowX = e.touches[0].clientX, nowY = e.touches[0].clientY;
                        var disX = nowX - currentX, disY = nowY - currentY;
                        var x = disX + parseFloat(offX), y = disY + parseFloat(offY);
                        $(".editText").css({ top: y, left: x })
                    }
                }
            });
        }
    }
    return complex;
} (); 