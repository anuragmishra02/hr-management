import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../imports/login/login.js';
import '../imports/user_info/userinfo.js';

Router.route('/', function(){
   this.render('login');
});

Router.route('/userinfo', function(){
   this.render('userinfo');
});


/*Doucment resize Function*/
$(window).resize(function () {
  fixedFooter();
})
/*Docuemnt load function*/
$(window).load(function () {
  fixedFooter()
  
  setTimeout(function(){
	  $('.loader').fadeOut();
	  $('.login-box').addClass('animated fadeInDown')
  }, 1000);
})
/*Ready Funtion*/
$(function () {
  fixedFooter()
  /*Back to top Function start*/
  $('body').append('<div class="scrollTop"><a href="javascript:void(0)"></a></div>');
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.scrollTop').fadeIn();
    } else {
      $('.scrollTop').fadeOut();
    }
  });
  $(document).on('click', '.scrollTop a', function () {
    $('body,html').animate({scrollTop: 0}, 800);
  });
  /*Back to top Function End*/

  /*accordion start*/
  $('.accordion dl dt').click(function () {
    var trigger = $(this);
    var target = trigger.next('dd');
    if (target.css('display') == 'none')
    {
      $('.accordion dl').removeClass('active')
      $('.accordion dl dd').slideUp();
      target.slideDown();
      trigger.parents('dl').addClass('active');
    }
    else
    {
      $('.accordion dl').removeClass('active')
      $('.accordion dl dd').slideUp();
    }
  });
  /*accordion start*/
  
  $('.profile-name-txt').click(function () {
	var statusdp=$(this).next('ul.dropdown-menu.animated').css('display');
	if(statusdp=="none")
	{
		$(this).next('ul.dropdown-menu.animated').show();
	}
	else
	{
		$('.dropdown-menu.animated').hide();
		$(this).next('ul.dropdown-menu.animated').hide();
	}
  });
  
  
  $('#upload-loc').change(function() {	
		var filenames = '';
		var filelenght='';
    		for (var i = 0; i < this.files.length; i++) {
        		filenames += '<li>' + this.files[i].name + '<span></span></li>';
			filelenght = this.files.length
   		 }
		$(".upload-filename").show();
    		$(".upload-filename").html('<ul>' +  filenames + '</ul>');
	});
	
	$(document).on('click', '.upload-filename ul li span', function(){
		$(this).parents('.upload-filename').hide();
	}); 
	
	$('.uplogingitem').change(function() {		
	var filenames = '';
	var filelenght='';
		for (var i = 0; i < this.files.length; i++) {
			filenames += this.files[i].name;
		filelenght = this.files.length
	 }
		$(this).next().next(".upload-file-path").html(filenames);
		$(this).parents('.input-type-upload').addClass('active');
    });
  $(document).on('click', '.ss-startbtn a', function(){
		$('.truck').addClass('moving-truck');
	});
  
});


function fixedFooter()
{
  $('body').css('min-height', $(window).height());
}


/*Overlay function*/
var animationIn, target, animationOut;
function overlayBox(popupID)
{
  target = $('#' + popupID)
  animationIn = target.attr('data-animation-in');
  animationOut = target.attr('data-animation-out');
  if (typeof (animationIn) == 'undefined' || animationIn === '(an empty string)' || animationIn === null || animationIn === '')
  {    
    animationIn = 'zoomIn';
  }
  if (typeof (animationOut) == 'undefined' || animationOut === '(an empty string)' || animationOut === null || animationOut === '')
  {
    animationOut = 'zoomOut';
  }
  $('body').append('<div class="overlay-bg"></div>')
  target.find('.overlay-header').append('<div class="closeBtn">X</div>');
  target.css('visibility', 'visible').css('display', 'block').find('.overlay-box').addClass('animated').addClass(animationIn);
  $(document).on('click', '.closeBtn, .close-after-sub', function () {
	$('.login-box').removeClass('fadeOutUp').addClass('fadeInup');
    $('.overlay').find('.overlay-box').removeClass('animated').removeClass(animationIn).addClass('animated ' + animationOut);
    $('body .overlay-bg').fadeOut(1000, function () {
      $(this).remove();
      $('.overlay').css('visibility', 'hidden').css('display', 'none').find('.overlay-box').removeClass('animated').removeClass(animationIn).removeClass(animationOut);
    });
	$('.login-box').fadeIn();$('.login-box').removeClass('rollOut');
  });
}

/*Overlay function end*/

$(function(){
	
	/*jQuery tabs */
	/*script for append usefull element*/
	$('.tabNav li').each(function(){
		/*$(this).css({
			'width' : (100 / ( $('li:last-child').index('li') + 1 ) ) +  '%'
		})*/
		var tabContent = $(this).html();
		var relation = $(this).find('a').attr('rel')
		var resultCnt =  $(this).parents('.tabNav').next('.tabResult');
		resultCnt.children('div#'+relation).prepend('<div class="mobile-menu">'+ tabContent +'</div>')
	})
	/*script for mobile navigation */
	$(document).on('click','.mobile-menu',function(){
		if($(this).next('.content').css('display') == 'none')
		{
			$(this).closest('.tabResult').find('.content').slideUp();
			$(this).next('.content').slideDown();
		}
		else
		{
			$('.tabResult .tabBx .content').slideUp();
		}
	})
	/*script for desktop navigation */
	$('.tabNav li a').click(function(){
		var relation = $(this).attr('rel')
		var tabNavigation = $(this).parents('.tabNav')
		var resultCnt =  $(this).parents('.tabNav').next('.tabResult');
		
		tabNavigation.children().find('a').removeClass('active');
		tabNavigation.children().find('li').removeClass('activeli')
		$(this).addClass('active');
		$(this).parents('li').addClass('activeli');
		
		if(resultCnt.children('div#'+relation).css('display') == 'none')
		{
			resultCnt.children('div').slideUp();
			resultCnt.children('div#'+relation).slideDown();
		}
		else
		{
			resultCnt.children('div#'+relation).slideUp();
		}
	})
	/*jQuery tabs end */
	$(document).on('click', '.data-action-table tbody tr', function () {
		if($(this).hasClass('active'))
		{
			$(this).removeClass('active');
			$('.data-action-table tbody tr').removeClass('active');
		}
		else
		{	$('.data-action-table tbody tr').removeClass('active');
			$(this).addClass('active');
		}
	});
	$(document).on('click', '.reject-rquest', function (e) {
		 e.stopPropagation();
		$(this).parents('tr').slideUp();
	});
	
	$(document).on('click', '.view-extradtl', function () {
		var oTop = $('.show-data-tabs').offset().top;
		$('body,html').animate({scrollTop: oTop}, 800);
	});
})