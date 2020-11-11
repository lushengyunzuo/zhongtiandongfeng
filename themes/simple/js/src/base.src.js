$(document).ready(function () {
  $(".headernav").children().eq(0).click(function (e) {
    e.preventDefault();
    if ($(".menu_ul").css("display") == "none") {
      $(".iphone").css("overflow", "visible")
      $(".menu_ul").slideDown();
    } else {
      $(".menu_ul").slideUp();
      if ($(".menu_ul").css("display") == "0") {//判断是否全部缩上去
        $(".iphone").css("overflow", "hidden")
      }
    }
  });
  // 二级导航
  $(".menu_li").click(function () {
    if ($(".menu_two").eq($(this).index()).css("display") == "none") {
      $(".menu_li_a .iconfont").eq($(this).index()).css("transform", "rotate(90deg)")
      $(this).siblings().slice(0).slideUp();
      $(".menu_two").eq($(this).index()).slideDown()
    } else {
      $(".menu_two").eq($(this).index()).slideUp()
      $(".menu_li_a .iconfont").eq($(this).index()).css("transform", "rotate(0)")
      $(this).siblings().slideDown()
    }
  })

  $(".headernav ").children().eq(3).click(function () {
    if ($(".menu_ul").css("display") == "block") {
      $(".menu_ul").slideUp();
      if ($(".menu_ul").css("display") == "0") {//判断是否全部缩上去
        $(".iphone").css("overflow", "hidden")
      }
    }
    $(".magnifier").fadeIn();
  })
  $(".magnifier").children().eq(0).click(function () {
    $(".magnifier").fadeOut();
  })
  $(".headernav ").children().eq(1).click(function () {
    $(".switch").slideDown();
  })
  $(".switch").children(".iconfont").click(function () {
    $(".switch").slideUp()
  })


});
$(function () {
  //手机端底部
  $(".mp_bottom_up_item_icon").click(function () {
    var $this = $(this);
    var thing = $(this).hasClass("up")
    if (thing) {
      $this.css("transform", "rotate(90deg)")
      $(this).removeClass("up").addClass("down")
    }
    else {
      $this.css("transform", "rotate(0)")
      $(this).removeClass("down").addClass("up")
    }
    $(this).parent().find(".mp_bottom_up_item_href_group").slideToggle();
  })
})
