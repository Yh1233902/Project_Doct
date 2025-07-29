const readline = require('readline');
const { readDB, writeDB, generateID } = require('./utils');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function questionAsync(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

async function registerDoctor() {
  try {
    console.log("=== تسجيل دكتور جديد ===");

    const name = await questionAsync("الاسم الكامل: ");
    const email = await questionAsync("البريد الإلكتروني: ");
    const password = await questionAsync("كلمة المرور: ");
    const specialty = await questionAsync("التخصص: ");
    const phone = await questionAsync("رقم الهاتف (واتساب): ");

    if (!name || !email || !password || !specialty || !phone) {
      console.log("⚠️ جميع الحقول مطلوبة.");
      rl.close();
      return;
    }

    const db = readDB();

    if (db.doctors.find(doc => doc.email.toLowerCase() === email.toLowerCase())) {
      console.log("⚠️ هذا البريد الإلكتروني مسجل مسبقاً.");
      rl.close();
      return;
    }

    const newId = generateID(db.doctors);

    const newDoctor = {
      id: newId,
      name,
      email,
      password,
      specialty,
      phone,
      status: "pending",
      patients: []
    };

    db.doctors.push(newDoctor);
    writeDB(db);

    console.log(`\n✅ تم إرسال طلب التسجيل بنجاح، بانتظار الموافقة. رقم ID: ${newId}`);

  } catch (error) {
    console.error("حدث خطأ:", error.message);
  } finally {
    rl.close();
  }
}

registerDoctor();
