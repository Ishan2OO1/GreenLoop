#!/usr/bin/env python3
"""
Railway Startup Script for GreenLoop Backend
This script ensures proper initialization and provides detailed logging
"""
import sys
import os
import time

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds

def try_import_with_retry():
    """Try to import Flask app with retries"""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"\n📦 Import attempt {attempt}/{MAX_RETRIES}...", flush=True)
            from app import app, load_models
            print("✅ Successfully imported Flask app!", flush=True)
            return app, load_models
        except ImportError as e:
            print(f"❌ Import failed (attempt {attempt}/{MAX_RETRIES}): {e}", flush=True)
            if "numpy" in str(e).lower():
                print("⚠️  This appears to be a numpy conflict issue", flush=True)
                print("⚠️  Trying to work around it...", flush=True)
                
                # Try to clean up any conflicting paths
                if 'PYTHONPATH' in os.environ:
                    print(f"   Current PYTHONPATH: {os.environ['PYTHONPATH']}", flush=True)
                
            if attempt < MAX_RETRIES:
                print(f"   Retrying in {RETRY_DELAY} seconds...", flush=True)
                time.sleep(RETRY_DELAY)
            else:
                print("\n❌ All import attempts failed!", flush=True)
                raise

print("=" * 50, flush=True)
print("🚀 GreenLoop Backend Starting on Railway", flush=True)
print("=" * 50, flush=True)

# Print environment info
print(f"Python Version: {sys.version}", flush=True)
print(f"Current Directory: {os.getcwd()}", flush=True)
print(f"PORT: {os.environ.get('PORT', 'NOT SET')}", flush=True)
print(f"Python Path: {sys.path[:3]}", flush=True)

# List files to verify deployment
print("\n📁 Files in current directory:", flush=True)
try:
    for item in os.listdir('.'):
        print(f"  - {item}", flush=True)
except Exception as e:
    print(f"  Error listing directory: {e}", flush=True)

if os.path.exists('model'):
    print("\n🤖 Files in model directory:", flush=True)
    try:
        for item in os.listdir('model'):
            print(f"  - {item}", flush=True)
    except Exception as e:
        print(f"  Error listing model directory: {e}", flush=True)
else:
    print("\n⚠️ WARNING: model directory not found!", flush=True)

# Check for preprocessing file
preprocessing_file = "preprocessing_info_3_prototype3.pkl"
if os.path.exists(preprocessing_file):
    print(f"\n✅ Preprocessing file found: {preprocessing_file}", flush=True)
else:
    print(f"\n⚠️ WARNING: Preprocessing file not found: {preprocessing_file}", flush=True)

print("\n" + "=" * 50, flush=True)
print("Starting Flask Application...", flush=True)
print("=" * 50 + "\n", flush=True)

# Import and run the Flask app with retries
try:
    app, load_models = try_import_with_retry()
    
    print("Loading models...", flush=True)
    models_loaded = load_models()
    
    if models_loaded:
        print("✅ Models loaded successfully!", flush=True)
    else:
        print("⚠️ WARNING: Models failed to load, but continuing anyway", flush=True)
    
    port = int(os.environ.get('PORT', 5000))
    print(f"\n✅ Starting Flask server on 0.0.0.0:{port}", flush=True)
    print(f"🏥 Health check endpoint: http://0.0.0.0:{port}/api/status", flush=True)
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
        
except Exception as e:
    print(f"\n❌ FATAL ERROR during startup: {e}", flush=True)
    import traceback
    traceback.print_exc()
    print("\n⏱️  Waiting 10 seconds before exit to allow log collection...", flush=True)
    time.sleep(10)
    print("Exiting with error code 1", flush=True)
    sys.exit(1)
