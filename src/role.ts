import axios from 'axios';

export class RoleStruct {
  id: number = -1;
  orgId: number = -1;
  name: string = '';
  description: string = '';
  permission: number = 0;
}

export class Role {
  public static readonly Permission = {
    /** Full control over all organizations */
    Root: 1 << 31,
    /** Full control over the user's organization */
    Administrator: 1 << 30,
    /** Ability to create, edit, and delete users */
    ManageUsers: 1 << 25,
    ManageInventory: 1 << 6,
    ViewInventory: 1 << 5,
    /** Ability to use and interact with the POS */
    POS: 1,
    None: 0
  };

  public static createRole(role: RoleStruct) {
    return axios.post('/api/v1/role', {
      orgId: role.orgId,
      name: role.name,
      description: role.description,
      permission: role.permission
    });
  }

  public static editRole(role: RoleStruct) {
    return axios.put('/api/v1/role', {
      id: role.id,
      name: role.name,
      description: role.description,
      permission: role.permission
    });
  }

  public static deleteRole(role: RoleStruct) {
    return axios.delete('/api/v1/role', { data: { id: role.id } });
  }
}
