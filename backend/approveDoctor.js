const readline = require('readline');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');

function readDB() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function questionAsync(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

async function approveDoctor() {
  try {
    const db = readDB();

    const pendingDoctors = db.doctors.filter(doc => doc.status === 'pending');

    if (pendingDoctors.length === 0) {
      console.log('لا يوجد دكاترة في انتظار الموافقة.');
      rl.close();
      return;
    }

    console.log('=== الدكاترة في انتظار الموافقة ===');
    pendingDoctors.forEach(doc => {
      console.log(`ID: ${doc.id} | الاسم: ${doc.name} | البريد: ${doc.email} | التخصص: ${doc.specialty}`);
    });

    const inputId = await questionAsync('أدخل رقم ID الدكتور للموافقة عليه: ');
    const doctorId = parseInt(inputId);

    if (isNaN(doctorId)) {
      console.log('⚠️ رقم ID غير صالح.');
      rl.close();
      return;
    }

    const doctor = db.doctors.find(d => d.id === doctorId && d.status === 'pending');

    if (!doctor) {
      console.log('⚠️ لم يتم العثور على الدكتور أو أنه تمت الموافقة عليه مسبقاً.');
      rl.close();
      return;
    }

    doctor.status = 'approved';
    writeDB(db);

    console.log(`✅ تم الموافقة على الدكتور: ${doctor.name}`);

  } catch (error) {
    console.error('حدث خطأ:', error.message);
  } finally {
    rl.close();
  }
}

approveDoctor();
