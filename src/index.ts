/// <reference path="reflection.d.ts" />
type Type<T = any> = new (...arguments_: any[]) => T;
type PropertyTypeMetadata = { key: string | symbol; token: Type };
const PROPERTY_TYPE = 'inject:propertytype';

/**
 * The Injector stores services and resolves requested instances.
 */
export const Injector = new (class {
    /**
     * Alias of resolve.
     */
    get = this.resolve.bind(this);
    readonly providers = new Map();
    /**
     * Resolves instances by injecting required services
     */
    resolve<T extends Type = any>(target: T): InstanceType<T> {
        if (this.providers.has(target)) {
            target = this.providers.get(target);
        }
        // Tokens are required dependencies, while injections are resolved tokens from the Injector
        const tokens: Type[] = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map(token => Injector.resolve(token));
        const result = new target(...injections);
        const properties: PropertyTypeMetadata[] =
            Reflect.getMetadata(PROPERTY_TYPE, target) || [];
        for (const { key, token } of properties) {
            result[key] = Injector.resolve(token);
        }
        return result;
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

export const Service = (): ClassDecorator => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return target => {
        // do something with `target`,
        // e.g. some kind of validation or passing it to the Injector and store them
    };
};

export { Service as Injectable };

export function Inject<T = any>(token?: Type<T>): PropertyDecorator {
    return (target, key): void => {
        token = token || Reflect.getMetadata('design:type', target, key);
        if (!token) {
            throw new Error(`Could find token in ${target.constructor.name}`);
        }
        const properties: PropertyTypeMetadata[] =
            Reflect.getMetadata(PROPERTY_TYPE, target.constructor) || [];
        properties.push({ key, token });
        Reflect.defineMetadata(PROPERTY_TYPE, properties, target.constructor);
    };
}
