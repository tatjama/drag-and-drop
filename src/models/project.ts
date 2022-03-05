import * as Validator from '../util/validator';

//START PROJECT CLASS
export enum ProjectStatus  { Active, Finished };

export class Project{
    id: string;
    @Validator.Require
    public title: string;
    @Validator.Require
    @Validator.AllowedLength
    public description: string;
    @Validator.AllowedRange
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
