/*
Require: M2MJS_COMMON.js
*/


var M2MJS = (function () {

    function resolveObjectValue(path, object) {
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

    function setObjectValue(path, object, value) {
        path.split('.').reduce(
            function (prev, curr) {
                if (prev) {
                    prev[curr] = value;
                }
            },
            object || self
        );
    }

    ///////////////
    // Component // ---------------------------------------------------------------------------------------------------
    ///////////////

    var component = function (id, element) {
        return {
            getId: function () {
                return id;
            },

            setValue: function (value) {
                //element should implements method setValue()

                if (element.setValue) {
                    element.setValue(value);
                } else {
                    if (element.type && element.type.toLowerCase() == "checkbox") {
                        element.checked = value;
                    } else {
                        if (element.tagName.toLowerCase() == "input" || element.tagName.toLowerCase() == "textarea" || element.tagName.toLowerCase() == "select") {
                            element.value = value;
                        } else {
                            element.innerHTML = value;
                        }
                    }
                }
            },

            getValue: function () {
                //element should implements method getValue()

                if (element.getValue) {
                    return element.getValue();
                } else {
                    if (element.type && element.type.toLowerCase() == "checkbox") {
                        return element.checked;
                    }
                }

                return element.value;
            }
        }
    };


    //////////
    // Form // --------------------------------------------------------------------------------------------------------
    //////////

    var form = function () {
        var modelObject;
        var components = [];

        function _setModelObject(mo, componentId) {
            modelObject = mo;

            components.forEach(
                function (component, index) {
                    component.setValue(resolveObjectValue(component.getId(), modelObject));
                }
            );
        }

        function _getModelObject() {
            components.forEach(
                function (component, index) {
                    setObjectValue(component.getId(), modelObject, component.getValue());
                }
            );

            return modelObject;
        }

        return {
            setModelObject: _setModelObject,
            getModelObject: _getModelObject,
            addComponent: function (component) {
                components.push(component);
            }

        }
    };


    //////////
    // Grid // --------------------------------------------------------------------------------------------------------
    //////////


    var grid = (function (dataList, gridContainer, gridTemplate, g, paginator) {
        var _dataList = dataList;
        var _gridRows = [];
        var _objectPaths = [];
        var _renderers = [];
        var _components = [];

        var gridModuses = {
            "VIEW": "view",
            "EDIT": "edit"
        }

        var _gridRowModificationStatuses = {
            "UNMODIFIED": "unmodified",
            "UPDATED": "updated",
            "DELETED": "deleted"
        }

        _gridModus = gridModuses.VIEW;

        g.onGridRowRender = function (gridRow) { };
        g.onGridRowSelect = function (gridRow) { };
        g.onGridRowDeselect = function (gridRow) { };
        g.onGridRowModificationStatusChange = function (gridRow) { };

        _modelObject = null;

        _rowMouseOverClass = "overGridRow";
        _rowSelectedClass = "selectedGridRow";
        _rowModifiedClass = "modifiedGridRow";

        // ---------------------------------------------------------------------------------

        _defineObjectPaths();

        // === GridRow === ------------------------------------------------------------------------

        var gridRow = (function (gridTemplate, modelObject, objectPaths, renderers, components, gr) {
            var _gridTemplate = gridTemplate;
            var _initialModelObject = JSON.parse(JSON.stringify(modelObject));
            var _modificationStatus = _gridRowModificationStatuses.UNMODIFIED;

            var _isSelected = false;
            var _gridRowCurrentClass;
            var _gridRowContainer = null;
            var _contextMenu = null;

            var _buttons = [];

            var _renderers = renderers;
            var _components = components;

            var m2mjs = new M2MJS();

            var _form = new m2mjs.Form();

            var _mouseOverClass = "overGridRow";
            var _selectedClass = "selectedGridRow";
            var _modifiedClass = "modifiedGridRow";

            gr.onBeforeSelect = function () { };
            gr.onSelect = function () { };
            gr.defineComponent = function (id, element, objectValue) { };
            gr.renderElement = function (renderer, element, modelObject) { };

            var _xBrowser = new M2MJS_COMMON.XBrowser();

            function _renderGridRow() {
                if (_gridRowContainer == null) {
                    _gridRowContainer = _gridTemplate.cloneNode(true);
                }

                _gridRowCurrentClass = _gridRowContainer.className;

                _objectPaths.forEach(
                    function (objectPath, index) {
                    	//console.log(objectPath);
                        var element = _xBrowser.getElement(_gridRowContainer, objectPath);
                        var objectValue = _getObjectValue(objectPath);
                        _parseGridRow(objectPath, objectValue);

                        if (element != null) {
                            element.innerHTML = objectValue;

                            //Components (If any)
                            _components.forEach(
                                function (component, index) {
                                    if (component["id"] == objectPath) {
                                        var cFunc = component["code"];
                                        cFunc(gr, objectPath, element, objectValue);
                                    }
                                }
                            );
                        }
                    }
                );

                //Renderers (If any)
                _renderers.forEach(
                    function (renderer, index) {
                        var element = _xBrowser.getElement(_gridRowContainer, renderer["name"]);
                        var rFunc = renderer["code"];
                        rFunc(element, modelObject);
                    }
                );

                _xBrowser.addHandler(_gridRowContainer, "click", function onClick(e) {
                    gr.onBeforeSelect();
                    _gridRowContainer.className = _selectedClass;
                    _isSelected = true;

                    gr.onSelect();
                });

                _xBrowser.addHandler(_gridRowContainer, "mouseover", function onMouseOver(e) {
                    if (_gridRowContainer.id == "view") {
                        _gridRowContainer.className = gridRow.mouseOverClass;
                    }

                    if (!_isSelected) {
                        _gridRowContainer.className = _mouseOverClass;
                    }
                });

                _xBrowser.addHandler(_gridRowContainer, "mouseout", function onMouseOut() {
                    if (!_isSelected) {
                        _gridRowContainer.className = _gridRowCurrentClass;
                    }
                });

                _xBrowser.addHandler(_gridRowContainer, "contextmenu", function onContextMenu(e) {
                    if (_isSelected) {
                        if (_contextMenu != null) {
                            _gridRowContainer.appendChild(_contextMenu.Template(_gridRowContainer, e));
                        }

                        return false;
                    }
                    return false;
                });

                _form.setModelObject(modelObject);

                return _gridRowContainer;
            }

            // ---------------------------------------------------

            function _setMouseOverClass(mouseOverClass) {
                _mouseOverClass = mouseOverClass;
            }

            function _setSelectedClass(selectedClass) {
                _selectedClass = selectedClass;
            }

            function _setModifiedClass(modifiedClass) {
                _modifiedClass = modifiedClass;
            }

            // ---------------------------------------------------

            function _getModelObject() {
                return _form.getModelObject();
            }

            function _parseGridRow(objectPath, objectValue) {
                var toReplace = "{" + objectPath + "}";

                for (var i = 0; i < _gridRowContainer.childNodes.length; i++) {
                    try {
                        if (_gridRowContainer.childNodes[i].innerHTML.indexOf(toReplace) > -1) {
                            _gridRowContainer.childNodes[i].innerHTML = _gridRowContainer.childNodes[i].innerHTML.replace(eval("/" + toReplace + "/g"), objectValue);
                        }
                    } catch (e) {

                    }

                }
            }

            function _getObjectValue(objectPath) {
                return resolveObjectValue(objectPath, modelObject);
            }

            function _deselect() {
                _isSelected = false;

                _gridRowContainer.className = _gridRowCurrentClass;
            }

            function _gridRowIsSelected() {
                return _isSelected;
            }

            gr.getModelObject = function () {
                return _modelObject;
            };

            gr.getForm = function () {
                return _form;
            };

            return {
                renderGridRow: _renderGridRow,
                setMouseOverClass: _setMouseOverClass,
                setSelectedClass: _setSelectedClass,
                setModifiedClass: _setModifiedClass,
                getModelObject: _getModelObject,
                deselect: _deselect,
                isSelected: _gridRowIsSelected
            }
        });

        // === /GridRow === -----------------------------------------------------------------------



        // === Paginator === ----------------------------------------------------------------------
        if (paginator) {

            paginator.init = function (pg, totalLines, linesPerPage, firstPage, previousPage, nextPage, lastPage, currentPage, totalPages) {

                // === Page === -------------------------------------------------------------------

                pg.init = function (totalLines, linesPerPage) {
                    if (arguments.length == 0) {
                        totalLines = 1;
                    }

                    this.totalLines = totalLines;
                    this.linesPerPage = 1;

                    if (linesPerPage) {
                        this.linesPerPage = linesPerPage;
                    }

                    this.pages = this.calculatePages();

                    this.currentPage = 1;
                    this.pageBegin = this.getPageBegin();
                    this.pageEnd = this.getPageEnd();

                    return this;
                }

                //---------------------------------------------------------------------------------

                pg.calculatePages = function () {

                    if (this.totalLines == 0) {
                        return 1;
                    }

                    if (this.totalLines % this.linesPerPage == 0) {
                        return this.totalLines / this.linesPerPage;
                    }

                    return parseInt(this.totalLines / this.linesPerPage) + 1;
                }

                //---------------------------------------------------------------------------------

                pg.getPages = function () {
                    return this.pages;
                }

                //---------------------------------------------------------------------------------

                pg.setTotalLines = function (totalLines) {
                    this.totalLines = totalLines;
                    this.pages = this.calculatePages();

                }

                //---------------------------------------------------------------------------------

                pg.getTotalLines = function () {
                    return this.totalLines;
                }

                //---------------------------------------------------------------------------------

                pg.setLinesPerPage = function (linesPerPage) {

                    this.linesPerPage = linesPerPage;
                    this.pages = this.calculatePages();
                }

                //---------------------------------------------------------------------------------

                pg.getLinesPerPage = function () {
                    return this.linesPerPage;
                }

                //---------------------------------------------------------------------------------

                pg.setCurrentPage = function (currentPage) {
                    this.currentPage = currentPage;
                }

                //---------------------------------------------------------------------------------

                pg.getCurrentPage = function () {
                    return this.currentPage;
                }

                //---------------------------------------------------------------------------------

                pg.getPageBegin = function () {
                    return ((this.currentPage - 1) * this.linesPerPage) + 1;
                }

                //---------------------------------------------------------------------------------

                pg.getPageEnd = function () {
                    if (this.currentPage * this.linesPerPage >= this.totalLines) {
                        return this.totalLines;
                    }

                    return this.currentPage * this.linesPerPage;

                }

                // === / Page === -----------------------------------------------------------------

                this.page = pg;
                this.page.init(totalLines);
                this.page.setLinesPerPage(linesPerPage);

                this.firstPage = firstPage;
                this.previousPage = previousPage;
                this.nextPage = nextPage;
                this.lastPage = lastPage;
                this.currentPage = currentPage;
                this.totalPages = totalPages;


                this.onFirstPage = function () { };
                this.onPreviousPage = function () { };
                this.onNextPage = function () { };
                this.onLastPage = function () { };

                this.onPageChange = function () {
                    _modelObject = null;
                    _gridRows = []; //new Array();
                    _deselectGridRow();
                    _renderGrid();
                };

                this.updatePageBookmarks();

                this.initEvents();

                return this;
            }

            // ------------------------------------------------------------------------------------

            paginator.initEvents = function () {
                var _xBrowser = new M2MJS_COMMON.XBrowser();

                var thisPaginator = this;

                //Goto to first page
                _xBrowser.addHandler(this.firstPage, "click", function onClick() {
                    paginator.page.setCurrentPage(1);
                    paginator.onFirstPage();
                    paginator.onPageChange();
                    paginator.updatePageBookmarks();
                });

                //Goto to previous page
                _xBrowser.addHandler(this.previousPage, "click", function onClick() {
                    if (paginator.page.getCurrentPage() > 1) {
                        paginator.page.setCurrentPage(paginator.page.getCurrentPage() - 1);
                    }

                    paginator.onPreviousPage();
                    paginator.onPageChange();
                    paginator.updatePageBookmarks();
                });

                //Goto to next page
                _xBrowser.addHandler(this.nextPage, "click", function onClick() {
                    if (paginator.page.getCurrentPage() < paginator.page.getPages()) {
                        paginator.page.setCurrentPage(paginator.page.getCurrentPage() + 1);
                    }

                    paginator.onNextPage();
                    thisPaginator.onPageChange();
                    paginator.updatePageBookmarks();
                });


                //Goto to last page
                _xBrowser.addHandler(this.lastPage, "click", function onClick() {
                    paginator.page.setCurrentPage(paginator.page.getPages());

                    paginator.onLastPage();
                    paginator.onPageChange();
                    paginator.updatePageBookmarks();
                });

                _xBrowser.addHandler(this.currentPage, "blur", function onClick() {
                    if (paginator.currentPage.tagName.toLowerCase() == "input" && paginator.currentPage.type.toLowerCase() == "text") {
                        var pageNumber = paginator.currentPage.value;
                        if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= paginator.page.getPages()) {
                            paginator.page.setCurrentPage(Number(pageNumber));
                            paginator.onPageChange();
                        }
                    }


                    paginator.onFirstPage();
                    paginator.onPageChange();
                    paginator.updatePageBookmarks();
                });
            }

            // ------------------------------------------------------------------------------------

            paginator.updatePageBookmarks = function () {

                //Update current page
                if (this.currentPage.tagName.toLowerCase() == "input" && this.currentPage.type.toLowerCase() == "text") {
                    this.currentPage.value = page.getCurrentPage();
                } else {
                    this.currentPage.innerHTML = page.getCurrentPage();
                }

                //Update total pages
                if (this.totalPages.tagName.toLowerCase() == "input" && this.totalPages.type.toLowerCase() == "text") {
                    this.totalPages.value = page.getPages();
                } else {
                    this.totalPages.innerHTML = page.getPages();
                }

            };

            // ------------------------------------------------------------------------------------

            paginator.setPage = function (page) {
                this.page = page;
            };

            // ------------------------------------------------------------------------------------

            paginator.getCurrentPageNumber = function () {
                return this.page.getCurrentPage();
            };

            // ------------------------------------------------------------------------------------

            paginator.getPage = function () {
                return this.page;
            };

            /*
            paginator.onPageChange = function() {
                
                _gridRows = new Array();
                _deselectGridRow();
                _renderGrid();
            };
            */
        }

        // === / Paginator === --------------------------------------------------------------------


        function _defineObjectPaths() {
            for (var property in _dataList) {
                _objectPaths.push(property);
            }

            if (_dataList != null && _dataList.length > 0) {
                var rowModel = _dataList[0];

                for (var property in rowModel) {
                    if (typeof rowModel[property] != "object") {
                        _objectPaths.push(property);
                    } else {
                    	_objectPaths.push(property);
                        _objectPaths.push(property + ".");
                        _traverseObjectModel(rowModel[property]);
                    }
                }
            }
        }

        // ----------------------------------------------------------------------------------------

        function _traverseObjectModel(rowModel) {
            var currentObjectPath = _objectPaths[_objectPaths.length - 1];

            for (var property in rowModel) {
                if (typeof rowModel[property] != "object") {
                    _objectPaths.push(currentObjectPath + property);
                }
                else {
                    _objectPaths.push(currentObjectPath + property + ".");
                    _traverseObjectModel(rowModel[property]);
                }
            }
        }

        // ----------------------------------------------------------------------------------------

        function _deselectGridRow() {
            _gridRows.forEach(
                function (gridRow, index) {
                    if (gridRow.isSelected()) {
                        gridRow.deselect();

                        if (g.onGridRowDeselect) {
                            g.onGridRowDeselect(gridRow);
                        }

                        return gridRow;
                    }
                }
            );

            return null;
        }

        // ----------------------------------------------------------------------------------------

        function getData() {
            var pagingEnabled = (paginator != null);

            if (pagingEnabled) {
                return _dataList.slice(paginator.page.getPageBegin() - 1, paginator.page.getPageEnd());
            } else {
                return _dataList;
            }
        }

        // ----------------------------------------------------------------------------------------


        function _renderGrid() {
            _clearGrid();

            for (var i = 0; i < getData().length; i++) {
                var modelObject = getData()[i];

                var gr = {};
                var _gridRow = new gridRow(gridTemplate, modelObject, _objectPaths, _renderers, _components, gr);

                _gridRow.setMouseOverClass(_rowMouseOverClass);
                _gridRow.setSelectedClass(_rowSelectedClass);
                _gridRow.setModifiedClass(_rowModifiedClass);

                g.onGridRowRender(gr);

                gr.onBeforeSelect = function () {
                    _deselectGridRow();
                };

                gr.onSelect = function () {
                    g.onGridRowSelect(this);
                    _modelObject = this.getModelObject();
                };

                _gridRows.push(_gridRow);

                gridContainer.appendChild(_gridRow.renderGridRow());
            }
        };

        // ----------------------------------------------------------------------------------------

        function _clearGrid() {
            if (gridContainer.childNodes.length > 0) {
                for (var i = gridContainer.childNodes.length - 1; ; i--) {
                    gridContainer.removeChild(gridContainer.childNodes[i]);
                    if (i == 0) {
                        break;
                    }
                }
            }
        }


        // ----------------------------------------------------------------------------------------

        function _getModelObject() {
            return _modelObject;
        }

        // ----------------------------------------------------------------------------------------

        function _getGridModelObject() {
            var gridRowsModelObjects = [];

            _gridRows.forEach(
                function (gridRow, index) {
                    gridRowsModelObjects.push(gridRow.getModelObject());
                }
            );

            return gridRowsModelObjects;
        }

        // ----------------------------------------------------------------------------------------

        function _initRenderers(renderers) {
            _renderers = renderers;
        }

        // ----------------------------------------------------------------------------------------

        function _initComponents(components) {
            _components = components;
        }


        function _setDataList(dataList) {
            _dataList = null;

            _dataList = dataList;
            _gridRows = [];

            _renderGrid();
        }

        // === Sort === ------------------------------------------------------------------------

        var sortGrid = function () {
            var sortAscClass = "";
            var sortDescClass = "";

            var sortTypes = {
                ascending: "ascending",
                descending: "descending"
            }

            var sortDataTypes = {
                alphanumeric: "Alphanumeric",
                numeric: "Numeric",
                date: "Date"
            }

            var sortColumns = [];

            var currentSortedColumn = null;

            // ---------------------------------------------------------------------------------

            function SortableColumn() {
                this.element = null;
                this.sortDataType = sortDataTypes.alphanumeric;
                this.sortType = sortTypes.ascending;
                this.dataProperty = "";
                this.currentSortClass = "";
                this.className = "";
                this.dateFormat = "dd/MM/yyyy";

                return this;
            }

            SortableColumn.prototype.equals = function (o) {
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

            // ---------------------------------------------------------------------------------

            function addColumnSortEvent(column) {
                if (currentSortedColumn == null) {
                    currentSortedColumn = column;
                }

                var _xBrowser = new M2MJS_COMMON.XBrowser();

                _xBrowser.addHandler(column.element, "click", function onClick(e) {
                    if (currentSortedColumn != null) {
                        currentSortedColumn.element.className = currentSortedColumn.element.className.replace(currentSortedColumn.currentSortClass, "");
                    }

                    if (!currentSortedColumn.equals(column)) {
                        sortColumns.forEach(
                            function (sortColumn, index) {
                                if (sortColumn.equals(currentSortedColumn)) {
                                    sortColumn.element.className = sortColumn.className;
                                }
                            }
                        );
                    }

                    currentSortedColumn = column;

                    switch (currentSortedColumn.sortType) {
                        case sortTypes.ascending:

                            column.element.currentSortClass = sortAscClass;

                            if (currentSortedColumn.equals(column)) {
                                column.sortType = sortTypes.descending;
                            }
                            break;

                        case sortTypes.descending:
                            column.element.currentSortClass = sortDescClass;

                            if (currentSortedColumn.equals(column)) {
                                column.sortType = sortTypes.ascending;
                            }

                            break;
                    }

                    currentSortedColumn.element.className = column.element.currentSortClass;

                    _dataList.sort(dataComparator);

                    if (paginator) {
                        paginator.onPageChange();
                    } else {
                        _modelObject = null;
                        _gridRows = [];
                        _deselectGridRow();
                        _renderGrid();
                    }
                });
            }

            // ---------------------------------------------------------------------------------

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
            };

            // ---------------------------------------------------------------------------------

            function dataComparator(object1, object2) {
                if (currentSortedColumn.dataProperty == null || currentSortedColumn.dataProperty == "") {
                    return 0;
                }

                switch (currentSortedColumn.sortDataType) {
                    case sortDataTypes.numeric:
                        if (currentSortedColumn.sortType == sortTypes.ascending) {
                            return Number(object2[currentSortedColumn.dataProperty]) - Number(object1[currentSortedColumn.dataProperty]);
                        } else {
                            return Number(object1[currentSortedColumn.dataProperty]) - Number(object2[currentSortedColumn.dataProperty]);
                        }
                        break;


                    case sortDataTypes.alphanumeric:
                        if (resolveObjectValue(currentSortedColumn.dataProperty, object2) > resolveObjectValue(currentSortedColumn.dataProperty, object1)) {
                            if (currentSortedColumn.sortType == sortTypes.ascending) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else {
                            if (currentSortedColumn.sortType == sortTypes.ascending) {
                                return -1;
                            } else {
                                return 1;
                            }
                        }

                        return 0;
                        break;

                    case sortDataTypes.date:
                        var date1 = new Date();
                        value1 = date1.parseFromString(currentSortedColumn.dateFormat, resolveObjectValue(currentSortedColumn.dataProperty, object1));

                        var date2 = new Date();
                        value2 = date2.parseFromString(currentSortedColumn.dateFormat, resolveObjectValue(currentSortedColumn.dataProperty, object2));

                        if (value2 > value1) {
                            if (currentSortedColumn.sortType == sortTypes.ascending) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else {
                            if (currentSortedColumn.sortType == sortTypes.ascending) {
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

            // == Sort >>> Public == -----------------------------------------------------------

            return {
                getSortTypes: function () {
                    return sortTypes;
                },

                getDefaultSortType: function () {
                    return sortTypes.ascending;
                },

                getSortDataTypes: function () {
                    return sortDataTypes;
                },

                init: function (initData) {
                    sortAscClass = initData.sortAscendingClass;
                    sortDescClass = initData.sortDescendingClass;
                },

                addColumn: function (column) {
                    var newColumn = new SortableColumn();

                    if (column.element) {
                        newColumn.element = column.element;
                        newColumn.className = column.element.className;
                    }

                    if (column.sortDataType) {
                        newColumn.sortDataType = column.sortDataType;
                    }

                    if (column.sortType) {
                        newColumn.sortType = column.sortType;
                    }

                    if (column.dataProperty) {
                        newColumn.dataProperty = column.dataProperty;
                    }

                    if (column.dateFormat) {
                        newColumn.dateFormat = column.dateFormat;
                    }

                    sortColumns.push(newColumn);
                    addColumnSortEvent(newColumn);
                }
            }
        }();

        // === / Sort === ----------------------------------------------------------------------


        // ========================================================================================

        return {
            deselectGridRow: _deselectGridRow,
            getModelObject: _getModelObject,
            renderGrid: _renderGrid,
            gridRowModificationStatuses: _gridRowModificationStatuses,
            initRenderers: _initRenderers,
            initComponents: _initComponents,
            getGridModelObject: _getGridModelObject,
            Sort: sortGrid
        }


    });


    ////////////
    // Public // --------------------------------------------------------------------------------------------------------
    ////////////

    return {
        Form: form,
        Component: component,
        Grid: grid
    }

});