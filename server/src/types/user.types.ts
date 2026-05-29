import type { IAccount, IUser } from "@shared/types/user";

export interface CreateUserInput extends Pick<IUser, "name" | "email"> {
  password: string;
  accounts: IAccount[];
}
