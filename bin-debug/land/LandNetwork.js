// TypeScript file
// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var tgame;
(function (tgame) {
    var LandNetwork = (function () {
        function LandNetwork(l) {
            this.landView = null;
            this.landView = l;
            this._netWork = new Network();
            this._netWork.setConnectHandler(this.onNetConnected, this);
            this._netWork.setCloseHandler(this.onNetClose, this);
            this._netWork.setErrorHandler(this.onNetError, this);
        }
        LandNetwork.prototype.AccountLogin = function (account, pwd) {
            this._account = account;
            this._pwd = pwd;
            this._netWork.connect("localhost", "echo", 8080);
        };
        LandNetwork.prototype.onNetConnected = function () {
            if (this._netWork) {
                this._netWork.bind("Index.Login", this.onLogin, this);
                this._netWork.bind("Scene.Skill", this.onSkill, this);
                this._netWork.send("Index", "Login", { "name": this._account, "pwd": this._pwd });
            }
        };
        LandNetwork.prototype.onNetError = function () {
        };
        LandNetwork.prototype.onNetClose = function () {
        };
        LandNetwork.prototype.onLogin = function (data) {
            console.log("onLogin %s:%s:%s", data["name"], data["pwd"], data["ret"]);
        };
        LandNetwork.prototype.onSkill = function (data) {
            // 技能名称
            // 技能目标
            // 
            // data["account"]
            // 某一个帐号
            switch (data["name"]) {
                case "move_left":
                    break;
                case "move_right":
                    break;
                case "jump":
                    break;
            }
        };
        return LandNetwork;
    }());
    tgame.LandNetwork = LandNetwork;
    __reflect(LandNetwork.prototype, "tgame.LandNetwork");
})(tgame || (tgame = {}));
//# sourceMappingURL=LandNetwork.js.map