var domBackup = "";
var xpath = "//*";

ctoolsCreateButton(8, 8, "3d page view", 'ctoolsShow3d()');
ctoolsCreateButton(32, 8, "original", 'ctoolsShowOriginal()');
ctoolsCreateButton(56, 8, "run xpath", 'ctoolsRunXPath()');
ctoolsCreateButton(56+32, 8, "remove xpath", 'ctoolsRemove()');
ctoolsShow3d();

function ctoolsCreateButton(top, right, caption, func) {
  // Create the button
	var elem = document.createElement("div");
	elem.id = 'ctTestButton';
	elem.setAttribute('class', 'ct_button');
	elem.setAttribute('onclick',func);
	elem.style.top = top + "px";
	elem.style.right = right + "px";
	elem.style.height = "16px";
	elem.style.width = "128px";
	elem.style.padding = "4px";
	elem.style.border = "1px solid black";
	elem.style.backgroundColor = "gray";
	elem.style.position = "fixed";
	elem.style.zIndex = "999999";
	elem.innerHTML = caption;
	document.body.appendChild(elem);
}

function ctoolsShowOriginal() {
  document.getElementsByTagName("html")[0].innerHTML = domBackup;
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

function ctoolsRunXPath() {
  xpath = prompt("Enter XPath", xpath);
  var resultLinks = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  var i=0;
  while ( (res = resultLinks.snapshotItem(i) ) !=null ){
    res.style.backgroundColor = "red";
    i++
  }
}

function ctoolsShow3d() {
  domBackup = document.getElementsByTagName("html")[0].innerHTML;
  
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
      elm.setAttribute("src", "");
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
      elm.style.opacity = 1.0 - ((0.25 / maxlvl) * lvl); //"1.0";
      elems[elem].style.boxShadow = "-1px -1px 5px rgba(0,0,0,0.5)";
    }
  }
}
