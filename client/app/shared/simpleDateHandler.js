//import moment from './../node_modules/moment/moment';
import moment from 'moment';

const DateHandler = () =>{

	const isEqual = (day1, day2)=>{
		var date1 = new Date(day1.toString());
		var date2 = new Date(day2.toString());
		var d1 = date1.getUTCDate();
		var d2 = date2.getUTCDate();
		var y1 = date1.getUTCFullYear();
		var y2 = date2.getUTCFullYear();
		var m1 = date1.getUTCMonth();
	    var m2 = date2.getUTCMonth();
	    if(y1 === y2){
	    	if(m1 === m2)
	    	{
	    		if(d1===d2){
	    			return true;
	    		}else{
	    			return false;
	    		}
	    	}else{
	    		return false;
	    	}
	    }else{
	    	return false;
	    }
	};
    
   

	return {
		isEqual,
        moment
	};
};

export {DateHandler};