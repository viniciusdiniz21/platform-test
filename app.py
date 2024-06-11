from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask_cors import CORS
import os
import json

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL') or \
        'postgresql://postgres:postgres@localhost:5432/position'
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'another-super-secret-key')

db = SQLAlchemy(app)
jwt = JWTManager(app)


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Position(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, nullable=True)
    latitude = db.Column(db.String(20), nullable=False)
    longitude = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f'<Position {self.id}>'
    
def import_data_if_needed(app):
    with app.app_context():
        if not Position.query.first():
            # Caminho para o arquivo data.json
            json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'positions.json')
            with open(json_path) as f:
                data = json.load(f)
                for item in data['data']:
                    new_entry = Position(
                        date_time=datetime.fromisoformat(item['date_time']),
                        latitude=item['latitude'],
                        longitude=item['longitude']
                    )
                    db.session.add(new_entry)
                db.session.commit()


@app.route('/')
def index():
    entries = Position.query.all()
    return [{"date_time": entry.date_time.isoformat(), "latitude": entry.latitude, "longitude": entry.longitude} for entry in entries]

@app.route('/position', methods=['POST'])
def create_position():
    data = request.get_json()
    new_position = Position(
        date_time=datetime.today(),
        latitude=data['latitude'],
        longitude=data['longitude']
    )
    db.session.add(new_position)
    db.session.commit()
    return jsonify({'message': 'Posição adicionada!'}), 201

@app.route('/positions', methods=['GET'])
@jwt_required()
def get_positions():
    positions = Position.query.all()
    if positions:
        positions_data = []
        for position in positions:
            positions_data.append({
                'id': position.id,
                'date_time': position.date_time.strftime('%Y-%m-%d %H:%M:%S'),
                'latitude': position.latitude,
                'longitude': position.longitude
            })
        return jsonify(positions_data)
    else:
        return jsonify({'message': 'Nenhuma posição encontrada.'}), 404
    
# Rotas de autenticação
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if Usuario.query.filter_by(username=username).first():
        return jsonify({'message': 'Usuário já existe.'}), 400
    
    new_user = Usuario(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Usuário registrado com sucesso!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = Usuario.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token), 200
    
    return jsonify({'message': 'Credenciais inválidas.'}), 401

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    import_data_if_needed(app)
    app.run(debug=True)