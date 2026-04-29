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
const GREEN = '#4CAF50';

function InputField({ label, icon, value, onChangeText, error, secureTextEntry, keyboardType, placeholder, onToggleSecure, showSecure, autoCapitalize }) {
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
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize={autoCapitalize || 'none'}
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
    wrap: { marginBottom: 14 },
    label: { fontSize: 12, fontWeight: '700', color: MUTED, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8 },
    row: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#222222', borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 14,
        borderWidth: 1, borderColor: BORDER,
    },
    rowFocused: { borderColor: PINK },
    rowError: { borderColor: ERROR },
    input: { flex: 1, color: WHITE, fontSize: 15, fontWeight: '500' },
    errorText: { fontSize: 12, color: ERROR, fontWeight: '500', marginTop: 6, marginLeft: 4 },
});

// Indicador de força da senha
function PasswordStrength({ password }) {
    if (!password) return null;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
    const colors = [ERROR, '#FF8C00', '#FFD700', '#7CB518', GREEN];

    return (
        <View style={{ marginTop: 8, marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
                {[0, 1, 2, 3, 4].map(i => (
                    <View key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        backgroundColor: i < strength ? colors[strength - 1] : '#333'
                    }} />
                ))}
            </View>
            <Text style={{ fontSize: 11, color: strength > 0 ? colors[strength - 1] : MUTED, fontWeight: '600' }}>
                {strength > 0 ? labels[strength - 1] : ''}
            </Text>
        </View>
    );
}

export default function RegisterScreen() {
    const { register } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

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
        if (!name.trim()) e.name = 'O nome é obrigatório.';
        else if (name.trim().length < 3) e.name = 'O nome deve ter pelo menos 3 caracteres.';

        if (!email.trim()) e.email = 'O e-mail é obrigatório.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Formato de e-mail inválido.';

        if (!password) e.password = 'A senha é obrigatória.';
        else if (password.length < 6) e.password = 'A senha deve ter pelo menos 6 caracteres.';

        if (!confirm) e.confirm = 'Confirme sua senha.';
        else if (confirm !== password) e.confirm = 'As senhas não coincidem.';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleRegister = async () => {
        setServerError('');
        if (!validate()) { shake(); return; }
        setLoading(true);
        try {
            await register({ name: name.trim(), email: email.trim(), password });
            router.replace('/(tabs)');
        } catch (err) {
            setServerError(err.message);
            shake();
        } finally {
            setLoading(false);
        }
    };

    const clearError = (field) => setErrors(e => ({ ...e, [field]: '' }));

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
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={20} color={WHITE} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleWrap}>
                        <View style={styles.accent} />
                        <Text style={styles.title}>Criar Conta</Text>
                    </View>
                    <Text style={styles.subtitle}>Preencha os dados abaixo para se cadastrar</Text>

                    <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>

                        {serverError ? (
                            <View style={styles.serverError}>
                                <Ionicons name="alert-circle-outline" size={16} color={ERROR} />
                                <Text style={styles.serverErrorText}>{serverError}</Text>
                            </View>
                        ) : null}

                        <InputField
                            label="Nome completo"
                            icon="person-outline"
                            value={name}
                            onChangeText={v => { setName(v); clearError('name'); }}
                            error={errors.name}
                            placeholder="Seu nome completo"
                            autoCapitalize="words"
                        />
                        <InputField
                            label="E-mail"
                            icon="mail-outline"
                            value={email}
                            onChangeText={v => { setEmail(v); clearError('email'); }}
                            error={errors.email}
                            keyboardType="email-address"
                            placeholder="seu@email.com"
                        />
                        <InputField
                            label="Senha"
                            icon="lock-closed-outline"
                            value={password}
                            onChangeText={v => { setPassword(v); clearError('password'); }}
                            error={errors.password}
                            secureTextEntry={!showPassword}
                            placeholder="Mínimo 6 caracteres"
                            onToggleSecure={() => setShowPassword(s => !s)}
                            showSecure={showPassword}
                        />
                        <PasswordStrength password={password} />

                        <View style={{ marginTop: 8 }}>
                            <InputField
                                label="Confirmar senha"
                                icon="shield-checkmark-outline"
                                value={confirm}
                                onChangeText={v => { setConfirm(v); clearError('confirm'); }}
                                error={errors.confirm}
                                secureTextEntry={!showConfirm}
                                placeholder="Repita a senha"
                                onToggleSecure={() => setShowConfirm(s => !s)}
                                showSecure={showConfirm}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color={WHITE} />
                                : <>
                                    <Ionicons name="checkmark-circle-outline" size={20} color={WHITE} />
                                    <Text style={styles.submitBtnText}>Criar conta</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
                        <Text style={styles.loginLinkText}>Já tem conta? <Text style={{ color: PINK }}>Entrar</Text></Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

    headerRow: { marginBottom: 24 },
    backBtn: {
        width: 42, height: 42, backgroundColor: CARD,
        borderRadius: 13, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },

    titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    accent: { width: 4, height: 28, backgroundColor: PINK, borderRadius: 2 },
    title: { fontSize: 30, fontWeight: '900', color: WHITE },
    subtitle: { fontSize: 14, color: MUTED, marginBottom: 28, lineHeight: 22 },

    card: {
        backgroundColor: CARD, borderRadius: 24,
        padding: 24, borderWidth: 1, borderColor: BORDER,
    },

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
        marginTop: 16,
        shadowColor: PINK, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    submitBtnDisabled: { opacity: 0.7 },
    submitBtnText: { color: WHITE, fontSize: 16, fontWeight: '900' },

    loginLink: { alignItems: 'center', marginTop: 24 },
    loginLinkText: { fontSize: 14, color: MUTED, fontWeight: '500' },
});