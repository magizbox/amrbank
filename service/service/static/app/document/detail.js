app.controller("DetailAMRCtrl", function ($scope, $stateParams, Corpus, Document, $state, STATUSES, QUALITIES, $filter, $http, $window) {
    $scope.getActiveTask = function () {
        if ($window.localStorage.getItem("activeTask")) {
            return $window.localStorage.getItem("activeTask");
        } else {
            var defaultActiveTask = "1";
            $window.localStorage.setItem("activeTask", defaultActiveTask);
            return defaultActiveTask;
        }
    };

    $scope.CATEGORIES = [
        {value: "ACCOUNT", text: 'ACCOUNT'},
        {value: "CARD", text: 'CARD'},
        {value: "CREDIT", text: 'CREDIT'},
        {value: "CUSTOMER SUPPORT", text: 'CUSTOMER SUPPORT'},
        {value: "INTEREST RATE", text: 'INTEREST RATE'},
        {value: "INTERNET BANKING", text: 'INTERNET BANKING'},
        {value: "LOAN", text: 'LOAN'},
        {value: "MONEY TRANSFER", text: 'MONEY TRANSFER'},
        {value: "OTHER", text: 'OTHER'},
        {value: "PAYMENT", text: 'PAYMENT'},
        {value: "PROMOTION", text: 'PROMOTION'},
        {value: "SAVING", text: 'SAVING'},
        {value: "SECURITY", text: 'SECURITY'},
        {value: "TRADEMARK", text: 'TRADEMARK'},
    ];


    $scope.showCategory = function (category) {
        var selected = [];
        if (category.name) {
            selected = $filter('filter')($scope.aspects, {value: category.name});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    $scope.addCategory = function () {
        $scope.inserted = {
            id: $scope.categories.length + 1,
            name: ''
        };
        $scope.categories.push($scope.inserted);
    };

    $scope.removeCategory = function (index) {
        $scope.categories.splice(index, 1);
    };

    $scope.aspects = [
        {value: "ACCOUNT", text: 'ACCOUNT'},
        {value: "CARD", text: 'CARD'},
        {value: "CREDIT", text: 'CREDIT'},
        {value: "CUSTOMER SUPPORT", text: 'CUSTOMER SUPPORT'},
        {value: "INTEREST RATE", text: 'INTEREST RATE'},
        {value: "INTERNET BANKING", text: 'INTERNET BANKING'},
        {value: "LOAN", text: 'LOAN'},
        {value: "MONEY TRANSFER", text: 'MONEY TRANSFER'},
        {value: "OTHER", text: 'OTHER'},
        {value: "PAYMENT", text: 'PAYMENT'},
        {value: "PROMOTION", text: 'PROMOTION'},
        {value: "SAVING", text: 'SAVING'},
        {value: "SECURITY", text: 'SECURITY'},
        {value: "TRADEMARK", text: 'TRADEMARK'},
    ];

    $scope.showAspect = function (sentiment) {
        var selected = [];
        if (sentiment.aspect) {
            selected = $filter('filter')($scope.aspects, {value: sentiment.aspect});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    $scope.polarities = [
        {value: "POSITIVE", text: 'POSITIVE 👍'},
        {value: "NEUTRAL", text: 'NEUTRAL'},
        {value: "NEGATIVE", text: 'NEGATIVE 👎'}
    ];

    $scope.showPolarity = function (sentiment) {
        var selected = [];
        if (sentiment.polarity) {
            selected = $filter('filter')($scope.polarities, {value: sentiment.polarity});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    $scope.addSentiment = function () {
        $scope.inserted = {
            id: $scope.sentiments.length + 1,
            name: '',
            status: null,
            group: null
        };
        $scope.sentiments.push($scope.inserted);
    };

    $scope.removeSentiment = function (index) {
        $scope.sentiments.splice(index, 1);
    };

    $scope.STATUSES = STATUSES;
    $scope.QUALITIES = QUALITIES;

    $scope.id = $stateParams.id;
    Document.get({id: $scope.id}, function (doc) {
        $scope.doc = doc;
        try {
            $scope.sentiments = JSON.parse(doc.sentiment);
        } catch (e) {
            $scope.sentiments = [];
        }
        try {
            $scope.categories = JSON.parse(doc.category);
        } catch (e) {
            $scope.categories = [];
        }

        $scope.corpusId = doc.corpus;
        Corpus.get({id: doc.corpus}, function (corpus) {
            $scope.corpus = corpus;
        })
    });

    $scope.hideMessages = function () {
        $scope.MESSAGES = {
            "SYNTAX_ERROR": false,
            "LOADING": false,
            "CREATE_SUCCESS": false
        };
    };

    $scope.hideMessages();

    $scope.save = function () {
        try {
            $scope.hideMessages();
            $scope.LOADING = true;
            $scope.doc.sentiment = angular.toJson($scope.sentiments);
            $scope.doc.category = angular.toJson($scope.categories);
            var action = Document.update({id: $scope.id}, $scope.doc);
            action.$promise.then(function () {
                $scope.MESSAGES.CREATE_SUCCESS = true;
                $scope.LOADING = false;
                setTimeout(function () {
                    $scope.MESSAGES.CREATE_SUCCESS = false;
                    $scope.$apply();
                }, 2000);
            });
        } catch (e) {
            $scope.MESSAGES.SYNTAX_ERROR = true;
            $scope.LOADING = false;
        }
    };

    $scope.delete = function () {
        Document.delete({id: $scope.id}).$promise.then(function () {
            $state.go('detailCorpus', {"id": $scope.corpusId});
        })
    }
});