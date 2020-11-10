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

function flexible (window, document) {
  var docEl = document.documentElement;     //获取文档根节点并保存到变量docEl中(相当于获取到html对象)
  var dpr = window.devicePixelRatio || 1;   //获取像素比，如果window.devicePixelRatio为false是dpr为1，如果window.devicePixelRatio大于1，那么dpr赋值取大的数

  function setBodyFontSize () {
    if (document.body) { //获取到body对象是否存在，个人觉得啰嗦
      document.body.style.fontSize = (12 * dpr) + 'px';
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize);
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}
flexible(window, document);



