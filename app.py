# app.py
from flask import Flask, jsonify, render_template, request, send_from_directory, abort
import csv
import os
import random
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='static', template_folder='templates')

DATA_CSV = os.path.join(os.path.dirname(__file__), 'data', 'airport_codes.csv')

# load airports once
AIRPORTS = []

def load_airports():
    global AIRPORTS
    AIRPORTS = []
    if not os.path.exists(DATA_CSV):
        raise FileNotFoundError(f"CSV not found at {DATA_CSV}")
    with open(DATA_CSV, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            # clean values
            for k in row:
                if row[k] is not None:
                    row[k] = row[k].strip()
                else:
                    row[k] = ''
            AIRPORTS.append(row)
    # Normalize IATA
    for a in AIRPORTS:
        if not a.get('IATA') or a['IATA'] == '-' or a['IATA'].upper() == 'N/A':
            a['IATA'] = ''
    return AIRPORTS


# Helper: search airports by city, state, iata, icao, or airport name
def search_airports(q):
    q = q.strip().lower()
    if not q:
        return []
    results = []
    for a in AIRPORTS:
        if any(q in (a.get(field,'').lower()) for field in ('City','State','IATA','ICAO','Airport Name')):
            results.append(a)
    return results

# Generate pseudo flights for an airport (mock data)
AIRLINE_SAMPLES = [
    "Air Example", "Example Air", "TransExample", "Global Wings", "SkyConnect", "FlyDemo"
]

def generate_flights(iata_code, count=8):
    # pick destinations from AIRPORTS with IATA defined and different from iata_code
    candidates = [a for a in AIRPORTS if a.get('IATA') and a['IATA'] != iata_code]
    if not candidates:
        return []
    flights = []
    seed_value = (iata_code or "XXX").upper()
    random.seed(seed_value)  # deterministic per airport
    dests = random.sample(candidates, k=min(count, len(candidates)))
    now = datetime.utcnow()
    for idx, dest in enumerate(dests, start=1):
        dep_offset_minutes = random.randint(30, 12*60)  # next 12 hours range
        dep_time = now + timedelta(minutes=dep_offset_minutes)
        airline = random.choice(AIRLINE_SAMPLES)
        flight_no = f"{''.join([c for c in airline.split()[0] if c.isalpha()][:2]).upper()}{random.randint(100,999)}"
        flights.append({
            "flight_number": flight_no,
            "airline": airline,
            "from_iata": iata_code,
            "from_city": next((a['City'] for a in AIRPORTS if a['IATA'] == iata_code), ""),
            "to_iata": dest.get('IATA'),
            "to_city": dest.get('City'),
            "to_airport": dest.get('Airport Name'),
            "departure_utc": dep_time.isoformat() + 'Z'
        })
    return flights

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/search')
def api_search():
    q = request.args.get('q', '').strip()
    if len(q) < 1:
        return jsonify({"results": []})
    results = search_airports(q)
    # return lightweight info
    out = []
    for a in results:
        out.append({
            "city": a.get("City",""),
            "state": a.get("State",""),
            "icao": a.get("ICAO",""),
            "iata": a.get("IATA",""),
            "name": a.get("Airport Name",""),
            "airlines": a.get("Airlines",""),
            "destinations": a.get("Destinations",""),
        })
    return jsonify({"results": out})

@app.route('/api/airport/<iata>')
def api_airport(iata):
    iata = (iata or '').upper()
    if not iata:
        return jsonify({"error":"No IATA provided"}), 400
    airport = next((a for a in AIRPORTS if a.get('IATA','').upper() == iata), None)
    if not airport:
        return jsonify({"error":"Airport not found"}), 404
    flights = generate_flights(iata, count=12)
    payload = {
        "city": airport.get("City",""),
        "state": airport.get("State",""),
        "icao": airport.get("ICAO",""),
        "iata": airport.get("IATA",""),
        "name": airport.get("Airport Name",""),
        "airlines": airport.get("Airlines",""),
        "destinations": airport.get("Destinations",""),
        "flights": flights
    }
    return jsonify(payload)

@app.route('/api/airports')
def api_airports():
    # return all airports (lightweight)
    out = [{
        "city": a.get("City",""),
        "state": a.get("State",""),
        "icao": a.get("ICAO",""),
        "iata": a.get("IATA",""),
        "name": a.get("Airport Name",""),
    } for a in AIRPORTS]
    return jsonify({"airports": out})

# Static files (if needed)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    load_airports()
    app.run(host='0.0.0.0', port=5000, debug=True)
