! function(o) {
    var t = [],
        i = function() {
            return t.length ? t[t.length - 1] : null
        },
        e = function() {
            var o, i = !1;
            for (o = t.length - 1; o >= 0; o--) t[o].$blocker && (t[o].$blocker.toggleClass("current", !i).toggleClass("behind", i), i = !0)
        };
    o.modal = function(e, s) {
        var l, n;
        if (this.$body = o("body"), this.options = o.extend({}, o.modal.defaults, s), this.options.doFade = !isNaN(parseInt(this.options.fadeDuration, 10)), this.$blocker = null, this.options.closeExisting)
            for (; o.modal.isActive();) o.modal.close();
        if (t.push(this), e.is("a"))
            if (n = e.attr("href"), /^#/.test(n)) {
                if (this.$elm = o(n), 1 !== this.$elm.length) return null;
                this.$body.append(this.$elm), this.open()
            } else this.$elm = o("<div>"), this.$body.append(this.$elm), l = function(o, t) {
                t.elm.remove()
            }, this.showSpinner(), e.trigger(o.modal.AJAX_SEND), o.get(n).done(function(t) {
                if (o.modal.isActive()) {
                    e.trigger(o.modal.AJAX_SUCCESS);
                    var s = i();
                    s.$elm.empty().append(t).on(o.modal.CLOSE, l), s.hideSpinner(), s.open(), e.trigger(o.modal.AJAX_COMPLETE)
                }
            }).fail(function() {
                e.trigger(o.modal.AJAX_FAIL);
                var s = i();
                s.hideSpinner(), t.pop(), e.trigger(o.modal.AJAX_COMPLETE)
            });
        else this.$elm = e, this.$body.append(this.$elm), this.open()
    }, o.modal.prototype = {
        constructor: o.modal,
        open: function() {
            var t = this;
            this.block(), this.options.doFade ? setTimeout(function() {
                t.show()
            }, this.options.fadeDuration * this.options.fadeDelay) : this.show(), o(document).off("keydown.modal").on("keydown.modal", function(o) {
                var t = i();
                27 == o.which && t.options.escapeClose && t.close()
            }), this.options.clickClose && this.$blocker.click(function(t) {
                t.target == this && o.modal.close()
            })
        },
        close: function() {
            t.pop(), this.unblock(), this.hide(), o.modal.isActive() || o(document).off("keydown.modal")
        },
        block: function() {
            this.$elm.trigger(o.modal.BEFORE_BLOCK, [this._ctx()]), this.$body.css("overflow", "hidden"), this.$blocker = o('<div class="jquery-modal blocker current"></div>').appendTo(this.$body), e(), this.options.doFade && this.$blocker.css("opacity", 0).animate({
                opacity: 1
            }, this.options.fadeDuration), this.$elm.trigger(o.modal.BLOCK, [this._ctx()])
        },
        unblock: function(t) {
            !t && this.options.doFade ? this.$blocker.fadeOut(this.options.fadeDuration, this.unblock.bind(this, !0)) : (this.$blocker.children().appendTo(this.$body), this.$blocker.remove(), this.$blocker = null, e(), o.modal.isActive() || this.$body.css("overflow", ""))
        },
        show: function() {
            this.$elm.trigger(o.modal.BEFORE_OPEN, [this._ctx()]), this.options.showClose && (this.closeButton = o('<a href="#close-modal" rel="modal:close" class="close-modal ' + this.options.closeClass + '">' + this.options.closeText + "</a>"), this.$elm.append(this.closeButton)), this.$elm.addClass(this.options.modalClass).appendTo(this.$blocker), this.options.doFade ? this.$elm.css("opacity", 0).show().animate({
                opacity: 1
            }, this.options.fadeDuration) : this.$elm.show(), this.$elm.trigger(o.modal.OPEN, [this._ctx()])
        },
        hide: function() {
            this.$elm.trigger(o.modal.BEFORE_CLOSE, [this._ctx()]), this.closeButton && this.closeButton.remove();
            var t = this;
            this.options.doFade ? this.$elm.fadeOut(this.options.fadeDuration, function() {
                t.$elm.trigger(o.modal.AFTER_CLOSE, [t._ctx()])
            }) : this.$elm.hide(0, function() {
                t.$elm.trigger(o.modal.AFTER_CLOSE, [t._ctx()])
            }), this.$elm.trigger(o.modal.CLOSE, [this._ctx()])
        },
        showSpinner: function() {
            this.options.showSpinner && (this.spinner = this.spinner || o('<div class="' + this.options.modalClass + '-spinner"></div>').append(this.options.spinnerHtml), this.$body.append(this.spinner), this.spinner.show())
        },
        hideSpinner: function() {
            this.spinner && this.spinner.remove()
        },
        _ctx: function() {
            return {
                elm: this.$elm,
                $blocker: this.$blocker,
                options: this.options
            }
        }
    }, o.modal.close = function(t) {
        if (o.modal.isActive()) {
            t && t.preventDefault();
            var e = i();
            return e.close(), e.$elm
        }
    }, o.modal.isActive = function() {
        return t.length > 0
    }, o.modal.defaults = {
        closeExisting: !0,
        escapeClose: !0,
        clickClose: !0,
        closeText: "Close",
        closeClass: "",
        modalClass: "modal",
        spinnerHtml: null,
        showSpinner: !0,
        showClose: !0,
        fadeDuration: null,
        fadeDelay: 1
    }, o.modal.BEFORE_BLOCK = "modal:before-block", o.modal.BLOCK = "modal:block", o.modal.BEFORE_OPEN = "modal:before-open", o.modal.OPEN = "modal:open", o.modal.BEFORE_CLOSE = "modal:before-close", o.modal.CLOSE = "modal:close", o.modal.AFTER_CLOSE = "modal:after-close", o.modal.AJAX_SEND = "modal:ajax:send", o.modal.AJAX_SUCCESS = "modal:ajax:success", o.modal.AJAX_FAIL = "modal:ajax:fail", o.modal.AJAX_COMPLETE = "modal:ajax:complete", o.fn.modal = function(t) {
        return 1 === this.length && new o.modal(this, t), this
    }, o(document).on("click.modal", 'a[rel="modal:close"]', o.modal.close), o(document).on("click.modal", 'a[rel="modal:open"]', function(t) {
        t.preventDefault(), o(this).modal()
    })
}(jQuery);

function Dialog(o) {
    var t = $("<div>", {
        "class": "modal dialog"
    });
    $("body").append(t), o && o.className && t.addClass(o.className), o && o.icon && (t.addClass("icon"), "alert" == o.icon ? t.append('<div class="dialog-icon"><span class="ti-alert"></span></div>') : "info" == o.icon ? t.append('<div class="dialog-icon"><span class="ti-info-alt"></span></div>') : "question" == o.icon ? t.append('<div class="dialog-icon"><span class="ti-help-alt"></span></div>') : t.append('<div class="dialog-icon">' + o.icon + "</div>")), o && o.title && t.append('<h3 class="dialog-title">' + o.title + "</h3>");
    var e = $("<div>", {
        "class": "dialog-content"
    });
    o && o.content && (t.append(e), "string" == typeof o.content ? e.html(o.content) : e.append(o.content)), o && o.loading === !0 && e.append('<div class="loader loader-inner ball-pulse-sync"><div></div><div></div><div></div></div>');
    var i = $("<p>", {
        "class": "dialog-actions"
    });
    t.append(i);
    var s = $("<a>", {
        "class": "btnClose"
    }).attr("href", "#close");
    if (o && o.btnClose && o.btnClose.label ? s.html(o.btnClose.label) : s.html("Đóng"), (o.btnClose && o.btnClose["default"] === !0 || !o.btnConfirm && !o.btnAlt) && s.addClass("default"), s.on("click", function(e) {
            e.preventDefault(), $.modal.close(), o && o.btnClose && o.btnClose.action && o.btnClose.action(t)
        }), i.append(s), o && o.btnConfirm) {
        var l = $("<a>", {
            "class": "btnConfirm"
        }).attr("href", "#confirm");
        l.html(o.btnConfirm.label), o.btnConfirm["default"] === !0 && l.addClass("default"), l.on("click", function() {
            o.btnConfirm.action(t), o.btnConfirm.autoClose === !0 && $.modal.close()
        }), i.append(l)
    }
    this.close = function() {
        $.modal.close()
    }, this.getBody = function() {
        return e
    };
    var n = {};
    o && o.clickClose && (n.clickClose = o.clickClose), t.on($.modal.OPEN, function(t, i) {
        var s = e.find('input[type="text"], input[type="password"], textarea');
        s.length > 0 && s.get(0).focus(), o && o.afterShow && o.afterShow(i.$elm)
    }), t.on($.modal.AFTER_CLOSE, function(e, i) {
        o && o.afterClose && o.afterClose(i.$elm), t.remove()
    }), t.on($.modal.BEFORE_CLOSE, function(t, e) {
        o && o.beforeClose && o.beforeClose(e.$elm)
    }), this.addLoader = function() {
        e.append($("<div>", {
            "class": "loader loader-inner ball-pulse-sync"
        }).html("<div></div><div></div><div></div>"))
    }, this.hideButton = function(o) {
        i.find("." + o).hide()
    }, this.showButton = function(o) {
        i.find("." + o).show()
    }, t.modal(n)
}
$.modal.defaults = {
    closeExisting: !0,
    escapeClose: !0,
    clickClose: !1,
    closeText: "Đóng",
    closeClass: "",
    showClose: !1,
    modalClass: "modal",
    spinnerHtml: null,
    showSpinner: !0
};

function User() {
    var n, o = this,
        e = "znews_user";
    this.getUserInfo = function() {
        var o = storage.load(e);
        if (o) try {
            return JSON.parse(o)
        } catch (t) {
            storage.clear(e)
        }
        return n = i()
    };
    var t = function(o) {
        o && o.user_id && (o.isLogin = !0, n = o, storage.insert(e, JSON.stringify(o)))
    };
    this.updateUserInfo = function(n, e, l) {
        var s = n ? n : o.getUserInfo();
        s || (s = i());
        var a = !1,
            d = !1,
            c = "<form>";
        e && e.username === !1 || (a = !0, c += s.user_name ? '<input type="text" class="inputName" placeholder="Tên hiển thị" value="' + s.user_name + '" />' : '<input type="text" class="inputName" placeholder="Tên hiển thị" />'), e && e.email === !0 && (d = !0, c += s.user_email && "" != s.user_email ? '<input type="text" class="inputEmail" placeholder="Email" value="' + s.user_email + '" />' : '<input type="text" class="inputEmail" placeholder="Email" />');
        var r = "Thông tin đăng nhập",
            h = "Để gửi bình luận, vui lòng cung cấp tên hiển thị và địa chỉ email liên hệ.",
            p = "Email sẽ không hiển thị và sẽ chỉ được ban biên tập sử dụng để liên hệ với bạn trong trường hợp cần thiết.";
        a && !d ? (r = "Chọn tên hiển thị", h = "Tên hiển thị sẽ được duyệt bởi ban biên tập và bình luận sẽ không được đăng nếu tên vi phạm qui định nội dung.", p = null) : !a && d && (r = "Thông tin liên hệ", h = "Vui lòng cung cấp địa chỉ email của bạn. Email sẽ không hiển thị và chỉ được báo sử dụng để liên hệ khi cần thiết.", p = null), p && (c += '<p class="note">' + p + "</p>"), c += "</form>";
        var u = new Dialog({
            icon: '<span class="ti-user"></span>',
            className: "centered",
            title: r,
            content: "<p>" + h + "</p>" + c,
            btnClose: {
                label: "Đóng",
                action: function() {
                    "function" == typeof l && l("User cancel update!")
                }
            },
            btnConfirm: {
                label: "Lưu thông tin",
                autoClose: !1,
                "default": !0,
                action: function() {
                    var n = u.getBody(),
                        o = n.find(".inputName"),
                        e = n.find(".inputEmail"),
                        i = n.find(".note");
                    if (o.length > 0) {
                        if ("" == o.val().trim()) return n.find(".inputName").addClass("error"), void(0 == i.length ? n.find("form").append('<p class="note error">Bạn chưa nhập tên hiển thị.</p>') : i.addClass("error").text("Bạn chưa nhập tên hiển thị."));
                        n.find(".inputName").removeClass("error").addClass("valid"), s.user_name = o.val()
                    }
                    if (e.length > 0) {
                        if ("" == e.val().trim() || !isValidEmail(e.val())) return n.find(".inputEmail").addClass("error"), void(0 == i.length ? n.find("form").append('<p class="note error">Bạn chưa nhập email hoặc địa chỉ không hợp lệ.</p>') : i.addClass("error").text("Bạn chưa nhập email hoặc địa chỉ không hợp lệ."));
                        n.find(".inputEmail").removeClass("error").addClass("valid"), s.user_email = e.val()
                    }
                    n.find(".note").remove(), t(s), "function" == typeof l && l(null, s), u.close()
                }
            }
        })
    }, o.loginAnonymous = function(n) {
        var e = i();
        o.updateUserInfo(e, {
            username: !0,
            email: !0
        }, function(o, e) {
            !o && e.user_name && "" != e.user_name && e.user_email && "" != e.user_email ? "function" == typeof n && n(null, e) : "function" == typeof n && n("User cancel login")
        })
    }, this.login = function(n) {
        if (facebook.isFBAvailable) {
            var e = new Dialog({
                className: "loading centered",
                icon: '<span class="ti-facebook" style="background: #3F5CB1;color: #FFF;padding: 10px 3px 0px 8px;border-radius: 3px;"></span>',
                title: "Đang kết nối với Facebook",
                content: "<p>Zing.vn không tự đăng bất kỳ thông tin gì lên Facebook của bạn. Việc kết nối chỉ để hiển thị bình luận của bạn tốt hơn.</p>",
                loading: !0,
                btnClose: {
                    label: 'Đăng nhập ẩn danh <span class="ti-arrow-right"></span>',
                    action: function() {
                        _loginAnonymous(n)
                    }
                }
            });
            facebook.login(function(i, l) {
                e.close(), i ? o.loginAnonymous(n) : l.user_email ? (t(l), "function" == typeof n && n(null, l)) : o.updateUserInfo(l, {
                    username: !1,
                    email: !0
                }, function(o) {
                    o ? "function" == typeof n && n("User doesn't provide email address") : "function" == typeof n && n(null, l)
                })
            })
        } else o.loginAnonymous(n)
    }, this.logout = function(o) {
        n = null, storage.clear(e), "undefined" != typeof facebook && facebook && facebook.logout(), "function" == typeof o && o()
    };
    var i = function() {
            var n = {
                user_id: l()
            };
            return storage.insert(e, JSON.stringify(n)), n
        },
        l = function() {
            var n = (new Date).getTime();
            return n = n.toString() + Math.round(1e4 * Math.random()), "zn_" + n
        },
        s = function() {
            n = o.getUserInfo(), "undefined" != typeof ga && ga && ga("set", "&uid", n.user_id)
        };
    s()
};

function Menu(n) {
    var o, e, t = n.find(".parent");
    if (n && 0 != n.length) {
        var i = function() {
                o && 0 != o.length || (o = $("<div>", {
                    id: "category-popup",
                    style: "display:none;"
                }), o.mouseleave(function() {
                    $(this).removeClass("active"), $(this).hide()
                }), o.mouseenter(function() {
                    $(this).addClass("active")
                }), n.after(o))
            },
            s = function(e) {
                if ("homepage" != e) {
                    i();
                    var t = n.find(".parent." + e);
                    if (0 != t.length) {
                        o.html(t.find(".subcate").html());
                        var s = 5;
                        $("body").hasClass("adtimaCanvas") && (s = 107), o.css({
                            top: t.offset().top - s + "px",
                            left: t.position().left + "px"
                        }), o.show()
                    }
                }
            },
            l = function() {
                setTimeout(function() {
                    e || (o.html(""), o.hide())
                }, 300)
            },
            a = function() {
                n.scrollToFixed({
                    marginTop: 0,
                    zindex: 99999,
                    offset: !1,
                    preAbsolute: function() {
                        n.addClass("noscroll")
                    },
                    postAbsolute: function() {
                        n.removeClass("noscroll")
                    },
                    fixed: function() {
                        n.addClass("fixedtop")
                    },
                    unfixed: function() {
                        n.removeClass("fixedtop")
                    }
                }), t.mouseenter(function() {
                    e = $(this), $(this).addClass("active");
                    var n = $(this).attr("class").replace(/parent|active|\s/gi, "");
                    s(n)
                }).mouseleave(function() {
                    $(this).removeClass("active"), e = null, setTimeout(function() {
                        o && 0 != o.length && o.hasClass("active") || l()
                    }, 50)
                })
            };
        a()
    }
};

function pauseOtherVideos(e) {
    if (e)
        for (var t = 0; t < VIDEOS.length; t++) VIDEOS[t].getVideoId() != e && VIDEOS[t].pause();
    else
        for (var t = 0; t < VIDEOS.length; t++) VIDEOS[t].pause()
}

function AdtimaPlayer(e, t) {
    var n, o = "video" + Math.floor(1e5 * Math.random()),
        i = this,
        a = e.attr("allowads") && "true" === e.attr("allowads") ? !0 : !1;
    t && t.noads === !0 && (a = !1);
    var s, l, d, r = !1,
        c = !1,
        p = !1,
        u = $("<figure>", {
            "class": "video"
        }),
        h = $("<p>", {
            "class": "controllers"
        }),
        m = $("<span>", {
            "class": "btnMuted"
        }).tooltipster({
            content: "Nhấn để bật tiếng",
            delay: 50,
            speed: 200,
            position: "bottom",
            theme: "zing-tooltip"
        });
    h.append(m);
    var f = $("<span>", {
        "class": "btnPopup"
    }).html('<span class="ti-layers"></span>').tooltipster({
        content: "Xem video ở màn hình nhỏ",
        delay: 50,
        speed: 200,
        position: "bottom",
        theme: "zing-tooltip"
    });
    f.on("click", function() {
        x()
    }), h.append(f);
    var g, v = $("<span>", {
            "class": "btnShare"
        }).html('<span class="ti-facebook"></span>').tooltipster({
            content: "Chia sẻ Facebook",
            delay: 50,
            speed: 200,
            position: "bottom",
            theme: "zing-tooltip"
        }),
        b = !1,
        C = !1;
    setTimeout(function() {
        C = !0
    }, 2e3);
    var y = !1;
    i.getVideoId = function() {
        return o
    }, i.pause = function() {
        s && s.pause()
    }, i.play = function() {
        s && s.play()
    }, i.setVolume = function(e, t) {
        s && (s.volume(e), t && t !== !1 || zSetCookie("volume", e, {
            expires: 1
        }))
    };
    var w = function() {
            var l, f, C, w = t && t.autoplay === !0 ? !0 : !1,
                k = t && t.muted === !0 ? !0 : !1,
                x = t && t.title ? t.title : "";
            if ("" != x && (u.append('<figcaption><span class="ti-video-camera"></span> <strong>' + x + "</strong></figcaption>"), t && t.caption && u.find("figcaption").append(": " + t.caption)), n = a && window.zaConfig && window.zaConfig.pageid ? "http://api.adtimaserver.vn/zad/videoad?zid=267866779927658906&vs=pageid%3D" + zaConfig.pageid + "%3Bcate%3D" + window.cate_path + "%3Bpostid%3D" + getArticleId() : "", t && t.shareLink && (h.append(v), v.on("click", function() {
                    facebook.share(t.shareLink, {
                        hashtag: "#ZingVideo"
                    }, function(e) {})
                })), "video" == e.prop("tagName").toLowerCase()) {
                if (f = e.find("img").length > 0 ? e.find("img").attr("src") : "", e.attr("poster") && (f = e.attr("poster")), t && t.poster && (f = t.poster), l = e.find("source").length > 0 ? e.find("source").attr("src") : null, !l && (l = e.attr("src") ? e.attr("src") : null, !l)) return;
                C = encodeURI(f) + ",zing," + encodeURI(l) + "," + n + "," + k + "," + w + "," + x + "," + o, d = $("<iframe>").attr({
                    id: o,
                    frameborder: "0",
                    allowfullscreen: "true",
                    scrolling: "no",
                    src: adtima_player_url + "#" + C
                }), d.css({
                    width: e.width() + "px",
                    height: Math.round(9 * e.width() / 16)
                }), u.prepend(d), e.after(u), e.remove()
            }
            if ("iframe" == e.prop("tagName").toLowerCase()) {
                if (f = t && t.poster ? t.poster : "", l = e.attr("src"), l.search(_regex_youtube) < 0) return;
                C = encodeURI(f) + ",youtube," + encodeURI(l) + "," + n + "," + k + "," + w + "," + x + "," + o, e.attr("src", adtima_player_url + "#" + C), e.attr("id", o), e.css({
                    width: e.width() + "px",
                    height: Math.round(9 * e.width() / 16)
                }), d = e, e.after(u), u.prepend(d)
            }
            return d && (u.css({
                width: u.width() + "px",
                height: u.height() + "px"
            }), VIDEOS.push(i), d.on("load", function() {
                _(), m.on("click", function() {
                    y = !1, i.setVolume(.3), E()
                }), u.append(h), s = d.get(0).contentWindow.video, s.volume(initialVolume), s.on("play", function() {
                    pauseOtherVideos(o), s.muted() || 0 == s.volume() ? m.show() : m.hide(), t && t.tracking && !b && (g && (clearTimeout(g), g = null), g = setTimeout(function() {
                        trackArticlePageview(t.tracking, x), b = !0
                    }, 5e3)), r = !1, c = !0
                }), s.on("volumechange", function() {
                    s.volume() > 0 ? y || (m.hide(), i.setVolume(s.volume())) : (m.show(), i.setVolume(s.volume()))
                }), s.on("pause", function() {
                    r = !0, c = !1, g && (clearTimeout(g), g = null), p && O()
                }), s.on("ended", function() {
                    r = !1, c = !1, p && O()
                })
            }), d.on("mouseover", function() {
                d.hasClass("popup") && s && s.muted() && (y = !0, s.muted(!1))
            }).on("mouseout", function() {
                d.hasClass("popup") && y && s.muted(!0)
            })), d
        },
        k = function() {
            s && (s.muted(!0), m.show())
        },
        E = function() {
            s && (s.muted(!1), m.hide())
        },
        _ = function() {
            loadPlugin(PLUGINS.waypoint, function() {
                loadPlugin(PLUGINS.inview, function() {
                    l = new Waypoint.Inview({
                        element: u[0],
                        enter: function(e) {},
                        entered: function(e) {
                            C && (!isVideoPopuped && t && t.inviewplay === !0 && (d.addClass("autoplay"), s && (0 == initialVolume && k(), s.play())), p && t && t.popPlayer === !0 && O())
                        },
                        exit: function(e) {
                            c && t && t.popPlayer === !0 && x(), isVideoPopuped || i.pause()
                        },
                        exited: function(e) {}
                    }), Waypoint.refreshAll()
                })
            })
        },
        x = function() {
            u.addClass("popped"), d.addClass("popup"), p = !0, isVideoPopuped = !0
        },
        O = function() {
            u.removeClass("popped"), d.removeClass("popup"), isVideoPopuped = !1, p = !1
        },
        S = function() {
            return e && 0 != e.length ? (w(), d) : void 0
        };
    return S()
}
if (!window.adtima_player_url) var adtima_player_url = "http://stc.v3.news.zing.vn/videojs/v1.4/index.html";
var VIDEOS = [],
    _regex_youtube = new RegExp("https*:\\/\\/(www\\.){0,1}(youtu\\.be\\/|youtube.com\\/(watch\\?v=|embed\\/))", "i"),
    isVideoPopuped = !1,
    initialVolume = null == zGetCookie("volume") ? 0 : parseFloat(zGetCookie("volume"));

function Article(t) {
    var e = this,
        i = t ? t : $(".the-article");
    if (i && 0 != i.length) {
        var n = i.attr("article-url") ? i.attr("article-url") : window.location.origin + window.location.pathname;
        i.attr("article-url", n);
        var a = $.trim(i.find(".the-article-title").text()),
            o = i.attr("article-id") ? i.attr("article-id") : getArticleId(n),
            s = getArticleShortURL(o),
            l = i.attr("category-id") ? i.attr("category-id") : null,
            r = "text";
        i.hasClass("type-picture") ? r = "picture" : i.hasClass("type-video") ? r = "video" : i.hasClass("type-hasvideo") ? r = "hasvideo" : i.hasClass("type-infographic") ? r = "infographic" : i.hasClass("type-stream") ? r = "stream" : i.hasClass("type-special") && (r = "special");
        var c = "regular";
        i.hasClass("layout-no-sidebar") ? c = "no-sidebar" : i.hasClass("layout-special") && (c = "special");
        var d, f, h, p, u = i.hasClass("pr"),
            m = i.find(".the-article-comment").length > 0,
            g = i.hasClass("status-live"),
            v = i.hasClass("status-ongoing"),
            b = i.find(".the-article-body"),
            w = i.find(".main .sidebar"),
            y = w.find("#advR3"),
            C = i.find(".recommendation"),
            k = i.find(".the-article-comment"),
            x = !1,
            E = function() {
                if ("video" == r) {
                    var t = b.find("iframe, video");
                    if (t.length > 0)
                        if ("video" == t.prop("tagName").toLowerCase()) {
                            new AdtimaPlayer(t, {
                                autoplay: !0,
                                popPlayer: !0,
                                muted: !1
                            })
                        } else if ("iframe" == t.prop("tagName").toLowerCase() && t.attr("src") && t.attr("src").search("news.zing.vn") < 0 && (e.indexOf("tv.zing.vn") >= 0 || e.indexOf("mp3.zing.vn") >= 0)) {
                        var e = t.attr("src");
                        e.indexOf("autostart=false") > -1 ? e = e.replace("autostart=false", "autostart=true") : e += (-1 === e.indexOf("?") ? "?" : "&") + "autostart=true", e += "&default_format=f720", t.attr("src", e)
                    }
                }
                V(), DEVICE.screen_width >= 720 && K(), 0 == i.find(".the-article-credit .source").length && i.addClass("zing"), i.find(".the-article-tags strong,.the-article-tags span").on("click", function(t) {
                    t.preventDefault();
                    var e = $.trim($(this).text());
                    e = remove_unicode(e), window.location.href = "http://news.zing.vn/" + e.replace(/\s+/gi, "-") + "-tin-tuc.html"
                }), w.length > 0 && (window.cate_path && window.cate_path.match(/giai-tri|am-nhac|phim-anh|thoi-trang|song-tre|song-khoe|du-lich|am-thuc/) ? w.find(".top-articles").after('<div class="fb-page" style="margin-bottom: 15px; margin-top: -50px; border-radius: 5px; overflow:hidden;" data-href="https://www.facebook.com/giaitri.zingnews" data-width="300" data-small-header="true" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="false"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/giaitri.zingnews"><a href="https://www.facebook.com/giaitri.zingnews/">Zing Giải Trí</a></blockquote></div></div>') : w.find(".top-articles").after('<div class="fb-page" style="margin-bottom: 15px; margin-top: -50px; border-radius: 5px; overflow:hidden;" data-href="https://www.facebook.com/zing.vn" data-width="300" data-small-header="true" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="false"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/zing.vn"><a href="https://www.facebook.com/zing.vn">Zing.vn</a></blockquote></div></div>')), m && "stream" == r && (g || v) && (w.find("> *:not(.pr-articles)").remove(), k.attr("status", "live"), w.append(k)), B(), Z(), N(), i.find(".tab-switcher-widget").each(function() {
                    new TabWidget($(this))
                }), P() || b.waitForImages(O), i.find(".the-article-viral-count").tooltipster({
                    content: "Chia sẻ",
                    delay: 50,
                    speed: 200,
                    position: "bottom",
                    theme: "zing-tooltip"
                }), i.find(".the-article-comment-count, .comment-count").tooltipster({
                    content: "Bình luận",
                    delay: 50,
                    speed: 200,
                    position: "bottom",
                    theme: "zing-tooltip"
                }), (null == window.disableInlineStream || window.disableInlineStream === !1) && A()
            },
            A = function() {
                i.hasClass("inline") ? (S(), loadPlugin(PLUGINS.waypoint, function() {
                    i.waypoint({
                        handler: function(t) {
                            if ("down" == t) window.pauseOtherVideos && pauseOtherVideos(), i.hasClass("read") || window.AdtimaZingNews && "undefined" != typeof AdtimaZingNews.Helpers.nextArticle && AdtimaZingNews.Helpers.nextArticle(o, l), T("inline-load"), History && History.replaceState({}, a, n);
                            else {
                                var e = i.prev(".the-article");
                                if (e.length > 0) {
                                    var s = e.attr("article-url"),
                                        r = $.trim(e.find(".the-article-title").text());
                                    History && History.replaceState({}, r, s)
                                }
                            }
                        },
                        offset: "70%"
                    })
                })) : (I(), "phone" == DEVICE.type || u || g || "stream" == r || "video" == r || "special" == r || mode_appview || D(S))
            },
            S = function() {
                READING_STREAM.length > 0 && !x && ("desktop" == DEVICE.type || "tablet" == DEVICE.type) && (x = !0, loadPlugin(PLUGINS.waypoint, function() {
                    f.waypoint({
                        handler: function(t) {
                            "down" == t && (R(function(t, e) {
                                t || (new Article(e), "desktop" == DEVICE.type && (h = i.find(".the-article-notification"), 0 == h.length && (h = $("<div>", {
                                    "class": "the-article-notification"
                                }), h.html('<div class="btnNextArticle"><a href="#" title="Click để đọc bài kế tiếp"><span>' + $.trim(e.find(".the-article-title").text()) + "</span></a></div>"), h.find(".btnNextArticle a").on("click", function(t) {
                                    "undefined" != typeof page && (t.preventDefault(), page.scrollTo(e.offset().top - 100, 1e3))
                                }), i.append(h), i.waypoint({
                                    handler: function(t) {
                                        "down" == t && i.find(".the-article-notification").remove()
                                    },
                                    offset: "bottom-in-view"
                                }))))
                            }), this.destroy())
                        },
                        offset: "100%"
                    })
                }))
            },
            I = function() {
                var t = storage.load(KEY_READ_HISTORY);
                if (0 == t);
                else {
                    if (null == t) t = {};
                    else try {
                        t = JSON.parse(t)
                    } catch (e) {
                        t = {}
                    }
                    _.has(t, o) || (t[o] = {
                        url: s
                    }, storage.insert(KEY_READ_HISTORY, JSON.stringify(t)))
                }
                i.addClass("read")
            },
            T = function(t) {
                if (!i.hasClass("read")) {
                    if (!t) var t = "";
                    trackArticlePageview(n + "#" + t, a, l), I()
                }
            },
            N = function(t) {
                return window.location.pathname.search("/preview/") >= 0 ? void("function" == typeof t && t("Preview link - won't load Facebook social count")) : void $.ajax({
                    url: "https://api.facebook.com/method/links.getStats?urls=" + s + "&format=json",
                    dataType: "json",
                    success: function(e) {
                        if (e && e.length > 0) {
                            var n = e[0].total_count;
                            n > 1e3 && (n = Math.round(n / 100) / 10 + "k"), i.find(".the-article-viral-count").text(n).show(), d && (d.find(".btnFacebook").prepend('<span class="counter">' + n + "</span>"), f.find(".btnFacebook a").append('<span class="count">' + n + "</span>")), "function" == typeof t && t()
                        } else "function" == typeof t && t("Error retrieving information from facebook")
                    },
                    fail: function() {
                        "function" == typeof t && t("Fail to connect to Facebook")
                    }
                })
            },
            D = function(t) {
                if (!i.hasClass("inline")) {
                    var e, n = ("referrer" in document ? document.referrer : "", i.attr("topic-id") ? i.attr("topic-id").split(",") : null);
                    if (n) {
                        var a = [];
                        if (_.each(n, function(e) {
                                e = parseInt(e), (e > 2276 || 2207 > e && 2e3 != e && 2001 != e && 2002 != e && 2003 != e && 2121 != e) && (a.push(e), loadTopic(e, 20, function(e, i) {
                                    if (!e) {
                                        if (!i || 0 == i.length) return;
                                        _.each(i, function(t) {
                                            var e = {
                                                id: getArticleId(t.link),
                                                title: t.title,
                                                url: t.link
                                            };
                                            "video" != t.type && !isArticleRead(e.id) && _.findLastIndex(READING_STREAM, {
                                                id: e.id
                                            }) < 0 && READING_STREAM.push(e)
                                        }), READING_STREAM.length > 0 && "function" == typeof t && t()
                                    }
                                }))
                            }), a.length > 0) return
                    }
                    e = i.find('.related-articles .article-item, li[tab-name="most-viral"] .article-item, li[tab-name="most-viewed"] .article-item'), e && e.length >= 0 && e.each(function(t, e) {
                        var i = $(e);
                        i.hasClass("pr") || i.hasClass("type-video") || i.hasClass("type-special") || F(i)
                    }), READING_STREAM.length > 0 && "function" == typeof t && t()
                }
            },
            F = function(t) {
                var e = t.find(".article-title a").attr("href"),
                    i = getArticleId(e),
                    n = $.trim(t.find(".article-title a").text());
                if (isArticleRead(i)) return !1;
                if (_.findLastIndex(READING_STREAM, {
                        id: i
                    }) < 0) {
                    var a = {
                        id: i,
                        title: n,
                        url: e
                    };
                    return READING_STREAM.push(a), !0
                }
                return !1
            },
            R = function(t) {
                if (0 == READING_STREAM.length) return void("function" == typeof t && t("No more article in stream"));
                var e = READING_STREAM.shift();
                if (e) {
                    L();
                    var n = $("<div>", {
                        style: "display: none;"
                    });
                    n.load(e.url + " .the-article", function(a, o, s) {
                        if ("error" == o) "function" == typeof t && t("Fail to fetch next article: " + s.statusText);
                        else {
                            var l = n.find(".the-article");
                            if (l.hasClass("type-special")) return n.remove(), void("function" == typeof t && t("Next article is special article!"));
                            l.addClass("inline"), l.attr("article-url", e.url.replace(/#.*$/gi, ""));
                            var r = l.find(".the-article-meta .the-article-category a").attr("href");
                            r = r.replace(".html", ""), r = r.split("/"), r = r[1], l.attr("category-id", r), i.after(l), DEVICE.screen_width > 1e3 && window.AdtimaZingNews && AdtimaZingNews.Helpers.reloadBanner && AdtimaZingNews.position.mastheadInline && ($("#advMastheadInline").length > 0 && $("#advMastheadInline").removeAttr("id"), i.after('<div id="advMastheadInline" class="banner size_masthead"></div>'), AdtimaZingNews.Helpers.reloadBanner(AdtimaZingNews.position.mastheadInline), $("#advMastheadInline").removeAttr("id")), n.remove(), "function" == typeof t && t(null, l)
                        }
                    })
                }
            },
            L = function() {
                w.find("#advR1, #advR2, #advR3").each(function() {
                    var t = $(this).attr("id");
                    $(this).addClass(t), $(this).attr("id", t + "-" + o)
                })
            },
            O = function() {
                i.addClass("loaded"), e.updateSidebarLayout()
            },
            P = function() {
                if (!m) return !1;
                var t = PLUGINS.comment2;
                return loadPlugin(t, function() {
                    var t = null != window._liveComment ? window._liveComment : "live" === k.attr("status"),
                        n = null != window._commentMod ? window._commentMod : t ? "unmoderated" : "moderated";
                    p = new Comment(o, {
                        isLive: t,
                        mode: t && "regular" == c ? "simple" : "full",
                        moderation: n,
                        updateLayout: function() {
                            if (d && d.length > 0 && 0 == d.find(".btnComment .counter").length && p.getTotalComment() > 0 && (k.find("> header h2").append(" <span>(" + p.getTotalComment() + ")</span>"), d.find(".btnComment").append('<span class="counter">' + p.getTotalComment() + "</span>")), t && "regular" == c) {
                                var n = k.height() - k.find("> header").height() - k.find(".form").height() - 34;
                                p.getRenderedWidget().find(".comments").css({
                                    height: n + "px"
                                }), p.getRenderedWidget().find(".comments").mCustomScrollbar({
                                    scrollButtons: {
                                        enable: !1
                                    },
                                    mouseWheel: {
                                        enable: !0
                                    },
                                    contentTouchScroll: !0,
                                    axis: "y",
                                    scrollbarPosition: "outside",
                                    theme: "dark",
                                    autoHideScrollbar: !0,
                                    autoDraggerLength: !0,
                                    alwaysShowScrollbar: !1,
                                    scrollInertia: 500,
                                    advanced: {
                                        updateOnSelectorChange: !0
                                    }
                                })
                            }
                            loadPlugin(PLUGINS.waypoint, function() {
                                Waypoint.refreshAll()
                            }), i.hasClass("loaded") ? e.updateSidebarLayout() : b.waitForImages(O)
                        }
                    }), k.append(p.getRenderedWidget()), t && "regular" == c && (k.css({
                        height: $(window).height() - 60 + "px",
                        overflow: "hidden"
                    }), k.scrollToFixed({
                        marginTop: 50,
                        limit: function() {
                            var t = C.offset().top - k.height();
                            return t
                        }
                    }))
                }), !0
            };
        this.updateSidebarLayout = function() {
            if (0 != w.length) {
                var t = w.height();
                if ("video" != r)
                    if (1e3 > t);
                    else if (t >= 1e3 && 1600 > t) 1200 >= t ? w.find(".related-articles").show() : (w.find(".top-articles").show(), t > 1400 && w.find(".banners").css("margin-bottom", "200px"));
                else {
                    var e = w.find(".featured-articles"),
                        i = w.find(".related-articles"),
                        n = w.find(".top-articles"),
                        a = !1;
                    n.before(e), e.show(), e.css("margin-bottom", "50px"), w.find(".banners").css("margin-bottom", "150px"), t >= 2e3 && 2400 > t && i.show(), t >= 2400 && w.find(".top-articles").show(), t >= 2700 && i.show(), t >= 2900 && i.css("margin-bottom", "50px"), t >= 3e3 && w.find(".related-topics").show(), t >= 3300 ? (w.find("#advR3").show(), a = !0) : w.find("#advR3").remove(), t >= 3800 && n.css("margin-bottom", "50px"), t > 4e3 && w.find("> *").css("margin-bottom", "50px"), t > 6e3 && e.addClass("list-5"), a && (n.css("margin-bottom", "150px"), y.length > 0 && (y.trigger("detach.ScrollToFixed"), y.scrollToFixed({
                        marginTop: 50,
                        offset: !1,
                        removeOffsets: !0,
                        limit: function() {
                            var t = w.offset().top + w.height() - 600;
                            return t
                        }
                    })))
                } else $(window).width() > 1e3 && w.find(".section:not(.banners)").scrollToFixed({
                    marginTop: 50,
                    limit: function() {
                        var t = w.offset().top + w.height() - 600;
                        return t
                    }
                })
            }
        };
        var B = function() {
                w.length > 0 && w.find(".section").each(function(t, e) {
                    Y($(e), 5)
                }), C.length > 0 && (C.find('.article-title a[href*="' + o + '.html"]').parents(".article-item").remove(), Y(C, 6), "video" != r && z(function(t) {
                    t && (C.find(".article-list article:nth-child(6)").remove(), C.find(".article-list").append(t))
                }))
            },
            z = function(t) {
                loadPR({}, function(e, i) {
                    if (!e && i && i.length > 0) {
                        var n = getRandom(0, i.length - 1),
                            a = i[n],
                            o = $("<article>", {
                                "class": "article-item pr"
                            });
                        o.html('<p class="article-thumbnail"><a href="' + a.clickurl + '" title="' + a.title + '" target="_blank"><img src="' + a.mediaurl + '" alt="' + a.title + '"></a></p><header><h1 class="article-title"><a href="' + a.clickurl + '" title="' + a.title + '">' + a.title + '</a></h1><p class="article-meta"></p></header><img src="' + a.trackingurl + '" width="1" height="1" style="width: 1px; height: 1px; position: absolute; top: -1px; height: -1px;" />'), "function" == typeof t && t(o)
                    } else "function" == typeof t && t()
                })
            },
            V = function() {
                "video" != r && 0 != b.length && (DEVICE.screen_width > 1e3 && (b.bind("copy", ot), b.on("mouseup", function() {
                    setTimeout(function() {
                        var t = G();
                        t && "" != $.trim(t) ? d && d.find(".btnError").addClass("highlighted") : d && d.find(".btnError").removeClass("highlighted")
                    }, 10)
                })), "special" != r && "special" != c && et(), "picture" != r && "infographic" != r || "special" != c && "no-sidebar" != c || b.find("table.picture td img").each(function(t, e) {
                    if (!($(e).parents(".twentytwenty-wrapper") > 0)) {
                        var i = $(e).attr("src");
                        i = i.replace("w660", "w1024"), $(e).attr("src", i)
                    }
                }), b.find(".inner-article a").removeAttr("target"), b.find('a[href="#"]').on("click", function(t) {
                    t.preventDefault()
                }), DEVICE.screen_width >= 1e3 && new FullscreenSlideshow(b), M(), U(), nt(), at(), Q(), tt())
            },
            M = function() {
                var t = b.find('*[id*="livestream"]');
                t.length > 0 && loadPlugin(PLUGINS.livestream, function() {
                    t.each(function() {
                        new LiveStream($(this))
                    })
                })
            },
            U = function() {
                var t = b.find('[id="interview"],.interview');
                t.length > 0 && loadPlugin(PLUGINS.interview, function() {
                    t.each(function() {
                        new Interview($(this))
                    })
                })
            },
            G = function() {
                return window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : !1
            },
            j = function(t, e, i) {
                if (!t || "" === t || t.length <= 2) return void("function" == typeof i && i("No content provided!"));
                var n = t;
                e && "" != e && (n = "[Lỗi] " + e + " >>>>>>> [Sửa] " + n), $.ajax({
                    type: "POST",
                    url: "http://news.zing.vn/input/grammarreport.aspx?id=" + o,
                    cache: !1,
                    data: {
                        content: n
                    }
                }).done(function(t) {
                    "function" == typeof i && i()
                }).fail(function(t, e, n) {
                    "function" == typeof i && i("Fail to report")
                })
            },
            H = function() {
                var t = G();
                t || (t = ""), t = $.trim(t);
                var e = '<p class="label">Tòa soạn rất tiếc đã để xảy ra lỗi trong quá trình biên tập. Để báo lỗi, vui lòng mô tả lỗi bạn gặp trong ô bên dưới.</p>';
                e += '<form><textarea placeholder="Nội dung báo lỗi..."></textarea></form>';
                var i = new Dialog({
                    className: "centered",
                    icon: '<span class="ti-pencil"></span>',
                    title: "Báo lỗi bài viết",
                    content: e,
                    btnConfirm: {
                        label: "Gửi báo lỗi",
                        "default": !0,
                        action: function() {
                            var e = i.getBody(),
                                n = e.find("textarea"),
                                a = n.val(),
                                o = e.find(".note");
                            "" == $.trim(a) || a.length < 4 ? (n.addClass("error"), 0 == o.length ? e.find("form").append('<p class="note error">Vui lòng nhập thông tin lỗi chi tiết.</p>') : o.addClass("error").text("Vui lòng nhập thông tin lỗi chi tiết.")) : (n.hide(), o.remove(), i.addLoader(), i.hideButton("btnConfirm"), j(a, t, function(t) {
                                t ? new Dialog({
                                    className: "centered",
                                    icon: '<span class="ti-check"></span>',
                                    title: "Đã gửi báo lỗi",
                                    content: "<p>Cám ơn bạn đã gửi báo lỗi. Tòa soạn sẽ kiểm tra và khắc phục lỗi trong thời gian sớm nhất.</p>"
                                }) : new Dialog({
                                    className: "centered",
                                    icon: '<span class="ti-check"></span>',
                                    title: "Đã gửi báo lỗi",
                                    content: "<p>Cám ơn bạn đã gửi báo lỗi. Tòa soạn sẽ kiểm tra và khắc phục lỗi trong thời gian sớm nhất.</p>"
                                })
                            }))
                        }
                    }
                })
            },
            J = function(t) {
                return t.toLowerCase().split(" ").map(function(t) {
                    return t[0].toUpperCase() + t.substr(1)
                }).join(" ")
            },
            q = function() {
                for (var t, e = i.find(".the-article-tags strong, .the-article-tags span, .the-article-tags a"), n = "", a = 0; a < e.length; a++)
                    if (t = $.trim(e.eq(a).text()), t.split(/\s+/).length < 7) {
                        n = J(t).replace(/\s+/g, "");
                        break
                    }
                return n
            },
            Z = function() {
                if (f = i.find(".the-article-share"), !(f.length > 0)) {
                    if (f = $("<ul>", {
                            "class": "the-article-share"
                        }), f.html('<li class="btnFacebook"><a href="#" title="Chia sẻ Facebook"><span class="ti-facebook"></span> Chia sẻ Facebook</a></li>'), !W()) {
                        f.append('<li class="btnRating"><span>Đánh giá:</span><a href="#" title="Rất kém" score="1"></a><a href="#" title="Bài kém" score="2"></a><a href="#" title="Bình thường" score="3"></a><a href="#" title="Bài tốt" score="4"></a><a href="#" title="Xuất sắc" score="5"></a></li>');
                        var t = f.find(".btnRating a");
                        t.hover(function() {
                            $(this).prevAll("a").addClass("highlighted"), $(this).addClass("highlighted")
                        }, function() {
                            t.removeClass("highlighted")
                        }).on("click", function(t) {
                            t.preventDefault();
                            var e = $(this);
                            if (!e.parents("li").hasClass("rated")) {
                                var i = parseInt(e.attr("score"));
                                X(i, function(t) {
                                    t || (e.parents("li").addClass("rated"), e.addClass("rated"), e.prevAll("a").addClass("rated"))
                                })
                            }
                        })
                    }
                    f.find("a").on("click", function(t) {
                        var e = $(this);
                        if (e.parents("li").hasClass("btnFacebook")) {
                            if (t.preventDefault(), window.facebook && facebook.isFBAvailable) {
                                var i = {};
                                "" != q() && (i.hashtag = "#" + q()), facebook.share(s + "#bottom", i, function(t) {})
                            }
                        } else e.parents("li").hasClass("btnGoogle") ? t.preventDefault() : e.parents("li").hasClass("btnError") && (t.preventDefault(), H())
                    }), i.find(".the-article-credit").length > 0 ? i.find(".the-article-credit").after(f) : i.find(".the-article-change-note").length > 0 ? i.find(".the-article-change-note").after(f) : b.after(f)
                }
            },
            X = function(t, e) {
                if (!t) return void("function" == typeof e && e("No rating provided!"));
                t = parseInt(t);
                var i = 2;
                3 > t && (i = 3), 5 == t && (i = 1), $.ajax({
                    type: "POST",
                    cache: !1,
                    url: "http://news.zing.vn/input/rating.aspx?id=" + o + "&value=" + i
                }).success(function() {
                    var t = storage.load("ratingList");
                    t || (t = ""), t += o + ",", storage.insert("ratingList", t), "function" == typeof e && e()
                }).fail(function(t, i, n) {
                    "function" == typeof e && e("Rate article FAIL!")
                })
            },
            W = function() {
                var t = storage.load("ratingList");
                return t ? t.search(o) >= 0 : !1
            },
            K = function() {
                if (d = i.find(".the-article-tools"), !(d.length > 0)) {
                    d = $("<ul>", {
                        "class": "the-article-tools"
                    }), d.html('<li class="btnFacebook"><a href="#" title="Chia sẻ Facebook"><span class="ti-facebook"></span></a><span class="label">Chia sẻ FB</span></li><li class="btnEmail"><a href="mailto:?subject=Tin đáng đọc từ Zing.vn&body=' + s + '" title="Chia sẻ Email"><span class="ti-email"></span></a><span class="label">Email</span></li><li class="btnError"><a href="#" title="Góp ý báo lỗi"><span class="ti-marker-alt"></span></a><span class="label">Góp ý &amp; Báo lỗi</span></li><li class="btnComment"><a href="#comments" title="Bình luận"><span class="ti-comments"></span></a><span class="label">Bình luận</span></li>');
                    var t = i.find(".the-article-header");
                    i.hasClass("layout-no-sidebar") || i.hasClass("layout-special") ? d.css({
                        top: t.position().top + t.height() + i.find(".the-article-thumbnail").height() + 300 + "px"
                    }) : d.css({
                        top: t.position().top + t.height() + 50 + "px"
                    }), d.find("li a").on("click", function(t) {
                        var e = $(this).parents("li");
                        if (e.hasClass("btnFacebook")) {
                            if (t.preventDefault(), facebook && facebook.isFBAvailable) {
                                var i = {};
                                q() && (i.hashtag = "#" + q()), facebook.share(s, i, function(t) {})
                            }
                        } else if (e.hasClass("btnFontStyle")) {
                            t.preventDefault();
                            var n = getFontSettings();
                            "sans" == n.family ? saveFontSettings({
                                family: "serif"
                            }) : saveFontSettings({
                                family: "sans"
                            })
                        } else if (e.hasClass("btnFontSize")) {
                            t.preventDefault();
                            var n = getFontSettings();
                            "regular" == n.fontsize ? (currentSize = "large", saveFontSettings({
                                fontsize: "large"
                            })) : saveFontSettings({
                                fontsize: "regular"
                            })
                        } else e.hasClass("btnError") ? (t.preventDefault(), H()) : e.hasClass("btnComment") && (t.preventDefault(), page.scrollTo($(".the-article-comment").offset().top - 100))
                    }), i.find(".the-article-header").after(d), d.scrollToFixed({
                        marginTop: 200,
                        offset: !1,
                        removeOffsets: !0,
                        limit: function() {
                            var t;
                            return t = w.offset().top + w.height() - 200
                        }
                    })
                }
            },
            Y = function(t, e) {
                if (t && 0 != t.length) {
                    var i = t.find(".section-content"),
                        n = t.find("> .article-list");
                    if (!(i.length > 0 || 0 == n.length)) {
                        i = $("<div>", {
                            "class": "section-content"
                        });
                        var a = $("<div>", {
                                "class": n.attr("class")
                            }),
                            o = $.randomize(n.find(".article-item"));
                        e || (e = 5);
                        for (var s = 0; e > s && s < o.length; s++) a.append(o.eq(s));
                        n.remove(), i.append(a), t.append(i)
                    }
                }
            },
            Q = function() {
                b.find("div.audio").each(function(t, e) {
                    var i = $(e).find('a[href*="mp3"],a[href*="wav"]');
                    if (i.length > 0) {
                        var n = i.eq(0).attr("href");
                        n && (n = n.replace(/w\d+\//i, "")), i.eq(0).after('<table class="audio" align="center"><tr><td><audio controls="" style="width: 100%;"><source src="' + n + '" type="audio/mpeg"></audio></td></tr><tr><td class="caption">' + i.eq(0).text() + "</td></tr></table>"), i.remove()
                    }
                })
            },
            tt = function() {
                b.find(".twentytwenty-container").each(function() {
                    var t = $(this).attr("data-orientation");
                    t && "verticle" == t ? $(this).twentytwenty({
                        default_offset_pct: .3,
                        orientation: "vertical"
                    }) : $(this).twentytwenty({
                        default_offset_pct: .7
                    })
                })
            },
            et = function() {
                0 != b.length && (b.find("*:not(.formatted):not(.widget)").removeAttr("style"), b.find("> p ~ br").remove(), u || b.find("> *").filter(function() {
                    var t = $(this),
                        e = t.prop("tagName").toLowerCase();
                    return "iframe" == e ? !1 : "img" == e ? !1 : "video" == e ? !1 : "audio" == e ? !1 : t.hasClass("formatted") ? !1 : t.find("img,iframe,audio,video").length > 0 ? !1 : "" == $.trim(t.text()) ? !0 : !1
                }).remove(), b.find("> *").filter(function() {
                    return 3 == this.nodeType && "" != $.trim($(this).text())
                }).wrap('<p class="auto-wrapped"></p>'), b.find("td").filter(function() {
                    return "Nhập mô tả cho ảnh" == $.trim($(this).text())
                }).remove())
            },
            it = function(t, e) {
                var i = t ? getArticleId(t) : null;
                if (!i) return void("function" == typeof e && e("Video URL not recognized!"));
                var n = Math.floor((new Date).getTime() / 1e6);
                $.ajax({
                    url: "http://news.zing.vn/api/mobile/a" + i + ".json?ts=" + n,
                    dataType: "json"
                }).done(function(t) {
                    if (t.data && t.data.length > 0) {
                        var i = $("<div>");
                        i.html(t.data[0].content);
                        var n = i.find("iframe, video");
                        n.length > 0 ? "function" == typeof e && e(null, n) : "function" == typeof e && e("No video found!")
                    } else "function" == typeof e && e("Video not found")
                }).fail(function() {
                    "function" == typeof e && e("Fail to connect to remote video")
                })
            },
            nt = function() {
                "video" != r && (b.find("video").each(function(t, e) {
                    0 == $(e).parents('[id*="livestream"]').length && new AdtimaPlayer($(e), {
                        inviewplay: !0,
                        popPlayer: !1,
                        shareLink: s
                    })
                }), b.find(".inner-video").each(function(t, e) {
                    var i = $(e),
                        n = i.find("a").attr("href");
                    n.search("http://") < 0 && (n = "http://news.zing.vn/" + n);
                    var a = i.find(".title").text(),
                        o = i.find(".summary").text(),
                        s = i.find(".cover").css("background-image").replace(/url\("|"\)/gi, "");
                    it(n, function(t, e) {
                        if (!t && e)
                            if (i.html(e), "video" == e.prop("tagName").toLowerCase() || "iframe" == e.prop("tagName").toLowerCase() && e.attr("src").search("youtube.com") > 0) {
                                new AdtimaPlayer(e, {
                                    inviewplay: !0,
                                    popPlayer: !1,
                                    poster: s,
                                    title: a,
                                    caption: o,
                                    tracking: n + "#inline-video",
                                    shareLink: n
                                })
                            } else {
                                var l;
                                l = e.attr("src").search("tv.zing.vn") > 0 || !e.attr("width") || !e.attr("height") ? Math.floor(9 * e.width() / 16) : Math.floor(e.width() * parseInt(e.attr("height")) / parseInt(e.attr("width"))), e.css({
                                    width: "100%",
                                    height: l + "px"
                                })
                            }
                    })
                }), b.find('iframe[src*="youtube.com"], iframe[src*="tv.zing.vn"]').each(function() {
                    $(this).css("height", $(this).width() / 1.78)
                }))
            },
            at = function() {
                b.find(".fbembed").each(function(t, e) {
                    var i = $(e),
                        n = i.find('a[href*="facebook.com"]');
                    if (n.length > 0) {
                        var a = $("<div>", {
                            "class": "fb-post",
                            "data-width": b.width()
                        });
                        a.attr("data-href", n.eq(0).attr("href")), i.after(a), i.remove()
                    }
                })
            },
            ot = function() {
                var t = document.getElementsByTagName("body")[0],
                    i = e.getSelection();
                if (i !== !1 && !(i.toString().length < 500)) {
                    var a = "<br /><br /> Bài viết: <a href='" + n + "' target='_blank'>" + n + "</a>",
                        o = i + a,
                        s = document.createElement("div");
                    s.style.position = "absolute", s.style.left = "-99999px", t.appendChild(s), s.innerHTML = o, i.selectAllChildren(s), window.setTimeout(function() {
                        t.removeChild(s)
                    }, 0)
                }
            };
        E()
    }
}
var READING_STREAM = [],
    KEY_READ_HISTORY = "znews_history";

function Slideshow(t, e) {
    var i, n, a, o, s, l, r = t,
        c = e,
        d = this;
    this.init = function() {
        return r = $(r), a = r.find(c), o = a.eq(0), l = r.find(".slidebox"), s = r.find(".controller a"), n = r.width(), a.css("width", n + "px"), l.css("width", a.length * n + "px"), r.hover(function() {
            d.pause(), s.fadeIn("slow")
        }, function() {
            d.start(), s.hide()
        }), r.find(".controller a").bind("click", function(t) {
            t.preventDefault(), t.stopPropagation(), $(this).hasClass("rewind") ? d.moveBack() : d.moveNext()
        }), $(window).bind("resize", function() {
            d.resize()
        }), d.start(), this
    }, this.resize = function() {
        d.pause(), n = r.width(), a.css("width", n + "px"), l.css({
            width: a.length * n + "px",
            left: "0px"
        }), d.start()
    }, this.moveNext = function() {
        var t = o.next();
        t.length > 0 ? (l.transition({
            left: "-=" + n
        }, 300), o = t) : (l.transition({
            left: 0
        }, 300), o = a.eq(0))
    }, this.moveBack = function() {
        var t = o.prev();
        t.length > 0 ? (l.transition({
            left: "+=" + n
        }, 300), o = t) : (l.transition({
            left: n * (items.length - 1)
        }, 300), o = a.eq(items.length - 1))
    }, this.start = function() {
        i && clearInterval(i), i = setInterval(function() {
            d.moveNext()
        }, 3500)
    }, this.pause = function() {
        i && clearInterval(i)
    }
};

function FullscreenSlideshow(t) {
    var e, n, i, a, o, s, l, r, c, d, h, f, p, u, m, g, v, b, w = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
        y = !0,
        C = function(e) {
            var i = h.find(".content ul");
            u = [];
            for (var a = 0, o = n.length; o > a; a++) {
                var s = {},
                    l = n.eq(a),
                    r = l.attr("src").replace(/\/w[0-9]+\//gi, "/w" + v + "/");
                t = l.parents("table"), s.src = r, s.thumbSrc = l.attr("src"), t.length > 0 && ($caption = t.find(".caption")), pos = 0 == a ? "first" : a == o - 1 ? "last" : a;
                var c = '<li class="loading" style="width:' + e + 'px" slidePos="' + pos + '"><img data-src="' + r + '" />';
                if ($caption && $caption.length > 0) {
                    var d = $caption.text();
                    d = "Nhập mô tả cho ảnh" != d ? d : "", c += '<p class="caption visible">' + d + "</p>", s.caption = d
                }
                c += "</li>", i.append(c), u.push(s)
            }
        },
        k = function(t) {
            for (var e = u.length, n = 0; e > n; n++)
                if (u[n].thumbSrc === t) return n;
            return -1
        },
        x = function(t) {
            m = t;
            var e = $(document).width();
            if (p && p.length > 0 && (p.removeClass("current"), p.find("img").src = w), p = h.find("li:eq(" + t + ")"), p.addClass("current"), !p.attr("data-loaded")) {
                var n = p.find("img");
                n.attr("src") || (n[0].onload = function() {
                    var t = this.getAttribute("src"),
                        e = $(this),
                        n = e.width(),
                        i = e.parent("li"); - 1 == t.indexOf("data:") && ($(this).parent().removeClass("loading").css("background-image", "url(" + t + ")").attr("data-loaded", 1), this.onload = null), e.height() < $(window).height() && (1920 == v && 800 > n || 1440 == v && 600 > n || 1024 == v && 400 > n) && i.addClass("noFullscreen")
                }), n[0].src = n.attr("data-src")
            }
            var o = p.attr("slidePos");
            "first" == o ? i.hide() : "last" == o && a.hide();
            var s = h.find("ul");
            s.attr("slideWidth") || s.css("width", h.find("li").length * e).attr("slideWidth", e);
            var l = -p.prevAll().length * e;
            y ? (s.css("left", l + "px"), y = !1) : s.transition({
                left: l + "px"
            }, 500, "ease", function() {
                "first" == p.attr("slidePos") ? i.hide() : "last" == p.attr("slidePos") ? a.hide() : (a.show(), i.show()), setTimeout(function() {
                    p.find(".caption").removeClass("visible")
                }, 3500)
            })
        },
        A = function(t, n) {
            v = 1024;
            var p = $(document).width();
            $("body").css("overflow", "hidden");
            var u = $(document).width();
            if (h = $("#slideshowScreen"), 0 == h.length) {
                var m = '<div id="slideshowScreen"><div class="header"></div><div class="content"><ul></ul></div><a class="btnPrevious button">Sau</a><a class="btnNext button">Trước</a><a href="javascript:page.article.slideshow_close();" class="btnClose button">Đóng</a><div id="progressbar"><span class="percent"><span></span></span><label>Tự động chiếu hình tiếp theo. <span>Nhấn chuột vào đây để dừng</span>.</label></div></div>';
                $("body").append($(m)), h = $("#slideshowScreen"), h.find("#progressbar").on("click", function() {
                    I()
                }), a = h.find(".btnNext"), i = h.find(".btnPrevious"), a.click(function(t) {
                    t.preventDefault(), T(1, !0)
                }), i.click(function(t) {
                    t.preventDefault(), T(-1, !0)
                }), h.bind("contextmenu", function() {
                    return !1
                })
            }
            f = h.find(".content"), f.find("ul").empty(), f.on("click", function(t) {
                t.preventDefault();
                var e = t.hasOwnProperty("offsetX") ? t.offsetX : t.layerX;
                e > 200 ? T(1, !0) : T(-1, !0)
            }), f.on("click", ".caption", function(t) {
                t.stopPropagation()
            }), h.find(".header").html('<a class="btnTitle">' + e.parents(".the-article").find(".the-article-title").text() + '</a><a class="btnExit ">Thoát</a><a class="btnFullscreen ">Xem toàn màn hình</a><a class="btnAutoPlay ">Tự động trình chiếu</a>'), a = h.find(".btnNext"), i = h.find(".btnPrevious"), o = h.find(".btnAutoPlay"), l = h.find(".btnTitle"), r = h.find(".btnExit"), s = h.find(".btnFullscreen"), c = h.find("#progressbar"), d = c.find(".percent span"), n || o.show(), o.on("click", function(t) {
                t.preventDefault(), _()
            }), page.isFullscreenEnable() ? s.on("click", function(t) {
                t.preventDefault(), page.launchFullScreen(document.getElementById("slideshowScreen"))
            }) : s.hide(), r.on("click", function(t) {
                t.preventDefault(), N()
            }), l.on("click", function(t) {
                t.preventDefault(), N()
            }), p > 1440 ? v = 1920 : p > 1024 && (v = 1440), C(u), 1 == t.length ? (i.hide(), a.hide()) : (i.show(), a.show());
            var g = 0;
            t.length > 0 && (g = k(t.attr("src")), g = -1 == g ? 0 : g), x(g), $(document).keydown(E), $("#slideshowScreen").show()
        },
        E = function(t) {
            39 == t.which ? T(1, !0) : 37 == t.which ? T(-1, !0) : 27 == t.which ? N() : 13 == t.which ? page.launchFullScreen(document.getElementById("slideshowScreen")) : 32 == t.which && (null == !b ? _(4e3) : I())
        },
        S = function(t) {
            g && clearTimeout(g), g = setTimeout(function() {
                c.show(), d.css("width", "0%").transition({
                    width: "100%"
                }, 2e3, "linear")
            }, t - 2e3)
        },
        _ = function(t) {
            "undefined" == typeof t && (t = 4e3), o.hide(), S(t), b && clearInterval(b), b = setInterval(function() {
                var e = h.find("li.current");
                c.hide(), "last" == $(e).attr("slidePos") ? x(0) : T(1), S(t)
            }, t)
        },
        I = function() {
            c.hide(), d.css("width", "0%"), b && clearInterval(b), g && clearTimeout(g), b = null, o.show()
        },
        T = function(t, e) {
            null != b && e && I();
            var n = $("#slideshowScreen li.current");
            if (0 != n.length) {
                var i = t > 0,
                    a = i ? n.next("li") : n.prev("li");
                a.length > 0 && (m += i ? 1 : -1, x(m))
            }
        },
        N = function() {
            y = !0, I(), $("body").css("overflow", "auto"), page.cancelFullscreen(), h.hide().remove(), $(document).unbind("keydown", E)
        },
        D = function() {
            e = t, m = 0, n = t.find("table.picture img"), n.length > 0 && n.on("mouseover", function() {
                var t = $(this),
                    e = t.parents("td").find(".btnSlideshow");
                t.parents("td").find(".fbShareImage");
                0 == e.length && (t.after('<a href="#slideshow" class="btnSlideshow">Phóng to</a>'), t.parents("td").find(".btnSlideshow").on("click", function() {
                    A(t)
                }))
            }).on("click", function() {
                A($(this))
            })
        };
    D()
};

function NewsTicker(t, e) {
    var n, i, a = this,
        o = t.find(e),
        s = function() {
            o.length > 0 && (n = o.eq(0), n.addClass("current")), t.hover(function() {
                a.pause()
            }, function() {
                a.start()
            }), t.find(".controller a").on("click", function(t) {
                t.preventDefault(), $(this).hasClass("rewind") ? a.prevItem() : $(this).hasClass("forward") && a.nextItem()
            }), a.start()
        };
    this.nextItem = function() {
        if (n && 0 != n.length) {
            var t = n.next();
            0 == t.length && (t = o.eq(0)), n.fadeOut("fast", function() {
                t.fadeIn("fast", function() {
                    n = t
                })
            })
        }
    }, this.prevItem = function() {
        if (n && 0 != n.length) {
            var t = n.prev();
            0 == t.length && (t = o.eq(o.length - 1)), n.fadeOut("fast", function() {
                t.fadeIn("fast", function() {
                    n = t
                })
            })
        }
    }, this.start = function() {
        i = setInterval(function() {
            a.nextItem()
        }, 5e3)
    }, this.pause = function() {
        clearInterval(i)
    }, s()
};

function voteFB(t, e) {
    log("Vote for poll: " + t);
    var n = $('.surveywidget[id="vote' + t + '"]').find(".option input[type='radio']:checked").attr("id");
    $('.surveywidget[id="vote' + t + '"]').find(".option input[type='radio']:checked").parents("label").text().trim();
    if (void 0 == n) return void new Dialog({
        icon: "info",
        title: "Chưa chọn",
        content: "<p>Bạn phải chọn một ý kiến để tham gia bình chọn!</p>",
        btnClose: {
            label: "Đồng ý"
        }
    });
    if (null == e) page.socialplugin.FBAvailable ? FB.getLoginStatus(function(e) {
        if ("connected" === e.status) {
            var n = e.authResponse.userID;
            e.authResponse.accessToken;
            log("User login with FB account & granted permission: " + n), FB.api("/" + n, function(e) {
                voteFB(t, e)
            })
        } else FB.login(function(e) {
            e.authResponse ? (log("Login with FB successful"), voteFB(t)) : (log("User cancelled login or did not fully authorize."), page.showDialog("Thông báo", "<p>Bạn phải đăng nhập để bình chọn!</p>"))
        }, {
            scope: "public_profile,email"
        })
    }) : voteFB(t, {
        name: "",
        email: "",
        id: "",
        link: ""
    });
    else {
        log("User vote #" + t + " with userinfo: "), log(e);
        var i = '<p>Vui lòng cung cấp thêm các thông tin địa chỉ và số điện thoại để chúng tôi liên lạc trong trường hợp trúng giải:</p><form><input type="text" id="poll_name" maxlength="25" placeholder="Họ và tên" value="' + e.name + '" required /><input type="text" id="poll_email" placeholder="Email" value="' + e.email + '" pattern="[^ @]*@[^ @]*" required /><input type="text" id="poll_address" placeholder="Địa chỉ" required  /><input type="text" id="poll_phone" placeholder="Số điện thoại" required  pattern="d{8,}" /></form>',
            a = new Dialog({
                title: "Thông tin người dùng",
                content: i,
                btnConfirm: {
                    label: "Tham gia bình chọn",
                    action: function() {
                        a.getBody(), "&userid=" + e.id + "&name=" + e.name + "&email=" + e.email + "&phone=" + $("#poll_phone").val() + "&address=" + $("#poll_address").val() + "&profile=" + e.link
                    }
                }
            });
        page.showDialog("Thông tin người dùng", "<p>Bạn vui lòng cung cấp thêm các thông tin địa chỉ và số điện thoại để chúng tôi liên lạc trong trường hợp trúng giải:</p><form><p><label>Họ và tên</label> </p><p><label>Email</label> </p><p><label>Địa chỉ</label> </p><p><label>Số điện thoại:</label> </p></form>", {
            submit: {
                text: "Tham gia bình chọn",
                action: function() {
                    window.open("/Modules/VoteResult.aspx" + params + n + user, "Kết quả bình chọn", "height=350,width=450,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no ,modal=yes"), page.socialplugin.comment("Vừa tham gia bình chọn trên Zing.vn.", page.article.getShortLink(), function(t) {
                        t ? log("Comment posted!") : log("Comment fail")
                    }), page.closeDialog()
                }
            },
            cancel: {
                text: "Đóng",
                action: function() {
                    page.closeDialog()
                }
            }
        }), "" == e.name ? $("#poll_name").focus() : ($("#poll_name").attr("disabled"), $("#poll_address").focus())
    }
}

function Poll(t) {
    if (t && 0 != t.length) {
        var e = parseInt(t.attr("id").replace("vote", ""));
        t.find("a").on("click", function(t) {
            t.preventDefault(), new Dialog({
                title: "Kết quả bình chọn",
                content: '<iframe src="http://news.zing.vn/Modules/VoteResult.aspx?voteid=' + e + '"></iframe>',
                btnClose: {
                    label: "Đồng ý"
                },
                clickClose: !0
            })
        }), t.find("label").on("click", function(t) {
            t.preventDefault(), t.stopPropagation();
            var n = $(this);
            if (n.hasClass("selected")) return void new Dialog({
                icon: "info",
                title: "Bạn đã chọn rồi",
                content: '<p>Bạn đã bình chọn cho câu hỏi này rồi và không thể chọn câu hỏi khác.</p><iframe src="http://news.zing.vn/Modules/VoteResult.aspx?voteid=' + e + '"></iframe>',
                btnClose: {
                    label: "Đồng ý"
                },
                clickClose: !0
            });
            n.addClass("selected"), n.find("input").attr("checked", "true");
            var i = n.find("input").attr("id");
            i ? new Dialog({
                title: "Xác nhận",
                content: '<iframe src="http://news.zing.vn/Modules/VoteResult.aspx?voteid=' + e + "&option=" + i + '"></iframe>',
                clickClose: !0
            }) : new Dialog({
                icon: "alert",
                title: "Lỗi",
                content: "Có lỗi xảy ra trong khi gửi bình luận. Vui lòng thử lại sau",
                btnClose: {
                    label: "Đồng ý"
                },
                clickClose: !0
            })
        })
    }
};

function TabWidget(t) {
    if (t && 0 != t.length) {
        var e = t.find(".tab-menu li"),
            n = t.find(".tab-content li"),
            i = function() {
                e.on("click", function(t) {
                    t.preventDefault(), t.stopPropagation(), $(this).attr("tab-name") && a($(this).attr("tab-name"))
                })
            },
            a = function(i) {
                e.removeClass("active"), n.removeClass("active"), t.find('li[tab-name="' + i + '"]').addClass("active")
            };
        i()
    }
};

function normalizeVietnamese(t) {
    return t = t.toLowerCase(), t = t.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a"), t = t.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e"), t = t.replace(/ì|í|ị|ỉ|ĩ/g, "i"), t = t.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o"), t = t.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u"), t = t.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y"), t = t.replace(/đ/g, "d")
}

function Page() {
    var t = this;
    this.slider = new Slideshow("section.pictures", "article"), this.init = function() {
        return o(), l(), s(), r(".scroll"), a(), i(), e(), $("img").hover(function() {
            $(this).removeAttr("title")
        }, function() {}), "category" == getPageType() && n(), t.loadLatestNews(function(t, e) {
            if (!t && e) {
                for (var n = $(".hotnews"), i = 0; i < e.length; i++) n.length > 0 && n.find("ul").append('<li><a href="' + e[i].link + '#f=hotnews" title="' + e[i].summary + '">' + e[i].title + "</a></li>");
                n.length > 0 && NewsTicker(n, "li")
            }
        }), t
    };
    var e = function() {
            var t = $(".widget.surveywidget");
            t.each(function(t, e) {
                new Poll($(e))
            })
        },
        n = function() {
            var t = ".cate_content section.cate_content";
            0 == $(t).length && (t = "section.cate_content");
            var e = $(t + " article.advertising");
            if (e.length > 0) {
                $articles = $(t + " article:not(.advertising)");
                for (var n = 0, i = e.length, a = 0, o = $articles.length; o > a && !(n >= i); a += 2) e.eq(n).insertAfter($articles.eq(a)).show(), ++n;
                for (; i > n;) e.eq(n).insertAfter($(t + " article:last-of-type")).show(), ++n
            }
        },
        i = function() {
            for (var t = $("time"), e = 0, n = t.length; n > e; e++) {
                var i = t.eq(e),
                    a = formatTime(i.attr("datetime"), {
                        friendly: i.hasClass("friendly")
                    });
                i.html(a)
            }
        },
        a = function() {
            $(".article-item .viral-count").tooltipster({
                content: "Chia sẻ",
                delay: 50,
                speed: 200,
                position: "bottom",
                theme: "zing-tooltip"
            }), $(".article-item .comment-count").tooltipster({
                content: "Bình luận",
                delay: 50,
                speed: 200,
                position: "bottom",
                theme: "zing-tooltip"
            }), $(".social.hot").tooltipster({
                content: "Chia sẻ nhiều nhất",
                delay: 50,
                speed: 200,
                position: "bottom",
                theme: "zing-tooltip"
            })
        };
    this.getPageType = function() {
        return getPageType()
    }, this.loadLatestNews = function(t) {
        var e = "localnews-latest",
            n = "http://news.zing.vn/api/mobile/newposts.json?p=1&c=10",
            i = storage.load(e);
        if (i) try {
            var a = JSON.parse(i);
            return void("function" == typeof t && t(null, a))
        } catch (o) {
            storage.clear(e)
        }
        $.ajax({
            url: n,
            dataType: "json"
        }).success(function(n) {
            "function" == typeof t && (storage.insert(e, JSON.stringify(n.data), 900), t(null, n.data))
        }).fail(function(e, n, i) {
            "function" == typeof t && t(i)
        })
    }, this.loadCategory = function(t, e) {
        $.ajax({
            url: "http://news.zing.vn/api/mobile/" + t + ".json?p=1&c=30",
            dataType: "json"
        }).success(function(t) {
            e(t.data)
        }).fail(function() {
            e()
        })
    };
    var o = function() {
            for (var t = $("article"), e = 0, n = t.length; n > e; e++) {
                var i = t.eq(e),
                    a = generateLinkTrack(i);
                i.find("> .cover a, > .article-thumbnail a, > header .title a, > header .title a").attr("href", a)
            }
            for (var o = $("article ul.relate a"), e = 0, n = o.length; n > e; e++) {
                var l = o.eq(e);
                l.attr("href", l.attr("href") + "#relate-article")
            }
            for (var s = $(".inner-article a"), e = 0, n = s.length; n > e; e++) {
                var r = s.eq(e);
                r.attr("href", r.attr("href") + "#inner-article")
            }
        },
        l = function() {
            var t = $("#searchbox"),
                e = t.find('input[type="text"]');
            e.val("").attr("placeholder", "Nhập nội dung cần tìm..."), t.submit(function() {
                var t = window.location.origin,
                    n = $.trim(e.val());
                return "" != n && "Nhập nội dung cần tìm..." != n && (n = n.replace(/\s+/gi, "-"), t += "/" + normalizeVietnamese(n) + "-tim-kiem.html"), window.location.href = t, !1
            })
        },
        s = function() {
            $toolbox = $("#toolbox");
            var e = $toolbox.find("li.toTop a"),
                n = $toolbox.find("li.email a"),
                i = $toolbox.find("li.phone a"),
                a = $("<li>", {
                    "class": "home"
                }).html('<a href="/" title="Quay về trang chủ"></a>');
            $toolbox.find("li.toTop").after(a), e.on("click", function() {
                return t.scrollTo(), !1
            }), n.on("click", function() {
                return showEmailBox(), !1
            }).attr("href", "mailto:toasoan@zing.vn"), i.on("click", function() {
                return showPhoneBox(), !1
            })
        },
        r = function(t) {
            var e = $(t);
            e.length > 0 && "desktop" == DEVICE.type && e.mCustomScrollbar({
                scrollButtons: {
                    enable: !1
                },
                mouseWheel: {
                    enable: !0
                },
                contentTouchScroll: !0,
                axis: "y",
                scrollbarPosition: "outside",
                theme: "dark",
                autoHideScrollbar: !0,
                autoDraggerLength: !0,
                alwaysShowScrollbar: !1,
                scrollInertia: 500,
                advanced: {
                    updateOnSelectorChange: !0
                }
            })
        };
    this.addBookmark = function() {
        if (window.sidebar && window.sidebar.addPanel) window.sidebar.addPanel(document.title, window.location.href, "");
        else if (window.external && "AddFavorite" in window.external) window.external.AddFavorite(location.href, document.title);
        else {
            if (window.opera && window.print) return this.title = document.title, !0;
            window.ga && ga("send", "event", "header", "Click add bookmark"), "chrome" == DEVICE.browser ? window.location.href = "https://chrome.google.com/webstore/detail/zing-plus/jagbegdddghlidpmkamknochllodpdco?hl=vi" : alert("Vui lòng bấm tổ hợp phím " + (-1 != navigator.userAgent.toLowerCase().indexOf("mac") ? "Command/Cmd" : "CTRL") + " + D để lưu trang.")
        }
    }, this.launchFullScreen = function(t) {
        t.requestFullScreen ? t.requestFullScreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullScreen && t.webkitRequestFullScreen()
    }, this.cancelFullscreen = function() {
        document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen()
    }, this.isFullScreen = function() {
        var t = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        return null != t
    }, this.isFullscreenEnable = function() {
        return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled
    }, this.scrollTo = function(t, e, n) {
        var i = t || 0;
        e || Math.abs($(window).scrollTop() - i) / 5;
        $("html, body").animate({
            scrollTop: i + "px"
        }, e, n)
    }
}
if ("function" == typeof window.onPageReady && window.onPageReady(), !validateOrigin()) {
    var site_origin = window.top.location.host;
    window.top.location.href = "http://news.zing.vn/" + window.location.pathname + "#redirected_" + site_origin
}
var fullbackground = !1,
    GA_SENT = 0,
    INITIAL_TIME = now(),
    page = new Page,
    user = new User,
    Player, scrollTimer, lastScrollPosition = 0;
if (!mode_appview && window.history && history.replaceState) {
    var cleanURL = window.location.href.replace(/#.*$/, "");
    History.replaceState({}, $(document).attr("title"), cleanURL)
}
$(document).ready(function() {
    if ("article" == getPageType() && new Article, page.init(), "desktop" == DEVICE.type) {
        var t = $("section.article_content > aside, section.cate_sidebar");
        t.css("height", $("section.article_content > article").height() + "px"), "category" != getPageType() && "article" != getPageType() || t.height() - t.find(".related").height() - t.find(".topview").height() - 20 < 600 || $("#advSkyscraper1").show(), new Menu($("#top .categories")), $(".apps a").on("click", function() {
            window.ga && ga("send", "event", "appmenu", "click", $(this).attr("href"))
        }), $("#zingheader .logo a").on("click", function() {
            $(this).attr("href", "/#headerlogo"), "/" == window.location.pathname && window.location.reload(!0)
        })
    }
}), $(window).load(function() {
    page.slider.init()
}).on("blur", function() {
    INITIAL_TIME = now()
}).on("scroll", function() {
    clearTimeout(scrollTimer), scrollTimer = setTimeout(function() {
        var t = $(window).scrollTop(),
            e = $("body");
        t > 200 ? (e.addClass("scrolled"), t > lastScrollPosition ? e.removeClass("scrollup").addClass("scrolldown") : e.removeClass("scrolldown").addClass("scrollup")) : e.removeClass("scrolldown scrollup scrolled"), lastScrollPosition = t
    }, 100)
}), "home" == getPageType() && $(window).on("focus", function() {
    var t = Math.floor((now() - INITIAL_TIME) / 6e4);
    t >= 15 && window.location.reload(!0)
});
//# sourceMappingURL=znews-dist.js.map