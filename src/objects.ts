export type OrganizationStruct = {
  id: number;
  name: string;
  description: string;
}

export type UserStruct = {
  id: number;
  orgId: number;
  username: string;
  firstName: string;
  lastName: string;
  roleId: number | null;
  roleName: string | null;
  permission: number;
}

export type ItemStruct = {
  id: number;
  orgId: number;
  sku: string;
  name: string;
  description: string;
  iconPath: string;
  qty: number;
  price: number;
  reorderThreshold: number;
}

export class Organization {
  public id: number = -1;
  public name: string = '';
  public description: string = '';
}

export class User {
  constructor (user: UserStruct) {
    this.id = user.id;
    this.orgId = user.orgId;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.roleId = user.roleId;
    this.permission = user.permission;
  }
  public id: number = -1;
  public orgId: number = -1;
  public username: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public roleId: number | null = null;
  public roleName: string | null = null;
  public permission: number = 0;
}

export class Item {
  public id: number = -1;
  public orgId: number = -1;
  public sku: string = '';
  public name: string = '';
  public description: string = '';
  public iconPath: string = '';
  public qty: number = 0;
  public price: number = 0;
  public reorderThreshold: number = 0;
}

export class Role {
  public id: number = -1;
  public orgId: number = -1;
  public name: string = '';
  public permission: number = 0;
  public static readonly Permission = {
    /** Full control over all organizations */
    Root: 1 << 31,
    /** Full control over the user's respective organization */
    Administrator: 1 << 30,
    ManageUsers: 1 << 25,
    ManageInventory: 1 << 6,
    ViewInventory: 1 << 5,
    /** Ability to use and interact with the POS */
    POS: 1,
    None: 0
  };
}
