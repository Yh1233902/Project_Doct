const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');

// قراءة قاعدة البيانات
function readDB() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// كتابة قاعدة البيانات
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// توليد رقم ID فريد
function generateID(collection) {
  return collection.length ? collection[collection.length - 1].id + 1 : 1;
}

module.exports = {
  readDB,
  writeDB,
  generateID
};
