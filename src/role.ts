import axios from 'axios';

export class Role {
  public id: number = -1;
  public orgId: number = -1;
  public name: string = '';
  public description: string = '';
  public permission: number = 0;
}

export class RoleOPS {
  public static readonly Permission = {
    /** Full control over all organizations */
    Root: 1 << 31,
    /** Full control over the user's organization */
    Administrator: 1 << 30,
    /** Ability to create, modify, and delete users */
    ManageUsers: 1 << 26,
    /** Ability to create, modify, and delete roles */
    ManageRoles: 1 << 25,
    /** Ability to generate and view previously generated reports */
    Reports: 1 << 20,
    /** View shift history of all users */
    ViewShiftHistory: 1 << 13,
    ViewOrderHistory: 1 << 12,
    ManageInventory: 1 << 6,
    ViewInventory: 1 << 5,
    ManageSchedules: 1 << 4,
    ViewSchedule: 1 << 2,
    /** Ability to create orders and interact with the POS interface */
    POS: 1 << 1,
    ClockInOut: 1 << 0,
    None: 0
  };

  public static readonly PermissionList: {
    name: string,
    description?: string,
    value: number
  }[] = [
    {
      name: 'Root',
      description: 'Has full control over all organizations',
      value: RoleOPS.Permission.Root
    },
    {
      name: 'Administrator',
      description: 'Grants full control over the organization. This permission overrides all other permissions and should be given out sparingly.',
      value: RoleOPS.Permission.Administrator
    },
    {
      name: 'Manage users',
      description: 'Ability to create, modify (this includes assigning roles), and delete users.',
      value: RoleOPS.Permission.ManageUsers
    },
    {
      name: 'Manage roles',
      description: 'Ability to create, modify, and delete roles.',
      value: RoleOPS.Permission.ManageRoles
    },
    {
      name: 'Reports',
      description: 'Ability to generate and view previously generated reports.',
      value: RoleOPS.Permission.Reports
    },
    {
      name: 'View shift history',
      description: 'Ability to view clock-in and clock-out times of all users.',
      value: RoleOPS.Permission.ViewShiftHistory
    },
    {
      name: 'View order history',
      value: RoleOPS.Permission.ViewOrderHistory
    },
    {
      name: 'Manage inventory',
      description: 'Ability to create, edit, and delete items. This permission also grants restock notifications.',
      value: RoleOPS.Permission.ManageInventory
    },
    {
      name: 'View inventory',
      description: 'Ability to view inventory state: items, stock counts, etc. but not modify anything.',
      value: RoleOPS.Permission.ViewInventory
    },
    {
      name: 'Manage schedules',
      description: 'Ability to create, edit, and delete schedules.',
      value: RoleOPS.Permission.ManageSchedules
    },
    {
      name: 'View schedule',
      description: 'Ability to view current and upcoming schedules',
      value: RoleOPS.Permission.ViewSchedule
    },
    {
      name: 'POS',
      description: 'View and interact the point-of-sale interface. This allows the user to ',
      value: RoleOPS.Permission.POS
    },
    {
      name: 'Clock-in/out',
      description: 'Ability to clock-in and clock-out as well as see previous clock in/out history.',
      value: RoleOPS.Permission.ClockInOut
    }
  ];

  public static createRole(role: Role) {
    return axios.post('/api/v1/role', {
      orgId: role.orgId,
      name: role.name,
      description: role.description,
      permission: role.permission
    });
  }

  public static editRole(role: Role) {
    return axios.put('/api/v1/role', {
      id: role.id,
      name: role.name,
      description: role.description,
      permission: role.permission
    });
  }

  public static deleteRole(role: Role) {
    return axios.delete('/api/v1/role', { data: { id: role.id } });
  }
}
