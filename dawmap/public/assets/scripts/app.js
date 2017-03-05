var App = function () {

	var handleQuickSidebarToggler = function () {
		$('.search-form .sidebar-toggler, .sidebar-left-toggler').click(function (e) {
            $('body').toggleClass('page-quick-sidebar-open');
        });
		
		$('#quick-sidebar-right-toggler, .sidebar-right-toggler').click(function() {
			if($('body').hasClass('logged-in')) {
				$('body').toggleClass('page-quick-sidebar-right-open');
			} else {
				$('#signin').modal('toggle');
			}
		});
    };

    return {
        init: function () {
            handleQuickSidebarToggler();
        },
    
	    scrollTo: function(el, offeset) {
	        var pos = (el && el.size() > 0) ? el.offset().top : 0;
	
	        if (el) {
	            pos = pos + (offeset ? offeset : -1 * el.height());
	        }
	
	        $('html,body').animate({
	            scrollTop: pos
	        }, 'slow');
	    },

    };

}();

jQuery(document).ready(function() {    
	App.init();
	
	$('#shareBtn').on('click', function(e) {
		e.preventDefault();
		var url = $(this).attr('href');
		FB.ui({
			display: 'popup',
			method: 'share',
			href: url,
		}, function(response){});
	});
});