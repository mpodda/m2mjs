function XBrowserAddHandler(target,eventName,handlerName){
    if (target.addEventListener){
        target.addEventListener(eventName, handlerName, false);
        return;
    }
    
    if (target.attachEvent){
	    target.attachEvent("on" + eventName, handlerName);
	    return;
    }
    
    target["on" + eventName] = handlerName;
}

//-------------------------------------------------------------------------------------------------

function XBrowserAddHandler(target,eventName,handlerName, bubbling){
    if (target.addEventListener){
        target.addEventListener(eventName, handlerName, bubbling);
        return;
    }
    
    if (target.attachEvent){
	    target.attachEvent("on" + eventName, handlerName);
	    return;
    }
    
    target["on" + eventName] = handlerName;
}

//-------------------------------------------------------------------------------------------------

function XBrowserStopEventPropagation(e){
    if (window.event) {
        e.cancelBubble=true;
    } else {
        e.stopPropagation();
    }   
}

//-------------------------------------------------------------------------------------------------

function XBrowserStopDefaultEvents(e){
        if (window.event){
                if (window.event.preventDefault){
                        window.event.preventDefault();
                        return false;
                }
        }
        
        if (!window.event) {
                e.preventDefault();
                return false;
        }
        
        return false;
}

//-------------------------------------------------------------------------------------------------

function getElement(parentElement, elementId){
        var returnElement = null;
        
        for (var i=0; i<parentElement.childNodes.length; i++){
                if (parentElement.childNodes[i].id==elementId){
                        returnElement = parentElement.childNodes[i];
                        break; 
                }
                
                if (returnElement == null && parentElement.childNodes[i].childNodes.length>0){
                        var element = getElement (parentElement.childNodes[i], elementId);
                        if (element != null){
                                return element;
                        }
                }
        }
        
        return returnElement;
};

//-------------------------------------------------------------------------------------------------

function XBrowserEventClientX(e){
        if (window.event) {
                return event.clientX;
        }
        
        return e.pageX;
}


//-------------------------------------------------------------------------------------------------

function XBrowserEventClientY(e){
        if (window.event) {
                return event.clientY;
        }
        
        
        return e.pageY;
}

//-------------------------------------------------------------------------------------------------

function XBrowserOffsetLeft(relativeElement){
        if (window.event) {
                //return relativeElement.scrollLeft;
        	return relativeElement.offsetLeft - event.clientX;
        }
        return window.pageXOffset;
}

//-------------------------------------------------------------------------------------------------

function XBrowserOffsetTop(relativeElement){
    if (window.event) {
    	//return relativeElement.scrollTop;
    	return relativeElement.offsetTop - event.clientY;
    }
    
    return window.pageYOffset;
}

//-------------------------------------------------------------------------------------------------

function XBrowserTargetElement(e){
	if (window.event) {
		return e.srcElement;
	}
	
	return e.target;
}

//-------------------------------------------------------------------------------------------------

function XBrowserElementWidth(element){
	return element.clientWidth;
}

//-------------------------------------------------------------------------------------------------

function XBrowserElementHeight(element){
	return element.clientHeight;
}

//-------------------------------------------------------------------------------------------------

function XBrowserElementOffsetTop(element){
	return element.offsetTop;
}