const readline = require('readline');
const { readDB, writeDB } = require('./utils');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function questionAsync(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

async function patientDashboard() {
  console.log("=== لوحة تحكم المريض ===");

  const email = await questionAsync("📧 أدخل بريدك الإلكتروني: ");
  const password = await questionAsync("🔑 أدخل كلمة المرور: ");

  const db = readDB();
  const patient = db.patients.find(p => p.email.toLowerCase() === email.toLowerCase() && p.password === password);

  if (!patient) {
    console.log("⚠️ بيانات غير صحيحة أو لم تسجل الدخول.");
    rl.close();
    return;
  }

  console.log(`👋 مرحباً ${patient.name}`);

  // عرض خدمات كل الأطباء المعتمدين (approved)
  console.log("\n📋 خدمات الأطباء والأسعار:");
  db.doctors.filter(d => d.status === 'approved').forEach(d => {
    console.log(`- دكتور ${d.name} (${d.specialty}): السعر 50$ (مثال)`);
  });

  // عرض حجوزات المريض
  const bookings = db.bookings.filter(b => b.patientEmail.toLowerCase() === email.toLowerCase());
  if (bookings.length === 0) {
    console.log("\n📅 لا يوجد لديك مواعيد محجوزة.");
  } else {
    console.log("\n📅 مواعيدك الحالية:");
    bookings.forEach(b => {
      console.log(`- مع دكتور ID:${b.doctorId} في ${b.date} الساعة ${b.time}, الحالة: ${b.status || 'معلقة'}`);
    });
  }

  console.log("\n📱 تواصل مع الدكتور عبر واتساب بالرقم: 0998637326");

  rl.close();
}

patientDashboard();
