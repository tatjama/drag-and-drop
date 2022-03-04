

namespace App{
       //START PROJECT STATE MANAGEMENT CLASS:
type Listener<T> = (items: T[]) => void;

export class State<T>{
    protected listeners: Listener<T>[];

    constructor(){
        this.listeners = [];
    }

    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }    
}
}