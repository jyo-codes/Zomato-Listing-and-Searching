document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');
    if (restaurantId) {
        fetchRestaurantDetails(restaurantId);
    }
});

function fetchRestaurantDetails(restaurantId) {
    fetch(`/api/restaurants/${restaurantId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Log the API response for debugging
            
            // Extract the restaurant data from the response
            if (data && typeof data === 'object') {
                displayRestaurantDetails(data);
            } else {
                document.querySelector('main').innerHTML = '<p>Restaurant not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching details:', error);
            document.querySelector('main').innerHTML = '<p>Error fetching restaurant details.</p>';
        });
}
function displayRestaurantDetails(restaurant) {
    // Extract data and provide default values if not available
    const restaurantName = restaurant.name || 'No Name Available';
    const restaurantCuisines = restaurant.cuisines || 'Not Available';
    const averageCostForTwo = restaurant.average_cost_for_two ? `Average Cost for Two: ${restaurant.average_cost_for_two}` : 'Not Available';
    const address = restaurant.location ? `Address: ${restaurant.location.address}` : 'Not Available';
    const ratingAggregate = restaurant.user_rating ? restaurant.user_rating.aggregate_rating : 'Not Available';
    const ratingColor = restaurant.user_rating ? restaurant.user_rating.rating_color : 'Not Available';
    const ratingText = restaurant.user_rating ? restaurant.user_rating.rating_text : 'Not Available';
    const ratingVotes = restaurant.user_rating ? restaurant.user_rating.votes : 'Not Available';
    const imageUrl = restaurant.featured_image || 'No Image Available';
    const restaurantUrl = restaurant.url || '#';
    const menuUrl = restaurant.menu_url || '#';
    const eventsUrl = restaurant.events_url || '#';
    const bookUrl = restaurant.book_url || '#';
    
    // Update HTML elements
    document.getElementById('restaurant-name').textContent = restaurantName;
    document.getElementById('restaurant-cuisines').textContent = `Cuisines: ${restaurantCuisines}`;
    document.getElementById('restaurant-cost').textContent = averageCostForTwo;
    document.getElementById('restaurant-address').textContent = address;
    document.getElementById('restaurant-rating').innerHTML = `
        Rating: <span style="color: ${ratingColor};">${ratingAggregate}</span> (${ratingText}) - ${ratingVotes} votes
    `;
    document.getElementById('restaurant-url').href = restaurantUrl;
    document.getElementById('restaurant-url').textContent = 'Visit Restaurant Page';
    document.getElementById('menu-url').href = menuUrl;
    document.getElementById('menu-url').textContent = 'View Menu';
    document.getElementById('events-url').href = eventsUrl;
    document.getElementById('events-url').textContent = 'View Events';
    document.getElementById('book-url').href = bookUrl;
    document.getElementById('book-url').textContent = 'Book a Table';
    document.getElementById('restaurant-image').src = imageUrl;
    document.getElementById('restaurant-image').alt = `Image of ${restaurantName}`;
}

