import '@abraham/reflection';

import { Injectable, Injector, Service } from '.';

it('smoke', () => {
    expect(Injectable).toBeTruthy();
});

it('cat', () => {
    @Injectable()
    class Cat {
        sound = () => 'meow';
    }
    const cat = Injector.get(Cat);
    expect(cat.sound()).toEqual('meow');
});

it('three tier', () => {
    @Injectable()
    class ParkService {
        welcome = () => 'Welcome to park';
    }

    @Injectable()
    class ZooController {
        constructor(private readonly service: ParkService) {}
        go() {
            return this.service.welcome();
        }
    }

    const controller = Injector.resolve(ZooController);
    expect(controller.go()).toEqual('Welcome to park');
});

it('provide and reset', () => {
    @Injectable()
    class Cat {
        sound = () => 'meow';
    }

    class Fluffy {
        sound = () => 'FluffyMEEOOW';
    }

    Injector.provide(Cat, Fluffy);
    let cat = Injector.get(Cat);
    expect(cat.sound()).toEqual('FluffyMEEOOW');

    Injector.clear();
    cat = Injector.get(Cat);
    expect(cat.sound()).toEqual('meow');
});

describe('Injector', () => {
    @Service()
    class Foo {}

    @Service()
    class Bar {}

    @Service()
    class Foobar {
        constructor(public foo: Foo, public bar: Bar) {}
    }

    @Service()
    class Baz {
        constructor(public foobar: Foobar) {}
    }

    it('should create simple instances', () => {
        const foo = Injector.resolve(Foo);
        expect(foo).toBeInstanceOf(Foo);
    });

    it('should create dependency injected instances', () => {
        const foobar = Injector.resolve(Foobar);
        expect(foobar.foo).toBeInstanceOf(Foo);
        expect(foobar.bar).toBeInstanceOf(Bar);
    });

    it('should create deep dependency injected instances', () => {
        const baz = Injector.resolve(Baz);
        expect(baz.foobar).toBeInstanceOf(Foobar);
        expect(baz.foobar.foo).toBeInstanceOf(Foo);
        expect(baz.foobar.bar).toBeInstanceOf(Bar);
    });
});
