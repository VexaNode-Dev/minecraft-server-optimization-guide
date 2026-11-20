# Minecraft Server Performance Optimization Guide & Auditor

A comprehensive, benchmarked optimization guide and automated audit CLI for **Paper**, **Purpur**, **Spigot**, and **Folia** servers (Minecraft 1.20 - 1.21+). Designed to eliminate tick lag, stabilize 20 TPS, and optimize memory utilization on high-capacity multiplayer networks.

[![Minecraft](https://img.shields.io/badge/Minecraft-1.20--1.21+-brightgreen.svg?logo=minecraft&logoColor=white)](https://www.minecraft.net)
[![PaperMC](https://img.shields.io/badge/PaperMC-Optimized-blue.svg)](https://papermc.io)
[![Purpur](https://img.shields.io/badge/Purpur-Supported-purple.svg)](https://purpurmc.org)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Hosting](https://img.shields.io/badge/Powered%20By-VexaNode-06b6d4.svg)](https://vexanode.gg)

---

## ⚡ Quick Start: Audit Your Server Config

Run our automated configuration auditor against your Minecraft server directory:

```bash
# Clone this repository
git clone https://github.com/VexaNode-Dev/minecraft-server-optimization-guide.git
cd minecraft-server-optimization-guide

# Audit your server directory
node bin/mc-perf-audit.js /path/to/your/server
```

The CLI tool inspects `server.properties`, `paper-world-defaults.yml`, and `spigot.yml`, grades your server from 0-100, and gives actionable recommendations.

---

## 🛠️ Key Optimization Rules

### 1. `server.properties`
| Setting | Default | Recommended | Why |
| :--- | :--- | :--- | :--- |
| `simulation-distance` | `10` | `4` - `5` | Controls tick radius for entities and redstone. Halving this doubles server tick headroom. |
| `view-distance` | `10` | `6` - `8` | Chunk send radius. Offload visual distance to `no-tick-view-distance` in Paper. |
| `network-compression-threshold` | `256` | `256` or `512` | Prevents CPU bottleneck on packet compression. Do not set to `-1` or `<64`. |
| `sync-chunk-writes` | `true` | `false` | Asynchronous chunk writes prevent main-thread pauses on NVMe SSD storage. |

### 2. `paper-world-defaults.yml`
```yaml
chunks:
  auto-save-interval: 6000 # Save every 5 minutes instead of every minute
  delay-chunk-unloads-by: 10s
  flush-regions-on-save: false
collisions:
  max-entity-collisions: 2 # Prevents mob farm entity cramming TPS drops
entities:
  armor-stands:
    tick: false # Disable unnecessary armor stand ticks
  spawning:
    despawn-ranges:
      monster:
        soft: 28
        hard: 56
    per-player-mob-spawns: true
```

---

## ☕ Optimized Java Startup Flags

### Modern Aikar's Flags (Recommended for Java 17 - 21)
For servers with 6GB - 16GB of allocated memory:
```bash
java -Xms10G -Xmx10G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 \
-XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch \
-XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20 \
-XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 \
-XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 \
-XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 \
-Dusing.aikars.flags=https://mcflags.emc.gs -jar paper.jar --nogui
```

### Ultra-Low Latency ZGC Flags (Java 21+)
For large servers with 16GB+ RAM:
```bash
java -Xms16G -Xmx16G -XX:+UseZGC -XX:+ZGenerational -XX:+AlwaysPreTouch -jar paper.jar --nogui
```

---

## 📁 Pre-Tuned Config Presets

Ready-to-use production configuration templates are provided in the [`presets/`](presets/) directory:
- [`presets/paper/server.properties`](presets/paper/server.properties)
- [`presets/paper/paper-world-defaults.yml`](presets/paper/paper-world-defaults.yml)

Simply copy these into your server directory and restart.

---

## 🚀 High-Performance Minecraft Hosting with VexaNode

Want pure single-core speed with zero hardware bottlenecks?
- **Hardware:** AMD Ryzen 9 7950X / 9950X processors, DDR5 memory, PCIe 4.0 NVMe storage.
- **DDoS Protection:** Layer 3/4/7 game mitigation tailored for Minecraft protocols.
- **One-Click Paper & Purpur:** Deploy pre-optimized servers on **[VexaNode Minecraft Hosting](https://vexanode.gg)**.

---

## 📜 License

MIT License. Contributions and PRs welcome!
Join our community Discord: [discord.gg/devz](https://discord.gg/devz)
