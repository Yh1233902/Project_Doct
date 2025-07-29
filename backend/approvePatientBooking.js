const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./database.json'));

function approveBooking(appointmentId) {
  const app = db.appointments.find(a => a.id == appointmentId);
  if (app) {
    app.approved = true;
    app.status = "تم تأكيد الموعد";
    fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
    console.log("✅ تم تأكيد الحجز");
  } else {
    console.log("❌ الحجز غير موجود");
  }
}

approveBooking(12345); // غيّر رقم الحجز حسب ما طلع
