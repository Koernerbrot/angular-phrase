(function() {
  var phrase;

  phrase = angular.module("phrase", ['pascalprecht.translate', 'ng']);

  phrase.value("phraseProjectId", "");

  phrase.value("phraseEnabled", true);

  phrase.value("phraseDecoratorPrefix", "{{__");

  phrase.value("phraseDecoratorSuffix", "__}}");

  phrase.config([
    "$provide", function($provide) {
      return $provide.decorator("$translate", [
        "$delegate", "phraseEnabled", "phraseDecoratorPrefix", "phraseDecoratorSuffix", function($translate, phraseEnabled, phraseDecoratorPrefix, phraseDecoratorSuffix) {
          if (phraseEnabled) {
            $translate._instant = $translate.instant;
            $translate.instant = function(translationId, interpolateParams, interpolationId) {
              return phraseDecoratorPrefix + "phrase_" + translationId + phraseDecoratorSuffix;
            };
          }
          return $translate;
        }
      ]);
    }
  ]);

  phrase.config([
    "$compileProvider", function($compileProvider) {
      return $compileProvider.directive('translate', [
        "phraseEnabled", "phraseDecoratorPrefix", "phraseDecoratorSuffix", function(phraseEnabled, phraseDecoratorPrefix, phraseDecoratorSuffix) {
          if (phraseEnabled) {
            return {
              priority: 1001,
              terminal: true,
              restrict: 'AE',
              scope: true,
              compile: function(elem, attr) {
                var decoratedTranslationId, translationId;
                if (elem.is("[translate]") && !!elem.attr("translate")) {
                  translationId = elem.attr("translate");
                } else if (elem.is("[translate]")) {
                  translationId = elem.text();
                }
                if (translationId) {
                  decoratedTranslationId = phraseDecoratorPrefix + "phrase_" + translationId + phraseDecoratorSuffix;
                  if (attr.translateValues) {
                    decoratedTranslationId = decoratedTranslationId + " (" + attr.translateValues + ")";
                  }
                  elem.html(decoratedTranslationId);
                  return elem.removeAttr("translate");
                }
              }
            };
          } else {
            return {};
          }
        }
      ]);
    }
  ]);

}).call(this);

(function() {
  var phrase;

  phrase = angular.module("phrase");

  phrase.directive("phraseJavascript", [
    "phraseEnabled", "phraseProjectId", "$window", function(phraseEnabled, phraseProjectId, $window) {
      return {
        restrict: "EA",
        replace: true,
        link: function() {
          var url;
          if (phraseEnabled) {
            url = ['https://', 'phraseapp.com/assets/in-context-editor/2.0/app.js?', new Date().getTime()].join('');
            $window.PHRASEAPP_CONFIG = {
              projectId: phraseProjectId
            };
            return $window.jQuery.getScript(url);
          }
        }
      };
    }
  ]);

}).call(this);
