/**
 * New approach with ES 6, ES 7
 *
 */

/** 
 * Version 3.3.1
 */

/**
 * 05/08/2019: Validator
 * 07/08/2019: Debbug validator
 * 07/08/2019: add "getComponent" at Form
 * 09/08/2019: Component:  get value set value debug
 * 16/08/2019: Add set/get template (Grid)
 * 19/08/2019: Remove inner classes
 * 20/08/2019: Fix static properties (cross browser support)
 * 22/08/2019: Execute Rederer's code if element exists
 * 26/08/2019: Persist Index to GridRow
 * 28/08/2019: Fix 'setObjectValue' if value is type of Boolean
 * 05/09/2019: XBrowser: Get Element by ClassName
 * 05/09/2019: Connection: Add sync call
 * 21/11/2019: Connection: add static PUT, DELETE methods
 * 02/04/2020: Correct syntax errors
 * 02/04/2020: Implement new XBrowser functionality
 * 07/04/2020: Improve grid Rendering
 * 11/04/2020: DateWithArithmetic
 * 12/04/2020: Improve 'setObjectValue'. Handle simple path (no dots) separately
 */

// ------------------------------------------------------------------------------------

//"use strict";

(function () {
  'use strict';
}());

/**
 * Private methods declarations
 */

const _traverseFields = Symbol("traverseFields");
const _isEmail = Symbol("isEmail");
const _traverseExternalValidationFunctions = Symbol(
  "traverseExternalValidationFunctions"
);

// ------------------------------------------------------------------------------------

function resolveObjectValue(path, object) {
  //	console.info("resolveObjectValue");

  return path.split(".").reduce(function (prev, curr) {
    if (prev) {
      return prev[curr];
    }

    return null;
  }, object || self);
}

// 3.3 Implementation
function setObjectValue(path, object, value) {
  let myObject = object;

  // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)

  //Simple path: No dots (3.3.1)
  if (path.indexOf('.') === -1) {
    object[path] = value;
    return;
  }

  path.split(".").reduce((previous, current) => {
    if (myObject[current] === null) {
      myObject[current] = value;
    } else {
      myObject = myObject[current];
    }
  }, object || value);
}

/*
    ------------------------
    -- DateWithArithmetic -- 
    ------------------------
   */

class DateWithArithmetic extends Date {
  constructor(d, format = "") {
    super(d);
    this._format = format;
  }


  getDaysOfMonth() {
    switch (Number(this.getMonth() + 1)) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      case 2:
        if ((this.getYear() % 4 == 0) || (this.getYear() % 1000 == 0)) {
          return 29;
        }
        return 28;
    }
  }

  addDay(d) {
    let newDay = this.getDate() + d;
    while (newDay > this.getDaysOfMonth()) {
      newDay = newDay - this.getDaysOfMonth();
      this.setMonth(this.getMonth() + 1);
    }

    this.setDate(newDay);
  }

  addMonth(m) {
    this.setMonth(this.getMonth() + m);
  }

  bla() {
    console.info("Bla");
    return "BLA";
  }

  toDate() {
    let date = new Date();
    date.setFullYear(this.getFullYear());
    date.setMonth(this.getMonth());
    date.setDate(this.getDate());

    //date.setFullYear(this.getYear(), this.getMonth(), this.getDate());
    date.setHours(this.getHours());
    date.setMinutes(this.getMinutes());
    date.setSeconds(this.getSeconds());

    return date;
  }

  toString(format) {
    this._format = format;

    //TODO: Improve later
    const datePosition = format.indexOf("dd");
    const separator = format.substring(datePosition + 2, datePosition + 3);

    //let dateString = `${this.getDate()}${separator}${this.getMonth()+1}${separator}${this.getFullYear()}`;
    let dateString = "";

    if (this.getDate() > 9) {
      dateString = `${this.getDate()}`;
    } else {
      dateString = `0${this.getDate()}`;
    }

    if (this.getMonth() + 1 > 9) {
      dateString = `${dateString}${separator}${this.getMonth()+1}`;
    } else {
      dateString = `${dateString}${separator}0${this.getMonth()+1}`;
    }

    dateString = `${dateString}${separator}${this.getFullYear()}`;

    if (this.showTime()) {
      dateString = `${dateString} ${this.timeString()}`;
    }

    // console.info("showTime=", this.showTime(), "format=", format, "dateString=", dateString, "full year=", this.getFullYear());

    return dateString;
  }

  timeString() {
    let timeString = "";

    // console.info(this._format);

    const hoursPosition = this._format.toUpperCase().indexOf("HH");

    if (hoursPosition > -1) {
      const timeSeparator = this._format.substring(hoursPosition + 2, hoursPosition + 3);

      if (this.getHours() < 10) {
        timeString = `$0{this.getHours()}`;
      } else {
        timeString = `${this.getHours()}`;
      }

      if (this.getMinutes() < 10) {
        timeString = `${timeString}${timeSeparator}0${this.getMinutes()}`;
      } else {
        timeString = `${timeString}${timeSeparator}${this.getMinutes()}`;
      }

      const secPosition = this.format.toUpperCase().indexOf("ss");
      if (secPosition > -1) {
        if (this.getSeconds() < 10) {
          timeString = `${timeString}${timeSeparator}0${this.getSeconds()}`;
        } else {
          timeString = `${timeString}${timeSeparator}${this.getSeconds()}`;
        }
      }
    }

    return timeString;
  }

  clone() {
    let clonedDate = new DateWithArithmetic(this.toDate());
    //clonedDate.toDate().setFullYear(2020, 4, 15);

    clonedDate.format = this._format;

    console.info("fy=", this.toDate().getFullYear(), "date=", this.toDate(), "clonedDate=", clonedDate.toDate());

    return clonedDate;
  }

  showTime() {
    return this._format.toUpperCase().indexOf("HH") > -1;
  }

  static parseFromString(dateString, format) {
    const datePosition = format.indexOf("dd");
    const separator = format.substring(datePosition + 2, datePosition + 3);

    let dateFormatParts = format.split(separator);
    dateFormatParts[2] = dateFormatParts[2].substring(0, 4);
    let dateParts = dateString.split(separator);

    let date, month, year;
    for (let i = 0; i < dateFormatParts.length; i++) {
      if (dateFormatParts[i] === "dd") {
        date = Number(dateParts[i]);
        if (Number.isNaN(date)) {
          throw `'${dateParts[i]}' : Is not a number`;
        }
      }

      if (dateFormatParts[i] === "MM") {
        month = Number(dateParts[i]);
        if (Number.isNaN(month)) {
          throw `'${dateParts[i]}' : Is not a number`;
        }
      }

      if (dateFormatParts[i] === "yyyy") {
        year = Number(dateParts[i].substring(0, 4));
        // console.info("year=", dateParts[i].substring(0, 4));

        if (Number.isNaN(year)) {
          throw `'${dateParts[i]}' : Is not a number`;
        }
      }
    }

    //console.info("dateParts=", dateParts, "year date part=", dateParts[2].substring(0, 4));
    //console.info("dateFormatParts=", dateFormatParts);
    // console.info("date=", date, "month=", month, "year=", year);

    //Time

    let thisDate = new DateWithArithmetic();
    thisDate.format = format;


    thisDate.setFullYear( /*1900 +*/ year, month - 1, date);

    const showTime = (format.toUpperCase().indexOf("HH") > -1);
    // console.info("showTime=", showTime);

    if (showTime) {
      const timePosition = format.toUpperCase().indexOf("HH");
      const timeFormat = format.substring(timePosition, format.length);
      const timeSeparator = format.substring(timePosition + 2, timePosition + 3);

      let timeFormatParts = timeFormat.split(timeSeparator);
      let timeParts = dateString.split(timeSeparator);

      //console.info("format=", format.substring(timePosition, format.length));
      //console.info("timeFormat=", timeFormat);
      //console.info("timeSeparator=", timeSeparator, "timePosition=", timePosition, "Q=", format.substring(timePosition + 2, 1));
      // console.info("timeFormatParts=", timeFormatParts);
      // console.info("timeParts=", timeParts, "part 1=", timeParts[0].substring(timePosition, timeParts[0].length));

      let hours = 0,
        minutes = 0,
        seconds = 0;

      for (let i = 0; i < timeFormatParts.length; i++) {

        if (timeFormatParts[i].toUpperCase() === "HH") {
          hours = Number(timeParts[i].substring(timePosition, timeParts[0].length));
          if (Number.isNaN(hours)) {
            throw `'${timeParts[i]}' : Is not a number`;
          }
        }

        if (timeFormatParts[i].toUpperCase() === "mm") {
          minutes = Number(timeParts[i]);
          if (Number.isNaN(minutes)) {
            throw `'${timeParts[i]}' : Is not a number`;
          }
        }

        if (timeFormatParts[i].toUpperCase() === "ss") {
          seconds = Number(timeParts[i]);
          if (Number.isNaN(seconds)) {
            throw `'${timeParts[i]}' : Is not a number`;
          }
        }
      }

      //console.info("hours=", hours, "minutes=", minutes, "seconds=", seconds);

      thisDate.setHours(hours);
      thisDate.setMinutes(minutes);
      thisDate.setSeconds(seconds);
    }

    // console.info("thisDate=", thisDate.toDate());

    return thisDate;
  }

  equals(date, compaireTime = false) {
    if (this.getDate() === date.getDate() && this.getMonth() === date.getMonth() && this.getFullYear() === date.getFullYear()) {
      if (!compaireTime) {
        return true;
      }

      if (this.getHours() === date.getHours() && this.getMinutes() === date.getMinutes() && this.getSeconds() === date.getSeconds()) {
        return true;
      }
    }

    return false;
  }

  set format(value) {
    this._format = value;
  }

  get format() {
    return this._format;
  }
}

/*
    ----------------
    -- Connection -- 
    ----------------
   */
class Connection {
  constructor(url, method, requestData, isJson) {
    this.url = url;
    this.requestData = requestData;
    this.httpMethod = method;
    this.isJson = isJson;
  }

  static get(url, isJson = true, isSync = false) {
    if (isSync) {
      return new Connection(
        url,
        Connection.Methods.GET,
        null,
        isJson
      ).connectSync();
    }

    return new Connection(url, Connection.Methods.GET, null, isJson).connect();
  }

  static post(url, requestData, isJson = true, isSync = false) {
    if (isSync) {
      return new Connection(
        url,
        Connection.Methods.POST,
        requestData,
        isJson
      ).connectSync();
    }

    return new Connection(
      url,
      Connection.Methods.POST,
      requestData,
      isJson
    ).connect();
  }

  static put(url, requestData, isJson = true, isSync = false) {
    if (isSync) {
      return new Connection(
        url,
        Connection.Methods.PUT,
        requestData,
        isJson
      ).connectSync();
    }

    return new Connection(
      url,
      Connection.Methods.PUT,
      requestData,
      isJson
    ).connect();
  }

  static delete(url, requestData, isJson = true, isSync = false) {
    if (isSync) {
      return new Connection(
        url,
        Connection.Methods.DELETE,
        requestData,
        isJson
      ).connectSync();
    }

    return new Connection(
      url,
      Connection.Methods.DELETE,
      requestData,
      isJson
    ).connect();
  }

  set isJsonCall(isJson) {
    this.isJson = isJson;
  }

  get isJsonCall() {
    return this.isJson;
  }

  connectSync() {
    let httpRequest = null;

    let response = {
      status: 0,
      data: ""
    };

    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      httpRequest = new ActiveXObject("MSXML2.XMLHTTP");
    } else {
      //TODO: Raise exception
    }

    httpRequest.open(this.httpMethod, this.url, false);

    if (this.isJsonCall) {
      httpRequest.setRequestHeader(
        "Accept",
        "application/json, text/javascript, */*"
      );
      httpRequest.setRequestHeader(
        "content-type",
        "application/json; charset=UTF-8"
      );

      this.requestData = JSON.stringify(this.requestData);
    }

    httpRequest.send(this.requestData);

    response.status = httpRequest.status;

    if (this.isJsonCall) {
      response.data = JSON.parse(httpRequest.responseText);
    } else {
      response.data = httpRequest.responseText;
    }

    return response;
  }

  connect() {
    let cn = this;

    return new Promise(function (resolve, reject) {
      let httpRequest = null;

      let response = {
        status: 0,
        data: ""
      };

      if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject("MSXML2.XMLHTTP");
      } else {
        //TODO: Raise exception
      }

      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState != 4) {
          return;
        }

        response.status = httpRequest.status;

        if (httpRequest.status != 200) {
          response.data = httpRequest.responseText;
          reject(response);
        } else {
          if (cn.isJsonCall) {
            if (
              httpRequest.responseText === null ||
              httpRequest.responseText === ""
            ) {
              if (httpRequest.responseText === null) {
                response.data = null;
              } else {
                response.data = "";
              }
            } else {
              response.data = JSON.parse(httpRequest.responseText);
            }
          } else {
            response.data = httpRequest.responseText;
          }

          resolve(response);
        }
      };

      httpRequest.open(cn.httpMethod, cn.url, true);

      if (cn.isJsonCall) {
        httpRequest.setRequestHeader(
          "Accept",
          "application/json, text/javascript, */*"
        );
        httpRequest.setRequestHeader(
          "content-type",
          "application/json; charset=UTF-8"
        );

        cn.requestData = JSON.stringify(cn.requestData);
      }

      httpRequest.send(cn.requestData);
    });
  }
}

Connection.Methods = Object.freeze({
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
});

/*
    ---------------------
    -- Template Loader -- 
    ---------------------
   */

class TemplateLoader {
  static loadTemplate(templateUrl, templateId) {
    return new Promise(function (resolve, reject) {
      Connection.get(templateUrl, false).then(response => {
        let fragment = document.createDocumentFragment();
        let templateText = document.createElement("body");

        try {
          templateText.innerHTML = response.data;
        } catch (e) {
          console.info("e=", e);
        }

        fragment.appendChild(templateText);

        resolve(XBrowser.getElement(fragment.childNodes[0], templateId));
      });
    });
  }

  static loadTemplateFromCurrentPage(templateId /*, useTemplateTag = false*/ ) {
    return new Promise(function (resolve, reject) {
      let useTemplateTag = false;

      let template = document.querySelector(`#${templateId}`);

      if (template != null) {
        useTemplateTag = template.tagName.toUpperCase() === 'TEMPLATE';
      } else {
        reject(`${templateId} : Invalid template id`);
      }

      if (useTemplateTag) {
        resolve(document.importNode(template.content, true).childNodes[1]);
      }

      let fragment = document.createDocumentFragment();
      let templateText = document.createElement("body");
      templateText.innerHTML = document.getElementById(templateId).outerHTML;
      fragment.appendChild(templateText);

      resolve(XBrowser.getElement(fragment.childNodes[0], templateId));
    });
  }
}

/*
 --------------
 -- XBrowser -- 
 --------------
*/

class XBrowser {
  static getElement(parentElement, elementId) {
    let returnElement = null;

    for (let i = 0; i < parentElement.childNodes.length; i++) {
      if (parentElement.childNodes[i].id === elementId) {
        returnElement = parentElement.childNodes[i];
        break;
      }

      if (
        returnElement === null &&
        parentElement.childNodes[i].childNodes.length > 0
      ) {
        const element = XBrowser.getElement(
          parentElement.childNodes[i],
          elementId
        );
        if (element != null) {
          return element;
        }
      }
    }

    return returnElement;
  }

  static getElementByClassName(parentElement, className) {
    let returnElement = null;

    for (let i = 0; i < parentElement.childNodes.length; i++) {
      if (parentElement.childNodes[i].className === className) {
        returnElement = parentElement.childNodes[i];
        break;
      }

      if (
        returnElement == null &&
        parentElement.childNodes[i].childNodes.length > 0
      ) {
        const element = XBrowser.getElementByClassName(
          parentElement.childNodes[i],
          className
        );
        if (element != null) {
          return element;
        }
      }
    }

    return returnElement;
  }

  static addHandler(target, eventName, handlerName) {
    if (target.addEventListener) {
      target.addEventListener(eventName, handlerName, false);
      return;
    }

    if (target.attachEvent) {
      target.attachEvent("on" + eventName, handlerName);
      return;
    }

    target["on" + eventName] = handlerName;
  }

  static offsetTop(relativeElement) {
    if (window.event) {
      return relativeElement.offsetTop - event.clientY;
    }

    return window.pageYOffset;
  }

  static offsetLeft(relativeElement) {
    if (window.event) {
      return relativeElement.offsetLeft;
    }

    return window.pageXOffset;
  }

  static eventClientX(e) {
    if (window.event) {
      return event.clientX;
    }

    return e.pageX;
  }

  static eventClientY(e) {
    if (window.event) {
      return event.clientY;
    }

    return e.pageY;
  }

  static stopEventPropagation(e) {
    if (window.event) {
      e.cancelBubble = true;
    } else {
      e.stopPropagation();
    }
  }
}

/*
    ---------------
    -- Component -- 
    ---------------
   */

class Component {
  constructor(componentId, element) {
    this.componentId = componentId;
    this.element = element;
    this.type = "";
  }

  get id() {
    return this.componentId;
  }

  set id(componentId) {
    this.componentId = componentId;
  }

  setValue(value) {
    this.type = typeof value;

    if (this.element === null) {
      return;
    }

    if (this.element.type && this.element.type.toLowerCase() == "checkbox") {
      this.element.checked = value;
    } else {
      if (
        this.element.tagName.toLowerCase() == "input" ||
        this.element.tagName.toLowerCase() == "textarea" ||
        this.element.tagName.toLowerCase() == "select"
      ) {
        this.element.value = value;
      } else {
        this.element.innerHTML = value;
      }
    }
  }

  getValue() {
    if (this.element === null) {
      return null;
    }

    if (this.element.type && this.element.type.toLowerCase() == "checkbox") {
      return this.element.checked;
    }

    if (this.type.toLowerCase() == "number") {
      return Number(this.element.value);
    }

    return this.element.value;
  }
}

/*
 ----------
 -- Form -- 
 ----------
*/

class Form {
  constructor(modelObject = null) {
    this._modelObject = modelObject;
    this.components = [];
  }

  addComponent(component) {
    this.components.push(component);
  }

  getComponent(componentId) {
    for (let component of this.components) {
      if (component.id === componentId) {
        return component;
      }
    }

    return null;
  }

  set modelObject(mo) {
    this._modelObject = mo;

    this.components.forEach((component, index) => {
      component.setValue(resolveObjectValue(component.id, this._modelObject));
    });
  }

  get modelObject() {
    this.components.forEach((component, index) => {
      setObjectValue(component.id, this._modelObject, component.getValue());

      //console.info("component: ", component.componentId, /*" _modelObject=", this._modelObject*/ "value=", component.getValue());
    });

    return this._modelObject;
  }
}

/*
 -----------
 -- Field --
 -----------
*/
class M2MJS_Field {
  constructor(elements = null) {
    this._affectElement = null;
    this._currentErrorMessage = null;
    this._mandatoryViolationErrorMessage = null;
    this._datatypeViolationErrorMessage = null;

    this._elements = elements;
    this._component = null;

    this._emptyValueForSelect = "0";
    this._emptyValueForInput = "";

    this._isMandatory = true;
    this._dataType = null;

    this._isValid = true;
  }

  async hasValue() {
    return new Promise((resolve, reject) => {
      if (this._elements != null) {
        /* At least one element is checked */
        let isValidCheckboxOrRadio = false;

        this._elements.forEach((element, index) => {
          if (
            element.type.toLowerCase() == "checkbox" ||
            element.type.toLowerCase() == "radio"
          ) {
            if (!isValidCheckboxOrRadio) {
              isValidCheckboxOrRadio = element.checked;
            }

            /* Reach the end */
            if (index == this._elements.length - 1) {
              resolve(isValidCheckboxOrRadio);
            }
          } else if (element.type.toLowerCase() == "select-one") {
            if (
              element.value.length == 0 ||
              element.value == this._emptyValueForSelect
            ) {
              resolve(false);
            }
          } else {
            if (
              element.value.length == 0 ||
              element.value == this._emptyValueForInput
            ) {
              resolve(false);
            }
          }

          /* Not of above and not a check box or a radio button */
          if (
            element.type.toLowerCase() != "checkbox" &&
            element.type.toLowerCase() != "radio"
          ) {
            resolve(true);
          }
        });
      } else if (this._component != null) {
        resolve(
          this._component.getValue() != null ||
          (this._component.getValue() != null &&
            this._component.getValue().trim() != "")
        );
      } else {
        resolve(false);
      }
    });
  }

  getValue(index = 1) {
    if (index > 0) {
      if (index == 1) {
        return this._elements[0].value;
      }

      return this._elements[index - 1].value;
    }

    let values = [];

    this._elements.forEach((element, index) => {
      values.push(element.value);
    });

    return values;
  }

  addElement(element) {
    if (this._elements == null) {
      this._elements = [];
    }

    this._elements.push(element);
  }

  hasDataType() {
    return this._dataType != null;
  }

  set affectElement(affectElement) {
    this._affectElement = affectElement;
  }

  get affectElement() {
    return this._affectElement;
  }

  set currentErrorMessage(errorMessage) {
    this._currentErrorMessage = errorMessage;
  }

  get currentErrorMessage() {
    return this._currentErrorMessage;
  }

  set mandatoryViolationErrorMessage(errorMessage) {
    this._mandatoryViolationErrorMessage = errorMessage;
  }

  get mandatoryViolationErrorMessage() {
    return this._mandatoryViolationErrorMessage;
  }

  set datatypeViolationErrorMessage(errorMessage) {
    this._datatypeViolationErrorMessage = errorMessage;
  }

  get datatypeViolationErrorMessage() {
    return this._datatypeViolationErrorMessage;
  }

  set emptyValueForSelect(value) {
    this._emptyValueForSelect = value;
  }

  get emptyValueForSelect() {
    return this._emptyValueForSelect;
  }

  set emptyValueForInput(value) {
    this._emptyValueForInput = value;
  }

  get emptyValueForInput() {
    return this._emptyValueForInput;
  }

  set isMandatory(mandatory) {
    this._isMandatory = mandatory;
  }

  get isMandatory() {
    return this._isMandatory;
  }

  set dataType(type) {
    this._dataType = type;
  }

  get dataType() {
    return this._dataType;
  }

  set isValid(valid) {
    this._isValid = valid;
  }

  get isValid() {
    return this._isValid;
  }

  set component(c) {
    this._component = c;
  }

  get component() {
    return this._component;
  }
}

// -- /Field ----------

/*
 --------------------------------
 -- ExternalValidationFunction --
 --------------------------------
*/
class ExternalValidationFunction {
  constructor(functionCall = null, errorMessage = null) {
    this._functionCall = functionCall;
    this._fields = [];
    this._errorMessage = errorMessage;
  }

  addField(field) {
    this._fields.push(field);
  }

  async invoke() {
    return new Promise(async (resolve, reject) => {
      const isValid = await this._functionCall();
      resolve(isValid);
    });
  }

  set functionCall(fc) {
    this._functionCall = fc;
  }

  get functionCall() {
    return this._functionCall;
  }

  set errorMessage(message) {
    this._errorMessage = message;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  get fields() {
    return this._fields;
  }
}

// -- /ExternalValidationFunction ----------

/*
 ---------------
 -- Validator -- 
 ---------------
*/

class M2MJS_Validator {
  constructor() {
    Validator.DataTypes = Object.freeze({
      EMAIL: "email"
    });

    this._shortCircuitErrors = true;
    this._fields = [];
    this._externalValidationFunctions = [];
    this._isValid = true;
    this._countErrors = 0;

    this.onError = async (field, index) => {};
    this.onValidationOk = async field => {};

    this.onExternalValidationFunctionError = async (
      field,
      externalValidationFunction,
      index
    ) => {};
    this.onExternalValidationFunctionValidationOk = async (
      field,
      externalValidationFunction
    ) => {};
  }

  static resolveErrorMessage(errorMessage) {
    if (typeof errorMessage === "function") {
      return errorMessage();
    }

    return errorMessage;
  }

  async clearErrors() {
    this._fields.forEach(async (field, index) => {
      this.onValidationOk(field);
    });

    this._externalValidationFunctions.forEach(
      async (externalValidationFunction, index) => {
        externalValidationFunction.fields.forEach(async (field, index) => {
          this.onExternalValidationFunctionValidationOk(
            field,
            externalValidationFunction
          );
        });
        //
      }
    );
  }

  async isValid() {
    return new Promise((resolve, reject) => {
      resolve(this._isValid);
    });
  }

  async validate() {
    this._isValid = true;
    this._countErrors = 0;

    return new Promise(async (resolve, reject) => {
      this[_traverseFields]().then(async isValid => {
        resolve(isValid);
      });

      this[_traverseExternalValidationFunctions]().then(async isValid => {
        resolve(isValid);
      });
    });
  }

  async [_isEmail](val) {
    const emailPattern = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,10}|[0-9]{1,3})(\]?)$/;

    return new Promise((resolve, reject) => {
      resolve(val.match(emailPattern));
    });
  }

  async [_traverseFields]() {
    return new Promise(async (resolve, reject) => {
      this._fields.forEach(async (field, index) => {
        let fieldIsValid = true;
        const hasValue = await field.hasValue();

        if (field.isMandatory) {
          if (!hasValue) {
            field.currentErrorMessage = field.mandatoryViolationErrorMessage;
            this.onError(field, ++this._countErrors);
            this._isValid = false;
            fieldIsValid = false;
            resolve(false);
          } else {
            this.onValidationOk(field);
          }
        }

        if (field.hasDataType() && hasValue) {
          switch (field.dataType) {
            case Validator.DataTypes.EMAIL:
              const isEmail = await this[_isEmail](field.getValue());
              if (!isEmail) {
                field.currentErrorMessage = Validator.resolveErrorMessage(
                  field.datatypeViolationErrorMessage
                );

                this.onError(field, ++this._countErrors);
                this._isValid = false;
                fieldIsValid = false;
                resolve(false);
              } else {
                this.onValidationOk(field);
              }

              break;
          }
        }

        /* Reach the end with no violations */
        if (index == this._fields.length - 1 && this._isValid) {
          this.onValidationOk(field);
          resolve(true);
        } else {
          if (fieldIsValid) {
            this.onValidationOk(field);
          }
        }

        field.isValid = fieldIsValid;
      });
    });
  }

  async [_traverseExternalValidationFunctions]() {
    return new Promise(async (resolve, reject) => {
      this._externalValidationFunctions.forEach(
        async (externalValidationFunction, index) => {
          /* Check if field exists in validator and is valid */
          let fieldExistsInValidatorAndIsValid = false;

          for (let field of externalValidationFunction.fields) {
            fieldExistsInValidatorAndIsValid =
              this._fields.includes(field) && field.isValid;

            if (fieldExistsInValidatorAndIsValid) {
              break;
            }
          }

          /* Check for further violations */
          if (!fieldExistsInValidatorAndIsValid) {
            const isValid = await externalValidationFunction.invoke();

            if (!isValid) {
              this._isValid = false;
            }

            externalValidationFunction.fields.forEach(async (field, index) => {
              if (isValid) {
                this.onExternalValidationFunctionValidationOk(
                  field,
                  externalValidationFunction
                );
              } else {
                field.currentErrorMessage = Validator.resolveErrorMessage(
                  externalValidationFunction.errorMessage
                );
                this.onExternalValidationFunctionError(
                  field,
                  externalValidationFunction,
                  ++this._countErrors
                );
              }
            });

            resolve(isValid);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  addField(field) {
    this._fields.push(field);
  }

  addExternalValidationFunction(externalValidationFunction) {
    this._externalValidationFunctions.push(externalValidationFunction);
  }

  set shortCircuitErrors(shortCircuitErrors) {
    this._shortCircuitErrors = shortCircuitErrors;
  }

  get shortCircuitErrors() {
    return this._shortCircuitErrors;
  }
}

// -- /Validator ----------


/*
    ---------------
    -- Paginator -- 
    ---------------
   */

class M2MJS_Paginator {
  constructor(
    totalLines = 0,
    linesPerPage = 1,
    firstPageElement = null,
    previousPageElement = null,
    nextPageElement = null,
    lastPageElement = null,
    currentPageElement = null,
    totalPagesElement = null
  ) {
    this._totalLines = totalLines;
    this._linesPerPage = linesPerPage;
    this._pages = this.calculatePages();
    this._currentPage = 1;
    this._pageBegin = this.getPageBegin();
    this._pageEnd = this.getPageEnd();

    this._firstPageElement = firstPageElement;
    this._previousPageElement = previousPageElement;
    this._nextPageElement = nextPageElement;
    this._lastPageElement = lastPageElement;
    this._currentPageElement = currentPageElement;
    this._totalPagesElement = totalPagesElement;

    this.onFirstPage = () => {};
    this.onPreviousPage = () => {};
    this.onNextPage = () => {};
    this.onLastPage = () => {};
    this.onPageChange = () => {};

    this.updatePageBookmarks();

    this.initEvents();
  }

  initEvents() {
    let paginator = this;

    //Goto to first page
    XBrowser.addHandler(this._firstPageElement, "click", function onClick() {
      paginator._currentPage = 1;
      paginator.onFirstPage();
      paginator.onPageChange();
      paginator.updatePageBookmarks();
    });

    //Goto to previous page
    XBrowser.addHandler(this._previousPageElement, "click", function onClick() {
      if (paginator._currentPage > 1) {
        paginator._currentPage--;
      }

      paginator.onPreviousPage();
      paginator.onPageChange();
      paginator.updatePageBookmarks();
    });

    //Goto to next page
    XBrowser.addHandler(this._nextPageElement, "click", function onClick() {
      if (paginator._currentPage < paginator._pages) {
        paginator._currentPage++;
      }

      paginator.onNextPage();
      paginator.onPageChange();
      paginator.updatePageBookmarks();
    });

    //Goto to last page
    XBrowser.addHandler(this._lastPageElement, "click", function onClick() {
      paginator._currentPage = paginator._pages;

      paginator.onLastPage();
      paginator.onPageChange();
      paginator.updatePageBookmarks();
    });

    XBrowser.addHandler(this._currentPageElement, "blur", function onClick() {
      if (
        paginator._currentPageElement.tagName.toLowerCase() == "input" &&
        paginator._currentPageElement.type.toLowerCase() == "text"
      ) {
        var pageNumber = paginator._currentPageElement.value;
        if (
          !isNaN(pageNumber) &&
          pageNumber > 0 &&
          pageNumber <= paginator.pages
        ) {
          paginator._currentPage = Number(pageNumber);
          paginator.onPageChange();
        }
      }

      paginator.onFirstPage();
      paginator.onPageChange();
      paginator.updatePageBookmarks();
    });
  }

  updatePageBookmarks() {
    //Update current page
    if (
      this._currentPageElement.tagName.toLowerCase() == "input" &&
      this._currentPageElement.type.toLowerCase() == "text"
    ) {
      this._currentPageElement.value = this._currentPage;
    } else {
      this._currentPage.innerHTML = this._currentPage;
    }

    //Update total pages
    if (
      this._totalPagesElement.tagName.toLowerCase() == "input" &&
      this._totalPagesElement.type.toLowerCase() == "text"
    ) {
      this._totalPagesElement.value = this._pages;
    } else {
      this._totalPagesElement.innerHTML = this._pages;
    }
  }

  calculatePages() {
    if (this._totalLines == 0) {
      return 1;
    }

    if (this._totalLines % this._linesPerPage == 0) {
      return this._totalLines / this._linesPerPage;
    }

    return parseInt(this._totalLines / this._linesPerPage) + 1;
  }

  getPageBegin() {
    return (this._currentPage - 1) * this._linesPerPage + 1;
  }

  getPageEnd() {
    if (this._currentPage * this._linesPerPage >= this._totalLines) {
      return this._totalLines;
    }

    return this._currentPage * this._linesPerPage;
  }

  get pages() {
    return this._pages;
  }

  set totalLines(totalLines) {
    this._totalLines = totalLines;
    this._pages = this.calculatePages();
  }

  get totalLines() {
    return this._totalLines;
  }

  set linesPerPage(linesPerPage) {
    this._linesPerPage = linesPerPage;
    this._pages = this.calculatePages();
  }

  get linesPerPage() {
    return this._linesPerPage;
  }

  set currentPage(currentPage) {
    this._currentPage = currentPage;
  }

  get currentPage() {
    return this._currentPage;
  }
} // Paginator


/*
    --------------------
    -- SortableColumn -- 
    --------------------
   */



/*
 ----------
 -- Grid -- 
 ----------
*/

class Grid {
  constructor(dataList, gridContainer, gridTemplate, paginator = null) {
    this._dataList = dataList;
    this.gridContainer = gridContainer;
    this.gridTemplate = gridTemplate;

    this.gridRows = [];
    this.objectPaths = [];
    this.renderersSet = [];
    this.componentsSet = [];

    // --- Paging ---
    this.paginator = paginator;
    this.pagingEnabled = paginator != null;

    if (this.pagingEnabled) {
      let grid = this;

      paginator.onPageChange = () => {
        grid.model = null;
        grid.gridRows = [];
        grid.deselectGridRow();
        grid.renderGrid();
      };
    }
    // --- / Paging ---

    //  --- Sorting ---
    this._sort = null;
    // --- / Sorting ---

    this.rowMouseOverClassName = "overGridRow";
    this.rowSelectedClassName = "selectedGridRow";
    this.rowModifiedClassName = "modifiedGridRow";

    this.defineObjectPaths();

    this.onGridRowRender = gridRow => {};
    this.onGridRowSelect = gridRow => {};
    this.onGridRowDeselect = gridRow => {};
    this.onGridRowModificationStatusChange = gridRow => {};
  }

  enableSorting(sortAscendingClass, sortDescendingClass) {
    this._sort = new Grid.Sort(sortAscendingClass, sortDescendingClass);
  }

  addSortColumn(sortableColumn) {
    if (this._sort == null) {
      throw "Sorting is not enabled";
    }

    this._sort.addColumn(sortableColumn);

    this.addSortEvent(sortableColumn);
  }

  addSortEvent(sortableColumn) {
    if (this._sort.currentSortedColumn == null) {
      this._sort.currentSortedColumn = sortableColumn;
    }

    XBrowser.addHandler(sortableColumn.element, "click", e => {
      if (this._sort.currentSortedColumn != null) {
        this._sort.currentSortedColumn.element.className = this._sort.currentSortedColumn.element.className.replace(
          this._sort.currentSortedColumn.currentSortClass,
          ""
        );
      }

      if (!this._sort.currentSortedColumn.equals(sortableColumn)) {
        const sort = this._sort;
        this._sort.sortColumns.forEach((sortColumn, index) => {
          if (sortColumn.equals(sort.currentSortedColumn)) {
            sortColumn.element.className = sortColumn.className;
          }
        });
      }

      this._sort.currentSortedColumn = sortableColumn;

      switch (this._sort.currentSortedColumn.sortType) {
        case /*Grid.*/ Sort.SortTypes.ascending:
          sortableColumn.element.currentSortClass = this._sort.sortAscClass;

          if (this._sort.currentSortedColumn.equals(sortableColumn)) {
            sortableColumn.sortType = /*Grid.*/ Sort.SortTypes.descending;
          }
          break;

        case /*Grid.*/ Sort.SortTypes.descending:
          sortableColumn.element.currentSortClass = this._sort.sortDescClass;

          if (this._sort.currentSortedColumn.equals(sortableColumn)) {
            sortableColumn.sortType = /*Grid.*/ Sort.SortTypes.ascending;
          }

          break;
      }

      this._sort.currentSortedColumn.element.className =
        sortableColumn.element.currentSortClass;

      let gridSort = this._sort;
      this._dataList.sort(function (object1, object2) {
        return /*Grid.*/ Sort.dataComparator(object1, object2, gridSort);
      });

      if (this.pagingEnabled) {
        this.paginator.onPageChange();
      } else {
        this.model = null;
        this.gridRows = [];
        this.deselectGridRow();
        this.renderGrid();
      }
    });
  }

  enablePaginator() {
    this.pagingEnabled = true;
  }

  disablePaginator() {
    this.pagingEnabled = false;
  }

  getData() {
    if (this.pagingEnabled) {
      return this._dataList.slice(
        this.paginator.getPageBegin() - 1,
        this.paginator.getPageEnd()
      );
    } else {
      return this._dataList;
    }
  }

  defineObjectPaths() {
    for (let property in this._dataList) {
      this.objectPaths.push(property);
    }

    if (this._dataList != null && this._dataList.length > 0) {
      const rowModel = this._dataList[0];

      for (let property in rowModel) {
        if (typeof rowModel[property] != "object") {
          this.objectPaths.push(property);
        } else {
          this.objectPaths.push(property);
          this.objectPaths.push(property + ".");
          this.traverseObjectModel(rowModel[property]);
        }
      }
    }
  }

  traverseObjectModel(rowModel) {
    const currentObjectPath = this.objectPaths[this.objectPaths.length - 1];

    for (let property in rowModel) {
      if (typeof rowModel[property] != "object") {
        this.objectPaths.push(currentObjectPath + property);
      } else {
        this.objectPaths.push(currentObjectPath + property + ".");
        this.traverseObjectModel(rowModel[property]);
      }
    }
  }

  deselectGridRow() {
    const grid = this;

    this.gridRows.forEach(function (gridRow, index) {
      if (gridRow.isSelected) {
        gridRow.deselect();

        if (grid.onGridRowDeselect) {
          grid.onGridRowDeselect(gridRow);
        }

        return gridRow;
      }
    });

    return null;
  }

  renderGrid() {
    this.clearGrid();

    const grid = this;

    this.getData().forEach(function (modelObject, index) {
      let gridRow = new GridRow(
        grid.gridTemplate,
        modelObject,
        grid.objectPaths,
        grid.renderersSet,
        grid.componentsSet,
        index
      );

      gridRow.mouseOverClass = grid.rowMouseOverClassName;
      gridRow.selectedClass = grid.rowSelectedClassName;
      gridRow.modifiedClass = grid.rowModifiedClassName;

      grid.onGridRowRender(gridRow);

      gridRow.onBeforeSelect = function () {
        grid.deselectGridRow();
      };

      gridRow.onSelect = function () {
        grid.onGridRowSelect(this);
        grid.model = gridRow.model;
      };

      grid.gridRows.push(gridRow);

      grid.gridContainer.appendChild(gridRow.renderGridRow());
    });
  }

  clearGrid() {
    if (this.gridContainer.childNodes.length > 0) {
      //TODO: Investigate improvement
      for (let i = this.gridContainer.childNodes.length - 1;; i--) {
        this.gridContainer.removeChild(this.gridContainer.childNodes[i]);
        if (i == 0) {
          break;
        }
      }
    }
  }

  get model() {
    return this.modelObject;
  }

  set model(modelObject) {
    this.modelObject = modelObject;
  }

  get gridModel() {
    let gridRowsModelObjects = [];

    this.gridRows.forEach(function (gridRow, index) {
      gridRowsModelObjects.push(gridRow.model);
    });

    return gridRowsModelObjects;
  }

  set renderers(renderers) {
    this.renderersSet = renderers;
  }

  get renderers() {
    return this.renderersSet;
  }

  set components(components) {
    this.componentsSet = components;
  }

  get components() {
    return this.componentsSet;
  }

  set sort(sort) {
    this._sort = sort;
  }

  get sort() {
    return this._sort;
  }

  set template(t) {
    this.gridTemplate = t;
  }

  get template() {
    return this.gridTemplate;
  }

  set dataList(dataList) {
    this._dataList = null;
    this._dataList = dataList;

    this.renderGrid();
  }

  get dataList() {
    return this._dataList;
  }
} // Grid

/*
 -------------
 -- GridRow -- 
 -------------
*/

class GridRow {
  constructor(
    gridTemplate,
    modelObject,
    objectPaths,
    renderers,
    components,
    index
  ) {
    this.gridTemplate = gridTemplate;
    this._modelObject = modelObject;
    this.objectPaths = objectPaths;
    this._index = index;

    this._form = new Form(modelObject);

    this.selected = false;
    this.gridRowCurrentClass = "";
    this.gridRowContainer = null;

    this.renderers = renderers;
    this.components = components;

    this.mouseOverClassName = "";
    this.selectedClassName = "";
    this.modifiedClassName = "";

    this.onBeforeSelect = () => {};
    this.onSelect = () => {};
    this.defineComponent = (id, element, objectValue) => {};
    this.renderElement = (renderer, element, modelObject) => {};
  }

  renderGridRow() {
    if (this.gridRowContainer == null) {
      this.gridRowContainer = this.gridTemplate.cloneNode(true);
    }

    this.gridRowCurrentClass = this.gridRowContainer.className;

    const gridRow = this;

    this.objectPaths.forEach(function (objectPath, index) {
      const objectValue = gridRow.getObjectValue(objectPath);
      gridRow.parseGridRow(objectPath, objectValue);

      let element = XBrowser.getElement(gridRow.gridRowContainer, objectPath);

      //TODO: Test this
      if (element === null) {
        if (gridRow.gridRowContainer.id === objectPath) {
          element = gridRow.gridRowContainer;
        }
      }

      if (element != null) {
        let elementClone = element.cloneNode(true);
        element.innerHTML = objectValue;

        //Components (If any)
        gridRow.components.forEach(function (component, index) {
          if (component["id"] == objectPath) {
            element.innerHTML = elementClone.innerHTML;
            let cFunc = component["code"];
            cFunc(gridRow, objectPath, element, objectValue);
          }
        });
      }
    });

    //Renderers (If any)
    this.renderers.forEach(async function (renderer, index) {
      let element = XBrowser.getElement(
        gridRow.gridRowContainer,
        renderer["name"]
      );
      if (!element) {
        if (gridRow.gridRowContainer.id === renderer["name"]) {
          element = gridRow.gridRowContainer;
        }
      }

      if (element) {
        let rFunc = renderer["code"];
        await rFunc(element, gridRow._modelObject, gridRow);
      }
    });

    XBrowser.addHandler(this.gridRowContainer, "click", function onClick(e) {
      gridRow.onBeforeSelect();

      gridRow.gridRowContainer.className = gridRow.selectedClass;
      gridRow.isSelected = true;

      gridRow.onSelect();
    });

    XBrowser.addHandler(
      this.gridRowContainer,
      "mouseover",
      function onMouseOver(e) {
        if (gridRow.gridRowContainer.id == "view") {
          gridRow.gridRowContainer.className = gridRow.mouseOverClass;
        }

        if (!gridRow.isSelected) {
          gridRow.gridRowContainer.className = gridRow.mouseOverClass;
        }
      }
    );

    XBrowser.addHandler(
      this.gridRowContainer,
      "mouseout",
      function onMouseOut() {
        if (!gridRow.isSelected) {
          gridRow.gridRowContainer.className = gridRow.gridRowCurrentClass;
        }
      }
    );

    this.form.modelObject = this._modelObject;

    return this.gridRowContainer;
  }

  set mouseOverClass(mouseOverClass) {
    this.mouseOverClassName = mouseOverClass;
  }

  set selectedClass(selectedClass) {
    this.selectedClassName = selectedClass;
  }

  get selectedClass() {
    return this.selectedClassName;
  }

  set modifiedClass(modifiedClass) {
    this.modifiedClassName = modifiedClass;
  }

  get model() {
    //return this.modelObject;
    return this.form.modelObject;
  }

  set model(modelObject) {
    //this.modelObject = modelObject;
    this.form.modelObject = modelObject;
  }

  get form() {
    return this._form;
  }

  get isSelected() {
    return this.selected;
  }

  set isSelected(selected) {
    this.selected = selected;
  }

  get index() {
    return this._index;
  }

  parseGridRow(objectPath, objectValue) {
    let toReplace = "{" + objectPath + "}";

    this.gridRowContainer.childNodes.forEach(function (childNode, index) {
      try {
        if (childNode.innerHTML.indexOf(toReplace) > -1) {
          childNode.innerHTML = childNode.innerHTML.replace(
            eval("/" + toReplace + "/g"),
            objectValue
          );
        }
      } catch (e) {}
    });
  }

  getObjectValue(objectPath) {
    return resolveObjectValue(objectPath, this._modelObject);
  }

  deselect() {
    this.isSelected = false;

    this.gridRowContainer.className = this.gridRowCurrentClass;
  }
} // GridRow


/*
    ----------
    -- Sort -- 
    ----------
   */

class Sort {
  constructor(sortAscClass = "", sortDescClass = "") {
    this._sortAscClass = sortAscClass;
    this._sortDescClass = sortDescClass;

    this.sortColumns = [];
    this._currentSortedColumn = null;

    Sort.SortTypes = Object.freeze({
      ascending: "ascending",
      descending: "descending"
    });

    Sort.SortDataTypes = Object.freeze({
      alphanumeric: "Alphanumeric",
      numeric: "Numeric",
      date: "Date"
    });
  }

  addColumn(sortableColumn) {
    this.sortColumns.push(sortableColumn);
  }

  get currentSortedColumn() {
    return this._currentSortedColumn;
  }

  set currentSortedColumn(sortableColumn) {
    this._currentSortedColumn = sortableColumn;
  }

  get sortAscClass() {
    return this._sortAscClass;
  }

  get sortDescClass() {
    return this._sortDescClass;
  }

  static dataComparator(object1, object2, sort) {
    if (
      sort.currentSortedColumn.dataProperty == null ||
      sort.currentSortedColumn.dataProperty == ""
    ) {
      return 0;
    }

    switch (sort.currentSortedColumn.sortDataType) {
      case /*Grid.*/ Sort.SortDataTypes.numeric:
        if (
          sort.currentSortedColumn.sortType == /*Grid.*/ Sort.SortTypes.ascending
        ) {
          return (
            Number(object2[sort.currentSortedColumn.dataProperty]) -
            Number(object1[sort.currentSortedColumn.dataProperty])
          );
        } else {
          return (
            Number(object1[sort.currentSortedColumn.dataProperty]) -
            Number(object2[sort.currentSortedColumn.dataProperty])
          );
        }
        break;

      case /*Grid.*/ Sort.SortDataTypes.alphanumeric:
        if (
          resolveObjectValue(sort.currentSortedColumn.dataProperty, object2) >
          resolveObjectValue(sort.currentSortedColumn.dataProperty, object1)
        ) {
          if (
            sort.currentSortedColumn.sortType == /*Grid.*/ Sort.SortTypes.ascending
          ) {
            return 1;
          } else {
            return -1;
          }
        } else {
          if (
            sort.currentSortedColumn.sortType == /*Grid.*/ Sort.SortTypes.ascending
          ) {
            return -1;
          } else {
            return 1;
          }
        }

        return 0;
        //break;

      case /*Grid.*/ Sort.SortDataTypes.date:
        var date1 = new Date();
        //value1 = date1.parseFromString(this._currentSortedColumn.dateFormat, resolveObjectValue(this._currentSortedColumn.dataProperty, object1));
        value1 = /*Grid.*/ Sort.parseFromString(
          date1,
          sort.currentSortedColumn.dateFormat,
          resolveObjectValue(sort.currentSortedColumn.dataProperty, object1)
        );

        var date2 = new Date();
        //value2 = date2.parseFromString(this._currentSortedColumn.dateFormat, resolveObjectValue(this._currentSortedColumn.dataProperty, object2));
        value2 = /*Grid.*/ Sort.parseFromString(
          date2,
          sort.currentSortedColumn.dateFormat,
          resolveObjectValue(sort.currentSortedColumn.dataProperty, object1)
        );

        if (value2 > value1) {
          if (
            sort.currentSortedColumn.sortType == /*Grid.*/ Sort.SortTypes.ascending
          ) {
            return 1;
          } else {
            return -1;
          }
        } else {
          if (
            sort.currentSortedColumn.sortType == /*Grid.*/ Sort.SortTypes.ascending
          ) {
            return -1;
          } else {
            return 1;
          }
        }

        return 0;

        //break;

      default:
        break;
    }
  }

  static parseFromString(date, format, dateString) {
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

    return date.parseFromString(format, dateString);
  }
} // Sort


class SortableColumn {
  constructor(
    element = null,
    sortDataType = /*Grid.*/ Sort.SortDataTypes.alphanumeric,
    sortType = /*Grid.*/ Sort.SortTypes.ascending,
    dataProperty = "",
    dateFormat = "dd/MM/yyyy"
  ) {
    this._element = element;
    this._sortDataType = sortDataType;
    this._sortType = sortType;
    this._dataProperty = dataProperty;
    this._currentSortClass = "";
    this._className = this.element == null ? "" : this.element.className;
    this.dateFormat = dateFormat;
  }

  get element() {
    return this._element;
  }

  set currentSortClass(currentSortClass) {
    this._currentSortClass = currentSortClass;
  }

  get currentSortClass() {
    return this._currentSortClass;
  }

  get sortDataType() {
    return this._sortDataType;
  }

  get sortType() {
    return this._sortType;
  }

  set sortType(sortType) {
    this._sortType = sortType;
  }

  get dataProperty() {
    return this._dataProperty;
  }

  equals(o) {
    if (this.element != null && o.element != null) {
      if (this.element.id && o.element.id) {
        return this.element.id == o.element.id;
      }
    }

    if (
      this.dataProperty != null &&
      this.dataProperty != "" &&
      o.dataProperty != null &&
      o.dataProperty != ""
    ) {
      return this.dataProperty == o.dataProperty;
    }

    return false;
  }
} // SortableColumn