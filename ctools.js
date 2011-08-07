var curButtonTop = 8;
var domBackup = "";
var xpath = "//a";

//ctoolsCreateButton("ctOptions", "Options", 'ctoolsShowOptions()');
ctoolsCreateButton("ctView", "Normal View", 'ctoolsShow3d()');
ctoolsCreateButton("ctRunXpath", "run xpath", 'ctoolsRunXPath()');
ctoolsCreateButton("ctRemoveXpath", "remove xpath", 'ctoolsRemove()');
//ctoolsShow3d();

function ctoolsCreateButton(id, caption, func) {
  // Create the button
	var elem = document.createElement("div");
	elem.id = 'ctTestButton';
	elem.setAttribute('class', 'ct_button');
	elem.setAttribute('onclick',func);
	elem.style.top = curButtonTop + "px";
	curButtonTop += 32;
	elem.id = id;
	elem.style.right = "8px";
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
  // Toggle view button state
  document.getElementById("ctView").innerHTML = "3D View";
  document.getElementById("ctView").setAttribute("onclick", "ctoolsShowOriginal()");

  domBackup = document.getElementsByTagName("html")[0].innerHTML;
  
  elems = document.body.getElementsByTagName("div");
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
      elm.addEventListener("click", function (e) {
      	this.style.backgroundColor = '#0000ff';
      	e.stopPropagation();
      }, false);
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
