
//Checks if an element has a particular class
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function toggleVisibility(element, displayType){
	var style = window.getComputedStyle(element);
	if(style.display == "none"){
		element.style.display = displayType||"block"; // welcome to javascript lol
	} else {
		element.style.display = "none";
	}
}

function getScrollX()
{
	if(window.pageXOffset!= undefined){
		return pageXOffset;
	}
	else{
		var d= document, r= d.documentElement, b= d.body;
		return r.scrollLeft || b.scrollLeft || 0;
	}
}

function getScrollY()
{
	if(window.pageYOffset!= undefined){
		return pageYOffset;
	}
	else{
		var d= document, r= d.documentElement, b= d.body;
		return r.scrollTop || b.scrollTop || 0;
	}
}

function getWidth() {
	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.documentElement.clientWidth
	);
}

function getHeight() {
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.documentElement.clientHeight
	);
}

function resizeDocument()
{
	//Set document size to extent of interior elements
	document.body.style.width = '100%';
	document.body.style.height = '100%';
	document.body.style.width = getWidth() + 'px';
	document.body.style.height = getHeight() + 'px';
}

function getXCoordOfMouse()
{

	return window.event.x + getScrollX() - 2;
}
function getYCoordOfMouse()
{
	return window.event.y + getScrollY() - 2;
}

//Asks the user if they are sure they want to quit
window.onbeforeunload = function() {
	return true;
};