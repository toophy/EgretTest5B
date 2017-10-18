
namespace tui {
	export class TipMotion extends eui.Component {

		private accountEnv: tgame.AccountEnv;

		private Tip_Message: eui.Label;

		constructor(accountEnv: tgame.AccountEnv) {
			super();
			this.skinName = "resource/assets/MainUI/BattlefieldDlg/TipMotion.exml";
			this.accountEnv = accountEnv;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public InitNetworkProc() {

		}

		// public setMotion(x: number, y: number, z: number) {
		// 	this.Tip_MotionX.text = x ? x.toFixed(3) : "0.000";
		// 	this.Tip_MotionY.text = y ? y.toFixed(3) : "0.000";
		// 	this.Tip_MotionZ.text = z ? z.toFixed(3) : "0.000";
		// }

		public setMessage(m:string){
			this.Tip_Message.text = m;
		}
	}
}