var app = angular.module("OSPApp", ["ngRoute"]);

app.config(function($routeProvider) {   
    $routeProvider
        .when("/", {
            templateUrl: "Home.html"
        })
        .when("/about", {
            templateUrl: "AboutUs.html"
        })
        .when("/signup", {
            templateUrl: "SignUp.html",
            controller: "SignUpController"
        })
        .when("/signin", {
            templateUrl: "SignIn.html",
            controller: "SignInController"
        })
        .when("/reviews", {
            templateUrl: "Reviews.html",
            controller: 'reviewController'
        })
        .when("/services", {
            templateUrl: "Service.html"
        })
        .when("/shopping", {
            templateUrl: "Shopping.html",
            controller: "ShoppingController"
        })
        .when("/delivery", {
            templateUrl: "Delivery.html",
            controller: "DeliveryController"
        })
        .when("/payment", {
            templateUrl: "Payment.html",
            controller: "PaymentController"
        })
        .when("/orderConfirmation", {
            templateUrl: "OrderConfirmation.html",
            controller: "OrderConfirmationController"
        })
        .when("/express", {
            templateUrl: "Express.html",
        })
        .when("/cart", {
            templateUrl: "cart.html",
            controller: "CartController"
        })
        .when("/search", {
            templateUrl: "../IT-2/search.html"
        })
        .when("/insert", {
            templateUrl: "../IT-2/insert.html"
        })
        .when("/update", {
            templateUrl: "../IT-2/update.html"
        })
        .when("/delete", {
            templateUrl: "../IT-2/delete.html"
        })
        .when("/select", {
            templateUrl: "../IT-2/select.html"
        })
        .otherwise({
            redirectTo: "/"
        });
});

app.controller('MainController', function($scope, $location, $http) {
    $scope.$watch(function() {
        return localStorage.getItem("userLoggedIn");
    }, function(newVal) {
        $scope.isUserLoggedIn = newVal === "true";
    });

    $scope.isSignUpOrIn = function() {
        var path = $location.path();
        return path === '/signin' || path === '/signup';
    };

    $scope.logout = function() {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("loginId");
        sessionStorage.removeItem("cartItems");
        sessionStorage.removeItem("deliveryInfo");
        sessionStorage.removeItem("orderDetails"); 
        $scope.isUserLoggedIn = false;
        $location.path('/signin');
    };

    var url = '../IT-2/checkAdmin.php'
    var data = {username: localStorage.getItem("loginId")};
    $http.post(url, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
        })
        .then(function (response) {
            if (response.data == 'Admin') {
                $scope.isAdmin = true;
            }
            else {
                $scope.isAdmin = false;
            }
            console.log($scope.isAdmin);
        });

    $scope.dropdownVisible = false;
    $scope.toggleDropdown = function () {
        $scope.dropdownVisible = !$scope.dropdownVisible;
    }
});

app.controller('reviewController', function ($scope, $http, $location) {
    $scope.rating = null;
    
    var url = '../IT-2/review.php';
    $http.get(url)
        .then(function (response) {
            console.log("Full response:", response);
            console.log("Response data:", response.data);
            $scope.items = response.data;
        });
    $scope.sortField = 'name';
    $scope.reverse = false;
    $scope.showItems = true;
    $scope.showTable = false; 

    $scope.fetchReview = function (id) {
        var reviewUrl = '../IT-2/review.php';
        var data = {id: id};
        $http.post(reviewUrl, JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        })
            .then(function (response) {
                $scope.reviews = response.data;
                console.log(response.data);
        });

        $scope.sortField = 'username';
        $scope.reverse = false;
        $scope.showItems = false;
        $scope.showTable = true;
    };

    $scope.username = localStorage.getItem("loginId");
    $scope.showForm = false;
    
    $scope.toggleForm = function() {
        $scope.showForm = !$scope.showForm;
    };

    $scope.submitReview = function() {
        const formData = new FormData();
        formData.append('username', $scope.username);
        formData.append('itemID', $scope.itemID);
        formData.append('reviewText', $scope.reviewText);
        formData.append('rating', $scope.rating);

        $http.post('../IT-2/review.php', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .then(function(response) {
            $scope.itemID = '';
            $scope.reviewText = '';
            $scope.rating = '';
            $scope.showForm = false;

            if (response.data.error) {
                alert("Error: " + response.data.error + "\nPlease ensure all fields are filled and you haven't reviewed this product before.");
            } else {
                alert("Thank you for reviewing our products!");
            }
        })
        .catch(function(error) {
            console.error("Submission error:", error);
            alert("An error occurred while submitting your review.");
        });
    };
});

app.controller('SignInController', function($scope, $http, $location) {
    $scope.loginId = '';
    $scope.password = '';
    $scope.errorMessage = '';
    
    $scope.signin = function() {
        var formData = new FormData();
        formData.append('loginId', $scope.loginId);
        formData.append('password', $scope.password);
        
        $http.post('../IT-2/signin.php', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function(response) {
            if (response.data.success) {
                // Store loginId in localStorage
                localStorage.setItem("userLoggedIn", "true");
                localStorage.setItem("loginId", $scope.loginId);
                
                // Also store userId in localStorage
                if (response.data.userId) {
                    localStorage.setItem("userId", response.data.userId);
                }
                
                $location.path('/');
            } else {
                $scope.errorMessage = response.data.message;
            }
        }, function(error) {
            $scope.errorMessage = 'Error during sign in. Please try again.';
            console.error(error);
        });
    };
});

app.controller('OrderConfirmationController', function($scope, $location, $timeout) {
    try {
        const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
        
            if (orderDetails) {
                $scope.orderId = orderDetails.orderId || 'Not available';

                // Set order date to today's date
                const today = new Date();
                $scope.orderDate = formatDate(today);

                if (orderDetails.deliveryDate) {
                    $scope.deliveryDate = formatDateWithTime(orderDetails.deliveryDate, orderDetails.deliveryTime);
                } else {
                    $scope.deliveryDate = formatDate(orderDetails.dateReceived);
                }

            $scope.paymentCode = orderDetails.paymentCode || 'Not available';
            $scope.totalPrice = orderDetails.totalPrice ? 
                `$${parseFloat(orderDetails.totalPrice).toFixed(2)}` : 'Not available';
            
            $scope.isExpressDelivery = orderDetails.isExpressDelivery;
            
            $scope.hasError = false;
        } else {
            $scope.hasError = true;
            $scope.errorMessage = 'No order details found.';
            $timeout(() => {
                $location.path('/');
            }, 3000);
        }
    } catch (error) {
        $scope.hasError = true;
        $scope.errorMessage = 'Error retrieving order details.';
        $timeout(() => {
            $location.path('/');
        }, 3000);
    }

    function formatDate(dateString) {
        if (!dateString) return 'Not available';
        
        try {
            const date = new Date(dateString);
            
            if (isNaN(date.getTime())) {
                return dateString; 
            }
            
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            };
            
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            return dateString;
        }
    }
    
    function formatDateWithTime(dateString, timeString) {
        if (!dateString) return 'Not available';
        
        try {
            let formattedDate = '';
            
            if (dateString.includes('-')) {
                const [year, month, day] = dateString.split('-');
                const date = new Date(year, month - 1, day);
                
                const options = { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                };
                
                formattedDate = date.toLocaleDateString('en-US', options);
            } else {
                const date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    const options = { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                    };
                    formattedDate = date.toLocaleDateString('en-US', options);
                } else {
                    formattedDate = dateString;
                }
            }
            
            if (timeString) {
                let formattedTime = '';
                
                if (timeString.includes(':')) {
                    const [hours, minutes] = timeString.split(':');
                    const time = new Date();
                    time.setHours(parseInt(hours, 10));
                    time.setMinutes(parseInt(minutes, 10));
                    
                    formattedTime = time.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                } else {
                    formattedTime = timeString;
                }
                
                return `${formattedDate} at ${formattedTime}`;
            }
            
            return formattedDate;
        } catch (error) {
            return dateString + (timeString ? ` at ${timeString}` : '');
        }
    }
});


app.controller('DeliveryController', function($scope, $http, $location, $timeout) {
    if (!localStorage.getItem("userLoggedIn") || localStorage.getItem("userLoggedIn") !== "true") {
        $location.path('/signin');
        return;
    }

    $scope.map = null;
    $scope.directionsRenderer = null;
    $scope.markers = [];
    $scope.currentRoute = null;
    $scope.deliveryDistance = '-';
    $scope.deliveryDuration = '-';
    $scope.deliveryCost = '-';
    $scope.proceedToPaymentDisabled = true;
    
    $scope.warehouses = [
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
    
    $scope.selectedWarehouse = '';
    $scope.destinationAddress = '';
    $scope.srcCode = '';
    $scope.dstCode = '';
    $scope.distance = '';
    $scope.duration = '';
    $scope.tripId = '';
    
    $scope.initDateTime = function() {
        const today = new Date();
        const minDeliveryDate = new Date(today);
        minDeliveryDate.setDate(today.getDate() + 3);
        
        const yyyy = minDeliveryDate.getFullYear();
        const mm = String(minDeliveryDate.getMonth() + 1).padStart(2, '0');
        const dd = String(minDeliveryDate.getDate()).padStart(2, '0');
        
        $scope.deliveryDate = new Date(minDeliveryDate);
        $scope.minDeliveryDate = `${yyyy}-${mm}-${dd}`;
        
        const defaultTime = new Date();
        defaultTime.setHours(12, 0, 0);
        $scope.deliveryTime = defaultTime;
    };
    
    window.initMap = function() {
        $scope.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#4CAF50',
                strokeWeight: 5
            }
        });
        
        $scope.map = new google.maps.Map(document.getElementById('delivery-map'), {
            zoom: 11,
            center: { lat: 43.6532, lng: -79.3832 },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        $scope.directionsRenderer.setMap($scope.map);
        
        $scope.addWarehouseMarkers();
        
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    };
    
    window.mapLoadError = function() {
        alert("There was an error loading the map. Please refresh the page.");
    };
    
    $scope.addWarehouseMarkers = function() {
        $scope.markers.forEach(marker => marker.setMap(null));
        $scope.markers = [];
        
        $scope.warehouses.forEach(warehouse => {
            const marker = new google.maps.Marker({
                position: { lat: warehouse.lat, lng: warehouse.lng },
                map: $scope.map,
                title: warehouse.name,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<div><strong>${warehouse.name}</strong><br>${warehouse.address}</div>`
            });
            
            marker.addListener('click', () => {
                infoWindow.open($scope.map, marker);
            });
            
            $scope.markers.push(marker);
        });
    };
    
    $scope.calculateAndDisplayRoute = function() {
        if (!$scope.selectedWarehouse || !$scope.destinationAddress) {
            alert('Please select a warehouse and enter a destination address.');
            return;
        }
        
        let originCoords = { lat: 43.6532, lng: -79.3832 };
        const selectedWarehouse = $scope.warehouses.find(w => w.address === $scope.selectedWarehouse);
        if (selectedWarehouse) {
            originCoords = { lat: selectedWarehouse.lat, lng: selectedWarehouse.lng };
        }
        
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: $scope.destinationAddress }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                const destinationCoords = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                
                $scope.drawRouteLine(originCoords, destinationCoords);
                
                const distance = $scope.calculateDistance(originCoords, destinationCoords);
                
                const duration = Math.round(distance * 2);
                
                $scope.updateRouteInfo(distance, duration);
                $scope.storeTrip($scope.selectedWarehouse, $scope.destinationAddress, distance);
                
                $scope.proceedToPaymentDisabled = false;
                
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            } else {
                alert('Could not find the destination address. Please try a more specific address.');
            }
        });
    };
    
    $scope.drawRouteLine = function(origin, destination) {
        $scope.directionsRenderer.setDirections({ routes: [] });
        
        const routePath = new google.maps.Polyline({
            path: [origin, destination],
            geodesic: true,
            strokeColor: '#4CAF50',
            strokeOpacity: 1.0,
            strokeWeight: 5
        });
        
        if ($scope.currentRoute) {
            $scope.currentRoute.setMap(null);
        }
        
        routePath.setMap($scope.map);
        $scope.currentRoute = routePath;
        
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(origin);
        bounds.extend(destination);
        $scope.map.fitBounds(bounds);
        
        new google.maps.Marker({
            position: origin,
            map: $scope.map,
            title: 'Warehouse',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        });
        
        new google.maps.Marker({
            position: destination,
            map: $scope.map,
            title: 'Destination',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
        });
    };
    
    $scope.calculateDistance = function(point1, point2) {
        const R = 6371;
        const dLat = (point2.lat - point1.lat) * Math.PI / 180;
        const dLng = (point2.lng - point1.lng) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    };
    
    $scope.updateRouteInfo = function(distance, duration) {
        const distanceKm = distance.toFixed(1);
        
        const baseDeliveryCost = 5;
        const costPerKm = 0.5;
        const deliveryCost = (baseDeliveryCost + (distanceKm * costPerKm)).toFixed(2);
        
        $scope.deliveryDistance = `${distanceKm} km`;
        $scope.deliveryDuration = `${duration} minutes`;
        $scope.deliveryCost = `$${deliveryCost}`;
        
        $scope.distance = distanceKm;
        $scope.duration = duration;
        $scope.deliveryCostValue = deliveryCost;
    };
    
    $scope.storeTrip = function(origin, destination, distance) {
        const selectedWarehouse = $scope.warehouses.find(w => w.address === origin);
        $scope.srcCode = selectedWarehouse ? selectedWarehouse.id : 0;
        $scope.dstCode = destination;
    };
    
    $scope.formatTimeValue = function() {
        const selectedTime = $scope.deliveryTime;

        if (selectedTime instanceof Date) {
            const hours = selectedTime.getHours();
            const minutes = selectedTime.getMinutes();
            // Format without milliseconds - just hours and minutes
            $scope.formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            if (hours < 8 || hours >= 16) {
                alert('Please select a delivery time between 8:00 AM and 4:00 PM');
                const resetTime = new Date();
                resetTime.setHours(12, 0, 0);
                $scope.deliveryTime = resetTime;
                $scope.formattedTime = "12:00";
            }
        } else {
            $scope.formattedTime = "12:00";
        }
    };
    
    $scope.submitTripData = function() {
        $scope.formatTimeValue();
        
        const formData = new FormData();
        formData.append('action', 'create_trip');
        formData.append('srcCode', $scope.srcCode);
        formData.append('dstCode', $scope.dstCode);
        formData.append('distance', $scope.distance);
        formData.append('price', $scope.deliveryCostValue);
        
        let deliveryDateStr = '';
        if ($scope.deliveryDate instanceof Date) {
            deliveryDateStr = $scope.deliveryDate.toISOString().split('T')[0];
        } else {
            deliveryDateStr = $scope.deliveryDate;
        }
        
        formData.append('deliveryDate', deliveryDateStr);
        formData.append('deliveryTime', $scope.formattedTime);
        
        $http.post('../IT-2/ProcessTrip.php', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function(response) {
            if (response.data && response.data.success) {
                $scope.tripId = response.data.tripId;
                $scope.proceedToPaymentDisabled = false;
                
                const deliveryInfo = {
                    srcCode: $scope.srcCode,
                    dstCode: $scope.dstCode,
                    distance: $scope.distance,
                    duration: $scope.duration,
                    cost: $scope.deliveryCostValue,
                    tripId: $scope.tripId,
                    address: $scope.destinationAddress,
                    date: deliveryDateStr,
                    time: $scope.formattedTime
                };
                
                sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
                
                alert("Delivery details saved successfully!");
            } else {
                const errorMsg = response.data && response.data.message ? response.data.message : 'Unknown error';
                alert('Error creating trip: ' + errorMsg);
            }
        })
        .catch(function(error) {
            alert('An error occurred while processing your request.');
        });
    };
    
    $scope.proceedToPayment = function() {
        $location.path('/payment');
    };
    
    $scope.backToCart = function() {
        $location.path('/cart');
    };
    
    $scope.loadGoogleMapsAPI = function() {
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC9SxY_FAZ4sEH0W12E3sRJwSjz5AceKlA&callback=initMap&onerror=mapLoadError";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    };
    
    $scope.init = function() {
        $scope.initDateTime();
        
        $timeout(function() {
            $scope.loadGoogleMapsAPI();
        }, 100);
    };
    
    $scope.init();
});
