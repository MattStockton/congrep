import os
from flask import Flask, render_template

app = Flask(__name__)
app.debug = False
app.secret_key = os.environ.get('APP_SECRET_KEY', None)

GA_ACCOUNT = os.environ.get("GA_ACCOUNT", None)
GA_DOMAIN_NAME = os.environ.get("GA_DOMAIN_NAME", None)

SUNLIGHT_API_KEY = os.environ.get("SUNLIGHT_API_KEY", None)

@app.errorhandler(404)
def not_found(error):
    return render_template('error.html'), 404

@app.errorhandler(500)
def error_encountered(error):
    return render_template('error.html'), 500

@app.route("/", methods=['GET'])
def index():
    return render_template("index.html", ga_account=GA_ACCOUNT, ga_domain_name=GA_DOMAIN_NAME, sunlight_api_key=SUNLIGHT_API_KEY)

if __name__ == '__main__':
    app.run(host='0.0.0.0')