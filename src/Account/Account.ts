// TypeScript file

namespace tgame {
	// AccountEnv 帐号环境
	export class AccountEnv {
		// 基本配置
		public name: string; // 名称
		public pwd: string; // 密码
		public sceneState: string; // 当前运行状态
		public sceneStateData: any;// 当前运行状态附带数据

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
			this.sceneState = "初始化";

			this.sceneConn.setConnectHandler(this.onSceneNetConnected, this);
			this.sceneConn.setCloseHandler(this.onSceneNetClose, this);
			this.sceneConn.setErrorHandler(this.onSceneNetError, this);
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
		public ChangeSceneState(state: string, data: any): void {
			switch (state) {
				case "打开登录对话框":
					this.loginDlg = new LoginDlg(this);
					this.gameScene.addChild(this.loginDlg);
					break;
				case "等待输入帐号密码":
					break;
				case "帐号登录":
					if (this.sceneState == "等待输入帐号密码") {
						this.sceneConn.connect(data["domain"], data["api"], data["port"]);
					} else {
						console.log("[E] 呵呵了,暂时无法连接");
						return;
					}
					break;
				case "等待帐号登录连接":
					break;
				case "游戏场景登录":
					break;
				default:
					console.log("[E] 不支持这种状态切换 (%s)", state);
					return;
			}
			this.sceneState = state;
			this.sceneStateData = data;
		}


		private onSceneNetConnected() {
			if (this.sceneConn) {

				// this.sceneConn.bind("Scene.PlayerEnter", this.onPlayerEnter, this);
				// this.sceneConn.bind("Scene.PlayerLeave", this.onPlayerLeave, this);
				// this.sceneConn.bind("Scene.Skill", this.onSkill, this);

				// this.send("Index", "Login", { "account": this._account, "pwd": this._pwd, "pos_x": 0, "pos_y": 0 });
			}
		}

		private onSceneNetError() {
		}

		private onSceneNetClose() {
		}
	}
}