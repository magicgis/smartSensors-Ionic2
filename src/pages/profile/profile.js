angular.module('app.welcome', [])
  .controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $ionicActionSheet) {
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    $scope.connected = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
      navIcons.addEventListener('click', function() {
        this.classList.toggle('active');
      });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.showLogOutMenu = function() {
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Logout',
        titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          return true;
        },
        destructiveButtonClicked: function(){
          $ionicLoading.show({
            template: 'Logging out...'
          });

          if ($scope.loginType === "facebook"){
            //facebook logout
            facebookConnectPlugin.logout(function(){
                $ionicLoading.hide();
                $state.go('welcome');
              },
              function(fail){
                $ionicLoading.hide();
              });
          } else {
            //google logout
              window.plugins.googleplus.logout(
                function (msg) {
                  $scope.loginType = "";
                  console.log('Logout success', msg);
                },
                function (msg) {
                  $scope.loginType = "";
                  console.log('Logout failed', msg);
                }
              );
          }
        }
      });
    };

    $scope.hideNavBar = function() {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }
    };

    $scope.setExpanded = function(bool) {
      $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
      var hasHeaderFabLeft = false;
      var hasHeaderFabRight = false;

      switch (location) {
        case 'left':
          hasHeaderFabLeft = true;
          break;
        case 'right':
          hasHeaderFabRight = true;
          break;
      }

      $scope.hasHeaderFabLeft = hasHeaderFabLeft;
      $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (!content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }

    };

    $scope.hideHeader = function() {
      $scope.hideNavBar();
      $scope.noHeader();
    };

    $scope.showHeader = function() {
      $scope.showNavBar();
      $scope.hasHeader();
    };

    $scope.clearFabs = function() {
      var fabs = document.getElementsByClassName('button-fab');
      if (fabs.length && fabs.length > 1) {
        fabs[0].remove();
      }
    };

  })
  .controller('LoginCtrl', function($scope, $state, $q, $timeout, $ionicLoading, $stateParams, ionicMaterialInk, UserService) {
    $scope.$parent.clearFabs();
    $timeout(function() {
      $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();


    //This is the success callback from the login method
    var fbLoginSuccess = function(response) {
      console.log("Response: ", response);
      if (!response.authResponse){
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;

      getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
          //for the purpose of this example I will store user data on local storage
          console.log(profileInfo);
          UserService.setUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });

          $scope.loginType = "facebook";

          $ionicLoading.hide();
          $state.go('app.home');

        }, function(fail){
          //fail get profile info
          console.log('profile info fail', fail);
        });
    };

    //This is the fail callback from the login method
    var fbLoginError = function(error){
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    //this method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
          console.log(response);
          info.resolve(response);
        },
        function (response) {
          console.log(response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
      facebookConnectPlugin.getLoginStatus(function(success){
        if(success.status === 'connected'){
          // the user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          console.log('if getLoginStatus', success.status);
          console.log('success: ', JSON.stringify(success));

          //check if we have our user saved
          var user = UserService.getUser('facebook');

          if(!user.userID)
          {
            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {

                //for the purpose of this example I will store user data on local storage
                UserService.setUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                });

                $state.go('app.home');

              }, function(fail){
                //fail get profile info
                console.log('profile info fail', fail);
              });
          }else{
            $state.go('app.home');
          }

        } else {
          //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
          //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
          console.log('else getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          });

          //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };


    var ggLoginSuccess = function (obj) {
      console.log("ggLoginSuccess", obj);
      UserService.setUser({
        authResponse: authResponse,
        userID: obj.uid,
        name: obj.displayName,
        email: obj.email,
        picture : obj.imageUrl
      });
      $scope.loginType = "google";

      $ionicLoading.hide();
      $state.go('app.home');
    };

    var ggLoginError = function(error){
      console.log('ggLoginError', error);
      $ionicLoading.hide();
    }

    $scope.googleSignIn = function() {
      window.plugins.googleplus.trySilentLogin({}, ggLoginSuccess, ggLoginError);
    }

    // Form data for the login modal
    $scope.loginData = {};


    /*
     // Create the login modal that we will use later
     $ionicModal.fromTemplateUrl('pages/login/login.html', {
     scope: $scope
     }).then(function(modal) {
     $scope.modal = modal;
     });

     // Triggered in the login modal to close it
     $scope.closeLogin = function() {
     $scope.modal.hide();
     };

     // Open the login modal
     $scope.login = function() {
     $scope.modal.show();
     };

     // Perform the login action when the user submits the login form
     $scope.doLogin = function() {
     console.log('Doing login', $scope.loginData);

     // Simulate a login delay. Remove this and replace with your login
     // code if using a login system
     $timeout(function() {
     $scope.closeLogin();
     }, 1000);
     };*/
  })
  .controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, ObjectsService) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
      ionicMaterialMotion.slideUp({
        selector: '.slide-up'
      });
    }, 300);

    $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight({
        startVelocity: 3000
      });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.followings = ObjectsService.all();
    $scope.remove = function(chat) {
      ObjectsService.remove(chat);
    };
  })
  .controller('HomeCtrl', function ($scope, UserService, $state, $ionicLoading, ObjectsService, $timeout, ionicMaterialMotion, ionicMaterialInk){

  $scope.user = UserService.getUser();

  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('right');

  // Delay expansion
  $timeout(function() {
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
  }, 300);

  $scope.$on('ngLastRepeat.mylist',function(e) {
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
      selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
      selector: '.animate-fade-slide-in .item'
    });


  });

  $scope.objectType = "topic";
  $scope.pageTitle = "Canais";
  $scope.imgdef = "assets/images/background_downtown.jpg";
  ObjectsService.get(["object", $scope.objectType, "all"]).then(function(result) {
    console.log(result);
    $scope.objects = result;
  });


});
