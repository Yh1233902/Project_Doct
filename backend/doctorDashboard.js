const readline = require("readline");
const { readDB, writeDB } = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function questionAsync(query) {
  return new Promise((resolve) => rl.question(query, (ans) => resolve(ans.trim())));
}

async function doctorDashboard() {
  try {
    console.log("=== لوحة تحكم الدكتور ===");

    const email = await questionAsync("📧 البريد الإلكتروني: ");
    const password = await questionAsync("🔑 كلمة المرور: ");

    const db = readDB();
    const doctor = db.doctors.find(
      (d) => d.email === email && d.password === password && d.status === "approved"
    );

    if (!doctor) {
      console.log("⚠️ البيانات غير صحيحة أو لم يتم الموافقة على الحساب بعد.");
      rl.close();
      return;
    }

    console.log(`\n👨‍⚕️ مرحباً دكتور ${doctor.name}`);
    console.log("📋 مرضاك الحاليون:\n");

    const myBookings = db.bookings.filter((b) => b.doctorId === doctor.id);

    if (myBookings.length === 0) {
      console.log("لا يوجد حجوزات بعد.");
    } else {
      myBookings.forEach((b, index) => {
        const patient = db.patients.find((p) => p.id === b.patientId);
        console.log(
          `#${index + 1} - المريض: ${patient?.name || "غير معروف"} | التاريخ: ${b.date} | الوقت: ${b.time} | الخدمة: ${b.treatment} | الحالة: ${b.status}`
        );
      });
    }

    console.log("\n✅ يمكنك الآن متابعة المرضى أو تعديل حالاتهم من خلال أدوات لاحقة.");

  } catch (err) {
    console.error("❌ حدث خطأ:", err.message);
  } finally {
    rl.close();
  }
}

doctorDashboard();
