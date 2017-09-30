// TypeScript file

namespace tgame {
    // AccountEnv 帐号环境
    export class AccountEnv {
        // 基本配置
        public name: string; // 名称
        public pwd: string; // 密码
        public state: string; // 当前运行状态
        public stateData: any;// 当前运行状态附带数据

        // 网络连接
        public sceneConn: Network;// 场景网络连接
        public chatConn: Network; //聊天网络连接

        // 窗口
        public loginDlg: LoginDlg;// 登录窗口

        // 游戏场景
        public gameScene: GameMapContainer; // 主场景

        // 构造函数
        constructor(name: string, pwd: string) {
            this.name = name;
            this.pwd = pwd;
            this.state = "初始化";
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
                case "帐号登录":
                    // 当前是 "初始化", "游戏场景登录", ... 做不同的处理
                    break;
                case "游戏场景登录":
                    break;
            }
            this.state = state;
            this.stateData = data;
        }
    }
}