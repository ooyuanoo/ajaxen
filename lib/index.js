/**
 * Created by yuanqiujuan on 2018/3/24.
 */
function HttpReq (){
    this.queue = [];
    this.callQueue = [];
    this.errorQueue = [];
    this.resolvedQueue = [];
    this.resolvedErrorQueue = [];
}

HttpReq.prototype = {
    setFormUrlencoded: function (data) {
        var arr = [],
            strings = "";

        for(var i in data){
            arr.push(i + "=" + data[i]);
        }

        strings = arr.join("&");

        return strings;
    },
    parseJson: function (data) {
        return data && typeof data === "string" ? JSON.parse(data) : data
    },
    isSync: function () {
        return this.callQueue.length === 0 && ( this.resolvedQueue.length > 0 || this.resolvedErrorQueue.length > 0);
    },
    get: function (params) {
        var data = params.params ? this.setFormUrlencoded(params.params) : null,
            url = data ? (params.url + '?' + data) : params.url,
            isAsync = params.async.toString() ? params.async : true;

        this.queue.push(location.origin + url);
        this.ajaxSend('GET', url, isAsync, data);
        return this;
    },
    post: function (params) {
        var data = params.params ? this.setFormUrlencoded(params.params) : null,
            isAsync = params.async.toString() ? params.async : true;

        this.queue.push(location.origin + params.url);
        this.ajaxSend('POST', params.url, isAsync, data);
        return this;
    },
    then: function (callback) {
        if(this.isSync() && this.resolvedQueue.length > 0){
            callback(this.resolvedQueue)
        }else{
            this.callQueue.push(callback);
        }

        return this;
    },
    catch: function (callback) {
        if(this.isSync() && this.resolvedErrorQueue.length > 0){
            callback(this.resolvedErrorQueue);
        }else{
            this.errorQueue.push(callback);
        }

        return this;
    },
    ajaxSend: function (method, url, async, data) {
        var xmlHttp,
            that = this;

        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (xmlHttp) {
            xmlHttp.onreadystatechange = stateChange;
            xmlHttp.open(method, url, async);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.send(data);
        } else {
            alert("Your browser does not support XMLHTTP.");
        }

        function stateChange() {
            that.ajaxStateHandler(xmlHttp);
        }
    },
    ajaxStateHandler: function (xmlHttp) {
        if (xmlHttp.readyState === 4) {
            switch (xmlHttp.status){
                case 200:
                    if(this.callQueue.length === 0){
                        this.resolvedQueue.push(this.parseJson(xmlHttp.responseText));
                    }else{
                        this.callQueue[this.queue.indexOf(xmlHttp.responseURL)](this.parseJson(xmlHttp.responseText));
                    }
                    break;
                case 500:
                case 404:
                case 400:
                case 0:
                    var data = this.parseJson(xmlHttp.responseText) || xmlHttp.statusText;

                    if(this.errorQueue.length === 0){
                        this.resolvedErrorQueue.push(data);
                    }else{
                        this.errorQueue[this.queue.indexOf(xmlHttp.responseURL)](data);
                    }
                    break;
            }
        }
    }
};
