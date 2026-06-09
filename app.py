import sqlite3
from flask import Flask, redirect, render_template, request, session, redirect

app = Flask(__name__)
app.secret_key = "your_secret_key"

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO users(username,email,password)
            VALUES(?,?,?)
            """,
            (username, email, password)
        )

        conn.commit()
        conn.close()

        return "Registration Successful"

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT * FROM users
            WHERE email = ? AND password = ?
            """,
            (email, password)
        )

        user = cursor.fetchone()

        conn.close()

        if user:
            session["user_id"] = user[0]
            session["username"] = user[1]

        return redirect("/vault")
        return "Invalid Credentials"

    return render_template("login.html")

@app.route("/vault", methods=["GET", "POST"])
def vault():

    if "user_id" not in session:
        return redirect("/login")

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    if request.method == "POST":

        website = request.form["website"]
        username = request.form["vault_username"]
        password = request.form["vault_password"]

        cursor.execute(
            """
            INSERT INTO passwords
            (user_id, website, username, password)
            VALUES (?, ?, ?, ?)
            """,
            (
                session["user_id"],
                website,
                username,
                password
            )
        )

        conn.commit()

    cursor.execute(
        """
        SELECT * FROM passwords
        WHERE user_id = ?
        """,
        (session["user_id"],)
    )

    passwords = cursor.fetchall()

    conn.close()

    return render_template(
        "vault.html",
        username=session["username"],
        passwords=passwords
    )

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/login")

if __name__ == "__main__":
    app.run(debug=True)