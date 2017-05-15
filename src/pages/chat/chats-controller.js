angular.module('app.chat', [])
  .controller('ChatsCtrl', function($scope, ObjectsService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = ObjectsService.all();
  $scope.remove = function(chat) {
    ObjectsService.remove(chat);
  };
})
  .controller('ChatDetailCtrl', function($scope, $stateParams, ObjectsService) {
    $scope.chat = Chats.get($stateParams.chatId);
  });
