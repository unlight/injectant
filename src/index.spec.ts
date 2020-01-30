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
        constructor(private service: ParkService) {}
        go() {
            return this.service.welcome();
        }
    }

    const controller = Injector.resolve(ZooController);
    expect(controller.go()).toEqual('Welcome to park');
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
        let foo = Injector.resolve(Foo);
        expect(foo).toBeInstanceOf(Foo);
    });

    it('should create dependency injected instances', () => {
        let foobar = Injector.resolve(Foobar);
        expect(foobar.foo).toBeInstanceOf(Foo);
        expect(foobar.bar).toBeInstanceOf(Bar);
    });

    it('should create deep dependency injected instances', () => {
        let baz = Injector.resolve(Baz);
        expect(baz.foobar).toBeInstanceOf(Foobar);
        expect(baz.foobar.foo).toBeInstanceOf(Foo);
        expect(baz.foobar.bar).toBeInstanceOf(Bar);
    });
});
