import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { auditServerConfig, parseProperties } from '../bin/mc-perf-audit.js';

test('parseProperties correctly extracts key-value pairs', () => {
  const sample = `
    # Comment
    view-distance=6
    simulation-distance=4
    sync-chunk-writes=false
  `;
  const parsed = parseProperties(sample);
  assert.equal(parsed['view-distance'], '6');
  assert.equal(parsed['simulation-distance'], '4');
  assert.equal(parsed['sync-chunk-writes'], 'false');
});

test('auditServerConfig passes with optimized paper preset', () => {
  const presetDir = path.resolve('presets/paper');
  const result = auditServerConfig(presetDir);

  assert.equal(result.passed, true);
  assert.ok(result.score >= 80, `Expected score >= 80, got ${result.score}`);
  assert.equal(result.issues.length, 0);
});
