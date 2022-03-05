import { State } from './basic-state';
import { Project, ProjectStatus } from '../models/project';

//START PROJECT STATE MANAGEMENT CLASS:
export class ProjectState extends State<Project>{
    private _projects: Project[];
    private static  instance: ProjectState;

    constructor(){
        super();
        this._projects = [];
    }

    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance
    }
    
    addProject(project: Project){        
        this.projects.push(project);
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
            this.updateListener();
        }
    }

    moveProject(projectId: string, newStatus: ProjectStatus){
        const project = this.projects.find(p => p.id === projectId);
        if(project && project.status !== newStatus){
            project.status = newStatus;
            this.updateListener();
        }
    }

    private updateListener(){
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }

    set projects(newProjects){       
       this._projects = newProjects;
    }

     get projects(){
        return this._projects;
    }

    removeProject(projectId:string){
        const newProjects =this._projects.filter(project => project.id !== projectId);
        this._projects = newProjects;
    }
}

//Insure to have Single instance of project state
export const projectState = ProjectState.getInstance();

//END PROJECT STATE MANAGEMENT CLASS
