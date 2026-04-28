import {
    View, Text, StyleSheet, SafeAreaView, StatusBar,
    TouchableOpacity, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/Orderscontext';

const PINK = '#ED145B';
const BG = '#1A1A1A';
const CARD = '#2A2A2A';
const WHITE = '#FFFFFF';
const BORDER = '#333333';
const MUTED = '#888888';
const GREEN = '#4CAF50';

function MenuItem({ icon, label, value, onPress, danger }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.menuIconWrap, danger && styles.menuIconWrapDanger]}>
                <Ionicons name={icon} size={20} color={danger ? PINK : MUTED} />
            </View>
            <View style={styles.menuInfo}>
                <Text style={[styles.menuLabel, danger && { color: PINK }]}>{label}</Text>
                {value ? <Text style={styles.menuValue}>{value}</Text> : null}
            </View>
            {!danger && <Ionicons name="chevron-forward" size={16} color={BORDER} />}
        </TouchableOpacity>
    );
}

function OrderHistoryItem({ order }) {
    const date = new Date(order.date);
    const formatted = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const shortId = order.id.slice(-4).toUpperCase();

    return (
        <View style={styles.orderItem}>
            <View style={styles.orderIconWrap}>
                <Ionicons name="bag-check-outline" size={18} color={GREEN} />
            </View>
            <View style={styles.orderInfo}>
                <Text style={styles.orderTitle}>Pedido #{shortId}</Text>
                <Text style={styles.orderDate}>{formatted}</Text>
                <Text style={styles.orderItems}>
                    {order.items.reduce((a, i) => a + i.qty, 0)} {order.items.reduce((a, i) => a + i.qty, 0) === 1 ? 'item' : 'itens'}
                </Text>
            </View>
            <Text style={styles.orderTotal}>R${order.total.toFixed(2)}</Text>
        </View>
    );
}

export default function ProfileScreen() {
    const { user, loading, logout } = useAuth();
    const { totalItems } = useCart();
    const { orders, totalSpent } = useOrders();

    if (loading || !user) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={PINK} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    const initials = user.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

    const handleLogout = () => {
        Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: logout },
        ]);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                <View style={styles.header}>
                    <View style={styles.sectionTitleWrap}>
                        <View style={styles.sectionAccent} />
                        <Text style={styles.headerTitle}>Conta</Text>
                    </View>
                </View>

                {/* Avatar */}
                <View style={styles.avatarCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={styles.avatarInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <View style={styles.userBadge}>
                            <Ionicons name="school-outline" size={12} color={PINK} />
                            <Text style={styles.userBadgeText}>Aluno FIAP</Text>
                        </View>
                    </View>
                </View>

                {/* Stats — agora com dados reais */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{totalItems}</Text>
                        <Text style={styles.statLabel}>No carrinho</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: GREEN + '55' }]}>
                        <Text style={[styles.statValue, { color: GREEN }]}>{orders.length}</Text>
                        <Text style={styles.statLabel}>Pedidos</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: PINK + '55' }]}>
                        <Text style={[styles.statValue, { color: PINK, fontSize: totalSpent >= 100 ? 16 : 20 }]}>
                            R${totalSpent.toFixed(0)}
                        </Text>
                        <Text style={styles.statLabel}>Total gasto</Text>
                    </View>
                </View>

                {/* Histórico de pedidos */}
                {orders.length > 0 && (
                    <View style={styles.menuSection}>
                        <Text style={styles.menuSectionLabel}>Histórico de pedidos</Text>
                        <View style={styles.menuCard}>
                            {orders.slice(0, 5).map((order, i) => (
                                <View key={order.id}>
                                    <OrderHistoryItem order={order} />
                                    {i < Math.min(orders.length, 5) - 1 && <View style={styles.menuDivider} />}
                                </View>
                            ))}
                            {orders.length > 5 && (
                                <View style={styles.moreOrders}>
                                    <Text style={styles.moreOrdersText}>+{orders.length - 5} pedidos anteriores</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

             

               

                <View style={[styles.menuSection, { marginTop: 4 }]}>
                    <View style={styles.menuCard}>
                        <MenuItem icon="log-out-outline" label="Sair da conta" danger onPress={handleLogout} />
                    </View>
                </View>

                <Text style={styles.version}>FIAP Cantina Digital v2.0 • CP2</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionAccent: { width: 4, height: 24, backgroundColor: PINK, borderRadius: 2 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: WHITE },
    avatarCard: { marginHorizontal: 20, marginBottom: 20, backgroundColor: CARD, borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 18, borderWidth: 1, borderColor: BORDER },
    avatar: { width: 70, height: 70, borderRadius: 22, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center', shadowColor: PINK, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
    avatarText: { fontSize: 26, fontWeight: '900', color: WHITE },
    avatarInfo: { flex: 1 },
    userName: { fontSize: 18, fontWeight: '900', color: WHITE, marginBottom: 4 },
    userEmail: { fontSize: 13, color: MUTED, marginBottom: 8 },
    userBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#2D1120', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#4A1A30', alignSelf: 'flex-start' },
    userBadgeText: { color: PINK, fontSize: 11, fontWeight: '700' },
    statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 24 },
    statCard: { flex: 1, backgroundColor: CARD, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: BORDER },
    statValue: { fontSize: 20, fontWeight: '900', color: WHITE, marginBottom: 4 },
    statLabel: { fontSize: 10, color: MUTED, textAlign: 'center', fontWeight: '500' },
    menuSection: { marginHorizontal: 20, marginBottom: 16 },
    menuSectionLabel: { fontSize: 11, fontWeight: '700', color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4 },
    menuCard: { backgroundColor: CARD, borderRadius: 18, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
    menuIconWrap: { width: 36, height: 36, backgroundColor: '#222222', borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BORDER },
    menuIconWrapDanger: { backgroundColor: '#2D1120', borderColor: '#4A1030' },
    menuInfo: { flex: 1 },
    menuLabel: { fontSize: 14, fontWeight: '600', color: WHITE },
    menuValue: { fontSize: 12, color: MUTED, marginTop: 2 },
    menuDivider: { height: 1, backgroundColor: BORDER, marginLeft: 66 },
    // Histórico
    orderItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
    orderIconWrap: { width: 36, height: 36, backgroundColor: '#1A2D1A', borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: GREEN + '44' },
    orderInfo: { flex: 1 },
    orderTitle: { fontSize: 13, fontWeight: '700', color: WHITE, marginBottom: 2 },
    orderDate: { fontSize: 11, color: MUTED, marginBottom: 1 },
    orderItems: { fontSize: 11, color: MUTED },
    orderTotal: { fontSize: 14, fontWeight: '900', color: GREEN },
    moreOrders: { padding: 14, alignItems: 'center', borderTopWidth: 1, borderTopColor: BORDER },
    moreOrdersText: { fontSize: 12, color: MUTED, fontWeight: '600' },
    version: { textAlign: 'center', color: MUTED, fontSize: 11, marginTop: 12, marginBottom: 8 },
});