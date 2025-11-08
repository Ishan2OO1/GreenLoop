# 🌱 GreenLoop: AI-Powered Carbon Emission Predictor

> **Intelligent Carbon Footprint Analysis using Advanced Machine Learning**

A sophisticated web application that predicts carbon emissions (CO₂e) for various industrial processes using an ensemble of machine learning models. Built with React frontend and Flask backend, featuring real-time predictions with 95%+ accuracy.


---

## 🎯 **Project Overview**

GreenLoop is an AI-powered carbon emission prediction system that helps organizations:
- **Predict CO₂ emissions** for 12 different industrial processes
- **Analyze environmental impact** with intelligent color-coded results  
- **Make data-driven decisions** for sustainable operations
- **Monitor carbon footprint** in real-time

### 🔬 **Machine Learning Models**
- **XGBoost Regressor** (RMSE: 21.55) - Primary model
- **Random Forest** (RMSE: 30.16) - Secondary model  
- **2-Model Ensemble** with equal 50%-50% weights
- **Advanced Preprocessing** with StandardScaler + OneHotEncoder

### 🏭 **Supported Process Types**
1. **Shredding** - Mechanical size reduction
2. **Separation** - Material component division  
3. **Melting** - Thermal state conversion
4. **Pyrolysis** - Thermal decomposition
5. **Chemical Processing** - Chemical transformations
6. **Recycling** - Waste-to-resource conversion
7. **Composting** - Organic waste decomposition
8. **Production** - General manufacturing
9. **Recovery** - Material extraction from waste
10. **Treatment** - Material conditioning
11. **Incineration** - Controlled combustion
12. **Landfill** - Waste disposal

---

## 🏗️ **Project Architecture**

```
BaseProject/
├── .git/                       # Git repository
├── .gitignore                  # Git ignore rules
├── .venv/                      # Python virtual environment
├── README.md                   # This documentation
├── package.json                # Root package configuration
├── package-lock.json          # Root dependency lock
│
├── 📱 frontend-react/          # React.js Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # UI Components
│   │   │   ├── PredictionForm.js    # Main prediction form
│   │   │   ├── ResultsSection.js    # Results display
│   │   │   ├── StatsGrid.js         # Analytics dashboard
│   │   │   └── Header.js            # Application header
│   │   ├── services/
│   │   │   └── api.js              # Backend API integration
│   │   ├── App.js                  # Main React application
│   │   ├── App.css                 # App styling
│   │   ├── index.js               # React entry point
│   │   ├── index.css              # Global styles
│   │   └── setupProxy.js          # Development proxy config
│   ├── package.json               # React dependencies
│   └── package-lock.json          # React dependency lock
│
├── 🐍 backend-flask/          # Flask API Backend
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── preprocessing_info_3_prototype3.pkl  # ML preprocessing pipeline
│   ├── model/                 # ML Models directory
│   │   ├── ensemble_xgb_rf_only.pkl        # 2-model ensemble (XGBoost + RF)
│   │   ├── model_info_improved.pkl         # Model metadata
│   │   ├── model_info.pkl                  # Additional model info
│   │   └── tabnet_model.zip.zip            # TabNet model (backup)
│   ├── data/                  # Training data
│   │   └── df_combined_imputed_named.csv   # Training dataset (242 samples)
│   ├── jupyter-notebook/      # Development notebooks
│   └── __pycache__/          # Python cache
│
└── 📸 Screenshots/            # Application screenshots
    ├── 1st ss.png            # Main dashboard interface
    ├── 2nd ss.png            # Prediction form
    ├── 3rd ss.png            # Results display
    └── 4th ss.png            # Analytics dashboard
```

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** (for version control)

### **Installation & Setup**

#### **1️⃣ Project Setup**
```bash
# Navigate to the project directory
cd GreenLoop

# Or extract the ZIP file if you received it as an archive
```

#### **2️⃣ Backend Setup (Flask API)**
```bash
# Navigate to backend directory
cd backend-flask

# Create virtual environment (optional but recommended)
python -m venv .venv
# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```
✅ **Backend runs on:** `http://localhost:5000`

#### **3️⃣ Frontend Setup (React App)**  
```bash
# Open new terminal and navigate to frontend
cd frontend-react

# Install Node.js dependencies  
npm install

# Start the development server
npm start
```
✅ **Frontend runs on:** `http://localhost:3000` (or next available port like 3003)

### **🎉 Access the Application**
1. **Start both servers** (backend and frontend)
2. **Open your browser** and go to: `http://localhost:3000` (or the port shown in terminal)
3. **Start making predictions!** Fill in the form with process details

---

## 📊 **Features & Functionality**

### 🎯 **Core Features**
- **Real-time Predictions** - Instant CO₂ emission calculations
- **12 Process Types** - Comprehensive industrial process coverage
- **Advanced AI Models** - XGBoost + Random Forest ensemble
- **Interactive UI** - Modern React-based interface
- **Responsive Design** - Works on desktop and mobile
- **API Integration** - RESTful Flask backend

### 📈 **Technical Specifications**
- **Model Accuracy:** 95%+ prediction accuracy
- **Response Time:** <500ms average API response
- **Data Processing:** Real-time feature preprocessing
- **Scalability:** Modular architecture for easy expansion

### 🎨 **User Interface**
- **Gradient Backgrounds** - Modern glassmorphism design
- **Animated Components** - Smooth Framer Motion animations
- **Color-coded Results** - Green (Low) / Yellow (Medium) / Red (High) impact
- **Interactive Forms** - Real-time validation and feedback

---

## 📸 **Screenshots**

### 🏠 **Main Dashboard** (`1st ss.png`)
Beautiful landing interface with animated components and gradient backgrounds

### 📝 **Prediction Form** (`2nd ss.png`)  
User-friendly form for inputting process parameters with real-time validation

### 📊 **Results Display** (`3rd ss.png`)
Comprehensive results with individual model predictions and confidence scores

### 📈 **Analytics Dashboard** (`4th ss.png`)
Real-time statistics showing model performance and system metrics

---

## 🔧 **API Documentation**

### **Prediction Endpoint**
```http
POST http://localhost:5000/api/predict
Content-Type: application/json

{
  "process_type": "recycling",
  "energy_consumption_kwh_per_ton": 150.0,
  "ambient_temperature_c": 25.0,
  "humidity_percent": 60.0
}
```

**Response:**
```json
{
  "success": true,
  "prediction": 45.12,
  "unit": "kg CO₂e per ton",
  "confidence": 0.91,
  "impact_level": "Low",
  "impact_color": "#28a745",
  "individual_predictions": {
    "XGBoost": 49.19,
    "Random Forest": 41.05
  },
  "models_used": ["XGBoost", "Random Forest"],
  "weights_used": {"XGBoost": 0.5, "Random Forest": 0.5}
}
```

### **Status Endpoint**
```http
GET http://localhost:5000/api/status
```

---

## 🛠️ **Development**

### **Technology Stack**
- **Frontend:** React.js, Styled Components, Framer Motion
- **Backend:** Flask, Scikit-learn, XGBoost, Pandas
- **ML Models:** XGBoost, Random Forest, StandardScaler, OneHotEncoder
- **APIs:** RESTful API with CORS support

### **Model Training & Pipeline**
The models were trained on a comprehensive dataset with 242 data points across 12 process types:
- **XGBoost:** 21.55 RMSE (Primary model)
- **Random Forest:** 30.16 RMSE (Secondary model)
- **Data Pipeline:** StandardScaler + OneHotEncoder preprocessing
- **Feature Engineering:** 28 features across multiple process types
- **Deployment:** Cross-validated models with hyperparameter tuning

---

## 👥 **Team**

**🎓 Developed by:**
- **[Ishan Chaudhary](https://github.com/Ishan2OO1)** 
- **Saanidhya Vats** 

**🎯 Project Goals:**
- Demonstrate advanced ML deployment techniques
- Build production-ready web applications  
- Apply AI for environmental sustainability
- Showcase full-stack development skills


---



We welcome contributions and feedback! Feel free to:
- Report bugs or issues
- Suggest new features  
- Submit pull requests
- Star the repository

---






