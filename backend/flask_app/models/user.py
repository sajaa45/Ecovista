from extensions import db
import re
class UserModel(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255),unique=True, nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(255), unique=False)
    def is_strong_password(ch):
        if len(ch) < 8:
            return False
        if not re.search(r'[A-Z]', ch):  # Check for at least one uppercase letter
            return False
        if not re.search(r'[0-9]', ch):  # Check for at least one number
            return False
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', ch):  # Check for at least one special character
            return False
        return True