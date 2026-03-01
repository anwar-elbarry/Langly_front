import { RoleResponse } from "../../features/auth/models/role.response";

export interface SidebarModel {
  label: string;
  icon : string;
  route: string;
  roles?: RoleResponse[];
}