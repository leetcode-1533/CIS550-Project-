/**
 * Created by y1275963 on 12/15/16.
 */
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