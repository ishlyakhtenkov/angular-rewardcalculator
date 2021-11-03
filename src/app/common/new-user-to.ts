import { Department } from "./department";

export class NewUserTo {
    id: string;
    name: string;
    email: string;
    password: string;
    enabled: boolean;
    roles: string[];
    managedDepartmentsId: string[];

    constructor(id: string, name: string, email: string, password: string, enabled: boolean, roles: string[], managedDepartmentsId: string[]) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.roles = roles;
        this.managedDepartmentsId = managedDepartmentsId;
    }
}