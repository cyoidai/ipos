import { OrderItem } from "@/order";
import { Item } from '@/item';

export function deleteItem(orderItems: Map<string, OrderItem>, item: Item): Map<string, OrderItem> {
  const map = new Map<string, OrderItem>(orderItems);
  map.delete(item.sku);
  return map;
}

export function incrementItem(orderItems: Map<string, OrderItem>, item: Item): Map<string, OrderItem> {
  const map = new Map<string, OrderItem>(orderItems);
  if (map.has(item.sku))
    map.get(item.sku)!.orderQty++;
  else
    map.set(item.sku, { ...new OrderItem(), ...item, orderQty: 1 });
  return map;
}

export function decrementItem(orderItems: Map<string, OrderItem>, item: Item): Map<string, OrderItem> {
  const map = new Map<string, OrderItem>(orderItems);
  if (map.has(item.sku)) {
    const existing = map.get(item.sku)!;
    if (existing.orderQty > 1) {
      existing.orderQty--;
      return map;
    } else
      map.delete(item.sku);
    }
  return map;
}

export function setItemQty(orderItems: Map<string, OrderItem>, item: Item, qty: number): Map<string, OrderItem> {
  const map = new Map<string, OrderItem>(orderItems);
  if (qty <= 0) {
    map.delete(item.sku);
  } else {
    if (map.has(item.sku)) {
      map.get(item.sku)!.orderQty = qty;
    } else {
      map.set(item.sku, { ...new OrderItem(), ...item, orderQty: qty });
    }
  }
  return map;
}
