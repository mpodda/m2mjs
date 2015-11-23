/////////////
// Helpers // _____________________________________________________________________________________
/////////////

function trim(str) {

    while (str.length > 0 && str.lastIndexOf(' ') == str.length - 1) {
        str = str.substr(0, str.length - 1);
    }

    while (str.length > 0 && str.indexOf(' ') == 0) {
        str = str.substr(1, str.length);
    }
    return str;
}//trim 

function roundNumber(fval, numAfteDecimal) {


    var isnegative;
    var retval;

    if (Number(fval) < 0) {
        isnegative = true;
    }
    else {
        isnegative = false;
    }

    var f = Math.abs(Number(fval));
    var numAfteDec = Number(numAfteDecimal);

    if (numAfteDec > 0) {
        f *= Number(Math.pow(10, numAfteDec));//100                    
        f = Math.round(f);
        f /= Number(Math.pow(10, numAfteDec));
        f += "";

        if (f.indexOf(".") == -1) {
            f += ".";
        }
        for (var i = 0; i < numAfteDec; i++) {
            f += "0";
        }

        retval = f.substring(0, f.indexOf(".") + numAfteDec + 1);

    }
    else {
        retval = Math.round(f);
    }

    if (isnegative) {
        retval = "-" + retval;
    }

    return (retval);

}

// ----------------------------------------------------------------------------------------------

function formatReal(val, separator, numAfterDecimal, group) {
    if (isNaN(val)) {
        return val;
    }

    if (arguments.length == 3) {
        group = false;
    }

    val = String(roundNumber(val, numAfterDecimal));

    function fillZeros(realPart) {
        var strZeros = "";

        if (Number(numAfterDecimal) > 0) {
            if (realPart == null) {
                for (var i = 0; i < numAfterDecimal; i++) {
                    strZeros = strZeros + "0";
                }
            }
            else {
                for (var i = 0; i < numAfterDecimal - realPart.length; i++) {
                    strZeros = strZeros + "0";
                }
            }
        }

        return strZeros;

    }//fillZeros

    var intPart, realPart, num, sep, groupNumber;
    groupNumber = "";

    if (separator == '.') {
        if (group) {
            groupNumber = ',';
        }//if
    }


    if (separator == ',') {
        if (group) {
            groupNumber = '.';
        }//if
    }

    sep = '.';

    num = val.split(sep);
    if (group) {
        intPart = formatInt(num[0], groupNumber);
    }//if
    else {
        intPart = num[0];
    }//else
    realPart = num[1];

    if (numAfterDecimal == 0) {
        return intPart;
    }

    if (realPart == null) {
        if (numAfterDecimal > 0) {
            return intPart + separator + fillZeros(realPart);
        }
    }
    else {
        realPart = realPart.substr(0, numAfterDecimal);
        realPart = realPart + fillZeros(realPart);
        return intPart + separator + realPart;
    }

} //formatReal

// ----------------------------------------------------------------------------------------------

function formatInt(val, separator) {

    var strFvalue = new Array();
    var pointer = 0;
    var arrIndex = 0;
    var lastIndex = 3;
    var isNegative = false;

    if (Number(val) < 0) {
        val = val.substring(1, val.length);
        isNegative = true;
    }

    for (var i = val.length; i > 0; i--) {
        if (pointer == 3) {
            strFvalue[arrIndex] = val.substring(i, i + 3);
            pointer = 0;
            lastIndex = i;
            arrIndex++;
        }
        pointer++;
    }

    strFvalue[arrIndex] = val.substring(0, lastIndex);
    val = "";
    for (var j = strFvalue.length - 1; j >= 0; j--) {
        val = val + separator + strFvalue[j];
    }//for

    val = val.substring(1, val.length);

    if (isNegative) {
        val = "-" + val;
    }

    return val;
}

///////////////
// DataTypes // ___________________________________________________________________________________
///////////////


function DataTypes() {
    this.DATE = "date";
    this.NUMERIC = "numeric";
    this.EMAIL = "email";
    this.DOUBLE = "double";
    this.ALPHACHARACTERS = "alphacharacters";
    this.ALPHANUMERIC = "alphanumeric";
    this.ALPHANUMERICPLUSSPECIALS = "alphanumericplusspecials";
    this.ALPHACHARACTERSPLUSOTHERSPECIALS = "alphanumericplusotherspecials";

    return this;
}

///////////////////
// DateValidator // _______________________________________________________________________________
///////////////////


function DateValidator(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;

    this.date = new Date(this.year, this.month - 1, this.day);

    return this;
}

//-------------------------------------------------------------------------------------------------

DateValidator.prototype.isValidDate = function () {
    if (this.date.getYear() + 1900 != this.year) {
        return false;
    }

    if ((this.date.getMonth() + 1) != this.month) {
        return false;
    }

    if (this.date.getDate() != this.day) {
        return false;
    }

    return true;
};


////////////
// Double // ______________________________________________________________________________________
////////////

function Double(value, doubleNumberFormat) {

    this.value = value;

    if (arguments.length == 2) {
        this.doubleNumberFormat = doubleNumberFormat;
    } else {
        this.doubleNumberFormat = null;
    }

    this.intPart = null;
    this.realPart = null;
    this.separator = null;

    this.calculateAttributes();

    return this;
}

// ----------------------------------------------------------------------------------------------

Double.prototype.getValue = function () {

    return this.value;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.getDoubleValue = function () {
    var s = new String(this.value);
    n = s.replace(this.separator, ".");

    return new Number(n);
};

// ----------------------------------------------------------------------------------------------

Double.prototype.getFormattedValue = function () {
    if (this.hasDoubleNumberFormat()) {
        return formatReal(this.value, this.doubleNumberFormat.getSeparator(), this.doubleNumberFormat.getNumbersAfterDecimal(), true);
    }

    return this.value;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.setValue = function (value) {
    this.value = value;
    this.calculateAttributes();
};

// ----------------------------------------------------------------------------------------------

Double.prototype.getIntPart = function () {
    var intPart = this.intPart;
    return intPart;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.getRealPart = function () {
    var realPart = this.realPart;
    return realPart;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.getSeparator = function () {
    return this.separator;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.setDoubleNumberFormat = function (doubleNumberFormat) {
    this.doubleNumberFormat = doubleNumberFormat;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.getDoubleNumberFormat = function () {
    return this.doubleNumberFormat;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.hasDoubleNumberFormat = function () {

    if (this.doubleNumberFormat != null) {
        return true;
    }

    return false;
};

// ----------------------------------------------------------------------------------------------

Double.prototype.calculateAttributes = function () {
    var s = new String(this.value);

    if (this.hasDoubleNumberFormat()) {
        if (this.doubleNumberFormat.getSeparator() == null || this.doubleNumberFormat.getSeparator() == "") {
            this.separator = ".";
        } else {
            this.separator = this.doubleNumberFormat.getSeparator();
        }
    } else {
        this.separator = ".";
    }

    s = s.replace(".", this.separator);


    if (s.charAt(0) == this.separator) {
        this.intPart = new Number(0);
        this.realPart = s.slice(1);
    } else {
        var parts = s.split(this.separator);

        if (parts.length == 1) {
            this.intPart = parts[0];
            this.realPart = new Number(0);
        } else {
            this.intPart = parts[0];
            this.realPart = parts[1];
        }
    }
};


//////////////////////
// ExternalFunction // ____________________________________________________________________________
//////////////////////

function ExternalFunction(functionCall, errorMessage) {
    this.functionCall = functionCall;

    if (arguments.length == 1) {
        this.errorMessage = "";
    } else {
        this.errorMessage = errorMessage;
    }

    this.dynamicErrorMessage = null;

    return this;
}

//-------------------------------------------------------------------------------------------------

ExternalFunction.prototype.invoke = function () {
    return eval(this.functionCall);
};

//-------------------------------------------------------------------------------------------------

ExternalFunction.prototype.setDynamicErrorMessage = function (msg) {
    this.dynamicErrorMessage = msg;
};

//-------------------------------------------------------------------------------------------------

ExternalFunction.prototype.getErrorMessage = function () {
    return this.errorMessage;
};

//-------------------------------------------------------------------------------------------------

ExternalFunction.prototype.setErrorMessage = function (errorMessage) {
    this.errorMessage = errorMessage;
};

//-------------------------------------------------------------------------------------------------

ExternalFunction.prototype.getDynamicErrorMessage = function () {
    return eval(this.dynamicErrorMessage);
};


///////////
// Field // _______________________________________________________________________________________
///////////

function Field(elements, errorMessages, affectElement) {
    this.id = Math.random();
    this.elements = elements;
    this.errorMessages = errorMessages;
    this.affectElement = affectElement;
    this.formatedInputElements = elements;

    this.combinationDestinationElement = null;

    this.currentErrorMessage;
    this.dataType = "";
    this.isMandatory = false;
    this.valueLengthRange = null;
    this.valueRange = null;
    this.numberFormat = null;

    this.elementsStyleClasses = new Array();

    this.emptyValueForSelect = "0";
    this.emptyValueForInput = "";

    this.initElementsStyleClasses();

    return this;
}

//-------------------------------------------------------------------------------------------------

Field.prototype.hasValue = function () {

    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].type.toLowerCase() == "checkbox" ||
                this.elements[i].type.toLowerCase() == "radio") {
            if (!this.elements[i].checked) {
                return false;
            }
        } else if (this.elements[i].type.toLowerCase() == "select-one") {
            if (this.elements[i].value.length == 0 || this.elements[i].value == this.emptyValueForSelect) {
                return false;
            }
        } else {
            if (this.elements[i].value.length == 0 || this.elements[i].value == this.emptyValueForInput) {
                return false;
            }
        }
    }

    return true;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getValue = function (valueIndex) {
    if (arguments.length > 0) {
        if (valueIndex > this.elements.length - 1) {
            return null;
        }

        return this.elements[valueIndex].value;
    } else {
        var values = new Array();
        for (var i = 0; i < this.elements.length; i++) {
            values[i] = this.elements[i].value;
        }

        return values;
    }
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setValue = function (valueIndex, value) {
    if (arguments.length > 0) {
        if (valueIndex > this.elements.length - 1) {
            return;
        }

        this.elements[valueIndex].value = value;
    }
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getDataType = function () {
    return this.dataType;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setDataType = function (dataType) {
    this.dataType = dataType;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getIsMandatory = function () {
    return this.isMandatory;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setMandatory = function (mandatory) {
    this.isMandatory = mandatory;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setCombinationDestinationElement = function (combinationDestinationElement) {
    this.combinationDestinationElement = combinationDestinationElement;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getCombinationDestinationElement = function () {
    return this.combinationDestinationElement;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setFormatedInputElements = function (formatedInputElements) {
    this.formatedInputElements = formatedInputElements;
    this.elementsStyleClasses = new Array();

    this.initElementsStyleClasses();
}

//-------------------------------------------------------------------------------------------------

Field.prototype.initElementsStyleClasses = function () {
    for (var i = 0; i < this.formatedInputElements.length; i++) {
        this.elementsStyleClasses[this.elementsStyleClasses.length] = this.formatedInputElements[i].className;
        //alert(this.formatedInputElements[i].id + " " + this.formatedInputElements[i].className);

    }
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setValueLengthRange = function (range) {
    this.valueLengthRange = range;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.revokeValueLengthRange = function () {
    this.valueLengthRange = null;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.hasValueLengthRange = function () {
    if (this.valueLengthRange != null) {
        return true;
    }
    return false;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getValueLengthRange = function () {
    return this.valueLengthRange;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setValueRange = function (range) {
    this.valueRange = range;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.revokeValueRange = function () {
    this.valueRange = null;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.hasValueRange = function () {
    if (this.valueRange != null) {
        return true;
    }
    return false;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getValueRange = function () {
    return this.valueRange;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getNumberFormat = function () {
    return this.numberFormat;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setNumberFormat = function (numberFormat) {
    this.numberFormat = numberFormat;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.hasNumberFormat = function () {
    if (this.numberFormat != null) {
        return true;
    }

    return false;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.equals = function (field) {
    if (field == null) {
        return false;
    }

    return field.id == this.id;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setEmptyValueForSelect = function (emptyValueForSelect) {
    this.emptyValueForSelect = emptyValueForSelect;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.setEmptyValueForInput = function (emptyValueForInput) {
    this.emptyValueForInput = emptyValueForInput;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getEmptyValueForInput = function () {
    return this.emptyValueForInput;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getEmptyValueForSelect = function () {
    return this.emptyValueForSelect;
};

//-------------------------------------------------------------------------------------------------

Field.prototype.hasEmptyValueForInput = function () {
    return this.emptyValueForInput != "";
};

//-------------------------------------------------------------------------------------------------

Field.prototype.getElement = function (elementIndex) {
    if (elementIndex > this.elements.length - 1) {
        return null;
    }

    return this.elements[elementIndex];
};


//////////////////////
// LogicalOperation // ____________________________________________________________________________
//////////////////////


function LogicalOperation(value) {
    this.value = value;

    this.AND = "and";
    this.OR = "or";
    this.XOR = "xor";
    this.NAND = "nand";

    return this;
}

//-------------------------------------------------------------------------------------------------

LogicalOperation.prototype.getOperator = function () {
    switch (this.value) {
        case this.AND: return "&&"; break;
        case this.OR: return "||"; break;
        case this.XOR: return "^"; break;
        case this.NAND: return "&&"; break;
        default: return ""; break;
    }
};

////////////////
// FieldGroup // _______________________________________________________________________________________
////////////////


function FieldGroup(logicalOperation, errorMessage) {
    this.logicalOperation = logicalOperation;
    this.errorMessage = errorMessage;
    this.fields = new Array();

    return this;
}

//-------------------------------------------------------------------------------------------------

FieldGroup.prototype.addField = function (field) {
    this.fields[this.fields.length] = field;
};

//-------------------------------------------------------------------------------------------------

FieldGroup.prototype.getFields = function () {
    return this.fields;
};

//-------------------------------------------------------------------------------------------------

FieldGroup.prototype.getLogicalOperation = function () {
    return this.logicalOperation;
};

//-------------------------------------------------------------------------------------------------

FieldGroup.prototype.getErrorMessage = function () {
    return this.errorMessage;
};


///////////
// Range // _______________________________________________________________________________________
///////////

function Range(min, max) {
    this.min = min;
    this.max = max;

    return this;
}

//-------------------------------------------------------------------------------------------------

Range.prototype.getMin = function () {
    return this.min;
};

//-------------------------------------------------------------------------------------------------

Range.prototype.getMax = function () {
    return this.max;
};

//-------------------------------------------------------------------------------------------------

Range.prototype.hasMin = function () {
    return this.min > 0;
};

//-------------------------------------------------------------------------------------------------

Range.prototype.hasMax = function () {
    return this.max > 0;
};


///////////////
// Validator // ___________________________________________________________________________________
///////////////

var MANDATORY_VIOLATION_ERROR_MESSAGE = 0;
var DATATYPE_VIOLATION_ERROR_MESSAGE = 1;
var RANGE_VIOLATION_ERROR_MESSAGE = 2;
var NUMBER_FORMAT_VIOLATION_ERROR_MESSAGE = 3;

//-------------------------------------------------------------------------------------------------

function Validator(name) {
    this.fields = new Array();
    this.errorFields = new Array();
    this.fieldGroups = new Array();
    this.externalFunctions = new Array();

    this.onError = function (field) { };
    this.onValidationOk = function (field) { };
    this.onFieldGroupError = function (fieldGroup) { };
    this.onFieldGroupValidationOk = function (fieldGroup) { };
    this.onExternalFunctionError = function (externalFunction) { };
    this.onExternalFunctionValidationOk = function (externalFunction) { };
    this.onValueRangeSet = function (field) { };

    if (arguments.length == 1) {
        this.name = name;
    } else {
        this.name = "";
    }

    this.shortCircuitErrors = true;
    
    return this;
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.addField = function (field) {
    this.fields[this.fields.length] = field;
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.validate = function () {
    this.errorFields.length = 0;

    //Validate Field Groups
    if (this.fieldGroups.length > 0) {
        for (var i = 0; i < this.fieldGroups.length; i++) {
            var fieldGroup = this.fieldGroups[i];
            var fieldGroupOperator = fieldGroup.getLogicalOperation().getOperator();
            var expression = "";

            if (fieldGroup.getLogicalOperation().value == new LogicalOperation().OR ||
					fieldGroup.getLogicalOperation().value == new LogicalOperation().AND ||
					fieldGroup.getLogicalOperation().value == new LogicalOperation().NAND ||
					fieldGroup.getLogicalOperation().value == new LogicalOperation().XOR) {
                for (var j = 0; j < fieldGroup.getFields().length; j++) {
                    expression += "fieldGroup.getFields()[" + String(j) + "].hasValue()";
                    if (j < fieldGroup.getFields().length - 1) {
                        expression += " " + fieldGroupOperator + " ";
                    }
                }
                if (fieldGroup.getLogicalOperation().value == new LogicalOperation().NAND) {
                    expression = "!" + "(" + expression + ")";
                }
            }

            var validated = eval(expression);

            if (!validated) {
                this.errorFields[this.errorFields.length] = this.fieldGroups[0].getFields()[0];
                this.onFieldGroupError(fieldGroup);
                if (this.shortCircuitErrors) {
                    return;
                }
            } else {
                this.onFieldGroupValidationOk(fieldGroup);
            }
        }
    }


    //Validate Fields
    for (var i = 0; i < this.fields.length; i++) {
        if (!this.fields[i].hasValue()) {
            if (this.fields[i].getIsMandatory()) {
                this.errorFields[this.errorFields.length] = this.fields[i];
                this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[MANDATORY_VIOLATION_ERROR_MESSAGE];
                this.onError(this.fields[i]);
                if (this.shortCircuitErrors) {
                    return;
                }
            }
        } else {//Has value
            //Has Value Length Range
            if (this.fields[i].hasValueLengthRange()) {
                var values = this.fields[i].getValue();
                if (!valueLengthInRange(values[0], this.fields[i].getValueLengthRange())) {
                    this.errorFields[this.errorFields.length] = this.fields[i];
                    this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[RANGE_VIOLATION_ERROR_MESSAGE].replace("{0}", this.fields[i].getValueLengthRange().getMin()).replace("{1}", this.fields[i].getValueLengthRange().getMax());
                    this.onError(this.fields[i]);
                    if (this.shortCircuitErrors) {
                        return;
                    }
                    continue;
                } else {
                    this.onValidationOk(this.fields[i]);
                }
            } else {
                this.onValidationOk(this.fields[i]);
            }

            if (this.fields[i].dataType != "") { //Has Datatype
                var values = this.fields[i].getValue();
                switch (this.fields[i].dataType) {
                    case new DataTypes().DATE:
                        var day, month, year;

                        if (values.length == 3) {
                            day = values[0];
                            month = values[1];
                            year = values[2];
                        } else {
                            if (values[0].indexOf("/") > -1) {
                                var dateParts = values[0].split("/");
                                day = dateParts[0];
                                month = dateParts[1];
                                year = dateParts[2];
                            } else {
                                day = values[0].slice(0, 2);
                                month = values[0].slice(2, 4);
                                year = values[0].slice(2, 4);
                            }
                        }

                        var dateValidator = new DateValidator(day, month, year);

                        if (!dateValidator.isValidDate()) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE].replace("{0}", values[0]);
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            this.onValidationOk(this.fields[i]);
                        }
                        break;

                    case new DataTypes().NUMERIC:
                        if (!isNumeric(values[0])) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE];
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            if (this.fields[i].hasValueRange()) {
                                this.onValueRangeSet(this.fields[i]);
                                if (!valueInRange(values[0], this.fields[i].getValueRange())) {
                                    this.errorFields[this.errorFields.length] = this.fields[i];
                                    this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[RANGE_VIOLATION_ERROR_MESSAGE].replace("{0}", this.fields[i].getValueRange().getMin()).replace("{1}", this.fields[i].getValueRange().getMax());
                                    this.onError(this.fields[i]);
                                    if (this.shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                }
                            } else {
                                this.onValidationOk(this.fields[i]);
                            }
                        }
                        break;

                    case new DataTypes().DOUBLE:
                        var doubleValue = new Double(values[0], this.fields[i].getNumberFormat()).getDoubleValue();

                        if (!isDouble(doubleValue)) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE];
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            if (this.fields[i].hasValueRange()) {
                                if (!valueInRange(doubleValue, this.fields[i].getValueRange())) {

                                    var minValue = new Double(this.fields[i].getValueRange().getMin(), this.fields[i].getNumberFormat());
                                    var maxValue = new Double(this.fields[i].getValueRange().getMax(), this.fields[i].getNumberFormat());

                                    this.errorFields[this.errorFields.length] = this.fields[i];
                                    this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[RANGE_VALUE_VIOLATION_ERROR_MESSAGE].replace("{0}", minValue.getFormattedValue()).replace("{1}", maxValue.getFormattedValue());
                                    this.onError(this.fields[i]);
                                    if (this.shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                }
                            }

                            if (this.fields[i].hasNumberFormat()) {
                                var doubleFieldFormat = this.fields[i].getNumberFormat();
                                var doubleValue = new Double(values[0], doubleFieldFormat);

                                if (doubleFieldFormat.getNumbersAfterDecimal() < getNumbersAfterDecimal(doubleValue.getRealPart())) {
                                    this.errorFields[this.errorFields.length] = this.fields[i];
                                    this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[NUMBER_FORMAT_VIOLATION_ERROR_MESSAGE];
                                    this.onError(this.fields[i]);
                                    if (this.shortCircuitErrors) {
                                        return;
                                    }
                                    continue;
                                }
                            }

                            this.onValidationOk(this.fields[i]);
                        }
                        break;

                    case new DataTypes().EMAIL:
                        if (!isEmail(values[0])) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE].replace("{0}", values[0]);
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            this.onValidationOk(this.fields[i]);
                        }
                        break;

                    case new DataTypes().ALPHACHARACTERS:
                        var isAlphacharacters = values[0].match(/^[A-Za-zΆ-ώ\s]*$/);
                        if (isAlphacharacters == null) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE].replace("{0}", values[0]);
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            this.onValidationOk(this.fields[i]);
                        }

                        break;

                    case new DataTypes().ALPHANUMERIC:
                        var isAlphaNumeric = values[0].match(/^[A-Za-zΆ-ώ0-9\s]*$/);
                        if (isAlphaNumeric == null) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE].replace("{0}", values[0]);
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            this.onValidationOk(this.fields[i]);
                        }

                        break;

                    case new DataTypes().ALPHANUMERICPLUSSPECIALS:
                        var isAlphaNumericPlusSpecials = values[0].match(/^[-()\/&\.A-Za-zΆ-ώ0-9\s]*$/);
                        if (isAlphaNumericPlusSpecials == null) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE].replace("{0}", values[0]);
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            this.onValidationOk(this.fields[i]);
                        }

                        break;

                    case new DataTypes().ALPHACHARACTERSPLUSOTHERSPECIALS:
                        var isAlphacharacters = values[0].match(/^[-\/\.A-Za-zΆ-ώ\s]*$/);
                        if (isAlphacharacters == null) {
                            this.errorFields[this.errorFields.length] = this.fields[i];
                            this.errorFields[this.errorFields.length - 1].currentErrorMessage = this.fields[i].errorMessages[DATATYPE_VIOLATION_ERROR_MESSAGE].replace("{0}", values[0]);
                            this.onError(this.fields[i]);
                            if (this.shortCircuitErrors) {
                                return;
                            }
                            continue;
                        } else {
                            this.onValidationOk(this.fields[i]);
                        }

                        break;
                }
            } else {//Has NOT Datatype
                this.onValidationOk(this.fields[i]);
            }

            // Check not allowed characters whatever the type
            var value = this.fields[i].getValue()[0];
            var isNotAllowed = value.match(/'|\%|<|>/g);
            if (isNotAllowed != null) {
                this.errorFields[this.errorFields.length] = this.fields[i];
                this.errorFields[this.errorFields.length - 1].currentErrorMessage = "Μη αποδεκτοί χαρακτήρες στην τιμή του πεδίου.";
                this.onError(this.fields[i]);
                if (this.shortCircuitErrors) {
                    return;
                }
                continue;
            }
        }
    }

    //Check external functions
    if (this.externalFunctions.length > 0) {
        for (var i = 0; i < this.externalFunctions.length; i++) {
            var ok = this.externalFunctions[i].invoke();

            if (!ok) {
                this.errorFields[this.errorFields.length] = this.fields[0];
                this.onExternalFunctionError(this.externalFunctions[i]);
                if (this.shortCircuitErrors) {
                    return;
                }
            } else {
                this.onExternalFunctionValidationOk(this.externalFunctions[i]);
            }
        }
    }
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.hasErrors = function () {
    return this.errorFields.length > 0;
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.getField = function (fieldId) {
    for (var i = 0; i < this.fields.length; i++) {
        for (var j = 0; j < this.fields[i].elements.length; j++) {
            if (this.fields[i].elements[j].id == fieldId) {
                return this.fields[i];
            }
        }
    }
    return null;
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.getFieldByCombinationDestinationElement = function (combinationDestinationElementId) {
    for (var i = 0; i < this.fields.length; i++) {
        if (this.fields[i].getCombinationDestinationElement() != null) {
            if (this.fields[i].getCombinationDestinationElement().id == combinationDestinationElementId) {
                return this.fields[i];
            }
        }
    }

    return null;
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.isErrorField = function (field) {
    if (this.hasErrors()) {
        for (var i = 0; i < this.errorFields.length; i++) {
            if (this.errorFields[i].equals(field)) {
                return true;
            }
        }
    }

    return false;
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.getName = function () {
    return this.name;
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.addFieldGroup = function (fieldGroup) {
    this.fieldGroups.push(fieldGroup);
};

//-------------------------------------------------------------------------------------------------

Validator.prototype.addExternalFunction = function (externalFunction) {
    this.externalFunctions.push(externalFunction);
};

//-------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------

function isDouble(val) {
    return !isNaN(val);
}

//-------------------------------------------------------------------------------------------------

function isEmail(val) {
    var emailPattern = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,10}|[0-9]{1,3})(\]?)$/;
    return val.match(emailPattern);
}//isEmail

//-------------------------------------------------------------------------------------------------

function valueLengthInRange(value, range) {
    var inRange = true;
    var inMinRange = true;
    var inMaxRange = true;

    if (range.hasMin()) {
        inMinRange = (value.length >= range.getMin());
    }

    if (range.hasMax()) {
        inMaxRange = (value.length <= range.getMax());
    }

    inRange = inMinRange && inMaxRange;

    return inRange;
}

//-------------------------------------------------------------------------------------------------

function valueInRange(value, range) {
    var inRange = true;
    if (range.hasMin()) {
        inRange = (new Number(value) >= new Number(range.getMin()));
        if (!inRange) {
            return false;
        }
    }

    if (range.hasMax()) {
        inRange = (new Number(value) <= new Number(range.getMax()));
    }

    return inRange;
}

//-------------------------------------------------------------------------------------------------

function getNumbersAfterDecimal(value) {
    var s = new String(value);

    return s.length;
}