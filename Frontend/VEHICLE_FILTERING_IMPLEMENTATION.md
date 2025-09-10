# Vehicle Type Filtering Implementation

## Overview
This implementation adds a feature where ride requests are only sent to captains with the specific vehicle type selected by the user. The supported vehicle types are:
- **Car** (vehicleType: "car")
- **Motorcycle** (vehicleType: "motorcycle") 
- **Auto** (vehicleType: "auto")

## Implementation Details

### Backend Changes

#### 1. Maps Service (`Backend/services/maps.service.js`)
- **Modified Function**: `getCaptainsInTheRadius()`
- **Changes**: Added optional `vehicleType` parameter to filter captains by vehicle type
- **Logic**: 
  - If `vehicleType` is provided, adds `"vehicle.vehicleType": vehicleType` to the query
  - If `vehicleType` is null/undefined, returns all captains in radius (backward compatibility)

```javascript
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType = null) => {
  const query = {
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  };

  // Add vehicle type filter if specified
  if (vehicleType) {
    query["vehicle.vehicleType"] = vehicleType;
  }

  const captains = await captainModel.find(query);
  return captains;
};
```

#### 2. Ride Controller (`Backend/controllers/ride.controller.js`)
- **Modified Function**: `createRide()`
- **Changes**: Updated call to `getCaptainsInTheRadius()` to pass the `vehicleType` parameter
- **Impact**: Now only captains with matching vehicle type receive ride requests

```javascript
const captainsInRadius = await mapService.getCaptainsInTheRadius(
  pickupCoordinates.ltd,
  pickupCoordinates.lng,
  10,
  vehicleType  // Added this parameter
);
```

### Frontend Integration

The frontend was already properly configured to handle vehicle type selection:

#### 1. Vehicle Selection (`Frontend/src/components/VehiclePanel.jsx`)
- Users can select from Car, Motorcycle, or Auto
- Each selection sets the appropriate `vehicleType`:
  - Car → "car"
  - Motorcycle → "motorcycle" 
  - Auto → "auto"

#### 2. Ride Creation Flow
1. User selects pickup and destination
2. User chooses vehicle type from VehiclePanel
3. User confirms ride in ConfirmRide component
4. `createRide()` function sends request with selected `vehicleType`
5. Backend filters captains by vehicle type before sending ride requests

### Database Schema

The captain model already supports vehicle type filtering:
```javascript
vehicle: {
  vehicleType: {
    type: String,
    required: true,
    enum: ["car", "motorcycle", "auto"],
  },
  // ... other vehicle fields
}
```

## How It Works

1. **User Flow**:
   - User enters pickup and destination
   - User selects vehicle type (Car/Motorcycle/Auto)
   - User confirms ride
   - System finds nearby captains with matching vehicle type
   - Only matching captains receive the ride request

2. **Backend Flow**:
   - Ride creation request includes `vehicleType`
   - `getCaptainsInTheRadius()` filters by both location AND vehicle type
   - Only filtered captains receive the "new-ride" socket event

3. **Benefits**:
   - Users get matched with appropriate vehicle types
   - Captains only receive relevant ride requests
   - Improved user experience and captain efficiency
   - No impact on existing functionality

## Testing

A test script has been created at `Backend/test-vehicle-filtering.js` to verify the functionality:

```bash
cd Backend
node test-vehicle-filtering.js
```

## Backward Compatibility

- The `vehicleType` parameter is optional in `getCaptainsInTheRadius()`
- If no vehicle type is specified, all captains in radius are returned
- Existing functionality remains unchanged
- No breaking changes to existing APIs

## Vehicle Type Mapping

| UI Display | Database Value | Description |
|------------|----------------|-------------|
| Car | "car" | 4-seater vehicles |
| Motorcycle | "motorcycle" | 1-seater bikes |
| Auto | "auto" | 3-seater auto rickshaws |

## Error Handling

- If no captains with the specified vehicle type are found, the ride request will not be sent to any captains
- The system gracefully handles cases where vehicle type is not specified
- All existing error handling remains intact 