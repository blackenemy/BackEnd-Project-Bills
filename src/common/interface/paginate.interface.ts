import { User } from "src/user/entities/user.entity";

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
