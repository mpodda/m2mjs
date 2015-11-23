function SortTypes() {
        this.ascending = "ascending";
        this.descending = "descending";
        
        return this;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SortTypes.prototype.getDefaultSortType = function(){
        return this.ascending;
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function SortDataType(){
        this.alphanumeric = "Alphanumeric";
        this.numeric = "Numeric";
        this.date = "Date";
        
        return this;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function Sort(sortAscClass, sortDescClass){
        this.sortAscClass = sortAscClass;
        this.sortDescClass = sortDescClass;
        this.sortType = null;
        this.currentSortClass = "";
        this.currentSortElement = null;
        
        return this;
}

// ------------------------------------------------------------------------------------------------

Sort.prototype.sort = function(sort, currentSortElement){
        if (this.currentSortElement!=null){
                this.currentSortElement.className = this.currentSortElement.className.replace(this.currentSortClass, "");
        }

        switch (sort) {
                case new SortTypes().ascending:
                        this.sortType = new SortTypes().ascending;
                        this.currentSortClass = this.sortAscClass;
                break;

                case new SortTypes().descending:
                        this.sortType = new SortTypes().descending;
                        this.currentSortClass = this.sortDescClass;
                break;
                
                default:
                        return;
                break;
        }
        
        
        
        this.currentSortElement = currentSortElement;
        this.currentSortElement.className += " " + this.currentSortClass;
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function GridHeaderCell(headerCellTemplate, gridHeader, headerPositionOrder, sortDataType){
        this.headerCellTemplate = headerCellTemplate;
        this.gridHeader = gridHeader;
        this.headerPositionOrder = headerPositionOrder;
        this.headerCellTemplateParents = new Array();
        this.headerCellTemplateChildren = new Array();
        this.sortDataType = sortDataType;
        this.sortType = null;
        
        this.startDrag = false;
        this.resizeWidth = false;
        this.resizeHeight = false;
        this.startResize = false;
        this.sX = 0;
        
        this.onSort = function(gridHeaderCell){};
        
        this.init();
        
        return this;
}

// ------------------------------------------------------------------------------------------------

GridHeaderCell.prototype.init = function(){

		//retrieve parents
        if (this.gridHeader!=null && this.gridHeader.headerContainerTemplate != null){
                var parentElement = this.headerCellTemplate.parentElement;
                
                while (parentElement!= null && parentElement.parentElement != this.gridHeader.headerContainerTemplate){
                        this.headerCellTemplateParents.push(parentElement);
                        
                        parentElement = parentElement.parentElement;
                }
        };
        
        
        
        //retrieve children
        if (this.headerCellTemplate != null && this.headerCellTemplate.childNodes.length>0){
                var childElement = this.headerCellTemplate.childNodes[0];
                
                while (childElement != null){
                        this.headerCellTemplateChildren.push(childElement);
                        childElement = childElement.childNodes[0];
                }
                
        }
        
        var gridHeaderCell = this;
        
        XBrowserAddHandler(this.headerCellTemplate, "click", function onCLick(e){
                if (gridHeaderCell.startResize==false){
                        gridHeaderCell.onSort(gridHeaderCell);
                }
        });

//        XBrowserAddHandler(this.headerCellTemplate, "mouseup", function onMouseUp(e){
//                
//                for (var gridRow=0; gridRow<gridHeaderCell.gridHeader.grid.gridRows.length; gridRow++){
//                        gridHeaderCell.gridHeader.grid.gridRows[gridRow].cellElements[gridHeaderCell.headerPositionOrder].style.borderRight = "";
//                }               
//        });
        

//        XBrowserAddHandler(this.headerCellTemplate, "mousedown",  function onMouseDown(e){
//                var x = XBrowserEventClientX(e);
//                var offLeft = XBrowserOffsetLeft(gridHeaderCell.headerCellTemplate) + XBrowserElementWidth(gridHeaderCell.headerCellTemplate);
//                
//                if (offLeft-5 <= x && x <= offLeft + 5){
//                        gridHeaderCell.startResize = true;
//                        
//                        var verticalBar = document.createElement("div");
//                        
//                        verticalBar.setAttribute("width", "5px");
//                        verticalBar.setAttribute("height", "25px");
//                        verticalBar.setAttribute("background-color", "#ff5500");
//                        
//                        gridHeaderCell.gridHeader.grid.gridContainer.appendChild(verticalBar);
//                }
//                
//                gridHeaderCell.sX = XBrowserEventClientX(e);
//        });
        
        
//        XBrowserAddHandler(this.headerCellTemplate, "mousemove",  function onMouseDown(e){
//                
//        });
};

//------------------------------------------------------------------------------------------------

GridHeaderCell.prototype.dataCompaire = function(object1, object2){
        
	//alert(JSON.stringify(object1));
        
        var value1 = getAttributeByIndex(object1, this.headerPositionOrder); //.toUpperCase();
        var value2 = getAttributeByIndex(object2, this.headerPositionOrder); //.toUpperCase();
        
        if (this.sortDataType==new SortDataType().numeric){
                value1 = Number(value1);
                value2 = Number(value2);
        }
        
        if (this.sortDataType==new SortDataType().date){
                var date1 = new Date();
                value1 = date1.parseFromString("dd/MM/yyyy", value1);
                
                var date2 = new Date();
                value2 = date2.parseFromString("dd/MM/yyyy", value2);
        }
        
        
        
        switch (this.sortType) {
                case new SortTypes().ascending:
                        //Numeric
                        if (this.sortDataType==new SortDataType().numeric || this.sortDataType==new SortDataType().date){
                                return value1-value2;
                        }
        
                        //String
                        if (this.sortDataType==new SortDataType().alphanumeric){
                                if (value1 < value2){
                                        return -1;
                                }
                                if (value1 > value2){
                                        return 1;
                                }
                        }
                        
                        
                break;
        
                case new SortTypes().descending: 
                        //Numeric       
                        if (this.sortDataType==new SortDataType().numeric  || this.sortDataType==new SortDataType().date){
                                return value2-value1;
                        }
        
                        //String
                        if (this.sortDataType==new SortDataType().alphanumeric){
                                if (value1 < value2){
                                        return 1;
                                }
                                if (value1 > value2){
                                        return -1;
                                }
                        }
                
                        break;
                }

        return 0;       
};

//------------------------------------------------------------------------------------------------

GridHeaderCell.prototype.getHeaderPositionOrder = function(){
        return this.headerPositionOrder;
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function GridHeader(headerContainerTemplate, grid) {
        this.headerContainerTemplate = headerContainerTemplate;
        this.sortedHeaderCell = null;
        this.sortType = new SortTypes().getDefaultSortType();
        this.grid = grid;
        
        this.headerCells = new Array();
        this.onSort = function(){};
        
        return this;
}

// ------------------------------------------------------------------------------------------------

GridHeader.prototype.addHeaderCell = function(headerCellTemplate, sortDataType, objectPositionOrder){
		var headerCellPositionOrder = objectPositionOrder;
		
		if (arguments.length<3){
			headerCellPositionOrder = this.headerCells.length;
		}
		
        var gridHeaderCell = new GridHeaderCell(headerCellTemplate, this, /*this.headerCells.length*/headerCellPositionOrder, sortDataType);
        var thisGridHeader = this;
        
        gridHeaderCell.onSort = function() {
                thisGridHeader.sortedHeaderCell = gridHeaderCell;
                thisGridHeader.sortedHeaderCell.sortType = thisGridHeader.sortType;
                thisGridHeader.onSort();
        };
        
        this.headerCells.push(gridHeaderCell);
};

//-------------------------------------------------------------------------------------------------

GridHeader.prototype.getHeaderElementOrder = function(headerElement){
        for (var i=0; i<this.headerCells.length; i++){
                alert(this.headerCells[i]==headerElement);
        }
};

//-------------------------------------------------------------------------------------------------

GridHeader.prototype.setSortedHeaderCell = function(sortedHeaderCell){
        this.sortedHeaderCell = sortedHeaderCell;
};

//-------------------------------------------------------------------------------------------------

GridHeader.prototype.getSortedHeaderCell = function(){
        return this.sortedHeaderCell;
};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getAttributeByIndex(obj, index){
    var i = 0;
    for (var attr in obj){
      if (index === i){
        return obj[attr];
      }
      i++;
    }
    return null;
}