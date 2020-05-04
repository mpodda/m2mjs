var M2MJS_VALIDATOR = function () {
    var dateSeparator = "/";

    var dataTypes = {
        DATE: "date",
        NUMERIC: "numeric",
        EMAIL: "email",
        DOUBLE: "double",
        ALPHACHARACTERS: "alphacharacters",
        ALPHANUMERIC: "alphanumeric"
    };

    var logicalOperations = {
        AND: "&&",
        OR: "||",
        XOR: "^",
        NAND: "nand"

    };


    function isNumeric(val) {
        var strLength = val.length;

        for (var i = 0; i < strLength; i++) {
            ch = val.charAt(i);
            if (isNaN(ch) || ch == " ") {
                return false;
            }
        }

        if (parseInt(val, 10) == 0) {
            return false;
        }

        return true;
    }

    function isEmail(val) {
        var emailPattern = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,10}|[0-9]{1,3})(\]?)$/;
        return val.match(emailPattern);
    }

    ///////////////////
    // DateValidator // ---------------------------------------------------------------------------
    ///////////////////

    var dateValidator = function (day, month, year) {
        _day = day;
        _month = month;
        _year = year;

        var date = new Date(_year, _month - 1, _day);

        return {
            isValidDate: function () {
                if (date.getYear() + 1900 != _year) {
                    return false;
                }

                if ((date.getMonth() + 1) != _month) {
                    return false;
                }

                if (date.getDate() != _day) {
                    return false;
                }

                return true;
            }
        }
    };

    //////////////////////
    // ExternalFunction // -------------------------------------------------------------------------
    //////////////////////

    var externalFunction = function (functionCall, errorMessage) {
        var dynamicErrorMessage = null;
        var _errorMessage = "";
        var fields = new Array();

        if (arguments.length == 2) {
            _errorMessage = errorMessage;
        }

        return {
            invoke: function () {
                return functionCall();
            },
            setDynamicErrorMessage: function (msg) {
                dynamicErrorMessage = msg;
            },
            getDynamicErrorMessage: function () {
                return eval(dynamicErrorMessage);
            },
            getErrorMessage: function () {
                return _errorMessage;
            },
            setErrorMessage: function (errorMessage) {
                _errorMessage = errorMessage;
            },
            addField: function (field) {
                fields.push(field);
            },
            getFields: function () {
                return fields;
            }
        }
    }


    ////////////////
    // FieldGroup // ------------------------------------------------------------------------------
    ////////////////

    var fieldGroup = function (logicalOperation) {
        var errorMessage = "";
        var fields = new Array();
        var affectedElement = null;

        return {
            addField: function (field) {
                fiels.push(field);
            },
            getErrorMessage: function () {
                return errorMessage;
            },
            setErrorMessage: function (message) {
                errorMessage = message;
            },
            addField: function (field) {
                fields.push(field);
            },
            getFields: function () {
                return fields;
            },
            setAffectedElement: function (element) {
                affectedElement = element;
            },
            getAffectedElement: function () {
                return affectedElement;
            },
            getLogicalOperation: function () {
                return logicalOperation;
            }
        }
    }



    ///////////
    // Field // -----------------------------------------------------------------------------------
    ///////////

    var field = function (elements) {
        var id = Math.random();
        var affectElement = null;
        var currentErrorMessage;
        var dataType = "";
        var _mandatory = false;
        var valueLengthRange = null;
        var valueRange = null;
        var numberFormat = null;

        var elementsStyleClasses = new Array();

        var emptyValueForSelect = "0";
        var emptyValueForInput = "";

        var currentErrorMessage = "";
        var mandatoryViolationErrorMessage = "";
        var rangeViolationErrorMessage = "";
        var datatypeViolationErrorMessage = "";
        var numberFormatViolationErrorMessage = "";
        var notAcceptableCharactersErrorMessage = "";

        function _hasValue() {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].type.toLowerCase() == "checkbox" ||
                    elements[i].type.toLowerCase() == "radio") {
                    if (!elements[i].checked) {
                        return false;
                    }
                } else if (elements[i].type.toLowerCase() == "select-one") {
                    if (elements[i].value.length == 0 || elements[i].value == emptyValueForSelect) {
                        return false;
                    }
                } else {
                    if (elements[i].value.length == 0 || elements[i].value == emptyValueForInput) {
                        return false;
                    }
                }
            }

            return true;
        }

        function _getValue(valueIndex) {
            if (arguments.length > 0) {
                if (valueIndex > elements.length - 1) {
                    return null;
                }

                return elements[valueIndex].value;
            } else {
                var values = new Array();
                for (var i = 0; i < elements.length; i++) {
                    values[i] = elements[i].value;
                }

                return values;
            }
        }

        return {
            getDataType: function () {
                return dataType;
            },
            setDataType: function (dt) {
                dataType = dt;
            },
            setAffectElement: function (affectElementParameter) {
                affectElement = affectElementParameter;
            },
            getAffectElement: function () {
                return affectElement;
            },
            getMandatoryViolationErrorMessage: function () {
                return mandatoryViolationErrorMessage;
            },
            setMandatoryViolationErrorMessage: function (errorMessage) {
                mandatoryViolationErrorMessage = errorMessage;
            },
            getRangeViolationErrorMessage: function () {
                return rangeViolationErrorMessage;
            },
            setRangeViolationErrorMessage: function (errorMessage) {
                rangeViolationErrorMessage = errorMessage;
            },
            getCurrentErrorMessage: function () {
                return currentErrorMessage;
            },
            setCurrentErrorMessage: function (errorMessage) {
                currentErrorMessage = errorMessage;
            },
            getDatatypeViolationErrorMessage: function () {
                return datatypeViolationErrorMessage;
            },
            setDatatypeViolationErrorMessage: function (errorMessage) {
                datatypeViolationErrorMessage = errorMessage;
            },
            getNumberFormatViolationErrorMessage: function () {
                return numberFormatViolationErrorMessage;
            },
            setNumberFormatViolationErrorMessage: function (errorMessage) {
                numberFormatViolationErrorMessage = errorMessage;
            },
            getNotAcceptableCharactersErrorMessage: function () {
                return notAcceptableCharactersErrorMessage;
            },
            setNotAcceptableCharactersErrorMessage: function (errorMessage) {
                notAcceptableCharactersErrorMessage = errorMessage;
            },
            setMandatory: function (mandatory) {
                _mandatory = mandatory;
            },
            isMandatory: function () {
                return _mandatory;
            },
            hasValue: _hasValue,
            hasValueLengthRange: function () {
                if (valueLengthRange != null) {
                    return true;
                }
                return false;
            },
            getValue: _getValue,
            hasValueRange: function () {
                if (valueRange != null) {
                    return true;
                }
                return false;
            },
            getElements: function () {
                return elements;
            }
        }
    }

    ///////////////
    // Validator // -------------------------------------------------------------------------------
    ///////////////

    var validator = function (v) {
        var fields = new Array();
        var errorFields = new Array();
        var fieldGroups = new Array();
        var externalFunctions = new Array();

        var shortCircuitErrors = true;

        v.onError = function (field) { };
        v.onValidationOk = function (field) { };
        v.onFieldGroupError = function (fieldGroup) { };
        v.onFieldGroupValidationOk = function (fieldGroup) { };
        v.onExternalFunctionError = function (field, externalFunction) { };
        v.onExternalFunctionValidationOk = function (externalFunction) { };
        v.onValueRangeSet = function (field) { };

        function _addField(field) {
            fields[fields.length] = field;
        }

        function _hasErrors() {
            return errorFields.length > 0;
        }


        function _getField(fieldId) {
            for (var i = 0; i < fields.length; i++) {
                for (var j = 0; j < fields[i].elements.length; j++) {
                    if (fields[i].elements[j].id == fieldId) {
                        return fields[i];
                    }
                }
            }
            return null;
        }

        function isErrorField(field) {
            if (_hasErrors()) {
                for (var i = 0; i < errorFields.length; i++) {
                    if (errorFields[i].equals(field)) {
                        return true;
                    }
                }
            }

            return false;
        }

        function _addFieldGroup(fieldGroup) {
            fieldGroups.push(fieldGroup);
        }
        function _addExternalFunction(externalFunction) {
            externalFunctions.push(externalFunction);
        }

        function _validate() {
            errorFields.length = 0;

            //Validate Field Groups
            if (fieldGroups.length > 0) {
                for (var i = 0; i < fieldGroups.length; i++) {
                    var fieldGroup = fieldGroups[i];
                    var fieldGroupOperator = fieldGroup.getLogicalOperation();
                    var expression = "";

                    if (fieldGroupOperator == logicalOperations.OR ||
                        fieldGroupOperator == logicalOperations.AND ||
                        fieldGroupOperator == logicalOperations.NAND ||
                        fieldGroupOperator == logicalOperations.XOR) {

                        for (var j = 0; j < fieldGroup.getFields().length; j++) {
                            expression += "fieldGroup.getFields()[" + String(j) + "].hasValue()";
                            if (j < fieldGroup.getFields().length - 1) {
                                expression += " " + fieldGroupOperator + " ";
                            }
                        }
                        if (fieldGroup.getLogicalOperation().value == logicalOperations.NAND) {
                            expression = "!" + "(" + expression + ")";
                        }
                    }

                    var validated = eval(expression);

                    if (!validated) {
                        errorFields[errorFields.length] = fieldGroups[0].getFields()[0];

                        v.onFieldGroupError(fieldGroup);

                        if (shortCircuitErrors) {
                            return;
                        }
                    } else {
                        v.onFieldGroupValidationOk(fieldGroup);
                    }
                }
            }


            //Validate Fields
            for (var i = 0; i < fields.length; i++) {
                if (!fields[i].hasValue()) {
                    if (fields[i].isMandatory()) {
                        errorFields[errorFields.length] = fields[i];
                        errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getMandatoryViolationErrorMessage());
                        v.onError(fields[i]);
                        if (shortCircuitErrors) {
                            return;
                        }
                    }
                } else {//Has value
                    //Has Value Length Range
                    if (fields[i].hasValueLengthRange()) {
                        var values = fields[i].getValue();
                        if (!valueLengthInRange(values[0], fields[i].getValueLengthRange())) {
                            errorFields[errorFields.length] = fields[i];
                            errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getRangeViolationErrorMessage().replace("{0}", fields[i].getValueLengthRange().getMin()).replace("{1}", fields[i].getValueLengthRange().getMax()));
                            v.onError(fields[i]);
                            if (shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            v.onValidationOk(fields[i]);
                        }
                    } else {
                        v.onValidationOk(fields[i]);
                    }

                    if (fields[i].getDataType() != "") { //Has Datatype
                        var values = fields[i].getValue();
                        switch (fields[i].getDataType()) {

                            case dataTypes.DATE:
                                var day, month, year;

                                if (values.length == 3) {
                                    day = values[0];
                                    month = values[1];
                                    year = values[2];
                                } else {
                                    if (values[0].indexOf(dateSeparator) > -1) {
                                        var dateParts = values[0].split(dateSeparator);
                                        day = dateParts[0];
                                        month = dateParts[1];
                                        year = dateParts[2];
                                    } else {
                                        day = values[0].slice(0, 2);
                                        month = values[0].slice(2, 4);
                                        year = values[0].slice(2, 4);
                                    }
                                }

                                var dateValidator = new M2MJS_VALIDATOR().DateValidator(day, month, year);

                                if (!dateValidator.isValidDate()) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage().replace("{0}", values[0]));

                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    v.onValidationOk(fields[i]);
                                }
                                break;

                            case dataTypes.NUMERIC:
                                if (!isNumeric(values[0])) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage());
                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    if (fields[i].hasValueRange()) {
                                        v.onValueRangeSet(fields[i]);
                                        if (!valueInRange(values[0], fields[i].getValueRange())) {
                                            errorFields[errorFields.length] = fields[i];
                                            errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getRangeViolationErrorMessage().replace("{0}", fields[i].getValueRange().getMin()).replace("{1}", fields[i].getValueRange().getMax()));
                                            v.onError(fields[i]);
                                            if (shortCircuitErrors) {
                                                return;
                                            }
                                            continue;
                                        }
                                    } else {
                                        v.onValidationOk(fields[i]);
                                    }
                                }
                                break;

                            case dataTypes.DOUBLE:
                                var doubleValue = new Double(values[0], fields[i].getNumberFormat()).getDoubleValue();

                                if (!isDouble(doubleValue)) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage());
                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    if (fields[i].hasValueRange()) {
                                        if (!valueInRange(doubleValue, fields[i].getValueRange())) {

                                            var minValue = new Double(fields[i].getValueRange().getMin(), fields[i].getNumberFormat());
                                            var maxValue = new Double(fields[i].getValueRange().getMax(), fields[i].getNumberFormat());

                                            errorFields[errorFields.length] = fields[i];
                                            errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getRangeViolationErrorMessage().replace("{0}", minValue.getFormattedValue()).replace("{1}", maxValue.getFormattedValue()));
                                            v.onError(fields[i]);
                                            if (shortCircuitErrors) {
                                                return;
                                            }
                                            continue;
                                        }
                                    }

                                    if (fields[i].hasNumberFormat()) {
                                        var doubleFieldFormat = fields[i].getNumberFormat();
                                        var doubleValue = new Double(values[0], doubleFieldFormat);

                                        if (doubleFieldFormat.getNumbersAfterDecimal() < getNumbersAfterDecimal(doubleValue.getRealPart())) {
                                            errorFields[errorFields.length] = fields[i];
                                            errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getNumberFormatViolationErrorMessage());
                                            v.onError(fields[i]);
                                            if (shortCircuitErrors) {
                                                return;
                                            }
                                            continue;
                                        }
                                    }

                                    v.onValidationOk(fields[i]);
                                }
                                break;

                            case dataTypes.EMAIL:
                                if (!isEmail(values[0])) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage().replace("{0}", values[0]));
                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    v.onValidationOk(fields[i]);
                                }
                                break;

                            case dataTypes.ALPHACHARACTERS:
                                var isAlphacharacters = values[0].match(/^[A-Za-zΆ-ώ\s]*$/);
                                if (isAlphacharacters == null) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage().replace("{0}", values[0]));
                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    v.onValidationOk(fields[i]);
                                }

                                break;

                            case dataTypes.ALPHANUMERIC:
                                var isAlphaNumeric = values[0].match(/^[A-Za-zΆ-ώ0-9\s]*$/);
                                if (isAlphaNumeric == null) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage().replace("{0}", values[0]));
                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    v.onValidationOk(fields[i]);
                                }

                                break;

                            case dataTypes.ALPHANUMERICPLUSSPECIALS:
                                var isAlphaNumericPlusSpecials = values[0].match(/^[-()\/&\.A-Za-zΆ-ώ0-9\s]*$/);
                                if (isAlphaNumericPlusSpecials == null) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage().replace("{0}", values[0]));
                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    v.onValidationOk(fields[i]);
                                }

                                break;

                            case new DataTypes().ALPHACHARACTERSPLUSOTHERSPECIALS:
                                var isAlphacharacters = values[0].match(/^[-\/\.A-Za-zΆ-ώ\s]*$/);
                                if (isAlphacharacters == null) {
                                    errorFields[errorFields.length] = fields[i];
                                    errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getDatatypeViolationErrorMessage().replace("{0}", values[0]));
                                    v.onError(fields[i]);
                                    if (shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                } else {
                                    v.onValidationOk(fields[i]);
                                }

                                break;
                        }
                    } else {//Has NOT Datatype
                        v.onValidationOk(fields[i]);
                    }

                    // Check not allowed characters whatever the type
                    var value = fields[i].getValue()[0];
                    var isNotAllowed = value.match(/'|\%|<|>/g);
                    if (isNotAllowed != null) {
                        errorFields[errorFields.length] = fields[i];
                        errorFields[errorFields.length - 1].setCurrentErrorMessage(fields[i].getNotAcceptableCharactersErrorMessage());
                        v.onError(fields[i]);
                        if (shortCircuitErrors) {
                            return;
                        }
                        continue;
                    }
                }
            }

            //Check external functions
            if (externalFunctions.length > 0) {
                for (var i = 0; i < externalFunctions.length; i++) {
                    var ok = externalFunctions[i].invoke();

                    if (!ok) {
                        for (var f = 0; f < externalFunctions[i].getFields().length; f++) {
                            v.onExternalFunctionError(externalFunctions[i].getFields()[f], externalFunctions[i]);
                        }
                        if (shortCircuitErrors) {
                            return;
                        }
                    } else {
                        v.onExternalFunctionValidationOk(externalFunctions[i]);
                    }
                }
            }
        }

        return {
            addField: _addField,
            hasErrors: _hasErrors,
            getField: _getField,
            addFieldGroup: _addFieldGroup,
            addExternalFunction: _addExternalFunction,
            validate: _validate,
            setShortCircuitErrors: function (shortCircuit) {
                shortCircuitErrors = shortCircuit;
            }
        }
    }

    // ==== Public ==== ---------------------------------------------------------------------------

    return {
        Field: field,
        Validator: validator,
        ExternalFunction: externalFunction,
        FieldGroup: fieldGroup,
        DateValidator: dateValidator,
        getDataTypes: function () {
            return dataTypes;
        },
        getLogicalOperations: function () {
            return logicalOperations;
        },
        setDateSeparator: function (sep) {
            dateSeparator = sep;
        }
    }
};