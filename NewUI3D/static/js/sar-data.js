// SAR Data handling
class SARDataManager {
    constructor() {
        this.sarData = [];
        this.filteredData = [];
        this.init();
    }

    async init() {
        await this.loadSARData();
        this.setupEventListeners();
    }

    async loadSARData() {
        try {
            const response = await fetch('/api/sar-data');
            const data = await response.json();
            this.sarData = data.data || [];
            this.filteredData = [...this.sarData];
            this.updateStats();
        } catch (error) {
            console.error('Error loading SAR data:', error);
            this.generateFallbackData();
        }
    }

    generateFallbackData() {
        // Generate sample SAR data for Japan region
        const fallbackData = [];
        const japanBounds = {
            latMin: 30, latMax: 46,
            lngMin: 129, lngMax: 146
        };

        for (let i = 0; i < 25; i++) {
            fallbackData.push({
                id: `fallback_${i}`,
                lat: japanBounds.latMin + Math.random() * (japanBounds.latMax - japanBounds.latMin),
                lng: japanBounds.lngMin + Math.random() * (japanBounds.lngMax - japanBounds.lngMin),
                intensity: Math.random(),
                frequency: ['L-band', 'C-band', 'X-band'][Math.floor(Math.random() * 3)],
                polarization: ['HH', 'HV', 'VV', 'VH'][Math.floor(Math.random() * 4)],
                surface_type: ['urban', 'forest', 'water', 'agriculture'][Math.floor(Math.random() * 4)]
            });
        }

        this.sarData = fallbackData;
        this.filteredData = [...this.sarData];
        this.updateStats();
    }

    setupEventListeners() {
        const frequencyFilter = document.getElementById('frequency-filter');
        const polarizationFilter = document.getElementById('polarization-filter');
        const animateBtn = document.getElementById('animate-data');
        const focusBtn = document.getElementById('focus-japan');

        if (frequencyFilter) {
            frequencyFilter.addEventListener('change', () => this.applyFilters());
        }

        if (polarizationFilter) {
            polarizationFilter.addEventListener('change', () => this.applyFilters());
        }

        if (animateBtn) {
            animateBtn.addEventListener('click', () => this.animateData());
        }

        if (focusBtn) {
            focusBtn.addEventListener('click', () => this.focusOnJapan());
        }
    }

    applyFilters() {
        const frequencyFilter = document.getElementById('frequency-filter');
        const polarizationFilter = document.getElementById('polarization-filter');

        let filtered = [...this.sarData];

        if (frequencyFilter && frequencyFilter.value !== 'all') {
            filtered = filtered.filter(d => d.frequency === frequencyFilter.value);
        }

        if (polarizationFilter && polarizationFilter.value !== 'all') {
            filtered = filtered.filter(d => d.polarization === polarizationFilter.value);
        }

        this.filteredData = filtered;
        this.updateStats();
        this.updateGlobeData();
    }

    updateStats() {
        const statsContainer = document.getElementById('data-stats');
        if (!statsContainer) return;

        const data = this.filteredData;
        const stats = {
            'Total Points': data.length,
            'High Intensity': data.filter(d => d.intensity > 0.8).length,
            'Medium Intensity': data.filter(d => d.intensity > 0.5 && d.intensity <= 0.8).length,
            'Low Intensity': data.filter(d => d.intensity <= 0.5).length,
            'Urban Areas': data.filter(d => d.surface_type === 'urban').length,
            'Forest Areas': data.filter(d => d.surface_type === 'forest').length
        };

        statsContainer.innerHTML = Object.entries(stats)
            .map(([label, value]) => `
                <div class="stat-item">
                    <span class="stat-label">${label}</span>
                    <span class="stat-value">${value}</span>
                </div>
            `).join('');
    }

    updateGlobeData() {
        // Update globe visualization with filtered data
        if (window.advancedGlobe && window.advancedGlobe.updateData) {
            window.advancedGlobe.updateData(this.filteredData);
        }
    }

    animateData() {
        console.log('Animating SAR data visualization');
        // Add animation logic here
        
        const stats = document.getElementById('data-stats');
        if (stats) {
            stats.style.transform = 'scale(1.05)';
            stats.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                stats.style.transform = 'scale(1)';
            }, 300);
        }
    }

    focusOnJapan() {
        console.log('Focusing on Japan region');
        // Add Japan focus logic here
    }

    getIntensityColor(intensity) {
        if (intensity > 0.8) return '#ff4444'; // High - Red
        if (intensity > 0.5) return '#ffaa44'; // Medium - Orange  
        return '#44ff44'; // Low - Green
    }
}

// Initialize SAR data manager when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.sarDataManager = new SARDataManager();
});

// Export for global access
window.SARDataManager = SARDataManager;
