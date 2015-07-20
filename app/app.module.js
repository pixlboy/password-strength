//Password Strength Check

var app = angular.module('P-strength', []);

app.controller('PasswordStrengthCtrl', ["$scope", "StringTestFactory", function ($scope, StringTestFactory) {
	
	$scope.baseScore = 50;
	$scope.stringLength = 0;
	$scope.lowerCasePenalty = 0;
	$scope.numberOnlyPenalty = 0;
	$scope.comboBonus = 0;
	$scope.totalScore = $scope.baseScore;
	$scope.stringSummary = {
		"lowerCaseL"	: 0,
		"upperCaseL"	: 0,
		"numberL"		: 0,
		"symbolL"		: 0
	};
	$scope.lengthBonus 			= 0;
	$scope.upperCaseBonus 		= 0;
	$scope.numberBonus 			= 0;
	$scope.symbolBonus 			= 0;
	$scope.lowerCaseOnlyPenalty = 0;
	$scope.numbersOnlyPenalty 	= 0;

	$scope.preventKeyAction = function(event){
		if(event.which == 32){
			event.preventDefault();
		}
	}

	$scope.getPasswordStrength = function(event){

		var _pString = event.target.value,
			_stringSummary = StringTestFactory.analyzeString(_pString);
		
		$scope.stringLength = event.target.value.length;

		$scope.stringSummary["lowerCaseL"] 	= _stringSummary.lowerCaseL;
		$scope.stringSummary["upperCaseL"]	= _stringSummary.upperCaseL;
		$scope.stringSummary["numberL"] 	= _stringSummary.numberL;
		$scope.stringSummary["symbolL"]		= _stringSummary.symbolL;
		
		$scope.calcComplexity();					
	};

	$scope.calcComplexity = function(){
		$scope.lengthBonus 		= $scope.stringLength * 3;
		$scope.upperCaseBonus 	= $scope.stringSummary["upperCaseL"] * 4;
		$scope.numberBonus 		= $scope.stringSummary["numberL"] * 5;
		$scope.symbolBonus 		= $scope.stringSummary["symbolL"] * 5;
		$scope.comboBonus 		= ($scope.stringSummary["lowerCaseL"] > 0 
									&& $scope.stringSummary["upperCaseL"] > 0
									&& $scope.stringSummary["numberL"] > 0
									&& $scope.stringSummary["symbolL"] > 0) 
									? 25 : 0;
		$scope.lowerCaseOnlyPenalty = ($scope.stringSummary["lowerCaseL"] > 0 
									&& $scope.stringSummary["upperCaseL"] == 0
									&& $scope.stringSummary["numberL"]	== 0
									&& $scope.stringSummary["symbolL"] == 0) 
									? ($scope.stringSummary["lowerCaseL"] * -2) : 0;

		$scope.numbersOnlyPenalty 	= ($scope.stringSummary["lowerCaseL"] == 0 
									&& $scope.stringSummary["upperCaseL"] == 0
									&& $scope.stringSummary["numberL"]	> 0
									&& $scope.stringSummary["symbolL"] == 0) 
									? ($scope.stringSummary["numberL"] * -2) : 0;						

		$scope.totalScore 		= $scope.baseScore 
								+ $scope.lengthBonus
								+ $scope.upperCaseBonus
								+ $scope.numberBonus
								+ $scope.symbolBonus
								+ $scope.comboBonus
								+ $scope.lowerCaseOnlyPenalty
								+ $scope.numbersOnlyPenalty;
	};
}]);

app.factory('StringTestFactory', function(){

    function analyzeString(pString) {
   		var _lowerCaseL = (pString.match(/[a-z]/g) !== null) ? pString.match(/[a-z]/g).length : 0,
   		 	_upperCaseL = (pString.match(/[A-Z]/g) !== null) ? pString.match(/[A-Z]/g).length : 0,
   			_numberL	= (pString.match(/[0-9]/g) !== null) ? pString.match(/[0-9]/g).length : 0,
   			_symbolL	= pString.length - _lowerCaseL - _upperCaseL - _numberL;
   		return{
   			"lowerCaseL"	: _lowerCaseL,
			"upperCaseL"	: _upperCaseL,
			"numberL"		: _numberL,
			"symbolL"		: _symbolL
   		}
	}

	return {
     	analyzeString	: analyzeString
    }
});