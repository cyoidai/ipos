export type Organization = {
  id: number,
  name: string,
  description: string
};

export type User = {
  id: number,
  orgId: number,
  username: string,
  firstName: string,
  lastName: string,
  roleId?: number,
  roleName?: string
  permission: number
};
