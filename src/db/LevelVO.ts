class LevelVO {
    public static dataKey = 'level';
    public static key = 'id';
    public static getObject(id): LevelVO{ //id有可能带\n or \r
        return CM_wx4.table[this.dataKey][Math.floor(id)];
    }
    public static get data(){
        return CM_wx4.table[this.dataKey]
    }

    private static _list
    public static get list(){
        if(!this._list)
            this._list = ObjectUtil_wx4.objToArray(this.data);
        return this._list;
    }

    public static clear(){
        this._list = null;
        delete CM_wx4.table[this.dataKey]
    }


    public id: number;
    public width: number;
    public height: number;
    public roadArr: string;
    public data: string;


    public roadPos = []
    public constructor() {

    }


    public reInit(){
        this.reset();
    }

    public reset(){
        this.roadPos.length = 0;

        var arr = this.roadArr.split(',')
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].split('_')
            this.roadPos.push([parseInt(temp[0]),parseInt(temp[1])])
        }
    }



    public getRoadData(){
        var str = this.data
        var arr = str.split('');
        var resultData = [];
        for(var i=0;i<this.height;i++)
        {
            resultData.push(arr.slice(i*this.width,(i+1)*this.width))
        }
        return resultData
    }
}