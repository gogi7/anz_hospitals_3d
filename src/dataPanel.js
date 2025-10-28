import { getEquipmentData } from './data.js';

export class DataPanel {
    constructor(onClose) {
        this.panel = document.getElementById('equipment-panel');
        this.onClose = onClose;
        this.currentEquipment = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('close-equipment');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
                if (this.onClose) this.onClose();
            });
        }
    }

    show(equipmentUserData) {
        this.currentEquipment = getEquipmentData(equipmentUserData.id, equipmentUserData.type);

        // Update panel content
        this.updateHeader();
        this.updateHealthStatus();
        this.updateMetrics();
        this.updateLogs();
        this.updatePerformanceChart();

        // Show panel
        this.panel.classList.remove('hidden');
    }

    hide() {
        this.panel.classList.add('hidden');
        this.currentEquipment = null;
    }

    updateHeader() {
        const nameElement = document.getElementById('equipment-name');
        const typeElement = document.getElementById('equipment-type');

        if (nameElement) {
            nameElement.textContent = this.currentEquipment.spec.fullName;
        }

        if (typeElement) {
            typeElement.textContent = this.currentEquipment.type;
            typeElement.style.backgroundColor = `#${this.currentEquipment.spec.color.toString(16).padStart(6, '0')}`;
        }
    }

    updateHealthStatus() {
        const statusElement = document.getElementById('health-status');
        const metrics = this.currentEquipment.metrics;

        if (statusElement) {
            // Clear previous classes
            statusElement.className = 'health-indicator';

            // Add status class
            statusElement.classList.add(metrics.status);

            // Set status text
            const statusText = {
                'healthy': 'Operational',
                'warning': 'Needs Attention',
                'critical': 'Critical'
            }[metrics.status] || 'Unknown';

            statusElement.textContent = statusText;
        }
    }

    updateMetrics() {
        const metricsContainer = document.getElementById('health-metrics');
        const metrics = this.currentEquipment.metrics;

        if (metricsContainer) {
            metricsContainer.innerHTML = `
                <div class="metric-item">
                    <div class="metric-label">Uptime</div>
                    <div class="metric-value">${metrics.uptime}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Scans Today</div>
                    <div class="metric-value">${metrics.scansToday}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Temperature</div>
                    <div class="metric-value">${metrics.temperature}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Efficiency</div>
                    <div class="metric-value">${metrics.efficiency}</div>
                </div>
            `;
        }
    }

    updateLogs() {
        const logsContainer = document.getElementById('machine-logs');
        const logs = this.currentEquipment.logs;

        if (logsContainer) {
            logsContainer.innerHTML = logs.map(log => {
                const time = new Date(log.timestamp).toLocaleTimeString();
                return `
                    <div class="log-entry ${log.type}">
                        <div class="log-time">${time}</div>
                        <div class="log-message">${log.message}</div>
                    </div>
                `;
            }).join('');
        }
    }

    updatePerformanceChart() {
        const canvas = document.getElementById('metrics-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.currentEquipment.performanceData;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = 150;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw performance line
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - 70) / 30) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw fill area
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fill();

        // Draw data points
        ctx.fillStyle = '#3498db';
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - 70) / 30) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';

        // X-axis labels (hours)
        for (let i = 0; i < data.length; i += 4) {
            const x = padding + (chartWidth / (data.length - 1)) * i;
            ctx.fillText(`${data[i].hour}h`, x, height - 5);
        }

        // Y-axis labels
        ctx.textAlign = 'right';
        ctx.fillText('100%', padding - 5, padding + 5);
        ctx.fillText('70%', padding - 5, height - padding + 5);
    }

    isVisible() {
        return !this.panel.classList.contains('hidden');
    }
}
