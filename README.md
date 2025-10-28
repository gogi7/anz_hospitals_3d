# Australian Hospitals 3D Dashboard 🏥

A cutting-edge, interactive 3D dashboard for visualizing Australian hospitals with stunning isometric views inspired by "Project Hospital". Features advanced post-processing effects, particle systems, and a modern glassmorphism UI.

## ✨ Features

### Core Functionality
- **Interactive Map**: D3.js-powered map of Australia with animated hospital markers
- **Isometric 3D View**: Project Hospital-style isometric hospital interiors with transparent walls
- **Medical Equipment**: Fully animated 3D models:
  - MRI Scanner with moving patient table
  - CT Scanner with rotating gantry
  - X-Ray Machine
  - Ultrasound Equipment
- **Real-time Data Visualization**: Live machine logs, health status indicators, and performance metrics

### Advanced Graphics
- **Post-Processing Effects**:
  - Bloom effect for glowing elements
  - SMAA anti-aliasing
  - Tone mapping (ACES Filmic)
  - Vignette effect
- **Particle Systems**:
  - Data flow particles around active equipment
  - Ambient glow effects
  - Animated scanning beams
- **PBR Materials**: Physically-based rendering with proper metalness and roughness
- **Dynamic Shadows**: Real-time shadow mapping with soft shadows

### Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass panels with backdrop blur
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Toast Notifications**: Non-intrusive success/error/info messages
- **Settings Panel**: Configurable graphics quality, shadows, post-processing, and particles
- **Stats HUD**: Real-time equipment statistics overlay
- **Breadcrumb Navigation**: Always know where you are
- **Fullscreen Mode**: Immersive viewing experience
- **Responsive Design**: Works beautifully on all screen sizes

### Animations
- **Smooth Camera Transitions**: anime.js powered pan/zoom effects
- **Equipment Animations**:
  - CT gantry rotates continuously
  - MRI patient table moves in/out
- **Micro-interactions**: Hover effects, panel slides, stagger animations
- **Loading Indicators**: Modern progress bars with status updates

## 🚀 Tech Stack

- **Three.js** (v0.160.0): 3D rendering, isometric camera, lighting, shadows
- **postprocessing** (v6.35.0): Bloom, SSAO, tone mapping effects
- **D3.js** (v7.8.5): Map visualization and data binding
- **anime.js** (v3.2.2): Smooth UI animations and transitions
- **GSAP** (v3.12.5): Advanced animation capabilities
- **Vite** (v5.0.0): Lightning-fast development and optimized builds

## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern browser with WebGL2 support

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

## 🎮 Usage

1. **Map View**:
   - Click on any glowing hospital marker on the Australia map
   - Hover to see hospital details

2. **Hospital View**:
   - Watch the smooth camera transition into the isometric hospital
   - Observe animated equipment (rotating CT scanners, moving MRI tables)
   - See particle effects flowing around active equipment

3. **Equipment Interaction**:
   - Click on any medical scanner to view detailed information
   - See real-time machine logs color-coded by severity
   - Monitor health status with animated indicators
   - View 24-hour performance charts

4. **Controls**:
   - **Back to Map**: Return to the overview
   - **Theme Toggle**: Switch between dark/light themes
   - **Settings**: Adjust graphics quality, shadows, effects
   - **Fullscreen**: Enter immersive mode

## ⚙️ Settings & Configuration

### Graphics Quality Levels
- **Low**: Basic rendering, minimal effects
- **Medium**: Balanced performance and visuals
- **High**: Enhanced visuals with full effects (default)
- **Ultra**: Maximum quality for powerful hardware

### Configurable Options
- **Shadows**: Toggle real-time shadow rendering
- **Post-Processing**: Enable/disable bloom and effects
- **Particles**: Control particle system rendering
- **Camera Speed**: Adjust transition animation speed

## 🏗️ Project Structure

```
anz_hospitals_3d/
├── index.html                  # Main HTML entry
├── package.json                # Dependencies
├── src/
│   ├── main.js                # Application entry & state management
│   ├── sceneManager.js        # Three.js scene, camera, lights
│   ├── postprocessing.js      # Bloom, tone mapping, effects
│   ├── particles.js           # Particle system manager
│   ├── mapView.js             # D3.js Australia map
│   ├── hospitalView.js        # Isometric hospital with animated equipment
│   ├── interactions.js        # Mouse interactions & raycasting
│   ├── animations.js          # anime.js animation manager
│   ├── dataPanel.js           # Equipment data UI
│   ├── uiUtils.js             # Toast, theme, settings managers
│   ├── data.js                # Hospital & equipment data
│   └── styles.css             # Glassmorphism styles
└── README.md
```

## 🎨 Customization

### Adding Hospitals

Edit `src/data.js` and add to the `hospitals` array:

```javascript
{
    id: 6,
    name: "Your Hospital",
    city: "City",
    state: "STATE",
    coordinates: { lat: -XX.XXXX, lng: XXX.XXXX },
    equipment: [
        { id: 'mri-6', type: 'MRI', position: { x: -5, z: -5 } }
    ]
}
```

### Adding Equipment Types

Add to `equipmentSpecs` in `src/data.js`:

```javascript
'NewType': {
    name: 'Equipment Name',
    fullName: 'Full Name',
    color: 0x6366f1,
    dimensions: { width: 2, height: 2, depth: 2 }
}
```

Then implement the 3D model in `src/hospitalView.js`.

### Customizing Theme Colors

Edit CSS variables in `src/styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... more colors */
}
```

## 🌐 Browser Support

- Chrome/Edge 90+ (recommended)
- Firefox 88+
- Safari 14+

Requires WebGL2 support for post-processing effects.

## 🚄 Performance

- Orthographic camera for efficient isometric rendering
- Instanced geometry where possible
- Optimized shadow maps (2048x2048)
- Hardware-accelerated animations
- Efficient particle systems with BufferGeometry
- Conditional rendering based on settings

### Performance Tips
- Lower graphics quality on older hardware
- Disable post-processing on mobile devices
- Reduce particle count in settings
- Use fullscreen mode for better performance

## 📊 Data Sources

The dashboard uses mock data for demonstration. Equipment logs, health metrics, and performance data are randomly generated on load. In a production environment, connect to:

- Hospital management APIs
- Medical equipment monitoring systems
- Real-time telemetry services

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT

## 🙏 Credits

- Inspired by the game "Project Hospital" for isometric art style
- Built with modern web technologies
- Post-processing powered by pmndrs/postprocessing

## 🔮 Future Enhancements

- [ ] Multiple hospital floors
- [ ] Patient flow visualization
- [ ] Staff movement animations
- [ ] Day/night cycle
- [ ] Weather effects
- [ ] VR mode support
- [ ] Real-time multiplayer collaboration
- [ ] Historical data playback
- [ ] Predictive maintenance alerts
- [ ] Mobile app version

---

**Built with modern web technologies and attention to detail** 🚀

For issues or feature requests, please open an issue on GitHub.
