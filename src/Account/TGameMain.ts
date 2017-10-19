// TypeScript file
namespace tgame {

    // 获取帐号管理器
    export function GetMain(): Main {
        if (Main.instance == null) {
            return new Main();
        }
        return Main.instance;
    }

    // 帐号管理器
    export class Main {
        public static instance: Main = null;
        public accountEnvs: MapStr<tgame.AccountEnv> = new MapStr<tgame.AccountEnv>();
        public currAccountEnv: tgame.AccountEnv = null;
        private tmpAccountEnv: tgame.AccountEnv = null;
        private rootDisplay: eui.UILayer = null;
        private horizScreen: boolean;

        constructor() {
            Main.instance = this;
            this.horizScreen = false;
        }

        // 是否横屏
        public IsHorizScreen(): boolean {
            return this.horizScreen;
        }

        // 设置根显示对象
        public SetRootDisplay(rootDisplay: eui.UILayer) {
            this.rootDisplay = rootDisplay;
        }

        // 获取根显示对象
        public GetRootDisplay(): eui.UILayer {
            return this.rootDisplay;
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
        public MakeTmpAccountEnv(): void {
            if (this.tmpAccountEnv != null) {
                return;
            }

            // 临时账号
            if (this.currAccountEnv != this.tmpAccountEnv && this.currAccountEnv != null) {
                this.currAccountEnv.OnDisActive();
                this.currAccountEnv = null;
            }
            this.tmpAccountEnv = new tgame.AccountEnv(this.rootDisplay);
            this.currAccountEnv = this.tmpAccountEnv;
            this.currAccountEnv.OnInited();
            this.currAccountEnv.OnActive();
        }

        // 当前的临时账号转换为正式账号
        public AddAccount(account: string, pwd: string): void {
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

        // 删除帐号
        public DelAccount(account: string): void {
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

        // 设置当前观察的帐号
        public SetCurrAccount(account: string): void {
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


        // 状态机
        public Update(): void {
            for (let i in this.accountEnvs.items) {
                this.accountEnvs.items[i].Update()
            }

            dragonBones.WorldClock.clock.advanceTime(-1);
        }

        // 接触移动(鼠标或者触摸屏)
        public OnTouchMove(x: number, y: number): void {
            if (this.currAccountEnv) {
                this.currAccountEnv.OnTouchMove(x, y);
            }
        }

        // 接触(鼠标或者触摸屏)
        public OnTouchHandler(event: egret.TouchEvent): void {
            if (this.currAccountEnv) {
                this.currAccountEnv.OnTouchHandler(event);
            }
        }

        // 键盘操作
        public OnKeyHandler(event: KeyboardEvent): void {
            if (this.currAccountEnv) {
                this.currAccountEnv.OnKeyHandler(event);
            }
        }

        // 重力感应
        public OnMotion(event: egret.MotionEvent): void {
            if (this.currAccountEnv) {
                this.currAccountEnv.OnMotion(event);
            }
        }

        // 屏幕翻转
        public OnOrientationChange(horiz: boolean): void {
            this.horizScreen = horiz;
            if (this.currAccountEnv) {
                this.currAccountEnv.OnOrientationChange(horiz);
            }
        }
    }

}