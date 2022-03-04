namespace App{
    interface ValidatorConfig{
        [property: string]: {
            [validatableProperty: string]: string[];
        } 
    }
    
    const registeredValidators: ValidatorConfig = {}
    
    export const Require = (target: any, propName: string) => {
        registeredValidators[target.constructor.name] ={
            ...registeredValidators[target.constructor.name],
            [propName]: [ ...(registeredValidators[target.constructor.name]?.[propName]??[]), 'required']
        }   
    }
    
    export const AllowedRange = (target: any, propName: string) => {
        registeredValidators[target.constructor.name] ={
            ...registeredValidators[target.constructor.name],
            [propName]: [ ...(registeredValidators[target.constructor.name]?.[propName]??[]), 'allowed-range']
        }    
    }
    export const AllowedLength = (target: any, propName: string) => {
        registeredValidators[target.constructor.name] ={
            ...registeredValidators[target.constructor.name],
            [propName]: [ ...(registeredValidators[target.constructor.name]?.[propName]??[]), 'allowed-length']
        }    
    }
    
    export const validate = (obj:any) => {
        const objectValidationConfig = registeredValidators[obj.constructor.name];
        if(!objectValidationConfig) return true;
        let isValid = true;
        for(const prop in objectValidationConfig){
            for(const validator of objectValidationConfig[prop]){            
                switch(validator){
                    case 'required':
                        isValid = isValid && obj[prop].trim().length > 0;
                        break;
                    case 'allowed-range':
                        isValid = isValid && obj[prop] > 0 && obj[prop] <6;
                        break;
                    case 'allowed-length':
                        isValid = isValid && obj[prop].trim().length > 4 && obj[prop].trim().length < 11
                }
            }
        } 
        return isValid;
    }
    
}