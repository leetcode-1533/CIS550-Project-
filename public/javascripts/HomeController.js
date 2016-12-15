/**
 * Created by y1275963 on 12/15/16.
 */
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