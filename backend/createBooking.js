const readline = require('readline');
const { readDB, writeDB, generateID } = require('./utils');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function questionAsync(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

async function createBooking() {
  try {
    console.log("=== حجز موعد جديد ===");

    const patientEmail = await questionAsync("أدخل بريدك الإلكتروني (المريض): ");
    const doctorIdStr = await questionAsync("أدخل رقم ID الدكتور: ");
    const date = await questionAsync("تاريخ الموعد (YYYY-MM-DD): ");
    const time = await questionAsync("وقت الموعد (HH:MM): ");
    const treatment = await questionAsync("نوع المعالجة/الخدمة: ");

    const doctorId = parseInt(doctorIdStr);

    if (!patientEmail || isNaN(doctorId) || !date || !time || !treatment) {
      console.log("⚠️ جميع الحقول مطلوبة.");
      rl.close();
      return;
    }

    const db = readDB();

    const patient = db.patients.find(p => p.email.toLowerCase() === patientEmail.toLowerCase());
    if (!patient) {
      console.log("⚠️ المريض غير مسجل.");
      rl.close();
      return;
    }

    const doctor = db.doctors.find(d => d.id === doctorId && d.status === 'approved');
    if (!doctor) {
      console.log("⚠️ الدكتور غير موجود أو غير مفعل.");
      rl.close();
      return;
    }

    const newBooking = {
      id: generateID(db.bookings),
      patientEmail,
      doctorId,
      date,
      time,
      treatment,
      status: "pending" // بانتظار موافقة الدكتور
    };

    db.bookings.push(newBooking);
    writeDB(db);

    console.log(`\n✅ تم إرسال طلب الحجز بنجاح. رقم الحجز: ${newBooking.id}`);

  } catch (error) {
    console.error("حدث خطأ أثناء الحجز:", error.message);
  } finally {
    rl.close();
  }
}

createBooking();
