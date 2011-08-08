var curButtonTop = 8;
var domBackup = "";
var xpath = "//a";

//ctoolsCreateButton("ctOptions", "Options", 'ctoolsShowOptions()');
ctoolsCreateButton("ctView", "Normal View", 'ctoolsShow3d()');
ctoolsCreateButton("ctRunXpath", "XPath Highlight", 'ctoolsRunXPath()');
ctoolsCreateButton("ctRemoveXpath", "XPath Remove", 'ctoolsRemove()');
//ctoolsShow3d();
//ctoolsCreateTooltip();
ctoolsCreateInput();
domBackup = document.getElementsByTagName("html")[0].innerHTML;

function ctoolsSetStandardElem(elem) {
	elem.style.position = "fixed";
	elem.style.zIndex = "999999999";
	elem.style.padding = "4px";
	elem.style.border = "1px solid black";
	elem.style.backgroundColor = "gray";
	elem.setAttribute('class', 'ct_button');
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
	document.body.appendChild(elem);
}

// function ctoolsCreateTooltip() {
//   // Create the button
//  var elem = document.createElement("div");
//   ctoolsSetStandardElem(elem);
//  elem.id = 'ctTooltip';
//  elem.style.top = "8px";
//  elem.style.left = "8px";
//  elem.style.height = "16px";
//  elem.style.width = "80%";
//  elem.style.fontSize = "16px";
//  elem.innerHTML = "Test";
//  document.body.appendChild(elem);
// }

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

// function ctoolsShowOptions() {
//   var elem = document.createElement("div");
//   elem.id = "ctOptionsWindow";
//   elem.style.top = "8px";
//   elem.style.left = "8px";
//  elem.style.height = "320px";
//  elem.style.width = "320px";
//   elem.style.position = "fixed";
//   elem.style.zIndex = "999999";
//   elem.style.backgroundColor = "gray";
//   elem.style.border = "1px solid black";
//   document.body.appendChild(elem);
// }

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
  var resultLinks = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  var i=0;
  while ( (res = resultLinks.snapshotItem(i) ) !=null ){
    res.style.backgroundColor = "red";
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

  // 
	//e.stopPropagation();
}

function ctoolsElemClick(e) {
  this.href='javascript:void(0)';
  ctoolsShow3d();
  locked = true;
  xpath = ctoolsCalcXPath(this);
  ctoolsRunXPathHighlight(xpath);
	e.stopPropagation();
	e.cancel();
}

function ctoolsShow3d() {
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
  var sizeScale = parseFloat(0.1/maxlvl);
  console.log("Other: " + colorScale);
  for (elem in elems) {
    if (elems[elem].style && (elems[elem].getAttribute("class") != "ct_button")) {
      var lvl = 0.0;
      elm = elems[elem];
      while (elm != document.body) {
        elm = elm.parentNode;
        lvl++;
      }
      elm = elems[elem];

      elm.style.webkitTransform = "translate(" + (lvl) + "px, " + (lvl) + "px)";
      elm.style.webkitTransform += " scale(" + ((maxlvl-lvl) * sizeScale + 0.9) + ")";
      
      // Kill images?
      elm.setAttribute("src", "");
      
      elm.addEventListener("mouseover", ctoolsElemMouseOver, true);
      elm.addEventListener("mousedown", ctoolsElemClick, false);
      //elems[elem].style.border = "1px solid white";
      //elems[elem].style.zIndex = maxlvl - lvl;
      //elems[elem].style.position = "relative";
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
      elems[elem].style.boxShadow = "-1px -1px 5px rgba(0,0,0,0.5)";
    }
  }
}
