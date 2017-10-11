// TypeScript file

namespace tgame {
    // AccountEnv 帐号环境
    export class AccountEnv {
        // 上层显示对象
        private rootDisplay: eui.UILayer;

        // 基本配置
        public name: string; // 名称
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

        // 大陆场景
        public _lands: tgame.LandView;
        //
        public G: number = 0.6;


        // 构造函数
        constructor(rootDisplay: eui.UILayer) {
            this.rootDisplay = rootDisplay;
            this.state = "初始化";

            this.sceneConn = new Network();
            this.sceneConn.setConnectHandler(this.onSceneNetConnected, this);
            this.sceneConn.setCloseHandler(this.onSceneNetClose, this);
            this.sceneConn.setErrorHandler(this.onSceneNetError, this);
        }

        // 获取主显示对象
        public GetRootDisplay(): eui.UILayer {
            return this.rootDisplay;
        }

        // 状态机
        public Update() {
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
                    // this.sceneConn.connect("localhost", "echo", 8080);
                    if (!this.sceneConn.isConnected()) {
                        this.sceneConn.connect(data["demain"], data["api"], data["port"]);
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
                case "游戏场景登录":
                    break;
            }
        }

        public IsSceneState(state: string) {
            return this.state == state;
        }

        private doAccountLogin(state: string, data: any): boolean {
            // 当前呢
            let ret: boolean = false;
            switch (this.state) {
                case "初始化":
                    this.name = data["name"];
                    this.pwd = data["pwd"]
                    // 打开登录连接 发送登录消息
                    if (this.sceneConn) {
                        this.sceneConn.send("Index", "Login", data);
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
            // "CoreElement_json"
            // "CoreElement_texture_1_json"
            // "CoreElement_texture_1_png"
            this.factory.parseDragonBonesData(RES.getRes(conf_json));
            this.factory.parseTextureAtlasData(RES.getRes(texture_json), RES.getRes(textur_img));
        }

        public OnTouchMove(x: number, y: number) {
        }

        public OnTouchHandler(event: egret.TouchEvent): void {
        }

        public OnKeyHandler(event: KeyboardEvent): void {
        }

        public OnUpdateFrame(evt: egret.Event) {
            dragonBones.WorldClock.clock.advanceTime(-1);
        }

        /**
         * 临时账号环境初始化
         */
        public OnInited() {
            // 显示登录窗口
            if (this.loginDlg == null) {
                this.loginDlg = new tui.LoginDlg();
                this.rootDisplay.addChild(this.loginDlg);
            }
        }

        /**
         * 正式账号创建完成
         */
        public OnCreated(account: string, pwd: string) {

            let data = RES.getRes("land_json");
            this._lands = new tgame.LandView(this);
            this._lands.LoadLand(data);
            this._lands.ShowLand(this.rootDisplay);
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
                console.log("[W] 网络连接失败,[%s]失败",this.state);
            } else {
                console.log("[W] 网络连接失败,[%s]失败",this.state);
            }
        }

        private onSceneNetClose() {
          if (this.IsSceneState("帐号网络连接")) {
                console.log("[W] 网络连接关闭,[%s]失败",this.state);
            } else {
                console.log("[W] 网络连接关闭,[%s]失败",this.state);
            }
        }

    }
}