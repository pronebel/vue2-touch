import Hammer from 'hammerjs'
var gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe']
var directions = {
  tap: ['tap'],
  swipe: ['swipeleft', 'swiperight', 'swipeup', 'swipedown'],
  pan: ['panstart', 'panmove', 'panend', 'pancancel', 'panleft', 'panright', 'panup', 'pandown'],
  pinch: ['pinchstart', 'pinchmove', 'pinchend', 'pinchcancel', 'pinchin', 'pinchout'],
  press: ['press', 'pressup'],
  rotate: ['rotatestart', 'rotatemove', 'rotateend', 'rotatecancel']
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const touchs = {
  bind: function(el, binding) {
    var handler = null;
    var evtType = '';
    if (!el.evt) {
      el.evt = new Hammer.Manager(el)
    }
    let evt = el.evt;
    var type = evtType = binding.arg.toLowerCase()
    var index = -1
    gestures.findIndex(function(gst, idx){
      if(gst === type) {
        index = idx
      }
    })
    if (index < 0) {
      console.warn('[vue2-touch] event type value is invalid')
      return
    }
    if (typeof binding.value !== 'function') {
      handler = null
      console.warn('[vue2-touch] invalid args value for v-touch, please check it')
      return
    }
    evt.add(new Hammer[capitalize(type)]())
    // bind function
    var evtsArray = directions[evtType]
    if (handler) {
      evtsArray.forEach(function(et) {
        evt.off(et, function(e) {
          handler(et, e)
        })
      })
    }
    if (typeof binding.value === 'function') {
      handler = binding.value
      evtsArray.forEach(function(et) {
        evt.on(et, function(e) {
          handler(et, e)
        })
      })
    }
  },
  unbind: function(el) {
    el.evt.destroy()
    el.evt = null
  }
}
export default touchs
