/**
 * Label
 *  Simple Rendering
 * */

function Label(element) {
    this.element = element;
    this.value = "";

    return this;
}

Label.prototype.setValue = function (value) {
    this.element.innerHTML = value;
    this.value = value;
};


Label.prototype.getValue = function () {
    return this.value;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * History data.
 * Renders xml data appending in an html table body.
 * Tag "<row>" contains each row.
 * Tag "<cell>" contains each cell.
 * */

function History(element) {
    this.element = element;
    this.value = "";

    return this;
}

History.prototype.setValue = function (value) {
    this.value = value;
    this.element.appendChild(this.renderValue());

};


History.prototype.getValue = function () {
    return this.value;
};


History.prototype.renderValue = function () {
    var rows = this.value.split("<row>");

    var tBodyElement = document.createElement("tbody");

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i].replace("</row>", "");
        var tr = document.createElement("tr");

        var cells = row.split("<cell>");
        for (var j = 1; j < cells.length; j++) {
            var cell = cells[j].replace("</cell>", "");
            var td = document.createElement("td");
            td.innerHTML = cell;
            tr.appendChild(td);
        }

        tBodyElement.appendChild(tr);
    }

    return tBodyElement;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/** 
 * Renders Component with Id and Description.
 * Input should be an array of objects (JSON or discrete)   
 * 
 * Requires "Select.js"
 * */

function SelectElements(element) {
    this.elementSelect = new Select(element);
    this.value = null;

    return this;
}

SelectElements.prototype.setValue = function (value) {
    this.value = value;
    this.elementSelect.clear();
    this.elementSelect.renderChoices(this.value, "Id", "Title");
};

SelectElements.prototype.getValue = function () {
    return this.elementSelect.dataList;
};

SelectElements.prototype.getSelectedIndex = function () {
    return this.elementSelect.getSelectedIndex();
};

SelectElements.prototype.reRenderChoices = function () {
    this.elementSelect.clear();
    this.elementSelect.renderChoices(this.value, "Id", "Title");
};


SelectElements.prototype.renderValue = function () {
    var s = "";
    for (var i = 0; i < this.value.length; i++) {
        s += this.value[i]["description"];
        if (i < this.value.length - 1) {
            s += ";&nbsp;";
        }
    }
    return s;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Set of Radio buttons
 * */

function RadioSet(elements) {
    this.radioElements = elements;

    return this;
}

RadioSet.prototype.setValue = function (value) {
	for (var i = 0; i < this.radioElements.length; i++) {
		if (this.radioElements[i].value==value){
			this.radioElements[i].checked = true;
			return;
		}
	}
};

RadioSet.prototype.getValue = function () {
    for (var i = 0; i < this.radioElements.length; i++) {
        if (this.radioElements[i].checked) {
            return this.radioElements[i].value;
        }
    }
};