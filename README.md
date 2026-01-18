# Data Communication Simulation

A comprehensive, interactive educational tool for visualizing and understanding core Data Communication and Networking concepts. Built with **React**, **TypeScript**, and **Vite**, this application offers real-time simulations of signal processing, modulation, and multiplexing techniques.

## 🚀 Features

### Core Modules
1.  **Signal Basics**: Visualize Analog vs. Digital signals.
2.  **Transmission Modes**: Simplex, Half-Duplex, Full-Duplex, and Synchronous/Asynchronous transmission.
3.  **Transmission Media**: Guided (Twisted Pair, Coax, Fiber) vs. Unguided (Radio, Microwave, IR) media.
4.  **Nyquist & Shannon**: Interactive calculator for theorem capacities.
5.  **SNR & Noise**: Visualize the effect of noise and Signal-to-Noise Ratio on waveforms.
6.  **Line Coding**: interactive graphs for NRZ-L, NRZ-I, Manchester, Differential Manchester, AMI, Pseudoternary, and MLT-3.
7.  **Calculations**: Delay, Latency, and Bandwidth-Delay Product tools.
8.  **Digital to Analog**: ASK, FSK, and PSK modulation visualizations.
9.  **Analog Modulation**: AM, FM, and PM signal generation.
10. **Multiplexing**:
    *   **TDM**: Time Division Multiplexing with Pulse Stuffing, Multislot allocation, and variable Frame sizing.
    *   **FDM**: Frequency Division Multiplexing with Guard Bands and Spectrum visualization.
    *   **WDM**: Wavelength Division Multiplexing concepts.
11. **Demodulation**: Interactive extraction of signals from carriers.
12. **Filters**: Low-pass, High-pass, Band-pass, and Band-stop filter simulations.

### Key Highlights
*   **Interactive Graphs**: Real-time waveform rendering using custom canvas-based components.
*   **Dynamic Controls**: Tweak frequencies, amplitudes, bit rates, and more to see instant results.
*   **Educational Visuals**: Flow animations (TDM frames), Spectrum Analyzers (FDM), and logical diagrams.
*   **Modern UI**: Glassmorphism design with neon accents for an engaging experience.

## 🛠️ Technology Stack
*   **Frontend**: React (v18), TypeScript
*   **Build Tool**: Vite
*   **Styling**: Vanilla CSS (Variables, Glassmorphism), Lucide React (Icons)
*   **Animation**: Framer Motion
*   **Visualization**: Recharts (for some graphs), Custom SVG/Canvas implementation

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/data-communication-simulation.git
    ```

2.  **Navigate to project directory**:
    ```bash
    cd data-communication-simulation
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open your browser at `http://localhost:5173`.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## 📄 License
This project is licensed under the MIT License.
