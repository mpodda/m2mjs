function TemplateLoader(templateFile){
	this.templateFile = templateFile;
	
	this.cn = new Connection(this.templateFile, "", "DATAROW", "ERROR");
	this.cn.setAsync(false);
	this.cn.setFilterResponse(false);
	this.cn.setMethod("POST");
	
	//this.fragment = document.createDocumentFragment();

	return this;
}

// ------------------------------------------------------------------------------------------------

TemplateLoader.prototype.loadTemplate = function(templateId){
//	var templateLoader = this; 
//	var fragment = document.createDocumentFragment();
//	
//	var templateText = fragment.appendChild(document.createElement("body"));
//	templateText.innerHTML = templateLoader.cn.callNoXML();
//	
//	//alert(fragment.childNodes.length);
//	
//	fragment.appendChild(templateText);
//	
//	//var template = getElement(templateText, templateId);
//	var template = getElement(fragment.childNodes[0], templateId);
//	
//	//alert(templateId + ":" + template);
	
	var fragment = document.createDocumentFragment();
	var templateText = document.createElement("body");
	templateText.innerHTML = this.cn.callNoXML();
	fragment.appendChild(templateText);
	var template = getElement(fragment.childNodes[0], templateId);
	
	
	return template;
};