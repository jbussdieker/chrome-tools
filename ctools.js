var curButtonTop = 48;
var domBackup = "<p>State error with the view</p>";
var xpath = "//a";
var winProxy;
ctoolsGuiInit();

function ctoolsGuiInit() {
  //ctoolsCreateButton("ctOptions", "Options", 'ctoolsShowOptions()');
  ctoolsCreateButton("ctView", "Normal View", 'ctoolsShow3d()');
  ctoolsCreateButton("ctRunXpath", "XPath Highlight", 'ctoolsRunXPath()');
  ctoolsCreateButton("ctRemoveXpath", "Remove", 'ctoolsRemove()');
  ctoolsCreateButton("ctNewWindow", "Move To", 'ctoolsNewWindow()');
  ctoolsCreateInput();
}

function ctoolsSetStandardElem(elem) {
	elem.style.position = "fixed";
	elem.style.zIndex = "999999999";
	elem.style.padding = "4px";
	elem.style.border = "1px solid black";
	elem.style.backgroundColor = "gray";
	elem.style.fontFamily = "helvetica";
	elem.style.fontSize = "12pt";
	elem.style.color = "black";
	elem.style.boxSizing = "content-box";
	elem.style.borderRadius = "4px";
	elem.setAttribute('class', 'ct_button');
	elem.setAttribute('ctools_save', 'true');
}

function ctoolsCreateInput() {
  // Create the button
	var elem = document.createElement("input");
  ctoolsSetStandardElem(elem);
	elem.id = 'ctInput';
	elem.style.top = "8px";
	elem.style.left = "8px";
	elem.style.height = "16px";
	elem.style.width = "80%";
	elem.style.fontSize = "16px";
	elem.setAttribute("type", "text");
	elem.innerHTML = "Test";
	elem.addEventListener("click", function() { locked = false;});
	elem.addEventListener("change", function() { ctoolsRunXPathHighlight(this.value);});
	document.body.appendChild(elem);
}

function ctoolsCreateButton(id, caption, func) {
  // Create the button
	var elem = document.createElement("div");
  ctoolsSetStandardElem(elem);
	elem.setAttribute('onclick',func);
	elem.style.top = curButtonTop + "px";
	curButtonTop += 32;
	elem.id = id;
	elem.style.right = "8px";
	elem.style.height = "16px";
	elem.style.width = "128px";
	elem.innerHTML = caption;
	document.body.appendChild(elem);
}

function ctoolsNewWindow() {
  destxpath = prompt("Enter XPath", xpath);
  if (!winProxy)
    winProxy = window.open();
  ctoolsShowOriginal();
//	var elem = winProxy.document.createElement("div");
//	elem.innerHTML = "Testing";
//  winProxy.document.body.appendChild(elem);
  var resultLinks = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  var i=0;
  while ( (res = resultLinks.snapshotItem(i) ) !=null ) {
    if (res.getAttribute("class") != "ct_button") {
      winProxy.document.body.appendChild(res);
      i++;
    }
  }
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
      res.style.backgroundColor = "red";
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

function ctoolsRunXPath() {
  xpath = prompt("Enter XPath", xpath);
  ctoolsRunXPathHighlight(xpath);
}

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

  if (locked == false)
  {
    ttelem.value = ctoolsCalcXPath(this);
    ttelem.focus();
  }

  // Highlight
	this.style.backgroundColor = "green";
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

function ctoolsShow3d() {
    domBackup = document.getElementsByTagName("html")[0].innerHTML;

  // Toggle view button state
  document.getElementById("ctView").innerHTML = "3D View";
  document.getElementById("ctView").setAttribute("onclick", "ctoolsShowOriginal()");

  
  elems = document.body.getElementsByTagName("*");
  document.body.style.background = "rgb(0,0,0)";
  var maxlvl = 0.0;
  for (elem in elems) {
    if (elems[elem].style) {
      var lvl = 0.0;
      elm = elems[elem];
      while (elm != document.body) {
        elm = elm.parentNode;
        lvl++;
        if (lvl > maxlvl) {
          maxlvl = lvl;
        }
      }
    }
  }
  console.log("MaxLVL: " + maxlvl);
  var colorScale = parseInt(255.0/maxlvl);
  var sizeScale = parseFloat(0.15/maxlvl);
  console.log("Other: " + colorScale);
  for (elem in elems) {
    if (elems[elem].style && (elems[elem].getAttribute("ctools_save") != "true")) {
      var lvl = 0.0;
      elm = elems[elem];
      while (elm != document.body) {
        elm = elm.parentNode;
        lvl++;
      }
      elm = elems[elem];

      elm.style.webkitTransform = "scale(" + ((maxlvl-lvl) * sizeScale + 0.85) + ")";
//      elm.style.webkitTransform += " translate(" + (lvl * ((maxlvl-lvl) * sizeScale + 0.1)) + "px, " + (lvl * (maxlvl-lvl) * sizeScale) + "px)";
      
      // Kill images?
      //elm.setAttribute("src", "");
      
      elm.addEventListener("mouseover", ctoolsElemMouseOver, true);
      elm.addEventListener("mousedown", ctoolsElemClick, false);
      //elems[elem].style.border = "1px solid white";
      elm.style.zIndex = lvl;
      //elm.style.position = "relative";
      
      //if (elems[elem].style.background == "") {
        elm.style.background = "rgb(" + lvl * colorScale + "," + lvl * colorScale + "," + lvl * colorScale + ")";
        //elm.style.backgroundImage = "";
        // if (lvl == 10) {
        //   elm.style.backgroundColor = "green";
        // }
        //elm.style.backgroundColor = "rgb(" + lvl * (7) + "," + lvl * (7) + "," + lvl * (7) + ")";
      //}
      elm.style.overflow = "visible";
      //elm.style.opacity = 1.0 - ((0.25 / maxlvl) * lvl); //"1.0";
      elm.style.boxShadow = "-1px -1px 5px rgba(0,0,0,0.5)";
    }
  }
}
