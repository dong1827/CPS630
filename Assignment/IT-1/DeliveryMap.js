document.addEventListener("DOMContentLoaded", function() {
    let isLoggedIn = localStorage.getItem("userLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
        window.location.href = "SignIn.html";
    }
});


let map;
let directionsRenderer;
let markers = [];


const warehouses = [
    {
        id: 1,
        name: 'Downtown Toronto Warehouse',
        address: '123 Queen St, Toronto, ON',
        lat: 43.6516,
        lng: -79.3839
    },
    {
        id: 2,
        name: 'North York Warehouse',
        address: '456 Finch Ave, North York, ON',
        lat: 43.7806,
        lng: -79.4152
    },
    {
        id: 3,
        name: 'Scarborough Warehouse',
        address: '789 Markham Rd, Scarborough, ON',
        lat: 43.7731,
        lng: -79.2526
    }
];

// Initialize the map when the page loads
function initMap() {
    console.log("Initializing map");
    

    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#4CAF50',
            strokeWeight: 5
        }
    });
    
    map = new google.maps.Map(document.getElementById('delivery-map'), {
        zoom: 11,
        center: { lat: 43.6532, lng: -79.3832 }, // Toronto
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    directionsRenderer.setMap(map);
    
    addWarehouseMarkers();
    
    addWarehouseSelectionListeners();
    
    console.log("Map initialization complete");
}

function addWarehouseMarkers() {
    console.log("Adding warehouse markers");
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Add a marker for each warehouse
    warehouses.forEach(warehouse => {
        const marker = new google.maps.Marker({
            position: { lat: warehouse.lat, lng: warehouse.lng },
            map: map,
            title: warehouse.name,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${warehouse.name}</strong><br>${warehouse.address}</div>`
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        markers.push(marker);
    });
    
    console.log("Warehouse markers added:", markers.length);
}


function calculateAndDisplayRoute(origin, destination, date, time) {
    console.log("Calculating route from", origin, "to", destination);
    

    let originCoords = { lat: 43.6532, lng: -79.3832 };
    const selectedWarehouse = warehouses.find(w => w.address === origin);
    if (selectedWarehouse) {
        originCoords = { lat: selectedWarehouse.lat, lng: selectedWarehouse.lng };
    }
    

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: destination }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            const destinationCoords = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            
            console.log("Origin coordinates:", originCoords);
            console.log("Destination coordinates:", destinationCoords);
            
            // Draw a route line between points
            drawRouteLine(originCoords, destinationCoords);
            
            // Calculate straight-line distance
            const distance = calculateDistance(originCoords, destinationCoords);
            
            // Calculate estimated time (simple approximation)
            const duration = Math.round(distance * 2); // Assuming 30 km/h average speed
            

            updateRouteInfo(distance, duration);
            

            storeTrip(origin, destination, distance);
        } else {
            console.error("Geocode failed:", status);
            alert('Could not find the destination address. Please try a more specific address.');
        }
    });
}

function drawRouteLine(origin, destination) {
    directionsRenderer.setDirections({ routes: [] });
    
    const routePath = new google.maps.Polyline({
        path: [origin, destination],
        geodesic: true,
        strokeColor: '#4CAF50',
        strokeOpacity: 1.0,
        strokeWeight: 5
    });
    
    if (window.currentRoute) {
        window.currentRoute.setMap(null);
    }
    
    routePath.setMap(map);
    window.currentRoute = routePath;
    
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    map.fitBounds(bounds);
    
    new google.maps.Marker({
        position: origin,
        map: map,
        title: 'Warehouse',
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
    });
    
    new google.maps.Marker({
        position: destination,
        map: map,
        title: 'Destination',
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
    });
}

function calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

function updateRouteInfo(distance, duration) {
    const distanceKm = distance.toFixed(1);
    
    const baseDeliveryCost = 5;
    const costPerKm = 0.5;
    const deliveryCost = (baseDeliveryCost + (distanceKm * costPerKm)).toFixed(2);
    
    document.getElementById('delivery-distance').textContent = `${distanceKm} km`;
    document.getElementById('delivery-time').textContent = `${duration} minutes`;
    document.getElementById('delivery-cost').textContent = `$${deliveryCost}`;
    
    if (document.getElementById('distance-input')) {
        document.getElementById('distance-input').value = distanceKm;
    }
    if (document.getElementById('duration-input')) {
        document.getElementById('duration-input').value = duration;
    }
    if (document.getElementById('delivery-cost-input')) {
        document.getElementById('delivery-cost-input').value = deliveryCost;
    }
}

function storeTrip(origin, destination, distance) {
    const selectedWarehouse = warehouses.find(w => w.address === origin);
    const srcCode = selectedWarehouse ? selectedWarehouse.id : 0;
    
    const distanceKm = distance.toFixed(1);
    const baseDeliveryCost = 5;
    const costPerKm = 0.5;
    const price = (baseDeliveryCost + (distanceKm * costPerKm)).toFixed(2);
    

    if (document.getElementById('src-code-input')) {
        document.getElementById('src-code-input').value = srcCode;
    }
    if (document.getElementById('dst-code-input')) {
        document.getElementById('dst-code-input').value = destination;
    }
    if (document.getElementById('trip-price-input')) {
        document.getElementById('trip-price-input').value = price;
    }
}


function addWarehouseSelectionListeners() {
    const warehouseSelect = document.getElementById('warehouse-select');
    const destinationInput = document.getElementById('destination-address');
    const calculateRouteBtn = document.getElementById('calculate-route-btn');
    const deliveryDateInput = document.getElementById('delivery-date');
    const deliveryTimeInput = document.getElementById('delivery-time');
    
    if (warehouseSelect) {
        warehouses.forEach(warehouse => {
            const option = document.createElement('option');
            option.value = warehouse.address;
            option.textContent = warehouse.name;
            warehouseSelect.appendChild(option);
        });
    }
    
    if (calculateRouteBtn) {
        calculateRouteBtn.addEventListener('click', function() {
            const selectedWarehouse = warehouseSelect.value;
            const destinationAddress = destinationInput.value;
            
            if (selectedWarehouse && destinationAddress) {
                calculateAndDisplayRoute(
                    selectedWarehouse,
                    destinationAddress,
                    deliveryDateInput ? deliveryDateInput.value : null,
                    deliveryTimeInput ? deliveryTimeInput.value : null
                );
                
                document.getElementById('proceed-payment-btn').disabled = false;
            } else {
                alert('Please select a warehouse and enter a destination address.');
            }
        });
    }
}

function submitTripData() {
    const srcCode = document.getElementById('src-code-input').value;
    const dstCode = document.getElementById('dst-code-input').value;
    const distance = document.getElementById('distance-input').value;
    const price = document.getElementById('delivery-cost-input').value;
    
    console.log("Submitting trip data:", srcCode, dstCode, distance, price);
    
    const formData = new FormData();
    formData.append('action', 'create_trip');
    formData.append('srcCode', srcCode);
    formData.append('dstCode', dstCode);
    formData.append('distance', distance);
    formData.append('price', price);
    
    fetch('../IT-2/ProcessTrip.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Raw response:", response);
        return response.text();
    })
    .then(text => {
        console.log("Response text:", text);
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("JSON parse error:", e);
            throw new Error('Invalid JSON response');
        }
    })
    .then(data => {
        console.log("Parsed data:", data);
        if (data && data.success) {
            if (document.getElementById('trip-id-input')) {
                document.getElementById('trip-id-input').value = data.tripId;
            }
            document.getElementById('proceed-payment-btn').disabled = false;
            alert("Delivery details saved successfully!");
        } else {
            const errorMsg = data && data.message ? data.message : 'Unknown error';
            alert('Error creating trip: ' + errorMsg);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your request. Check console for details.');
    });
}
