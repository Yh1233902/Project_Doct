const readline = require('readline');
const { readDB, writeDB } = require('./utils');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function questionAsync(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

async function approveBooking() {
  try {
    console.log("=== موافقة أو رفض حجز ===");

    const doctorEmail = await questionAsync("أدخل بريدك الإلكتروني (الدكتور): ");
    const db = readDB();

    const doctor = db.doctors.find(d => d.email.toLowerCase() === doctorEmail.toLowerCase() && d.status === 'approved');
    if (!doctor) {
      console.log("⚠️ هذا البريد غير موجود أو لم تتم الموافقة عليه.");
      rl.close();
      return;
    }

    const bookings = db.bookings.filter(b => b.doctorId === doctor.id && b.status === "pending");

    if (bookings.length === 0) {
      console.log("📭 لا يوجد حجوزات جديدة بانتظار الموافقة.");
      rl.close();
      return;
    }

    console.log("\n📋 قائمة الحجوزات بانتظار الموافقة:");
    bookings.forEach((b, i) => {
      console.log(`${i + 1}. رقم الحجز: ${b.id}, المريض: ${b.patientEmail}, التاريخ: ${b.date} - ${b.time}, الخدمة: ${b.treatment}`);
    });

    const choiceStr = await questionAsync("\nاكتب رقم الحجز الذي تريد الموافقة عليه (أو 0 للخروج): ");
    const choice = parseInt(choiceStr);

    if (isNaN(choice) || choice < 0 || choice > bookings.length) {
      console.log("❌ اختيار غير صالح.");
      rl.close();
      return;
    }

    if (choice === 0) {
      console.log("🚪 تم الإلغاء.");
      rl.close();
      return;
    }

    const selectedBooking = bookings[choice - 1];

    selectedBooking.status = "approved";
    writeDB(db);

    console.log(`✅ تمت الموافقة على الحجز رقم ${selectedBooking.id} بنجاح.`);

  } catch (error) {
    console.error("❌ خطأ:", error.message);
  } finally {
    rl.close();
  }
}

approveBooking();
