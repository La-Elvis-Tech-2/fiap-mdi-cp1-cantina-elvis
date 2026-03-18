import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    TextInput,
    Animated,
} from 'react-native';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';


// ─── Constants ────────────────────────────────────────────────────────────────

const PINK = '#ED145B';
const BG = '#1A1A1A';
const CARD = '#2A2A2A';
const WHITE = '#FFFFFF';
const BORDER = '#333333';
const MUTED = '#888888';
const GREEN = '#4CAF50';


// ─── Mock Cart Data ───────────────────────────────────────────────────────────

const INITIAL_CART = [
    {
        id: '1',
        name: 'Coxinha de Frango',
        weight: '120 gm.',
        price: 6.0,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200&q=80',
        discount: null,
        qty: 2,
    },
    {
        id: '2',
        name: 'Suco de Laranja',
        weight: '300 ml.',
        price: 8.0,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80',
        discount: 10,
        qty: 1,
    },
    {
        id: '7',
        name: 'Brownie de Chocolate',
        weight: '90 gm.',
        price: 7.0,
        image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200&q=80',
        discount: 15,
        qty: 1,
    },
    {
        id: '4',
        name: 'Café Coado',
        weight: '200 ml.',
        price: 4.0,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80',
        discount: null,
        qty: 3,
    },
];

const SUGGESTED = [
    {
        id: 's1',
        name: 'Pão de Queijo',
        weight: '80 gm.',
        price: 5.0,
        image: 'https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?w=200&q=80',
    },
    {
        id: 's2',
        name: 'Água Mineral',
        weight: '500 ml.',
        price: 3.5,
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=80',
    },
    {
        id: 's3',
        name: 'Misto Quente',
        weight: '150 gm.',
        price: 9.5,
        image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=200&q=80',
    },
];


// ─── CartItem ─────────────────────────────────────────────────────────────────

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
    const effectivePrice = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;

    return (
        <View style={styles.cartItem}>
            <View style={styles.cartItemImageWrap}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} resizeMode="cover" />
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
                        <Text style={styles.cartItemPriceOriginal}>
                            R${item.price.toFixed(2)}
                        </Text>
                    )}
                    <Text style={styles.cartItemPrice}>
                        R${effectivePrice.toFixed(2)}
                    </Text>
                </View>
            </View>

            <View style={styles.cartItemControls}>
                <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(item.id)}>
                    <Ionicons name="trash-outline" size={14} color={PINK} />
                </TouchableOpacity>

                <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => onDecrease(item.id)}>
                        <Ionicons name="remove" size={16} color={WHITE} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnActive]} onPress={() => onIncrease(item.id)}>
                        <Ionicons name="add" size={16} color={WHITE} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.cartItemSubtotal}>
                    R${(effectivePrice * item.qty).toFixed(2)}
                </Text>
            </View>
        </View>
    );
}


// ─── SuggestedCard ────────────────────────────────────────────────────────────

function SuggestedCard({ item, onAdd }) {
    return (
        <View style={styles.suggestedCard}>
            <Image source={{ uri: item.image }} style={styles.suggestedImage} resizeMode="cover" />
            <Text style={styles.suggestedName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.suggestedWeight}>{item.weight}</Text>
            <View style={styles.suggestedFooter}>
                <Text style={styles.suggestedPrice}>R${item.price.toFixed(2)}</Text>
                <TouchableOpacity style={styles.suggestedAddBtn} onPress={() => onAdd(item)}>
                    <Ionicons name="add" size={18} color={WHITE} />
                </TouchableOpacity>
            </View>
        </View>
    );
}


// ─── OrderSummary ─────────────────────────────────────────────────────────────

function OrderSummary({ subtotal, discount, delivery, total }) {
    const rows = [
        { label: 'Subtotal', value: `R$${subtotal.toFixed(2)}`, highlight: false },
        { label: 'Desconto', value: `-R$${discount.toFixed(2)}`, highlight: true, color: GREEN },
    ];

    return (
        <View style={styles.summaryCard}>
            <View style={styles.sectionTitleWrap}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
            </View>

            <View style={styles.summaryRows}>
                {rows.map((row, i) => (
                    <View key={i} style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{row.label}</Text>
                        <Text style={[
                            styles.summaryValue,
                            row.highlight && { color: row.color }
                        ]}>
                            {row.value}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>R${total.toFixed(2)}</Text>
            </View>
        </View>
    );
}


// ─── EmptyCart ────────────────────────────────────────────────────────────────

function EmptyCart() {
    return (
        <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
                <Ionicons name="bag-outline" size={56} color={PINK} />
            </View>
            <Text style={styles.emptyTitle}>Carrinho vazio</Text>
            <Text style={styles.emptySubtitle}>Adicione itens da cantina para começar seu pedido.</Text>
            <TouchableOpacity style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Explorar Cantina</Text>
                <Ionicons name="arrow-forward" size={16} color={WHITE} />
            </TouchableOpacity>
        </View>
    );
}


// ─── CartScreen ───────────────────────────────────────────────────────────────

export default function CartScreen() {
    const [cart, setCart] = useState(INITIAL_CART);
    const [deliveryMode, setDeliveryMode] = useState('retirada');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);

    const deliveryPrice = deliveryMode === 'entrega' ? 3.0 : 0;

    const subtotal = cart.reduce((acc, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return acc + price * item.qty;
    }, 0);

    const itemDiscount = cart.reduce((acc, item) => {
        if (!item.discount) return acc;
        return acc + (item.price - item.price * (1 - item.discount / 100)) * item.qty;
    }, 0);

    const couponAmt = couponDiscount > 0 ? subtotal * couponDiscount : 0;
    const totalDiscount = itemDiscount + couponAmt;
    const total = subtotal + deliveryPrice;

    const increase = (id) =>
        setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));

    const decrease = (id) =>
        setCart(c => c.map(i => i.id === id
            ? i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
            : i
        ).filter(i => !(i.id === id && i.qty === 1)));

    const remove = (id) => setCart(c => c.filter(i => i.id !== id));

    const addSuggested = (item) => {
        setCart(c => {
            const exists = c.find(i => i.id === item.id);
            if (exists) return c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            return [...c, { ...item, qty: 1, discount: null }];
        });
    };

    const handleCoupon = (code) => {
        setCouponDiscount(code ? 0.1 : 0);
    };

    if (checkoutSuccess) {
        return (
            <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="light-content" backgroundColor={BG} />
                <View style={styles.successWrap}>
                    <View style={styles.successIconWrap}>
                        <Ionicons name="checkmark-circle" size={72} color={GREEN} />
                    </View>
                    <Text style={styles.successTitle}>Pedido Confirmado!</Text>
                    <Text style={styles.successSub}>Seu pedido foi enviado para a cantina.</Text>
                    <View style={styles.successCard}>
                        <View style={styles.successRow}>
                            <Text style={styles.successLabel}>Total pago</Text>
                            <Text style={styles.successValue}>R${total.toFixed(2)}</Text>
                        </View>
                        <View style={styles.successRow}>
                            <Text style={styles.successLabel}>Modo</Text>
                            <Text style={styles.successValue}>
                                {deliveryMode === 'retirada' ? 'Retirada na Cantina' : 'Entrega no Andar'}
                            </Text>
                        </View>
                        <View style={styles.successRow}>
                            <Text style={styles.successLabel}>Previsão</Text>
                            <Text style={[styles.successValue, { color: GREEN }]}>
                                {deliveryMode === 'retirada' ? '~10 minutos' : '~20 minutos'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.backHomeBtn}
                        onPress={() => { setCheckoutSuccess(false); setCart(INITIAL_CART); }}
                    >
                        <Ionicons name="home-outline" size={18} color={WHITE} />
                        <Text style={styles.backHomeBtnText}>Voltar ao Início</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Meu Carrinho</Text>
                    {cart.length > 0 && (
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{cart.reduce((a, i) => a + i.qty, 0)}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.clearBtn} onPress={() => setCart([])}>
                    <Ionicons name="trash-outline" size={18} color={MUTED} />
                </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
                <EmptyCart />
            ) : (
                <>
                    <ScrollView
                        style={styles.container}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 160 }} // importante pro conteúdo não ficar atrás do footer
                    >
                        {/* Items Section */}
                        <View style={styles.sectionBlock}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleWrap}>
                                    <View style={styles.sectionAccent} />
                                    <Text style={styles.sectionTitle}>Itens do Pedido</Text>
                                </View>
                                <Text style={styles.itemCount}>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</Text>
                            </View>

                            {cart.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onIncrease={increase}
                                    onDecrease={decrease}
                                    onRemove={remove}
                                />
                            ))}
                        </View>

                        {/* Order Summary */}
                        <View style={styles.sectionBlock}>
                            <OrderSummary
                                subtotal={subtotal}
                                discount={totalDiscount}
                                delivery={deliveryPrice}
                                total={total}
                            />
                        </View>

                        {/* Suggested */}
                        <View style={styles.sectionBlock}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleWrap}>
                                    <View style={styles.sectionAccent} />
                                    <Text style={styles.sectionTitle}>Adicionar ao Pedido</Text>
                                </View>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.suggestedList}
                            >
                                {SUGGESTED.map(item => (
                                    <SuggestedCard key={item.id} item={item} onAdd={addSuggested} />
                                ))}
                            </ScrollView>
                        </View>
                    </ScrollView>

                </>
            )}
        </SafeAreaView>
    );
}


// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },

    // container sem flex: 1 pra não disputar com o footer absoluto
    container: { backgroundColor: BG },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: 20, marginTop: 16
    },
    backBtn: {
        width: 40, height: 40, backgroundColor: CARD,
        borderRadius: 12, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: WHITE, letterSpacing: 0.3 },
    headerBadge: {
        backgroundColor: PINK, borderRadius: 20,
        paddingHorizontal: 8, paddingVertical: 2,
    },
    headerBadgeText: { color: WHITE, fontSize: 11, fontWeight: '800' },
    clearBtn: {
        width: 40, height: 40, backgroundColor: CARD,
        borderRadius: 12, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },

    // Sections
    sectionBlock: { marginHorizontal: 20, marginBottom: 20 },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 14,
    },
    sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionAccent: { width: 4, height: 18, backgroundColor: PINK, borderRadius: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: WHITE },
    itemCount: { fontSize: 12, color: MUTED, fontWeight: '600' },

    // Cart Item
    cartItem: {
        flexDirection: 'row', backgroundColor: CARD,
        borderRadius: 18, padding: 14, marginBottom: 12,
        borderWidth: 1, borderColor: BORDER,
        alignItems: 'center', gap: 12,
    },
    cartItemImageWrap: {
        width: 72, height: 72, borderRadius: 14,
        overflow: 'hidden', position: 'relative',
        borderWidth: 1, borderColor: '#3A1020',
        flexShrink: 0,
    },
    cartItemImage: { width: '100%', height: '100%' },
    cartDiscountBadge: {
        position: 'absolute', top: 4, left: 4,
        backgroundColor: PINK, borderRadius: 8,
        paddingHorizontal: 5, paddingVertical: 2,
    },
    cartDiscountText: { color: WHITE, fontSize: 9, fontWeight: '900' },
    cartItemInfo: { flex: 1, justifyContent: 'center' },
    cartItemName: { fontSize: 13, fontWeight: '700', color: WHITE, marginBottom: 3, lineHeight: 18 },
    cartItemWeight: { fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: '500' },
    cartItemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cartItemPriceOriginal: {
        fontSize: 11, color: MUTED, fontWeight: '500',
        textDecorationLine: 'line-through',
    },
    cartItemPrice: { fontSize: 14, fontWeight: '800', color: WHITE },
    cartItemControls: { alignItems: 'center', gap: 8, flexShrink: 0 },
    removeBtn: {
        width: 28, height: 28, backgroundColor: '#2D1120',
        borderRadius: 8, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#4A1030',
    },
    qtyControl: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: BG, borderRadius: 12,
        borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
    },
    qtyBtn: {
        width: 30, height: 30, alignItems: 'center', justifyContent: 'center',
        backgroundColor: CARD,
    },
    qtyBtnActive: { backgroundColor: PINK },
    qtyText: { width: 28, textAlign: 'center', fontSize: 14, fontWeight: '800', color: WHITE },
    cartItemSubtotal: { fontSize: 13, fontWeight: '800', color: PINK },

    // Delivery (ainda não usado aqui, deixei igual)
    deliveryWrap: {},
    deliveryOptions: { gap: 10 },
    deliveryOption: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: CARD, borderRadius: 16, padding: 14,
        borderWidth: 1, borderColor: BORDER,
    },
    deliveryOptionActive: { borderColor: PINK, backgroundColor: '#2D1120' },
    deliveryIconWrap: {
        width: 46, height: 46, backgroundColor: BG,
        borderRadius: 14, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },
    deliveryIconWrapActive: { backgroundColor: PINK, borderColor: PINK },
    deliveryInfo: { flex: 1 },
    deliveryLabel: { fontSize: 13, fontWeight: '700', color: MUTED, marginBottom: 2 },
    deliveryLabelActive: { color: WHITE },
    deliveryEta: { fontSize: 11, color: MUTED, fontWeight: '500' },
    deliveryPriceWrap: { alignItems: 'flex-end', gap: 8 },
    deliveryPrice: { fontSize: 13, fontWeight: '700', color: WHITE },
    deliveryRadio: {
        width: 18, height: 18, borderRadius: 9,
        borderWidth: 2, borderColor: BORDER,
        alignItems: 'center', justifyContent: 'center',
    },
    deliveryRadioActive: { borderColor: PINK },
    deliveryRadioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: PINK },

    // Coupon (também mantido)
    couponWrap: {},
    couponRow: { flexDirection: 'row', gap: 10 },
    couponInputWrap: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: CARD, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
        borderWidth: 1, borderColor: BORDER,
    },
    couponInput: { flex: 1, color: WHITE, fontSize: 13, fontWeight: '600' },
    couponBtn: {
        backgroundColor: PINK, borderRadius: 14,
        paddingHorizontal: 18, justifyContent: 'center',
    },
    couponBtnApplied: { backgroundColor: '#3A3A3A' },
    couponBtnText: { color: WHITE, fontSize: 13, fontWeight: '800' },
    couponSuccessRow: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        marginTop: 8,
    },
    couponSuccessText: { color: GREEN, fontSize: 12, fontWeight: '600' },

    // Summary
    summaryCard: {
        backgroundColor: CARD, borderRadius: 18,
        padding: 18, borderWidth: 1, borderColor: BORDER,
    },
    summaryRows: { marginTop: 14, gap: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 14, color: MUTED, fontWeight: '500' },
    summaryValue: { fontSize: 14, color: WHITE, fontWeight: '700' },
    summaryDivider: {
        height: 1, backgroundColor: BORDER,
        marginVertical: 16,
    },
    summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryTotalLabel: { fontSize: 17, color: WHITE, fontWeight: '900' },
    summaryTotalValue: { fontSize: 22, color: PINK, fontWeight: '900' },

    // Suggested
    suggestedList: { gap: 12, paddingBottom: 4 },
    suggestedCard: {
        width: 140, backgroundColor: CARD, borderRadius: 16,
        padding: 12, borderWidth: 1, borderColor: BORDER,
    },
    suggestedImage: {
        width: '100%', height: 80, borderRadius: 10,
        marginBottom: 10, borderWidth: 1, borderColor: '#3A1020',
    },
    suggestedName: { fontSize: 12, fontWeight: '700', color: WHITE, marginBottom: 2, lineHeight: 16 },
    suggestedWeight: { fontSize: 10, color: MUTED, marginBottom: 8, fontWeight: '500' },
    suggestedFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    suggestedPrice: { fontSize: 14, fontWeight: '800', color: WHITE },
    suggestedAddBtn: {
        width: 30, height: 30, backgroundColor: PINK,
        borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    },

    // Checkout Footer FIXO
    checkoutFooter: {
        backgroundColor: '#1A1A1Aee',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: BORDER,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    checkoutSummary: {},
    checkoutLabel: { fontSize: 12, color: MUTED, fontWeight: '500', marginBottom: 2 },
    checkoutTotal: { fontSize: 22, fontWeight: '900', color: WHITE },
    checkoutBtn: {
        flex: 1, backgroundColor: PINK, borderRadius: 16,
        paddingVertical: 16, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 10,
    },
    checkoutBtnText: { color: WHITE, fontSize: 15, fontWeight: '900' },

    // Empty Cart
    emptyWrap: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIconWrap: {
        width: 100, height: 100, backgroundColor: '#2D1120',
        borderRadius: 28, alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, borderWidth: 1, borderColor: '#4A1030',
    },
    emptyTitle: { fontSize: 24, fontWeight: '900', color: WHITE, marginBottom: 10 },
    emptySubtitle: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
    emptyBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: PINK, borderRadius: 16,
        paddingHorizontal: 24, paddingVertical: 14,
    },
    emptyBtnText: { color: WHITE, fontSize: 15, fontWeight: '800' },

    // Success Screen
    successWrap: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 28,
    },
    successIconWrap: {
        width: 110, height: 110, backgroundColor: '#1A2D1A',
        borderRadius: 32, alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, borderWidth: 1, borderColor: '#2A4A2A',
    },
    successTitle: { fontSize: 28, fontWeight: '900', color: WHITE, marginBottom: 8 },
    successSub: { fontSize: 14, color: MUTED, marginBottom: 28, textAlign: 'center' },
    successCard: {
        width: '100%', backgroundColor: CARD, borderRadius: 18,
        padding: 20, borderWidth: 1, borderColor: BORDER, gap: 14, marginBottom: 28,
    },
    successRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    successLabel: { fontSize: 14, color: MUTED, fontWeight: '500' },
    successValue: { fontSize: 14, color: WHITE, fontWeight: '700' },
    backHomeBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: PINK, borderRadius: 16,
        paddingHorizontal: 28, paddingVertical: 16,
    },
    backHomeBtnText: { color: WHITE, fontSize: 15, fontWeight: '900' },
});