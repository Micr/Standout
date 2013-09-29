(function ($) {

$(function () {
	$('.container').standout().on('click', 'p', function (e) {
		console.log(e);
		console.log($(this).position());
		console.log($(this).offset());
	});
});

}(jQuery));
