class SARGlobe {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || this.container.clientWidth,
            height: options.height || this.container.clientHeight,
            backgroundColor: options.backgroundColor || 0x000000,
            globeImageUrl: options.globeImageUrl || 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            japanHighlightColor: options.japanHighlightColor || 0xff0000,
            autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
            rotationSpeed: options.rotationSpeed || 0.002,
            ...options
        };
        
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.globe = null;
        this.controls = null;
        this.animationId = null;
        this.sarData = [];
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createGlobe();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        this.addEventListeners();
        this.loadSARData();
        this.animate();
        
        // Add globe to scene
        this.scene.add(this.globe);
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
    }
    
    createGlobe() {
        this.globe = new ThreeGlobe()
            .globeImageUrl(this.options.globeImageUrl)
            .pointsData([])
            .pointAltitude(0.01)
            .pointColor((d) => this.getPointColor(d.intensity))
            .pointRadius(0.8)
            .pointResolution(12)
            .atmosphereColor('#ffffff')
            .atmosphereAltitude(0.1);
            
        // Add Japan highlighting
        this.highlightJapan();
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            50,
            this.options.width / this.options.height,
            1,
            1000
        );
        this.camera.position.set(0, 0, 250);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.options.width, this.options.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupControls() {
        // Basic controls implementation (requires OrbitControls)
        if (window.THREE && THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 150;
            this.controls.maxDistance = 400;
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
        
        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0x404040, 1, 0);
        pointLight.position.set(-10, 0, 20);
        this.scene.add(pointLight);
    }
    
    highlightJapan() {
        // Japan coordinates for highlighting
        const japanRegions = [
            { lat: 36.2048, lng: 138.2529, name: 'Central Japan' },
            { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
            { lat: 34.6937, lng: 135.5023, name: 'Osaka' },
            { lat: 43.0642, lng: 141.3469, name: 'Sapporo' }
        ];
        
        // Add red markers for Japan regions
        this.globe.pointsData(japanRegions.map(region => ({
            ...region,
            intensity: 1.0,
            isJapan: true
        })));
    }
    
    async loadSARData() {
        try {
            const response = await fetch('/api/sar-data');
            const data = await response.json();
            this.sarData = data.data || [];
            this.updateGlobeData();
        } catch (error) {
            console.error('Error loading SAR data:', error);
            // Use fallback data
            this.generateFallbackData();
        }
    }
    
    generateFallbackData() {
        const fallbackData = [];
        const japanBounds = {
            latMin: 30, latMax: 46,
            lngMin: 129, lngMax: 146
        };
        
        for (let i = 0; i < 50; i++) {
            fallbackData.push({
                id: `fallback_${i}`,
                lat: japanBounds.latMin + Math.random() * (japanBounds.latMax - japanBounds.latMin),
                lng: japanBounds.lngMin + Math.random() * (japanBounds.lngMax - japanBounds.lngMin),
                intensity: Math.random(),
                frequency: ['L-band', 'C-band', 'X-band'][Math.floor(Math.random() * 3)],
                polarization: ['HH', 'HV', 'VV', 'VH'][Math.floor(Math.random() * 4)]
            });
        }
        
        this.sarData = fallbackData;
        this.updateGlobeData();
    }
    
    updateGlobeData() {
        const combinedData = [
            ...this.sarData,
            { lat: 36.2048, lng: 138.2529, intensity: 1.0, isJapan: true, name: 'Japan Center' }
        ];
        
        this.globe.pointsData(combinedData);
    }
    
    getPointColor(intensity) {
        if (intensity > 0.8) return '#ff4444'; // High intensity - bright red
        if (intensity > 0.5) return '#ffaa44'; // Medium intensity - orange
        return '#44ff44'; // Low intensity - green
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        
        // Mouse events for interactivity
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        this.renderer.domElement.addEventListener('click', (event) => {
            this.handleClick(event);
        });
    }
    
    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    handleMouseMove(event) {
        // Implement mouse interaction for data point hovering
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: -((event.clientY - rect.top) / rect.height) * 2 + 1
        };
        
        // Raycasting for point detection could be implemented here
    }
    
    handleClick(event) {
        // Implement click handling for data point selection
        console.log('Globe clicked:', event);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Auto-rotate the globe
        if (this.options.autoRotate) {
            this.globe.rotation.y += this.options.rotationSpeed;
        }
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
    
    focusOnJapan() {
        // Animate camera to focus on Japan
        if (this.controls) {
            const japanPosition = this.coordToPosition(36.2048, 138.2529, 180);
            gsap.to(this.camera.position, {
                duration: 2,
                x: japanPosition.x,
                y: japanPosition.y,
                z: japanPosition.z,
                ease: "power2.inOut"
            });
        }
    }
    
    coordToPosition(lat, lng, distance) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        return {
            x: -distance * Math.sin(phi) * Math.cos(theta),
            y: distance * Math.cos(phi),
            z: distance * Math.sin(phi) * Math.sin(theta)
        };
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer && this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Clean up Three.js objects
        if (this.scene) {
            this.scene.clear();
        }
    }
}

// Initialize globe when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main globe
    if (document.getElementById('globe-container')) {
        const mainGlobe = new SARGlobe('globe-container', {
            autoRotate: true,
            rotationSpeed: 0.001
        });
        
        // Focus on Japan after 3 seconds
        setTimeout(() => {
            mainGlobe.focusOnJapan();
        }, 3000);
        
        // Store globe instance globally for access
        window.mainGlobe = mainGlobe;
    }
    
    // Initialize advanced visualization globe
    if (document.getElementById('main-globe-container')) {
        const advancedGlobe = new SARGlobe('main-globe-container', {
            autoRotate: false,
            rotationSpeed: 0.002
        });
        
        window.advancedGlobe = advancedGlobe;
    }
});

// Advanced SAR visualization initialization
function initAdvancedSARVisualization() {
    const globe = window.advancedGlobe;
    if (!globe) return;
    
    // Setup filter controls
    setupFilterControls(globe);
    setupDataStats(globe);
    setupAnimationControls(globe);
}

function setupFilterControls(globe) {
    const frequencyFilter = document.getElementById('frequency-filter');
    const polarizationFilter = document.getElementById('polarization-filter');
    
    if (frequencyFilter) {
        frequencyFilter.addEventListener('change', () => {
            filterSARData(globe);
        });
    }
    
    if (polarizationFilter) {
        polarizationFilter.addEventListener('change', () => {
            filterSARData(globe);
        });
    }
}

function filterSARData(globe) {
    const frequency = document.getElementById('frequency-filter')?.value || 'all';
    const polarization = document.getElementById('polarization-filter')?.value || 'all';
    
    let filteredData = globe.sarData.slice();
    
    if (frequency !== 'all') {
        filteredData = filteredData.filter(d => d.frequency === frequency);
    }
    
    if (polarization !== 'all') {
        filteredData = filteredData.filter(d => d.polarization === polarization);
    }
    
    // Add Japan highlight point
    filteredData.push({ 
        lat: 36.2048, 
        lng: 138.2529, 
        intensity: 1.0, 
        isJapan: true, 
        name: 'Japan Center' 
    });
    
    globe.globe.pointsData(filteredData);
    updateDataStats(filteredData);
}

function setupDataStats(globe) {
    const statsContainer = document.getElementById('data-stats');
    if (statsContainer) {
        updateDataStats(globe.sarData);
    }
}

function updateDataStats(data) {
    const statsContainer = document.getElementById('data-stats');
    if (!statsContainer) return;
    
    const stats = {
        'Total Points': data.length,
        'High Intensity': data.filter(d => d.intensity > 0.8).length,
        'Medium Intensity': data.filter(d => d.intensity > 0.5 && d.intensity <= 0.8).length,
        'Low Intensity': data.filter(d => d.intensity <= 0.5).length
    };
    
    statsContainer.innerHTML = Object.entries(stats)
        .map(([label, value]) => `
            <div class="stat-item">
                <span class="stat-label">${label}</span>
                <span class="stat-value">${value}</span>
            </div>
        `).join('');
}

function setupAnimationControls(globe) {
    const animateBtn = document.getElementById('animate-data');
    if (animateBtn) {
        animateBtn.addEventListener('click', () => {
            animateDataPoints(globe);
        });
    }
}

function animateDataPoints(globe) {
    // Animate data points appearing sequentially
    const points = globe.sarData;
    globe.globe.pointsData([]);
    
    points.forEach((point, index) => {
        setTimeout(() => {
            const currentPoints = globe.globe.pointsData();
            currentPoints.push(point);
            globe.globe.pointsData(currentPoints);
        }, index * 100);
    });
}
