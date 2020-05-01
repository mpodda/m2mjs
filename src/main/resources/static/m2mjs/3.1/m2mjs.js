/**
 * New approach with ES 6, ES 7
 * 
 */

/**
 * 05/08/2019: Validator
 * 07/08/2019: Debbug validator
 * 07/08/2019: add "getComponent" at Form 
 * 09/08/2019: Component:  get value set value debug
 * 
 */

// ------------------------------------------------------------------------------------

/**
 * Private methods declarations
 */

const _traverseFields = Symbol('traverseFields');
const _isEmail = Symbol('isEmail');
const _traverseExternalValidationFunctions = Symbol('traverseExternalValidationFunctions');

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
        path.split('.').reduce (
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
    	
    	static get (url, isJson = true) {
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
    		this.type = "";
    	}
    	
    	get id () {
    		return this.componentId;
    	}
    	
    	set id (componentId) {
    		this.componentId = componentId;
    	}
    	
    	/*
    	getId() {
    		return this.componentId;
    	}
    	*/
    	
    	setValue (value) {
    		this.type = typeof value;
    		
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
            
            if (this.type.toLowerCase() == "number") {
            	return Number(this.element.value);
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
        constructor(modelObject = null) {
            this._modelObject = modelObject;
            this.components = [];
        }

        addComponent (component) {
            this.components.push(component);
        }
        
        getComponent(componentId) {
        	for (let component of this.components){
        		if (component.id === componentId) {
        			return component;
        		}
        	}
        	
        	return null;
        }
        
        set modelObject(mo) {
            this._modelObject = mo;
            
            const form = this;
            
            this.components.forEach (
                function (component, index) {
                    component.setValue(M2MJS.resolveObjectValue(component.id, form._modelObject));
                }
            );
        }

        get modelObject() {
        	const form = this;
        	
        	this.components.forEach (
                function (component, index) {
                	M2MJS.setObjectValue(component.id, form._modelObject, component.getValue());
                }
            );
        	
            return this._modelObject;
        }
    }


    /*
     ---------------
     -- Validator -- 
     ---------------
    */
    
    static Validator = class {
        
        /*
         -----------
         -- Field --
         -----------
        */
        static Field = class {
            constructor (elements = null) {
                this._affectElement = null;
                this._currentErrorMessage = null;
                this._mandatoryViolationErrorMessage = null;
                this._datatypeViolationErrorMessage = null;
                
                this._elements = elements;
                this._component = null;
                
                this._emptyValueForSelect = "0";
                this._emptyValueForInput = "";
                
                this._isMandatory = true;
                this._dataType = null;
                
                this._isValid = true;
            }
            
            async hasValue() {
                return new Promise((resolve, reject) => {
                	
                	if (this._elements != null){
	                	/* At least one element is checked */
	                	let isValidCheckboxOrRadio = false;
	                	
	                    this._elements.forEach (
	                        (element, index) => {
	                            if (element.type.toLowerCase() == "checkbox" || element.type.toLowerCase() == "radio") {
	                            	if (!isValidCheckboxOrRadio) {
	                            		isValidCheckboxOrRadio = element.checked;
	                            	}
	
	                            	/* Reach the end */
	                            	if (index == this._elements.length-1) {
	                            		resolve(isValidCheckboxOrRadio);
	                            	}
	                            } else if (element.type.toLowerCase() == "select-one") {
	                                if (element.value.length == 0 || element.value == this._emptyValueForSelect) {
	                                	resolve(false);
	                                }
	                            } else {
	                                if (element.value.length == 0 || element.value == this._emptyValueForInput) {
	                                    resolve(false);
	                                }
	                            }
	
	                            /* Not of above and not a check box or a radio button */ 
	                            if (element.type.toLowerCase() != "checkbox" && element.type.toLowerCase() != "radio") {
	                            	resolve(true);
	                            }
	                        }
	                    )
                	} else if (this._component != null) {
                		resolve (this._component.getValue() != null || (this._component.getValue() != null && this._component.getValue().trim() != ""));
                	} else {
                		resolve(false);
                	}
                });
            }
            
            getValue(index = 1) {
                if (index > 0) {
                    if (index == 1) {
                        return this._elements[0].value;
                    }
                    
                    return this._elements[index-1].value;
                }
                
                let values = [];
                
                this._elements.forEach (
                    (element, index) => {
                        values.push(element.value);
                    }
                );
                
                return values;
            }
            
            addElement(element) {
                if (this._elements == null) {
                    this._elements = [];
                }
            	
                this._elements.push(element);
            }
            
            hasDataType() {
                return this._dataType != null;
            }
            
            set affectElement(affectElement) {
                this._affectElement = affectElement;
            }
            
            get affectElement() {
                return this._affectElement;
            }
            
            set currentErrorMessage (errorMessage) {
                this._currentErrorMessage = errorMessage;
            }
            
            get currentErrorMessage () {
                return this._currentErrorMessage;
            }

            set mandatoryViolationErrorMessage(errorMessage) {
                this._mandatoryViolationErrorMessage = errorMessage;
            }
            
            get mandatoryViolationErrorMessage() {
                return this._mandatoryViolationErrorMessage;
            }

            set datatypeViolationErrorMessage (errorMessage) {
                this._datatypeViolationErrorMessage = errorMessage;
            }
            
            get datatypeViolationErrorMessage () {
                return this._datatypeViolationErrorMessage;
            }
            
            set emptyValueForSelect (value) {
                this._emptyValueForSelect = value;
            }
            
            get emptyValueForSelect () {
                return this._emptyValueForSelect;
            }
            
            set emptyValueForInput (value) {
                this._emptyValueForInput = value;
            }
            
            get emptyValueForInput () {
                return this._emptyValueForInput;
            }
            
            set isMandatory (mandatory) {
                this._isMandatory = mandatory;
            }
            
            get isMandatory () {
                return this._isMandatory;
            }
            
            set dataType (type) {
                this._dataType = type;
            }
            
            get dataType () {
                return this._dataType;
            }
            
            set isValid(valid) {
                this._isValid = valid;
            }
            
            get isValid() {
                return this._isValid;
            }

            set component (c) {
            	this._component = c;
            }
            
            get component () {
            	return this._component;
            }
            
        }
        
        // -- /Field ----------

        
        /*
         --------------------------------
         -- ExternalValidationFunction --
         --------------------------------
        */        
        static ExternalValidationFunction = class {
            constructor(functionCall=null, errorMessage=null) {
                this._functionCall = functionCall;
                this._fields = [];
                this._errorMessage = errorMessage;
            }
            
            addField(field) {
                this._fields.push(field);
            }
            
            async invoke() {
                return new Promise(async (resolve, reject) => {
                    const isValid = await this._functionCall();
                    resolve (isValid);
                });
            }
            
            set functionCall (fc) {
                this._functionCall = fc;
            }
            
            get functionCall () {
                return this._functionCall;
            }
            
            set errorMessage (message) {
                this._errorMessage = message;
            }

            get errorMessage () {
                return this._errorMessage;
            }
            
            get fields() {
                return this._fields;
            }
        }
        
        // -- /ExternalValidationFunction ----------
        
        static DataTypes = Object.freeze({
    		EMAIL: "email"  		
    	});

        constructor () {
            this._shortCircuitErrors = true;
            this._fields = [];
            this._externalValidationFunctions = [];
            this._isValid = true;
            this._countErrors = 0;
            
            this.onError = async (field, index) => {};
            this.onValidationOk = async (field) => {};
            
            this.onExternalValidationFunctionError = async (field, externalValidationFunction, index) => {};
            this.onExternalValidationFunctionValidationOk = async (field, externalValidationFunction) => {};
        }
        
        static resolveErrorMessage (errorMessage) {
            if (typeof errorMessage === "function") {
                return errorMessage();
            } 
            
            return errorMessage;
        }

        async clearErrors() {
        	this._fields.forEach (
                async (field, index) => {
                	this.onValidationOk(field);
                }
        	);
        	
        	this._externalValidationFunctions.forEach (
                    async (externalValidationFunction, index) => {
                    	externalValidationFunction.fields.forEach (
                			async (field, index) => {
                				this.onExternalValidationFunctionValidationOk(field, externalValidationFunction);
                			}
                    	)
                    	//
                    }
            	);
        	
        	
        }
        
        async isValid() {
            return new Promise((resolve, reject) => {
                resolve(this._isValid);
            });
        }
        
        async validate() {
            this._isValid = true;
            this._countErrors = 0;
            
            return new Promise(async (resolve, reject) => {
                this[_traverseFields]().then (
                    async (isValid) => {
                        resolve(isValid);
                    }
                )
                
                this[_traverseExternalValidationFunctions]().then (
                    async (isValid) => {
                        resolve(isValid);
                    }
                )
                
            });
        }
        
        async [_isEmail](val) {
            const emailPattern = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,10}|[0-9]{1,3})(\]?)$/;

            return new Promise((resolve, reject) => {
                resolve (val.match(emailPattern));
            });
        }

        async [_traverseFields]() {
            return new Promise(async (resolve, reject) => {
                this._fields.forEach (
                    async (field, index) => {
                        let fieldIsValid = true;
                        const hasValue = await field.hasValue();
                        
                        if (field.isMandatory) {
                            if (!hasValue) {
                                field.currentErrorMessage = field.mandatoryViolationErrorMessage;
                                this.onError (field, ++this._countErrors);
                                this._isValid = false;
                                fieldIsValid = false;
                                resolve(false);
                            } else {
                                this.onValidationOk(field);
                            }
                        }
                        
                        if (field.hasDataType() && hasValue){
                            switch (field.dataType) {
                                case M2MJS.Validator.DataTypes.EMAIL:
                                    const isEmail = await this[_isEmail](field.getValue());
                                    if (!isEmail) {
                                        field.currentErrorMessage = M2MJS.Validator.resolveErrorMessage(field.datatypeViolationErrorMessage);
                                        
                                        this.onError (field, ++this._countErrors);
                                        this._isValid = false;
                                        fieldIsValid = false;
                                        resolve(false);
                                    } else {
                                        this.onValidationOk(field);
                                    }
                                    
                                break;
                            }
                        }
                        
                        /* Reach the end with no violations */
                        if (index == this._fields.length - 1 && this._isValid) {
                            this.onValidationOk(field);
                            resolve(true);
                        } else {
                            if (fieldIsValid) {
                                this.onValidationOk(field);
                            }
                        }
                        
                        field.isValid = fieldIsValid;
                    }
                )
            });
        }

        async [_traverseExternalValidationFunctions]() {
            return new Promise(async (resolve, reject) => {
                this._externalValidationFunctions.forEach (
                    async (externalValidationFunction, index) => {
                        /* Check if field exists in validator and is valid */
                        let fieldExistsInValidatorAndIsValid = false;
                        
                        for (let field of externalValidationFunction.fields) {
                            fieldExistsInValidatorAndIsValid = this._fields.includes(field) && field.isValid;

                            if (fieldExistsInValidatorAndIsValid) {
                                break;
                            }
                        }
                        
                        /* Check for further violations */
                        if (!fieldExistsInValidatorAndIsValid) {
                            const isValid = await externalValidationFunction.invoke();

                            if (!isValid) {
                                this._isValid = false;
                            }

                            externalValidationFunction.fields.forEach (
                                async (field, index) => {
                                    if (isValid) {
                                        this.onExternalValidationFunctionValidationOk(field, externalValidationFunction);
                                    } else {
                                        field.currentErrorMessage = M2MJS.Validator.resolveErrorMessage(externalValidationFunction.errorMessage);
                                        this.onExternalValidationFunctionError(field, externalValidationFunction, ++this._countErrors);
                                    }
                                }
                            );

                            resolve(isValid);
                        } else {
                            resolve (true);
                        }
                    }
                )
            });
        }

        addField(field) {
            this._fields.push(field);
        }

        addExternalValidationFunction(externalValidationFunction) {
            this._externalValidationFunctions.push(externalValidationFunction);
        }

        set shortCircuitErrors(shortCircuitErrors) {
            this._shortCircuitErrors = shortCircuitErrors;
        }

        get shortCircuitErrors() {
            return this._shortCircuitErrors;
        }
    }
    
    // -- /Validator ----------

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
                    async function (renderer, index) {
                        const element = M2MJS.XBrowser.getElement(gridRow.gridRowContainer, renderer["name"]);
                        let rFunc = renderer["code"];
                        await rFunc(element, gridRow._modelObject, gridRow);
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

        set components(components) {
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