var app = angular.module("quizApp", ['ui.router']);

app.controller('homeCtrl', ['$scope', '$http', 'myService', function($scope, $http, myService){
    $scope.username = "";

    $scope.go_to_quiz = function(level) {
        var sending_data = {
            level: level,
            username: ($scope.anonymous_flag==true || $scope.username=="")?"Anonymous":$scope.username
        };
        myService.set(sending_data);
        window.location = '/#/quiz';
    }
}]);

app.controller('leaderboarCtrl', ['$scope', '$http', function($scope, $http){
    $http({
        url: '/get_leaders',
        method: 'GET'
    }).success(function(data) {
        $scope.scores= data;
    });
    $scope.toggle_array = [];
    $scope.toggle_array[0] = true;
    $scope.toggle_array[1] = false;
    $scope.toggle_array[2] = false;
    $scope.toggle_array[3] = false;
    $scope.toggle = function(tab_no) {
        for(var i=0;i<4;i++) {
            if (i == tab_no) {
                $scope.toggle_array[i] = true;
            }
            else $scope.toggle_array[i] = false
        }
        console.log($scope.toggle_array)
    }
}]);


app.controller('questionsCtrl',['$scope', '$http', '$timeout', 'myService', function($scope, $http, $timeout, myService){

    var recieved_data = myService.get();
    var no_of_questions = 10;

    if(angular.isDefined(recieved_data.username)) {
        $scope.username = recieved_data.username;
    }
    else {
        $scope.username = "Anonymous";
    }

    if(angular.isDefined(recieved_data.level)){
        if(recieved_data.level == 'easy'){
            $scope.hints_given = 5;
            $scope.level_display = "Easy";
        }
        else if(recieved_data.level == 'medium'){
            $scope.hints_given = 3;
            $scope.level_display = "Medium";
        }
        else if(recieved_data.level == 'hard'){
            $scope.hints_given = 1;
            $scope.level_display = "Hard";
        }
        else if(recieved_data.level == 'rapid_fire'){
            $scope.hints_given = 5;
            $scope.level_display = "Rapid Fire";
        }
    }
    else {
        $scope.hints_given = 5;
        $scope.level_display = "Practice Mode";
    }

 	// var no_of_questions = 20;
    // var question_indices = [];
    // for(var i=0; i<no_of_questions; i++){
    // 	question_indices.push(i);
    // }
    // random_number(question_indices);

    function get_question_ids(){
        if(recieved_data.level == 'rapid_fire')  no_of_questions = 100;
        // else no_of_questions = 2;
        $http({
            url: '/quiz_list',
            method: 'GET',
            params: {total_questions: no_of_questions}
        }).success(function(data) {
            $scope.quiz_all = [];
            for(var i=0;i<data.length;i++){
                $scope.quiz_all[i] = data[i]['_id'];
            }
            console.log($scope.quiz_all)
        });
    }
    get_question_ids();
    // console.log(quiz_all)

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
    $scope.hints_remaining = $scope.hints_given;

    $scope.question = -1;
    $scope.questions = [];
    temp_question = [];

    if(recieved_data.level=="rapid_fire"){
        $scope.question_limit = 99999;
    }
    else {
        $scope.question_limit = no_of_questions - 1;
    }

    if(recieved_data.level == 'rapid_fire'){
        $scope.counter = 60;
        $scope.onTimeout = function(){
            $scope.counter--;
            if ($scope.counter > 0) {
                mytimeout = $timeout($scope.onTimeout,1000);
            }
            else {
                alert("Time is up!");
                $scope.submit_results_rapid();
            }
        }
        
    }
    $scope.loading = true;
    $scope.show_hint = false;

    $scope.show_plus_five = 0;

    $scope.get_next_question = function() {

        $scope.loading = true;
        $scope.show_hint = false;


        // console.log($scope.user_answer);
    	if($scope.question != -1){
            if ($scope.user_answer.correct == true) {
                $scope.questions[$scope.question]['user_answer'] = true;
                $scope.correct_answers = $scope.correct_answers + 1;
                if(recieved_data.level == "rapid_fire"){
                    $scope.counter = $scope.counter + 5;
                        $scope.show_plus_five = 2;
                    var plus = $timeout(function(){
                        $scope.show_plus_five = 1;
                    }, 2000)
                }           
                if($scope.questions[$scope.question]['hint_taken'] == false) {
                    $scope.score = $scope.score + 10;
                }
                else $scope.score = $scope.score + 5;
            }
            else {
                if(recieved_data.level == 'rapid_fire'){
                    $scope.show_plus_five = 1;
                }
            }
        }
        
    	// console.log($scope.score);
    	// console.log($scope.correct_answers);
    	// console.log($scope.questions[$scope.question]);

    	$scope.user_answer = "";
    	$scope.question = $scope.question + 1;

    	$http({
    		url: '/test_http', 
    		method: "GET",
    		params: {question_id: $scope.quiz_all[$scope.question]}
    	})
	    .success(function (data) {
	        console.log(data);
            $scope.loading = false;

            if($scope.question==0 && recieved_data.level == 'rapid_fire'){
                var timer = $timeout($scope.onTimeout, 1000);
            }

	        temp_question[$scope.question] = 
	            {"question": data['question'], 
	            "correct_answer": data['answer'][0]['answer'], 
	            "hint_taken": false, 
	            "user_answer": false,
                "related_image": data['image_url'],
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
    var temp = $timeout(function(){
        $scope.get_next_question();        
    }, 2000);

    // $scope.get_hint = function() {
    //     if($scope.hints_remaining > 0){
    //         $scope.questions[$scope.question]['hint_taken'] = true;
    //         $scope.hints_remaining = $scope.hints_remaining - 1;
    //
    //         var count = 0;
    //         answers = $scope.questions[$scope.question]['options'];
    //         for(var i=0;i<answers.length;i++){
    //             if(answers[i].correct == false && count < 2) {
    //                 answers[i].disabled = true;
    //                 count = count + 1;
    //                 // console.log(count);
    //             }
    //             // console.log($scope.questions[$scope.question]);
    //         }
    //     }
    // }
    $scope.get_hint = function() {
    	if($scope.hints_remaining > 0){


	    	$scope.questions[$scope.question]['hint_taken'] = true;
	    	$scope.hints_remaining = $scope.hints_remaining - 1;
            $scope.current_hint = "";


            $http({
                url: '/ddg_hint',
                method: "GET",
                params: {correct_answer: $scope.questions[$scope.question]["correct_answer"]}
            }).success(function(data, status) {
                // console.log($scope.questions[$scope.question]["correct_answer"]);
                // console.log();
                $scope.current_hint = data;
                $scope.show_hint = true;
                // console.log(status);
            }).error(function(data, status) {
                $scope.user_answer = "";
                // cannot find in the database
                var count = 0;
                answers = $scope.questions[$scope.question]['options'];
                for(var i=0;i<answers.length;i++){
                    if(answers[i].correct == false && count < 2) {
                        answers[i].disabled = true;
                        count = count + 1;
                    }
                }
            });
	    }
    }


    $scope.submit_results = function(){
    	// console.log("here");
    	// console.log($scope.user_answer);
    	if ($scope.user_answer.correct == true) {
	    	$scope.questions[$scope.question]['user_answer'] = true;
	    	$scope.correct_answers = $scope.correct_answers + 1;			
    		if($scope.questions[$scope.question]['hint_taken'] == false) {
    			$scope.score = $scope.score + 10;
    		}
    		else $scope.score = $scope.score + 5;
    	}
    	// console.log($scope.score);
    	// console.log($scope.correct_answers);
    	// console.log($scope.questions[$scope.question]);

    	var sending_data = {
    		"questions": $scope.questions,
    		"correct_answers": $scope.correct_answers,
    		"score": $scope.score,
    		"hints_remaining": $scope.hints_remaining,
            "hints_given": $scope.hints_given,
            "username": $scope.username,
            "level": $scope.level_display,
        }
        console.log(sending_data);
    	myService.set(sending_data);
    	window.location = '/#/result';
    }

    $scope.submit_results_rapid = function(){
        // console.log($scope.related_image);
        myService.set(sending_data);
        window.location = '/#/result';
    }

}]);

app.controller('resultCtrl',['$scope', '$http', 'myService', function($scope, $http, myService){
	var all_data = myService.get();
	$scope.questions = all_data.questions;
	$scope.score = all_data.score;
	$scope.correct_answers = all_data.correct_answers;
	$scope.hints_remaining = all_data.hints_remaining;
    $scope.hints_given = all_data.hints_given;
	$scope.hints_used = $scope.hints_given - $scope.hints_remaining;

    console.log($scope.questions);

    if(all_data!=null && all_data.length!=0){
        if(all_data.username!="" && all_data.username!="Anonymous" && all_data.level!="Practice Mode"){
            console.log("here")
            console.log(all_data)
            $http({
                url: '/update_leaders',
                method: 'GET',
                params: {username: all_data.username, level: all_data.level, score: all_data.score}
            }).success(function(){
                console.log('success')
            })
        }
    }

    if(all_data.username!=null && all_data.username!="" && angular.isDefined(all_data.username) && all_data.username!="Anonymous")
        $scope.username = all_data.username;
    else $scope.username = "";
    // console.log(all_data);

    $scope.go_to_quiz = function(level) {
        var sending_data = {
            level: level,
            username: $scope.anonymous_flag==true?"Anonymous":$scope.username
        };
        myService.set(sending_data);
        window.location = '/#/quiz';
    }

    $scope.hoverIn = function() {
        console.log(this.question.related_image);
        if (this.question.related_image != null && this.question.related_image != "") {
            this.hoverEdit = true;
        }
    }

    $scope.hoverOut = function() {
        this.hoverEdit = false;
    }

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

app.filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
});

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'homeCtrl'
    })

    .state('quiz', {
      url: '/quiz',
      templateUrl: '/quiz.html',
      controller: 'questionsCtrl'
    })

    .state('sqlform', {
       url: '/newquestion',
       templateUrl: '/sqlform.html',
       controller: 'sqlform'
    })

    .state('result', {
      url: '/result',
      templateUrl: '/result.html',
      controller: 'resultCtrl'
    })

    .state('ngtable', {
      url: '/ngtable',
      templateUrl: '/ngtable.html',
      controller: 'ngTableCtrl'
    })

    .state('leaderboard', {
        url: '/leaderboard',
        templateUrl: '/leaderboard.html',
        controller: 'leaderboarCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]);