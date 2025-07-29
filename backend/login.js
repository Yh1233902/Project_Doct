const readline = require('readline');
const { readDB } = require('./utils');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function questionAsync(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

async function login() {
  try {
    console.log("=== تسجيل الدخول ===");

    const email = await questionAsync("البريد الإلكتروني: ");
    const password = await questionAsync("كلمة المرور: ");
    const userType = await questionAsync("هل أنت دكتور أم مريض؟ (doctor/patient): ");

    const db = readDB();

    if (userType === 'doctor') {
      const doctor = db.doctors.find(d => d.email.toLowerCase() === email.toLowerCase() && d.password === password);

      if (!doctor) {
        console.log("⚠️ بيانات الدخول غير صحيحة.");
        rl.close();
        return;
      }

      if (doctor.status !== 'approved') {
        console.log("⚠️ حسابك لم يتم تفعيله بعد. يرجى الانتظار حتى الموافقة.");
        rl.close();
        return;
      }

      console.log(`\nمرحباً دكتور ${doctor.name}، تخصصك: ${doctor.specialty}`);
      console.log(`رقم التواصل (واتساب): ${doctor.phone}`);
      console.log(`عدد المرضى لديك: ${doctor.patients.length}`);

      const bookings = db.bookings.filter(b => b.doctorId === doctor.id);
      if (bookings.length === 0) {
        console.log("لا توجد حجوزات حالياً.");
      } else {
        console.log("الحجوزات:");
        bookings.forEach(b => {
          console.log(`- حجز رقم ${b.id}، المريض: ${b.patientName}, التاريخ: ${b.date}, الساعة: ${b.time}, الحالة: ${b.status}`);
        });
      }

    } else if (userType === 'patient') {
      const patient = db.patients.find(p => p.email.toLowerCase() === email.toLowerCase() && p.password === password);

      if (!patient) {
        console.log("⚠️ بيانات الدخول غير صحيحة.");
        rl.close();
        return;
      }

      console.log(`\nمرحباً ${patient.name}`);
      console.log(`رقم التواصل (واتساب): ${patient.phone}`);
      console.log(`رصيدك الحالي: ${patient.balance} ريال`);

      const bookings = db.bookings.filter(b => b.patientId === patient.id);
      if (bookings.length === 0) {
        console.log("لم تقم بأي حجز بعد.");
      } else {
        console.log("حجوزاتك:");
        bookings.forEach(b => {
          console.log(`- حجز رقم ${b.id}، عند دكتور: ${b.doctorName}, التاريخ: ${b.date}, الساعة: ${b.time}, الحالة: ${b.status}`);
        });
      }

    } else {
      console.log("يرجى اختيار النوع الصحيح: doctor أو patient");
    }

  } catch (error) {
    console.error("حدث خطأ:", error.message);
  } finally {
    rl.close();
  }
}

login();
