from flask import Flask, request, jsonify
import torch
import numpy as np
import joblib

class LogisticRegressionModel(torch.nn.Module):
    def __init__(self, num_features):
        super(LogisticRegressionModel, self).__init__()
        self.linear = torch.nn.Linear(num_features, 1)

    def forward(self, x):
        print(label_encoder_type.classes_)

        return torch.sigmoid(self.linear(x))

app = Flask(__name__)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

#Load model and setup
model = LogisticRegressionModel(num_features=4)  # we can add features here if we want
model.load_state_dict(torch.load('logistic_regression_model_state_dict.pth', map_location=device))
model.to(device)
model.eval()

#Load scaler and label encoders
scaler = joblib.load('maindataset1.pkl')
label_encoder_type = joblib.load('type_encoder.gz')
label_encoder_nameOrig = joblib.load('nameOrig_encoder.gz')
label_encoder_nameDest = joblib.load('nameDest_encoder.gz')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        # preprocessing here (the input data when sent)
        type_encoded = label_encoder_type.transform([data['type']])
        nameOrig_encoded = label_encoder_nameOrig.transform([data['nameOrig']])
        nameDest_encoded = label_encoder_nameDest.transform([data['nameDest']])

        # Assemble features and apply scaling
        features = np.array([[type_encoded[0], float(data['amount']), nameOrig_encoded[0], nameDest_encoded[0]]])
        features_scaled = scaler.transform(features)
        features_tensor = torch.tensor(features_scaled, dtype=torch.float32).to(device)

        # Perform prediction
        with torch.no_grad():
            output = model(features_tensor)
            prediction = output.item()  # Get the prediction probability as a float (so we can fine tune when we recieve the post data)

        return jsonify({'probability': prediction})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

print(label_encoder_type.classes_)
