class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.observe(this.$data)
    new Compile(options.el, this)
  }

  observe(obj) {
    if (!obj || typeof obj !== 'object') return
    Object.keys(obj).map(key => {
      this.defineReactive(obj, key, obj[key])
      this.proxyData(key)
    })
  }

  defineReactive(obj, key, val) {
    if (typeof val === 'object') {
      this.observe(val)
    }
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set(newVal) {
        if (newVal === val) return
        val = newVal
        dep.notify()
      }
    })
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(newVal) {
        if (newVal === this.$data[key]) return
        this.$data[key] = newVal
        this.observe(this.$data[key])
      }
    })
  }
}

class Dep {
  constructor() {
    this.deps = []
  }
  addDep(watcher) {
    this.deps.push(watcher)
  }

  notify() {
    this.deps.map(item => item.update())
  }
}

class Watcher {
  constructor(vm, key, updater) {
    Dep.target = this
    this.vm = vm
    this.key = key
    this.updater = updater
    this.vm[key]
    Dep.target = null
  }

  update() {
    console.log(this.key + '的watcher更新了')
    this.updater && this.updater(this.vm[this.key])
  }
}