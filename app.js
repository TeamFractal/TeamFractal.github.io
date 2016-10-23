$(function() {
	document.body.classList.remove('ns');
	var baseGithubUrl = window.baseGithubUrl || 'https://api.github.com'; 

	function getGithub (url, data) {
		return $.ajax({
			// url: 'http://localhost/api_test/?url=' + url,
			url: baseGithubUrl + url,
			jsonp: 'callback',
			dataType: 'jsonp',
			data: data || {}
		});
	}

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

	// Commits
	var app = new Vue({
		el: '#commit_render',
		data: {
			current: 0,
			total: 0,
			repos: []
		}
	});
	window.app = app;
	getGithub('/orgs/TeamFractal/repos').done(function (res) {
		// /repos/TeamFractal/TeamFractal.github.io/commits
		res.data.forEach(function (repo) {
			repo.commits = [];
			app.repos.push (repo);

			getGithub('/repos/' + repo.full_name + '/commits').done(function (res) {
				// app.$set(repo.commits, res.data);
				res.data.slice(0, 3).forEach(function (commit) {
					commit.ssha = commit.sha.slice(0, 8);
					repo.commits.push(commit);
				});
			});
		});
	});
});