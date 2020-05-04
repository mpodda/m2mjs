class SelectComponent extends M2MJS_Component {
	constructor(selectElement) {
		super(selectElement.id, selectElement);

		this.element = selectElement;
		this._dataList = null;
		this._idProperty = null;
	}

	setValue(value) {
		if (this.dataList != null && value != null) {
			this.element.value = value[this.idProperty];
		} else {
			this.element.value = value;
		}

	}

	getValue() {
		if (this.dataList != null) {
			return this.dataList[this.element.selectedIndex];
		}

		return this.element.value;
	}

	renderChoices(dataList, idProperty, valueProperty) {
		this.dataList = dataList;
		this.idProperty = idProperty;

		const selectComponent = this;

		this.dataList.forEach(
			(dataItem, index) => {
				selectComponent.addOption(dataItem[idProperty], dataItem[valueProperty]);
			}
		)
	}

	clear() {
		const len = element.options.length;

		if (len == 0) {
			return;
		}

		for (var i = len; ; i--) {
			this.deleteOption(this.element.options[i - 1].value);
			if (i == 1) {
				return;
			}
		}
	}

	addOption(optValue, optText) {
		let option = new Option();

		option.value = optValue;
		option.text = optText;

		this.element[this.element.length] = option;
	}

	deleteOption(optValue) {
		this.element.forEach(
			(option, index) => {
				if (option.value == optValue) {
					this.options[index] = null;
				}

				if (this.options.length > 0) {
					this.options[0].selected = true;
				}
			}
		);
	}

	set dataList(dataList) {
		this._dataList = dataList;
	}

	get dataList() {
		return this._dataList;
	}

	set idProperty(idProperty) {
		this._idProperty = idProperty;
	}

	get idProperty() {
		return this._idProperty;
	}
}

// ------------------------------------------------------------------------------------------------------------------------------------------------

class ActivationButton extends M2MJS_Component {
	constructor(id, element) {
		super(id, element);

		this.element = element;
		this.isActive = (element.children[0].className == "icon-check" ? true : false);

		this.initEvents();
	}

	initEvents() {
		let activationButton = this;

		M2MJS_XBrowser.addHandler(activationButton.element, "click", (e) => {
			activationButton.isActive = !activationButton.isActive;
			activationButton.renderIcon();
		});

		this.renderIcon();
	}

	renderIcon() {
		if (!this.isActive) {
			this.element.className = "btn btn-danger";
			this.element.children[0].className = "icon-check-empty";
			this.element.children[1].textContent = "Not Active";
		} else {
			this.element.className = "btn btn-primary";
			this.element.children[0].className = "icon-check";
			this.element.children[1].textContent = "  Active";
		}
	}

	getValue() {
		return this.isActive;
	}

	setValue(value) {
		this.isActive = value;
		this.renderIcon();
	}

}

// ---------------------------------------------------------------------------------------------

class RadioSet extends M2MJS_Component {
	constructor(id, elements) {
		super(id, null);

		this.elements = elements;
	}

	setValue(value) {
		for (var i = 0; i < this.elements.length; i++) {
			if (this.elements[i].value == value) {
				this.elements[i].checked = true;
				return;
			}
		}
	}

	getValue() {
		for (var i = 0; i < this.elements.length; i++) {
			if (this.elements[i].checked) {
				return this.elements[i].value;
			}
		}
	}
}

//---------------------------------------------------------------------------------------------

class GenderView extends M2MJS_Component {
	constructor(id, element) {
		super(id, null);

		this.element = element;

		this.value = null;
	}

	setValue(value) {
		this.element.innerHTML = this.getText(value);
		this.value = value;
	}

	getValue() {
		return this.value;
	}

	getText(value) {
		switch (value) {
			case "M": return "Men";
			case "W": return "Women";
			default: return value;
		}
	}
}

class ActiveStatusView extends M2MJS_Component {
	constructor(id, element) {
		super(id, null);

		this.element = element;

		this.value = null;
	}

	setValue(value) {
		this.element.innerHTML = this.getText(value);
		this.value = value;
	}

	getValue() {
		return this.value;
	}

	getText(value) {
		switch (value) {
			case true: return "Yes";
			case false: return "No";
			default: return value;
		}
	}
}

class NationalityView extends M2MJS_Component {
	constructor(id, element) {
		super(id, null);

		this.element = element;

		this.value = null;
	}

	setValue(value) {
		this.element.innerHTML = this.getText(value);
		this.value = value;
	}

	getValue() {
		return this.value;
	}

	getText(value) {
		return `${value.description} (${value.code})`;
	}
}