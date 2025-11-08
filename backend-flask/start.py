#!/usr/bin/env python3
"""
Railway Startup Script for GreenLoop Backend
This script ensures proper initialization and provides detailed logging
"""
import sys
import os

print("=" * 50)
print("🚀 GreenLoop Backend Starting on Railway")
print("=" * 50)

# Print environment info
print(f"Python Version: {sys.version}")
print(f"Current Directory: {os.getcwd()}")
print(f"PORT: {os.environ.get('PORT', 'NOT SET')}")

# List files to verify deployment
print("\n📁 Files in current directory:")
for item in os.listdir('.'):
    print(f"  - {item}")

if os.path.exists('model'):
    print("\n🤖 Files in model directory:")
    for item in os.listdir('model'):
        print(f"  - {item}")
else:
    print("\n⚠️ WARNING: model directory not found!")

# Check for preprocessing file
preprocessing_file = "preprocessing_info_3_prototype3.pkl"
if os.path.exists(preprocessing_file):
    print(f"\n✅ Preprocessing file found: {preprocessing_file}")
else:
    print(f"\n⚠️ WARNING: Preprocessing file not found: {preprocessing_file}")

print("\n" + "=" * 50)
print("Starting Flask Application...")
print("=" * 50 + "\n")

# Import and run the Flask app
try:
    from app import app, load_models
    
    if load_models():
        port = int(os.environ.get('PORT', 5000))
        print(f"\n✅ All systems ready! Starting server on 0.0.0.0:{port}")
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        print("\n❌ FATAL ERROR: Failed to load models!")
        print("Check the logs above for specific error messages")
        sys.exit(1)
        
except Exception as e:
    print(f"\n❌ FATAL ERROR during startup: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
