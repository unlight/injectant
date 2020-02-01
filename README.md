# injectant

Dependency injection implementation in TypeScript,
based on [nehalist.io/dependency-injection-in-typescript](https://nehalist.io/dependency-injection-in-typescript).

## Install

```sh
npm install injectant --save
```

## Peer Dependencies

Reflection (any of):

-   [reflect-metadata](https://github.com/rbuckton/reflect-metadata) is ~50K
-   [core-js/es7/reflect](https://github.com/zloirock/core-js) is ~80K
-   [@abraham/reflection](https://github.com/abraham/reflection) is ~3K

## Usage

```ts
import '@abraham/reflection';
import { Service, Injectable, Injector } from 'injectant';

@Service()
class Foo {}

@Injectable() // Injectable is alias of Service
class Bar {}

@Service()
class Foobar {
    constructor(public foo: Foo, public bar: Bar) {}
}

@Service()
class Baz {
    constructor(public foobar: Foobar) {}
}

let baz = Injector.resolve(Baz);
console.log(baz.foobar); // instance of Foobar
console.log(baz.foobar.foo); // instance of Foo
console.log(baz.foobar.bar); // instance of Bar
```

## Usage in unit tests

```ts
describe('Suite', () => {
    it('test baz', () => {
        Injector.provide(Foobar, MockFooBar);
        let baz = Injector.resolve(Baz);
        console.log(baz.foobar); // instance of MockFooBar
    });
});
```
