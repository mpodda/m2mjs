function Select(elem) {
    if (arguments.length == 0) {
        this.selectElement = document.createElement("select");
        this.name = "";
        this.id = "";

        return this;
    } //if

    this.selectElement = elem;
    this.name = elem.name;
    this.id = elem.id;

    this.selectLastInserted = false;
    this.dataList = null;
    this.idProperty = null;
    
    return this;
} //Select

//--------------------------------------------------------------------

Select.prototype.addOption = function(optValue, optText) {
    var option = new Option();

    option.value = optValue;
    option.text = optText;

    this.selectElement[this.selectElement.length] = option;

    if (this.selectLastInserted) {
        this.selectElement.options[this.selectElement.length - 1].selected = true;
    } //if
    else {
        if (this.selectElement.length > 0) {
            this.selectElement.options[0].selected = true;
        } //if 
    } //else

    delete option;

}; //addOption

//--------------------------------------------------------------------

Select.prototype.updateOption = function(optValue, optText) {

    for (var i = 0; i < this.selectElement.length; i++) {
        if (this.selectElement.options[i].value == optValue) {
            this.selectElement.options[i].value = optValue;
            this.selectElement.options[i].text = optText;
            return;
        } //if
    } //for

}; //updateOption

//--------------------------------------------------------------------

Select.prototype.deleteOption = function(optValue) {

    for (var i = 0; i < this.selectElement.length; i++) {
        if (this.selectElement.options[i].value == optValue) {
            this.selectElement.options[i] = null;
        } //if
    } //for

    if (this.selectElement.options.length > 0) {
        this.selectElement.options[0].selected = true;
    } //if

}; //deleteOption

//--------------------------------------------------------------------

Select.prototype.setValue = function(optValue) {
    if (this.dataList != null) {
        this.selectElement.value = optValue[this.idProperty];
    } else {
        this.selectElement.value = optValue;
    }

};    //setValue

//--------------------------------------------------------------------

Select.prototype.getValue = function() {
    if (this.dataList != null) {
        return this.dataList[this.selectElement.selectedIndex];
    }

    return this.selectElement.value;
};    //setValue

//--------------------------------------------------------------------    

Select.prototype.getText = function() {
    return this.selectElement.options[this.selectElement.selectedIndex].text;
}; //setValue

//--------------------------------------------------------------------    

Select.prototype.fill = function(data) {
    for (var i = 0; i < data.length; i++) {
        this.addOption(data[i][0], data[i][1]);
    } //for        
}; //fill

//--------------------------------------------------------------------

Select.prototype.clear = function() {
    var len = this.selectElement.options.length;

    if (len == 0) {
        return;
    } //if

    for (var i = len; ; i--) {
        this.deleteOption(this.selectElement.options[i - 1].value);
        if (i == 1) {
            return;
        } //if
    } //for

}; //function

//--------------------------------------------------------------------
//Add: Marcello, 2006-10-31
Select.prototype.getLength = function() {
    return this.selectElement.options.length;
};

//--------------------------------------------------------------------
//Add: Marcello, 2006-10-31
Select.prototype.selectValue = function(optValue) {

    for (var i = 0; i < this.getLength(); i++) {
        if (this.selectElement.options[i].value == optValue) {
            this.selectElement.options[i].selected = true;
        } //if
    } //for

}; //selectValue

//--------------------------------------------------------------------

//Add: Marcello, 2006-10-31

Select.prototype.getOptionValue = function(optIndex) {
    if (optIndex < 0 || optIndex > this.getLength()) {
        return null;
    } //if

    return this.selectElement.options[optIndex].value;


}; //getOptionValue

//--------------------------------------------------------------------

//Add: Marcello, 2006-10-31    
Select.prototype.enableSelectLastInserted = function(enabled) {
    this.selectLastInserted = enabled;
}; //enableSelectLastInserted


//--------------------------------------------------------------------
//Add: Marcello, 2006-10-31
Select.prototype.selectOption = function(optIndex) {

    if (optIndex < 0 || optIndex > this.getLength()) {
        return;
    } //if

    this.selectElement.options[optIndex].selected = true;

}; //selectOption

//--------------------------------------------------------------------

//Add: Marcello, 2011-02-21
Select.prototype.getSelectedIndex = function() {
    return this.selectElement.selectedIndex;
};

//--------------------------------------------------------------------

//Add: Marcello, 2011-02-21
Select.prototype.getSelectedIndexes = function() {
    var selectedIndexes = new Array();

    for (var i = 0; i < this.getLength(); i++) {
        if (this.selectElement.options[i].selected) {
            selectedIndexes.push(i);
        }
    }

    return selectedIndexes;
};

//--------------------------------------------------------------------

//Add: Marcello, 2011-02-21
Select.prototype.getSelectedValues = function() {
    var selectedValues = new Array();

    for (var i = 0; i < this.getLength(); i++) {
        if (this.selectElement.options[i].selected) {
            selectedValues.push(this.getValue2(i));
        }
    }

    return selectedValues;
};

//--------------------------------------------------------------------

//Add: Marcello, 2011-02-21
Select.prototype.getValues = function() {
    var values = new Array();

    for (var i = 0; i < this.getLength(); i++) {
        values.push(this.getValue2(i));
    }

    return values;
};

//--------------------------------------------------------------------

Select.prototype.setSelectOnAddition = function(select) {
    this.selectOnAddition = select;
};

//--------------------------------------------------------------------

Select.prototype.renderChoices = function(dataList, idProperty, valueProperty) {
    this.dataList = dataList;
    this.idProperty = idProperty;
    
    for (var i = 0; i < dataList.length; i++) {
        this.addOption(dataList[i][idProperty], dataList[i][valueProperty]);
    }
};
