// TypeScript file

namespace tgame {

    export class LandBase {

        private up_height: number = 240;
        private up2_height: number = 100;
        private middle_height: number = 200;
        private down_height: number = 100;

        private cnfs: CnfLand;
        private citySprite: Array<egret.Sprite> = [];

        private landView: LandView = null;

        public _viewPos: egret.Point = new egret.Point();
        private _targetViewPos: egret.Point = new egret.Point();
        private _targetViewSpeed: number = 0.1;
        private _targetViewRun: boolean = false;

        public constructor(l: LandView) {
            this.landView = l;
        }

        public AddActor(name: string, x: number, y: number): EasyAI {

            let tmpActor: Mecha = new Mecha();
            tmpActor.setName(name);
            tmpActor.setParent(this.landView, this.citySprite[2], x, y);
            tmpActor.setMoveRange(3 * 1136, 640);
            this.landView.AddActor(tmpActor);

            let tmpActorAI: EasyAI = new EasyAI();
            tmpActorAI.setActor(tmpActor);
            this.landView.AddEasyAI(tmpActorAI);

            return tmpActorAI;
        }

        public SetTargetViewPos(p: egret.Point) {
            let distance: number = egret.Point.distance(this._targetViewPos, p);
            if (distance > 1.0) {
                this._targetViewRun = true;
                this._targetViewPos.x = p.x;
                this._targetViewPos.y = p.y;
                this._targetViewPos.y = this._viewPos.y;
                let speed: number = 5;
                if (distance > 30)
                    speed = 100;
                if (this._viewPos.x <= this._targetViewPos.x) {
                    this._targetViewSpeed = speed;
                } else {
                    this._targetViewSpeed = -speed;
                }
            }
        }

        public ScrollLand() {
            if (!this._targetViewRun) {
                return;
            }

            if (egret.Point.distance(this._targetViewPos, this._viewPos) > Math.abs(this._targetViewSpeed)) {
                let oldx: number = this._viewPos.x;
                this._viewPos.x = oldx + this._targetViewSpeed;
                for (let i = 0; i < this.citySprite.length; ++i) {
                    this.citySprite[i].x += (oldx - this._viewPos.x);
                }
            } else {
                this._targetViewRun = false;
                let oldx: number = this._viewPos.x;
                this._viewPos.x = this._targetViewPos.x;
                for (let i = 0; i < this.citySprite.length; ++i) {
                    this.citySprite[i].x += (oldx - this._viewPos.x);
                }
            }
        }

        private loadCityEx(row: number, y: number, height: number) {
            let cts: egret.Sprite = new egret.Sprite();
            cts.x = 0;
            cts.y = y;
            this.citySprite.push(cts);

            let i: number = 0;
            for (let p in this.cnfs.citys) {
                if (this.cnfs.citys[p] != null) {
                    let cityRow: CnfCityRow = null;
                    switch (row) {
                        case 0:
                            cityRow = this.cnfs.citys[p].up;
                            break;
                        case 1:
                            cityRow = this.cnfs.citys[p].up2;
                            break;
                        case 2:
                            cityRow = this.cnfs.citys[p].middle;
                            break;
                        case 3:
                            cityRow = this.cnfs.citys[p].down;
                            break;
                    }
                    if (cityRow != null)
                        this.LoadCityRow(cts, cityRow, i * 1136, 0, 1136, height);
                }
                ++i;
            }

            i = 0;
            for (let p in this.cnfs.citys) {
                if (this.cnfs.builds[p] != null) {
                    let cityRow: CnfBuildRow[] = null;
                    switch (row) {
                        case 0:
                            cityRow = this.cnfs.builds[p].up;
                            break;
                        case 1:
                            cityRow = this.cnfs.builds[p].up2;
                            break;
                        case 2:
                            cityRow = this.cnfs.builds[p].middle;
                            break;
                        case 3:
                            cityRow = this.cnfs.builds[p].down;
                            break;
                    }
                    if (cityRow != null)
                        this.LoadCityBuild(cts, cityRow, i * 1136, 0, 1136, height);
                }
                ++i;
            }

            i = 0;
            for (let p in this.cnfs.citys) {
                if (this.cnfs.actors[p] != null) {
                    let cityRow: CnfActorRow[] = null;
                    switch (row) {
                        case 0:
                            cityRow = this.cnfs.actors[p].up;
                            break;
                        case 1:
                            cityRow = this.cnfs.actors[p].up2;
                            break;
                        case 2:
                            cityRow = this.cnfs.actors[p].middle;
                            break;
                        case 3:
                            cityRow = this.cnfs.actors[p].down;
                            break;
                    }
                    if (cityRow != null)
                        this.LoadCityActor(cts, cityRow, i * 1136, 0, 1136, height);
                }
                ++i;
            }
        }

        public LoadLand(jsonData: any) {
            this.cnfs = <CnfLand>jsonData;
            this.loadCityEx(0, 0, this.up_height);
            this.loadCityEx(1, this.up_height, this.up2_height);
            this.loadCityEx(2, this.up_height + this.up2_height, this.middle_height);
            this.loadCityEx(3, this.up_height + this.up2_height + this.middle_height, this.down_height);

            this._viewPos.setTo(1136 / 2, 640 / 2);
        }

        public ShowLand(s: egret.Sprite) {
            for (let i = 0; i < this.citySprite.length; ++i) {
                s.addChild(this.citySprite[i]);
            }
        }


        private LoadCityRow(cts: egret.Sprite, ctr: CnfCityRow, x: number, y: number, w: number, h: number) {
            if (ctr == null || cts == null) {
                return;
            }

            if (ctr.type == "shape") {
                let bg: egret.Shape = new egret.Shape();
                bg.graphics.beginFill(ctr.data.color, 100);
                bg.graphics.drawRect(0, 0, ctr.data.width, ctr.data.height);
                bg.graphics.endFill();
                bg.width = w;
                bg.height = h;
                bg.x = x;
                bg.y = y;
                cts.addChild(bg);
            } else if (ctr.type == "image") {
                let bg4: egret.Bitmap = new egret.Bitmap(RES.getRes(ctr.data.res));
                bg4.width = w;
                bg4.height = h;
                bg4.x = x;
                bg4.y = y;
                cts.addChild(bg4);
            }
        }

        private LoadCityBuild(cts: egret.Sprite, ctr: Array<CnfBuildRow>, x: number, y: number, w: number, h: number) {
            if (ctr == null || cts == null) {
                return;
            }

            for (let i in ctr) {
                let lc = ctr[i]

                if (lc.type == "shape") {
                    let bg: egret.Shape = new egret.Shape();
                    bg.graphics.beginFill(lc.data.color, 100);
                    bg.graphics.drawRect(0, 0, lc.data.width, lc.data.height);
                    bg.graphics.endFill();
                    bg.x = x + lc.data.x;
                    bg.y = y + lc.data.y;
                    cts.addChild(bg);
                } else if (lc.type == "image") {
                    let bg4: egret.Bitmap = new egret.Bitmap(RES.getRes(lc.data.res));
                    bg4.x = x + lc.data.x;
                    bg4.y = y + lc.data.y;
                    cts.addChild(bg4);
                } else if (lc.type == "animation") {
                    let tmpActor: Mecha = new Mecha();
                    tmpActor.setParent(this.landView, cts, x + lc.data.x, y + lc.data.y);
                    tmpActor.setMoveRange(3 * 1136, 640);
                    this.landView.AddActor(tmpActor);
                }
            }
        }

        private LoadCityActor(cts: egret.Sprite, ctr: Array<CnfActorRow>, x: number, y: number, w: number, h: number) {
            if (ctr == null || cts == null) {
                return;
            }

            for (let i in ctr) {
                let lc = ctr[i]

                if (lc.type == "shape") {
                    let bg: egret.Shape = new egret.Shape();
                    bg.graphics.beginFill(lc.data.color, 100);
                    bg.graphics.drawRect(0, 0, lc.data.width, lc.data.height);
                    bg.graphics.endFill();
                    bg.x = x + lc.data.x;
                    bg.y = y + lc.data.y;
                    cts.addChild(bg);
                } else if (lc.type == "image") {
                    let bg4: egret.Bitmap = new egret.Bitmap(RES.getRes(lc.data.res));
                    bg4.x = x + lc.data.x;
                    bg4.y = y + lc.data.y;
                    cts.addChild(bg4);
                } else if (lc.type == "animation") {
                    let tmpActor: Mecha = new Mecha();
                    tmpActor.setName(lc.data.name);
                    tmpActor.setParent(this.landView, cts, x + lc.data.x, y + lc.data.y);
                    tmpActor.setMoveRange(3 * 1136, 640);
                    this.landView.AddActor(tmpActor);

                    let tmpActorAI: EasyAI = new EasyAI();
                    tmpActorAI.setActor(tmpActor);
                    this.landView.AddEasyAI(tmpActorAI);
                }
            }
        }
    }
}
