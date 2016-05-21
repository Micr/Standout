;(function ($, window, document) {

	var defaults = {
			overlayClass: 'standout-overlay',
			activeClass: 'standout-active',
			elements: ['p']
		},
		propsForActive = ['background-color', 'z-index', 'position'];

	function getObject (el, options) {
		var pubsub = $({});

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
				return this.throttle(function (e) {
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
				});
			},

			throttle: function (fn) {
				var id,
					ctx,
					event;
				return function (e) {
					e && (event = e);
					if (!id) {
						ctx = ctx || this;
						id = setTimeout(function () {
							id = null;
							fn.call(ctx, event);
						}, 100);
					}
				};
			},

			getPubSub: function () {
				return pubsub;
			},

			activate: function (el) {
				var	that = this,
					main = $(this.main.el),
					overlay = $('<div><div></div><div></div></div>').addClass(this.options.overlayClass).css({
						position: 'absolute',
						opacity: 0,
						overflowY: 'hidden',
						width: '100%',
						height: '100%',
						top: 0,
						left: 0
					});

				overlay.children().last().css('height', '100%');
				this.main.oldPosition = main.css('position');
				main.css('position', 'relative');

				main.append(overlay);
				this.makeStandOut(el).done(function () {
					that.activated = true;
					main.on('mousemove.standout', that.getRelay());
					pubsub.trigger('plugin.activated');
				});
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
					that = this,
					dfd = $.Deferred(),
					overlay = $(this.main.el).find('.' + this.options.overlayClass),
					first = overlay.children().first(),
					$el = $(el),
					props = {
						height: $el.position().top,
						marginBottom: $el.height() + parseInt($el.css('margin-bottom'), 10)
					};

				var childrenStyles = {
					opacity: this.options.overlayOpacity || 0.9,
					backgroundColor: this.options.overlayColor || '#fff'
				};
				overlay.children().css(childrenStyles);
				props.height < 0 || (props.marginBottom += parseInt($el.css('margin-top'), 10));
				function onDone() {
					that.storeActiveData($el);
					$el.css({
						'position': 'relative',
						'z-index': 1,
						'background-color':  bgcolor || 'rgba(255, 255, 255, 1)'
					}).addClass(that.options.activeClass);
					pubsub.trigger('relay.animation.done');
					dfd.resolve();
				}

				haveColor = $el.parents().filter(function () {
					return $(this).css('background-color') !== 'rgba(0, 0, 0, 0)';
				});

				haveColor.length && (bgcolor = haveColor.first().css('background-color'));
				if (this.activated) {
					first.animate(props, { duration: 80, done: onDone });
				} else {
					first.css(props);
					overlay.fadeTo('slow', 1, onDone);
				}

				return dfd.promise();

			}

		});

		return new Standout(el, options);
	}

	$.fn.standout = function (options) {
		return this.each(function () {
			$.data(this, 'plugin_standout') || $.data(this, "plugin_standout", getObject(this, options));
		});
	};

}(jQuery, window, document));
