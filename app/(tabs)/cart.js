import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/Orderscontext';

const PINK = '#ED145B';
const BG = '#1A1A1A';
const CARD = '#2A2A2A';
const WHITE = '#FFFFFF';
const BORDER = '#333333';
const MUTED = '#888888';
const GREEN = '#4CAF50';

const SUGGESTED = [
    { id: '5', name: 'Hambúrguer X', weight: '80 gm.', price: 5.0, image: require('../../assets/burguer2.jpg') },
    { id: '6', name: 'Água Mineral', weight: '500 ml.', price: 3.5, image: require('../../assets/agua.jpg') },
    { id: '3', name: 'Misto Quente', weight: '150 gm.', price: 9.5, image: require('../../assets/misto.jpg') },
];

function CartItem({ item }) {
    const { increase, decrease, remove } = useCart();
    const effectivePrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

    return (
        <View style={styles.cartItem}>
            <View style={styles.cartItemImageWrap}>
                <Image source={item.image} style={styles.cartItemImage} resizeMode="cover" />
                {item.discount && (
                    <View style={styles.cartDiscountBadge}>
                        <Text style={styles.cartDiscountText}>{item.discount}%</Text>
                    </View>
                )}
            </View>
            <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.cartItemWeight}>{item.weight}</Text>
                <View style={styles.cartItemPriceRow}>
                    {item.discount && (
                        <Text style={styles.cartItemPriceOriginal}>R${item.price.toFixed(2)}</Text>
                    )}
                    <Text style={styles.cartItemPrice}>R${effectivePrice.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.cartItemControls}>
                <TouchableOpacity style={styles.removeBtn} onPress={() => remove(item.id)}>
                    <Ionicons name="trash-outline" size={14} color={PINK} />
                </TouchableOpacity>
                <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => decrease(item.id)}>
                        <Ionicons name="remove" size={16} color={WHITE} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnActive]} onPress={() => increase(item.id)}>
                        <Ionicons name="add" size={16} color={WHITE} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.cartItemSubtotal}>R${(effectivePrice * item.qty).toFixed(2)}</Text>
            </View>
        </View>
    );
}

function SuggestedCard({ item }) {
    const { addToCart } = useCart();
    return (
        <View style={styles.suggestedCard}>
            <Image source={item.image} style={styles.suggestedImage} resizeMode="cover" />
            <Text style={styles.suggestedName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.suggestedWeight}>{item.weight}</Text>
            <View style={styles.suggestedFooter}>
                <Text style={styles.suggestedPrice}>R${item.price.toFixed(2)}</Text>
                <TouchableOpacity style={styles.suggestedAddBtn} onPress={() => addToCart(item)}>
                    <Ionicons name="add" size={18} color={WHITE} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function EmptyCart() {
    return (
        <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
                <Ionicons name="bag-outline" size={56} color={PINK} />
            </View>
            <Text style={styles.emptyTitle}>Carrinho vazio</Text>
            <Text style={styles.emptySubtitle}>Adicione itens da cantina para começar seu pedido.</Text>
        </View>
    );
}

export default function CartScreen() {
    const router = useRouter();
    const { cart, clearCart, totalItems, subtotal } = useCart();
    const { addOrder } = useOrders();

    const itemDiscount = cart.reduce((acc, item) => {
        if (!item.discount) return acc;
        return acc + (item.price - item.price * (1 - item.discount / 100)) * item.qty;
    }, 0);

    const total = subtotal;

    const handleCheckout = () => {
        const order = addOrder(cart, total);
        clearCart();
        router.push({
            pathname: '/order',
            params: {
                total: total.toFixed(2),
                itemCount: totalItems,
                orderId: order.id,
            },
        });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />

            <View style={styles.header}>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Meu Carrinho</Text>
                    {totalItems > 0 && (
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{totalItems}</Text>
                        </View>
                    )}
                </View>
                {cart.length > 0 && (
                    <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
                        <Ionicons name="trash-outline" size={18} color={MUTED} />
                    </TouchableOpacity>
                )}
            </View>

            {cart.length === 0 ? (
                <EmptyCart />
            ) : (
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
                    <View style={styles.sectionBlock}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleWrap}>
                                <View style={styles.sectionAccent} />
                                <Text style={styles.sectionTitle}>Itens do Pedido</Text>
                            </View>
                            <Text style={styles.itemCount}>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</Text>
                        </View>
                        {cart.map(item => <CartItem key={item.id} item={item} />)}
                    </View>

                    <View style={styles.sectionBlock}>
                        <View style={styles.summaryCard}>
                            <View style={styles.sectionTitleWrap}>
                                <View style={styles.sectionAccent} />
                                <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
                            </View>
                            <View style={styles.summaryRows}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Subtotal</Text>
                                    <Text style={styles.summaryValue}>R${subtotal.toFixed(2)}</Text>
                                </View>
                                {itemDiscount > 0 && (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Desconto</Text>
                                        <Text style={[styles.summaryValue, { color: GREEN }]}>-R${itemDiscount.toFixed(2)}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryTotalRow}>
                                <Text style={styles.summaryTotalLabel}>Total</Text>
                                <Text style={styles.summaryTotalValue}>R${total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.sectionBlock}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleWrap}>
                                <View style={styles.sectionAccent} />
                                <Text style={styles.sectionTitle}>Adicionar ao Pedido</Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestedList}>
                            {SUGGESTED.map(item => <SuggestedCard key={item.id} item={item} />)}
                        </ScrollView>
                    </View>

                    <View style={styles.checkoutFooter}>
                        <View>
                            <Text style={styles.checkoutLabel}>Total</Text>
                            <Text style={styles.checkoutTotal}>R${total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
                            <Ionicons name="bag-check-outline" size={20} color={WHITE} />
                            <Text style={styles.checkoutBtnText}>Finalizar Pedido</Text>
                            <Ionicons name="arrow-forward" size={18} color={WHITE} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },
    container: { backgroundColor: BG },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 16, marginBottom: 16 },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: WHITE },
    headerBadge: { backgroundColor: PINK, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
    headerBadgeText: { color: WHITE, fontSize: 11, fontWeight: '800' },
    clearBtn: { width: 40, height: 40, backgroundColor: CARD, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BORDER },
    sectionBlock: { marginHorizontal: 20, marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionAccent: { width: 4, height: 18, backgroundColor: PINK, borderRadius: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: WHITE },
    itemCount: { fontSize: 12, color: MUTED, fontWeight: '600' },
    cartItem: { flexDirection: 'row', backgroundColor: CARD, borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: BORDER, alignItems: 'center', gap: 12 },
    cartItemImageWrap: { width: 72, height: 72, borderRadius: 14, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#3A1020', flexShrink: 0 },
    cartItemImage: { width: '100%', height: '100%' },
    cartDiscountBadge: { position: 'absolute', top: 4, left: 4, backgroundColor: PINK, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2 },
    cartDiscountText: { color: WHITE, fontSize: 9, fontWeight: '900' },
    cartItemInfo: { flex: 1 },
    cartItemName: { fontSize: 13, fontWeight: '700', color: WHITE, marginBottom: 3, lineHeight: 18 },
    cartItemWeight: { fontSize: 11, color: MUTED, marginBottom: 6 },
    cartItemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cartItemPriceOriginal: { fontSize: 11, color: MUTED, textDecorationLine: 'line-through' },
    cartItemPrice: { fontSize: 14, fontWeight: '800', color: WHITE },
    cartItemControls: { alignItems: 'center', gap: 8, flexShrink: 0 },
    removeBtn: { width: 28, height: 28, backgroundColor: '#2D1120', borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4A1030' },
    qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
    qtyBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: CARD },
    qtyBtnActive: { backgroundColor: PINK },
    qtyText: { width: 28, textAlign: 'center', fontSize: 14, fontWeight: '800', color: WHITE },
    cartItemSubtotal: { fontSize: 13, fontWeight: '800', color: PINK },
    summaryCard: { backgroundColor: CARD, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: BORDER },
    summaryRows: { marginTop: 14, gap: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { fontSize: 14, color: MUTED },
    summaryValue: { fontSize: 14, color: WHITE, fontWeight: '700' },
    summaryDivider: { height: 1, backgroundColor: BORDER, marginVertical: 16 },
    summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryTotalLabel: { fontSize: 17, color: WHITE, fontWeight: '900' },
    summaryTotalValue: { fontSize: 22, color: PINK, fontWeight: '900' },
    suggestedList: { gap: 12, paddingBottom: 4 },
    suggestedCard: { width: 140, backgroundColor: CARD, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: BORDER },
    suggestedImage: { width: '100%', height: 80, borderRadius: 10, marginBottom: 10 },
    suggestedName: { fontSize: 12, fontWeight: '700', color: WHITE, marginBottom: 2, lineHeight: 16 },
    suggestedWeight: { fontSize: 10, color: MUTED, marginBottom: 8 },
    suggestedFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    suggestedPrice: { fontSize: 14, fontWeight: '800', color: WHITE },
    suggestedAddBtn: { width: 30, height: 30, backgroundColor: PINK, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    checkoutFooter: { backgroundColor: '#1A1A1Aee', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: BORDER, flexDirection: 'row', alignItems: 'center', gap: 16 },
    checkoutLabel: { fontSize: 12, color: MUTED, marginBottom: 2 },
    checkoutTotal: { fontSize: 22, fontWeight: '900', color: WHITE },
    checkoutBtn: { flex: 1, backgroundColor: PINK, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    checkoutBtnText: { color: WHITE, fontSize: 15, fontWeight: '900' },
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
    emptyIconWrap: { width: 100, height: 100, backgroundColor: '#2D1120', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#4A1030' },
    emptyTitle: { fontSize: 24, fontWeight: '900', color: WHITE, marginBottom: 10 },
    emptySubtitle: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 22 },
});