// 对象池与实体 ID 规则（与 tech-validation/src/pool.js 一致）
export class Pool {
  private factory: () => any;
  private free: any[] = [];
  public created = 0;
  public active = 0;

  constructor(factory: () => any, initial = 0) {
    this.factory = factory;
    for (let i = 0; i < initial; i += 1) this.free.push(this.create());
  }

  private create(): any {
    this.created += 1;
    return this.factory();
  }

  acquire(): any {
    const obj = this.free.pop() ?? this.create();
    this.active += 1;
    return obj;
  }

  release(obj: any): any {
    this.active -= 1;
    this.free.push(obj);
    return obj;
  }
}
