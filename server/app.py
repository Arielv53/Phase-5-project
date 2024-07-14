import os
from models import db, User, Conversation, Message, UserConversation
from flask import Flask, request, make_response, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']  # how to connect to the db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # optional performance thing
app.secret_key = os.environ['SECRET_KEY'] # grab the secret key from env variables


db.init_app(app)  # link sqlalchemy with flask
Migrate(app, db)  # set up db migration tool (alembic)
CORS(app, supports_credentials=True)  # set up cors

@app.route('/')
def home():
    return "Hello, Flask!"


@app.route('/users', methods=['GET'])
def users():
    users = User.query.all()
    return [user.to_dict() for user in users], 200

# create a new conversation
@app.route('/conversations', methods=['POST'])
def create_conversation():
    data = request.get_json()
    user_ids = data.get('user_ids')

    if not user_ids or len(user_ids) < 2:
        return jsonify({'message': 'a conversation requires at least two users'}), 400
    
    new_conversation = Conversation()
    db.session.add(new_conversation)
    db.session.commit()

    for user_id in user_ids:
        user_conversation = UserConversation(
            user_id=user_id,
            conversation_id=new_conversation.id
        )
        db.session.add(user_conversation)
    db.session.commit()
    return jsonify({'message': 'Conversation created successfully', 'conversation_id': new_conversation.id}), 201


# view a conversation
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

# send a message in a conversation
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

    return jsonify({'message': 'Message sent successfully'}), 201

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

if __name__ == '__main__':
    app.run(debug=True)

