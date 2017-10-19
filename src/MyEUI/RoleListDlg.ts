namespace tui {

	export class RoleListDlg extends eui.Component {

		private accountEnv: tgame.AccountEnv;

		private RoleList: eui.List;
		private Title: eui.Label;
		private YourName: eui.Label;

		constructor(accountEnv: tgame.AccountEnv) {
			super();
			this.skinName = "resource/assets/MainUI/BattlefieldDlg/RoleListDlg.exml";
			this.accountEnv = accountEnv;
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
			this.y = 10;

			/// 填充数据
			var dsListHeros: Array<Object> = [
				{ "order": "1", "name": "犯贱", "score": "100" },
				{ "order": "2", "name": "不走水", "score": "90" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" },
				{ "order": "", "name": "", "score": "" }
			];
			this.RoleList.dataProvider = new eui.ArrayCollection(dsListHeros);

			this.RoleList.itemRenderer = tui.RoleListItem;
			this.RoleList.scrollEnabled = false;
		}
	}


	export class RoleListItem extends eui.ItemRenderer {

		constructor() {
			super();
			this.skinName = "resource/assets/MainUI/BattlefieldDlg/RoleListItem.exml";
			this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		private uiCompHandler(): void {
		}

		protected dataChanged(): void {
		}
	}
}