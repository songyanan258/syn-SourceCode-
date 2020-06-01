class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      this.compile(this.$el);
    }
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(vnode => {
      if (this.isElement(vnode)) {
        this.compileElement(vnode);
      } else if (this.isInter(vnode)) {
        this.compileText(vnode)
      }
      if (vnode.childNodes && vnode.childNodes.length > 0) {
        this.compile(vnode)
      }
    })
  }

  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(item => {
      const name = item.name;
      const val = item.value;
      if (name.indexOf('v-') > -1) {
        const dir = name.substring(2);
        this[dir] && this[dir](node, val)
      } else if (name.indexOf('@') > -1) {
        const dir = name.substring(1)
        node.addEventListener(dir, this.$vm[val].bind(this.$vm));
      }
    })
  }

  compileText(node) {
    const exp = RegExp.$1;
    this.update(node, exp, 'text')
  }
  text(node, key) {
    this.update(node, key, 'text')
  }

  html(node, key) {
    this.update(node, key, 'html')
  }

  model(node, key) {
    this.update(node, key, 'model');
    node.addEventListener('input', (event) => {
      this.$vm[key] = event.target.value;
    })
  }
  cn
  update(node, key, type) {
    const updater = this[type + 'Updater'];
    updater && updater.call(this, node, this.$vm[key]);
    new Watcher(this.$vm, key, function (val) {
      updater && updater(node, val);
    })
  }

  textUpdater(node, val) {
    node.textContent = val;
  }

  htmlUpdater(node, val) {
    node.innerHTML = val;
    this.compile(node);
  }

  modelUpdater(node, val) {
    node.value = val;
  }

  isElement(node) {
    return node.nodeType === 1;
  }

  isInter(node) {
    const res = node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    return res;
  }
}