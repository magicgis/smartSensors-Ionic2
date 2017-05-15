angular.module('app.accessories', [])
  .controller('AccessoriesCtrl', function($scope, ObjectsService, $ionicModal, $timeout, ionicMaterialMotion, ionicMaterialInk) {

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

    $scope.objectType = "actuator";
    $scope.pageTitle = "Acessórios";
    $scope.imgdef = "img/ionic.png";
    $scope.newItemWindow = {
      title: "Novo Objeto",
      mensagem: "Qual o nome do objeto?",
      create: "Criar Objeto"
    };


    $scope.$on('$ionicView.enter', function(e) {
      ObjectsService.get(["object", $scope.objectType, "all"]).then(function (result) {
        console.log(result);
        $scope.objects = result;
        $scope.$apply();
      });
    });

    //$scope.accessories = Accessories.all();
    $scope.remove = function(accessory) {
      ObjectsService.remove(accessory);
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
  .controller('AccessoryDetailCtrl', function($scope, $stateParams, UserService, ObjectsService, $ionicModal, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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

    $scope.assType = "own";
    $scope.reqType = "last";
    $scope.pageTitle = $stateParams.accessoryId;
    $scope.constantsWindows = {
      newItemWindow: {
        title: "Nova Associação",
        mensagem: "Qual o nome da associação?"
      },
      create: "Criar Associação",
      update: "Salvar"
    };

    $scope.toggleList = function(){$scope.listed = !$scope.listed};
    $scope.toggleDelete = function(){$scope.shouldShowDelete = !$scope.shouldShowDelete};

    ObjectsService.get(["object", $scope.objectType, $stateParams.accessoryId]).then(function(result) {
      console.log(Object.keys(result[0]));
      //console.log(result);
      $scope.pageTitle  = result[0].data.name;
      $scope.properties = Object.keys(result[0].data);
      $scope.values     = result[0].data;
      $scope.object     = result[0];
    });

    ObjectsService.get(["association", $scope.assType, $scope.reqType ,$stateParams.accessoryId]).then(function(result) {
      console.log(result);
      $scope.associations = result;
    });

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
