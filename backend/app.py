import os
from flask import Flask, redirect, url_for, session, jsonify
from flask_dance.contrib.github import make_github_blueprint, github
from flask_dance.contrib.google import make_google_blueprint, google
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

# GitHub OAuth
github_blueprint = make_github_blueprint(
    client_id=os.getenv("GITHUB_OAUTH_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_OAUTH_CLIENT_SECRET"),
    redirect_to="http://localhost:3000/" # Redirect to frontend after login
)
app.register_blueprint(github_blueprint, url_prefix="/login")

# Google OAuth
google_blueprint = make_google_blueprint(
    client_id=os.getenv("GOOGLE_OAUTH_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_OAUTH_CLIENT_SECRET"),
    scope=["profile", "email"],
    redirect_to="http://localhost:3000/" # Redirect to frontend after login
)
app.register_blueprint(google_blueprint, url_prefix="/login")

@app.route("/")
def index():
    return "Welcome to the ResumeBoost AI backend!"

@app.route("/api/profile")
def profile():
    user = None
    if github.authorized:
        resp = github.get("/user")
        if resp.ok:
            user = {"provider": "github", "profile": resp.json()}
    elif google.authorized:
        resp = google.get("/oauth2/v2/userinfo")
        if resp.ok:
            user = {"provider": "google", "profile": resp.json()}

    return jsonify({"logged_in": user is not None, "user": user})


@app.route("/logout")
def logout():
    session.clear()
    return jsonify({"logged_in": False, "user": None})


if __name__ == "__main__":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run(debug=True, port=5000)
