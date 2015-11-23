/*
Requires Select.js
Requires XBrowser.js
*/

function Autocomplete(inputElement, selectElement) {
    this.inputElement = inputElement;
    this.selectElement = selectElement;
    this.selectElement.selectLastInserted = true;
    this.searchValues = null;
    this.valuesIdColumnName = "Id";
    this.valuesValueColumnName = "Value";
    this.searchText = "";
    this.minMachCharacters = 3;
    this.caseSensitive = false;
    this.maxSelectElementSize = 10;
    this.value = null;

    this.textColumnNames = new Array();
  
    this.onBeforeSearch = function (searchText) { };

    this.initEvents();

    return this;
}

// ------------------------------------------------------------------------------------------------

Autocomplete.prototype.initEvents = function () {
    var autocomplete = this;

    XBrowserAddHandler(autocomplete.selectElement.selectElement, "dblclick", function onEvent(e) {
        autocomplete.inputElement.value = autocomplete.selectElement.getText();
        autocomplete.selectElement.selectElement.style.visibility = "hidden";
        autocomplete.value = autocomplete.selectElement.getValue();
    });

    XBrowserAddHandler(autocomplete.inputElement, "focus", function onEvent(e) {
        autocomplete.inputElement.select();
    });

    XBrowserAddHandler(autocomplete.inputElement, "keyup", function onEvent(e) {
        autocomplete.search(autocomplete.inputElement.value);
    });

    //XBrowserAddHandler(autocomplete.inputElement, "change", function onEvent(e) {
    //    autocomplete.search(autocomplete.inputElement.value);
    //});


};

// ------------------------------------------------------------------------------------------------

Autocomplete.prototype.setValuesIdColumnName = function (valuesIdColumnName) {
    this.valuesIdColumnName = valuesIdColumnName;
};

// ------------------------------------------------------------------------------------------------

Autocomplete.prototype.setValuesValueColumnName = function (valuesValueColumnName) {
    this.valuesValueColumnName = valuesValueColumnName;
};

// ------------------------------------------------------------------------------------------------

Autocomplete.prototype.setSearchValues = function (searchValues) {
    this.searchValues = searchValues;
};

// ------------------------------------------------------------------------------------------------

Autocomplete.prototype.addTextColumnNames = function (clear, value) {
    if (clear) {
        this.textColumnNames = new Array();
    }

    this.textColumnNames.push(value);
};

// ------------------------------------------------------------------------------------------------

Autocomplete.prototype.search = function (searchText) {
    this.selectElement.clear();
    this.selectElement.selectElement.size = 5;
    this.selectElement.selectElement.style.visibility = "hidden";

    if (this.searchText == searchText) {
        return;
    }

    this.searchText = searchText;

    if (searchText.length < this.minMachCharacters) {
        return;
    }


    this.onBeforeSearch(searchText);    

    //alert(this.searchValues[0][this.valuesValueColumnName]);

    for (var i = 0; i < this.searchValues.length; i++) {
        var matches = false;

        if (this.caseSensitive) {
            matches = this.searchValues[i][this.valuesValueColumnName].indexOf(searchText) > -1;
        } else {
            matches = this.searchValues[i][this.valuesValueColumnName].toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        }

        if (matches) {
            this.selectElement.addOption(this.searchValues[i][this.valuesIdColumnName], getText(this.textColumnNames, this.searchValues[i]));

            if (this.selectElement.getLength() == 1) {
                this.selectElement.selectElement.style.visibility = "visible";
            }

            //if (this.selectElement.selectElement.size < this.maxSelectElementSize) {
            //    this.selectElement.selectElement.size = this.selectElement.getLength() + 1;
            //}

        }
    }
};

// ------------------------------------------------------------------------------------------------

function getText(textColumnNames, value) {
    var text = "";

    for (i = 0; i < textColumnNames.length; i++) {
        text += value[textColumnNames[i]];
        if (i < textColumnNames.length - 1) {
            text += " ";
        }
    }

    return text;

};