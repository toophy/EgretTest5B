var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 *
 * @author
 *
 */
var Network = (function () {
    function Network() {
        this.handler = {};
        //创建 WebSocket 对象
        this.socket = new egret.WebSocket();
        //设置数据格式为二进制，默认为字符串
        //this.socket.type = egret.WebSocket.TYPE_BINARY;
        //添加收到数据侦听，收到数据会调用此方法
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);
        //添加链接打开侦听，连接成功会调用此方法
        this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
        this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        //添加异常侦听，出现异常会调用此方法
        this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    }
    Network.prototype.setConnectHandler = function (_func, _obj) {
        this.cbConnect = [_obj, _func];
    };
    Network.prototype.setCloseHandler = function (_func, _obj) {
        this.cbClose = [_obj, _func];
    };
    Network.prototype.setErrorHandler = function (_func, _obj) {
        this.cbError = [_obj, _func];
    };
    Network.prototype.connect = function (_host, _host_url, _port) {
        this.state = 0;
        this.host = _host;
        this.host_url = _host_url;
        this.port = _port;
        if (this.host_url.length > 0) {
            this.socket.connectByUrl("ws://" + this.host + ":" + this.port + "/" + this.host_url);
        }
        else {
            this.socket.connect(_host, _port);
        }
    };
    Network.prototype.reconnect = function () {
        if (this.host_url.length > 0) {
            this.socket.connectByUrl("ws://" + this.host + ":" + this.port + "/" + this.host_url);
        }
        else {
            this.connect(this.host, this.host_url, this.port);
        }
    };
    Network.prototype.bind = function (name, func, obj) {
        this.handler[name] = [obj, func];
    };
    Network.prototype.send = function (c, m, data) {
        var obj = {
            "c": c,
            "m": m,
            "data": data
        };
        console.log("send -->", JSON.stringify(obj));
        this.socket.writeUTF(JSON.stringify(obj));
    };
    Network.prototype.isConnected = function () {
        return this.state == 1;
    };
    Network.prototype.onSocketOpen = function () {
        console.log("websocket connected");
        if (this.cbConnect.length > 0) {
            var obj = this.cbConnect[0];
            var func = this.cbConnect[1];
            func.call(obj);
        }
        this.state = 1;
    };
    Network.prototype.onSocketClose = function () {
        console.log("websocket closed");
        if (this.cbClose.length > 0) {
            var obj = this.cbClose[0];
            var func = this.cbClose[1];
            func.call(obj);
        }
    };
    Network.prototype.onSocketError = function () {
        console.log("websocket error");
        if (this.cbError.length > 0) {
            var obj = this.cbError[0];
            var func = this.cbError[1];
            func.call(obj);
        }
    };
    Network.prototype.onSocketData = function (e) {
        var bytes = this.socket.readUTF();
        console.log("recv -->", bytes);
        var packet = JSON.parse(bytes);
        this.dispatch(packet);
    };
    Network.prototype.dispatch = function (msg) {
        //data handler
        var error = msg["err"];
        var name = error ? "Error" : msg["c"] + "." + msg["m"];
        var cb = this.handler[name];
        if (cb) {
            var obj = cb[0];
            var func = cb[1];
            func.call(obj, msg["data"]);
        }
        else {
            console.log("not found handler --> " + name);
        }
    };
    return Network;
}());
__reflect(Network.prototype, "Network");
//# sourceMappingURL=NetWork.js.map