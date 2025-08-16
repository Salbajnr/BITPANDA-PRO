import React, { useEffect, useRef } from 'react';

interface ChartData {
  labels: string[];
  values: number[];
  label: string;
}

interface AnimatedChartProps {
  type: 'line' | 'doughnut';
  data: ChartData;
  height?: number;
  showLegend?: boolean;
}

export function AnimatedChart({ type, data, height = 200, showLegend = false }: AnimatedChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = height;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
    gradient.addColorStop(1, 'rgba(14, 17, 22, 0)');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (type === 'line') {
      drawLineChart(ctx, data, gradient, canvas.width, height);
    } else if (type === 'doughnut') {
      drawDoughnutChart(ctx, data, canvas.width, height);
    }
  }, [data, type, height]);

  const drawLineChart = (ctx: CanvasRenderingContext2D, chartData: ChartData, gradient: CanvasGradient, width: number, height: number) => {
    if (chartData.values.length === 0) return;

    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minValue = Math.min(...chartData.values);
    const maxValue = Math.max(...chartData.values);
    const valueRange = maxValue - minValue || 1;

    // Draw line
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();

    chartData.values.forEach((value, index) => {
      const x = padding + (index / (chartData.values.length - 1)) * chartWidth;
      const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under curve
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const drawDoughnutChart = (ctx: CanvasRenderingContext2D, chartData: ChartData, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.6;

    const total = chartData.values.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2;

    const colors = ['#d4af37', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    chartData.values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;

      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();

      currentAngle += sliceAngle;
    });
  };

  return (
    <div className="chart-container" style={{ height }}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height }}
      />
    </div>
  );
}