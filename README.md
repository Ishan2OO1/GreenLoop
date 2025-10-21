# Machine Learning Application - React + Flask

A college project demonstrating a machine learning application with a React frontend and Flask backend, following best practices for decoupled architecture.

## Project Structure

```
BaseProject/
├── .gitignore                          # Git ignore file for Python, Node.js, and common files
├── ProjectDesign.md                    # Original project design document
├── README.md                          # This file
├── backend-flask/                     # Flask API backend
│   ├── app.py                         # Main Flask application
│   ├── requirements.txt               # Python dependencies
│   ├── model/                         # ML model directory
│   │   └── README.md                  # Model usage instructions
│   └── data/                          # Training data directory
│       └── README.md                  # Data usage instructions
└── frontend-react/                   # React frontend
    ├── package.json                   # Node.js dependencies
    ├── public/
    │   └── index.html                 # HTML template
    └── src/
        ├── index.js                   # React entry point
        ├── index.css                  # Global styles
        ├── App.js                     # Main App component
        └── components/
            └── PredictionForm.jsx     # Prediction form component
```

## Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** (already initialized)

### Option 1: Run Everything with One Command
```bash
# Install all dependencies and run both servers
npm run install-all
npm run dev
```

### Option 2: Manual Setup

#### Backend Setup (Flask API)
```bash
cd backend-flask
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

#### Frontend Setup (React)
```bash
cd frontend-react
npm install
npm start
```

### Available npm Scripts
- `npm run dev` - Run both backend and frontend concurrently
- `npm run start:backend` - Run Flask API only
- `npm run start:frontend` - Run React app only  
- `npm run install-all` - Install all dependencies (Python + React)
- `npm run test-api` - Test the Flask API endpoints

## Usage

1. **Start both servers** (Flask backend on :5000 and React frontend on :3000)
2. **Open your browser** to `http://localhost:3000`
3. **Enter feature values** in the prediction form
4. **Click "Get Prediction"** to send data to the ML model
5. **View the results** displayed on the page

## API Endpoints

### Backend Flask API

- `GET /` - Health check and API status
- `POST /predict` - Make predictions with the ML model
- `GET /model-info` - Get information about the loaded model

### Example API Request

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [1.2, 3.4, 5.6, 7.8]}'
```

## Development

### Adding Your ML Model

1. Train your model using scikit-learn or similar
2. Save it using pickle or joblib:
   ```python
   import pickle
   # After training your model...
   with open('backend-flask/model/model.pkl', 'wb') as f:
       pickle.dump(your_trained_model, f)
   ```

### Customizing the Frontend

- Modify `src/components/PredictionForm.jsx` to match your model's input features
- Update the form fields and labels to match your specific use case
- Customize styling in `src/index.css`

### Adding Training Data

- Place your training dataset in `backend-flask/data/`
- Update the README files with specific information about your data

## Troubleshooting

### Common Issues

1. **"Cannot connect to Flask API"**
   - Make sure the Flask server is running on port 5000
   - Check that CORS is enabled (already configured)

2. **"Model not loaded"**
   - Ensure your model file is placed in `backend-flask/model/model.pkl`
   - Check the Flask console for model loading errors

3. **React app won't start**
   - Make sure Node.js dependencies are installed: `npm install`
   - Check for port conflicts (React uses port 3000)

### Useful Commands

```bash
# Check if Flask API is running
curl http://localhost:5000/

# Check model status
curl http://localhost:5000/model-info

# Install additional Python packages
pip install package-name
pip freeze > requirements.txt

# Install additional React packages
npm install package-name
```

## Technologies Used

- **Frontend:** React 18, Axios, CSS3
- **Backend:** Flask, Flask-CORS
- **ML Libraries:** NumPy, Pandas, Scikit-learn
- **Development:** Git, npm, pip

## Project Architecture

This project demonstrates:
- **Separation of Concerns:** Frontend and backend are completely decoupled
- **RESTful API Design:** Clean HTTP-based communication
- **Modern Development Practices:** Package management, virtual environments, version control
- **Scalable Structure:** Easy to extend with additional features

📖 **Detailed Design:** See [`docs/ProjectDesign.md`](docs/ProjectDesign.md) for the complete architecture overview.

## Next Steps

1. Add your specific ML model and update feature names
2. Customize the UI to match your project requirements
3. Add data validation and error handling
4. Implement additional API endpoints as needed
5. Add unit tests for both frontend and backend
6. Deploy to cloud platforms (Heroku, Vercel, etc.)

## License

This is a college project template. Feel free to use and modify as needed.