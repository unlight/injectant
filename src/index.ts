/// <reference path="reflection.d.ts" />

/**
 * Type for what object is instances of
 */
export type Type<T = any> = new (...args: any[]) => T;

/**
 * The Injector stores services and resolves requested instances.
 */
export const Injector = new (class {
    /**
     * Alias of resolve.
     */
    get = this.resolve;
    private readonly providers = new Map();
    /**
     * Resolves instances by injecting required services
     */
    resolve<T extends Type>(target: T): InstanceType<T> {
        if (this.providers.has(target)) {
            target = this.providers.get(target);
        }
        // tokens are required dependencies, while injections are resolved tokens from the Injector
        const tokens: Type[] = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map(token => Injector.resolve<any>(token));
        return new target(...injections);
    }

    /**
     * Override type `target` by custom `provider`.
     */
    provide<T extends Type>(target: T, provider: Type) {
        this.providers.set(target, provider);
        return this;
    }

    /**
     * Clear custom providers, added by `provide` method.
     */
    clear() {
        this.providers.clear();
        return this;
    }
})();

/**
 * Generic `ClassDecorator` type
 */
export type GenericClassDecorator<T> = (target: T) => void;

export const Service = (): GenericClassDecorator<Type> => {
    return (target: Type) => {
        // do something with `target`,
        // e.g. some kind of validation or passing it to the Injector and store them
    };
};

export { Service as Injectable };
