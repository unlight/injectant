/// <reference path="reflection.d.ts" />

/**
 * Type for what object is instances of
 */
export interface Type<T = any> {
    new (...args: any[]): T;
}

/**
 * The Injector stores services and resolves requested instances.
 */
export const Injector = new (class {
    /**
     * Resolves instances by injecting required services
     * @param {Type<any>} target
     * @returns {T}
     */
    resolve<T extends Type>(target: T): InstanceType<T> {
        // tokens are required dependencies, while injections are resolved tokens from the Injector
        let tokens: Type[] = Reflect.getMetadata('design:paramtypes', target) || [];
        let injections = tokens.map(token => Injector.resolve<any>(token));

        return new target(...injections);
    }

    /**
     * Alias of resolve.
     */
    get = this.resolve;
})();

/**
 * Generic `ClassDecorator` type
 */
export type GenericClassDecorator<T> = (target: T) => void;

/**
 * @returns {GenericClassDecorator<Type>}
 * @constructor
 */
export const Service = (): GenericClassDecorator<Type> => {
    return (target: Type) => {
        // do something with `target`,
        // e.g. some kind of validation or passing it to the Injector and store them
    };
};

export { Service as Injectable };
