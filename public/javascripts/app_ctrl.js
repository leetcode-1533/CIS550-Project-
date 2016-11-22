var app = angular.module("quizApp", ['ui.router']);

app.controller('questionsCtrl',['$scope', '$http', 'myService', function($scope, $http, myService){

	// $http.get('/test_http')
 //    .success(function (data) {
 //        console.log(data);
 //        temp_question = [
 //            {"questionText": data['question'], "answers": [
 //                {"answerText":data['answer'][0]['answer'], "correct": true},
 //                {"answerText":data['answer'][1]['options'], "correct": false},
 //                {"answerText":data['answer'][2]['options'], "correct": false},
 //                {"answerText":data['answer'][3]['options'], "correct": false}
 //            ]}
 //        ];
 //        console.log(temp_question[0]['answers'].length)
 //        random_number(temp_question[0]['answers']);
	//         console.log(temp_question);
	//         $scope.questions = temp_question;
 //        // console.log($scope.questions);
 //    })
 //    .error(function (data) {
 //        console.log('Error:'+data);
 //    });

 	var no_of_questions = 20;
    var question_indices = [];
    for(var i=0; i<no_of_questions; i++){
    	question_indices.push(i);
    }
    random_number(question_indices);

    function random_number(question_indices) {
    	for(var i=0;i<question_indices.length;i++){
    		swap(question_indices, i);
    	}
    }

    function swap(question_indices, i){
    	var temp;
    	random = Math.floor(Math.random()*question_indices.length);
    	temp = question_indices[i];
    	question_indices[i] = question_indices[random];
    	question_indices[random] = temp;
    }
    $scope.user_answer = "";
    $scope.score = 0;
    $scope.correct_answers = 0;
    $scope.hints_remaining = 5;

    $scope.question = -1;
    $scope.questions = [];
    temp_question = [];
    $scope.get_next_question = function() {

    	console.log($scope.user_answer);
    	if ($scope.user_answer.correct == true) {
	    	$scope.questions[$scope.question]['user_answer'] = true;
	    	$scope.correct_answers = $scope.correct_answers + 1;			
    		if($scope.questions[$scope.question]['hint_taken'] == false) {
    			$scope.score = $scope.score + 10;
    		}
    		else $scope.score = $scope.score + 5;
    	}
    	console.log($scope.score);
    	console.log($scope.correct_answers);
    	console.log($scope.questions[$scope.question]);

    	$scope.user_answer = "";
    	$scope.question = $scope.question + 1;

    	$http({
    		url: '/test_http', 
    		method: "GET",
    		params: {question_id: question_indices[$scope.question]}
    	})
	    .success(function (data) {
	        console.log(data);

	        temp_question[$scope.question] = 
	            {"question": data['question'], 
	            "correct_answer": data['answer'][0]['answer'], 
	            "hint_taken": false, 
	            "user_answer": false,
	            "options": [
	                {"answerText":data['answer'][0]['answer'], "correct": true, "disabled": false},
	                {"answerText":data['answer'][1]['options'], "correct": false, "disabled": false},
	                {"answerText":data['answer'][2]['options'], "correct": false, "disabled": false},
	                {"answerText":data['answer'][3]['options'], "correct": false, "disabled": false}
	            ]
	        };
	        random_number(temp_question[$scope.question]['options']);
	        for(var i=0;i<temp_question[$scope.question]['options'].length;i++){
	        	// console.log(temp_question[$scope.question]['options'].correct);
	        	if(temp_question[$scope.question]['options'][i].correct == true){
	        		temp_question[$scope.question]['correct_option'] = i;
	        	}
	        }
	        console.log(temp_question);
	        $scope.questions[$scope.question] = temp_question[$scope.question];
	        console.log($scope.questions);
	    })
	    .error(function (data) {
	        console.log('Error:'+data);
	    });
    }
    $scope.get_next_question();

    $scope.get_hint = function() {
    	if($scope.hints_remaining > 0){
	    	$scope.questions[$scope.question]['hint_taken'] = true;
	    	$scope.hints_remaining = $scope.hints_remaining - 1;
	    	
	    	var count = 0;
	    	answers = $scope.questions[$scope.question]['options'];
	    	for(var i=0;i<answers.length;i++){
	    		if(answers[i].correct == false && count < 2) {
	    			answers[i].disabled = true;
	    			count = count + 1;
	    			// console.log(count);
	    		}
	    		// console.log($scope.questions[$scope.question]);
	    	}
	    }
    }


    $scope.submit_results = function(){
    	console.log("here");
    	console.log($scope.user_answer);
    	if ($scope.user_answer.correct == true) {
	    	$scope.questions[$scope.question]['user_answer'] = true;
	    	$scope.correct_answers = $scope.correct_answers + 1;			
    		if($scope.questions[$scope.question]['hint_taken'] == false) {
    			$scope.score = $scope.score + 10;
    		}
    		else $scope.score = $scope.score + 5;
    	}
    	console.log($scope.score);
    	console.log($scope.correct_answers);
    	console.log($scope.questions[$scope.question]);

    	var sending_data = {
    		"questions": $scope.questions,
    		"correct_answers": $scope.correct_answers,
    		"score": $scope.score,
    		"hints_remaining": $scope.hints_remaining 
    	}
    	myService.set(sending_data);
    	window.location = '/#/result';
    }

    // $scope.answers ={};
    // $scope.correctCount = 0;

    // $scope.showResult = function(){
    //     $scope.correctCount = 0;
    //     var qLength = $scope.questions.length;
    //     for(var i=0;i<qLength;i++){
    //         var answers = $scope.questions[i].answers;
    //         $scope.questions[i].userAnswerCorrect = false;
    //         $scope.questions[i].userAnswer = $scope.answers[i];
    //         for(var j=0;j<answers.length;j++){
    //             answers[j].selected = "donno";
    //             if ($scope.questions[i].userAnswer === answers[j].answerText && answers[j].correct===true){
    //                 $scope.questions[i].userAnswerCorrect = true;
    //                 answers[j].selected = "true";
    //                 $scope.correctCount++;
    //             }else if($scope.questions[i].userAnswer === answers[j].answerText && answers[j].correct===false){
    //                 answers[j].selected = "false";
    //             }
    //         }
    //     }
    // };
}]);

app.controller('resultCtrl',['$scope', '$http', 'myService', function($scope, $http, myService){
	var all_data = myService.get();
	$scope.questions = all_data.questions;
	$scope.score = all_data.score;
	$scope.correct_answers = all_data.correct_answers;
	$scope.hints_remaining = all_data.hints_remaining;
	$scope.hints_used = 5 - $scope.hints_remaining;
}]);

app.factory('myService', function(){
	var savedData = [];
	function set(data) {
	    savedData = data;
	}

	function get() {
		return savedData;
	}

	return {
	  	set: set,
	  	get: get
	 }
});

app.filter('numberToAlphabet', function(){
    return function(number){
        return String.fromCharCode(number+65);
    }
});

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('quiz', {
      url: '/quiz',
      templateUrl: '/quiz.html',
      controller: 'questionsCtrl'
    })

    .state('result', {
      url: '/result',
      templateUrl: '/result.html',
      controller: 'resultCtrl'
    });

  $urlRouterProvider.otherwise('quiz');
}]);