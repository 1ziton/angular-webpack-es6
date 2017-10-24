/**
 * Created by giscafer
 */
class DateFormatFilter{
    constructor($filter){
        "ngInject";
        return function(input,format){
            format=format?format:'yyyy-MM-dd HH:mm:ss';
            if(input instanceof Date){
                let formatStr=$filter('date')(input,format);
                return formatStr;
            }else if(input && input.indexOf("-")>0){
                if(input.indexOf('.')!=-1){
                    let e=input.indexOf('.');
                    input=input.substring(0,e);
                }
                let formatStr=$filter('date')(new Date(input.replace(/-/g,'/')),format);
                return formatStr;
            }else if(input && input.length >= 14){
                let y = input.substring(0,4) ;
                let mo = input.substring(4,6);
                let d = input.substring(6,8);
                let h = input.substring(8,10);
                let mi = input.substring(10,12);
                let s = input.substring(12,14);
                if(format=='yyyy-MM-dd'){
                    return y+"-"+mo+"-"+d;
                }
                return y+"-"+mo+"-"+d+" "+h+":"+mi+":"+s;
                
            } else {
                return "";
            }
        };
    }
    static filter($filter){
        "ngInject";
        return new DateFormatFilter($filter);
    }
}

export default DateFormatFilter;
