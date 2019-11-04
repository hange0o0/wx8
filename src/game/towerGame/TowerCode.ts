class TowerCode {
    private static instance:TowerCode;

    public static getInstance() {
        if (!this.instance) this.instance = new TowerCode();
        return this.instance;
    }


    public frameRate = 30   //PKTool.getStepByTime 也要改

    public actionStep = 0;
    public forceRate = 1;//塔的战力加成
    public monsterHPRate = 1;//怪物生成值加成



    public round = 1;
    public maxRound = 1;
    public totalMonsterNum = 1;
    public appearMonsterNum = 1;
    public maxStep = 1;
    public roundAutoMonster = []
    public totalAutoMonster = []





    public isStop = false
    public randomSeed = 99999999;
    public currentVO;

    public isSpeed = false
    public isPKing = false
    public wudiEnd = 0
    public rebornTime = 0

    private dataArr
    public astar


    public speedNum = 2//加速倍数

    public findTower = false;
    public findTowerTimes = 0;

    public isTest = 0;//1,设计，2，原创测试,3原创过关,4分享挑战

    public tempShowLevel//显示信息时依赖的玩家等级，要在显示前赋值


    public constructor(){
        this.dataArr = new GardenAStarModel()
        this.astar = new AStar(this.dataArr)
    }




    public random(seedIn?){
        var seed = seedIn || this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        if(!seedIn)
            this.randomSeed = rd * 100000000;
        return rd;
    }

    public getMonsterPosByPath(path){
        if(!path)
            return null
        return{
            x:path[0]*64+32,
            y:path[1]*64+32 + 20,
        }
    }





    //每一步执行
    public onStep(){
        this.actionStep ++;
        this.autoAction();//上怪
    }

    //自动出战上怪
    public autoAction(){
        if(this.roundAutoMonster.length == 0)//加入新的关卡
        {
            if(this.totalAutoMonster[0])
            {
                this.roundAutoMonster = this.totalAutoMonster.shift();
                this.round ++;
            }
        }

        if(this.roundAutoMonster[0] && this.roundAutoMonster[0].step <= this.actionStep)
        {
            var data = this.roundAutoMonster.shift();
            var mid = _get['mid'] || data.id;
            PKTowerUI.getInstance().addMonster(mid)
            this.appearMonsterNum ++
        }
    }




    public initData(levelVO){
        if(ZijieScreenBtn.e)
        {
            ZijieScreenBtn.e.init();
        }
        this.currentVO = levelVO
        this.isStop = false;
        this.actionStep = 0;
        this.rebornTime = 0;
        this.wudiEnd = 0
        this.roundAutoMonster.length = 0;
        this.totalAutoMonster = this.getLevelMonster(levelVO);
        this.monsterHPRate = 1;
        this.appearMonsterNum = 0
        this.forceRate = 1//PKManager.getInstance().getForceRate();
        console.log(this.totalAutoMonster)
        for(var s in HeroData.hDatas)
        {
            HeroData.hDatas[s].reset();
        }
    }


    public getLevelMonster(vo){
        var level = vo.id;
        this.randomSeed = level*1234567890;

        var roadNum = vo.roadNum
        var mvo:MonsterVO;
        var monsterList = [];
        var monsterLevelList = [];
        var monsterObj = {};//最多出2个
        var lastID = 0//不会相邻出
        for(var s in MonsterVO.data)
        {
            mvo = MonsterVO.data[s]
            if(mvo.level <= vo.id)
            {
                monsterLevelList.push(mvo)
                if(mvo.level == vo.id)
                {
                    lastID = mvo.id;
                    monsterObj[mvo.id] = (monsterObj[mvo.id] || 0) + 1
                    monsterList.push(mvo.id)
                }
            }
        }
        var roundNum = 5;
        while(monsterList.length < roundNum)
        {
            mvo = monsterLevelList[Math.floor(TC.random()*monsterList.length)]
            if(mvo.id == lastID)
                continue;
            if(monsterObj[mvo.id] && monsterObj[mvo.id] >= 2)
                continue;
            monsterList.push(mvo.id);
            lastID = mvo.id;
            monsterObj[mvo.id] = (monsterObj[mvo.id] || 0) + 1
        }


        var returnArr = []

        this.maxRound = monsterList.length;
        this.round = 0;
        this.totalMonsterNum = 0;
        var step = 10

        var roadIndex = 0;
        var maxCost = 1000 * Math.pow(1.005,level)
        var roundTimeStep = 30*15 + Math.floor(Math.pow(level,1.1))

        while(monsterList.length > 0)
        {
            mvo = MonsterVO.getObject(monsterList.shift())

            var roadRandom = roadIndex == roadNum;
            if(roadRandom)
                roadIndex = 0

            var list = [];
            returnArr.push(list);

            var num = Math.round(maxCost/mvo.cost);
            var stepAdd = Math.ceil(roundTimeStep/num);
            var maxStepAdd = Math.round((8 - 4*(level/1000))*30)
            if(stepAdd > maxStepAdd)
                stepAdd = maxStepAdd;


            if(level == 1 && stepAdd < 10)
                stepAdd = 10
            else  if(stepAdd < 5)
                stepAdd = 5

            while(num > 0)
            {
                num --;
                list.push({
                    id:mvo.id,
                    step:step,
                    road:roadIndex,
                    })
                step += stepAdd;
                if(roadRandom)
                {
                    roadIndex ++;
                    if(roadIndex >= roadNum)
                        roadIndex = 0;
                }
                this.totalMonsterNum ++;
            }
            step += 3*30;//两波怪之间的间隔
            roadIndex ++;
            if(roadRandom)
                roadIndex = 0;

        }

        this.maxStep = step + 30;
        return returnArr
    }


    //返回一条路
    public findPath(arr)
    {
        this.dataArr.reset();
        var startPos = [];
        var endPos = []
        for(var i=0;i<arr.length;i++)
        {
            for(var j=0;j<arr[i].length;j++)
            {
                var type = arr[i][j]
                if(type == 5)
                    startPos.push({x:j,y:i});
                if(type == 6)
                    endPos.push({x:j,y:i});
                if(type == 1 || type == 4 || type == 5 || type == 6 || type == 7)
                    this.dataArr.setOK(i,j)
            }
        }
        if(startPos.length == 0)
            return null
        if(endPos.length == 0)
            return null
        var results = []
        for(var i=0;i<startPos.length;i++)
        {
            //找最近一条路
            var endPath:any = null;
            for(var j=0;j<endPos.length;j++)
            {
                var path = this.astar.find(startPos[i].x, startPos[i].y, endPos[j].x, endPos[j].y)
                if(path)
                {
                    if(!endPath || endPath.length > path.length)
                        endPath = path;
                }
            }
            results.push(endPath)
        }
        return results;
    }

    public resetWalkArr(walkArr){
        for (var i = 2; i < walkArr.length; i++) {
            var o1 = walkArr[i - 2];
            var o2 = walkArr[i - 1];
            var o3 = walkArr[i];
            if (o1[0] == o2[0] && o2[0] == o3[0]) {
                walkArr.splice(i - 1, 1)
                i--;
                continue;
            }
            if (o1[1] == o2[1] && o2[1] == o3[1]) {
                walkArr.splice(i - 1, 1)
                i--;
                continue;
            }
        }
        return walkArr
    }

    public showLight(from,to){
        var mv = MovieSimpleSpirMC.create();
        var arr = [];
        for(var i=1;i<=3;i++)
        {
            arr.push( 'arc_' + i + '_png')
        }

        mv.setData(arr,84)
        mv.once('complete',()=>{
            mv.dispose();
        },this)
        mv.gotoAndPay(0,1)

        mv.icon.fillMode = 'repeat'
        mv.icon.width = MyTool.getDis(from,to);
        mv.anchorOffsetY = 35/2
        mv.anchorOffsetX = 0
        PKTowerUI.getInstance().addToTopCon(mv);
        mv.x = from.x
        mv.y = from.y

        var angle = Math.atan2(to.y-from.y,to.x-from.x)
        mv.rotation = angle/Math.PI*180
    }
}