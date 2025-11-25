export type OrganizationStruct = {
  id: number;
  name: string;
  description: string;
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
