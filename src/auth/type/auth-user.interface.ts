import { UserType } from "src/user/type/user-type.enum";

export interface AuthUser {
  id: string;
  type: UserType;
  isNew?: boolean;
}
