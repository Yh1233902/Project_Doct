from flask import Flask, render_template, request, redirect, url_for, session
import os

app = Flask(__name__)
app.secret_key = "eyhc_secret_key"

doctors = {"dr1": {"password": "123", "approved": False}}
patients = {}
appointments = {}

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        role = request.form["role"]
        username = request.form["username"]
        password = request.form["password"]

        if role == "doctor":
            doc = doctors.get(username)
            if doc and doc["password"] == password:
                if not doc["approved"]:
                    return "بإنتظار موافقة المدير لتفعيل الحساب."
                session["user"] = username
                session["role"] = "doctor"
                return redirect(url_for("dashboard"))

        elif role == "patient":
            pat = patients.get(username)
            if pat and pat["password"] == password:
                session["user"] = username
                session["role"] = "patient"
                return redirect(url_for("dashboard"))

    return render_template("login.html")

@app.route('/dashboard')
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))
    return f"أهلاً {session['user']}، أنت الآن في لوحة التحكم ({session['role']})"

@app.route('/admin')
def admin():
    output = "<h1>طلبات الأطباء</h1>"
    for username, info in doctors.items():
        if not info["approved"]:
            output += f"<p>{username} - <a href='/approve/{username}'>تفعيل</a></p>"
    return output

@app.route('/approve/<username>')
def approve(username):
    if username in doctors:
        doctors[username]["approved"] = True
    return redirect(url_for("admin"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
