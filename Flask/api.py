from flask import Flask, request, jsonify
from pymongo import MongoClient
import secrets
from datetime import datetime
from functools import wraps

app = Flask(__name__)

# mongodb connnection
mongo_uri = "mongodb+srv://218110172:218110172@apikeys.heskwp5.mongodb.net/?retryWrites=true&w=majority&appName=apikeys"
client = MongoClient(mongo_uri)
db = client['apikeys']
api_keys_collection = db['api_keys']
users_collection = db['users']

# random api key generator
def generate_api_key():
    return secrets.token_hex(16)

# specific role creator
def create_api_key(user, role):
    api_key = generate_api_key()
    api_keys_collection.insert_one({
        'user': user,
        'api_key': api_key,
        'role': role,
        'created_at': datetime.now()
    })
    return api_key

# Authentication and Authorization Middleware
def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        api_key = request.headers.get('X-API-KEY')
        if not api_key or not api_keys_collection.find_one({'api_key': api_key}):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return wrapper

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        api_key = request.headers.get('X-API-KEY')
        if not api_key:
            return jsonify({'error': 'Unauthorized'}), 401
        api_key_entry = api_keys_collection.find_one({'api_key': api_key})
        if not api_key_entry or api_key_entry.get('role') != 'admin':
            return jsonify({'error': 'Forbidden'}), 403
        return f(*args, **kwargs)
    return wrapper

#HERE IS THE METHOD TO CREATE AN API KEY
@app.route('/create_api_key', methods=['POST'])
@auth_required
@admin_required
def create_api_key_route():
    data = request.get_json()
    user = data.get('user')
    role = data.get('role', 'user')  # Default role is 'user' if not specified
    if not user:
        return jsonify({'error': 'User is required'}), 400
    if role not in ['user', 'admin']:
        return jsonify({'error': 'Invalid role'}), 400
    api_key = create_api_key(user, role)
    return jsonify({'user': user, 'api_key': api_key, 'role': role})


#HERE IS THE list method
@app.route('/list_api_keys', methods=['GET'])
@auth_required
@admin_required
def list_api_keys():
    api_keys = list(api_keys_collection.find({}, {'_id': 0, 'user': 1, 'api_key': 1, 'created_at': 1}))
    return jsonify(api_keys)


#HERE IS THE REVOKE METHOD
@app.route('/revoke_api_key', methods=['POST'])
@auth_required
@admin_required
def revoke_api_key():
    data = request.get_json()
    api_key = data.get('api_key')
    if not api_key:
        return jsonify({'error': 'API key is required'}), 400
    result = api_keys_collection.delete_one({'api_key': api_key})
    if result.deleted_count == 0:
        return jsonify({'error': 'API key not found'}), 404
    return jsonify({'message': 'API key revoked'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
