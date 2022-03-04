import { Require, AllowedLength, AllowedRange } from '../util/validator.js';

//START PROJECT CLASS
export enum ProjectStatus  {Active, Finished};

export class Project{
    id: string;
    @Require
    public title: string;
    @Require
    @AllowedLength
    public description: string;
    @AllowedRange
    public people: number;    
    public status: ProjectStatus

    constructor( t: string, d: string, p: number, status: ProjectStatus){
        this.id = Math.random().toString();
        this.title = t;
        this.description = d;
        this.people = p;
        this.status = status;
    }

}

//END PROJECT CLASS
