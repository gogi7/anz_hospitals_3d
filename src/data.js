// Mock data for Australian hospitals and equipment

export const hospitals = [
    {
        id: 1,
        name: "Sydney General Hospital",
        city: "Sydney",
        state: "NSW",
        coordinates: { lat: -33.8688, lng: 151.2093 },
        equipment: [
            { id: 'mri-1', type: 'MRI', position: { x: -5, z: -5 } },
            { id: 'ct-1', type: 'CT', position: { x: 5, z: -5 } },
            { id: 'xray-1', type: 'X-Ray', position: { x: -5, z: 5 } },
            { id: 'ultra-1', type: 'Ultrasound', position: { x: 5, z: 5 } }
        ]
    },
    {
        id: 2,
        name: "Melbourne Medical Centre",
        city: "Melbourne",
        state: "VIC",
        coordinates: { lat: -37.8136, lng: 144.9631 },
        equipment: [
            { id: 'mri-2', type: 'MRI', position: { x: -5, z: -5 } },
            { id: 'ct-2', type: 'CT', position: { x: 5, z: -5 } },
            { id: 'xray-2', type: 'X-Ray', position: { x: -5, z: 5 } }
        ]
    },
    {
        id: 3,
        name: "Brisbane City Hospital",
        city: "Brisbane",
        state: "QLD",
        coordinates: { lat: -27.4698, lng: 153.0251 },
        equipment: [
            { id: 'mri-3', type: 'MRI', position: { x: -5, z: -5 } },
            { id: 'ct-3', type: 'CT', position: { x: 5, z: -5 } },
            { id: 'xray-3', type: 'X-Ray', position: { x: 0, z: 5 } }
        ]
    },
    {
        id: 4,
        name: "Perth Regional Hospital",
        city: "Perth",
        state: "WA",
        coordinates: { lat: -31.9505, lng: 115.8605 },
        equipment: [
            { id: 'mri-4', type: 'MRI', position: { x: -5, z: -5 } },
            { id: 'ct-4', type: 'CT', position: { x: 5, z: -5 } }
        ]
    },
    {
        id: 5,
        name: "Adelaide Health Centre",
        city: "Adelaide",
        state: "SA",
        coordinates: { lat: -34.9285, lng: 138.6007 },
        equipment: [
            { id: 'mri-5', type: 'MRI', position: { x: -5, z: -5 } },
            { id: 'xray-5', type: 'X-Ray', position: { x: 5, z: 5 } }
        ]
    }
];

// Equipment specifications
export const equipmentSpecs = {
    'MRI': {
        name: 'MRI Scanner',
        fullName: 'Magnetic Resonance Imaging',
        color: 0x3498db,
        dimensions: { width: 2, height: 2, depth: 3 }
    },
    'CT': {
        name: 'CT Scanner',
        fullName: 'Computed Tomography',
        color: 0x2ecc71,
        dimensions: { width: 2, height: 2, depth: 2.5 }
    },
    'X-Ray': {
        name: 'X-Ray Machine',
        fullName: 'X-Ray Radiography',
        color: 0xe74c3c,
        dimensions: { width: 1.5, height: 2.5, depth: 1.5 }
    },
    'Ultrasound': {
        name: 'Ultrasound',
        fullName: 'Ultrasound Imaging',
        color: 0xf39c12,
        dimensions: { width: 1, height: 1.5, depth: 1 }
    }
};

// Generate mock machine logs
function generateLogs(equipmentId, type) {
    const logTypes = ['success', 'warning', 'error', 'info'];
    const messages = {
        'MRI': [
            'Scan completed successfully - Patient ID: P-{id}',
            'Calibration check passed',
            'Helium levels nominal',
            'Magnet temperature: 4.2K',
            'Warning: Coolant pressure slightly elevated',
            'Gradient coil test completed',
            'Image quality assessment: Excellent'
        ],
        'CT': [
            'Scan protocol executed - Chest CT',
            'Radiation dose within limits',
            'Detector calibration successful',
            'Gantry rotation speed optimal',
            'Warning: Tube temperature high',
            'Image reconstruction completed',
            'Quality control check passed'
        ],
        'X-Ray': [
            'Exposure complete - AP view',
            'Collimation settings verified',
            'Detector plate cleaned',
            'KVp settings nominal',
            'Warning: Waiting room queue building',
            'Maintenance due in 45 days',
            'Image contrast acceptable'
        ],
        'Ultrasound': [
            'Examination completed',
            'Probe temperature normal',
            'Gel dispenser refilled',
            'Image depth: 12cm',
            'Doppler mode activated',
            'Battery charge: 85%',
            'System diagnostics passed'
        ]
    };

    const logs = [];
    const now = Date.now();

    for (let i = 0; i < 8; i++) {
        const time = new Date(now - (i * 15 * 60 * 1000)); // 15 min intervals
        const messageList = messages[type] || messages['MRI'];
        const message = messageList[Math.floor(Math.random() * messageList.length)]
            .replace('{id}', Math.floor(Math.random() * 10000));

        let logType = 'info';
        if (message.includes('Warning')) logType = 'warning';
        if (message.includes('Error') || message.includes('Failed')) logType = 'error';
        if (message.includes('success') || message.includes('passed')) logType = 'success';

        logs.push({
            timestamp: time,
            type: logType,
            message: message
        });
    }

    return logs.reverse();
}

// Generate mock health metrics
function generateHealthMetrics(type) {
    const baseMetrics = {
        uptime: Math.floor(Math.random() * 720) + 1,
        scansToday: Math.floor(Math.random() * 50) + 10,
        temperature: (Math.random() * 10 + 20).toFixed(1),
        efficiency: (Math.random() * 20 + 75).toFixed(1)
    };

    const statusThreshold = Math.random();
    let status = 'healthy';
    if (statusThreshold > 0.85) status = 'warning';
    if (statusThreshold > 0.95) status = 'critical';

    return {
        status,
        uptime: `${baseMetrics.uptime}h`,
        scansToday: baseMetrics.scansToday,
        temperature: `${baseMetrics.temperature}°C`,
        efficiency: `${baseMetrics.efficiency}%`,
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000)
    };
}

// Get equipment data by ID
export function getEquipmentData(equipmentId, type) {
    return {
        id: equipmentId,
        type: type,
        spec: equipmentSpecs[type],
        logs: generateLogs(equipmentId, type),
        metrics: generateHealthMetrics(type),
        performanceData: generatePerformanceData()
    };
}

// Generate performance chart data
function generatePerformanceData() {
    const data = [];
    for (let i = 0; i < 24; i++) {
        data.push({
            hour: i,
            value: Math.random() * 30 + 70 // 70-100% performance
        });
    }
    return data;
}

// Australia outline coordinates (simplified GeoJSON)
export const australiaGeoJSON = {
    type: "FeatureCollection",
    features: [{
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [[
                [115, -20], [115, -35], [138, -35], [138, -26], [153, -26],
                [153, -38], [148, -42], [145, -38], [140, -38], [138, -35],
                [130, -35], [125, -34], [120, -35], [115, -35], [115, -20],
                [123, -15], [130, -12], [135, -12], [140, -15], [145, -17],
                [148, -20], [150, -24], [153, -28], [153, -26], [138, -26],
                [138, -20], [130, -20], [123, -15], [115, -20]
            ]]
        }
    }]
};
