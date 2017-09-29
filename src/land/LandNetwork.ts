// TypeScript file
// TypeScript file

namespace tgame {
    export class LandNetwork {

        private landView: LandView = null;
        private _netWork: Network;
        private _account: string;
        private _pwd: string;
        private _accountEasyAIs: MapStr<EasyAI>;

        public constructor(l: LandView) {
            this.landView = l;
            this._netWork = new Network();
            this._netWork.setConnectHandler(this.onNetConnected, this);
            this._netWork.setCloseHandler(this.onNetClose, this);
            this._netWork.setErrorHandler(this.onNetError, this);

            this._accountEasyAIs = new MapStr<EasyAI>();
        }

        public AccountLogin(account: string, pwd: string) {
            this._account = account;
            this._pwd = pwd;
            this._netWork.connect("localhost", "echo", 8080);
        }

        public send(c: string, m: string, data: any) {
            this._netWork.send(c, m, data);
        }

        private onNetConnected() {
            if (this._netWork) {
                this._netWork.bind("Index.Login", this.onLogin, this);
                this._netWork.bind("Scene.PlayerEnter", this.onPlayerEnter, this);
                this._netWork.bind("Scene.PlayerLeave", this.onPlayerLeave, this);
                this._netWork.bind("Scene.Skill", this.onSkill, this);

                this.send("Index", "Login", { "account": this._account, "pwd": this._pwd, "pos_x": 0, "pos_y": 0 });
            }
        }

        private onNetError() {
        }

        private onNetClose() {
        }

        private onLogin(data: any) {
            console.log("onLogin %s:%s:%s", data["account"], data["pwd"], data["ret"]);

            if (data["account"] == this._account) {
                if (!this._accountEasyAIs.has(data["account"])) {
                    let easyAI = this.landView._base.AddRole(data["account"], data["pos_x"], data["pos_y"]);
                    easyAI.enablePlayer(true);
                    this._accountEasyAIs.add(data["account"], easyAI);
                    this.landView._player.setAccount(this._account, easyAI);
                }
            }
        }

        private onPlayerEnter(data: any) {
            if (data["account"] == this._account)
                return;
            if (!this._accountEasyAIs.has(data["account"])) {
                let easyAI = this.landView._base.AddRole(data["account"], data["pos_x"], data["pos_y"]);
                easyAI.enablePlayer(true);
                this._accountEasyAIs.add(data["account"], easyAI);
            }
        }

        private onPlayerLeave(data: any) {
            if (this._accountEasyAIs.has(data["account"])) {
                let acc = this._accountEasyAIs.get(data["account"]);
                if (acc != null) {
                    this.landView.DelRole(data["account"]);
                    this._accountEasyAIs.del(data["account"]);
                }
            }
        }

        private onSkill(data: any) {
            // 技能名称
            // 技能目标
            // 
            // data["account"]
            // 某一个帐号
            // 找到帐号的 EasyAI, 进行操作

            if (data["account"] == this._account)
                return;

            if (this._accountEasyAIs.has(data["account"])) {
                let acc = this._accountEasyAIs.get(data["account"]);
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
        }
    }
}

