angular.module('app.scenes', [])
  .controller('ScenesCtrl', function($scope, UserService, ObjectsService, $ionicModal, $timeout, ionicMaterialInk, ionicMaterialMotion) {
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

    $scope.objectType = "topic";
    $scope.pageTitle = "Automação";
    $scope.newItemWindow = {
      title: "Novo Objeto",
      mensagem: "Qual o nome do objeto?",
      create: "Criar Objeto"
    };

    $scope.imgdef = "img/ionic.png";

    $scope.$on('$ionicView.enter', function(e) {
      ObjectsService.get(["object", $scope.objectType, "all"]).then(function(result) {
        console.log(result);
        $scope.objects = result;
      });
    });

    //$scope.scenes = Scenes.all();
    $scope.remove = function(scene) {
      Scenes.remove(scene);
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
  })
  .controller('SceneDetailCtrl', function($scope, $stateParams, $ionicLoading, UserService, ReferencesService, ObjectsService, $ionicModal, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();


    $scope.topic = {
      icon:"img/ionic.png",
      label:"teste",
      description:"teste"
    };
    $scope.showProgress = false;
    $scope.assType = "own";
    $scope.reqType = "last";
    $scope.pageTitle = $stateParams.sceneId;

    $scope.toggleList = function(){$scope.listed = !$scope.listed};
    $scope.toggleDelete = function(){$scope.shouldShowDelete = !$scope.shouldShowDelete};

    ObjectsService.get(["object", $scope.objectType, $stateParams.sceneId]).then(function(result) {
      console.log(Object.keys(result[0]));
      console.log(result);
      $scope.properties = Object.keys(result[0]);
      $scope.values = result[0];
    });

    ObjectsService.get(["association", $scope.assType, $scope.reqType ,$stateParams.sceneId]).then(function(result) {
      console.log(result);
      $scope.associations = result;
    });

    ReferencesService.all().then(function(infoData) {
      $scope.pins = infoData.pins;
      $scope.units = infoData.units;
      $scope.icons = infoData.icons;
      $scope.types = infoData.types;
      $scope.states = infoData.states;
      $scope.countries = infoData.country;
      $scope.addressTypes = infoData.addressTypes;
      $scope.localTypes = infoData.localTypes;
      $scope.signTypes = infoData.signTypes;
      $scope.alertTypes = infoData.alertTypes;

      $scope.searchOptionTypes = infoData.searchOptionTypes;
      $scope.alertAttributes = infoData.alertAttributes;
      $scope.alertAttributesValues = infoData.alertAttributesValues;

      $scope.externalAPIs = infoData.externalAPIs;

      $scope.recipes = infoData.templates.recipes;
      $scope.connectors = infoData.templates.connectors;
      $scope.rules = $scope.rules.concat(loadItems($scope.connectors));
      $scope.rules = $scope.rules.concat(loadItems(infoData.templates.rules));
      $scope.actions = $scope.actions.concat(loadItems(infoData.templates.actions));

      for (var i=0; i< $scope.connectors.length; i++) {
        $scope.connectors[i].objects = [[]];
      }

      if (!$scope.recipe) $scope.recipe = $scope.recipes[0];

    });

    $scope.itemsCollection = [{
      thumbnailUrl: './image.jpg',
      title: 'Some Title',
      subtitle: 'test@text.com',
      selectedUsers: [{subtitle: 'test@text.com', thumbnailUrl: 'image.jpg'}]
    }];

    $scope.returnedValues = [];

  });
