import { Department } from "./department";

export class UserTo {
    id: string;
    name: string;
    email: string;
    enabled: boolean;
    roles: string[];
    managedDepartmentsId: string[];

    constructor(id: string, name: string, email: string, enabled: boolean, roles: string[], managedDepartmentsId: string[]) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.enabled = enabled;
        this.roles = roles;
        this.managedDepartmentsId = managedDepartmentsId;
    }
}