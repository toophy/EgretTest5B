// TypeScript file
// TypeScript file

namespace tgame {
    export class LandNetwork {

        private landView: LandView = null;
        private _netWork: Network;
        private _account: string;
        private _pwd: string;

        public constructor(l: LandView) {
            this.landView = l;
            this._netWork = new Network();
            this._netWork.setConnectHandler(this.onNetConnected, this);
            this._netWork.setCloseHandler(this.onNetClose, this);
            this._netWork.setErrorHandler(this.onNetError, this);
        }

        public AccountLogin(account: string, pwd: string) {
            this._account = account;
            this._pwd = pwd;
            this._netWork.connect("localhost", "echo", 8080);
        }

        private onNetConnected() {
            if (this._netWork) {
                this._netWork.bind("Index.Login", this.onLogin, this);
                this._netWork.bind("Scene.Skill", this.onSkill, this);

                this._netWork.send("Index", "Login", { "name": this._account, "pwd": this._pwd });
            }
        }

        private onNetError() {
        }

        private onNetClose() {
        }

        private onLogin(data: any) {
            console.log("onLogin %s:%s:%s", data["name"], data["pwd"], data["ret"]);
        }

        private onSkill(data: any) {
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
        }


    }

}

