
class LoginDlg extends eui.Component {

	private static _instance: LoginDlg;

	public static getInstance(): LoginDlg {
		if (!LoginDlg._instance) {
			LoginDlg._instance = new LoginDlg();
		}
		return LoginDlg._instance
	}

	private Lgn_AccountID: eui.TextInput;
	private Lgn_AccountPwdID: eui.TextInput;
	private Lgn_EnterID: eui.Button;
	private Lgn_LeaveID: eui.Button;


    private gameMapContainer: tgame.GameMapContainer;

	constructor() {
		super();
		this.skinName = "resource/assets/MainUI/LoginDlg/LoginDlg.exml";
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
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
}