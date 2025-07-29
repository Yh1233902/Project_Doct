const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./database.json'));

function bookAppointment(patientEmail, doctorEmail, date, time, treatment) {
  const doctor = db.doctors.find(d => d.email === doctorEmail && d.status === "approved");
  const patient = db.patients.find(p => p.email === patientEmail);

  if (!doctor || !patient) return console.log("❌ تحقق من البريد");

  const appointment = {
    id: Math.floor(Math.random() * 100000),
    patientEmail,
    doctorEmail,
    date,
    time,
    treatment,
    approved: false,
    status: "بانتظار موافقة الطبيب"
  };

  db.appointments.push(appointment);
  fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
  console.log("📅 تم إرسال طلب الحجز");
}

bookAppointment("mohammad@example.com", "ahmad@example.com", "2025-08-01", "11:00", "تنظيف أسنان");
