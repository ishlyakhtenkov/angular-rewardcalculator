import { PaymentPeriod } from "./payment-period";

export class DepartmentReward {
    id: number;
    allocatedAmount: number;
    distributedAmount: number;
    paymentPeriod: PaymentPeriod;

    constructor(id: number, allocatedAmount: number, distributedAmount: number, paymentPeriod: PaymentPeriod) { 
        this.id = id;
        this.allocatedAmount = allocatedAmount;
        this.distributedAmount = distributedAmount;
        this.paymentPeriod = paymentPeriod;
    }
}