function Connection(cnString, getParameterName, dsNodeName, errNodeName){
	this.connectionString = cnString;
	this.getParameterName = getParameterName;
	this.functionName = new String("");
	this.funcName = new String("");
	this.argumentList = new String("");
	this.dataSetNodeName = dsNodeName;
	this.errorNodeName = errNodeName;
	this.errorLoadingXML = false;
	this.error = false;
	this.errorNumber = "0";
	this.errorDescription = new String("");
	this.method = "POST";
	this.async = false;
	this.XMLData = "";
	this.xDoc = instantiateDomDocument(); //new ActiveXObject("MSXML2.DOMDocument");
	this.xPath = this.dataSetNodeName;
	this.responseText = "";
	this.objXMLReq = null;
	this.filterTags = ["<DATASET>", "</DATASET>"];
	this.filterResponse = false; //true;
	
	this.onerror = function(){};
	this.onResponse = function(){};
	
}//Connection

//------------------------------------------------------------------------------------------

Connection.prototype.setFilterTags = function(filterTags){
	this.filterTags = filterTags;
}

//------------------------------------------------------------------------------------------

Connection.prototype.setFilterResponse = function(filterResponse){
	this.filterResponse = filterResponse;
}

//------------------------------------------------------------------------------------------

Connection.prototype.getResponseText = function(){
	return this.responseText;
}

//------------------------------------------------------------------------------------------

Connection.prototype.getResponseXML = function(){
	
	var xNode =  instantiateDomDocument();//new ActiveXObject("MSXML2.DOMDocument");
	var xNodeList = instantiateDomDocument(); //new ActiveXObject("MSXML2.DOMDocument");
    
    
	this.xDoc.async = this.async;
	
	
	this.errorLoadingXML = !loadXMLData(this.xDoc, this.responseText); //!this.xDoc.loadXML(this.responseText);
	xNodeList = this.xDoc.selectNodes("//" + this.errorNodeName);
	
	if (xNodeList.length > 0){
		this.error = true;
		xNode = xNodeList[0];
		this.errorNumber = xNode.attributes[0].text;
		this.errorDescription = unescape(xNode.childNodes[0].text);
	}//if
	else{
		this.error = false;
		xNodeList = this.xDoc.selectNodes("//" + this.dataSetNodeName);
	}//else
	
	return xNodeList;	
}

//------------------------------------------------------------------------------------------

Connection.prototype.setMethod = function(sMethod){
	this.method = sMethod;
}//setMethod

//------------------------------------------------------------------------------------------

Connection.prototype.setURL = function(sURL){
	this.connectionString = sURL;
}//setURL

//------------------------------------------------------------------------------------------

Connection.prototype.setDataSetNodeName = function(dsNodeName){	
	this.dataSetNodeName = dsNodeName;
}//setDataSetNodeName

//------------------------------------------------------------------------------------------

Connection.prototype.setErrorNodeName = function (errNodeName){
	this.errorNodeName = errNodeName; 
}//setErrorNodeName

//------------------------------------------------------------------------------------------

Connection.prototype.setGetParameterName = function(gpName){
	this.getParameterName = gpName; 
}//setGetParameterName

//------------------------------------------------------------------------------------------

Connection.prototype.SetFunctionName = function(fnName){
	this.functionName = fnName; 
	this.funcName = fnName;
}//SetFunctionName

//------------------------------------------------------------------------------------------

Connection.prototype.setErrorNumber = function(errNr){
	this.errorNumber = errNr;
}//setErrorNumber

//------------------------------------------------------------------------------------------

Connection.prototype.setErrorDescription = function(errDescr){
	this.errorDescription = errDescr;
}//setErrorDescription

//------------------------------------------------------------------------------------------

Connection.prototype.haveError = function(){
	return this.error;
}//haveError

//------------------------------------------------------------------------------------------

Connection.prototype.getErrorNumber = function(){
	return this.errorNumber;
}//getErrorNumber

//------------------------------------------------------------------------------------------

Connection.prototype.getErrorDescription = function(){
	return this.errorDescription;
}//getErrorDescription

//------------------------------------------------------------------------------------------

Connection.prototype.getGetParameterName = function(){
	return this.getParameterName;
}//getGetParameterName

//------------------------------------------------------------------------------------------

Connection.prototype.getURL = function() {
	return this.connectionString;
}//getURL

//------------------------------------------------------------------------------------------

Connection.prototype.getFunctionName = function(){
	return this.funcName;
}//getFunctionName

//------------------------------------------------------------------------------------------

/*
Connection.prototype.onResponse = function(){	
	return this.responseText;
}
*/

//------------------------------------------------------------------------------------------

Connection.prototype.callNoXML = function(){
	return this.connect();
}//callNoXML

//------------------------------------------------------------------------------------------

Connection.prototype.connect = function(){
	var retValue;
	
	if (window.XMLHttpRequest){
		this.objXMLReq = new XMLHttpRequest();
	}else if (window.ActiveXObject){
		this.objXMLReq = new ActiveXObject("MSXML2.XMLHTTP");
	}
	
	if (this.method=="GET"){
		var sText = "m=" + this.funcName;
		if (this.argumentList.length>0){
		 sText += "&" + this.argumentList;
		 //alert(sText);
		}//if
		
		if (this.async){
			this.objXMLReq.onreadystatechange = this.onResponse();
		}		
		this.objXMLReq.open("GET", this.connectionString + "?" + sText, this.async);
		this.objXMLReq.send();
	}//if

	if (this.method=="POST"){
		var sText = "<ALL>";
		sText+= "<METHOD>" + this.funcName + "</METHOD>";
		sText+= this.argumentList;
		sText += "</ALL>";

		if (this.async){
			//this.objXMLReq.onreadystatechange = this.onResponse();
			var httpRequest = this.objXMLReq;
			var cn = this;
			this.objXMLReq.onreadystatechange = function(){
				if (httpRequest.readyState != 4){
					return;
				}
				if (httpRequest.status != 200){
					alert("There is a problem with the request.\nReturn Status: " + httpRequest.status);
					return;
				}
				
				cn.responseText = cn.filterResponseText(httpRequest.responseText);
				cn.onResponse();
			}
		}
		this.objXMLReq.open("POST", this.connectionString, this.async);
		this.objXMLReq.send(sText);
	}//if
	
	
	if (!this.async){
		/*
		retValue = this.objXMLReq.responseText;
		retValue = retValue.slice(retValue.indexOf("<DATASET>"), retValue.indexOf("</DATASET>")) + "</DATASET>";
		this.responseText = retValue;
		this.objXMLReq = null;
		return retValue;
		*/
		return this.filterResponseText(this.objXMLReq.responseText);
	}
	
}//connect

//------------------------------------------------------------------------------------------

Connection.prototype.setArguments = function(){
	
	if (arguments.length==0){
		this.argumentList = "";
		return;
	}//if
	
	this.argumentList = "";
	
	if (this.method=="GET"){
		for (var i=0; i<arguments.length; i++){
			this.argumentList += "p" + String(i) + "=" + escape(arguments[i]);
			if (i!=arguments.length-1){
				this.argumentList += '&';
			}//if
		}//for
	}//if
	
	if (this.method=="POST"){
		for (var i=0; i<arguments.length; i++){
				this.argumentList += "<PARAMETER>" + escape(arguments[i]) + "</PARAMETER>"
		}//for
	}//if
		
}//setArguments

//------------------------------------------------------------------------------------------

Connection.prototype.setError = function(nr, descr){
	this.error = true;
	this.errorNumber = nr;
	this.errorDescription = descr;
	this.onerror();
}//setError

//------------------------------------------------------------------------------------------

Connection.prototype.setErrorStatus = function(errStatus){
	this.error = errStatus;
}//setErrorStatus

//------------------------------------------------------------------------------------------

Connection.prototype.call = function(){
	
	if (!this.async){
		var xNode = instantiateDomDocument(); //new ActiveXObject("MSXML2.DOMDocument");
		var xNodeList = instantiateDomDocument(); //= new ActiveXObject("MSXML2.DOMDocument");
	               
		this.xDoc.async = this.async;
		this.errorLoadingXML = !loadXMLData(this.xDoc, this.connect()); //!this.xDoc.loadXML(this.connect());
		
		xNodeList = this.xDoc.selectNodes("//" + this.errorNodeName);
						
		if (xNodeList.length > 0){
			this.error = true;
			xNode = xNodeList[0];
			this.errorNumber = xNode.attributes[0].text;
			this.errorDescription = unescape(xNode.childNodes[0].text);
		}//if
		else{
			this.error = false;
			xNodeList = this.xDoc.selectNodes("//" + this.dataSetNodeName);
		}//else
		
		return xNodeList;
	}else{
		this.connect();
	}
	
}//call

//------------------------------------------------------------------------------------------

Connection.prototype.setAsync = function(async){
	this.async = async;
}//setAsync

//------------------------------------------------------------------------------------------

Connection.prototype.selectNode = function(nodeName){
	return this.xDoc.selectNodes("//" + nodeName);
	
}//selectNode

//------------------------------------------------------------------------------------------

Connection.prototype.loadXML = function(){
	this.errorLoadingXML = !loadXMLData(this.xDoc, this.connect()); //!this.xDoc.loadXML(this.connect());		
}//loadXML

//------------------------------------------------------------------------------------------

Connection.prototype.setXPath = function(xpath){
	this.xPath = xpath;
}//setXPath

//------------------------------------------------------------------------------------------

Connection.prototype.getXPath = function(){
	return this.xPath;
}//getXPath

//------------------------------------------------------------------------------------------

Connection.prototype.filterResponseText = function(inText){
	if (this.filterResponse){
	
//		alert(inText.indexOf(this.filterTags[0]));
//		alert(inText.indexOf(this.filterTags[1]));
		
		var step1 = inText.slice(inText.indexOf(this.filterTags[0]));
		return step1.slice(0, inText.indexOf(this.filterTags[1]));
		
		/*
		alert(
			inText.slice(
				inText.indexOf(this.filterTags[0]), 
				inText.indexOf(this.filterTags[1])
			)
		);
		*/
		//return inText.slice(inText.indexOf(this.filterTags[0]), inText.indexOf(this.filterTags[1]));
		
		//return inText.slice(inText.indexOf("<BODY"), inText.indexOf("</BODY>")) + buildFilterEndTag(this.filterTag);
	}
	
	return inText;
}



function instantiateDomDocument(){
	var object;
	if (typeof document.implementation != 'undefined' && 
		typeof document.implementation.createDocument != 'undefined'){
	
		object = document.implementation.createDocument("", "", null);
		//object.setProperty("SelectionLanguage", "XPath");
	}else{
		object = new ActiveXObject("MSXML2.DOMDocument");
	}
	
	return object;
}

//------------------------------------------------------------------------------------------

function loadXMLData(object, s){
	if (typeof document.implementation != 'undefined' && 
		typeof document.implementation.createDocument != 'undefined'){
		var parser = new DOMParser();
		
		return parser.parseFromString(s, "text/xml");
	}else{
		return object.loadXML(s);	
	}
}

//------------------------------------------------------------------------------------------

function buildFilterBeginTag(filter){
	if (filter!=null && filter!=""){
		return "<" + filter + ">";
	}
}

//------------------------------------------------------------------------------------------

function buildFilterEndTag(filter){
	if (filter!=null && filter!=""){
		return "</" + filter + ">";
	}
}