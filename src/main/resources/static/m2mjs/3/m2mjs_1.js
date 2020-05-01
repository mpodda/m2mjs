/**
 * New approach with ES 6
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
    	
    	static post (url, requestData, isJson) {
    		if (isJson === undefined) {
    			isJson = true;
    		}

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
    	                
    	                if (cn.isJsonCall) {
    	                	response.data = JSON.parse(httpRequest.responseText);
	                	} else {
	                		 response.data = httpRequest.responseText;
	                	}
    	               
    	                
    	                if (httpRequest.status != 200) {
    	                	reject(response);
    	                } else {
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
     ----------
     -- Grid -- 
     ----------
    */

    static Grid = class {
        constructor(dataList, gridContainer, gridTemplate) {
            this._dataList = dataList;
            this.gridContainer = gridContainer;
            this.gridTemplate = gridTemplate;

            this.gridRows = [];
            this.objectPaths = [];
            this.renderersSet = [];
            this.componentsSet = [];
            
            //TODO: Rename to: "pagingEnabled"
            this.paginatorEnabled = false;
            
            this.rowMouseOverClassName = "overGridRow";
            this.rowSelectedClassName = "selectedGridRow";
            this.rowModifiedClassName = "modifiedGridRow";
            
            this.defineObjectPaths();

            this.onGridRowRender = function (gridRow) { };
            this.onGridRowSelect = function (gridRow) { };
            this.onGridRowDeselect = function (gridRow) { };
            this.onGridRowModificationStatusChange = function (gridRow) { };
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
                    this.gridRowContainer = this.gridTemplate.cloneNode(true)                }

                this.gridRowCurrentClass = this.gridRowContainer.className;
                
                const gridRow = this;
                
                this.objectPaths.forEach (
                    function (objectPath, index) {
                        let element = M2MJS.XBrowser.getElement(gridRow.gridRowContainer, objectPath);
                        const objectValue = gridRow.getObjectValue(objectPath);
                        
                        gridRow.parseGridRow(objectPath, objectValue);

                        if (element != null) {
                            element.innerHTML = objectValue;

                            //Components (If any)
                            gridRow.components.forEach (
                                function (component, index) {
                                    if (component["id"] == objectPath) {
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
                        rFunc(element, gridRow._modelObject);
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
        
        enablePaginator() {
            this.paginatorEnabled = true;
        }

        disablePaginator() {
            this.paginatorEnabled = false;
        }

        getData() {
            if (this.paginatorEnabled) {
                //return _dataList.slice(paginator.page.getPageBegin() - 1, paginator.page.getPageEnd());
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

        set dataList(dataList) {
        	this._dataList = null;
        	this._dataList = dataList;
        	
        	this.renderGrid();
        }
    }
}//M2MJS