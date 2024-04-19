from flask import Flask, request, jsonify
from model import LogisticRegression2
import torch
app = Flask(__name__)

#Loading model
model = LogisticRegression2(num_features=2)
model.load_state_dict(torch.load('logistic_regression_weights.pth'))
model.eval()

@app.route('/predict', methods=['POST'])
def predict():
    json_input = request.get_json()
    input_tensor = torch.tensor(json_input['features'], dtype=torch.float32)
    with torch.no_grad():
        probabilities = model(input_tensor).numpy().tolist()
    return jsonify({'probabilities': probabilities})

@app.route('/')
def home():
    return "Flask is running"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
