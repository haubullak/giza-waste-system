// supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// 🔴 🔴 🔴 مهم جداً: استبدل هذه القيم بالبيانات من حساب Supabase الخاص بك 🔴 🔴 🔴
// اذهب إلى Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'      // <-- ضع رابط مشروعك هنا
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'                  // <-- ضع المفتاح العام هنا

// التحقق من وجود القيم
if (SUPABASE_URL === 'https://YOUR_PROJECT_ID.supabase.co' || SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
    console.warn('⚠️ تحذير: لم يتم تكوين Supabase بشكل صحيح. الرجاء إدخال SUPABASE_URL و SUPABASE_ANON_KEY')
}

// إنشاء عميل Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ========== دوال الطلبات (Requests) ==========

// حفظ طلب جديد
export async function saveRequest(requestData) {
    const { data, error } = await supabase
        .from('requests')
        .insert([{
            transaction_no: requestData.transactionNo,
            license_no: requestData.licenseNo,
            national_id: requestData.nationalId,
            citizen_name: requestData.citizenName,
            phone: requestData.phone,
            district: requestData.district,
            address: requestData.address,
            work_type: requestData.workType,
            length: requestData.length || null,
            width: requestData.width || null,
            area: requestData.area || null,
            depth: requestData.depth || null,
            floors: requestData.floors || null,
            volume: requestData.volume,
            engineer: requestData.engineer,
            payment_method: requestData.paymentMethod,
            total: requestData.total,
            refund_status: 'pending',
            lat: requestData.lat || null,
            lng: requestData.lng || null
        }])
        .select()
    
    if (error) {
        console.error('خطأ في saveRequest:', error)
        throw error
    }
    return data
}

// جلب جميع الطلبات (مع فلترة حسب صلاحية المستخدم)
export async function getRequests(userRole = null, userDistrict = null) {
    let query = supabase.from('requests').select('*')
    
    // فلترة حسب صلاحية المستخدم
    if (userRole === 'موظف حي' || userRole === 'مدير حي') {
        if (userDistrict) {
            query = query.eq('district', userDistrict)
        }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
        console.error('خطأ في getRequests:', error)
        throw error
    }
    return data
}

// تحديث حالة استرداد التأمين
export async function updateRefundStatus(transactionNo, licenseNo, phone) {
    const { data, error } = await supabase
        .from('requests')
        .update({ refund_status: 'refunded' })
        .eq('transaction_no', transactionNo)
        .eq('license_no', licenseNo)
        .eq('phone', phone)
        .select()
    
    if (error) {
        console.error('خطأ في updateRefundStatus:', error)
        throw error
    }
    return data
}

// حذف طلب
export async function deleteRequest(id) {
    const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id)
    
    if (error) {
        console.error('خطأ في deleteRequest:', error)
        throw error
    }
    return true
}

// ========== دوال المستخدمين (Users) ==========

// جلب جميع المستخدمين
export async function getUsers() {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true })
    
    if (error) {
        console.error('خطأ في getUsers:', error)
        throw error
    }
    return data
}

// إضافة مستخدم جديد
export async function addUser(userData) {
    const { data, error } = await supabase
        .from('users')
        .insert([{
            username: userData.username,
            password: userData.password,
            role: userData.role,
            district: userData.district || null,
            permissions: userData.permissions
        }])
        .select()
    
    if (error) {
        console.error('خطأ في addUser:', error)
        throw error
    }
    return data
}

// حذف مستخدم
export async function deleteUser(id) {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
    
    if (error) {
        console.error('خطأ في deleteUser:', error)
        throw error
    }
    return true
}

// التحقق من بيانات تسجيل الدخول
export async function verifyUser(username, password, role) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('role', role)
        .maybeSingle()
    
    if (error) {
        console.error('خطأ في verifyUser:', error)
        return null
    }
    return data
}

// ========== إتاحة الدوال للنطاق العام (للاستخدام في index.html) ==========
if (typeof window !== 'undefined') {
    window.supabaseFunctions = {
        saveRequest,
        getRequests,
        updateRefundStatus,
        deleteRequest,
        getUsers,
        addUser,
        deleteUser,
        verifyUser
    }
    window.supabase = supabase
    console.log('✅ Supabase client initialized successfully')
}