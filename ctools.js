var curButtonTop = 48;
var domBackup = "";
var xpath = "//a";
var winProxy;
var wTooltip;

ctoolsGuiInit();

function ctoolsCreateWindow() {
  var elem = document.createElement("div");
  ctoolsSetStandardElem(elem);
  elem.id = "ctTooltip";
  elem.style.top = "100px";
  elem.style.left = "100px";
  elem.style.textAlign = "left";
  //elem.style.width = "200px";
  //elem.style.height = "32px";
  elem.style.display = "none";
  elem.innerHTML = "Test";
  elem.show = function () { alert("test"); };
  document.body.appendChild(elem);

  // Can we use just innerHTML?
  //var lbl1 = document.createElement("div");
  //lbl1.innerHTML = "Test 3";
  //elem.appendChild(lbl1);

  elem.addEventListener("mousemove", ctoolsElemMouseMove, true);

  return elem;
}

function ctoolsGuiInit() {
  console.log("ctoolsGuiInit: Loading extension into live webpage")

  // Start listening for DOM events
  document.body.addEventListener("DOMSubtreeModified", ctoolsOnDomChange);

  // Create the menu (Might be time to make this it's own function)
  ctoolsCreateButton("ctView", "Normal View", 'ctoolsShow3d()');
  ctoolsCreateButton("ctRunXpath", "XPath Highlight", 'ctoolsRunXPath()');
  ctoolsCreateButton("ctRemoveXpath", "Remove", 'ctoolsRemove()');
  ctoolsCreateButton("ctNewWindow", "Move To", 'ctoolsNewWindow()');
  ctoolsCreateButton("ctShowJS", "Show JS", 'ctoolsShowJS()');

  // Create the XPATH input[type='text'] element
  ctoolsCreateInput();
  
  // Create a window
  wTooltip = ctoolsCreateWindow();
}

function ctoolsSetStandardElem(elem) {
  // Set a few attributes so the engine know these belong to us
  elem.setAttribute('class', 'ct_button');
  elem.setAttribute('ctools_save', 'true');
}

function ctoolsCreateInput() {
  var elem = document.createElement("input");
  ctoolsSetStandardElem(elem);
  elem.id = 'ctInput';
  elem.style.top = "8px";
  elem.style.left = "8px";
  elem.style.height = "16px";
  elem.style.width = "50%";
  elem.style.fontSize = "16px";
  elem.setAttribute("type", "text");
  elem.addEventListener("click", function() { locked = false;});
  elem.addEventListener("change", function() { ctoolsRunXPathHighlight(this.value);});
  document.body.appendChild(elem);
}

function ctoolsCreateButton(id, caption, func) {
  // Create the button
  var elem = document.createElement("div");
  ctoolsSetStandardElem(elem);

  // Custom attributes
  elem.setAttribute('onclick',func);
  elem.style.top = curButtonTop + "px";
  elem.id = id;
  elem.style.right = "8px";
  elem.style.height = "16px";
  elem.style.width = "128px";
  elem.innerHTML = caption;

  // Increase button create top point
  curButtonTop += 32;
  
  // Add to doc
  document.body.appendChild(elem);
}

function ctoolsNewWindow() {
  // Prompt for destination xpath
  //destxpath = prompt("Enter XPath", xpath);
  
  // Create a new window if we don't already have one
  if (!winProxy)
    winProxy = window.open();
  
  // Toggle off 3d mode to preserve copy elements
  ctoolsShowOriginal();

  // Execute xpath copy to new window body
  var resultLinks = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  var i=0;
  while ( (res = resultLinks.snapshotItem(i) ) !=null ) {
    if (res.getAttribute("class") != "ct_button") {
      winProxy.document.body.appendChild(res);
      i++;
    }
  }
  
  // Restore 3d mode
  ctoolsShow3d();
}

function ctoolsShowOriginal() {
  // Restore the original page content
  document.getElementsByTagName("html")[0].innerHTML = domBackup;

  // Toggle view button state (After DOM refresh or changes won't take)
  document.getElementById("ctView").innerHTML = "Normal View";
  document.getElementById("ctView").setAttribute("onclick", "ctoolsShow3d()");
}

function ctoolsRemove() {
  xpath = prompt("Enter XPath", xpath);

  var resultLinks = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  var i=0;
  while ( (res = resultLinks.snapshotItem(i) ) !=null ){
    res.parentNode.removeChild(res);
    i++
  }
}

function ctoolsRunXPathHighlight(xpath) {
  ctoolsShow3d();
  xpath = xpath + " | " + xpath + "//*";
  var resultLinks = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  var i=0;
  while ( (res = resultLinks.snapshotItem(i) ) !=null ) {
    if (res.getAttribute("class") != "ct_button")
      res.style.backgroundColor = "yellow";
      // Zordering feature (Doesn't work well)
      // var parent = res.parentNode;
      // while (parent != document.body) {
      //   parent.style.position = "relative";
      //   parent.style.zIndex = "999999";
      //   parent = parent.parentNode;
      // }
    i++
  }
}

// Menu event handler
function ctoolsRunXPath() {
  xpath = prompt("Enter XPath", xpath);
  ctoolsRunXPathHighlight(xpath);
}

function ctoolsCalcShortXpath(elem) {
  var xpath = "";
  var curelem = elem;
  while (curelem.tagName != "HTML") {
    var tagname = curelem.tagName.toLowerCase();
    if (curelem.id != "")
      tagname = tagname + "[@id='" + curelem.id + "']";
    if (xpath != "")
      xpath = tagname + "/" + xpath;
    else
      xpath = tagname;
    if (curelem.id != "")
      break;    
    curelem = curelem.parentNode;
  }
  return "//" + xpath;  
}

// Build XPATH selector for a given HTML element
function ctoolsCalcXPath(elem) {
  var xpath = "";
  var curelem = elem;
  while (curelem.tagName != "HTML") {
    var tagname = curelem.tagName.toLowerCase();
    if (curelem.id != "")
      tagname = tagname + "[@id='" + curelem.id + "']";
    if (xpath != "")
      xpath = tagname + "/" + xpath;
    else
      xpath = tagname;
    
    curelem = curelem.parentNode;
  }
  return "/html/" + xpath;
}

function ctoolsElemMouseMove(e) {
  document.getElementById("ctTooltip").style.display = "block";
  document.getElementById("ctTooltip").style.postion = "absolute";
  document.getElementById("ctTooltip").style.top = e.clientY + 5 + "px";
  document.getElementById("ctTooltip").style.left = e.clientX + 5 + "px";
}

var lastelem;
var bgcolor;
var locked = false;
function ctoolsElemMouseOver(e) {
  var ttelem = document.getElementById("ctInput");

  // Restore previous bgcolor
  if (lastelem) {
    if (lastelem.style.backgroundColor == "green")
      lastelem.style.backgroundColor = bgcolor;
  }
  // Save bgcolor
  lastelem = this;
  bgcolor = this.style.backgroundColor;

  var strTooltip = ctoolsCalcShortXpath(this) + "<br>" + this.tagName;
  if (this.id)
    strTooltip = strTooltip + "<br>@id='" + this.id + "'";
  if (this.classList.length > 0)
    strTooltip = strTooltip + "<br>@class='" + this.classList.toString() + "'";
  
  document.getElementById("ctTooltip").innerHTML = strTooltip;
  if (locked == false)
  {
    ttelem.value = ctoolsCalcXPath(this);
    ttelem.focus();
  }

  // Highlight
  this.style.backgroundColor = "green";
}

function ctoolsHasEventHandler(elem) {
  if (elem.onblur != null)
    return true;
  if (elem.onclick != null)
    return true;
  if (elem.ondblclick != null)
    return true;
  if (elem.onfocus != null)
    return true;
  if (elem.onkeydown != null)
    return true;
  if (elem.onkeypress != null)
    return true;
  if (elem.onkeyup != null)
    return true;
  if (elem.onmousedown != null)
    return true;
  if (elem.onmousemove != null)
    return true;
  if (elem.onmouseout != null)
    return true;
  if (elem.onmouseover != null)
    return true;
  if (elem.onmouseup != null)
    return true;
  if (elem.onresize != null)
    return true;
  return false;
}

function ctoolsElemClick(e) {
  var ttelem = document.getElementById("ctInput");
  this.href='javascript:void(0)';
  ctoolsShow3d();
  locked = true;
  xpath = ctoolsCalcXPath(this);
  ttelem.value = xpath;
  ctoolsRunXPathHighlight(xpath);
  e.stopPropagation();
}

function ctoolsGetAncestorCount(elem) {
  var lvl = 0;
  while (elem != document.body) {
    elem = elem.parentNode;
    lvl++;
  }
  return lvl;
}

function ctoolsMakeScopeOpaque(elem) {
  while (elem != document.body) {
    elem.style.opacity = 1.0;
    elem = elem.parentNode;
  }
}

function ctoolsOnDomChange(e) {
  //console.log(e);
  // Mark this element as having been touched up by JS
  e.target.setAttribute("ctools_touched", "true")
  //e.target.style.background = "blue";
}

function ctoolsShowJS() {
  document.body.removeEventListener("DOMSubtreeModified", ctoolsOnDomChange);
  // Only backup the DOM once so we don't accidentally save something we don't want
  if (domBackup == "")
    domBackup = document.getElementsByTagName("html")[0].innerHTML;

  // Transform
  elems = document.body.getElementsByTagName("*");
  for (elem in elems) {
    if (elems[elem].style && (elems[elem].getAttribute("ctools_save") != "true")) {
      elm = elems[elem];
      var lvl = ctoolsGetAncestorCount(elm);

      if (ctoolsHasEventHandler(elm) == true) {
        elm.style.background = "magenta";
        elm.style.opacity = 1.0;
        ctoolsMakeScopeOpaque(elm);
      }
      
      if (elm.getAttribute("ctools_touched") == "true") {
        elm.style.background = "blue";
      }

      elm.addEventListener("mouseover", ctoolsElemMouseOver, true);
      elm.addEventListener("mousedown", ctoolsElemClick, false);      
    }
  }
}

function ctoolsShow3d() {
  document.body.removeEventListener("DOMSubtreeModified", ctoolsOnDomChange);
  // Only backup the DOM once so we don't accidentally save something we don't want
  if (domBackup == "")
    domBackup = document.getElementsByTagName("html")[0].innerHTML;

  // Toggle view button state
  document.getElementById("ctView").innerHTML = "3D View";
  document.getElementById("ctView").setAttribute("onclick", "ctoolsShowOriginal()");

  // Calculate a few metrics about the node data
  elems = document.body.getElementsByTagName("*");
  var maxlvl = 0.0;
  for (elem in elems) {
    if (elems[elem].style) {
      elm = elems[elem];
      var lvl = ctoolsGetAncestorCount(elm);
      if (lvl > maxlvl) {
        maxlvl = lvl;
      }
    }
  }
  
  // Calculate a few scales
  var colorScale = parseInt(255.0/maxlvl);
  var sizeScale = parseFloat(0.15/maxlvl);

  // Transform
  document.body.style.background = "rgb(0,0,0)";
  for (elem in elems) {
    if (elems[elem].style && (elems[elem].getAttribute("ctools_save") != "true")) {
      elm = elems[elem];
      var lvl = ctoolsGetAncestorCount(elm);
      elm.style.webkitTransform = "scale(" + ((maxlvl-lvl) * sizeScale + 0.85) + ")";
//      elm.style.webkitTransform += " translate(" + (lvl * ((maxlvl-lvl) * sizeScale + 0.1)) + "px, " + (lvl * (maxlvl-lvl) * sizeScale) + "px)";
      // Kill images?
      elm.setAttribute("src", "");
//      elems[elem].style.border = "1px solid white";
      elm.style.border = "none";
      elm.style.zIndex = lvl;
//      elm.style.position = "relative";

      elm.style.overflow = "visible";
      elm.style.boxShadow = "-3px -3px 6px rgba(0,0,0,0.5)";

      if (ctoolsHasEventHandler(elm) == true) {
        elm.style.background = "magenta";
        elm.style.opacity = 1.0;
        ctoolsMakeScopeOpaque(elm);
      }
      else {
        elm.style.opacity = 1.0 - ((0.25 / maxlvl) * lvl); //"1.0";
        elm.style.background = "rgb(" + lvl * colorScale + "," + lvl * colorScale + "," + lvl * colorScale + ")";        
      }
      
      if (elm.getAttribute("ctools_touched") == "true") {
        elm.style.background = "blue";
      }

      elm.addEventListener("mouseover", ctoolsElemMouseOver, true);
      elm.addEventListener("mousedown", ctoolsElemClick, false);      

      elm.addEventListener("mousemove", ctoolsElemMouseMove, true);
    }
  }
}
