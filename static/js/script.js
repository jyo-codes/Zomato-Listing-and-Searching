document.addEventListener('DOMContentLoaded', function () {
    const restaurantsContainer = document.getElementById('restaurants');
    const searchIcon = document.querySelector('.search_icon i');
    const searchInput = document.getElementById('restaurant-id');

    fetch('/restaurants?page=1&per_page=10')
        .then(response => response.json())
        .then(data => {
            if (data.restaurants.length > 0) {
                data.restaurants.forEach(restaurant => {
                    const restaurantDiv = document.createElement('div');
                    restaurantDiv.classList.add('restaurant');

                    const restaurantContent = `
                        <h2><a href="javascript:void(0)" onclick="fetchRestaurantDetail(${restaurant.id})">${restaurant.name}</a></h2>
                        <p>Cuisines: ${restaurant.cuisines}</p>
                        <p>Average Cost for Two: ${restaurant.average_cost_for_two}</p>
                        <p>Rating: ${restaurant.rating}</p>
                        <p>Address: ${restaurant.address}</p>
                        <img src="${restaurant.featured_image}" alt="${restaurant.name}">
                    `;

                    restaurantDiv.innerHTML = restaurantContent;
                    restaurantsContainer.appendChild(restaurantDiv);
                });
            } else {
                restaurantsContainer.innerHTML = '<p>No restaurants found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching restaurants:', error);
            restaurantsContainer.innerHTML = '<p>Error fetching restaurants.</p>';
        });

    searchIcon.addEventListener('click', function () {
        const restaurantId = searchInput.value;
        if (restaurantId) {
            fetchRestaurantDetail(restaurantId);
        }
    });
});
