
export const generateSineWave = (frequency: number, amplitude: number, phase: number = 0, points: number = 100) => {
    const data = [];
    for (let i = 0; i < points; i++) {
        const x = (i / points) * 2 * Math.PI; // 0 to 2PI
        const y = amplitude * Math.sin(frequency * x + phase);
        data.push({ x: Number((i / 10).toFixed(2)), y });
    }
    return data;
};

export const generateSquareWave = (frequency: number, amplitude: number, points: number = 100) => {
    const data = [];
    for (let i = 0; i < points; i++) {
        const x = (i / points) * 2 * Math.PI;
        const y = Math.sin(frequency * x) >= 0 ? amplitude : -amplitude;
        data.push({ x: Number((i / 10).toFixed(2)), y });
    }
    return data;
};
