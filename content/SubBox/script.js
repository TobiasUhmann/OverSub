// Shorthand for jQuery ready function
console.log(document.head);
$(function () {

	$(".OverSub-box").resizable();
	$(".OverSub-box").draggable();

	/* == Button Event Handler == */
	// Settings (Box)
	$(".OverSub-box .main .btn-box .btn-settings").click(function() {
		if($(this).parents(".OverSub-box").children(".cfg-box").hasClass("cfg-box-open")) {
			$(this).parents(".OverSub-box").children(".cfg-box").animate({
				height: "0"
			}, function() {
				$(this).parents(".OverSub-box").children(".cfg-subtitles").removeClass("cfg-subtitles-open");
				$(this).parents(".OverSub-box").children(".cfg-box").removeClass("cfg-box-open");
			});
			console.log("is now hidden");
		}else {
			$(this).parents(".OverSub-box").children(".cfg-subtitles").addClass("cfg-subtitles-open");
			$(this).parents(".OverSub-box").children(".cfg-box").animate({
				height: "250"
			}).addClass("cfg-box-open");
			console.log("is now visible");
		}
		// $(this).parents(".OverSub-box").children(".cfg-box").slideToggle("fast");
	});
	// Close (Box)
	$(".OverSub-box .main .btn-box .btn-close").click(function() {
		$(this).parents(".OverSub-box").fadeOut("fast", function() {
			$(this).remove();
		});
	});

});
