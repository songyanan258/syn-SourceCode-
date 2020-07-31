let Vue

function install(_Vue) {
  // 保存一下引用
  Vue = _Vue
  // 混入store选项
  Vue.mixin({
    beforeCreate() {
      // 判断当前是不是根组件
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
// 实现store类

class Store {
  constructor(options = {}) {
    this.$options = options
    // 响应化处理
    this.state = new Vue({
      data: options.state
    })
    // mutations
    this.mutations = options.mutations || {}
    this.actions = options.actions || {}
  }

  // commit this只想store实例
  // type：mutations中的函数名
  commit = (type, arg) => {
    this.mutations[type](this.state, arg)
  }

  dispatch(type, arg) {
    this.actions[type]({
      commit: this.commit,
      state: this.state
    }, arg)
  }
}
export default {
  Store,
  install
}
