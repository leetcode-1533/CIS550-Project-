/**
 * Created by y1275963 on 12/15/16.
 */
app.controller('resultCtrl',['$scope', '$http', 'myService', function($scope, $http, myService){
    var all_data = myService.get();
    $scope.questions = all_data.questions;
    $scope.score = all_data.score;
    $scope.correct_answers = all_data.correct_answers;
    $scope.hints_remaining = all_data.hints_remaining;
    $scope.hints_given = all_data.hints_given;
    $scope.hints_used = $scope.hints_given - $scope.hints_remaining;

    $scope.abstr_url = {};

    for (var i = 0; all_data!=null && all_data.length!=0 && i < all_data.questions.length; i++) {
        var current_answer = all_data.questions[i]["correct_answer"];
        $http({
            url: '/ddg_abstract_url',
            method: "GET",
            params: {correct_answer: current_answer}
        }).success(function(data){
            $scope.abstr_url[current_answer] = data;
            // all_data.questions[i].abstr_url
        });
    };

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