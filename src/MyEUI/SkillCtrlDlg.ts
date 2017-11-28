namespace tui {

	export class SkillCtrlDlg extends eui.Component {

		private Skill_XID: eui.Button;
		private Skill_CID: eui.Button;
		private Skill_BID: eui.Button;
		private Skill_AID: eui.Button;

		constructor() {
			super();
			this.skinName = "resource/assets/MainUI/BattlefieldDlg/SkillCtrlDlg.exml";
			this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		}

		public InitNetworkProc() {
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		private uiCompHandler(): void {
		}

		public FirstShow() {

			this.x = this.stage.stageWidth - this.skin.width;
			this.y = this.stage.stageHeight - this.skin.height;

			// 注册事件 : 点击登录按钮
			this.Skill_XID.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (event: egret.TouchEvent) => {
				this.UseSkill(0);
			}, this);
			this.Skill_XID.addEventListener(egret.TouchEvent.TOUCH_END, (event: egret.TouchEvent) => {
				this.UseSkill(-1);
			}, this);

			// 注册事件 : 点击离开按钮
			this.Skill_AID.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (event: egret.TouchEvent) => {
				this.UseSkill(1);
			}, this);
			this.Skill_AID.addEventListener(egret.TouchEvent.TOUCH_END, (event: egret.TouchEvent) => {
				this.UseSkill(-1);
			}, this);

			// 注册事件 : 点击离开按钮
			this.Skill_BID.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (event: egret.TouchEvent) => {
				this.UseSkill(2);
			}, this);
			this.Skill_BID.addEventListener(egret.TouchEvent.TOUCH_END, (event: egret.TouchEvent) => {
				this.UseSkill(-1);
			}, this);

			// 注册事件 : 点击离开按钮
			this.Skill_CID.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (event: egret.TouchEvent) => {
				this.UseSkill(3);
			}, this);
			this.Skill_CID.addEventListener(egret.TouchEvent.TOUCH_END, (event: egret.TouchEvent) => {
				this.UseSkill(-1);
			}, this);
		}

		public UseSkill(id: number) {
			tgame.GetMain().SelfUseSkill(id);
		}
	}
}