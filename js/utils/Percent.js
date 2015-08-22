var Dimensions = require('Dimensions');

var ᐱ = {
	width: Dimensions.get('window').width,

	height: Dimensions.get('window').height,

	percent(percentage, option){
		if(typeof option === 'string'){
			if(option === 'width' || 'w') {
				return (percentage * this.width) / 100;
			} else if (option === 'height' || 'h') {
				return (percentage * this.height) / 100;
			} else {
				console.log('ERROR interpreting percentage with option ' + option + ' and percentage of ' + percentage + '.');
			}
		} else if (typeof option === 'number') {
			return (percentage * option) / 100;
		} else {
			console.log('ERROR interpreting option of type ' + typeof option + '. Must be string "width", "height", or number.');
		}
	}
}

//Shortcuts
ᐱ.percent.h = function(percentage, debugMode){
	if(typeof percentage === 'number'){
		if(debugMode){console.log((percentage * ᐱ.height) / 100)}
		return (percentage * ᐱ.height) / 100;
	} else {
		console.log('ERROR interpreting percentage of type ' + typeof percentage);
	}
}
ᐱ.percent.w = function(percentage, debugMode){
	if(typeof percentage === 'number'){
		if(debugMode){console.log((percentage * ᐱ.width) / 100)}
		return (percentage * ᐱ.width) / 100;
	} else {
		console.log('ERROR interpreting percentage of type ' + typeof percentage);
	}
}

module.exports = ᐱ;