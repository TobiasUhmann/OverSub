// load jQuery and CSS into content environment
console.log('load jQuery...');
chrome.tabs.executeScript(null, { file: 'lib/jquery-3.1.1.js' }, function() {
	console.log('jQuery loaded');
	
	console.log('load jQuery-UI...');
	chrome.tabs.executeScript(null, { file: 'lib/jquery-ui.js' }, function() {
		console.log('jQuery-UI loaded');
	});
	
	console.log('load CSS...');
	chrome.tabs.executeScript(null, { file: 'content/inject_libs.js' }, function () {
		console.log('CSS loaded');
	});
});

// add click handlers to buttons
document.addEventListener('DOMContentLoaded', function () {	
	console.log('DOMContentLoaded');
	
	document.getElementById('addSubtitle').addEventListener('click', function() {
		console.log('inject SubBox...');
		chrome.tabs.executeScript(null, { file: 'content/inject_SubBox.js' }, function () {
			console.log('SubBox injected');
		});
		//window.close();		
	});
	
	document.getElementById('defaultSettings').addEventListener('click', function () {
		// TODO
	});
});