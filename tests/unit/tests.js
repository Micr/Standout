(function ($) {

function getEventsCount(element, event) {
	var parts,
		namespace,
		events = $._data(element[0], 'events');
	event = event || 'click';

	if (event.indexOf('.') !== -1) {
		parts = event.split('.');
		event = parts[0];
		parts.shift();
		namespace = parts.join('.');
	}

	if (events && events[event]) {
		return namespace ? $.map(events[event], function (v) {
			return v.namespace && v.namespace === namespace ? 1 : null;
		}).length : events[event].length;
	}

	return 0;
}

module('smoke test');

test('Should check for standout plugin', function () {
	expect(1);
	equal(typeof jQuery.fn.standout, 'function', 'Created a minimal plugin');
});

module('main');

test('Should check various assignments and css properties of basic elements', 11, function () {

	var overlay,
		counter = 0,
		data,
		pubsub,
		pre,
		post,
		$fixture = $( "#qunit-fixture" ),
		a = $("<div><p>sample</p><p>sample</p></div>").appendTo($fixture),
		p = a.find('p'),
		first = p.first(),
		second = p.eq(1);

	pre = getEventsCount(a);
	a.standout();
	post = getEventsCount(a);
	notEqual(pre, post, 'attached a click event handler from init function');

	data = a.data('plugin_standout');
	pubsub = data.getPubSub();

	// Only counter for now
	pubsub.on('active.props.store', function () {
		counter++;
	});

	pubsub.on('active.props.restore', function () {
		counter--;
	});

	first.click();

	overlay = a.find('.standout-overlay');
	ok(overlay.length, 'Should add an overlay');
	equal(overlay.css('position'), 'absolute', 'Overlay should have absolute position');
	ok(data.main.oldPosition, 'stored old position for main element');
	notEqual($(data.main).css('position'), 'static', 'Main element should be positioned for plugin to work');
	equal(first.css('position'), 'relative', 'Assigned a position to a click target element');
	equal(first.css('background-color'), 'rgb(255, 255, 255)', 'assigned a background color to potential stand-outs');
	ok(first.hasClass('standout-active'), 'Activation successful for this element');
	notEqual(second.css('position'), 'relative', 'Element that is not clicked doesn\'t have position');
	equal(a.css('position'), 'relative', 'Selected element should have relative/absolute position');
	ok(counter, 'Active props store happened');
	

});

test('Should change active element according to mouse position', 3, function () {

	var pre,
		post,
		counter,
		mousemove,
		$fixture = $( "#qunit-fixture" ),
		a = $("<div><p>sample</p><p>sample</p></div>").appendTo($fixture),
		p = a.find('p'),
		first = p.first(),
		firstP = $(first).offset(),
		second = p.eq(1),
		secondP = $(second).offset();

	a.standout();
	mousemove = $.Event('mousemove');

	mousemove.pageX = secondP.left + 1;
	mousemove.pageY = secondP.top + 1;

	pre = getEventsCount(a, 'mousemove.standout');
	first.click();
	post = getEventsCount(a, 'mousemove.standout');
	notEqual(pre, post, 'Mousemove event handler attached to main element');

	a.trigger(mousemove);
	// ok(!counter, 'Active props restore happened');
	ok(!first.hasClass('standout-active'), 'Leavee deactivated');
	ok(second.hasClass('standout-active'), 'Enteree activated');

});

test('Should deactivate plugin after a click on active standout and do a proper cleanup', 5, function () {

	var pre,
		post,
		active,
		overlay,
		counter = 1,
		$fixture = $( "#qunit-fixture" ),
		a = $("<div><p>sample</p><p>sample</p></div>").appendTo($fixture),
		p = a.find('p'),
		first = p.first(),
		firstP = $(first).offset(),
		second = p.eq(1),
		secondP = $(second).offset();

	a.standout();
	data = a.data('plugin_standout');
	pubsub = data.getPubSub();

	pubsub.on('active.props.store', function () {
		active = data.active.el;
	});

	pubsub.on('active.props.restore', function () {
		counter--;
	});

	first.click();
	pre = getEventsCount(a, 'mousemove.standout');
	first.click();
	post = getEventsCount(a, 'mousemove.standout');
	notEqual(pre, post, 'Mousemove event handler detached from main element');
	overlay = $('.standout-overlay');

	ok(!active.hasClass('standout-active'), 'active class removed upon deactivation');
	ok(!counter, 'active props resore happened');
	ok(!overlay.length, 'overlay removed from layout');
	ok(!data.activated, 'activated property set to false');

});

}(jQuery));
