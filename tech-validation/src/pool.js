// 实体 ID 分配与对象池：验证第 5 项冻结约定（池化策略与 ID 规则）。
export class IdAllocator {
  constructor(prefix = 'E') {
    this.prefix = prefix;
    this.nextId = 1;
  }

  next() {
    return `${this.prefix}${this.nextId++}`;
  }
}

export class Pool {
  constructor(factory, { initial = 0 } = {}) {
    if (typeof factory !== 'function') throw new TypeError('Pool 需要 factory 函数');
    this.factory = factory;
    this.free = [];
    this.created = 0;
    this.active = 0;
    for (let i = 0; i < initial; i += 1) this.free.push(this.create());
  }

  create() {
    this.created += 1;
    return this.factory();
  }

  acquire() {
    const obj = this.free.pop() ?? this.create();
    this.active += 1;
    return obj;
  }

  release(obj) {
    this.active -= 1;
    this.free.push(obj);
    return obj;
  }

  get stats() {
    return { created: this.created, free: this.free.length, active: this.active };
  }
}
