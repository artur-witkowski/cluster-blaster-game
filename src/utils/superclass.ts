// Usage:
// class Gross extends Classes([Nose,Ear]) {
//   constructor() {
//     super();
//     this.gross = true;
//   }
// }
// ref: https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance

export function Classes(bases: (() => void)[]) {
  class Bases {
    constructor() {
      bases.forEach((base) => Object.assign(this, new (base as any)()));
    }
  }
  bases.forEach((base) => {
    Object.getOwnPropertyNames(base.prototype)
      .filter((prop) => prop != 'constructor')
      .forEach(
        (prop) => ((Bases as any).prototype[prop] = base.prototype[prop])
      );
  });
  return Bases;
}
