class GunVO {
    public static dataKey = 'gun';
    public static key = 'id';
    public static getObject(id): GunVO{ //id有可能带\n or \r
        return CM_wx4.table[this.dataKey][Math.floor(id)];
    }
    public static get data(){
        return CM_wx4.table[this.dataKey]
    }


    public id: number;
    public name: string;
    public level: number;
    public atk: number;
    public atkspeed: number;
    public atkdis: number;

    public des1: string;
    public cd: number;
    public mp: number;
    public mpcost: number;
    public v1: number;
    public v1up: number;
    public v2: number;
    public v2up: number;

    public des3: string;
    public energy: number;
    public v3: number;
    public v3up: number;
    public v4: number;
    public v4up: number;


    public constructor() {

    }

    public reInit(){
        var temp = (this.v1 + '').split('#')
        this.v1 = parseFloat(temp[0]);
        this.v1up = parseFloat(temp[1]) || 0;

        temp = (this.v2 + '').split('#')
        this.v2 = parseFloat(temp[0]);
        this.v2up = parseFloat(temp[1]) || 0;

        temp = (this.v3 + '').split('#')
        this.v3 = parseFloat(temp[0]);
        this.v3up = parseFloat(temp[1]) || 0;

        temp = (this.v4 + '').split('#')
        this.v4 = parseFloat(temp[0]);
        this.v4up = parseFloat(temp[1]) || 0;
    }

    public getThumb(){
        return 'thum_'+this.id+'_png'
    }

    public getUrl(){
        return 'knife_'+this.id+'_png'
    }

    public getDes1(){

    }

    public getDes2(){

    }

    public getSkillValue(index,level=-1){
        if(level == -1)
            level = PKManager.getInstance().getHeroLevel(this.id);
        return this['v' + index] + this['v' + index + 'up']*level;
    }


}