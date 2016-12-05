/**
 * Created by y1275963 on 11/14/16.
 */
app.controller('sqlform', [
    '$scope',
    '$http',
    '$timeout',
    function($scope, $http, $timeout) {
        var RightSqlAnswer = null;
        var AlternativeSqlAnswer = null;
        $scope.sqlform = {};

        $scope.reset = function() {
            $scope.sqlform = {};
            $scope.RightSqlShow = false;
            $scope.AlterSqlShow = false;
            $scope.alternativeData = {};
            RightSqlAnswer = null;
            AlternativeSqlAnswer = null;
            $scope.UploadSqlShow = false;

        };


        $scope.validateRight = function(req_length) {
            console.log($scope.sqlform.rightsql);
            if(!$scope.sqlform.rightsql || $scope.sqlform.rightsql=== ' '){
                $scope.RightSqlWrongMessage = "Empty Input";
                $scope.RightSqlShow = true;
                $scope.RightSqlAlertType = "alert-danger";
                RightSqlAnswer = null;

                return;
            };

            $http({
                url: '/newquestion/validateRightSql',
                method: 'GET',
                params: {RightSql: $scope.sqlform.rightsql, Requiredlength:req_length}
            }).success(function(data) {
                RightSqlAnswer = data[0].answer;
                $scope.RightSqlWrongMessage = "SQL Success" + "\n" + "Given Result: ".concat(RightSqlAnswer);
                $scope.RightSqlShow = true;
                $scope.RightSqlAlertType = "alert-success";

                return;
            }).error(function(data, status, headers) {
                $scope.RightSqlWrongMessage = data;
                $scope.RightSqlShow = true;
                $scope.RightSqlAlertType = "alert-danger";
                RightSqlAnswer = null;

                return;
            })
        };

        $scope.validateAlter = function(req_length) {
            if(!$scope.sqlform.wrongsql || $scope.sqlform.wrongsql=== ' '){
                $scope.AlterSqlWrongMessage = "Empty Input";
                $scope.AlterSqlShow = true;
                $scope.AlterSqlAlertType = "alert-danger";
                $scope.alternativeData = {};
                AlternativeSqlAnswer = null;
                return;
            };

            $http({
                url: '/newquestion/validateRightSql',
                method: 'GET',
                params: {RightSql: $scope.sqlform.wrongsql, Requiredlength:req_length}
            }).success(function(data) {
                $scope.AlterSqlWrongMessage = "SQL Success Given Result: ";
                $scope.AlterSqlShow = true;
                $scope.AlterSqlAlertType = "alert-success";
                AlternativeSqlAnswer = data;

                $scope.alternativeData = AlternativeSqlAnswer;

            }).error(function(data, status, headers) {
                $scope.AlterSqlWrongMessage = data;
                $scope.AlterSqlShow = true;
                $scope.AlterSqlAlertType = "alert-danger";
                $scope.alternativeData = {};
                AlternativeSqlAnswer = null;

            })
        };

        $scope.sqldemo = function(sqlform) {
            console.log(sqlform);
            $scope.UploadSqlShow = true;

            if(!((RightSqlAnswer!=null) && (AlternativeSqlAnswer != null))) {
                $scope.UploadSqlMessage = "Please Pass each test First";
                $scope.UploadSqlAlertType = "alert-danger";
                $scope.questions = {};
            } else {
                $scope.UploadSqlAlertType = "success";

                $scope.questions =
                {"question": $scope.sqlform.sqlquestion,
                    "correct_answer": RightSqlAnswer,
                    "options": [
                        {"answerText":RightSqlAnswer, "correct": true},
                        {"answerText":AlternativeSqlAnswer[0]['options'], "correct": false},
                        {"answerText":AlternativeSqlAnswer[1]['options'], "correct": false},
                        {"answerText":AlternativeSqlAnswer[2]['options'], "correct": false}
                    ]
                };
                console.log($scope.questions);
            }
        }

        $scope.sqlUpload = function(sqlform) {
            $scope.waiting_variable = true;

            if(!((RightSqlAnswer!=null) && (AlternativeSqlAnswer != null))) {
                console.log("Data Not Ready");
            } else {
                var dataobject = {
                    options: sqlform.wrongsql,
                    question: sqlform.sqlquestion,
                    questionquery: sqlform.rightsql
                };

                $http.post('/newquestion/addquiz', dataobject).then(function(data) {
                        console.log("Upload Success");
                    var temp = $timeout(function (){
                        $scope.waiting_variable = false;

                    }, 10000)

                    console.log($scope.waiting_variable);
                });
            }
        }
    }
]);