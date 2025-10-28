# Australian Hospitals 3D Dashboard

An interactive 3D dashboard for visualizing Australian hospitals with an isometric view inspired by "Project Hospital". Built with Three.js, D3.js, and anime.js.

## Features

- **Interactive Map**: D3.js-powered map of Australia showing hospital locations
- **Isometric 3D View**: Project Hospital-style isometric hospital layouts
- **Medical Equipment**: Clickable 3D models of MRI, CT, X-Ray, and Ultrasound scanners
- **Real-time Data**: Machine logs, health status, and performance metrics
- **Smooth Animations**: Seamless transitions powered by anime.js
- **Responsive Design**: Works on all screen sizes

## Tech Stack

- **Three.js**: 3D rendering and isometric camera setup
- **D3.js**: Map visualization and SVG overlays
- **anime.js**: Smooth animations and transitions
- **Vite**: Fast development and build tooling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd anz_hospitals_3d
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select a Hospital**: Click on any hospital marker on the Australia map
2. **Pan Into Hospital**: Watch as the camera smoothly transitions into the hospital's isometric view
3. **Explore Equipment**: Click on any medical scanner to view its details
4. **View Machine Data**: See real-time logs, health status, and performance metrics
5. **Back to Map**: Click the "Back to Map" button to return to the overview

## Hospital Data

The dashboard includes 5 major Australian hospitals:
- Sydney General Hospital (NSW)
- Melbourne Medical Centre (VIC)
- Brisbane City Hospital (QLD)
- Perth Regional Hospital (WA)
- Adelaide Health Centre (SA)

Each hospital contains various medical equipment with simulated:
- Machine logs
- Health status indicators
- Performance metrics
- Temperature and efficiency data

## Project Structure

```
anz_hospitals_3d/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.js            # Application entry point
│   ├── sceneManager.js    # Three.js scene setup
│   ├── mapView.js         # D3.js map visualization
│   ├── hospitalView.js    # Isometric hospital layout
│   ├── interactions.js    # Mouse interactions and raycasting
│   ├── animations.js      # anime.js animations
│   ├── dataPanel.js       # Equipment data panel UI
│   ├── data.js            # Mock hospital and equipment data
│   └── styles.css         # Styles and animations
└── README.md
```

## Customization

### Adding More Hospitals

Edit `src/data.js` and add new hospital objects to the `hospitals` array:

```javascript
{
    id: 6,
    name: "Your Hospital Name",
    city: "City",
    state: "STATE",
    coordinates: { lat: -XX.XXXX, lng: XXX.XXXX },
    equipment: [
        { id: 'mri-6', type: 'MRI', position: { x: -5, z: -5 } }
    ]
}
```

### Adding Equipment Types

Add new equipment specifications in `src/data.js`:

```javascript
equipmentSpecs['NewType'] = {
    name: 'Equipment Name',
    fullName: 'Full Equipment Name',
    color: 0x3498db,
    dimensions: { width: 2, height: 2, depth: 2 }
};
```

Then create a model method in `src/hospitalView.js`.

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

Requires WebGL support.

## Performance

The application uses:
- Orthographic camera for efficient isometric rendering
- Shadow mapping for realistic lighting
- Optimized geometry for 3D models
- Hardware-accelerated animations

## License

MIT

## Credits

Inspired by the game "Project Hospital" for the isometric art style and layout.
