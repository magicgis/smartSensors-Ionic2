angular.module('app.hubs', [])
  .controller('HubsCtrl', function($scope, UserService, ObjectsService, $ionicModal, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    var user = UserService.getUser();

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('right');

    // Delay expansion
    $timeout(function() {
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
    }, 300);

    $scope.$on('ngLastRepeat.mylist',function(e) {
      // Set Motion
      ionicMaterialMotion.fadeSlideInRight();

      // Set Ink
      ionicMaterialInk.displayEffect();
    });

    $scope.objectType = "sink";
    $scope.pageTitle = "Hubs";
    $scope.imgdef = "img/ionic.png";
    $scope.shouldShowDelete = false;
    $scope.newItemWindow = {
      title: "Novo Objeto",
      mensagem: "Qual o nome do objeto?",
      create: "Criar Objeto"
    };

    $scope.$on('$ionicView.enter', function(e) {
      ObjectsService.get(["object", $scope.objectType, "all"]).then(function (result) {
        console.log(result);
        $scope.objects = result;
        //$scope.$apply();
      });
    });

    $scope.remove = function(objects) {
      Objects.remove(objects);
    };

    var alert;

    $ionicModal.fromTemplateUrl('pages/start-item.html', function(modal) {
      $scope.boardModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    // Open our new task modal
    $scope.startItem = function($event, object) {
      console.log(user);
      console.log($scope.pageTitle);
      $scope.boardModal.show();
      $scope.configurations = {
        hostip: "192.168.0.100",
        hostport: 8001,
        email: user.email,
        object: object,
        serialport: ""
      };
    };

    $scope.startClick = function ($event, configurations) {
      /*(
       socket.emit("startBoard", JSON.stringify({
       ip: vm.hostip,
       port: vm.hostport,
       email: currentUser.email,
       sink: vm.listItems[currentNavItem].$id,
       serialport: ""
       }));
       */

      /*$mdDialog.show({
       controller: WaitController,
       parent: angular.element(document.body),
       targetEvent: $event,
       templateUrl: 'app/core/layouts/wait.dialog.templ.html',
       clickOutsideToClose: false,
       openFrom: {
       top: -50,
       width: 30,
       height: 80
       },
       closeTo: {
       left: 1500
       }
       });

       function WaitController($scope, $mdDialog) {
       $scope.hide = function() {vm.status = 'Processado com sucesso.'};
       $scope.close = function(result) {$mdDialog.hide(result)};
       $scope.cancel = function() {vm.status = 'You cancelled the dialog.'};
       };
       */

      // var email = "leoalmeida.rj@gmail.com"; //currentUser.email,
      alert = ApiDataService.startBoard({
        ip: configurations.hostip,
        port: configurations.hostport,
        email: configurations.email,
        sink: configurations.sink,
        serialport: configurations.serialport
      }, cbStartBoardSuccess, cbStartBoardError);
    };

    var cbStartBoardSuccess = function () {
      console.log("Placa iniciada com sucesso");
      $scope.sinkMessage = "Placa iniciada com sucesso";
      alert = undefined;
    };

    var cbStartBoardError = function (data) {
      console.log("Erro ao iniciar placa");
      $scope.sinkMessage = "Erro ao iniciar placa";
      alert = undefined;
    };

    // Close the new task modal
    $scope.closeStartObject = function() {
      $scope.boardModal.hide();
    };

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('pages/new-item.html', function(modal) {
      $scope.itemModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    // Called when the form is submitted
    $scope.createItem = function(item) {
      $scope.objects.push(item);
      $scope.itemModal.hide();
    };

    // Open our new task modal
    $scope.addNewItem = function() {
      $scope.itemModal.show();
      $scope.newobj = {};
    };

    // Close the new task modal
    $scope.closeNewItem = function() {
      $scope.itemModal.hide();
    };

  })
  .controller('HubDetailCtrl', function($scope, $stateParams, UserService, ObjectsService, ApiDataService, $ionicModal, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    var user = UserService.getUser();

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('right');

    // Delay expansion
    $timeout(function() {
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
    }, 300);

    $scope.$on('ngLastRepeat.mylist',function(e) {
      // Set Motion
      ionicMaterialMotion.fadeSlideInRight();

      // Set Ink
      ionicMaterialInk.displayEffect();
    });

    //$scope.objects = Objects.get($stateParams.actId);
    $scope.toggleList = function(){$scope.listed = !$scope.listed};
    $scope.toggleDelete = function(){$scope.shouldShowDelete = !$scope.shouldShowDelete};

    $scope.assType = "connected";
    $scope.reqType = "last";
    //$scope.pageTitle = $stateParams.hubId;

    $scope.constantsWindows = {
      newItemWindow: {
        title: "Nova Associação",
        mensagem: "Qual o nome da associação?"
      },
      create: "Criar Associação",
      update: "Salvar"
    };

    ObjectsService.get(["object", $stateParams.hubId]).then(function(result) {
      console.log(Object.keys(result[0]));
      console.log(result[0].data);

      $scope.pageTitle  = result[0].data.name;
      $scope.properties = Object.keys(result[0].data);
      $scope.values     = result[0].data;
      $scope.object     = result[0];
    });

    ObjectsService.get(["association", $scope.assType, $scope.reqType ,$stateParams.hubId]).then(function(result) {
      console.log(result);
      $scope.associations = result;
    });

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('pages/new-item.html', function(modal) {
      $scope.itemModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    // Called when the form is submitted
    $scope.createItem = function(item) {
      $scope.associations.push(item);
      $scope.itemModal.hide();
    };

    // Open our new task modal
    $scope.addNewItem = function() {
      $scope.itemModal.show();
      $scope.newobj = {};
    };

    // Close the new task modal
    $scope.closeNewItem = function() {
      $scope.itemModal.hide();
    };

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('pages/update-properties.html', function(modal) {
      $scope.propertyModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    // Called when user select to update any property
    $scope.openEditModal = function(item) {
      $scope.selectedItem = item;
      $scope.propertyModal.show();
    };

    // Called when the form is submitted
    $scope.updateProperty = function(item) {
      $scope.associations.push(item);
      $scope.itemModal.hide();
    };

    // Close the new task modal
    $scope.closeEditModal = function() {
      $scope.propertyModal.hide();
    };

  });
