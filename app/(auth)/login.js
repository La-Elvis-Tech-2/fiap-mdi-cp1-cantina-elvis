import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator, Animated,
} from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const PINK = '#ED145B';
const BG = '#1A1A1A';
const CARD = '#2A2A2A';
const WHITE = '#FFFFFF';
const BORDER = '#333333';
const MUTED = '#888888';
const ERROR = '#FF4444';

function InputField({ label, icon, value, onChangeText, error, secureTextEntry, keyboardType, placeholder, onToggleSecure, showSecure }) {
    const [focused, setFocused] = useState(false);
    return (
        <View style={inputStyles.wrap}>
            <Text style={inputStyles.label}>{label}</Text>
            <View style={[
                inputStyles.row,
                focused && inputStyles.rowFocused,
                error && inputStyles.rowError,
            ]}>
                <Ionicons name={icon} size={18} color={error ? ERROR : focused ? PINK : MUTED} style={{ marginRight: 10 }} />
                <TextInput
                    style={inputStyles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={MUTED}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {onToggleSecure && (
                    <TouchableOpacity onPress={onToggleSecure}>
                        <Ionicons name={showSecure ? 'eye-off-outline' : 'eye-outline'} size={18} color={MUTED} />
                    </TouchableOpacity>
                )}
            </View>
            {error ? <Text style={inputStyles.errorText}>{error}</Text> : null}
        </View>
    );
}

const inputStyles = StyleSheet.create({
    wrap: { marginBottom: 16 },
    label: { fontSize: 12, fontWeight: '700', color: MUTED, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8 },
    row: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: CARD, borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 14,
        borderWidth: 1, borderColor: BORDER,
    },
    rowFocused: { borderColor: PINK },
    rowError: { borderColor: ERROR },
    input: { flex: 1, color: WHITE, fontSize: 15, fontWeight: '500' },
    errorText: { fontSize: 12, color: ERROR, fontWeight: '500', marginTop: 6, marginLeft: 4 },
});

export default function LoginScreen() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    // Animação de shake (diferencial)
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = 'O e-mail é obrigatório.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Formato de e-mail inválido.';
        if (!password) e.password = 'A senha é obrigatória.';
        else if (password.length < 6) e.password = 'A senha deve ter pelo menos 6 caracteres.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleLogin = async () => {
        setServerError('');
        if (!validate()) { shake(); return; }
        setLoading(true);
        try {
            await login({ email: email.trim(), password });
        } catch (err) {
            setServerError(err.message);
            shake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo / Branding */}
                    <View style={styles.brandWrap}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoText}>FIAP</Text>
                        </View>
                        <Text style={styles.appName}>Cantina Digital</Text>
                        <Text style={styles.appSub}>Faça seu login para continuar</Text>
                    </View>

                    {/* Card de formulário */}
                    <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
                        <Text style={styles.cardTitle}>Entrar</Text>

                        {serverError ? (
                            <View style={styles.serverError}>
                                <Ionicons name="alert-circle-outline" size={16} color={ERROR} />
                                <Text style={styles.serverErrorText}>{serverError}</Text>
                            </View>
                        ) : null}

                        <InputField
                            label="E-mail"
                            icon="mail-outline"
                            value={email}
                            onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })); }}
                            error={errors.email}
                            keyboardType="email-address"
                            placeholder="seu@email.com"
                        />
                        <InputField
                            label="Senha"
                            icon="lock-closed-outline"
                            value={password}
                            onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
                            error={errors.password}
                            secureTextEntry={!showPassword}
                            placeholder="Mínimo 6 caracteres"
                            onToggleSecure={() => setShowPassword(s => !s)}
                            showSecure={showPassword}
                        />

                        <TouchableOpacity
                            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color={WHITE} />
                                : <>
                                    <Ionicons name="log-in-outline" size={20} color={WHITE} />
                                    <Text style={styles.submitBtnText}>Entrar</Text>
                                </>
                            }
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>ou</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={() => router.push('/(auth)/register')}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="person-add-outline" size={18} color={PINK} />
                            <Text style={styles.secondaryBtnText}>Criar conta</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 },

    brandWrap: { alignItems: 'center', marginBottom: 36 },
    logoCircle: {
        width: 72, height: 72, borderRadius: 22,
        backgroundColor: PINK, alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, shadowColor: PINK, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },
    logoText: { fontSize: 22, fontWeight: '900', color: WHITE, letterSpacing: 2 },
    appName: { fontSize: 26, fontWeight: '900', color: WHITE, letterSpacing: 0.5, marginBottom: 6 },
    appSub: { fontSize: 14, color: MUTED, fontWeight: '400' },

    card: {
        backgroundColor: CARD, borderRadius: 24,
        padding: 24, borderWidth: 1, borderColor: BORDER,
    },
    cardTitle: { fontSize: 22, fontWeight: '900', color: WHITE, marginBottom: 20 },

    serverError: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#2D1010', borderRadius: 12,
        padding: 12, marginBottom: 16,
        borderWidth: 1, borderColor: '#4A1010',
    },
    serverErrorText: { color: ERROR, fontSize: 13, fontWeight: '600', flex: 1 },

    submitBtn: {
        backgroundColor: PINK, borderRadius: 14,
        paddingVertical: 16, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        marginTop: 8,
        shadowColor: PINK, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    submitBtnDisabled: { opacity: 0.7 },
    submitBtnText: { color: WHITE, fontSize: 16, fontWeight: '900' },

    divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
    dividerText: { fontSize: 12, color: MUTED, fontWeight: '600' },

    secondaryBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        borderRadius: 14, paddingVertical: 14,
        borderWidth: 1, borderColor: PINK, backgroundColor: '#1A0A10',
    },
    secondaryBtnText: { color: PINK, fontSize: 15, fontWeight: '800' },
});