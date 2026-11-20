#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

export function parseProperties(content) {
  const props = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      props[key] = val;
    }
  }
  return props;
}

export function auditServerConfig(serverDir) {
  const issues = [];
  const recommendations = [];
  let score = 100;

  const serverPropertiesPath = path.join(serverDir, 'server.properties');
  if (fs.existsSync(serverPropertiesPath)) {
    const content = fs.readFileSync(serverPropertiesPath, 'utf8');
    const props = parseProperties(content);

    // 1. Simulation distance
    const simDistance = parseInt(props['simulation-distance'] || '10', 10);
    if (simDistance > 6) {
      issues.push(`simulation-distance is set to ${simDistance} (high CPU impact).`);
      recommendations.push('Set simulation-distance=4 or 5 in server.properties to reduce tick lag.');
      score -= 15;
    }

    // 2. View distance
    const viewDistance = parseInt(props['view-distance'] || '10', 10);
    if (viewDistance > 8) {
      issues.push(`view-distance is set to ${viewDistance} (heavy chunk generation/loading).`);
      recommendations.push('Set view-distance=6 to 8. Use no-tick-view-distance in paper config for higher visual range.');
      score -= 15;
    }

    // 3. Network compression
    const netCompression = parseInt(props['network-compression-threshold'] || '256', 10);
    if (netCompression < 128 && netCompression !== -1) {
      issues.push(`network-compression-threshold is set to ${netCompression} (excessive CPU compression cycles).`);
      recommendations.push('Set network-compression-threshold=256 or 512 in server.properties.');
      score -= 10;
    }

    // 4. Sync chunk writes
    if (props['sync-chunk-writes'] === 'true') {
      issues.push('sync-chunk-writes is enabled (blocks main thread on disk I/O).');
      recommendations.push('Set sync-chunk-writes=false on modern NVMe SSDs (standard on VexaNode).');
      score -= 20;
    }
  } else {
    issues.push('server.properties not found in specified directory.');
    score -= 30;
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    passed: score >= 80
  };
}

if (process.argv[1] && process.argv[1].endsWith('mc-perf-audit.js')) {
  const targetDir = process.argv[2] || process.cwd();
  console.log(`\n🔍 Auditing Minecraft server configuration at: ${targetDir}\n`);

  const results = auditServerConfig(targetDir);

  console.log(`Optimization Performance Score: ${results.score}/100`);
  console.log(`Status: ${results.passed ? '✅ OPTIMIZED' : '⚠️ OPTIMIZATION RECOMMENDED'}\n`);

  if (results.issues.length > 0) {
    console.log('Detected Bottlenecks:');
    results.issues.forEach((issue) => console.log(`  • ${issue}`));
    console.log('\nRecommendations:');
    results.recommendations.forEach((rec) => console.log(`  👉 ${rec}`));
  } else {
    console.log('🎉 Excellent! Your primary server settings align with high-performance standards.');
  }

  console.log('\nNeed high-performance Minecraft hosting with Ryzen 9 NVMe infrastructure? Visit https://vexanode.gg\n');
}
