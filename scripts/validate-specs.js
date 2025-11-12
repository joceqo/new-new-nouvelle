#!/usr/bin/env node

/**
 * Validates that all components have corresponding .spec.md files
 * Usage: node scripts/validate-specs.js
 */

import { glob } from "glob";
import { existsSync } from "fs";
import { dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = "../packages/ui/src/components";

async function validateSpecs() {
  console.log("🔍 Validating component specs...\n");

  // Find all .tsx component files (excluding .stories.tsx, .test.tsx, etc.)
  const componentFiles = await glob(`${COMPONENTS_DIR}/**/*.tsx`, {
    ignore: [
      "**/*.stories.tsx",
      "**/*.test.tsx",
      "**/*.spec.tsx",
      "**/index.tsx",
    ],
  });

  let missingSpecs = [];
  let validSpecs = [];

  for (const componentFile of componentFiles) {
    const componentName = basename(componentFile, ".tsx");
    const componentDir = dirname(componentFile);
    const specFile = `${componentDir}/${componentName}.spec.md`;

    if (existsSync(specFile)) {
      validSpecs.push({
        component: componentFile.replace(`${COMPONENTS_DIR}/`, ""),
        spec: specFile.replace(`${COMPONENTS_DIR}/`, ""),
      });
    } else {
      missingSpecs.push({
        component: componentFile.replace(`${COMPONENTS_DIR}/`, ""),
        expectedSpec: specFile.replace(`${COMPONENTS_DIR}/`, ""),
      });
    }
  }

  // Report results
  console.log(`✅ Components with specs: ${validSpecs.length}`);
  validSpecs.forEach(({ component, spec }) => {
    console.log(`   ${component} → ${spec}`);
  });

  if (missingSpecs.length > 0) {
    console.log(`\n❌ Components missing specs: ${missingSpecs.length}`);
    missingSpecs.forEach(({ component, expectedSpec }) => {
      console.log(`   ${component} → ❌ ${expectedSpec}`);
    });

    console.log(`\n📝 To fix, create these files:`);
    missingSpecs.forEach(({ expectedSpec }) => {
      console.log(`   touch ${COMPONENTS_DIR}/${expectedSpec}`);
    });
  }

  // Summary
  const totalComponents = componentFiles.length;
  const coverage = ((validSpecs.length / totalComponents) * 100).toFixed(1);

  console.log(
    `\n📊 Spec coverage: ${coverage}% (${validSpecs.length}/${totalComponents})`
  );

  if (coverage < 100) {
    console.log(`🎯 Goal: 100% coverage for production readiness`);
    process.exit(1);
  } else {
    console.log(`🎉 Perfect! All components have specs.`);
    process.exit(0);
  }
}

// Validate spec file format
async function validateSpecFormat(specFile) {
  const fs = await import("fs/promises");
  const content = await fs.readFile(specFile, "utf-8");

  const requiredSections = [
    "# Component:",
    "Status:",
    "Intent:",
    "## Props Contract",
    "## Behavior Rules",
    "## Dependencies",
    "## Usage Examples",
  ];

  const missingSections = requiredSections.filter(
    (section) => !content.includes(section)
  );

  return missingSections;
}

validateSpecs().catch(console.error);
