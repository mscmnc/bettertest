$(document).ready(function () {

  var scrolled = 0;

  $(window).on('scroll touchmove', function () {
    $('.content').each(function () {
      if($(this).offset().top <= $('body').scrollTop()
         + $(window).height()*0.7)
      {
          $(this).animate({ opacity: 1 }, 500);
          $(this).prev().animate({width: '100px', opacity: 1}, 500);
          $(this).siblings('span:not(.timeline-date)')
            .addClass('pulse');

          var height = $(this).offset().top;
          if (scrolled < height) scrolled = height;
          else height = scrolled;
          $('.progress-line').css('height', height + 10);
      }
    });
  });
});
