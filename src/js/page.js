$(".big-button2").click(function() {
    $('html,body').animate({
        scrollTop: $(".Interface-page").offset().top},
        'slow');
});

$(document).ready(function() {

    //activate wow.js
     new WOW().init();

    //activate fullpage.js
    $('#fullpage').fullpage({
      scrollBar: true,
      scrollingSpeed: 900,
      navigation: true,
      showActiveTooltip: true,
      slidesNavigation: true,
      //responsiveWidth: 480,
      navigationTooltips: ['Home', 'Mobile App', 'Desktop platform', 'User Interface', 'Our team', 'Roadmap', 'Whitepaper', 'Press', 'Contacts'],
      loopBottom: false,
      sectionSelector: 'section'
    });

});

// Get in touch
function validateForm() {
    var n = document.getElementById('name').value;
    var e = document.getElementById('email').value;
    var s = document.getElementById('subject').value;
    var m = document.getElementById('message').value;
    var onlyLetters =/^[a-zA-Z\s]*$/;
    var onlyEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if(n == "" || n == null){
        document.getElementById('nameLabel').innerHTML = ('Please enter your name');
        document.getElementById('name').style.borderColor = "red";
        return false;
    }


    if (!n.match(onlyLetters)) {
        document.getElementById('nameLabel').innerHTML = ('Please enter only letters');
        document.getElementById('name').style.borderColor = "red";
        return false;
    }

    if(e == "" || e == null ){
          document.getElementById('emailLabel').innerHTML = ('Please enter your email');
          document.getElementById('email').style.borderColor = "red";
          return false;
      }

    if (!e.match(onlyEmail)) {
        document.getElementById('emailLabel').innerHTML = ('Please enter a valid email address');
        document.getElementById('email').style.borderColor = "red";
        return false;
    }

    if(s == "" || s == null ){
          document.getElementById('subjectLabel').innerHTML = ('Please enter your subject');
          document.getElementById('subject').style.borderColor = "red";
          return false;
      }

    if (!s.match(onlyLetters)) {
        document.getElementById('subjectLabel').innerHTML = ('Please enter only letters');
        document.getElementById('subject').style.borderColor = "red";
        return false;
    }

    if(m == "" || m == null){
        document.getElementById('messageLabel').innerHTML = ('Please enter your message');
        document.getElementById('message').style.borderColor = "red";
        return false;
    }

    else{
          return true;
      }

}

// Loader

$(function() {
  var current_progress = 0;
  var interval = setInterval(function() {
      current_progress += 10;
      $("#dynamic")
      .css("width", current_progress + "%")
      .attr("aria-valuenow", current_progress)
      .text(current_progress + "% Complete");
      if (current_progress >= 100)
          clearInterval(interval);
  }, 1000);
});

// clock
    var ringer = {
        countdown_to: "10/25/2018",
      rings: {
        'DAYS': {
          s: 86400000, // mseconds in a day,
          max: 365
        },
        'HOURS': {
          s: 3600000, // mseconds per hour,
          max: 24
        },
        'MINUTES': {
          s: 60000, // mseconds per minute
          max: 60
        },
        'SECONDS': {
          s: 1000,
          max: 60
        }
       },
      r_count: 4,
      r_spacing: 30, // px
      r_size: 120, // px
      r_thickness: 10, // px
      update_interval: 11, // ms


      init: function(){

        $r = ringer;
        $r.cvs = document.createElement('canvas');

        $r.size = {
          w: ($r.r_size + $r.r_thickness) * $r.r_count + ($r.r_spacing*($r.r_count-1)),
          h: ($r.r_size + $r.r_thickness)
        };



        $r.cvs.setAttribute('width',$r.size.w);
        $r.cvs.setAttribute('height',$r.size.h);
        $r.ctx = $r.cvs.getContext('2d');
        $(".countdowntimewrap").append($r.cvs);
        $r.cvs = $($r.cvs);
        $r.ctx.textAlign = 'center';
        $r.actual_size = $r.r_size + $r.r_thickness;
        $r.countdown_to_time = new Date($r.countdown_to).getTime();
        $r.cvs.css({ width: $r.size.w+"px", height: $r.size.h+"px" });
        $r.go();
      },
      ctx: null,
      go: function(){
        var idx=0;

        $r.time = (new Date().getTime()) - $r.countdown_to_time;


        for(var r_key in $r.rings) $r.unit(idx++,r_key,$r.rings[r_key]);

        setTimeout($r.go,$r.update_interval);
      },
      unit: function(idx,label,ring) {
        var x,y, value, ring_secs = ring.s;
        value = parseFloat($r.time/ring_secs);
        $r.time-=Math.round(parseInt(value)) * ring_secs;
        value = Math.abs(value);

        x = ($r.r_size*.5 + $r.r_thickness*.5);
        x +=+(idx*($r.r_size+$r.r_spacing+$r.r_thickness));
        y = $r.r_size*.5;
        y += $r.r_thickness*.5;


        // calculate arc end angle
        var degrees = 360-(value / ring.max) * 360.0;
        var endAngle = degrees * (Math.PI / 180);

        $r.ctx.save();

        $r.ctx.translate(x,y);
        $r.ctx.clearRect($r.actual_size*-0.5,$r.actual_size*-0.5,$r.actual_size,$r.actual_size);

        // first circle
        $r.ctx.strokeStyle = "rgba(56,165,169,0.2)";
        $r.ctx.beginPath();
        $r.ctx.arc(0,0,$r.r_size/2,0,2 * Math.PI, 2);
        $r.ctx.lineWidth =$r.r_thickness;
        $r.ctx.stroke();

        // second circle
        $r.ctx.strokeStyle = "rgba(56,165,169, 0.8)";
        $r.ctx.beginPath();
        $r.ctx.arc(0,0,$r.r_size/2,0,endAngle, 1);
        $r.ctx.lineWidth =$r.r_thickness;
        $r.ctx.stroke();

        // label
        $r.ctx.fillStyle = "rgb(211,211,211)";

        $r.ctx.font = '10px Palanquin';
        $r.ctx.fillText(label, 0, 23);
        $r.ctx.fillText(label, 0, 23);

        $r.ctx.font = 'bold 40px Palanquin';
        $r.ctx.fillText(Math.floor(value), 0, 10);

        $r.ctx.restore();
      }
    }

    ringer.init();


// Round and math
$('#inputAmountBuyToken').keyup(calculate);
function calculate(e) {
  var maths = $('#inputAmountBuyToken').val() * 1000;
  //var maths2 = (Math.round(maths * 100)/100).toFixed(2);
  $('p#sum').text(maths);
};


// Show, hide

$('.show-buy').click(function() {
    $('.buy-better-token').show();

});
$('.close').click(function() {
    $('.buy-better-token').fadeOut('slow');

});

$('.proc-buy').click(function() {
    $('.buy-better-token').delay(1500).fadeOut('slow');

});



$('.show-transfer').click(function() {
    $('.transfer-better-tokens').show();

});
$('.close-transfer').click(function() {
    $('.transfer-better-tokens').fadeOut('slow');

});

$('.proc-transfer').click(function() {
    $('.transfer-better-tokens').delay(1500).fadeOut('slow');

});

$('.show-donate').click(function() {
    $('.donate-eth').show();

});
$('.close-donate').click(function() {
    $('.donate-eth').fadeOut('slow');

});

$('.proc-donate').click(function() {
    $('.donate-eth').delay(1500).fadeOut('slow');

});



$('.story-1').click(function(){
    $('.story-1-short').toggle();
});

$('.story-2').click(function(){
    $('.story-2-short').toggle();
});

 $('.story-3').click(function(){
    $('.story-3-short').toggle();
 });

 // Mobile menu
 let mobileMenu = document.getElementById("mobileMenu-button");

 mobileMenu.addEventListener("click", (e) => {
   e.preventDefault();
   document.body.classList.toggle("open");
   mobileMenu.classList.toggle("open");
 });


 $("#navH").click(function() {
     $('html,body').animate({
         scrollTop: $("#section1-background").offset().top},
         'slow');

 });


 $("#navM").click(function() {
     $('html,body').animate({
         scrollTop: $("#section2-background").offset().top},
         'slow');
 });

 $("#navD").click(function() {
     $('html,body').animate({
         scrollTop: $("#section3-background").offset().top},
         'slow');
 });

 $("#navU").click(function() {
     $('html,body').animate({
         scrollTop: $("#section4-background").offset().top},
         'slow');
 });

 $("#navO").click(function() {
     $('html,body').animate({
         scrollTop: $("#section5-background").offset().top},
         'slow');
 });

 $("#navR").click(function() {
     $('html,body').animate({
         scrollTop: $("#section6-background").offset().top},
         'slow');
 });

 $("#navW").click(function() {
     $('html,body').animate({
         scrollTop: $("#section7-background").offset().top},
         'slow');

 }); $("#navP").click(function() {
      $('html,body').animate({
          scrollTop: $("#section8-background").offset().top},
          'slow');
  });

$("#navC").click(function() {
 $('html,body').animate({
   scrollTop: $("#section9-background").offset().top},
   'slow');
 });
