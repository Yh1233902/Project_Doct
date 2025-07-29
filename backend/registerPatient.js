const readline = require('readline');
const { readDB, writeDB, generateID } = require('./utils');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function questionAsync(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

async function registerPatient() {
  try {
    console.log("=== تسجيل مريض جديد ===");

    const name = await questionAsync("الاسم الكامل: ");
    const email = await questionAsync("البريد الإلكتروني: ");
    const password = await questionAsync("كلمة المرور: ");
    const phone = await questionAsync("رقم الهاتف (واتساب): ");

    if (!name || !email || !password || !phone) {
      console.log("⚠️ جميع الحقول مطلوبة.");
      rl.close();
      return;
    }

    const db = readDB();

    if (db.patients.find(p => p.email.toLowerCase() === email.toLowerCase())) {
      console.log("⚠️ هذا البريد الإلكتروني مسجل مسبقاً.");
      rl.close();
      return;
    }

    const newId = generateID(db.patients);

    const newPatient = {
      id: newId,
      name,
      email,
      password,
      phone,
      bookings: []
    };

    db.patients.push(newPatient);
    writeDB(db);

    console.log(`\n✅ تم التسجيل بنجاح! رقم المريض: ${newId}`);

  } catch (error) {
    console.error("حدث خطأ:", error.message);
  } finally {
    rl.close();
  }
}

registerPatient();
