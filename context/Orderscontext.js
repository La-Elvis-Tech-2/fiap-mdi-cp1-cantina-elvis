import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersContext = createContext(null);
const ORDERS_KEY = '@fiap_orders';

export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(ORDERS_KEY)
            .then(json => setOrders(json ? JSON.parse(json) : []))
            .catch(() => setOrders([]))
            .finally(() => setLoaded(true));
    }, []);

    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders)).catch(console.warn);
    }, [orders, loaded]);

    const addOrder = (cart, total) => {
        const order = {
            id: Date.now().toString(),
            items: cart,
            total,
            date: new Date().toISOString(),
        };
        setOrders(prev => [order, ...prev]);
        return order;
    };

    const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);

    return (
        <OrdersContext.Provider value={{ orders, addOrder, totalSpent }}>
            {children}
        </OrdersContext.Provider>
    );
}

export const useOrders = () => {
    const ctx = useContext(OrdersContext);
    if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
    return ctx;
};