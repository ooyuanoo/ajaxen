/**
 * Created by yuanqiujuan on 2018/3/24.
 */
function HttpReq (){}

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
        try {
            return JSON.parse(data)
        }catch(e){
            return data;
        }
    },
    get: function(params){
        var data = params.params ? this.setFormUrlencoded(params.params) : null,
            url = data ? (params.url + '?' + data) : params.url,
            isAsync = params.async !== false,
            thenFn, 
            catchFn,
            that = this,
            chain = {
                then: function(callback) {
                    thenFn = callback;

                    return chain;
                },
                catch: function(callback) {
                    catchFn = callback;

                    return chain;
                }
            };

        if (isAsync) {
            this.ajaxSend('GET', url, isAsync, data, thenFn, catchFn);
        } else {
            chain.run = function() {
                that.ajaxSend('GET', url, isAsync, data, thenFn, catchFn);
            }
        }

        return chain;
    },
    post: function(params){
        var data = params.params ? this.setFormUrlencoded(params.params) : null,
            isAsync = params.async !== false,
            thenFn, 
            catchFn,
            that = this,
            isSet = { 
                then: false, 
                catch: false
            },
            chain = {
                then: function(callback) {
                    thenFn = callback;
                    isSet.then = true;

                    return chain;
                },
                catch: function(callback) {
                    catchFn = callback;
                    isSet.catch = true;

                    return chain;
                }
            };

        if (isAsync) {
            this.ajaxSend('POST', params.url, isAsync, data, thenFn, catchFn);  
        } else {
            chain.run = function() {
                that.ajaxSend('POST', params.url, isAsync, data, thenFn, catchFn);
            }
        }

        return chain;
    },
    ajaxSend: function (method, url, async, data, thenFn, catchFn) {
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
            that.ajaxStateHandler(xmlHttp, thenFn, catchFn);
        }
    },
    ajaxStateHandler: function (xmlHttp, thenFn, catchFn) {
        if (xmlHttp.readyState === 4) {
            switch (xmlHttp.status){
                case 200:
                    thenFn(this.parseJson(xmlHttp.responseText));
                    break;
                case 500:
                case 404:
                case 400:
                case 0:
                    catchFn(this.parseJson(xmlHttp.responseText) || xmlHttp.statusText);
                    break;
            }
        }
    }
}
