// TypeScript file
namespace tgame {
    export class AccountManage {
        public static instance: AccountManage = null;
        public accountEnvs: MapStr<tgame.AccountEnv> = new MapStr<tgame.AccountEnv>();
        public currAccountEnv: tgame.AccountEnv = null;
        private tmpAccountEnv: tgame.AccountEnv = null;

        constructor() {
            AccountManage.instance = this;
        }

        // 获取当前焦点账号环境
        public GetCurrent(): AccountEnv {
            return this.currAccountEnv;
        }

        // 获取临时账号环境(只有一个)
        public GetTemp(): AccountEnv {
            return this.tmpAccountEnv;
        }

        // 制作临时登录环境(登录窗口)
        public MakeTmpAccountEnv(rootDisplay: eui.UILayer) {
            if (this.tmpAccountEnv != null) {
                return;
            }

            // 临时账号
            if (this.currAccountEnv != this.tmpAccountEnv && this.currAccountEnv != null) {
                this.currAccountEnv.OnDisActive();
                this.currAccountEnv = null;
            }
            this.tmpAccountEnv = new tgame.AccountEnv(rootDisplay);
            this.currAccountEnv = this.tmpAccountEnv;
            this.currAccountEnv.OnInited();
            this.currAccountEnv.OnActive();
        }

        // 当前的临时账号转换为正式账号
        public AddAccount(account: string, pwd: string) {
            if (!this.accountEnvs.has(account)) {
                if (this.tmpAccountEnv == null) {
                    return;
                }

                this.tmpAccountEnv.ChangeState("进入大厅", {});
                this.accountEnvs.add(account, this.tmpAccountEnv);
                this.tmpAccountEnv = null;
            } else {
                console.log("[W] 账号[%s]已经登录", account);
            }
        }

        public DelAccount(account: string) {
            if (this.accountEnvs.has(account)) {
                let tmpAccount = this.accountEnvs.get(account);
                tmpAccount.OnDisActive();
                tmpAccount.OnDestroy();
                this.accountEnvs.del(account);

                if (this.currAccountEnv == tmpAccount) {
                    this.currAccountEnv = null;
                    if (this.accountEnvs.getCount() > 0) {
                        for (let i in this.accountEnvs.items) {
                            this.currAccountEnv = this.accountEnvs.items[i]
                            this.currAccountEnv.OnActive();
                            break;
                        }
                    }
                }
            } else {
                console.log("[W] 账号[%s]没有登录", account);
            }
        }

        public SetCurrAccount(account: string) {
            if (this.accountEnvs.has(account)) {
                if (this.currAccountEnv) {
                    this.currAccountEnv.OnDisActive();
                }
                this.currAccountEnv = this.accountEnvs.get(account);
                this.currAccountEnv.OnActive();
            } else {
                console.log("[W] 账号[%s]没有登录", account);
            }
        }

    }
}