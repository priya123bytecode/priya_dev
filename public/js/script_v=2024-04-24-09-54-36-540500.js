/* JAVASCRIPT */
/* PAGE: Natsana */
/* AUTHOR: hyperstud.io */

var ismobile = false;

var responsive = 0;

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  ismobile = true;
}

var isMoving = false;

var introStep = 0;

var countingTimer = null;
var introTimer = null;
var movingTimer = null;

var lastST = 0;

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, "g"), replace);
}

function freezeScroll() {
  var scrollPosition = $(document).scrollTop();

  var html = $("html");
  //html.attr('scroll-position', scrollPosition);

  html.css("overflow", "hidden");

  if (ismobile == true) {
    $("#wrapper").on("touchmove", function (e) {
      e.preventDefault();
    });
  }
}

function unfreezeScroll() {
  var html = $("html");
  var scrollPosition = html.attr("scroll-position");

  html.removeAttr("style");

  if (ismobile == true) {
    $("#wrapper").off("touchmove");
  }

  //$(document).scrollTop(scrollPosition);
}

function transform($target, left, top) {
  $target
    .css("-webkit-transform", "translate(" + left + "px," + top + "px)")
    .css("-moz-transform", "translate(" + left + "px," + top + "px)")
    .css("transform", "translate(" + left + "px," + top + "px)");
}

function initGDPR() {
  var cookiesEnabled = Cookies.get("bannerAgreed");

  if (!cookiesEnabled || cookiesEnabled == "undefined") {
    if ($("#banner").length == 0) {
      var banner =
        '<div id="banner"><div class="wrapper"><span class="notification p1">Like most of the websites you visit, www.berlinmastersfoundation.com also uses cookies to improve the user experience on both single and repeated visits to the website. As a result you can switch quickly and easily between the pages, save your preferences.</span><a href="' +
        BASE +
        '/page/privacy-policy" target="_self" class="btn privacy">Privacy Policy</a><div class="agree btn">Accept</div></div></div>';

      $("body").append(banner);

      setTimeout(function () {
        $("#banner").addClass("trans");
      }, 400);

      $("#banner .agree").on("click", function () {
        $("#banner").removeClass("trans");
        setTimeout(function () {
          $("#banner").remove();
        }, 400);

        Cookies.set("bannerAgreed", "true");
      });
    }
  }
}

// RESPONSIVE

function setResponsive(res) {
  var bodyID = $("body").attr("id");

  var ST = $(document).scrollTop();
  var wHeight = $(window).height();

  if (res == 1) {
    var result = $("header nav a").sort(function (a, b) {
      var contentA = parseInt($(a).data("sortid"));
      var contentB = parseInt($(b).data("sortid"));
      return contentA < contentB ? -1 : contentA > contentB ? 1 : 0;
    });

    $("header nav").html(result);
  } else {
    $("header").removeClass("open").show();

    var result = $("header nav a").sort(function (a, b) {
      var contentA = parseInt($(b).data("sortid"));
      var contentB = parseInt($(a).data("sortid"));
      return contentA < contentB ? -1 : contentA > contentB ? 1 : 0;
    });

    $("header nav").html(result);

    $("header nav a").removeClass("selected");
  }

  if (!$("body").hasClass("introAnimation") && ST > wHeight) {
    $(window).off("mousewheel.sticky");
    $("body").removeClass("overflowhidden");

    clearTimeout(movingTimer);
    isMoving = false;

    bindProductDetection();
  }
}

function activateResponsive() {
  $(window)
    .on(
      "resize.responsive",
      function () {
        var windowWidth = $(window).width();

        if (windowWidth <= 768) {
          responsive = 1;
        } else {
          responsive = 0;
        }

        setResponsive(responsive);
      },
      200
    )
    .trigger("resize.responsive");
}

function scrollToTop(callback) {
  $("footer").addClass("invisible");

  $("body, html")
    .stop()
    .animate(
      {
        scrollTop: "0px",
      },
      400
    )
    .promise()
    .done(function () {
      resetProducts();
      callback();
    });
}

function scrollToSection(url, callback) {
  if (url != "kontakt") {
    $("footer").addClass("invisible");
  }

  $target = $('section[data-slug="' + url + '"]').first();

  if ($target && $target != undefined) {
    var newTop = $target.offset().top + 2;

    $("body,html").animate(
      {
        scrollTop: newTop + "px",
      },
      400,
      function () {
        if (callback) {
          resetProducts();
          callback();
        }
      }
    );
  }
}

function resetProducts() {
  var $productFirst = $(".product").first();

  $(".product .onehalf.second img.product-img").addClass("no-delay");

  if ($(document).scrollTop() <= $productFirst.offset().top) {
    $(".product").removeClass("ani");
  } else if (
    $(document).scrollTop() >=
    $productFirst.offset().top + $productFirst.innerHeight()
  ) {
    $(".product").addClass("ani");
  }

  setTimeout(function () {
    $(".product .onehalf.second img.product-img").removeClass("no-delay");
  }, 400);
}

function showMenu() {
  if (responsive != 0) {
    freezeScroll();
    $("#mobile").addClass("active");
    $("header").addClass("open").stop().fadeIn(400);
    $("header nav").addClass("open");
  }
}

function hideMenu() {
  if (responsive != 0) {
    unfreezeScroll();
    $("#mobile").removeClass("active");
    $("header").removeClass("open");
    $("header nav").removeClass("open");
    $("header").stop().fadeOut(400);
  }
}

function startPage() {
  unbindSwipe();
  clearTimeout(introTimer);
  $("body").removeClass("overflowhidden");
  $("#intro").addClass("ani-out");
  $("header").removeClass("out");

  $(".sticky-container:not(.head)").hide();
  $('section[data-slug="was"] .bg').show();

  bindScrollHeader();
}

function nextIntroStep() {
  unbindSwipe();
  $("body").removeClass("introAnimation");
  $("#intro").addClass("ani-out").removeClass("ani ani-in");

  clearTimeout(introTimer);
  introTimer = setTimeout(function () {
    $("header").removeClass("out");

    selectMenu($("header nav a").last().data("slug"));

    var newTop = $("main section.module").first().offset().top;

    $("body,html")
      .stop()
      .animate(
        {
          scrollTop: newTop + "px",
        },
        800
      )
      .promise()
      .done(function () {
        startPage();
      });
  }, 1000);
}

function bindSwipe() {
  if (ismobile == false) {
    isMoving = false;

    $(window)
      .off("mousewheel.intro")
      .on("mousewheel.intro", function (event) {
        if (isMoving) return;

        if (event.deltaY > 0) {
        } else if (event.deltaY < 0) {
          nextIntroStep();
        }
      });

    $(window)
      .off("click.intro")
      .on("click.intro", function () {
        nextIntroStep();
      });
  } else {
    $("#wrapper").swipe({
      swipe: function (
        event,
        direction,
        distance,
        duration,
        fingerCount,
        fingerData
      ) {
        if (direction == "down") {
        } else if (direction == "up") {
          nextIntroStep();
        }
      },
    });

    /*
		$(window).off('click.intro').on('mouseup.intro', function(){

			nextIntroStep();

		});*/
  }
}

function unbindSwipe() {
  if (ismobile == false) {
    $(window).off("mousewheel");
    $(window).off("click.intro");
  } else {
    $("#wrapper").swipe("destroy");
    //$(window).off('click.intro');
  }
}

function numberDown(target) {
  var current = parseInt(target.html());

  var currentDif = (100 - current) * 0.1;

  var speed = Math.pow(2, currentDif) * 0.1;

  if (speed < 20) {
    speed = 20;
  }

  if (current == 5 || current == 4) {
    speed = 100;
  } else if (current == 3) {
    speed = 200;
  } else if (current == 2) {
    speed = 400;
  }

  if (current > 0) {
    current -= 1;

    target.html(String(current));

    countingTimer = setTimeout(function () {
      numberDown(target);
    }, speed);
  }
}

function bindScrollHeader() {
  $(document)
    .off("scroll.header")
    .on("scroll.header", function () {
      var ST = $(document).scrollTop();
      var wHeight = $(window).height();

      if (ST < wHeight) {
        $("header nav a").removeClass("selected");

        if (ST < 2) {
          unbindScrollHeader();
          $(document).scrollTop(0);
          $("body").addClass("overflowhidden");

          $("#intro").addClass("ani-in").removeClass("ani-out");
          $("header").addClass("out");

          $(".sticky-container:not(.head)").show();
          $('section[data-slug="was"] .bg').hide();

          bindSwipe();
        }
      }
    });
}

function unbindScrollHeader() {
  $(document).off("scroll.header");
}

function bindScroll() {
  $(document)
    .off("scroll.default")
    .on("scroll.default", function () {
      var ST = $(document).scrollTop();
      var wHeight = $(window).height();

      // select menu

      $($("section.module").get().reverse()).each(function () {
        var slug = $(this).data("slug");

        if (
          $('header nav a[data-slug="' + slug + '"]').length &&
          ST >= $(this).offset().top
        ) {
          if (responsive == 0) {
            selectMenu(slug);
          }

          return false;
        }
      });

      $("section.module").each(function () {
        var moduleTop = $(this).offset().top;
        var mHeight = $(this).innerHeight();

        // animate
        if (ST + wHeight >= moduleTop && ST < moduleTop + mHeight) {
          if (
            $(this).hasClass("style-3") &&
            $(this).hasClass("has-animation")
          ) {
            // animate
            var dif = (ST - moduleTop) / (mHeight / 2);
            var top = 20 - dif.toFixed(2) * 60;
            transform($(this).find(".title"), 0, top);
          }

          if ($(this).hasClass("has_parallax")) {
            var bgTop = (ST - $(this).offset().top) / wHeight;
            var newTop = ((wHeight * bgTop) / (wHeight + 200)) * -200;

            transform($(this).find(".bg .img"), 0, newTop);
          }
        }

        // mehrwert

        if ($(this).hasClass("style-12")) {
          if (ST + wHeight / 2 >= moduleTop) {
            if (!$(this).hasClass("counting")) {
              $(this).addClass("counting");

              $this = $(this).find(".graph .percent .number");

              setTimeout(function () {
                numberDown($this.first());
              }, 200);
            }
          } else if (ST < moduleTop - wHeight && $(this).hasClass("counting")) {
            clearTimeout(countingTimer);

            $("section.module.style-12 .graph span").addClass("no-delay");
            $("section.module.style-12").removeClass("counting");
            $(".graph .percent .number").html(100);
            setTimeout(function () {
              $("section.module.style-12 .graph span").removeClass("no-delay");
            }, 200);
          }
        }

        // footer fix

        if (
          responsive == 0 &&
          ismobile == false &&
          !$("body").is(":animated")
        ) {
          if ($(this).data("slug") == "kontakt" && ST >= $(this).offset().top) {
            $("footer").removeClass("invisible");
          } else {
            $("footer").addClass("invisible");
          }
        }
      });

      $(".trans").each(function () {
        var top = $(this).offset().top;
        var offset = wHeight - 100;

        if (ST + offset >= top) {
          $(this).addClass("animated");
        } else {
          $(this).removeClass("animated");
        }
      });
    })
    .trigger("scroll.default");
}

function bindProductDetection() {
  $(document)
    .off("scroll.products")
    .on("scroll.products", function () {
      var ST = $(document).scrollTop();
      var wHeight = $(window).height();

      if (responsive == 0) {
        $($(".product").get().reverse()).each(function () {
          // sticky

          if (
            ST >= $(this).offset().top &&
            ST < $(this).offset().top + $(this).innerHeight()
          ) {
            if ($(this).is(":last-child") && ST > $(this).offset().top + 70) {
              return false;
            }

            $(document).off("scroll.products");

            $("body").addClass("overflowhidden");

            if ($(this).index() == 0) {
              //$(document).scrollTop($(this).offset().top);

              var firstTop = $(this).offset().top;

              $("body,html")
                .stop()
                .animate(
                  {
                    scrollTop: firstTop + "px",
                  },
                  200
                );

              $(this).addClass("ani");
            } else if ($(this).is(":last-child")) {
              var lastTop = $(this).offset().top;

              $("html,body")
                .stop()
                .animate(
                  {
                    scrollTop: lastTop + "px",
                  },
                  400
                );
            }

            clearTimeout(movingTimer);
            isMoving = true;

            movingTimer = setTimeout(function () {
              isMoving = false;
            }, 1200);

            bindStickyProducts();

            return false;
          }
        });
      } else {
        $(".product").each(function () {
          if (ST + wHeight - 200 >= $(this).offset().top) {
            $(this).addClass("ani");
          } else {
            $(this).removeClass("ani");
          }
        });
      }
    })
    .trigger("scroll.products");
}

function bindStickyProducts() {
  $(window)
    .off("mousewheel.sticky")
    .on("mousewheel.sticky", function (event) {
      if (isMoving) return;

      isMoving = true;

      var $product = null;

      $($(".product").get().reverse()).each(function () {
        if (
          $(document).scrollTop() >= $(this).offset().top - 1 &&
          $(document).scrollTop() < $(this).offset().top + $(this).innerHeight()
        ) {
          $product = $(this);
          return false;
        }
      });

      if ($product != null && $product.length > 0) {
        if (event.deltaY > 0) {
          setTimeout(function () {
            $product.removeClass("ani");
          }, 200);

          var newTop = $product.offset().top - $product.innerHeight();

          $("body,html")
            .stop()
            .animate(
              {
                scrollTop: newTop + "px",
              },
              800
            )
            .promise()
            .done(function () {
              clearTimeout(movingTimer);

              movingTimer = setTimeout(function () {
                isMoving = false;
              }, 400);

              // remove if first:

              if (newTop < $(".product").first().offset().top) {
                $(window).off("mousewheel.sticky");
                $("body").removeClass("overflowhidden");
                bindProductDetection();
              }
            });
        } else if (event.deltaY < 0) {
          var newTop = $product.offset().top + $product.innerHeight();

          $product.next().addClass("ani");

          $("body,html")
            .stop()
            .animate(
              {
                scrollTop: newTop + "px",
              },
              800
            )
            .promise()
            .done(function () {
              clearTimeout(movingTimer);

              movingTimer = setTimeout(function () {
                isMoving = false;
              }, 400);

              // remove if last:

              if (
                newTop >=
                $(".product").last().offset().top +
                  $(".product").last().innerHeight() -
                  1
              ) {
                $(window).off("mousewheel.sticky");
                $("body").removeClass("overflowhidden");
                bindProductDetection();
              }
            });
        }
      }
    });
}

function selectMenu(url) {
  if (url != undefined) {
    var $target = $('header nav a[data-slug="' + url + '"]').first();

    var $border = $("header #border");

    if ($target.length > 0) {
      var borderWidth = $target.innerWidth();

      var left = 0;

      $("header nav a").each(function () {
        if ($(this).data("slug") == url) {
          return false;
        }

        left += $(this).innerWidth() + 20;
      });

      $border.css("width", borderWidth + "px").css("left", left + "px");
    }
  }
}

$(document).ready(function () {
  activateResponsive();

  $(document).scrollTop(0);

  page("/:url", function (ctx) {
    var url = ctx.params.url;

    hideMenu();

    clearTimeout(introTimer);
    clearTimeout(movingTimer);
    isMoving = false;
    $(document).off("scroll.products");
    $(window).off("mousewheel.sticky");

    $("main").imagesLoaded(function () {
      scrollToSection(url, function () {
        startPage();

        bindProductDetection();
      });
    });
  });

  page("/", function () {
    $(document).off("scroll.products");
    $(window).off("mousewheel.sticky");
    clearTimeout(movingTimer);
    isMoving = false;

    if ($("body").hasClass("introAnimation")) {
      scrollToTop(function () {
        $("#intro-animation").addClass("start");

        setTimeout(function () {
          $("#intro-animation").remove();
          $("#intro").addClass("ani");

          setTimeout(function () {
            introStep = 1;
            bindSwipe();
            bindProductDetection();
          }, 400);
        }, 2600);
      });
    } else {
      scrollToTop(function () {
        bindProductDetection();
      });
    }
  });

  if ($("body").attr("id") != "page") {
    $("#preloader").imagesLoaded(function () {
      page.start();
    });

    bindScroll();

    $(document).on("click", ".employee.more", function () {
      var $target = $(this).closest(".employees");

      if (!$target.hasClass("open")) {
        $target.addClass("open");

        $target.find(".employee").removeClass("invisible");

        $target
          .find(".employee.more .plus")
          .html($target.find(".employee.more .plus").data("open"));
      } else {
        $target.removeClass("open");

        var targetTop =
          $target.find(".employee").eq(9).first().offset().top - 40;

        $("body,html")
          .animate(
            {
              scrollTop: targetTop + "px",
            },
            400
          )
          .promise()
          .done(function () {
            $target.find(".employee:not(.more)").slice(9).addClass("invisible");
          });

        $target
          .find(".employee.more .plus")
          .html($target.find(".employee.more .plus").data("text"));
      }
    });

    $(document).on("click", ".job .title", function () {
      var $target = $(this).parent();

      if (!$target.hasClass("open")) {
        $(".jobs .job.open").removeClass("open").find(".content").slideUp(400);

        $target.addClass("open");

        $target.find(".content").slideDown(400);
      } else {
        $target.removeClass("open");

        $target.find(".content").slideUp(400);
      }
    });

    $('section.module[data-slug="kontakt"] a').each(function () {
      var html = $(this).html();
      html = replaceAll("@", '<span class="at">@</span>', html);

      $(this).html(html);
    });

    $(document).on("click", "#mobile", function () {
      if (!$("header").hasClass("open")) {
        showMenu();
      } else {
        hideMenu();
      }
    });
  }
});
