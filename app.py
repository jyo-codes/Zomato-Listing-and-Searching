from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['ZOMATO']
collection = db['zomato_restaurants']
json_data_collection = db['json_data']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/restaurant_detail.html')
def restaurant_detail():
    return render_template('restaurant_detail.html')

def fetch_additional_data(restaurant_id):
    # Fetch data from the json_data collection
    result = json_data_collection.find_one({
        "$or": [
            {"restaurants.restaurant.R.res_id": int(restaurant_id)},
            {"restaurants.restaurant.id": str(restaurant_id)}
        ]
    })

    if result:
        # Return the restaurant data from the results array
        restaurants = result.get('restaurants', [])
        for item in restaurants:
            restaurant = item.get('restaurant', {})
            if restaurant.get('R', {}).get('res_id') == int(restaurant_id) or restaurant.get('id') == str(restaurant_id):
                return restaurant

    return None

@app.route('/api/restaurants/<restaurant_id>', methods=['GET'])
def get_restaurant_by_id(restaurant_id):
    # Fetch restaurant data from json_data collection
    restaurant = fetch_additional_data(restaurant_id)
    if restaurant:
        return jsonify(restaurant)
    else:
        return jsonify({'error': 'Restaurant not found'}), 404

# API endpoint to get a list of restaurants with pagination support
@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    skip = (page - 1) * per_page
    total_count = collection.count_documents({})
    total_pages = (total_count + per_page - 1) // per_page  # Calculate total pages

    restaurants = collection.find().skip(skip).limit(per_page)
    result = []
    for restaurant in restaurants:
        restaurant['_id'] = str(restaurant['_id'])  # Convert ObjectId to string
        result.append(restaurant)

    return jsonify({'restaurants': result, 'totalPages': total_pages, 'currentPage': page})

if __name__ == '__main__':
    app.run(debug=True)
