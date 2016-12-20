console.log('load jQuery theme');
var themeURL = '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css';
$('<link rel="stylesheet" type="text/css" href="' + themeURL + '" />').appendTo(document.head);

console.log('load SubBox CSS');
var cssURL = chrome.extension.getURL('content/SubBox/SubBox.css');
$('<link rel="stylesheet" type="text/css" href="' + cssURL + '" />').appendTo(document.head);