import { BillLog } from "src/bill_logs/entities/bill_log.entity";
import { Bill } from "src/bills/entities/bill.entity";
import { User } from "src/user/entities/user.entity";

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedBill {
  bill: Bill[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedBillLog {
  billLog: BillLog[];
  total: number;
  page: number;
  limit: number;
}