/**
 * New approach with ES 6, ES 7
 * 
 */

// ------------------------------------------------------------------------------------

class M2MJS {
    static resolveObjectValue(path, object) {
        return path.split('.').reduce(
            function (prev, curr) {
                if (prev) {
                    return prev[curr];
                }

                return null;
            },
            object || self
        );
    }

    static setObjectValue(path, object, value) {
        path.split('.').reduce(
            function (prev, curr) {
                if (prev) {
                    prev[curr] = value;
                }
            },
            object || self
        );
    }
    

    /*
    ----------------
    -- Connection -- 
    ----------------
   */
    static Connection = class {
    	static Methods =  Object.freeze({
    		GET:   "GET",
    	    POST:  "POST"  		
    	});
    	
    	constructor(url, method, requestData, isJson) {
    		this.url = url;
    		this.requestData = requestData;
    		this.httpMethod = method;
    		this.isJson = isJson;
    	}
    	
    	static get (url, isJson) {
    		if (isJson === undefined) {
    			isJson = true;
    		}
    		
    		return new M2MJS.Connection(url, M2MJS.Connection.Methods.GET, null, isJson).connect();
    	}
    	
    	static post (url, requestData, isJson = true) {
    		return new M2MJS.Connection(url, M2MJS.Connection.Methods.POST, requestData, isJson).connect();
    	}
    	
    	set isJsonCall (isJson) {
    		this.isJson = isJson;
    	}
    	
    	get isJsonCall() {
    		return this.isJson;
    	}
    	
    	connect () {
    		let cn = this;
    		
    		return new Promise (
    			function (resolve, reject) {
    				let httpRequest = null;
    				
    				let response = {
    					status: 0,
    					  data: ''
    				}
    				
    				if (window.XMLHttpRequest) {
    	                httpRequest = new XMLHttpRequest();
    	            } else if (window.ActiveXObject) {
    	                httpRequest = new ActiveXObject("MSXML2.XMLHTTP");
    	            } else {
    	            	//TODO: Raise exception
    	            }
    				
    				httpRequest.onreadystatechange = () => {
    	                if (httpRequest.readyState != 4) {
    	                    return;
    	                }

    	                response.status = httpRequest.status;
    	                
    	                /*
    	                if (cn.isJsonCall) {
    	                	response.data = JSON.parse(httpRequest.responseText);
	                	} else {
	                		 response.data = httpRequest.responseText;
	                	}
	                	*/
    	               
    	                
    	                if (httpRequest.status != 200) {
    	                	response.data = httpRequest.responseText;
    	                	reject(response);
    	                } else {
        	                if (cn.isJsonCall) {
        	                	response.data = JSON.parse(httpRequest.responseText);
    	                	} else {
    	                		 response.data = httpRequest.responseText;
    	                	}
    	                	
    	                	resolve(response);
    	                }
    	            }
    				
    				httpRequest.open(cn.httpMethod, cn.url, true);
    				
    	            if (cn.isJsonCall) {
    	                httpRequest.setRequestHeader('Accept', 'application/json, text/javascript, */*');
    	                httpRequest.setRequestHeader('content-type', 'application/json; charset=UTF-8');
    	                
    	                cn.requestData = JSON.stringify (cn.requestData);
    	            }
    				
    				httpRequest.send((cn.requestData));
    			}
    		);
    	}
    }
    
    
    /*
    ---------------------
    -- Template Loader -- 
    ---------------------
   */

    static TemplateLoader = class {
    	
    	static loadTemplate(templateUrl, templateId) {
    		return new Promise (
    			function (resolve, reject) {
    				M2MJS.Connection.get(templateUrl, false).then((response) => {
    					let fragment = document.createDocumentFragment();
			            let templateText = document.createElement("body");
			            templateText.innerHTML = response.data;
			            fragment.appendChild(templateText);
    					
			            resolve(M2MJS.XBrowser.getElement(fragment.childNodes[0], templateId));
    				});
    			}
        	);
    	};
    }
    
    
    /*
     --------------
     -- XBrowser -- 
     --------------
    */
    
    static XBrowser = class {
        static getElement(parentElement, elementId) {
            let returnElement = null;


            for (var i = 0; i < parentElement.childNodes.length; i++) {
                if (parentElement.childNodes[i].id == elementId) {
                    returnElement = parentElement.childNodes[i];
                    break;
                }

                if (returnElement == null && parentElement.childNodes[i].childNodes.length > 0) {
                    var element = M2MJS.XBrowser.getElement(parentElement.childNodes[i], elementId);
                    if (element != null) {
                        return element;
                    }
                }
            }

            return returnElement;
        }

        static addHandler(target, eventName, handlerName) {
            if (target.addEventListener) {
                target.addEventListener(eventName, handlerName, false);
                return;
            }

            if (target.attachEvent) {
                target.attachEvent("on" + eventName, handlerName);
                return;
            }

            target["on" + eventName] = handlerName;
        }    
    }


    /*
    ---------------
    -- Component -- 
    ---------------
   */
    
    static Component = class {
    	constructor (componentId, element) {
    		this.componentId = componentId;
    		this.element = element;
    	}
    	
    	get id () {
    		return this.componentId;
    	}
    	
    	set id (componentId) {
    		this.componentId = componentId;
    	}
    	
    	getId() {
    		return this.componentId;
    	}
    	
    	setValue (value) {
            if (this.element.type && this.element.type.toLowerCase() == "checkbox") {
            	this.element.checked = value;
            } else {
                if (this.element.tagName.toLowerCase() == "input" || this.element.tagName.toLowerCase() == "textarea" || this.element.tagName.toLowerCase() == "select") {
                	this.element.value = value;
                } else {
                	this.element.innerHTML = value;
                }
            }
    	}
    	
    	getValue() {
            if (this.element.type && this.element.type.toLowerCase() == "checkbox") {
                return this.element.checked;
            }

            return this.element.value;
    	}
    };
    

    /*
     ----------
     -- Form -- 
     ----------
    */

    static Form = class {
        constructor(modelObject) {
            this._modelObject = modelObject;
            this.components = [];
        }

        addComponent (component) {
            this.components.push(component);
        }
        
        set modelObject(mo) {
            this._modelObject = mo;
            
            const form = this;
            
            this.components.forEach(
                function (component, index) {
                    component.setValue(M2MJS.resolveObjectValue(component.id, form._modelObject));
                }
            );
        }

        get modelObject() {
        	const form = this;
        	
        	this.components.forEach(
                function (component, index) {
                	M2MJS.setObjectValue(component.id, form._modelObject, component.getValue());
                }
            );
        	
            return this._modelObject;
        }
        
    }
        
        /*
        -----------
        -- Field -- 
        -----------
       */
        
        static Field = class {
        	constructor (elements = [],  affectElement = null) {
        		this.elements = elements;
        		this.affectElement = affectElement;
        		
        	    this.combinationDestinationElement = null;

        	    this.currentErrorMessage;
        	    this._dataType = "";
        	    this._isMandatory = false;
        	    this._valueLengthRange = null;
        	    this._valueRange = null;
        	    this.numberFormat = null;

        	    this.elementsStyleClasses = [];

        	    this._emptyValueForSelect = "0";
        	    this._emptyValueForInput = "";

        	    this.initElementsStyleClasses();
        	}
        	
        	initElementsStyleClasses() {
        		this.elements.forEach (
    				(element, index) => {
    					this.elementsStyleClasses.push(element.className);
    				}
        		);
        	}
        	
        	hasValue () {
        		const field = this;
        		
        		this.elements.forEach (
    				(element, index) => {
            	        if (elements.type.toLowerCase() == "checkbox" ||
            	                element.type.toLowerCase() == "radio") {
            	            if (!element.checked) {
            	                return false;
            	            }
            	        } else if (element.type.toLowerCase() == "select-one") {
            	            if (element.value.length == 0 || element.value == field.emptyValueForSelect) {
            	                return false;
            	            }
            	        } else {
            	            if (element.value.length == 0 || element.value == field.emptyValueForInput) {
            	                return false;
            	            }
            	        }
    				}
        		);

        	    return true;
        	}       	
        }
        
        getValue (valueIndex = null) {
            if (valueIndex != null) {
                if (valueIndex > this.elements.length - 1) {
                    return null;
                }

                return this.elements[valueIndex].value;
            } else {
                let values = [];
                this.elements.foreach (
            		(element, index) => {
            			values.push(element);
            		}
                );
                
                return values;
            }
        }        
        
        setValue (valueIndex, value) {
	        if (valueIndex > this.elements.length - 1) {
	            return;
	        }
	
	        this.elements[valueIndex].value = value;
        }
        
        equals (field) {
            if (field == null) {
                return false;
            }

            return field.id === this.id;
        }
        
        getElement (elementIndex) {
            if (elementIndex > this.elements.length - 1) {
                return null;
            }

            return this.elements[elementIndex];
        }
        
        hasValueLengthRange () {
        	return this._valueLengthRange != null;
        }
        
        revokeValueLengthRange () {
        	this._valueLengthRange = null;
        }
        
        hasValueRange () {
        	return this._valueRange != null;
        }
        
        revokeValueRange () {
        	this._valueRange = null;
        }
        
        get dataType () {
        	return this._dataType;
        }
        
        set dataType (dataType) {
        	this._dataType = dataType;
        }
        
        get isMandatory () {
        	return this._isMandatory;
        }
                 
        set isMandatory (isMandatory) {
        	this._isMandatory = isMandatory;
        }
        
        get valueLengthRange () {
        	return  this._valueLengthRange;
        }
        
        set valueLengthRange (valueLengthRange) {
        	 this._valueLengthRange = valueLengthRange;
        }
        
        get valueRange () {
        	return this._valueRange;
        }
        
        set valueRange (valueRange) {
        	this._valueRange = valueRange;
        }
        
        get emptyValueForSelect () {
        	return this._emptyValueForSelect;
        }
        
        set emptyValueForSelect (emptyValueForSelect) {
        	this._emptyValueForSelect = emptyValueForSelect;
        }
        
        get emptyValueForInput () {
        	return this._emptyValueForInput;
        }
        
        set emptyValueForInput (emptyValueForInput) {
        	this._emptyValueForInput = emptyValueForInput; 
        }

        /*
        -----------------
        -- Field Group -- 
        -----------------
       */
        
        static FieldGroup = class {
        	static LogicalOperators =  Object.freeze({
	             AND: "&&",
	              OR: "||",
	             XOR: "^",
	            NAND: "&&",
	             NOR: "||"
        	});
        	
        	constructor (logicalOperation = null, errorMessage = "") {
        		this._logicalOperation = logicalOperation;
        		this._errorMessage = errorMessage;
        		
        		this._fields = [];
        		this._fieldGroups = [];
        		this._fieldGroupsLogicalOperation = null;
        	}
        	
        	isValid () {
        		return false;
        	}
        	
        	addField(field) {
        		this._fields.pus(field);
        	}
        	
        	addFieldGroup(fieldGroup) {
        		this._fieldGroups.push(fieldGroup);
        	}
        	
        	getFirstField() {
        		if (this._fields.length > 0) {
        			return this._fields[0];
        		}
        	
        		return null;
        	}
        	
        	set logicalOperation(logicalOperation) {
        		this._logicalOperation = logicalOperation;
        	}
        	
        	set errorMessage(errorMessage) {
        		this._errorMessage = errorMessage;
        	}
        	
        	set fieldGroupsLogicalOperation (fieldGroupsLogicalOperation) {
        		this._fieldGroupsLogicalOperation = fieldGroupsLogicalOperation;
        	}
        	
        }
        
        
        /*
        ---------------
        -- Validator -- 
        ---------------
       */
        
        static Validator = class {
        	constructor(name = "") {
		        this.fields = [];
		        this.errorFields = [];
		        this.fieldGroups = [];
		        this.externalFunctions = [];

		        this._name = name;
		        this.shortCircuitErrors = true;
		
		        this.onError = (field) => {};
		        this.onValidationOk = (field) => {};
		        this.onFieldGroupError = (fieldGroup)  => {};
		        this.onFieldGroupValidationOk = (fieldGroup) => {};
		        this.onExternalFunctionError = (externalFunction) => {};
		        this.onExternalFunctionValidationOk = (externalFunction) => {};
		        this.onValueRangeSet = (field) => {};
        	}
        	
	    	addField (field) {
	    		this.fields.push(field);
	    	}
        	
	    	addFieldGroup (fieldGroup) {
	    	    this.fieldGroups.push(fieldGroup);        	
	    	}
        	
	    	hasErrors () {
	    		//return this.errorFields.length > 0;
	    		return true;
	    	}
        	
	    	getField(id) {
	    	    for (var i = 0; i < this.fields.length; i++) {
	    	        for (var j = 0; j < this.fields[i].elements.length; j++) {
	    	            if (this.fields[i].elements[j].id == id) {
	    	                return this.fields[i];
	    	            }
	    	        }
	    	    }
	    	    
	    	    return null;
	    	}
        	
	    	isErrorField (field) {
	    		if (this.hasErrors()) {
	    	        for (var i = 0; i < this.errorFields.length; i++) {
	    	            if (this.errorFields[i].equals(field)) {
	    	                return true;
	    	            }
	    	        }
	    	    }
	
	    	    return false;        	
	    	}
        	
	    	addExternalFunction (externalFunction) {
	    	    this.externalFunctions.push(externalFunction);
	    	}
	        	
	    	async validate () {
	    		
//	    		this.errorFields = [];
//	
//	
//	    		/* Field Groups */
//	    		if (this.fieldGroups.length > 0) {
//					for (var i = 0; i < this.fieldGroups.length; i++) {
//						const fieldGroup = this.fieldGroups[i];
//						
//						if (!fieldGroup.isValid ()) {
//							this.errorFields.push(fieldGroup.getFirstField());
//			                this.onFieldGroupError(fieldGroup);
//			                if (this.shortCircuitErrors) {
//			                	return;
//			                }
//						} else {
//							this.onFieldGroupValidationOk(fieldGroup);
//						}
//					}
//	    		}
//	
//	
//	    		/* Fields */
//	    		for (var i = 0; i < this.fields.length; i++) {
//	    			
//	    		}
//	    		
//	    		/* External Functions */
//	    		if (this.externalFunctions.length > 0) {
//	    			
//	    		}
	    		
	    		
	    	}
        	
	        get name() {
	        	return this._name;
	        }
        }


    /*
     ----------
     -- Grid -- 
     ----------
    */

    static Grid = class {
        constructor(dataList, gridContainer, gridTemplate, paginator = null) {
            this._dataList = dataList;
            this.gridContainer = gridContainer;
            this.gridTemplate = gridTemplate;

            this.gridRows = [];
            this.objectPaths = [];
            this.renderersSet = [];
            this.componentsSet = [];
            
            // --- Paging --- 
            this.paginator = paginator;
            this.pagingEnabled = (paginator != null);
            
            if (this.pagingEnabled) {
            	let grid = this;
            	
            	paginator.onPageChange = () => {
            		grid.model = null;
            		grid.gridRows = [];
                    grid.deselectGridRow();
                    grid.renderGrid();
            	}
            }
            // --- / Paging ---
            
            
            //  --- Sorting ---
            this._sort = null;
            // --- / Sorting ---
            
            this.rowMouseOverClassName = "overGridRow";
            this.rowSelectedClassName = "selectedGridRow";
            this.rowModifiedClassName = "modifiedGridRow";
            
            this.defineObjectPaths();
            
            this.onGridRowRender = (gridRow) => {};
            this.onGridRowSelect = (gridRow) => {};
            this.onGridRowDeselect = (gridRow) => {};
            this.onGridRowModificationStatusChange = (gridRow) => {}; 
        }

        
        /*
         -------------
         -- GridRow -- 
         -------------
        */

        static GridRow = class {
            constructor (gridTemplate, modelObject, objectPaths, renderers, components) {
                this.gridTemplate = gridTemplate;
                this._modelObject = modelObject;
                this.objectPaths = objectPaths;
                
                this._form = new M2MJS.Form(modelObject);
                
                this.selected = false;
                this.gridRowCurrentClass = "";
                this.gridRowContainer = null;

                this.renderers = renderers;
                this.components = components;

                this.mouseOverClassName = "";
                this.selectedClassName = "";
                this.modifiedClassName = "";

                this.onBeforeSelect = () => {};
                this.onSelect = () => {};
                this.defineComponent = (id, element, objectValue) => {};
                this.renderElement = (renderer, element, modelObject) => {};
            }

            renderGridRow() {
                if (this.gridRowContainer == null) {
                    this.gridRowContainer = this.gridTemplate.cloneNode(true);                
                }

                this.gridRowCurrentClass = this.gridRowContainer.className;
                
                const gridRow = this;
                
                this.objectPaths.forEach (
                    function (objectPath, index) {
                        let element = M2MJS.XBrowser.getElement(gridRow.gridRowContainer, objectPath);
                        const objectValue = gridRow.getObjectValue(objectPath);
                        
                        gridRow.parseGridRow(objectPath, objectValue);

                        if (element != null) {
                        	let elementClone = element.cloneNode(true);
                            element.innerHTML = objectValue;
                            
                            //Components (If any)
                            gridRow.components.forEach (
                                function (component, index) {
                                    if (component["id"] == objectPath) {
                                    	element.innerHTML = elementClone.innerHTML;
                                        let cFunc = component["code"];
                                        cFunc(gridRow, objectPath, element, objectValue);
                                    }
                                }
                            );
                            
                        }
                        
                    }
                );

                //Renderers (If any)
                this.renderers.forEach (
                    function (renderer, index) {
                        const element = M2MJS.XBrowser.getElement(gridRow.gridRowContainer, renderer["name"]);
                        let rFunc = renderer["code"];
                        rFunc(element, gridRow._modelObject, gridRow);
                    }
                );

                M2MJS.XBrowser.addHandler(this.gridRowContainer, "click", function onClick(e) {
                    gridRow.onBeforeSelect();
                    
                    gridRow.gridRowContainer.className = gridRow.selectedClass;
                    gridRow.isSelected = true;
                    
                    gridRow.onSelect();
                });

                M2MJS.XBrowser.addHandler(this.gridRowContainer, "mouseover", function onMouseOver(e) {
                    if (gridRow.gridRowContainer.id == "view") {
                        gridRow.gridRowContainer.className = gridRow.mouseOverClass;
                    }

                    if (!gridRow.isSelected) {
                        gridRow.gridRowContainer.className = gridRow.mouseOverClass;
                    }
                });

                M2MJS.XBrowser.addHandler(this.gridRowContainer, "mouseout", function onMouseOut() {
                    if (!gridRow.isSelected) {
                        gridRow.gridRowContainer.className = gridRow.gridRowCurrentClass;
                    }
                });

                this.form.modelObject = this._modelObject;
                
                return this.gridRowContainer;
            }

            set mouseOverClass(mouseOverClass) {
                this.mouseOverClassName = mouseOverClass;
            }

            set selectedClass(selectedClass) {
                this.selectedClassName = selectedClass;
            }

            get selectedClass () {
            	return this.selectedClassName;
            }
            
            set modifiedClass(modifiedClass) {
                this.modifiedClassName = modifiedClass;
            }

            get model() {
                //return this.modelObject;
            	return this.form.modelObject;
            }
            
            set model (modelObject) {
            	//this.modelObject = modelObject;
            	this.form.modelObject = modelObject;
            }
            
            get form() {
            	return this._form;
            }

            get isSelected() {
                return this.selected;
            }
            
            set isSelected(selected) {
                this.selected = selected;
            }
            
            parseGridRow(objectPath, objectValue) {
                let toReplace = "{" + objectPath + "}";
                
                this.gridRowContainer.childNodes.forEach (
                    function (childNode, index) {
                        try {
                            if (childNode.innerHTML.indexOf(toReplace) > -1) {
                                childNode.innerHTML = childNode.innerHTML.replace(eval("/" + toReplace + "/g"), objectValue);
                            }
                        } catch (e) {

                        }
                    }
                );
            }

            getObjectValue(objectPath) {
                return M2MJS.resolveObjectValue(objectPath, this._modelObject);
            }

            deselect() {
                this.isSelected = false;

                this.gridRowContainer.className = this.gridRowCurrentClass;
            }
        } // GridRow
        
        
        
        /*
        ---------------
        -- Paginator -- 
        ---------------
       */
        
        static Paginator = class {
        	constructor (totalLines = 0, 
        			linesPerPage = 1, 
        			firstPageElement = null, 
        			previousPageElement = null, 
        			nextPageElement = null, 
        			lastPageElement = null,
        			currentPageElement = null,
        			totalPagesElement = null) {
        		
        		this._totalLines = totalLines;
        		this._linesPerPage = linesPerPage;
        		this._pages = this.calculatePages();
        		this._currentPage = 1;
        		this._pageBegin = this.getPageBegin();
        		this._pageEnd = this.getPageEnd();
        		
        		this._firstPageElement = firstPageElement;
        		this._previousPageElement = previousPageElement;
        		this._nextPageElement = nextPageElement;
        		this._lastPageElement = lastPageElement;
        		this._currentPageElement = currentPageElement;
        		this._totalPagesElement = totalPagesElement;
        		
        		
        		this.onFirstPage = () => {};
        		this.onPreviousPage = () => {};
        		this.onNextPage = () => {};
        		this.onLastPage = () => {};
        		this.onPageChange = () => {};
        		
        		this.updatePageBookmarks();
        		
        		this.initEvents();
        	}
        	
        	initEvents () {
        		let paginator = this;
        		
                //Goto to first page
        		M2MJS.XBrowser.addHandler(this._firstPageElement, "click", function onClick() {
        			paginator._currentPage = 1;
        			paginator.onFirstPage();
        			paginator.onPageChange();
        			paginator.updatePageBookmarks();
                });    
        		
        		//Goto to previous page
        		M2MJS.XBrowser.addHandler(this._previousPageElement, "click", function onClick(){
        			if (paginator._currentPage > 1){
        				paginator._currentPage--;
        			}
        			
        			paginator.onPreviousPage();
        			paginator.onPageChange();		
        			paginator.updatePageBookmarks();
        		});
        		
        		//Goto to next page
        		M2MJS.XBrowser.addHandler(this._nextPageElement, "click", function onClick(){
        			if (paginator._currentPage < paginator._pages){
        				paginator._currentPage++;
        			}
        			
        			paginator.onNextPage();
        			paginator.onPageChange();
        			paginator.updatePageBookmarks();
        		});
        		
        		
        		//Goto to last page
        		M2MJS.XBrowser.addHandler(this._lastPageElement, "click",  function onClick(){
        			paginator._currentPage = paginator._pages;
        			
        			paginator.onLastPage();
        			paginator.onPageChange();
        			paginator.updatePageBookmarks();		
        		});

        		M2MJS.XBrowser.addHandler(this._currentPageElement, "blur", function onClick(){
        			if (paginator._currentPageElement.tagName.toLowerCase()=="input" && paginator._currentPageElement.type.toLowerCase()=="text"){
        				var pageNumber = paginator._currentPageElement.value;
        				if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber<=paginator.pages){
        					paginator._currentPage = Number(pageNumber);
        					paginator.onPageChange();
        				}
        			}
        			
        			paginator.onFirstPage();
        			paginator.onPageChange();
        			paginator.updatePageBookmarks();
        		});
        		
        		
        	}
        	
        	updatePageBookmarks () {
				//Update current page
				if (this._currentPageElement.tagName.toLowerCase()=="input" && this._currentPageElement.type.toLowerCase()=="text"){
					this._currentPageElement.value = this._currentPage;
				} else {
					this._currentPage.innerHTML = this._currentPage;
				}
				
				//Update total pages
				if (this._totalPagesElement.tagName.toLowerCase()=="input" && this._totalPagesElement.type.toLowerCase()=="text"){
					this._totalPagesElement.value = this._pages;
				}else{
					this._totalPagesElement.innerHTML = this._pages;
				}
        	}
        	
        	calculatePages () {
                if (this._totalLines == 0) {
                    return 1;
                }

                if (this._totalLines % this._linesPerPage == 0) {
                    return this._totalLines / this._linesPerPage;
                }

                return parseInt(this._totalLines / this._linesPerPage) + 1;
        	}
        	
        	getPageBegin() {
        		return ((this._currentPage - 1) * this._linesPerPage) + 1;
        	}
        	
        	getPageEnd() {
                if (this._currentPage * this._linesPerPage >= this._totalLines) {
                    return this._totalLines;
                }

                return this._currentPage * this._linesPerPage;
        	}
        	
        	get pages() {
        		return this._pages;
        	}
        	
        	set totalLines (totalLines) {
                this._totalLines = totalLines;
                this._pages = this.calculatePages();
            }
        	
        	get totalLines () {
                return this._totalLines;
            }
        	
        	set linesPerPage (linesPerPage) {
                this._linesPerPage = linesPerPage;
                this._pages = this.calculatePages();
            }
        	
        	get linesPerPage () {
                return this._linesPerPage;
            }
        	
        	set currentPage (currentPage) {
                this._currentPage = currentPage;
            }
        	
        	get currentPage () {
                return this._currentPage;
            }
        	
        } // Paginator

        
        /*
        ----------
        -- Sort -- 
        ----------
       */
        
        static Sort = class {
        	static SortTypes =  Object.freeze({
                 ascending: "ascending",
                descending: "descending"
        	});
        	
        	
        	static SortDataTypes =  Object.freeze({
                alphanumeric: "Alphanumeric",
                     numeric: "Numeric",
                        date: "Date"
        	});

        	constructor(sortAscClass = "", sortDescClass = "") {
        		this._sortAscClass = sortAscClass;
        		this._sortDescClass = sortDescClass;
        		
                this.sortColumns = [];
                this._currentSortedColumn = null;
        	}
        	
        	addColumn(sortableColumn) {
        		this.sortColumns.push(sortableColumn);
        	}
        	
        	get currentSortedColumn () {
        		return this._currentSortedColumn;
        	}
        	
        	set currentSortedColumn (sortableColumn) {
        		this._currentSortedColumn = sortableColumn;
        	}
        	
        	get sortAscClass () {
        		return this._sortAscClass;
        	}
        	
        	get sortDescClass () {
        		return this._sortDescClass;
        	}
        	
            static dataComparator (object1, object2, sort) {
                if (sort.currentSortedColumn.dataProperty == null || sort.currentSortedColumn.dataProperty == "") {
                    return 0;
                }

                switch (sort.currentSortedColumn.sortDataType) {
                    case M2MJS.Grid.Sort.SortDataTypes.numeric:
                        if (sort.currentSortedColumn.sortType == M2MJS.Grid.Sort.SortTypes.ascending) {
                            return Number(object2[sort.currentSortedColumn.dataProperty]) - Number(object1[sort.currentSortedColumn.dataProperty]);
                        } else {
                            return Number(object1[sort.currentSortedColumn.dataProperty]) - Number(object2[sort.currentSortedColumn.dataProperty]);
                        }
                        break;


                    case M2MJS.Grid.Sort.SortDataTypes.alphanumeric:
                        if (M2MJS.resolveObjectValue(sort.currentSortedColumn.dataProperty, object2) > M2MJS.resolveObjectValue(sort.currentSortedColumn.dataProperty, object1)) {
                            if (sort.currentSortedColumn.sortType ==  M2MJS.Grid.Sort.SortTypes.ascending) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else {
                            if (sort.currentSortedColumn.sortType == M2MJS.Grid.Sort.SortTypes.ascending) {
                                return -1;
                            } else {
                                return 1;
                            }
                        }

                        return 0;
                    break;

                    case M2MJS.Grid.Sort.SortDataTypes.date:
                        var date1 = new Date();
                        //value1 = date1.parseFromString(this._currentSortedColumn.dateFormat, resolveObjectValue(this._currentSortedColumn.dataProperty, object1));
                        value1 = M2MJS.Grid.Sort.parseFromString(date1, sort.currentSortedColumn.dateFormat, M2MJS.resolveObjectValue(sort.currentSortedColumn.dataProperty, object1));

                        var date2 = new Date();
                        //value2 = date2.parseFromString(this._currentSortedColumn.dateFormat, resolveObjectValue(this._currentSortedColumn.dataProperty, object2));
                        value2 = M2MJS.Grid.Sort.parseFromString(date2, sort.currentSortedColumn.dateFormat, M2MJS.resolveObjectValue(sort.currentSortedColumn.dataProperty, object1));
                        
                        if (value2 > value1) {
                            if (sort.currentSortedColumn.sortType == M2MJS.Grid.Sort.SortTypes.ascending) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else {
                            if (sort.currentSortedColumn.sortType == M2MJS.Grid.Sort.SortTypes.ascending) {
                                return -1;
                            } else {
                                return 1;
                            }
                        }

                        return 0;

                    break;

                    default: break;
                }
            }
            
            static parseFromString(date, format, dateString) {
            	
	            Date.prototype.parseFromString = function (format, dateString) {
	                var datePosition = format.indexOf("dd");
	                var separator = format.substring(datePosition + 2, datePosition + 3);
	
	                var dateFormatParts = format.split(separator);
	                var dateParts = dateString.split(separator);
	
	                var date, month, year;
	
	
	                for (var i = 0; i < dateFormatParts.length; i++) {
	                    if (dateFormatParts[i] == "dd") {
	                        date = Number(dateParts[i]);
	                    }
	
	                    if (dateFormatParts[i] == "MM") {
	                        month = Number(dateParts[i]);
	                    }
	
	                    if (dateFormatParts[i] == "yyyy") {
	                        year = Number(dateParts[i]);
	                    }
	                }
	
	
	                this.setFullYear(year, month - 1, date);
	
	                return this;
	            }
	            
	            return date.parseFromString(format, dateString);
            }
            
        	static SortableColumn = class {
        		constructor (element = null, 
        				sortDataType = M2MJS.Grid.Sort.SortDataTypes.alphanumeric, 
        				    sortType = M2MJS.Grid.Sort.SortTypes.ascending, 
        				dataProperty = "", 
        				  dateFormat = "dd/MM/yyyy") {
                    this._element = element;
                    this._sortDataType = sortDataType;
                    this._sortType = sortType;
                    this._dataProperty = dataProperty;
                    this._currentSortClass = "";
                    this._className = this.element == null ? "" : this.element.className;
                    this.dateFormat = dateFormat;
        		}
        		
        		get element () {
        			return this._element;
        		}
        		
        		set currentSortClass (currentSortClass) {
        			this._currentSortClass = currentSortClass;
        		}
        		
        		get currentSortClass () {
        			this._currentSortClass;
        		}
        		
        		get sortDataType () {
        			return this._sortDataType;
        		}
                
        		get sortType () {
        			return this._sortType;
        		}

        		set sortType (sortType) {
                    this._sortType = sortType;
        		}
                
                
        		get dataProperty () {
        			return this._dataProperty;
        		}
        		
        		equals (o) {
                    if (this.element != null && o.element != null) {
                        if (this.element.id && o.element.id) {
                            return this.element.id == o.element.id;
                        }
                    }

                    if (this.dataProperty != null && this.dataProperty != "" && o.dataProperty != null && o.dataProperty != "") {
                        return this.dataProperty == o.dataProperty;
                    }

                    return false;
               }
        	} // SortableColumn
        	
        } // Sort
        
        enableSorting (sortAscendingClass, sortDescendingClass) {
        	this._sort = new M2MJS.Grid.Sort(sortAscendingClass, sortDescendingClass);
        }
        
        addSortColumn(sortableColumn) {
        	if (this._sort == null) {
        		throw "Sorting is not enabled";
        	}
        	
        	this._sort.addColumn(sortableColumn);
        	
        	this.addSortEvent(sortableColumn);
        }
        
        addSortEvent(sortableColumn) {
            if (this._sort.currentSortedColumn == null) {
            	this._sort.currentSortedColumn = sortableColumn;
            }
            
            M2MJS.XBrowser.addHandler(sortableColumn.element, "click", (e) => {
                if (this._sort.currentSortedColumn != null) {
                	this._sort.currentSortedColumn.element.className = this._sort.currentSortedColumn.element.className.replace(this._sort.currentSortedColumn.currentSortClass, "");
                }

                if (!this._sort.currentSortedColumn.equals(sortableColumn)) {
                	const sort = this._sort;
                    this._sort.sortColumns.forEach ((sortColumn, index) => {
                            if (sortColumn.equals(sort.currentSortedColumn)) {
                                sortColumn.element.className = sortColumn.className;
                            }
                        }
                    );
                }

                this._sort.currentSortedColumn = sortableColumn;

                switch (this._sort.currentSortedColumn.sortType) {
                    case M2MJS.Grid.Sort.SortTypes.ascending:
                    	sortableColumn.element.currentSortClass = this._sort.sortAscClass;

                        if (this._sort.currentSortedColumn.equals(sortableColumn)) {
                        	sortableColumn.sortType = M2MJS.Grid.Sort.SortTypes.descending;
                        }
                        break;

                    case M2MJS.Grid.Sort.SortTypes.descending:
                    	sortableColumn.element.currentSortClass = this._sort.sortDescClass;

                        if (this._sort.currentSortedColumn.equals(sortableColumn)) {
                        	sortableColumn.sortType = M2MJS.Grid.Sort.SortTypes.ascending;
                        }

                        break;
                }

                this._sort.currentSortedColumn.element.className = sortableColumn.element.currentSortClass;

                let gridSort = this._sort;
                this._dataList.sort(function (object1, object2) {
                	return M2MJS.Grid.Sort.dataComparator(object1, object2, gridSort);
                });

                if (this.pagingEnabled) {
                	this.paginator.onPageChange();
                } else {
            		this.model = null;
            		this.gridRows = [];
                    this.deselectGridRow();
                    this.renderGrid();
                }
            });
        	
        }
        
        enablePaginator() {
            this.pagingEnabled = true;
        }

        disablePaginator() {
            this.pagingEnabled = false;
        }

        
        getData() {
            if (this.pagingEnabled) {
                return this._dataList.slice(this.paginator.getPageBegin() - 1, this.paginator.getPageEnd());
            } else {
                return this._dataList;
            }
        }
        
        defineObjectPaths() {
            for (let property in this._dataList) {
                this.objectPaths.push(property);
            }

            if (this._dataList != null && this._dataList.length > 0) {
                const rowModel = this._dataList[0];

                for (let property in rowModel) {
                    if (typeof rowModel[property] != "object") {
                        this.objectPaths.push(property);
                    } else {
                    	this.objectPaths.push(property);
                        this.objectPaths.push(property + ".");
                        this.traverseObjectModel(rowModel[property]);
                    }
                }
            }
        }
        
        traverseObjectModel(rowModel) {
            const currentObjectPath = this.objectPaths[this.objectPaths.length - 1];

            for (let property in rowModel) {
                if (typeof rowModel[property] != "object") {
                	this.objectPaths.push(currentObjectPath + property);
                }
                else {
                	this.objectPaths.push(currentObjectPath + property + ".");
                	this.traverseObjectModel(rowModel[property]);
                }
            }
        }
        
        deselectGridRow () {
        	const grid = this;
        	
            this.gridRows.forEach(
                function (gridRow, index) {
                    if (gridRow.isSelected) {
                        gridRow.deselect();

                        if (grid.onGridRowDeselect) {
                        	grid.onGridRowDeselect(gridRow);
                        }

                        return gridRow;
                    }
                }
            );

            return null;
        }        
        
        renderGrid() {
            this.clearGrid();
            
            const grid = this;
            
            this.getData().forEach (
                function (modelObject, index) {
                	
                    let gridRow = new M2MJS.Grid.GridRow (grid.gridTemplate, modelObject, grid.objectPaths, grid.renderersSet, grid.componentsSet);

                    gridRow.mouseOverClass = grid.rowMouseOverClassName;
                    gridRow.selectedClass = grid.rowSelectedClassName;
                    gridRow.modifiedClass = grid.rowModifiedClassName;
                    
                    grid.onGridRowRender(gridRow);

                    gridRow.onBeforeSelect = function () {
                        grid.deselectGridRow();
                    };

                    gridRow.onSelect = function () {
                        grid.onGridRowSelect(this);
                        grid.model = gridRow.model;
                    };

                    grid.gridRows.push(gridRow);

                    grid.gridContainer.appendChild(gridRow.renderGridRow());                    
                }
            );
        }

        clearGrid() {
            if (this.gridContainer.childNodes.length > 0) {
                //TODO: Investigate improvement
                for (let i = this.gridContainer.childNodes.length - 1; ; i--) {
                    this.gridContainer.removeChild(this.gridContainer.childNodes[i]);
                    if (i == 0) {
                        break;
                    }
                }
            }
        }

        get model() {
            return this.modelObject;
        }
        
        set model(modelObject) {
        	this.modelObject = modelObject;
        }

         get gridModel() {
            let gridRowsModelObjects = [];

            this.gridRows.forEach (
                function (gridRow, index) {
                    gridRowsModelObjects.push(gridRow.model);
                }
            );

            return gridRowsModelObjects;
        }

        set renderers(renderers) {
            this.renderersSet = renderers;
        }

        set  components(components) {
            this.componentsSet = components;
        }

        set sort (sort) {
        	this._sort = sort;
        }
        
        set dataList(dataList) {
        	this._dataList = null;
        	this._dataList = dataList;
        	
        	this.renderGrid();
        }
    }
    
    
}//M2MJS