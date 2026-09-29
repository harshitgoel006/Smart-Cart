const baseUrl = (process.env.SMOKE_BASE_URL || `http://localhost:${process.env.PORT || 8000}`).replace(/\/$/, "");

const checks = [
  { path: "/health", label: "health endpoint" },
  { path: "/", label: "API root" },
];

let failed = false;

for (const check of checks) {
  try {
    const response = await fetch(`${baseUrl}${check.path}`);
    const body = await response.json().catch(() => ({}));

    if (!response.ok || body.success !== true) {
      failed = true;
      console.error(`FAIL ${check.label}: HTTP ${response.status}`);
      continue;
    }

    console.log(`PASS ${check.label}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${check.label}: ${error.message}`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`SmartCart API smoke test passed: ${baseUrl}`);
}
