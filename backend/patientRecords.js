const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./database.json'));

function viewPatientData(email) {
  const patientAppointments = db.appointments.filter(a => a.patientEmail === email && a.approved);

  if (!patientAppointments.length) {
    console.log("⚠️ لم يتم الحجز بعد");
    return;
  }

  patientAppointments.forEach(app => {
    console.log(`📅 التاريخ: ${app.date} - 🕐 ${app.time}`);
    console.log(`🦷 المعالجة: ${app.treatment}`);
    console.log(`📌 الحالة: ${app.status}`);
    console.log("——————————————");
  });
}

viewPatientData("mohammad@example.com");
