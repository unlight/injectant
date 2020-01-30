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
    /**
     * Resolves instances by injecting required services
     */
    resolve<T extends Type>(target: T): InstanceType<T> {
        // tokens are required dependencies, while injections are resolved tokens from the Injector
        const tokens: Type[] = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map(token => Injector.resolve<any>(token));

        return new target(...injections);
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
