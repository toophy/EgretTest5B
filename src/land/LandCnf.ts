// TypeScript file

namespace tgame {

    // 岛屿上分块
    export class IslandUpBlock {
        public backGround: string;  // 背景

        public constructor() {
        }
    }

    // 岛屿中分块
    export class IslandMiddleBlock {
        public backGround: string;  // 背景

        public constructor() {
        }
    }

    // 岛屿下分块
    export class IslandDownBlock {
        public backGround: string;  // 背景

        public constructor() {
        }
    }

    // 岛屿
    export class Island {
        private _masterID: number;                  // 主人ID
        private _islandID: number;                  // 岛屿ID
        private _version: number;                   // 版本
        private _name: string;                      // 岛屿名称
        private _upBlock: IslandUpBlock;            // 岛屿上分块
        private _middleBlock: IslandMiddleBlock;    // 岛屿中分块
        private _downBlock: IslandDownBlock;        // 岛屿下分块

        public constructor() {
        }
    }

    // 陆地配置
    export class LandConfig {
        private _masterID: number;                  // 主人ID
        private _landID: number;                    // 陆地ID
        private _version: number;                   // 版本
        private _islandIndex: MapNum<Island>;       // 岛屿(索引ID)
        private _islandName: MapStr<Island>;        // 岛屿(索引名称)
        private _islandSort: MapNum<number>;        // 岛屿排序(索引岛屿显示顺序,从左向右,从1开始)
        private _islandWidth: number;               // 岛屿宽
        private _islandUpHeight: number;            // 岛屿上分块高
        private _islandMiddleHeight: number;        // 岛屿中分块高
        private _islandDownHeight: number;          // 岛屿下分块高

        public constructor() {
        }
    }

    // 行
    export class CnfRowBlock {
        public shape: string;
        public color: number;
        public res: string;
        public width: number;
        public height: number;
    }

    export class CnfCityRow {
        public type: string;
        public data: CnfRowBlock;
    }

    export class CnfCity {
        public id: number;
        public sort: number;
        public master: string;
        public up: CnfCityRow;
        public up2: CnfCityRow;
        public middle: CnfCityRow;
        public down: CnfCityRow;
    }

    // 建筑
    export class CnfBuildBlock {
        public shape: string;
        public color: number;
        public res: string;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
    }

    export class CnfBuildRow {
        public type: string;
        public data: CnfBuildBlock;
    }

    export class CnfBuild {
        public id: number;
        public sort: number;
        public master: string;
        public up: Array<CnfBuildRow>;
        public up2: Array<CnfBuildRow>;
        public middle: Array<CnfBuildRow>;
        public down: Array<CnfBuildRow>;
    }

    // 演员
    export class CnfActorBlock {
        public name: string;
        public shape: string;
        public color: number;
        public res: string;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
    }

    export class CnfActorRow {
        public type: string;
        public data: CnfActorBlock;
    }

    export class CnfActor {
        public id: number;
        public sort: number;
        public master: string;
        public up: Array<CnfActorRow>;
        public up2: Array<CnfActorRow>;
        public middle: Array<CnfActorRow>;
        public down: Array<CnfActorRow>;
    }

    export class CnfLand {
        public citys: { [key: string]: CnfCity };
        public builds: { [key: string]: CnfBuild };
        public actors: { [key: string]: CnfActor };
    }
}

