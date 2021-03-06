describe 'phraseJavascript', ->
  scope = null
  elem = null
  directive = null
  compiled = null
  $compile = null
  html = null

  window = {
    jQuery: {}
  }
  enabled = null
  projectId = "my-project-id"

  beforeEach ->
    module('phrase')
    module ($provide) ->
      window.jQuery.getScript = jasmine.createSpy("getScript")
      $provide.value('$window', window)
      $provide.value('phraseProjectId', projectId)
      $provide.value('phraseEnabled', enabled)
      null

  describe "phrase is disabled", ->
    beforeEach ->
      enabled = false

    beforeEach ->
      inject ($injector) ->
        $rootScope = $injector.get '$rootScope'
        $compile = $injector.get '$compile'
        scope = $rootScope.$new()
        elem = angular.element('<head><phrase-javascript></phrase-javascript></head>')
        compiled = $compile(elem)(scope)
        scope.$digest()

    it "should not attach the config", ->
      expect(window.PHRASEAPP_CONFIG).toBeUndefined()

    it "should not fetch the javascript snippet", ->
      expect(window.jQuery.getScript).not.toHaveBeenCalled()

  describe "phrase is enabled", ->
    beforeEach ->
      enabled = true

    beforeEach ->
      inject ($injector) ->
        $rootScope = $injector.get '$rootScope'
        $compile = $injector.get '$compile'
        scope = $rootScope.$new()
        elem = angular.element('<head><phrase-javascript></phrase-javascript></head>')
        compiled = $compile(elem)(scope)
        scope.$digest()

    it "should attach the project id as a global variable", ->
      expect(window.PHRASEAPP_CONFIG.projectId).toEqual("my-project-id")

    it "should fetch and evaluate the javascript snippet", ->
      expect(window.jQuery.getScript).toHaveBeenCalled()
