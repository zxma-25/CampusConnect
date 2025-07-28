# Google Maps API Setup Guide

## Overview
This project now includes Google Maps integration for all three dashboards (Student, Teacher, and Admin). Each dashboard has a customized map view with relevant campus information.

## Getting Your Google Maps API Key

### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for Maps API)

### Step 2: Enable the Maps JavaScript API
1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Maps JavaScript API"
3. Click on it and press **Enable**
4. Also enable "Places API" for enhanced functionality

### Step 3: Create API Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key

### Step 4: Secure Your API Key (Recommended)
1. Click on your API key to edit it
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your domain(s):
   - `localhost:*` (for local development)
   - `your-domain.com/*` (for production)
4. Under **API restrictions**, select **Restrict key**
5. Choose:
   - Maps JavaScript API
   - Places API

### Step 5: Update Your Project
Replace `YOUR_API_KEY` in the following files with your actual API key:

#### In student-dashboard.html:
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap&libraries=places"></script>
```

#### In teacher-dashboard.html:
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap&libraries=places"></script>
```

#### In admin-dashboard.html:
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap&libraries=places"></script>
```

## Features by Dashboard

### Student Dashboard
- **Campus Map**: Shows all academic buildings with classroom locations
- **Room Finder**: Quick buttons to locate specific classrooms (Math, CS Lab, Physics)
- **Your Location**: Shows simulated current location on campus
- **Interactive Markers**: Click on buildings to see room information and get directions

### Teacher Dashboard
- **Classroom Locations**: Shows classrooms where you teach
- **Faculty Office**: Displays your office location with office hours
- **Quick Navigation**: Direct buttons for each classroom you teach in
- **Directions**: Get directions between locations

### Admin Dashboard
- **Campus Overview**: Complete view of all campus facilities
- **Building Management**: View all academic and administrative buildings
- **Emergency Systems**: Show emergency contact points and safety locations
- **Parking Management**: Display all parking areas with capacity information
- **Campus Statistics**: Overview of campus facilities

## Customization

### Update Campus Coordinates
In `main.js`, update the `campusData.center` coordinates to match your actual campus location:

```javascript
const campusData = {
    center: { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE },
    // ... rest of configuration
};
```

### Add More Buildings
Add new buildings to the `campusData.buildings` array:

```javascript
{
    id: 'new-building',
    name: 'New Building Name',
    position: { lat: LATITUDE, lng: LONGITUDE },
    type: 'academic', // or 'laboratory', 'library', 'administration'
    rooms: ['Room 101', 'Room 102'],
    description: 'Building description'
}
```

### Customize Map Styling
The maps use custom styling defined in the `getMapStyles()` function. You can modify these styles or use Google's [Map Styling Wizard](https://mapstyle.withgoogle.com/) to create your own.

## API Usage and Billing

### Free Tier
Google Maps provides a generous free tier:
- $200 monthly credit
- Maps JavaScript API: $7 per 1000 loads
- With the credit, you get approximately 28,000 map loads per month free

### Best Practices
1. **API Key Security**: Never expose your API key in client-side code in production
2. **Usage Monitoring**: Monitor your API usage in Google Cloud Console
3. **Caching**: The maps are loaded once per page visit to minimize API calls
4. **Error Handling**: The code includes fallbacks for when maps fail to load

## Troubleshooting

### Common Issues

1. **Map not loading**: Check that your API key is correct and has the right APIs enabled
2. **Gray map**: Usually indicates billing issues or API restrictions
3. **Markers not showing**: Verify that the coordinates are correct
4. **Console errors**: Check the browser console for specific error messages

### Support Resources
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Maps JavaScript API Reference](https://developers.google.com/maps/documentation/javascript/reference)
- [Stack Overflow - google-maps tag](https://stackoverflow.com/questions/tagged/google-maps)

## Development vs Production

### For Development (localhost)
- Use the API key with HTTP referrer restrictions set to `localhost:*`
- No additional security measures needed

### For Production
- Use HTTP referrer restrictions for your domain
- Consider using a backend proxy to hide the API key
- Monitor usage and set up billing alerts
- Use HTTPS for your website

## Additional Features You Can Add

1. **Real-time Location**: Use the Geolocation API to show actual user location
2. **Directions**: Integrate Google Directions API for turn-by-turn navigation
3. **Places Search**: Add search functionality for nearby restaurants, services
4. **Traffic Layer**: Show real-time traffic information
5. **Street View**: Add Street View integration for building entrances
6. **Custom Overlays**: Add campus-specific overlays like walking paths or zones

---

**Note**: Remember to keep your API key secure and never commit it to public repositories. Consider using environment variables or a secure configuration system for production deployments.