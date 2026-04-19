// supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// 🔴 استبدل هذه القيم بالبيانات من Supabase
const SUPABASE_URL = 'https://jnfcialmpikfxuquxdnx.supabase.co'  // ضع رابط مشروعك هنا
const SUPABASE_ANON_KEY = 'sb_publishable_JsFRREO8BtHf1Ns1_drG0Q_lgumbb0w'          // ضع المفتاح هنا

// إنشاء عميل Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// دوال مساعدة للتعامل مع قاعدة البيانات
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
      length: requestData.length,
      width: requestData.width,
      area: requestData.area,
      depth: requestData.depth,
      floors: requestData.floors,
      volume: requestData.volume,
      engineer: requestData.engineer,
      payment_method: requestData.paymentMethod,
      total: requestData.total,
      refund_status: 'pending',
      lat: requestData.lat,
      lng: requestData.lng
    }])
  
  if (error) throw error
  return data
}

export async function getRequests(userRole, userDistrict = null) {
  let query = supabase.from('requests').select('*')
  
  // فلترة حسب صلاحية المستخدم
  if (userRole === 'موظف حي' || userRole === 'مدير حي') {
    query = query.eq('district', userDistrict)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateRefundStatus(transactionNo, licenseNo, phone) {
  const { data, error } = await supabase
    .from('requests')
    .update({ refund_status: 'refunded' })
    .eq('transaction_no', transactionNo)
    .eq('license_no', licenseNo)
    .eq('phone', phone)
  
  if (error) throw error
  return data
}

export async function deleteRequest(id) {
  const { error } = await supabase
    .from('requests')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data
}

export async function addUser(userData) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
  
  if (error) throw error
  return data
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function verifyUser(username, password, role) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .eq('role', role)
    .single()
  
  if (error) return null
  return data
}