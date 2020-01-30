import '@abraham/reflection';
import { Injectable, Injector } from '.';

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
