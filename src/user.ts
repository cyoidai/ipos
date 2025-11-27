import axios from 'axios';

export class User {
  id: number = -1;
  orgId: number = -1;
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  roleId: number | null = null;
  roleName: string | null = null;
  permission: number = 0;
}

export class UserOPS {
  public static createUser(user: User, password: string) {
    return axios.post('/api/v1/user', {
      orgId: user.orgId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: password,
      roleId: user.roleId
    });
  }
  public static editUser(user: User) {
    return axios.put('/api/v1/user', {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId
    });
  }
  public static deleteUser(user: User) {
    return axios.delete('/api/v1/user', { data: user.id });
  }
}
