var RadioSet = function (elements) {
    _radioElements = elements;

    function _setValue(value) {
        for (var i = 0; i < _radioElements.length; i++) {
            if (_radioElements[i].value == value) {
                _radioElements[i].checked = true;
                return;
            }
        }
    }

    function _getValue() {
        for (var i = 0; i < _radioElements.length; i++) {
            if (_radioElements[i].checked) {
                return _radioElements[i].value;
            }
        }
    }

    return {
        setValue: _setValue,
        getValue: _getValue
    }
};

// ------------------------------------------------------------------------------------------------

var BootstapCheckButton = function (element) {
    var checked = (element.children[0].style.visiblity == "" || element.children[0].style.visiblity == "visible");

    init();

    function init() {
        var xBrowser = new M2MJS_COMMON.XBrowser();

        xBrowser.addHandler(element.parentElement, "click", function onClick(e) {
            _setValue(!_getValue());
        });

    }

    function _getValue() {
        return checked;
    }

    function _setValue(value) {
        checked = value;

        if (value) {
            element.children[0].style.visibility = "visible";
        } else {
            element.children[0].style.visibility = "hidden";
        }
    }

    return {
        getValue: _getValue,
        setValue: _setValue
    }

};

// ------------------------------------------------------------------------------------------------

var ActivationButton = function (element) {
    isActive = (element.children[0].className == "icon-check" ? true : false);

    initEvents();

    function initEvents() {
        var xBrowser = new M2MJS_COMMON.XBrowser();

        xBrowser.addHandler(element, "click", function onClick(e) {
            isActive = !isActive;

            renderIcon();
        });

        renderIcon();
    }

    function renderIcon() {
        if (!isActive) {
            element.className = "btn btn-danger";
            element.children[0].className = "icon-check-empty";
            element.children[1].textContent = "Not Active";
        } else {
            element.className = "btn btn-primary";
            element.children[0].className = "icon-check";
            element.children[1].textContent = "  Active";
        }
    }

    function _getValue() {
        return isActive;
    }

    function _setValue(value) {
        isActive = value;
        renderIcon();
    }

    return {
        getValue: _getValue,
        setValue: _setValue
    }

};

// ------------------------------------------------------------------------------------------------

var SelectComponent = function (selectElement) {

    var dataList = null;
    var idProperty = null;
    var element = selectElement;

    function _setValue(value) {
        if (dataList != null && value != null) {
            element.value = value[idProperty];
        } else {
           element.value = value;
        }
    }

    function _getValue() {
        if (dataList != null) {
            return dataList[element.selectedIndex];
        }

        return element.value;
    }

    function _renderChoices(datal, idProp, valueProperty) {
        dataList = datal;
        idProperty = idProp;

        for (var i = 0; i < dataList.length; i++) {
            addOption(dataList[i][idProperty], dataList[i][valueProperty]);
        }
        
    }

    function _clear() {
        var len = element.options.length;

        if (len == 0) {
            return;
        }

        for (var i = len; ; i--) {
            deleteOption(element.options[i - 1].value);
            if (i == 1) {
                return;
            }
        }
    }

    function addOption(optValue, optText) {
        var option = new Option();

        option.value = optValue;
        option.text = optText;

        element[element.length] = option;
    }

    function deleteOption(optValue) {
        for (var i = 0; i < element.length; i++) {
            if (element.options[i].value == optValue) {
                element.options[i] = null;
            }
        }

        if (element.options.length > 0) {
            element.options[0].selected = true;
        }

    }

    function _setDataList(dl) {
        dataList = dl;
    }

    function _setIdProlerty(idProp) {
        idProperty = idProp;
    }

    return {
        setValue: _setValue,
        getValue: _getValue,
        renderChoices: _renderChoices,
        clear: _clear,
        setDataList: _setDataList,
        setIdProlerty: _setIdProlerty
    }
}