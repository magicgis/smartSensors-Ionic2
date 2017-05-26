angular.module('app.sources', [])
  .controller('SourcesCtrl', function($scope, ObjectsService, $ionicModal, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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

    $scope.objectType = "sensor";
    $scope.pageTitle = "Sensores";
    $scope.newItemWindow = {
      title: "Novo Objeto",
      mensagem: "Qual o nome do objeto?",
      create: "Criar Objeto"
    };


    $scope.imgdef = "img/ionic.png";
    $scope.objects = [];
    $scope.$on('$ionicView.enter', function(e) {
      ObjectsService.get(["object", $scope.objectType, "all"]).then(function(result) {
        console.log(result);
        $scope.objects = result;
        $scope.$apply();
      });

    });
    //$scope.sources = Sources.all();
    $scope.remove = function(source) {
      Sources.remove(source);
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
      task.title = "";
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
  .controller('SourceDetailCtrl', function($scope, $stateParams, UserService, ObjectsService, $ionicModal, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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
    $scope.constantsWindows = {
      newItemWindow: {
        title: "Nova Propriedade",
        chave: "Qual o nome da propriedade?",
        valor: "Qual o valor da propriedade?"
      },
      create: "Criar Propriedade",
      update: "Salvar"
    };

    $scope.toggleList = function(){$scope.listed = !$scope.listed};
    $scope.toggleDelete = function(){$scope.shouldShowDelete = !$scope.shouldShowDelete};

    ObjectsService.get(["object", $scope.objectType, $stateParams.sourceId]).then(function(result) {
      $scope.object     = result[0];
      console.log(Object.keys($scope.object));
      console.log(result[0].data);
      $scope.pageTitle  = result[0].data.name;
      $scope.properties = Object.keys(result[0].data);
      $scope.values     = result[0].data;
      //$scope.apply();
    });

    ObjectsService.get(["association", $scope.assType, $scope.reqType ,$stateParams.sourceId]).then(function(result) {
      console.log(result);
      $scope.associations = result;
      //$scope.apply();
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
