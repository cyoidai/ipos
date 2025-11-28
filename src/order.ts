import { Item } from '@/item';
import { User } from '@/user';

export class OrderItem extends Item {
  public orderId: number = -1;
  public orderQty: number = 1;
}

export class Order {
  id: number = -1;
  orgId: number = -1;
  authorized_by: User = new User();
  items: OrderItem[] = [];
  time: Date = new Date();
}
