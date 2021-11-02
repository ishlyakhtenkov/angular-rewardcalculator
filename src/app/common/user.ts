import { Department } from "./department";

export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    enabled: boolean;
    registered: Date;
    roles: string[];
    managedDepartments: Department[];

    constructor(id: string, name: string, email: string, password: string, enabled: boolean, roles: string[], managedDepartments: Department[]) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.roles = roles;
        this.managedDepartments = managedDepartments;
    }
}