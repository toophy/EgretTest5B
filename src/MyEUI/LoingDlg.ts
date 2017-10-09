
class LoginDlg extends eui.Component {

	public accountEnv:tgame.AccountEnv;

	private Lgn_AccountID: eui.TextInput;
	private Lgn_AccountPwdID: eui.TextInput;
	private Lgn_EnterID: eui.Button;
	private Lgn_LeaveID: eui.Button;


	private gameMapContainer: tgame.GameMapContainer;

	constructor(aEnv:tgame.AccountEnv) {
		super();
		this.accountEnv = aEnv;
		this.skinName = "resource/assets/MainUI/LoginDlg/LoginDlg.exml";
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
	}

	public initNetMessage(){
		this.accountEnv.sceneConn.bind("Index.Login", this.onLogin, this);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	private uiCompHandler(): void {

		this.x = this.stage.stageWidth / 2 - this.skin.width / 2;
		this.y = this.stage.stageHeight / 2 - this.skin.height / 2;

		// 注册事件 : 点击登录按钮
		this.Lgn_EnterID.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
			this.startCreateSceneNew()
			this.visible = false;
		}, this);

		// 注册事件 : 点击离开按钮
		this.Lgn_LeaveID.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
			console.log("点击离开按钮");
			// this.visible = false;
		}, this);
	}

	/**
     *  创建场景界面
     * Create scene interface
     */
	protected startCreateSceneNew(): void {
		this.gameMapContainer = new tgame.GameMapContainer(this.parent);
		this.gameMapContainer.createScene();
		this.parent.addChild(this.gameMapContainer);
	}

	/**
	 * 网络消息处理 : 帐号登录
	 */
	public onLogin(data: any, ret: string, msg: string) {
		console.log("onLogin %s:%s:%s", data["account"], data["pwd"], ret);

		if (data["account"] == this._account) {
			if (!this._accountEasyAIs.has(data["account"])) {
				let easyAI = this.landView._base.AddRole(data["account"], data["pos_x"], data["pos_y"]);
				easyAI.enablePlayer(true);
				this._accountEasyAIs.add(data["account"], easyAI);
				this.landView._player.setAccount(this._account, easyAI);
			}
		}
	}
}