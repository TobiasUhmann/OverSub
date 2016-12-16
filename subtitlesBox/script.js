// Shorthand for jQuery ready function
$(function() {

	// Make subtitles box resize and draggable
	$(".OverSub-box").resizable();
	$(".OverSub-box").draggable();

	/* == Button Event Handler == */
	// Settings-Button (=> Box)
	$(".OverSub-box .main .btn-box .btn-settings").click(function() {
		// If the box settings panel is open, close it
		if($(this).parents(".OverSub-box").children(".cfg-box").hasClass("cfg-box-open")) {
			$(this).parents(".OverSub-box").children(".cfg-box").animate({
				height: 0// Fancy animation
			}, function() {// Remove subtitles-open class and box-open controller class
				$(this).parents(".OverSub-box").children(".cfg-subtitles").removeClass("cfg-subtitles-open");
				$(this).parents(".OverSub-box").children(".cfg-box").removeClass("cfg-box-open");
			});
		// If the box settings panel is closed, open it
		}else {
			// Add subtitles-open class and show box settings with a fancy animation
			$(this).parents(".OverSub-box").children(".cfg-subtitles").addClass("cfg-subtitles-open");
			$(this).parents(".OverSub-box").children(".cfg-box").animate({
				height: 250// Fancy animation
			}).addClass("cfg-box-open");// Chained: Add controller class
		}
	});
	// Close-Button (=> Box)
	$(".OverSub-box .main .btn-box .btn-close").click(function() {
		$(this).parents(".OverSub-box").fadeOut("fast", function() {
			$(this).remove();// Hide box with an animation and then remove it from DOM
		});
	});

});// End ready function
