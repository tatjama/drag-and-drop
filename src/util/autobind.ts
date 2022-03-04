namespace App{
    export function Autobind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor){
        const originalMethod = descriptor.value;
        const adjustedMethod: PropertyDescriptor = {
            configurable: true,
            enumerable: false,
            get(){
                return originalMethod.bind(this)
            }
        };
        return adjustedMethod;
    }
}