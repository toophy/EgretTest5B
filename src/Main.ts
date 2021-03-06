//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {

	private loadingView: LoadingUI;
	private isThemeLoadEnd: boolean = false;

	public static instance: Main = null;
	constructor() {
		super();
		Main.instance = this;
	}

    /**
     * 创建场景
     */
	private createScene() {
		if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
			let onTouchMove = egret.sys.TouchHandler.prototype.onTouchMove;
			egret.sys.TouchHandler.prototype.onTouchMove = function (x: number, y: number, touchPointID: number): void {
				onTouchMove.call(this, x, y, touchPointID);
				tgame.GetMain().OnTouchMove(x, y);
			}

			var motion = new egret.Motion();
			motion.addEventListener(egret.Event.CHANGE, this.onMotion, this);
			motion.start();

			this.touchEnabled = true;
			this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
			this.addEventListener(egret.TouchEvent.TOUCH_END, this._touchHandler, this);

			document.addEventListener("keydown", this._keyHandler);
			document.addEventListener("keyup", this._keyHandler);

			window.addEventListener("orientationchange", this._orientationchange);

			// 临时账号--账号登录窗口
			tgame.GetMain().SetRootDisplay(this);
			tgame.GetMain().MakeTmpAccountEnv();
		}
	}

	private _touchHandler(event: egret.TouchEvent): void {
		tgame.GetMain().OnTouchHandler(event);
	}

	private _keyHandler(event: KeyboardEvent): void {
		tgame.GetMain().OnKeyHandler(event);
	}

	private onUpdateFrame(evt: egret.Event): void {
		tgame.GetMain().Update();
	}

	private onMotion(e: egret.MotionEvent): void {
		tgame.GetMain().OnMotion(e);
	}

	private _orientationchange(e: Event): void {
		if (window.orientation == 180 || window.orientation == 0) {
			tgame.GetMain().OnOrientationChange(false);
		}
		if (window.orientation == 90 || window.orientation == -90) {
			tgame.GetMain().OnOrientationChange(true);
		}
	}


    /**
     * 加载进度界面
     * loading process interface
     */

	protected createChildren(): void {
		super.createChildren();

		egret.lifecycle.addLifecycleListener((context) => {
			// custom lifecycle plugin
		})

		// egret.lifecycle.onPause = () => {
		//     egret.ticker.pause();
		// }

		// egret.lifecycle.onResume = () => {
		//     egret.ticker.resume();
		// }

		//inject the custom material parser
		//注入自定义的素材解析器
		let assetAdapter = new AssetAdapter();
		egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
		egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
		//Config loading process interface
		//设置加载进度界面
		this.loadingView = new LoadingUI();
		this.stage.addChild(this.loadingView);
		// initialize the Resource loading library
		//初始化Resource资源加载库
		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.loadConfig("resource/default.res.json", "resource/");
	}
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
	private onConfigComplete(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		// load skin theme configuration file, you can manually modify the file. And replace the default skin.
		//加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
		let theme = new eui.Theme("resource/default.thm.json", this.stage);
		theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		RES.loadGroup("preload");
	}

    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
	private onThemeLoadComplete(): void {
		this.isThemeLoadEnd = true;
		this.createScene();
	}
	private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
	private onResourceLoadComplete(event: RES.ResourceEvent): void {
		if (event.groupName == "preload") {
			this.stage.removeChild(this.loadingView);
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
			this.isResourceLoadEnd = true;
			this.createScene();
		}
	}

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
	private onItemLoadError(event: RES.ResourceEvent): void {
		console.warn("Url:" + event.resItem.url + " has failed to load");
	}
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
	private onResourceLoadError(event: RES.ResourceEvent): void {
		//TODO
		console.warn("Group:" + event.groupName + " has failed to load");
		//忽略加载失败的项目
		//ignore loading failed projects
		this.onResourceLoadComplete(event);
	}
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
	private onResourceProgress(event: RES.ResourceEvent): void {
		if (event.groupName == "preload") {
			this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
		}
	}

}
