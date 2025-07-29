const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readDB, writeDB, generateID } = require('./utils');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// تسجيل دكتور
app.post('/api/register-doctor', (req, res) => {
  const { name, email, password, specialty, phone } = req.body;
  const db = readDB();

  if (db.doctors.find(doc => doc.email === email)) {
    return res.status(400).json({ message: '⚠️ الدكتور موجود مسبقاً' });
  }

  const newDoctor = {
    id: generateID(db.doctors),
    name,
    email,
    password,
    specialty,
    phone,
    status: 'pending',
    patients: []
  };

  db.doctors.push(newDoctor);
  writeDB(db);
  res.json({ message: '✅ تم تسجيل الدكتور بنجاح', doctorId: newDoctor.id });
});

// تسجيل مريض
app.post('/api/register-patient', (req, res) => {
  const { name, email, password, phone } = req.body;
  const db = readDB();

  if (db.patients.find(p => p.email === email)) {
    return res.status(400).json({ message: '⚠️ المريض مسجل مسبقاً' });
  }

  const newPatient = {
    id: generateID(db.patients),
    name,
    email,
    password,
    phone
  };

  db.patients.push(newPatient);
  writeDB(db);
  res.json({ message: '✅ تم تسجيل المريض بنجاح', patientId: newPatient.id });
});

// حجز موعد
app.post('/api/book', (req, res) => {
  const { patientEmail, doctorId, date, time, treatment } = req.body;
  const db = readDB();

  const patient = db.patients.find(p => p.email === patientEmail);
  const doctor = db.doctors.find(d => d.id === parseInt(doctorId) && d.status === 'approved');

  if (!patient || !doctor) {
    return res.status(400).json({ message: '⚠️ بيانات غير صحيحة أو الدكتور غير مفعل' });
  }

  const newBooking = {
    id: generateID(db.bookings),
    doctorId: doctor.id,
    patientId: patient.id,
    date,
    time,
    treatment,
    status: 'pending'
  };

  db.bookings.push(newBooking);
  writeDB(db);
  res.json({ message: '✅ تم الحجز بنجاح', bookingId: newBooking.id });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
