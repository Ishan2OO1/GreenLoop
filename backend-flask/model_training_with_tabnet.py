"""
Enhanced Model Training Script with TabNet Integration
This script creates, trains, and evaluates multiple ML models including TabNet for carbon footprint prediction.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os
import warnings

# TabNet imports
try:
    from pytorch_tabnet.tab_model import TabNetRegressor
    import torch
    TABNET_AVAILABLE = True
    print("✅ TabNet imported successfully")
except ImportError as e:
    TABNET_AVAILABLE = False
    print(f"⚠️ TabNet not available: {e}")

warnings.filterwarnings('ignore')

class EnhancedCarbonFootprintPredictor:
    """
    Enhanced ML pipeline with TabNet support for carbon footprint prediction
    """
    
    def __init__(self):
        self.models = {}
        self.preprocessor = None
        self.label_encoders = {}
        self.feature_names = []
        self.model_performance = {}
        self.tabnet_available = TABNET_AVAILABLE
        
    def load_existing_data(self):
        """Load existing training data if available"""
        data_file = 'data/carbon_footprint_training_data.csv'
        if os.path.exists(data_file):
            print(f"📊 Loading existing training data from {data_file}")
            df = pd.read_csv(data_file)
            print(f"✅ Loaded {len(df)} training samples")
            return df
        else:
            print("⚠️ No existing training data found, generating new data...")
            return self.generate_training_data(n_samples=2000)
    
    def generate_training_data(self, n_samples=2000):
        """
        Generate realistic synthetic training data for carbon footprint prediction
        """
        print("🔄 Generating synthetic training data...")
        
        np.random.seed(42)  # For reproducibility
        
        # Define process types
        process_types = ['cement', 'steel', 'aluminum', 'plastic', 'glass']
        
        data = []
        for i in range(n_samples):
            # Basic features
            process_type = np.random.choice(process_types)
            energy_consumption = np.random.uniform(50, 500)  # kWh per ton
            ambient_temp = np.random.uniform(15, 35)  # Celsius
            humidity = np.random.uniform(30, 90)  # Percent
            
            # Additional realistic features
            equipment_age = np.random.uniform(1, 20)  # Years
            production_rate = np.random.uniform(0.5, 5.0)  # Tons per hour
            renewable_energy_pct = np.random.uniform(0, 80)  # Percentage
            waste_recycling_pct = np.random.uniform(10, 95)  # Percentage
            
            # Calculate carbon footprint based on realistic relationships
            base_footprint = {
                'cement': 400,
                'steel': 350,
                'aluminum': 300,
                'plastic': 200,
                'glass': 150
            }[process_type]
            
            # Apply realistic factors
            carbon_footprint = (
                base_footprint * 
                (1 + energy_consumption / 1000) *  # Energy impact
                (1 + equipment_age / 50) *         # Equipment efficiency
                (1 - renewable_energy_pct / 200) * # Renewable energy benefit
                (1 - waste_recycling_pct / 300) *  # Recycling benefit
                (1 + (ambient_temp - 25) / 100) *  # Temperature factor
                (1 + humidity / 500) *             # Humidity factor
                (1 + 1/production_rate / 10)       # Production efficiency
            )
            
            # Add some noise
            carbon_footprint += np.random.normal(0, carbon_footprint * 0.1)
            carbon_footprint = max(carbon_footprint, 50)  # Minimum realistic value
            
            data.append({
                'process_type': process_type,
                'energy_consumption_kwh_per_ton': energy_consumption,
                'ambient_temperature_c': ambient_temp,
                'humidity_percent': humidity,
                'equipment_age_years': equipment_age,
                'production_rate_tons_per_hour': production_rate,
                'renewable_energy_percent': renewable_energy_pct,
                'waste_recycling_percent': waste_recycling_pct,
                'carbon_footprint_kg_co2e_per_ton': carbon_footprint
            })
        
        df = pd.DataFrame(data)
        
        # Save the training data
        os.makedirs('data', exist_ok=True)
        df.to_csv('data/carbon_footprint_training_data.csv', index=False)
        print(f"✅ Generated {len(df)} training samples")
        print(f"📊 Data saved to: data/carbon_footprint_training_data.csv")
        
        return df
    
    def preprocess_data(self, df, is_training=True):
        """
        Preprocess the data for model training
        """
        print("🔄 Preprocessing data...")
        
        # Separate features and target
        target_col = 'carbon_footprint_kg_co2e_per_ton'
        feature_cols = [col for col in df.columns if col != target_col]
        
        X = df[feature_cols].copy()
        y = df[target_col] if target_col in df.columns else None
        
        if is_training:
            self.feature_names = feature_cols
            
            # Handle categorical variables
            categorical_cols = ['process_type']
            for col in categorical_cols:
                if col in X.columns:
                    le = LabelEncoder()
                    X[col] = le.fit_transform(X[col])
                    self.label_encoders[col] = le
            
            # Scale numerical features
            numerical_cols = [col for col in X.columns if col not in categorical_cols]
            self.preprocessor = StandardScaler()
            X_scaled = self.preprocessor.fit_transform(X[numerical_cols])
            
            # Combine scaled numerical and encoded categorical
            X_processed = X.copy()
            X_processed[numerical_cols] = X_scaled
            
        else:
            # Apply saved preprocessing
            categorical_cols = ['process_type']
            for col in categorical_cols:
                if col in X.columns and col in self.label_encoders:
                    # Handle unknown categories
                    known_categories = set(self.label_encoders[col].classes_)
                    X[col] = X[col].apply(
                        lambda x: x if x in known_categories else self.label_encoders[col].classes_[0]
                    )
                    X[col] = self.label_encoders[col].transform(X[col])
            
            # Scale numerical features
            numerical_cols = [col for col in X.columns if col not in categorical_cols]
            X_scaled = self.preprocessor.transform(X[numerical_cols])
            
            X_processed = X.copy()
            X_processed[numerical_cols] = X_scaled
        
        print(f"✅ Preprocessed data shape: {X_processed.shape}")
        return X_processed, y
    
    def train_models(self, X, y):
        """
        Train multiple ML models including TabNet and compare their performance
        """
        print("🚀 Training multiple models (including TabNet)...")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Define models to train
        models_config = {
            'Random Forest': {
                'model': RandomForestRegressor(random_state=42),
                'params': {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [10, 20, None],
                    'min_samples_split': [2, 5],
                    'min_samples_leaf': [1, 2]
                },
                'use_grid_search': True
            },
            'XGBoost': {
                'model': xgb.XGBRegressor(random_state=42),
                'params': {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [3, 6, 9],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'subsample': [0.8, 0.9, 1.0]
                },
                'use_grid_search': True
            }
        }
        
        # Add TabNet if available
        if self.tabnet_available:
            models_config['TabNet'] = {
                'model': TabNetRegressor(
                    n_d=8, n_a=8, n_steps=3, gamma=1.3,
                    lambda_sparse=1e-3, optimizer_fn=torch.optim.Adam,
                    optimizer_params=dict(lr=2e-2), mask_type='sparsemax',
                    scheduler_params={"step_size":50, "gamma":0.9},
                    scheduler_fn=torch.optim.lr_scheduler.StepLR,
                    verbose=0, seed=42
                ),
                'params': None,  # TabNet doesn't use sklearn GridSearch
                'use_grid_search': False
            }
        
        # Train and evaluate each model
        for name, config in models_config.items():
            print(f"\n🔄 Training {name}...")
            
            if config['use_grid_search'] and config['params']:
                # Grid search for sklearn-compatible models
                grid_search = GridSearchCV(
                    config['model'], 
                    config['params'], 
                    cv=5, 
                    scoring='neg_mean_squared_error',
                    n_jobs=-1
                )
                
                grid_search.fit(X_train, y_train)
                best_model = grid_search.best_estimator_
                best_params = grid_search.best_params_
                
            elif name == 'TabNet' and self.tabnet_available:
                # Special handling for TabNet
                try:
                    model = config['model']
                    
                    # Convert to numpy arrays with proper types
                    X_train_np = X_train.values.astype(np.float32)
                    X_test_np = X_test.values.astype(np.float32)
                    y_train_np = y_train.values.reshape(-1, 1).astype(np.float32)
                    y_test_np = y_test.values.reshape(-1, 1).astype(np.float32)
                    
                    # Train TabNet
                    model.fit(
                        X_train_np, y_train_np,
                        eval_set=[(X_test_np, y_test_np)],
                        eval_name=['test'],
                        eval_metric=['rmse'],
                        max_epochs=100,
                        patience=10,
                        batch_size=256,
                        virtual_batch_size=128,
                        num_workers=0,
                        drop_last=False
                    )
                    
                    best_model = model
                    best_params = "TabNet default parameters"
                    
                except Exception as e:
                    print(f"❌ TabNet training failed: {e}")
                    continue
            else:
                # Simple training without grid search
                best_model = config['model']
                best_model.fit(X_train, y_train)
                best_params = "Default parameters"
            
            # Make predictions
            try:
                if name == 'TabNet' and self.tabnet_available:
                    y_pred_train = best_model.predict(X_train.values.astype(np.float32)).flatten()
                    y_pred_test = best_model.predict(X_test.values.astype(np.float32)).flatten()
                else:
                    y_pred_train = best_model.predict(X_train)
                    y_pred_test = best_model.predict(X_test)
                
                # Calculate metrics
                train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
                test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
                train_r2 = r2_score(y_train, y_pred_train)
                test_r2 = r2_score(y_test, y_pred_test)
                test_mae = mean_absolute_error(y_test, y_pred_test)
                
                # Store model and performance
                self.models[name] = best_model
                self.model_performance[name] = {
                    'train_rmse': train_rmse,
                    'test_rmse': test_rmse,
                    'train_r2': train_r2,
                    'test_r2': test_r2,
                    'test_mae': test_mae,
                    'best_params': best_params
                }
                
                print(f"✅ {name} Results:")
                print(f"   Test RMSE: {test_rmse:.2f}")
                print(f"   Test R²: {test_r2:.4f}")
                print(f"   Test MAE: {test_mae:.2f}")
                
            except Exception as e:
                print(f"❌ Error evaluating {name}: {e}")
                continue
    
    def create_ensemble(self):
        """
        Create a weighted ensemble of the trained models including TabNet
        """
        print("\n🔄 Creating enhanced ensemble model...")
        
        # Calculate weights based on performance (inverse of RMSE)
        weights = {}
        total_inv_rmse = 0
        
        for name, perf in self.model_performance.items():
            inv_rmse = 1 / perf['test_rmse']
            weights[name] = inv_rmse
            total_inv_rmse += inv_rmse
        
        # Normalize weights
        for name in weights:
            weights[name] = weights[name] / total_inv_rmse
        
        print(f"✅ Enhanced ensemble weights: {weights}")
        return weights
    
    def save_models(self):
        """
        Save all trained models including TabNet and preprocessing components
        """
        print("\n💾 Saving models and components...")
        
        os.makedirs('model', exist_ok=True)
        
        # Save individual models
        for name, model in self.models.items():
            filename = f"model/{name.lower().replace(' ', '_')}_model.pkl"
            
            try:
                if name == 'TabNet':
                    # Special handling for TabNet - save as .zip
                    filename = f"model/tabnet_model.zip"
                    model.save_model(filename)
                    print(f"✅ Saved {name} to {filename}")
                else:
                    joblib.dump(model, filename)
                    print(f"✅ Saved {name} to {filename}")
            except Exception as e:
                print(f"❌ Error saving {name}: {e}")
                continue
        
        # Save ensemble models
        joblib.dump(self.models, 'model/ensemble_with_tabnet.pkl')
        
        # Save preprocessing components
        preprocessing_data = {
            'scaler': self.preprocessor,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names
        }
        joblib.dump(preprocessing_data, 'model/preprocessing.pkl')
        
        # Save model performance info
        model_info = {
            'individual_rmse': {name: perf['test_rmse'] for name, perf in self.model_performance.items()},
            'individual_r2': {name: perf['test_r2'] for name, perf in self.model_performance.items()},
            'individual_mae': {name: perf['test_mae'] for name, perf in self.model_performance.items()},
            'feature_names': self.feature_names,
            'training_date': datetime.now().isoformat(),
            'model_performance': self.model_performance,
            'tabnet_included': 'TabNet' in self.models
        }
        joblib.dump(model_info, 'model/model_info_with_tabnet.pkl')
        
        print("✅ All models and components saved successfully!")
        
    def generate_model_report(self):
        """
        Generate a comprehensive model performance report including TabNet
        """
        print("\n📊 Enhanced Model Performance Report")
        print("=" * 60)
        
        for name, perf in self.model_performance.items():
            print(f"\n{name}:")
            print(f"  Training RMSE: {perf['train_rmse']:.2f}")
            print(f"  Test RMSE: {perf['test_rmse']:.2f}")
            print(f"  Test R²: {perf['test_r2']:.4f}")
            print(f"  Test MAE: {perf['test_mae']:.2f}")
            
        # Find best model
        best_model = min(self.model_performance.items(), 
                        key=lambda x: x[1]['test_rmse'])
        
        print(f"\n🏆 Best Model: {best_model[0]} (RMSE: {best_model[1]['test_rmse']:.2f})")
        
        if 'TabNet' in self.model_performance:
            print(f"🧠 TabNet Performance: RMSE {self.model_performance['TabNet']['test_rmse']:.2f}")

def main():
    """
    Main training pipeline with TabNet integration
    """
    print("🚀 Starting Enhanced Carbon Footprint Model Training Pipeline")
    print("📊 Including TabNet deep learning model")
    print("=" * 70)
    
    # Initialize predictor
    predictor = EnhancedCarbonFootprintPredictor()
    
    # Load or generate training data
    df = predictor.load_existing_data()
    
    # Preprocess data
    X, y = predictor.preprocess_data(df, is_training=True)
    
    # Train models (including TabNet)
    predictor.train_models(X, y)
    
    # Create ensemble
    ensemble_weights = predictor.create_ensemble()
    
    # Save everything
    predictor.save_models()
    
    # Generate report
    predictor.generate_model_report()
    
    print(f"\n✅ Enhanced model training pipeline completed successfully!")
    if predictor.tabnet_available and 'TabNet' in predictor.models:
        print("🧠 TabNet model successfully integrated!")
    print("\nNext steps:")
    print("1. Update Flask API to use enhanced models: python app.py")
    print("2. Test the API with TabNet predictions")
    print("3. Use the React frontend to make predictions")

if __name__ == "__main__":
    main()