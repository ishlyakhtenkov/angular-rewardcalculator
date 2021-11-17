import { Employee } from "./employee";

export class EmployeeReward {
    id: number;
    employee: Employee;
    hoursWorked: number;
    hoursWorkedReward: number;
    additionalReward: number;
    penalty: number;

    constructor(id: number, employee: Employee, hoursWorked: number, hoursWorkedReward: number, 
                additionalReward: number, penalty: number) { 
        this.id = id;
        this.employee = employee;
        this.hoursWorked = hoursWorked;
        this.hoursWorkedReward = hoursWorkedReward;
        this.additionalReward = additionalReward;
        this.penalty = penalty;
    }
}