'use-strict'

angular.module('reme', [
		'ui.router',
		'selectize'
	])
.config(config)
.run(run)
// .constant('baseUrl', 'http://reme.dev');
.constant('baseUrl', 'http://server.reme.cloud'); //for live


function config($stateProvider, $urlRouterProvider, $interpolateProvider, $httpProvider) {

	$interpolateProvider.startSymbol('{!');
	$interpolateProvider.endSymbol('!}');

	$urlRouterProvider.otherwise("/");

	$httpProvider.interceptors.push([function() {
				return {
					'request' : function(config) {
						if(localStorage.authorization) {
							config.headers.Authorization = 'Bearer ' + localStorage.authorization;
						}

						return config;
					} 

					, 'response': function (response) {
						if(response && response.data.success) {
							if(response.data.success.token) {
								localStorage.authorization = response.data.success.token;
							}
						}
						
						if(response.data.status == 401) {
							localStorage.clear();
							window.location.href = '/';	
						}
						
						return response;
					}
				};
			}]);

	$stateProvider
        .state('clients', {
        	url: '/',
        	templateUrl: '/views/clients.html',
        	controller: 'ClientController',
        	controllerAs: 'client'
        })
        .state('profile', {
        	url: '/profile',
        	templateUrl: '/views/client-profile.html',
        	controller: 'ProfileController',
        	controllerAs: 'profile'
        })
        .state('codes', {
        	url: '/codes',
        	templateUrl: '/views/codes.html',
        	controller: 'SubscriptionController',
        	controllerAs: 'subscription'
        })
        .state('archive', {
        	url: '/archive',
        	templateUrl: '/views/archive.html',
        	controller: 'ClientController',
        	controllerAs: 'client'
        })
       .state('change-password', {
            url: '/change-password',
            templateUrl: '/views/changepassword.html',
            controller: 'ChangeController',
            controllerAs: 'client'
        })

       .state('change-password-success', {
            url: '/change-password-success',
            templateUrl: '/views/change-password-success.html',
            controller: '',
            controllerAs: ''
        })

        .state('change-password-success', {
            url: '/change-password-success',
            templateUrl: '/views/change-password-success.html',
            controller: '',
            controllerAs: ''
        })

        .state('confirm-password', {
            url: '/confirm-password',
            templateUrl: '/views/confirm-password.html',
            controller: 'confirmPasswordController',
            controllerAs: 'confirm'
        })
}
function run($rootScope, $state) {
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    	var public_url = ['login', 'register'];

    	if(public_url.indexOf(toState.name) == -1 && localStorage.length == 0) {
    		window.location.href = '/';
    		event.preventDefault();
    	}
    	user = JSON.parse(localStorage.user);

    	if(user.role == "customer" && toState.name == "clients" ) {

    		window.location.href = '/clients/#!/codes';
    	}

    	if(public_url.indexOf(toState.name) == -1 && localStorage.length >= 0) return;
	});


}