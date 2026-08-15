# 1.2kW Smart Battery Monitoring Dashboard

A real-time, responsive web dashboard built for monitoring a 1.2kW battery system using a JBD BMS (Bluetooth/BLE) via a backend Worker API. It features live data polling, interactive multi-metric charting, dynamic status inference, cell-level telemetry, and a historical playback suite.

---

## Features

### 1. Real-Time Telemetry & Smart Inference
* **Live Updates:** Automatically fetches live metrics every 3 seconds from your backend worker (`/api/live`).
* **Dynamic Status Derivation:** Intelligently infers system states (Online, Charging, Discharging, Balancing) based on live current and voltage thresholds rather than relying solely on strict boolean flags.
* **Core Metrics Overview:** Real-time display for:
    * System Voltage ($V$)
    * Current ($A$)
    * Power Draw ($W$)
    * State of Charge ($SOC\%$)
    * Remaining Capacity ($Ah$)
    * Estimated Stored Energy ($Wh$)

### 2. Battery Health & Diagnostics
* **Interactive SOC Gauge:** Conic-gradient visual indicator paired with a dynamic fluid container fill animation representing battery capacity.
* **Cell-Level Monitoring:** Individual breakdowns for cell voltages, max/min cell callouts, and voltage delta calculation ($V$).
* **Diagnostics Panel:** Real-time metrics for pack connection status, active charge/load modes, cell spread, and internal temperatures.
* **Runtime Estimations:** Automatically calculates estimated time-to-full (when charging) and time-to-empty (under load).

### 3. Advanced Analytics & Trend Analysis
* **Multi-Metric Charts:** Dedicated canvas-rendered chart grids for Voltage, Current, Power, SOC, and Temperature.
* **Interactive Tooltips:** Hover over any chart grid line to inspect exact historical values and time stamps dynamically.

### 4. 7-Day History & Playback Suite
* **Historical Timeline:** Access historical snapshots fetched from `/api/history`.
* **Playback Controls:** Scrub through historical data using a custom timeline range slider or use the **Play/Pause** feature to step through logs sequentially.
* **Manual & Live Modes:** Jump instantly to the latest live sample or select a specific date and time to review past metrics in a detailed log table.

---

## Technical Stack
* **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript (Single-file SPA architecture).
* **Styling:** Custom CSS layout leveraging modular CSS variables, responsive grid structures, and dynamic visual state indicators.
* **Communication:** Asynchronous REST fetch requests integrated with live polling and fallback error handling.