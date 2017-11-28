// TypeScript file

namespace tgame {

    // 获取帐号管理器
    export function GetMain(): AccountEnv {
        if (AccountEnv.instance == null) {
            var accEnv = new AccountEnv();
            return accEnv;

        }
        return AccountEnv.instance;
    }

    // AccountEnv 帐号环境
    export class AccountEnv {
        public static instance: AccountEnv = null;

        // 上层显示对象
        private rootDisplay: eui.UILayer;
        private horizScreen: boolean;

        // 基本配置
        public account: string; // 名称
        public pwd: string; // 密码
        public state: string; // 当前运行状态
        public stateData: any;// 当前运行状态附带数据

        // 网络连接
        public sceneConn: Network;// 场景网络连接
        public chatConn: Network; //聊天网络连接

        // 龙骨动画
        public factory: dragonBones.EgretFactory = new dragonBones.EgretFactory();

        // 窗口
        public loginDlg: tui.LoginDlg;// 登录窗口
        public tipMotoinDlg: tui.TipMotion;// 重力感应提示窗口
        public skillCtrlDlg: tui.SkillCtrlDlg;// 技能控制窗口
        public roleListDlg: tui.RoleListDlg;// 角色列表窗口

        // 大陆场景
        public _lands: tgame.LandView;
        // 重力加速度(垂直)
        public G: number = 0.6;

        // 临时使用
        private _lastObjID = 0; // 对象唯一增长ID


        // 构造函数
        constructor() {
            AccountEnv.instance = this;
            this.horizScreen = false;
            this.state = "初始化";

            this.sceneConn = new Network();
            this.sceneConn.setConnectHandler(this.onSceneNetConnected, this);
            this.sceneConn.setCloseHandler(this.onSceneNetClose, this);
            this.sceneConn.setErrorHandler(this.onSceneNetError, this);
        }


        // 是否横屏
        public IsHorizScreen(): boolean {
            return this.horizScreen;
        }

        // 设置根显示对象
        public SetRootDisplay(rootDisplay: eui.UILayer) {
            this.rootDisplay = rootDisplay;
        }

        // 获取主显示对象
        public GetRootDisplay(): eui.UILayer {
            return this.rootDisplay;
        }

        // 状态机
        public Update() {
            if (this._lands) {
                this._lands.Update();
            }

            dragonBones.WorldClock.clock.advanceTime(-1);
        }

        /**
          * 改变帐号环境状态
          * @param state {string} 状态名称
          * @param data {any} 状态附带数据 Json
          * @returns void
          */
        public ChangeState(state: string, data: any): void {
            switch (state) {
                case "帐号网络连接":
                    if (!this.sceneConn.isConnected()) {
                        this.sceneConn.connect(data["domain"], data["api"], data["port"]);
                        this.state = state;
                        this.stateData = data;
                    } else {
                        this.state = state;
                        this.stateData = data;
                        this.ChangeState("帐号登录", data);
                    }
                    break;
                case "帐号登录":
                    if (this.sceneConn.isConnected()) {
                        if (this.doAccountLogin(state, data)) {
                            this.state = state;
                            this.stateData = data;
                        }
                    } else {
                        this.ChangeState("帐号网络连接", data);
                    }
                    break;
                case "进入大厅":
                    this.ChangeState("游戏场景登录", data);
                    break;
                case "游戏场景登录":
                    this.OnCreated();
                    break;
            }
        }

        // 判断当前的状态
        public IsSceneState(state: string) {
            return this.state == state;
        }

        // do 帐号登录
        private doAccountLogin(state: string, data: any): boolean {
            // 当前呢
            let ret: boolean = false;
            switch (this.state) {
                case "帐号网络连接":
                case "初始化":
                    this.account = data["account"];
                    this.pwd = data["pwd"]
                    // 打开登录连接 发送登录消息
                    if (this.sceneConn) {
                        this.sceneConn.send("Index", "Login", data);
                        this.ChangeState("进入大厅", {});
                        this.OnActive();
                    }
                    ret = true;
                    break;
                case "游戏场景登录":
                    break;
            }

            return false;
        }

        // 加载龙骨动画到工厂
        public loadDragon(conf_json: string, texture_json: string, textur_img: string) {
            this.factory.parseDragonBonesData(RES.getRes(conf_json));
            this.factory.parseTextureAtlasData(RES.getRes(texture_json), RES.getRes(textur_img));
        }

        // 接触移动(鼠标或者触摸屏)
        public OnTouchMove(x: number, y: number) {
            if (this._lands) {
                this._lands._touchMove(x, y);
            }
        }

        // 接触(鼠标或者触摸屏)
        public OnTouchHandler(event: egret.TouchEvent): void {
            if (this._lands) {
                this._lands._touchHandler(event);
            }
        }

        // 键盘操作
        public OnKeyHandler(event: KeyboardEvent): void {
            if (this._lands) {
                this._lands._keyHandler(event);
            }
        }

        // 重力感应
        public OnMotion(event: egret.MotionEvent): void {
            if (this._lands) {
                this._lands.OnMotion(event);
            }
        }

        // 屏幕翻转
        public OnOrientationChange(horiz: boolean): void {
            if (this._lands) {
                this._lands.OnOrientationChange(horiz);
            }
        }

        /**
         * 临时账号环境初始化
         */
        public OnInited() {
            // 显示登录窗口
            if (this.loginDlg == null) {
                this.loginDlg = new tui.LoginDlg();
                this.loginDlg.InitNetworkProc();
                this.rootDisplay.addChild(this.loginDlg);
            }

            if (this.tipMotoinDlg == null) {
                this.tipMotoinDlg = new tui.TipMotion();
                this.tipMotoinDlg.x = 0;
                this.tipMotoinDlg.y = 0;
                this.tipMotoinDlg.visible = false;
                this.tipMotoinDlg.InitNetworkProc();
            }

            if (this.skillCtrlDlg == null) {
                this.skillCtrlDlg = new tui.SkillCtrlDlg();
                this.skillCtrlDlg.visible = false;
                this.skillCtrlDlg.InitNetworkProc();
            }

            if (this.roleListDlg == null) {
                this.roleListDlg = new tui.RoleListDlg();
                this.roleListDlg.visible = false;
                this.roleListDlg.InitNetworkProc();
            }
        }

        /**
         * 正式账号创建完成
         */
        public OnCreated() {
            this.loadDragon("CoreElement_json", "CoreElement_texture_1_json", "CoreElement_texture_1_png")

            let data = RES.getRes("land_json");
            this._lands = new LandView();
            this._lands.InitNetWorkProc();
            this._lands.LoadLand(data);
            this._lands.ShowLand(this.rootDisplay);

            if (this.tipMotoinDlg) {
                this.tipMotoinDlg.visible = true;
                this.rootDisplay.addChild(this.tipMotoinDlg);
            }

            if (this.skillCtrlDlg) {
                this.skillCtrlDlg.visible = true;
                this.rootDisplay.addChild(this.skillCtrlDlg);
                this.skillCtrlDlg.FirstShow();
            }

            if (this.roleListDlg) {
                this.roleListDlg.visible = true;
                this.rootDisplay.addChild(this.roleListDlg);
                this.roleListDlg.FirstShow();
            }
        }

        /**
         * 本账号为激活状态
         */
        public OnActive() {

        }

        /**
         * 本账户为后台状态
         */
        public OnDisActive() {

        }

        /**
         * 本账号被摧毁
         */
        public OnDestroy() {

        }

        /**
         * 网络状态处理
         */
        private onSceneNetConnected() {
            if (this.IsSceneState("帐号网络连接")) {
                this.ChangeState("帐号登录", this.stateData);
            }
        }

        private onSceneNetError() {
            if (this.IsSceneState("帐号网络连接")) {
                console.log("[W] 网络连接失败,[%s]失败", this.state);
            } else {
                console.log("[W] 网络连接失败,[%s]失败", this.state);
            }
        }

        private onSceneNetClose() {
            if (this.IsSceneState("帐号网络连接")) {
                console.log("[W] 网络连接关闭,[%s]失败", this.state);
            } else {
                console.log("[W] 网络连接关闭,[%s]失败", this.state);
            }
        }

        public TipMessage(m: string) {
            if (this.tipMotoinDlg) {
                this.tipMotoinDlg.setMessage(m);
            }
        }

        public SelfUseSkill(id: number) {
            if (this._lands && this._lands._player) {
                this._lands._player.SelfUseSkill(id);
            }
        }

        public MakeObjID(): number {
            this._lastObjID++;
            return this._lastObjID;
        }
    }
}