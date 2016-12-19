document.addEventListener('DOMContentLoaded', function () {
	var addSubtitle = document.getElementById('addSubtitle');
	var defaultSettings = document.getElementById('defaultSettings');

	addSubtitle.addEventListener('click', function() {
		chrome.tabs.executeScript(null, { file: "jquery-3.1.1.js" }, function() {
			console.log('jQuery loaded');
			
			// run main script on website
			chrome.tabs.executeScript(null, { file: "jquery-ui.js" }, function() {
				console.log('jQuery-ui loaded');
				chrome.tabs.executeScript(null, { file: 'content_script.js' });
				//window.close();
			});
		});
	});
});