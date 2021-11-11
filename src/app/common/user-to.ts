import { Department } from "./department";

export class UserTo {
    id: number;
    name: string;
    email: string;
    roles: string[];
    managedDepartmentsId: number[];

    constructor(id: number, name: string, email: string, roles: string[], managedDepartmentsId: number[]) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.managedDepartmentsId = managedDepartmentsId;
    }
}