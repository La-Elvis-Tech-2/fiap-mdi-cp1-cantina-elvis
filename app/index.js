import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { View } from 'react-native';

function App() {
    const ctx = require.context('./app');
    return (
        <AuthProvider>
            <CartProvider>
                <ExpoRoot context={ctx} />
            </CartProvider>
        </AuthProvider>
    );
}

registerRootComponent(App);