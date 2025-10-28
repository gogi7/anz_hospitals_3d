import * as d3 from 'd3';
import { hospitals, australiaGeoJSON } from './data.js';

export class MapView {
    constructor(svgElement, onHospitalClick) {
        this.svg = d3.select(svgElement);
        this.onHospitalClick = onHospitalClick;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.isVisible = true;

        this.init();
    }

    init() {
        // Set up SVG dimensions
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        // Create projection for Australia
        this.projection = d3.geoMercator()
            .center([133, -28])
            .scale(800)
            .translate([this.width / 2, this.height / 2]);

        this.path = d3.geoPath().projection(this.projection);

        // Create main group
        this.mapGroup = this.svg.append('g').attr('class', 'map-group');

        // Draw Australia outline
        this.drawAustraliaOutline();

        // Draw hospital markers
        this.drawHospitalMarkers();

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    drawAustraliaOutline() {
        this.mapGroup.selectAll('.australia-outline')
            .data(australiaGeoJSON.features)
            .enter()
            .append('path')
            .attr('class', 'australia-outline')
            .attr('d', this.path)
            .attr('fill', 'none')
            .attr('stroke', 'rgba(52, 152, 219, 0.3)')
            .attr('stroke-width', 2)
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .attr('opacity', 1);

        // Add some decorative grid lines
        this.addGridLines();
    }

    addGridLines() {
        const gridGroup = this.mapGroup.append('g').attr('class', 'grid-lines');

        // Latitude lines
        for (let lat = -40; lat <= -10; lat += 5) {
            const points = [];
            for (let lng = 110; lng <= 155; lng += 1) {
                points.push(this.projection([lng, lat]));
            }

            gridGroup.append('path')
                .attr('d', d3.line()(points))
                .attr('class', 'iso-grid-line')
                .attr('opacity', 0.1);
        }

        // Longitude lines
        for (let lng = 115; lng <= 150; lng += 5) {
            const points = [];
            for (let lat = -40; lat <= -10; lat += 1) {
                points.push(this.projection([lng, lat]));
            }

            gridGroup.append('path')
                .attr('d', d3.line()(points))
                .attr('class', 'iso-grid-line')
                .attr('opacity', 0.1);
        }
    }

    drawHospitalMarkers() {
        const markers = this.mapGroup.selectAll('.hospital-marker')
            .data(hospitals)
            .enter()
            .append('g')
            .attr('class', 'hospital-marker')
            .attr('transform', d => {
                const [x, y] = this.projection([d.coordinates.lng, d.coordinates.lat]);
                return `translate(${x}, ${y})`;
            })
            .style('opacity', 0)
            .on('click', (event, d) => this.handleHospitalClick(d))
            .on('mouseenter', (event, d) => this.showTooltip(event, d))
            .on('mouseleave', () => this.hideTooltip());

        // Outer pulse ring
        markers.append('circle')
            .attr('r', 15)
            .attr('fill', 'rgba(52, 152, 219, 0.2)')
            .attr('class', 'pulse-ring');

        // Main marker circle
        markers.append('circle')
            .attr('r', 8)
            .attr('fill', '#3498db')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        // Hospital icon (simplified cross)
        markers.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .text('+');

        // Animate markers in
        markers.transition()
            .delay((d, i) => i * 200)
            .duration(600)
            .style('opacity', 1);

        // Add pulsing animation
        this.addPulseAnimation();
    }

    addPulseAnimation() {
        const pulse = () => {
            this.mapGroup.selectAll('.pulse-ring')
                .transition()
                .duration(2000)
                .attr('r', 25)
                .style('opacity', 0)
                .transition()
                .duration(0)
                .attr('r', 15)
                .style('opacity', 0.2)
                .on('end', pulse);
        };
        pulse();
    }

    handleHospitalClick(hospital) {
        if (this.onHospitalClick) {
            this.onHospitalClick(hospital);
        }
    }

    showTooltip(event, hospital) {
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip visible')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .html(`
                <strong>${hospital.name}</strong><br/>
                ${hospital.city}, ${hospital.state}<br/>
                <small>${hospital.equipment.length} scanners</small>
            `);
    }

    hideTooltip() {
        d3.selectAll('.tooltip').remove();
    }

    show() {
        this.isVisible = true;
        this.svg.style('pointer-events', 'all');
        this.mapGroup.transition()
            .duration(600)
            .style('opacity', 1);
    }

    hide() {
        this.isVisible = false;
        this.svg.style('pointer-events', 'none');
        this.mapGroup.transition()
            .duration(600)
            .style('opacity', 0);
    }

    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        this.projection
            .translate([this.width / 2, this.height / 2]);

        // Redraw everything
        this.mapGroup.selectAll('.australia-outline')
            .attr('d', this.path);

        this.mapGroup.selectAll('.hospital-marker')
            .attr('transform', d => {
                const [x, y] = this.projection([d.coordinates.lng, d.coordinates.lat]);
                return `translate(${x}, ${y})`;
            });
    }
}
