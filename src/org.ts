import axios from 'axios';

export class Organization {
  public id: number = -1;
  public name: string = '';
  public description: string = '';
}

export class OrganizationOPS {
  public static createOrg(org: Organization) {
    return axios.post('/api/v1/org', {
      name: org.name,
      description: org.description
    });
  }

  public static editOrg(org: Organization) {
    return axios.put('/api/v1/org', {
      id: org.id,
      name: org.name,
      description: org.description
    });
  }

  public static deleteOrg(org: Organization) {
    return axios.delete('/api/v1/org', { data: { id: org.id } });
  }
}
