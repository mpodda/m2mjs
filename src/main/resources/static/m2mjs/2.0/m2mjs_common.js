var M2MJS_COMMON = (function () {

    ///////////////
    // Xbrowser // ----------------------------------------------------------------------------------------------------
    ///////////////


    var xBrowser = (function () {

        function _addHandler(target, eventName, handlerName) {
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


        function _getElement(parentElement, elementId) {
            var returnElement = null;


            for (var i = 0; i < parentElement.childNodes.length; i++) {
                if (parentElement.childNodes[i].id == elementId) {
                    returnElement = parentElement.childNodes[i];
                    break;
                }

                if (returnElement == null && parentElement.childNodes[i].childNodes.length > 0) {
                    var element = _getElement(parentElement.childNodes[i], elementId);
                    if (element != null) {
                        return element;
                    }
                }
            }

            return returnElement;
        }

        return {
            addHandler: _addHandler,
            getElement: _getElement
        }
    });

    ////////////////
    // Connection // --------------------------------------------------------------------------------------------------
    ////////////////

    var connection = (function (c) {

        var defaultConfiguration = {
            url: "",
            async: true,
            method: "POST",
            data: null,
            isJson: true
        }

        c.config = function (conf) {
            this.status;

            this.url = conf.url;

            this.async = defaultConfiguration.async;

            if (conf.async != null) {
                this.async = conf.async;
            }


            this.method = defaultConfiguration.method;

            if (conf.method != null) {
                this.method = conf.method;
            }


            this.data = defaultConfiguration.data;

            if (conf.data != null) {
                this.data = conf.data;
            }


            this.isJson = defaultConfiguration.isJson;

            if (conf.isJson != null) {
                this.isJson = conf.isJson;
            }

            this.httpRequest = null;
            this.respose = "";


            this.onResponse = function () { };
            this.onError = function () { };
            this.onSuccess = function () { };

            return this;
        }

        // ----------------------------------------------------------------------------------------

        c.getResponse = function () {
            return this.responseText;
        }

        // ----------------------------------------------------------------------------------------

        c.getResponseJson = function () {
            return eval("(function(){return " + this.responseText + ";})()");
        }

        // ----------------------------------------------------------------------------------------

        c.connect = function () {
            var retValue;
            var request;

            if (window.XMLHttpRequest) {
                this.httpRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                this.httpRequest = new ActiveXObject("MSXML2.XMLHTTP");
            }

            switch (this.method) {
                case "POST":
                case "GET":
                    if (this.async) {
                        callAsync(this);
                    } else {
                        return callSync(this);
                    }
                break;
            }
        }

        // ----------------------------------------------------------------------------------------

        function callAsync(cn) {
            
            cn.httpRequest.onreadystatechange = function () {
                if (cn.httpRequest.readyState != 4) {
                    return;
                }

                cn.status = cn.httpRequest.status;

                if (cn.httpRequest.status != 200) {
                    //alert("There is a problem with the request.\nReturn Status: " + cn.httpRequest.status);
                    cn.onError();
                    
                    return;
                }

                
                cn.responseText = cn.httpRequest.responseText;
                cn.onResponse();
                cn.onSuccess();
            }

            call(cn);

        }

        // ----------------------------------------------------------------------------------------

        function callSync(cn) {
            call(cn);

            cn.responseText = cn.httpRequest.responseText;

            return cn.responseText;
        }

        // ----------------------------------------------------------------------------------------

        function call(cn) {
            cn.httpRequest.open(cn.method, cn.url, cn.async);

            if (cn.isJson) {
                cn.httpRequest.setRequestHeader('Accept', 'application/json, text/javascript, */*');
                cn.httpRequest.setRequestHeader('content-type', 'application/json; charset=UTF-8');
            }

            //alert(cn.data);

            cn.httpRequest.send((cn.data));
        }

        // ========================================================================================

        return {
            //connect : _connect
        }
    });



    /////////////////////
    // Template Loader // ---------------------------------------------------------------------------------------------
    /////////////////////

    var templateLoader = (function (templateUrl) {
        var c = {};

        var cn = new connection(c);

        _templateUrl = templateUrl;

        // ----------------------------------------------------------------------------------------

        function _loadTemplate(templateId) {
            c.config({
                url: _templateUrl,
                async: false

            }).connect();

            var fragment = document.createDocumentFragment();
            var templateText = document.createElement("body");
            templateText.innerHTML = c.getResponse();
            fragment.appendChild(templateText);

            var _xBrowser = new xBrowser();

            var template = _xBrowser.getElement(fragment.childNodes[0], templateId);

            return template;
        }

        // ----------------------------------------------------------------------------------------

        return {
            loadTemplate: _loadTemplate
        }

    });

    ////////////
    // Public // ------------------------------------------------------------------------------------------------------
    ////////////

    return {
        XBrowser: xBrowser,
        Connection: connection,
        TemplateLoader: templateLoader
    }

})();