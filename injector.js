// Add an onLoad listener
document.body.addEventListener('onLoad', ctoolsInit());

// Entry point for extension
function ctoolsInit() {
  // AJAX call for the page so we're working with the same DOM tritium would see
  //ctoolsGrabRemoteHTML();
  
  // Attach the GUI script
  var elem = document.createElement("script");
  elem.setAttribute("type", "text/javascript");
  elem.setAttribute("src", chrome.extension.getURL("ctools.js"));
  document.body.appendChild(elem);
}

// Simply GET the current page we're at
function ctoolsGrabRemoteHTML() {
  var url = window.location.toString();
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  document.getElementsByTagName("html")[0].innerHTML = xhr.responseText;
}
