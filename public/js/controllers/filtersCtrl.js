"use strict";

habitrpg.controller("FiltersCtrl", ['$scope', '$rootScope', 'User',
  function($scope, $rootScope, User) {
    var user = User.user;
    $scope._editing = false;

    var tagsSnap; // used to compare which tags need updating

    $scope.saveOrEdit = function(){
      if ($scope._editing) {
        _.each(User.user.tags, function(tag){
          // Send an update op for each changed tag (excluding new tags & deleted tags, this if() packs a punch)
          if (tagsSnap[tag.id] && tagsSnap[tag.id].name != tag.name)
            User.user.ops.updateTag({params:{id:tag.id},body:{name:tag.name}});
        })
        $scope._editing = false;
      } else {
        tagsSnap = angular.copy(user.tags);
        tagsSnap = _.object(_.pluck(tagsSnap,'id'), tagsSnap);
        $scope._editing = true;
      }
    }

    $scope.toggleFilter = function(tag) {
      user.filters[tag.id] = !user.filters[tag.id];
      // no longer persisting this, it was causing a lot of confusion - users thought they'd permanently lost tasks
      // Note: if we want to persist for just this computer, easy method is:
      // User.save();
    };

    $scope.createTag = function(name) {
      User.user.ops.addTag({body:{name:name}});
      $scope._newTag = '';
    };


    $scope.sortableOptions = {
      // Because we're manually handling sorting via splice (index.coffee#user.ops), we cancel jQuery UI
      update: function(e,ui) {
        ui.item.sortable.cancel();
      },
      stop: function(e, ui) {
        var from = ui.item.sortable.index, to = ui.item.sortable.dropindex;
        if (!from || !to) return;
        User.user.ops.sortTag({query: {from: from, to: to}});
      },
      axis: 'x',
      //distance: 5
    };
}]);
