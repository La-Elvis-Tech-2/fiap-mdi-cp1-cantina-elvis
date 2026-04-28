import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);
const CART_KEY = '@fiap_cart';

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // Carregar carrinho salvo
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem(CART_KEY);
                if (json) setCart(JSON.parse(json));
            } catch (e) {
                console.warn('Erro ao carregar carrinho:', e);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    // Persistir sempre que o carrinho mudar
    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(CART_KEY, JSON.stringify(cart)).catch(console.warn);
    }, [cart, loaded]);

    const addToCart = (item) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const increase = (id) =>
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));

    const decrease = (id) =>
        setCart(prev =>
            prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
                .filter(i => i.qty > 0)
        );

    const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);

    const subtotal = cart.reduce((acc, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return acc + price * item.qty;
    }, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, increase, decrease, remove, clearCart, totalItems, subtotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);