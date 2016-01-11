'use strict';

import utils from '../utils'

class DragonDispatcher {

  constructor(options = {}) {

    this.uid = utils.uniqueId(this)

    this.options = options

    this.app = options.app

    this.currentController = null

  }

  dispatch(route, params, options = {}) {

    if(this.currentController && this.currentController.dispose) {

      this.currentController.dispose()
    }

    var req = {
      params: params
    }

    var controller = null

    if(options.Controller) {
      controller = new options.Controller()
      controller[options.action](req)
    }

    else {
      var segs = route.pattern.split('/')

      var controllerName = segs[1],
          actionName     = segs[2]
      console.log('controllerName', controllerName)
      console.log('actionName', actionName)
      var Controller = this.options.getController(controllerName)
      controller = new Controller()
      console.log('controller', controller)
      controller[actionName](req)
    }

    this.currentController = controller

  }

  dispose() {

    if(!this.disposed) {

      utils.dispose(this, {
        ignoreProperties: ['app']
      })

    }

  }

}

DragonDispatcher.prototype.disposed = false

export default DragonDispatcher
