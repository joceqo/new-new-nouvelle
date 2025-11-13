#!/usr/bin/env node

/**
 * Generates a .spec.md template for a component
 * Usage: node scripts/generate-spec-template.js ComponentName [path/to/component]
 */

import { writeFileSync, existsSync, readFileSync } from "fs";
import { dirname, basename, join } from "path";

const [, , componentName, componentPath] = process.argv;

if (!componentName) {
  console.error(
    "Usage: node scripts/generate-spec-template.js ComponentName [path/to/component]"
  );
  process.exit(1);
}

// Try to find the component file if path not provided
let actualComponentPath = componentPath;
if (!actualComponentPath) {
  const possiblePaths = [
    `packages/ui/src/components/${componentName}/${componentName}.tsx`,
    `packages/ui/src/components/**/${componentName}.tsx`,
    `packages/ui/src/components/ui/${componentName}.tsx`,
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      actualComponentPath = path;
      break;
    }
  }
}

// Generate spec template
function generateSpecTemplate(name, componentFilePath = null) {
  let propsContract = `// TODO: Extract actual props from ${name}.tsx
interface ${name}Props {
  // Add actual props here
}`;

  let dependencies = "- React - Component framework";
  let intent = `TODO: Describe the purpose and responsibility of ${name}`;

  // Try to extract props from actual component file
  if (componentFilePath && existsSync(componentFilePath)) {
    try {
      const componentCode = readFileSync(componentFilePath, "utf-8");

      // Simple regex to find interface/type definitions
      const interfaceMatch = componentCode.match(
        /interface\s+\w*Props\s*{[^}]+}/gs
      );
      const typeMatch = componentCode.match(/type\s+\w*Props\s*=[^;]+;/gs);

      if (interfaceMatch) {
        propsContract = interfaceMatch[0];
      } else if (typeMatch) {
        propsContract = typeMatch[0];
      }

      // Extract imports to infer dependencies
      const imports = componentCode.match(/import.*from\s+['"](.*)['"]/g) || [];
      const externalDeps = imports
        .filter(
          (imp) =>
            !imp.includes("@/") && !imp.includes("./") && !imp.includes("../")
        )
        .map((imp) => {
          const match = imp.match(/from\s+['"]([^'"]+)['"]/);
          return match ? `- \`${match[1]}\` - External dependency` : null;
        })
        .filter(Boolean);

      const internalDeps = imports
        .filter((imp) => imp.includes("@/"))
        .map((imp) => {
          const match = imp.match(/from\s+['"]([^'"]+)['"]/);
          return match ? `- \`${match[1]}\` - Internal dependency` : null;
        })
        .filter(Boolean);

      if (externalDeps.length || internalDeps.length) {
        dependencies = [
          ...externalDeps,
          ...internalDeps,
          "- React - Component framework",
        ].join("\\n");
      }
    } catch (error) {
      console.warn(`Could not parse ${componentFilePath}: ${error.message}`);
    }
  }

  return `# Component: ${name}
Status: draft
Intent: ${intent}

## Props Contract
\`\`\`ts
${propsContract}
\`\`\`

## Behavior Rules
- TODO: Document component behavior
- TODO: List interaction patterns
- TODO: Specify state management

## Visual & Styling
- TODO: Document visual appearance
- TODO: List styling tokens/classes used
- TODO: Specify responsive behavior

## Accessibility
- TODO: Document ARIA requirements
- TODO: List keyboard interactions
- TODO: Specify screen reader behavior
- TODO: Note focus management

## Dependencies
${dependencies}

## Edge Cases
- TODO: Document edge cases and error handling
- TODO: List boundary conditions
- TODO: Specify fallback behavior

## Usage Examples

### Basic Usage
\`\`\`tsx
import { ${name} } from '@/components/path/to/${name}';

<${name}>
  Basic example
</${name}>
\`\`\`

### Advanced Usage
\`\`\`tsx
// TODO: Add advanced usage examples
\`\`\`

## Performance Notes
- TODO: Document performance considerations
- TODO: Note re-render triggers
- TODO: List optimization opportunities

## Testing Strategy
- TODO: Specify what to test
- TODO: List test scenarios
- TODO: Note accessibility testing requirements

## Future Improvements
- TODO: List planned enhancements
- TODO: Note known limitations
- TODO: Specify breaking change plans

## Dependencies Map
\`\`\`
${name}.tsx
└── TODO: Map actual dependencies

Used by:
- TODO: List components that use this one
\`\`\`

## Breaking Changes Policy
- **Major version**: Changes to prop interface or behavior
- **Minor version**: New features (backward compatible)  
- **Patch version**: Bug fixes only

Last updated: ${new Date().toISOString().split("T")[0]}`;
}

// Generate and write the spec file
const specContent = generateSpecTemplate(componentName, actualComponentPath);
const specFileName = actualComponentPath
  ? join(dirname(actualComponentPath), `${componentName}.spec.md`)
  : `${componentName}.spec.md`;

if (existsSync(specFileName)) {
  console.log(`⚠️  Spec file already exists: ${specFileName}`);
  console.log("Use --force to overwrite");
  process.exit(1);
}

writeFileSync(specFileName, specContent, "utf-8");
console.log(`✅ Generated spec template: ${specFileName}`);
console.log(`📝 Next steps:`);
console.log(`   1. Review and fill in TODO sections`);
console.log(`   2. Extract actual props from component`);
console.log(`   3. Document real behavior and dependencies`);
console.log(`   4. Add meaningful usage examples`);
