'use client';

import { useState } from 'react';
import useFetch from '@/useFetch';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Organization } from '@/org';

interface Order {
    id: number;
    subtotal: number;
    tax: number;
    total: number;
    time: number;
    itemCount: number;
    authorizedBy: { firstName: string; lastName: string };
}

function useSalesSummary(orders: Order[]) {
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrder = totalOrders ? totalSales / totalOrders : 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayUnix = todayStart.getTime() / 1000;

    const todaysSales = orders
        .filter(o => o.time >= todayUnix)
        .reduce((sum, o) => sum + o.total, 0);

    return { totalSales, totalOrders, avgOrder, todaysSales };
}

function SalesSummaryCard({ orders }: { orders: Order[] }) {
    const { totalSales, totalOrders, avgOrder, todaysSales } = useSalesSummary(orders);

    return (
        <div className="border rounded p-3 mb-4 bg-light" style={{ maxWidth: '400px' }}>
            <h4>Sales</h4>
            <div className="d-flex justify-content-between"><span>Total Sales:</span><b>${totalSales.toFixed(2)}</b></div>
            <div className="d-flex justify-content-between"><span>Total Orders:</span><b>{totalOrders}</b></div>
            <div className="d-flex justify-content-between"><span>Average Order:</span><b>${avgOrder.toFixed(2)}</b></div>
            <div className="d-flex justify-content-between"><span>Today&#39;s Sales:</span><b>${todaysSales.toFixed(2)}</b></div>
        </div>
    );
}

function OrdersTable({ orders }: { orders: Order[] }) {
    return (
        <div>
            <h3 className="my-3">Recent Orders</h3>
            <Table size="sm" hover>
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Transaction ID</th>
                    <th>Authorized By</th>
                    <th>Items</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((o, i) => (
                    <tr key={i}>
                        <td>{new Date(o.time * 1000).toLocaleString()}</td>
                        <td>{o.id}</td>
                        <td>{o.authorizedBy.firstName} {o.authorizedBy.lastName}</td>
                        <td>{o.itemCount}</td>
                        <td>${o.total.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default function Dashboard({
    org
}: {
    org: Organization
}) {
    const { data: orders, isLoading, error } = useFetch<Order[]>('/api/v1/order', { orgId: org.id });

    if (isLoading) return <main className="m-4">Loading...</main>;
    if (error) return <main className="m-4">Failed to load dashboard</main>;
    if (!orders || orders.length == 0) return <main className="m-4">No orders found...</main>;

    return (
        <main className="m-4">
            <h1 className="mb-4">Dashboard</h1>

            <SalesSummaryCard orders={orders} />
            <OrdersTable orders={orders} />
        </main>
    );
}
