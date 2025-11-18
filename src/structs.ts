export class Organization {
  public id: number = -1;
  public name: string = '';
  public description: string = '';
}

export class User {
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
  public iconPath: string | null = '';
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
