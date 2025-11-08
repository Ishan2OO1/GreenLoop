#!/usr/bin/env python3
"""
Minimal test to see if Flask can start at all
"""
import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS

print("=" * 50, flush=True)
print("MINIMAL TEST - Starting basic Flask app", flush=True)
print("=" * 50, flush=True)
print(f"Python: {sys.version}", flush=True)
print(f"CWD: {os.getcwd()}", flush=True)
print(f"PORT: {os.environ.get('PORT', 'NOT SET')}", flush=True)

app = Flask(__name__)
CORS(app)

@app.route('/api/status')
def status():
    return jsonify({
        'status': 'running',
        'message': 'Minimal Flask app is working!',
        'python_version': sys.version
    })

@app.route('/')
def home():
    return jsonify({'message': 'GreenLoop Backend - Minimal Test'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\n✅ Starting minimal Flask on 0.0.0.0:{port}", flush=True)
    try:
        app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
    except Exception as e:
        print(f"\n❌ ERROR: {e}", flush=True)
        import traceback
        traceback.print_exc()
        sys.exit(1)
