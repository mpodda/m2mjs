function Grid(dataList, gridContainer, gridTemplate) {
    this.dataList = dataList;
    this.gridContainer = gridContainer;
    this.gridTemplate = gridTemplate;
    //this.form = form;

    //this.components = new Array();
    this.gridRows = new Array();
    
    this.objectPaths = new Array();
    
    this.onGridRowRender = function (gridRow) { };
    this.onGridRowSelect = function (gridRow) { };
    this.onGridRowDeselect = function (gridRow) { };

    this.modelObject = null;
    
    this.rowMouseOverClass = "overGridRow";
    this.rowSelectedClass = "selectedGridRow";

    this.defineObjectPaths();
    
    return this;
}

//-------------------------------------------------------------------------------------------------

Grid.prototype.defineObjectPaths = function() {
	
	if (this.dataList!=null && this.dataList.length > 0){
		var rowModel  = this.dataList[0];
		
		for (var property in rowModel) {
			if (typeof rowModel[property] != "object"){
				this.objectPaths.push(property);
			}else{
				this.objectPaths.push(property + ".");
				this.traverseObjectModel(rowModel[property]);
			}
		}
	}
};

//-------------------------------------------------------------------------------------------------

Grid.prototype.traverseObjectModel = function(rowModel) {
	var currentObjectPath = this.objectPaths[this.objectPaths.length-1];
	
	for (var property in rowModel) {
		if (typeof rowModel[property] != "object"){
			this.objectPaths.push(currentObjectPath + property);
		}
		else{
			this.objectPaths.push(currentObjectPath + property + ".");
			this.traverseObjectModel(rowModel[property]);
		}
	}
	
};

//------------------------------------------------------------------------------------------------

//Grid.prototype.addComponent = function (component) {
//    this.components.push(component);
//};

//-------------------------------------------------------------------------------------------------

Grid.prototype.deselectGridRow = function () {
    for (var i = 0; i < this.gridRows.length; i++) {
        if (this.gridRows[i].isSelected) {
            this.gridRows[i].deselect();

            this.onGridRowDeselect(this.gridRows[i]);

            return this.gridRows[i];
        }
    }

    return null;
};

//-------------------------------------------------------------------------------------------------

Grid.prototype.renderGrid = function () {
    var grid = this;

    this.clearGrid();

    for (var i = 0; i < this.dataList.length; i++) {
        var modelObject = this.dataList[i];
        var gridRow = new GridRow(this.gridTemplate, modelObject, this.objectPaths);
        gridRow.mouseOverClass = grid.rowMouseOverClass;
        gridRow.selectedClass = grid.rowSelectedClass;
        
        this.onGridRowRender(gridRow);

        gridRow.onBeforeSelect = function () {
            grid.deselectGridRow();
        };

        gridRow.onSelect = function () {
            grid.modelObject = this.getModelObject(); //this.modelObject;
            grid.onGridRowSelect(this);
        };

        this.gridRows.push(gridRow);
        this.gridContainer.appendChild(gridRow.renderGridRow());
    }
};

//-------------------------------------------------------------------------------------------------

Grid.prototype.clearGrid = function () {
    if (this.gridContainer.childNodes.length > 0) {
        for (var i = this.gridContainer.childNodes.length - 1; ; i--) {
            this.gridContainer.removeChild(this.gridContainer.childNodes[i]);
            if (i == 0) {
                break;
            }
        }
    }

};

//-------------------------------------------------------------------------------------------------

Grid.prototype.getModelObject = function () {
    return this.modelObject;
};

//------------------------------------------------------------------------------------------------

Grid.prototype.getGridModelObject = function () {
	var gridRowsModelObjects = new Array();
	
	for (var i=0; i<this.gridRows.length; i++){
		gridRowsModelObjects.push(this.gridRows[i].form.getModel().getObject());
	}
	
    return gridRowsModelObjects;
};

//-------------------------------------------------------------------------------------------------

Grid.prototype.setDataList = function (dataList) {
    this.dataList = null;

    this.dataList = dataList;
    this.gridRows = new Array();
};

// ================================================================================================

function GridRow(gridTemplate, modelObject, objectPaths) {
    this.gridTemplate = gridTemplate;
    this.modelObject = modelObject;
    this.objectPaths = objectPaths;
   
    this.isSelected = false;
    this.gridRowCurrentClass;
    this.gridRowContainer = null;
    this.contextMenu = null;

    this.buttons = new Array();
    
    this.form = new Form();

    this.mouseOverClass = "overGridRow";
    this.selectedClass = "selectedGridRow";

    this.onBeforeSelect = function () { };
    this.onSelect = function () { };
    this.defineComponent = function(id, element, objectValue){};

    return this;
}

//-------------------------------------------------------------------------------------------------

GridRow.prototype.renderGridRow = function () {
    if (this.gridRowContainer == null) {
        this.gridRowContainer = this.gridTemplate.cloneNode(true);
    }

    this.gridRowCurrentClass = this.gridRowContainer.className;
    
    for (var i=0; i < this.objectPaths.length; i++){
    	var element = getElement(this.gridRowContainer, this.objectPaths[i]);
        
        var objectValue = this.getObjectValue(this.objectPaths[i]);
        this.parseGridRow(this.objectPaths[i], objectValue);
        
    	if (element != null){
            /*
    		var objectPathParts = this.objectPaths[i].split(".");
    		var modelObjectPropertiesStringPath = "this.modelObject";
    		
    		for (var p=0; p<objectPathParts.length; p++){
    			modelObjectPropertiesStringPath += '[objectPathParts[' + new String(p) + ']]';
    		}
    		
    		var objectValue = eval(modelObjectPropertiesStringPath);
            */
    		if (typeof objectValue == "function"){
    			var functionValue = eval(modelObjectPropertiesStringPath + "()");
    			if (typeof functionValue == "object"){
    				if (functionValue.toString().indexOf("object HTML")>-1){
    					element.appendChild(functionValue);
    				} else {
    					element.innerHTML = functionValue;
    				}
    				
    			}else{
    				element.innerHTML = functionValue;
    			}
    		} else {
    			element.innerHTML = objectValue;
    			this.defineComponent(this.objectPaths[i], element, objectValue);
    		}
    	}
        
    }

    var gridRow = this;

    XBrowserAddHandler(this.gridRowContainer, "click", function onClick(e) {
        gridRow.onBeforeSelect();
        gridRow.gridRowContainer.className = gridRow.selectedClass;
        gridRow.isSelected = true;

        gridRow.onSelect();
    });

    XBrowserAddHandler(this.gridRowContainer, "mouseover", function onMouseOver(e) {
        XBrowserStopEventPropagation(e);
        if (gridRow.gridRowContainer.id == "view") {
            gridRow.gridRowContainer.className = gridRow.mouseOverClass;
        }

        if (!gridRow.isSelected) {
            gridRow.gridRowContainer.className = gridRow.mouseOverClass;
        }
    });

    XBrowserAddHandler(this.gridRowContainer, "mouseout", function onMouseOut() {
        if (!gridRow.isSelected) {
            gridRow.gridRowContainer.className = gridRow.gridRowCurrentClass;
        }
    });

    XBrowserAddHandler(this.gridRowContainer, "contextmenu", function onContextMenu(e) {
        if (gridRow.isSelected) {
            if (gridRow.contextMenu != null) {
                gridRow.gridRowContainer.appendChild(gridRow.contextMenu.Template(gridRow.gridRowContainer, e));
                XBrowserStopEventPropagation(e);
                XBrowserStopDefaultEvents(e);
            }

            return false;
        }
        return false;
    });

    this.form.setModel (new Model(this.modelObject));
    
    return this.gridRowContainer;
};



// ------------------------------------------------------------------------------------------------

GridRow.prototype.deselect = function () {
    this.isSelected = false;

    this.gridRowContainer.className = this.gridRowCurrentClass;
    try {
        this.gridRowContainer.removeChild(this.contextMenu.Template());
    } catch (e) { }

};

// ------------------------------------------------------------------------------------------------

GridRow.prototype.setContextMenu = function (contextMenu) {
    this.contextMenu = contextMenu;
};

// ------------------------------------------------------------------------------------------------

GridRow.prototype.addButton = function (button) {
    this.buttons.push(button);
};

//------------------------------------------------------------------------------------------------

GridRow.prototype.getModelObject = function(){
	return this.form.getModel().getObject();
};

//------------------------------------------------------------------------------------------------

GridRow.prototype.parseGridRow = function(objectPath, objectValue){
    var toReplace = "{" + objectPath + "}";
    
    if (this.gridRowContainer.innerHTML.indexOf(toReplace) > -1){
        //this.gridRowContainer.innerHTML = this.gridRowContainer.innerHTML.replace(eval("/{" + objectPath + "}/g"), objectValue);
        this.gridRowContainer.innerHTML = this.gridRowContainer.innerHTML.replace(eval("/" + toReplace + "/g"), objectValue);
    }
}

//------------------------------------------------------------------------------------------------

GridRow.prototype.getObjectValue = function(objectPaths){
    var objectPathParts = objectPaths.split(".");
    var modelObjectPropertiesStringPath = "this.modelObject";
    
    for (var p=0; p<objectPathParts.length; p++){
        modelObjectPropertiesStringPath += '[objectPathParts[' + new String(p) + ']]';
    }
    
    return eval(modelObjectPropertiesStringPath);
}

// ================================================================================================

function M2MJSGrid() {

    return this;
}


// ================================================================================================

function M2MJSList(list) {
    this.list = list;

    return this;
}
