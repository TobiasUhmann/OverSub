document.addEventListener('DOMContentLoaded', function () {
	var addSubtitle = document.getElementById('addSubtitle');
	var defaultSettings = document.getElementById('defaultSettings');

	addSubtitle.addEventListener('click', function() {
		chrome.tabs.executeScript(null, { file: "jquery-3.1.1.js" }, function() {
			console.log('jQuery loaded');
			
			// provide file loading service in background script as
			// Chrome's X-Origin-Policy prohibits loading from the content script
			chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
				console.log(request);
				console.log(sender);
				console.log(sendResponse);
				
				if (request.cmd == "read_file") {
					
					$.ajax({
							url: chrome.extension.getURL(request.file),
							dataType: "html",
							success: sendResponse
					});
				}
			});
			
			// run main script on website
			chrome.tabs.executeScript(null, { file: "jquery-ui.js" }, function() {
				console.log('jQuery-ui loaded');
				chrome.tabs.executeScript(null, { file: 'content_script.js' });
				//window.close();
			});
		});
	});
});