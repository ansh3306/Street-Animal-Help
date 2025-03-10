from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# MySQL Configuration (Update password if needed)
db = mysql.connector.connect(
    host="localhost",
    user="root",            # Update if you use a different username
    password="12345",       # Replace with your actual MySQL password
    database="street_animal_help",
    autocommit=True         # Ensure changes are committed automatically
)
cursor = db.cursor()

@app.route('/')
def home():
    return "Street Animal Help Backend is Running!"

@app.route('/submit-vet', methods=['POST'])
def add_vet():
    try:
        data = request.get_json(force=True)
        print("Received Data:", data)  # Debug log

        # Validate that required fields are present and non-empty
        if not all(key in data and data[key].strip() for key in ["name", "address", "contact", "services"]):
            print("Validation Failed:", data)
            return jsonify({"message": "Missing or empty required fields"}), 400

        # Retrieve location values (if provided, otherwise use NULL)
        latitude = data.get("latitude", "").strip() or None
        longitude = data.get("longitude", "").strip() or None

        sql = """
          INSERT INTO vets (name, address, contact, services, latitude, longitude) 
          VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            data['name'].strip(), 
            data['address'].strip(), 
            data['contact'].strip(), 
            data['services'].strip(), 
            latitude, 
            longitude
        )

        cursor.execute(sql, values)
        db.commit()

        print("Data inserted successfully!")
        return jsonify({"message": "Vet added successfully!"}), 201
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "Internal server error"}), 500

@app.route('/vets', methods=['GET'])
def get_vets():
    cursor.execute("SELECT * FROM vets")
    vets = cursor.fetchall()
    vet_list = [{"id": v[0], "name": v[1], "address": v[2], "contact": v[3], "services": v[4], "latitude": v[5], "longitude": v[6]} for v in vets]
    return jsonify(vet_list)

@app.route('/test-db')
def test_db():
    try:
        cursor.execute("SELECT DATABASE();")
        db_name = cursor.fetchone()
        return jsonify({"message": "Database connected successfully!", "database": db_name[0]})
    except Exception as e:
        return jsonify({"message": "Database connection failed", "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
