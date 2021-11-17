export class EmployeeRewardTo {
    id: number;
    hoursWorked: number;
    additionalReward: number;
    penalty: number;

    constructor(id: number, hoursWorked: number, additionalReward: number, penalty: number) { 
        this.id = id;
        this.hoursWorked = hoursWorked;
        this.additionalReward = additionalReward;
        this.penalty = penalty;
    }
}