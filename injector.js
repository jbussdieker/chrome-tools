// Add an onLoad listener
document.body.addEventListener('onLoad', ctoolsInit());

// Entry point for extension
function ctoolsInit() {
  console.log("ctoolsInit: Entry point for extension");
  
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
  console.log("ctoolsGrabRemoteHTML: Killing scripts");
  
  // Get the URL of the current page
  var url = window.location.toString();
  
  // Make an AJAX call for the current page
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  
  // The XML parser fixes nested HTML tags so I won't get carried away here...
  document.getElementsByTagName("html")[0].innerHTML = xhr.responseText;
}
