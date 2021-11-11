import { Department } from "./department";

export class NewUserTo {
    id: number;
    name: string;
    email: string;
    password: string;
    enabled: boolean;
    roles: string[];
    managedDepartmentsId: number[];

    constructor(id: number, name: string, email: string, password: string, enabled: boolean, roles: string[], managedDepartmentsId: number[]) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.roles = roles;
        this.managedDepartmentsId = managedDepartmentsId;
    }
}