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
            this._accountEasyAIs = new MapStr();
        }
        LandNetwork.prototype.AccountLogin = function (account, pwd) {
            this._account = account;
            this._pwd = pwd;
            this._netWork.connect("localhost", "echo", 8080);
        };
        LandNetwork.prototype.send = function (c, m, data) {
            this._netWork.send(c, m, data);
        };
        LandNetwork.prototype.onNetConnected = function () {
            if (this._netWork) {
                this._netWork.bind("Index.Login", this.onLogin, this);
                this._netWork.bind("Scene.PlayerEnter", this.onPlayerEnter, this);
                this._netWork.bind("Scene.Skill", this.onSkill, this);
                this.send("Index", "Login", { "account": this._account, "pwd": this._pwd, "pos_x": 0, "pos_y": 0 });
            }
        };
        LandNetwork.prototype.onNetError = function () {
        };
        LandNetwork.prototype.onNetClose = function () {
        };
        LandNetwork.prototype.onLogin = function (data) {
            console.log("onLogin %s:%s:%s", data["account"], data["pwd"], data["ret"]);
            if (data["account"] == this._account) {
                if (!this._accountEasyAIs.has(data["account"])) {
                    var easyAI = this.landView._base.AddActor(data["account"], data["pos_x"], data["pos_y"]);
                    this._accountEasyAIs.add(data["account"], easyAI);
                    this.landView._player.setAccount(this._account, easyAI);
                    easyAI.enablePlayer(true);
                }
            }
        };
        LandNetwork.prototype.onPlayerEnter = function (data) {
            if (data["account"] == this._account)
                return;
            if (!this._accountEasyAIs.has(data["account"])) {
                var easyAI = this.landView._base.AddActor(data["account"], data["pos_x"], data["pos_y"]);
                this._accountEasyAIs.add(data["account"], easyAI);
            }
        };
        LandNetwork.prototype.onPlayerLeave = function (data) {
            if (this._accountEasyAIs.has(data["account"])) {
                var acc = this._accountEasyAIs.get(data["account"]);
                if (acc != null) {
                    this.landView.DelActor(acc.getActor());
                    this._accountEasyAIs.del(data["account"]);
                }
            }
        };
        LandNetwork.prototype.onSkill = function (data) {
            // 技能名称
            // 技能目标
            // 
            // data["account"]
            // 某一个帐号
            // 找到帐号的 EasyAI, 进行操作
            if (data["account"] == this._account)
                return;
            if (this._accountEasyAIs.has(data["account"])) {
                var acc = this._accountEasyAIs.get(data["account"]);
                if (acc != null) {
                    //acc.getActor()
                    switch (data["name"]) {
                        case "move_left":
                            acc.moveLeft(data["isDown"]);
                            break;
                        case "move_right":
                            acc.moveRight(data["isDown"]);
                            break;
                        case "jump":
                            acc.jump(data["isDown"]);
                            break;
                        case "squat":
                            acc.squat(data["isDown"]);
                            break;
                        case "switchWeaponR":
                            acc.switchWeaponR(data["isDown"]);
                            break;
                        case "switchWeaponL":
                            acc.switchWeaponL(data["isDown"]);
                            break;
                    }
                }
            }
        };
        return LandNetwork;
    }());
    tgame.LandNetwork = LandNetwork;
    __reflect(LandNetwork.prototype, "tgame.LandNetwork");
})(tgame || (tgame = {}));
//# sourceMappingURL=LandNetwork.js.map