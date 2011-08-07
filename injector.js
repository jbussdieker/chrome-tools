document.body.addEventListener('onLoad', ctoolsInit());

function ctoolsInit() {
	var elem = document.createElement("script");
	elem.setAttribute("type", "text/javascript");
	elem.setAttribute("src", chrome.extension.getURL("ctools.js"));
	document.body.appendChild(elem);
}
