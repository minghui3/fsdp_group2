// src/components/BrowserCoverageChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BrowserCoverageChart = () => {
  const svgRef = useRef();

  // Example data for browser coverage
  const data = [
    { name: 'Firefox', coverage: 20, color: '#ff5722' },
    { name: 'Google Chrome', coverage: 25, color: '#2196f3' },
    { name: 'Microsoft Edge', coverage: 15, color: '#4caf50' },
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    // Calculate dynamic width and height based on container
    const containerWidth = svgRef.current.parentElement.offsetWidth;
    const containerHeight = containerWidth; // Maintain a square aspect ratio

    // Create a hierarchy with coverage as the circle size
    const root = d3.hierarchy({ children: data })
      .sum(d => d.coverage);

    // Pack circles without a large enclosing circle
    const pack = d3.pack().size([containerWidth, containerHeight]).padding(10);
    pack(root);

    // Create a group for each circle and dynamically scale based on container
    const nodes = svg
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .selectAll("g")
      .data(root.children)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // Draw each circle with dynamic radius and fill color
    nodes.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.data.color)
      .attr("opacity", 0.8);

    // Add text labels centered within each circle
    nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .text(d => d.data.name);

    // Update the layout if the container is resized
    const resizeObserver = new ResizeObserver(() => {
      const newWidth = svgRef.current.parentElement.offsetWidth;
      svg.attr("viewBox", `0 0 ${newWidth} ${newWidth}`);
      pack.size([newWidth, newWidth])(root); // Update packing size
      
      nodes.attr("transform", d => `translate(${d.x}, ${d.y})`);
      nodes.select("circle").attr("r", d => d.r);
    });
    resizeObserver.observe(svgRef.current.parentElement);

    return () => resizeObserver.disconnect(); // Clean up observer on unmount

  }, [data]);

  return (
    <div className="browser-coverage" style={{padding:'20px' }}>
        <h2>Browser Coverage</h2>
        <div style={{ width: '100%', height: '100%', position: 'relative',display:'flex' }}>
        <div>
            <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
        </div>
    </div>
    </div>
  );
};

export default BrowserCoverageChart;