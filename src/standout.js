;(function ($, window, document) {

	var defaults = {
			overlayClass: 'standout-overlay',
			activeClass: 'standout-active',
			elements: ['p']
		},
		propsForActive = ['background-color', 'z-index', 'position'],
		pubsub = $({});

	function Standout (el, options) {

		this.main = { el: el };
		this.options = $.extend( {}, defaults, options );
		this.active = { oldProps: {} };
		this.init();

	}
	
	$.extend(Standout.prototype, {

		init: function () {

			var el = $(this.main.el),
				elements = this.options.elements.join(',');
			el.on('click', elements, this.getController());

		},
		
		getController: function () {
			var plugin = this;
			return function () {
				plugin.activated ? plugin.deactivate() : plugin.activate(this);
			};
		},
		
		getRelay: function () {
			var plugin = this;
			return function (e) {
				$(this).find(plugin.options.elements.join(',')).each(function () {
					if (plugin.active.el.is(this)) {
						return;
					}
					var self = $(this),
						xL = self.offset().left,
						xR = self.offset().left + self.width(),
						yL = self.offset().top,
						yR = self.offset().top + self.height();

					if ((e.pageX >= xL && e.pageX <= xR) && (e.pageY >= yL && e.pageY <= yR)) {
						plugin.restoreActiveData();
						plugin.makeStandOut(this);
						return false;
					}
				});
			};
		},

		getPubSub: function () {
			return pubsub;
		},
		
		activate: function (el) {
			var	main = $(this.main.el),
				overlay = $('<div></div>').addClass(this.options.overlayClass).css({ 
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0,
					backgroundColor: '#000'
				});

			this.main.oldPosition = main.css('position');
			main.css('position', 'relative');
			this.makeStandOut(el);

			main.append(overlay);
			this.activated = true;
			main.on('mousemove.standout', this.getRelay());
		},

		deactivate: function () {
			var	main = $(this.main.el);
			this.restoreActiveData();
			$('.' + this.options.overlayClass).remove();
			main.css('position', this.main.oldPosition);
			main.off('mousemove.standout');
			this.activated = false;

		},

		storeActiveData: function (active) {
			var that = this;
			this.active.el = active;
			$.each(propsForActive, function (i, e) {
				that.active.oldProps[e] = active.css(e);
			});
			pubsub.trigger('active.props.store');
		},

		restoreActiveData: function () {
			var that = this;
			$.each(propsForActive, function (i, e) {
				that.active.el.css(e, that.active.oldProps[e]);
			});
			this.active.el.removeClass(this.options.activeClass);
			pubsub.trigger('active.props.restore');
		},

		makeStandOut: function (el) {
			var bgcolor,
				haveColor,
				$el = $(el);

			haveColor = $el.parents().filter(function () {
				return $(this).css('background-color') !== 'rgba(0, 0, 0, 0)';
			});
			haveColor.length && (bgcolor = haveColor.first().css('background-color'));

			this.storeActiveData($el);
			$el.css({
				'position': 'relative',
				'z-index': 1,
				'background-color':  bgcolor || 'rgba(255, 255, 255, 1)'
			}).addClass(this.options.activeClass);
			
		}

	});

	$.fn.standout = function (options) {
		return this.each(function () {
			$.data(this, 'plugin_standout') || $.data(this, "plugin_standout", new Standout(this, options));
		});
	};

}(jQuery, window, document));
