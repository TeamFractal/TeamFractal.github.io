$(function() {
	// ----- Quad easing
	$.extend(jQuery.easing, {
		easeInOutQuad: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		}
	});

	// ----- Smooth scroll
	$('a[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: target.offset().top - 70
				}, 1000, 'easeInOutQuad');
				return false;
			}
		}
	});

	// ----- Dynamic active nav-item
	var nav_items = $('#nav > li');
	function setActiveNav (item) {
		if (!item.hasClass('active')) {
			nav_items.removeClass('active');
			item.addClass('active');
		}
	}
	$(window).scroll(function () {
		var wndTop = scrollY + screen.height / 3;
		var heights = nav_items.map(function (i, item) {
			return {
				item: $(item),
				top: $($('a', item).attr('href')).offset().top
			};
		}).sort(function (a, b) {
			return b.top - a.top;
		});

		console.info(heights);

		for(var i = 0; i < heights.length; i++) {
			var item = heights[i];
			if (item.top < wndTop) {
				setActiveNav(item.item);
				return;
			}
		}
		
		setActiveNav($(nav_items[0]));
	});

	$(window).scroll();
});