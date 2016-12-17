/* == load jQuery CSS theme == */
var theme = document.createElement('link');
theme.rel = "stylesheet";
theme.href = "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
document.head.append(theme);

/* == OverSub Element == */
// Create subtitles element and apply various styles and properties
var div = document.createElement('div');

/*div.style.position = "absolute";
div.style.width = "400px";
div.style.height = "100px";
div.style.padding = "0.5em";

div.style.top = "100px";
div.style.left = "100px";

div.style.backgroundColor = "green";
div.style.color = "white";

$(div).resizable();
$(div).draggable();*/

// load SubBox.html
chrome.extension.sendRequest({ cmd: "read_file", file: "subtitlesBox/SubBox.html" }, 
		function (html) {
	console.log(html);
	$(div).html(html);
});

var css = chrome.extension.getURL("subtitlesBox/style.css");
$("<link rel='stylesheet' type='text/css' href='" + css + "' />").appendTo("head");

// Shorthand for jQuery ready function
$(function() {

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


document.body.appendChild(div);

var input = document.createElement('input');
input.type = "file";
div.appendChild(input);

var p = document.createElement('p');
div.appendChild(p);

$(input).change(handleFileSelect);

function handleFileSelect(e) {
	// hide <input> after file selection
	input.style.display = "none";
	
	/* parse .srt file */
	var reader = new FileReader();
	reader.onload = fileLoaded;
	
	console.log('read file');
	reader.readAsText(e.target.files[0]);
}

function fileLoaded (e) {
	console.log(".srt file loaded");
	var srtData = e.target.result;			
			
	// convert .srt time string to float value
	// e.g.: (e.g. "00:01:24,621") -> 84.621
	function toSeconds (timeString) {
		timeString = timeString.replace(',', '.');
		
		var seconds = 0.0;
		if (timeString) {
			var parts = timeString.split(':');
			for (i = 0; i < parts.length; i++)
				seconds = seconds * 60 + parseFloat(parts[i])
		}
			
		return seconds;
	}
			
	function strip (string) {
		// delete multiple whitespaces at line start ("^\s+") and line end ("\s+$")
		return string.replace(/^\s+|\s+$/g, "");
	}
			
	// parse .srt file and create array of subtitle parts
	// e.g.: subtitles = [ { number: 1, start: 17.218, end: 21.192, text: "Hello" },
	//					   { number: 2, start: 23.000, end: 24.128, text: "World" } ]
	var subtitles = [];
	
	srtData = srtData.replace(/\r\n|\r|\n/g, '\n'); // unify line breaks
	srtData = strip(srtData);
	
	var srtArray = srtData.split('\n\n');
	var count = 0;
	
	// example srtElement (4 lines):
	// 5
	// 00:00:36,542 --> 00:00:39,843
	// And now, that you know,
	// your life is in danger.
	for(index in srtArray) {
		var lines = srtArray[index].split('\n');
		if(lines.length >= 3) {
			var _number = lines[0];
			var _start = strip(lines[1].split(' --> ')[0]);
			var _end = strip(lines[1].split(' --> ')[1]);
			var _text = lines[2];
			
			// multiple lines of text possible
			if (lines.length > 3) {
				for (j = 3; j < lines.length; j++)
					_text += "\n" + lines[j];
			}

			// parse read elements of current srtElement and add them to subtitles[]
			subtitles[count] = {};
			subtitles[count].number = _number;
			subtitles[count].start = toSeconds(_start);
			subtitles[count].end = toSeconds(_end);
			subtitles[count].text = _text;
		}
		
		count++;
	}
			
	// time calculation:
	// time0: timestamp of last resume
	// deltaT: time delta since time0
	// totalTime: when video paused -> totalTime += deltaT and time0, deltaT are reset
	// e.g.: 20:15 - 20:35, 20:45 - 21:00, 21:10 - 21:30 (now) 
	//		 time0 = 21:10
	//		 deltaT = 21:30 - 21:10 = 20min
	//		 totalTime = 20min + 15min = 35min
	//		 playTime = totalTime + deltaT = totalTime + deltaT = 55min
	var totalTime = 0;
	var time0 = Date.now();
	var deltaT;
	var paused = true;
	
	// check multiple times per second if subtitle needs to be updated
	setInterval(function() {
		// no check if video is paused
		if (paused == false) {
			deltaT = Date.now() - time0;
			
			// iterate through all subtitle element and check if current playTime
			// is in thats time frame. clear subtitle text field otherwise
			for (var i = 0; i < count; i++) {
				var playTime = totalTime + deltaT;
				if (subtitles[i].start * 1000 <= playTime &&
						playTime <= subtitles[i].end * 1000) {
					p.innerText = subtitles[i].text;
					break;
				} else {
					p.innerText = "";
				}
			}
		}
	}, 100);
			
			
	// pause on SPACE
	// handle keydown instead of keypress to receive the keydown event for SPACE
	// as the following keypress event will be intercepted by the video player
	// and not reach $(document)
	$(document).keydown(function (event) {
		if (event.which == 32) {
			if (paused == true) {
				paused = false;
				
				time0 = Date.now();
				deltaT = 0;
			} else {
				paused = true;
				
				totalTime += deltaT;
			}
		}
	});		
}