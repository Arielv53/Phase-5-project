import os
from models import db, User, Conversation, Message, UserConversation
from flask import Flask, request, make_response, jsonify, session
from flask_restful import Api
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']  # how to connect to the db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # optional performance thing
app.secret_key = os.environ['SECRET_KEY'] # grab the secret key from env variables


db.init_app(app)  # link sqlalchemy with flask
Migrate(app, db)  # set up db migration tool (alembic)
CORS(app, supports_credentials=True)  # set up cors
api = Api(app)

@app.route('/')
def home():
    return "Hello, Flask!"


@app.route('/users', methods=['GET'])
def users():
    search_term = request.args.get('search', '')
    users = User.query.filter(User.username.ilike(f'%{search_term}%')).all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/conversations', methods=['GET'])
def get_conversations():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'Not authorized'}), 401

    user_conversations = UserConversation.query.filter_by(user_id=user_id).all()
    conversations = []
    for uc in user_conversations:
        conversation = Conversation.query.get(uc.conversation_id)
        users = User.query.join(UserConversation).filter(UserConversation.conversation_id == conversation.id).all()
        usernames = [user.username for user in users]
        conversations.append({
            'id': conversation.id,
            'usernames': usernames
        })

    return jsonify(conversations), 200

@app.route('/conversations', methods=['POST'])
def create_conversation():
    data = request.get_json()
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'message': 'Not authorized'}), 401

    user_ids = data.get('user_ids')

    
    if user_id not in user_ids:
        user_ids.append(user_id)

    if not user_ids or len(user_ids) < 2:
        return jsonify({'message': 'A conversation requires at least two users'}), 400

    new_conversation = Conversation()
    db.session.add(new_conversation)
    db.session.commit()

    for uid in user_ids:
        user_conversation = UserConversation(
            user_id=uid,
            conversation_id=new_conversation.id
        )
        db.session.add(user_conversation)

    db.session.commit()
    return jsonify({'message': 'Conversation created successfully', 'conversation_id': new_conversation.id}), 201

@app.route('/conversations/<int:conversation_id>', methods=['GET'])
def view_conversation(conversation_id):
    conversation = Conversation.query.get_or_404(conversation_id)
    messages = Message.query.filter_by(conversation_id=conversation.id).order_by(Message.timestamp).all()
    message_list = [{
        'id': message.id,
        'author_id': message.user_id,
        'content': message.content,
        'timestamp': message.timestamp
    } for message in messages]

    return jsonify(message_list), 200

@app.route('/conversations/<int:conversation_id>/messages', methods=['POST'])
def send_message(conversation_id):
    conversation = Conversation.query.get_or_404(conversation_id)
    data = request.get_json()
    content = data.get('content')
    user_id = session.get('user_id')

    if not content or not user_id:
        return jsonify({'message': 'Content and user ID required'}), 400

    new_message = Message(
        content=content,
        user_id=user_id,
        conversation_id=conversation.id
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify(new_message.to_dict()), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter(User.username == data['username']).first()
    if not user:
        return {'error': 'login failed'}, 401
    
    session['user_id'] = user.id

    return user.to_dict(), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    user = User.query.filter(User.username == data['username']).first()
    if user:
        return {'error': 'username already exists'}, 400
    
    new_user = User(
        username=data['username'],
        password=data['password']
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user.to_dict(), 201

@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    return {}, 204

@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')

    if not user_id:
        return {'error': 'authorization failed'}, 401
    
    user = User.query.filter(User.id == user_id).first()
    if not user:
        return {'error': 'authorization failed'}, 401
    
    return user.to_dict(), 200

if __name__ == '__main__':
    app.run(port=5555)

