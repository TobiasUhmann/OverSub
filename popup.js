document.addEventListener('DOMContentLoaded', function () {
		var addSubtitle = document.getElementById('addSubtitle');
		var defaultSettings = document.getElementById('defaultSettings');
  
		addSubtitle.addEventListener('click', function() {
				chrome.tabs.executeScript(null,
						{ file: 'content_script.js' });
				window.close();
		});
});