export class DepartmentRewardTo {
    id: number;
    departmentId: number;
    paymentPeriodId: number;
    allocatedAmount: number;

    constructor(id: number, departmentId: number, paymentPeriodId: number, allocatedAmount: number) { 
        this.id = id;
        this.departmentId = departmentId;
        this.paymentPeriodId = paymentPeriodId;
        this.allocatedAmount = allocatedAmount;
    }
}