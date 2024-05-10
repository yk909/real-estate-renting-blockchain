// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Roomrental is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _totalAppartments;

    struct ApartmentStruct {
        uint id;
        string title;
        string description;
        string images;
        string category;
        string location;
        uint bathrooms;
        uint guests;
        uint rooms;
        uint price;
        address owner;
        bool reservated;
        bool deleted;
        bool availablity;
        uint timestamp;
    }

    struct ReservationStruct {
        uint id;
        address tenant;
        uint date;
        uint price;
        bool checked;
        bool cancelled;
    }

    struct ReviewStruct {
        uint id;
        uint appartmentId;
        string reviewText;
        uint value;
        uint cleanliness;
        uint accuracy;
        uint check_in;
        uint communication;
        uint location_score;
        uint timestamp;
        address owner;
    }

    struct FavoriteStruct {
        uint id;
        uint appartmentId;
        address guest;
        bool hasfavorited;
    }

    event SecurityFeeUpdated(uint newFee);

    uint public securityFee;
    uint public taxPercent;

    mapping(uint => ApartmentStruct) apartments;
    mapping(uint => ReservationStruct[]) reservationsOf;
    mapping(uint => ReviewStruct[]) reviewsOf;
    mapping(uint => FavoriteStruct) favoriteOf;
    mapping(uint => bool) appartmentExist;
    mapping(uint => uint[]) reservatedDates;
    mapping(uint => mapping(uint => bool)) isDateReservated;
    mapping(address => mapping(uint => bool)) hasReservated;

    constructor(uint _taxPercent, uint _securityFee) {
        taxPercent = _taxPercent;
        securityFee = _securityFee;
    }

    function createAppartment(
        string memory title,
        string memory description,
        string memory images,
        string memory category,
        string memory location,
        uint bathrooms,
        uint guests,
        uint rooms,
        uint price
    ) public {
        require(bytes(title).length > 0, "title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(images).length > 0, "Images cannot be empty");
        require(bytes(category).length > 0, "category cannot be empty");
        require(bytes(location).length > 0, "location cannot be empty");
        require(bathrooms > 0, "bathrooms cannot be zero");
        require(guests > 0, "guests cannot be zero");
        require(rooms > 0, "Rooms cannot be zero");
        require(price > 0 ether, "Price cannot be zero");

        _totalAppartments.increment();
        ApartmentStruct memory lodge;
        lodge.id = _totalAppartments.current();
        lodge.title = title;
        lodge.description = description;
        lodge.images = images;
        lodge.category = category;
        lodge.location = location;
        lodge.bathrooms = bathrooms;
        lodge.guests = guests;
        lodge.rooms = rooms;
        lodge.price = price;
        lodge.owner = msg.sender;
        lodge.availablity = true;
        lodge.timestamp = block.timestamp;

        appartmentExist[lodge.id] = true;

        apartments[_totalAppartments.current()] = lodge;
    }
    
    function updateAppartment
    (
        uint id,
        string memory title,
        string memory description,
        string memory images,
        string memory category,
        string memory location,
        uint bathrooms,
        uint guests,
        uint rooms,
        uint price
    ) public {
        require(appartmentExist[id] == true, "Appartment not found");
        require(msg.sender == apartments[id].owner, "Unauthorized personnel, owner only");
        require(bytes(title).length > 0, "title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(images).length > 0, "Images cannot be empty");
         require(bytes(category).length > 0, "category cannot be empty");
        require(bytes(location).length > 0, "location cannot be empty");
        require(bathrooms > 0, "bathrooms cannot be zero");
        require(guests > 0, "guests cannot be zero");
        require(rooms > 0, "Rooms cannot be zero");
        require(price > 0 ether, "Price cannot be zero");
        
        ApartmentStruct memory lodge = apartments[id];
        lodge.title = title;
        lodge.description = description;
        lodge.images = images;
        lodge.category = category;
        lodge.location = location;
        lodge.bathrooms = bathrooms;
        lodge.guests = guests;
        lodge.rooms = rooms;
        lodge.price = price;
        
        apartments[id] = lodge;
    }

    function deleteAppartment(uint id) public {
        require(appartmentExist[id] == true, "Appartment not found");
        require(apartments[id].owner == msg.sender, "Unauthorized entity");

        appartmentExist[id] = false;
        apartments[id].deleted = true;
    }

 

    function getApartments() public view returns (ApartmentStruct[] memory Apartments) {
        uint256 totalSpace;
        for (uint i = 1; i <= _totalAppartments.current(); i++) {
            if(!apartments[i].deleted) totalSpace++;
        }

        Apartments = new ApartmentStruct[](totalSpace);

        uint256 j = 0;
        for (uint i = 1; i <= _totalAppartments.current(); i++) {
            if(!apartments[i].deleted) {
                Apartments[j] = apartments[i];
                j++;
            }
        }
    }
    
    function getApartment(uint id) public view returns (ApartmentStruct memory) {
        return apartments[id];
    }

    function reservateApartment(uint id, uint[] memory dates) public payable {    
        require(appartmentExist[id], "Apartment not found!");
        require(msg.value >= apartments[id].price * dates.length + securityFee, "Insufficient fund!");
        require(datesAreCleared(id, dates), "Reservated date found among dates!");

        for (uint i = 0; i < dates.length; i++) {
            ReservationStruct memory reservation;
            reservation.id = reservationsOf[id].length;
            reservation.tenant = msg.sender;
            reservation.date = dates[i];
            reservation.price = apartments[id].price;
            reservationsOf[id].push(reservation);            
            isDateReservated[id][dates[i]] = true;
            reservatedDates[id].push(dates[i]);
        }
    }

    function datesAreCleared(uint id, uint[] memory dates) internal view returns (bool) {
        bool lastCheck = true;
        for(uint i=0; i < dates.length; i++) {
            for(uint j=0; j < reservatedDates[id].length; j++) {
                if(dates[i] == reservatedDates[id][j]) lastCheck = false;
            }
        }
        return lastCheck;
    }

    function checkInApartment(uint id, uint reservationId) public {    
       require(msg.sender == reservationsOf[id][reservationId].tenant, "Unauthorized tenant!");
       require(!reservationsOf[id][reservationId].checked, "Apartment already checked on this date!");
       
       reservationsOf[id][reservationId].checked = true;
       uint price = reservationsOf[id][reservationId].price;
       uint fee = (price * taxPercent) / 100;

       hasReservated[msg.sender][id] = true;
    
       payTo(apartments[id].owner, (price - fee));
       payTo(owner(), fee);
       payTo(msg.sender, securityFee);
    }

    function claimFunds(uint id, uint reservationId) public {
        require(msg.sender == apartments[id].owner, "Unauthorized entity");
        require(!reservationsOf[id][reservationId].checked, "Apartment already checked on this date!");

        uint price = reservationsOf[id][reservationId].price;
        uint fee = (price * taxPercent) / 100;
    
       payTo(apartments[id].owner, (price - fee));
       payTo(owner(), fee);
       payTo(msg.sender, securityFee);
    }

    function refundReservation(uint id, uint reservationId, uint date) public nonReentrant {
       require(!reservationsOf[id][reservationId].checked, "Apartment already checked on this date!");

        if(msg.sender != owner()) {
            require(msg.sender == reservationsOf[id][reservationId].tenant, "Unauthorized tenant!");
            require(reservationsOf[id][reservationId].date > currentTime(), "Can no longer refund, reservation date started");
        }

        reservationsOf[id][reservationId].cancelled = true;
        isDateReservated[id][date] = false;

        uint lastIndex = reservatedDates[id].length - 1;
        uint lastReservationId = reservatedDates[id][lastIndex];
        reservatedDates[id][reservationId] = lastReservationId;
        reservatedDates[id].pop();


        uint price = reservationsOf[id][reservationId].price;
        uint fee = securityFee * taxPercent / 100;

        payTo(apartments[id].owner, (securityFee - fee));
        payTo(owner(), fee);
        payTo(msg.sender, price);
   }


    function hasReservatedDateReached(uint id,uint reservationId) public view returns(bool) {
        return reservationsOf[id][reservationId].date < currentTime();
    }

    function getUnavailableDates(uint id) public view returns (uint[] memory) {
        return reservatedDates[id];
    }

   function getReservations(uint id) public view returns (ReservationStruct[] memory) {
        return reservationsOf[id];
   }
   
   function getReservation(uint id, uint reservationId) public view returns (ReservationStruct memory) {
        return reservationsOf[id][reservationId];
   }

    function updateSecurityFee(uint newFee) public onlyOwner {
       require(newFee > 0);
       securityFee = newFee;
       emit SecurityFeeUpdated(newFee);
    }

    function updateTaxPercent(uint newTaxPercent) public onlyOwner {
       taxPercent = newTaxPercent;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function addReview(uint appartmentId, string memory reviewText, uint value, uint cleanliness,
    uint accuracy, uint check_in, uint communication, uint location_score) public {
        require(appartmentExist[appartmentId],"Appartment not available");
        require(hasReservated[msg.sender][appartmentId],"Book first before review");
        require(bytes(reviewText).length > 0, "Review text cannot be empty");

        ReviewStruct memory review;

        review.id = reviewsOf[appartmentId].length;
        review.appartmentId = appartmentId;
        review.reviewText = reviewText;
        review.value = value;
        review.cleanliness = cleanliness;
        review.accuracy = accuracy;
        review.check_in = check_in;
        review.communication = communication;
        review.location_score = location_score;
        review.timestamp = block.timestamp;
        review.owner = msg.sender;

        reviewsOf[appartmentId].push(review);
    }

    function getReviews(uint appartmentId) public view returns (ReviewStruct[] memory) {
        return reviewsOf[appartmentId];
    }
    
    function tenantReservated(uint appartmentId) public view returns (bool) {
        return hasReservated[msg.sender][appartmentId];
    }

    function currentTime() internal view returns (uint256) {
        uint256 newNum = (block.timestamp * 1000) + 1000;
        return newNum;
    }

    function favoriteApartment(uint id, bool hasFavorited) public {
        require(appartmentExist[id], "Apartment not found!");

        FavoriteStruct memory favorite;
        favorite.id = id;
        favorite.guest = msg.sender;
        favorite.hasfavorited = hasFavorited;

        favoriteOf[id] = favorite;
    }

    function getFavorites(uint id) public view returns (FavoriteStruct memory) {
        return favoriteOf[id];
    } 
}

