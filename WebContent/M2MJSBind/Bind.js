function Form() {
    this.model = null;
    this.subModels = new Array();
    this.components = new Array();

    return this;
}

Form.prototype.setModel = function (model) {
    this.model = model;
   
    var modelObject = this.model.getObject();

    for (var i = 0; i < this.components.length; i++) {
        if (modelObject.hasOwnProperty(this.components[i].id)) {
            this.components[i].setValue(modelObject[this.components[i].id]);
        } else {
            if (this.components[i].id.indexOf(".") > 0) {
                var idParts = this.components[i].id.split(".");
                if (idParts.length > 1) {
                    var modelObjectPropertiesStringPath = "modelObject";
                    for (var p = 0; p < idParts.length; p++) {
                        modelObjectPropertiesStringPath += '[idParts[' + new String(p) + ']]';
                    }
                    this.components[i].setValue(eval(modelObjectPropertiesStringPath));
                }
            }
        }
    }
};

Form.prototype.addComponent = function (component) {
    this.components.push(component);
};


Form.prototype.getComponent = function (componentId) {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i]["id"] == componentId) {
            return this.components[i];
        }
    }

    return null;
};

Form.prototype.addSubmodel = function (subModelObject) {
    var subModel = new Model(subModelObject);

    this.subModels.push(subModel);

    //var modelObject = subModel.getObject();

    for (var i = 0; i < this.components.length; i++) {
        if (subModelObject.hasOwnProperty(this.components[i].id)) {
            this.components[i].setValue(subModelObject[this.components[i].id]);
        }
    }
};

Form.prototype.setSubmodel = function (subModel) {
    for (var i = 0; i < this.subModels.length; i++) {
	    if (this.subModels[i].id == subModel["id"]) {
	        return;
	    }
    }
};

Form.prototype.getModel = function () {
    var modelObject = this.model.getObject();
    
    for (var i = 0; i < this.components.length; i++) {
        if (modelObject.hasOwnProperty(this.components[i].id)) {
            modelObject[this.components[i].id] = this.components[i].getValue();
        } else {
            if (this.components[i].id.indexOf(".") > 0) {
                var idParts = this.components[i].id.split(".");
                if (idParts.length > 1) {
                    var modelObjectPropertiesStringPath = "modelObject";
                    for (var p = 0; p < idParts.length; p++) {
                        modelObjectPropertiesStringPath += '[idParts[' + new String(p) + ']]';
                    }

                    eval(modelObjectPropertiesStringPath + '= this.components[i].getValue();');
                }
            }
        }
    }
    this.model.setObject(modelObject);

    return this.model;
};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function Model(object) {
    this.object = object;

    return this;
}

Model.prototype.getObject = function () {
    return this.object;
};

Model.prototype.setObject = function (object) {
    this.object = object;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function Component(id, element) {
    this.id = id;
    this.element = element;

    return this;
}

//-------------------------------------------------------------------------------------------------

Component.prototype.getValue = function () {
    //element should implements method getValue()
    if (this.element.getValue != null) {
        return this.element.getValue();
    }
    else {
        if (this.element.type && this.element.type.toLowerCase() == "checkbox") {
            return this.element.checked;
        }
    }
    return this.element.value;
};

//-------------------------------------------------------------------------------------------------

Component.prototype.setValue = function (value) {
    //element should implements method setValue()
    if (this.element.setValue != null) {
        this.element.setValue(value);
    }
    else {
        if (this.element.type && this.element.type.toLowerCase() == "checkbox") {
            this.element.checked = value;
        }
        this.element.value = value;
    }
};