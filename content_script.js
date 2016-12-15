// -- OverSub Chrome Extension [ALPHA] --
console.log('START');

// check availability of jQuery
console.log($);

// load jQuery CSS theme
var theme = document.createElement('link');
theme.rel = "stylesheet";
theme.href = "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
document.head.append(theme);

/* == OverSub Element == */
// Create subtitles element and apply various styles and properties
// ---------- NOTE: jQuery? :) ----------------------------------------------------------
var div = document.createElement('div');
div.id = "ddd";
div.className = "ui-widget-content";

div.style.backgroundColor = "green";
div.style.color = "white";

div.style.width = "400px";
div.style.height = "100px";
div.style.padding = "0.5em";

div.style.position = "absolute";
div.style.top = "100px";
div.style.bottom = "100px";
div.style.left = "100px";
div.style.right = "100px";

document.body.appendChild(div);


// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
	//div.textContent = "MUHHHH";
} else {
	alert('The File APIs are not fully supported in your browser, sorry.');
}

/*
window.onload = addListeners;

function addListeners(){
    document.getElementById('ddd').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

addListeners();

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
    var div = document.getElementById('ddd');
  div.style.position = 'absolute';
  div.style.top = e.clientY + 'px';
  div.style.left = e.clientX + 'px';
}
*/

$('#ddd').resizable();
$('#ddd').draggable();





var input = document.createElement('input');
input.type = "file";
input.id = "input0";
input.name = "files[]";
input.multiple = true;
div.appendChild(input);

var p = document.createElement('p');
p.id = "ppp";
div.appendChild(p);

function handleFileSelect(e) {
	document.getElementById('input0').style.display = "none";
	var output = [];
	var files = e.target.files;
	for (var i = 0, f; f = files[i]; i++) {
		output.push('#' + i);
	}
	// document.getElementById('output0').innerHTML = output.join('');
	var reader = new FileReader();
	var subtitles = [];
	reader.onload = function (e) {
			console.log("LOADED");
			var data = e.target.result;
			//alert(data);
			
			
			function toSeconds(t) {
			var s = 0.0
			if(t) {
			  var p = t.split(':');
			  for(i=0;i<p.length;i++)
				s = s * 60 + parseFloat(p[i].replace(',', '.'))
			}
			return s;
		  }
			
			
			function strip(s) {
				return s.replace(/^\s+|\s+$/g,"");
			}
			srt = data.replace(/\r\n|\r|\n/g, '\n');
			srt = strip(srt);
			var srt_ = srt.split('\n\n');
			var cont = 0;
			for(s in srt_) {
				st = srt_[s].split('\n');
				if(st.length >=2) {
					n = st[0];
					i = strip(st[1].split(' --> ')[0]);
					o = strip(st[1].split(' --> ')[1]);
					t = st[2];
					if(st.length > 2) {
						for(j=3; j<st.length;j++)
						t += '\n'+st[j];
					}

					//define variable type as Object
					subtitles[cont] = {};
					subtitles[cont].number = n;
					subtitles[cont].start = toSeconds(i);
					subtitles[cont].end = toSeconds(o);
					subtitles[cont].text = t;
				}
				cont++;
			}
			
			console.log(subtitles);
			
			// time calculation:
			// time0: timestamp of last resume
			// deltaT: time delta since time0
			// totalTime: when video paused -> totalTime += deltaT and time0, deltaT are reset
			// this means that totalTime + deltaT = video play time (excluding pauses)
			var totalTime = 0;
			var time0 = Date.now();
			var deltaT;
			var paused = false;
			
			setInterval(function() {
				if (paused == false) {
					deltaT = Date.now() - time0;
					deltaT /= 1000;
					var s = deltaT + " # ";
					for (var i = 0; i < cont; i++) {
						s += subtitles[i].start + " " + subtitles[i].end + " # ";
						var ppp = document.getElementById('ppp');
						var playTime = totalTime + deltaT;
						if (parseFloat(subtitles[i].start) <= playTime &&
								playTime <= parseFloat(subtitles[i].end)) {
							ppp.innerText = /*"[" + playTime + "]" + */subtitles[i].text;
							console.log(deltaT + " #" + i + " "+ subtitles[i].text);
							//alert(deltaT + " #" + i + " "+ subtitles[i].text);
							break;
						} else {
							//console.log("deleting " + subtitles[i].start + " " + deltaT + " " +
							//		subtitles[i].end);
							ppp.innerText = /*"[" + playTime + "]" +*/ "";
						}
					}
				}
				//alert(s);
			}, 100);
			
			
			// pause on SPACE
			// handle keydown instead of keypress to receive the keydown event for SPACE
			// as the following keypress event will be intercepted by the video player
			// and not reach $(document)
			$(document).keydown(function(event) {
					if (event.which == 32) {
						console.log("SPACE");
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
	reader.readAsText(files[0]);
}

input.addEventListener('change', handleFileSelect, false);
