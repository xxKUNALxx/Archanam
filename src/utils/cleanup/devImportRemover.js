/**
 * Development Import Remover for Production Cleanup
 * Handles identification and removal of development-only imports and dependencies
 */

import { readFileSync, writeFileSync } from 'fs';
import { parseFileContent } from './fileScanner.js';
import { createFileBackup } from './backupManager.js';

/**
 * Patterns for development imports
 */
const DEV_IMPORT_PATTERNS = {
    // Testing libraries
    TESTING_LIBRARIES: [
        'jest', 'mocha', 'chai', 'sinon', 'enzyme', 'jasmine',
        '@testing-library/react', '@testing-library/jest-dom', '@testing-library/user-event',
        'vitest', 'cypress', 'playwright', 'puppeteer', 'selenium-webdriver'
    ],
    
    // Development tools
    DEV_TOOLS: [
        'webpack-dev-server', 'webpack-hot-middleware', 'react-hot-loader',
        'nodemon', 'concurrently', 'cross-env', 'dotenv-cli',
        'eslint', 'prettier', 'stylelint', 'husky', 'lint-staged'
    ],
    
    // Debugging tools
    DEBUG_TOOLS: [
        'debug', 'why-did-you-render', 'react-devtools', 'redux-devtools',
        'flipper', 'reactotron', 'storybook', '@storybook'
    ],
    
    // Mock and fixture libraries
    MOCK_LIBRARIES: [
        'msw', 'nock', 'faker', '@faker-js/faker', 'factory-bot',
        'json-server', 'miragejs', 'mock-fs'
    ],
    
    // Type checking (development-only usage)
    TYPE_CHECKING: [
        'prop-types' // Often used only in development
    ]
};

/**
 * Production libraries that might be confused with dev libraries
 */
const PRODUCTION_LIBRARIES = [
    'react', 'react-dom', 'vue', 'angular', 'svelte',
    'express', 'koa', 'fastify', 'next', 'nuxt',
    'axios', 'fetch', 'lodash', 'moment', 'dayjs',
    'styled-components', 'emotion', 'tailwindcss'
];

/**
 * Scan file for development imports
 * @param {string} filePath - Path to the file to scan
 * @returns {Object} Development import analysis
 */
export function scanDevelopmentImports(filePath) {
    try {
        const fileData = parseFileContent(filePath);
        const imports = [];
        
        // Find all import statements
        const importStatements = findImportStatements(fileData);
        
        // Analyze each import
        importStatements.forEach(importStmt => {
            const analysis = analyzeImport(importStmt, fileData);
            if (analysis.isDevImport) {
                imports.push(analysis);
            }
        });
        
        // Find dynamic imports
        const dynamicImports = findDynamicImports(fileData);
        dynamicImports.forEach(dynamicImport => {
            const analysis = analyzeDynamicImport(dynamicImport, fileData);
            if (analysis.isDevImport) {
                imports.push(analysis);
            }
        });
        
        // Categorize imports
        const categorized = categorizeDevImports(imports);
        
        return {
            filePath,
            totalImports: imports.length,
            imports,
            categories: categorized,
            summary: generateImportSummary(imports, categorized),
            recommendations: generateImportRecommendations(imports, categorized)
        };
    } catch (error) {
        return {
            filePath,
            error: error.message,
            totalImports: 0,
            imports: [],
            categories: {},
            summary: null,
            recommendations: []
        };
    }
}

/**
 * Find import statements in file
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Import statements
 */
function findImportStatements(fileData) {
    const imports = [];
    const lines = fileData.lines;
    
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
            return;
        }
        
        // Match various import patterns
        const importPatterns = [
            // import something from 'module'
            /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/,
            // import 'module'
            /import\s+['"`]([^'"`]+)['"`]/,
            // const something = require('module')
            /(?:const|let|var)\s+.*?\s*=\s*require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/
        ];
        
        importPatterns.forEach(pattern => {
            const match = trimmedLine.match(pattern);
            if (match) {
                imports.push({
                    lineNumber: index + 1,
                    statement: line,
                    trimmedStatement: trimmedLine,
                    modulePath: match[1],
                    importType: determineImportType(trimmedLine),
                    importedItems: extractImportedItems(trimmedLine)
                });
            }
        });
    });
    
    return imports;
}

/**
 * Find dynamic imports in file
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Dynamic imports
 */
function findDynamicImports(fileData) {
    const imports = [];
    const content = fileData.content;
    
    // Match dynamic import() calls
    const dynamicImportPattern = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    const matches = [...content.matchAll(dynamicImportPattern)];
    
    matches.forEach(match => {
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
        
        imports.push({
            lineNumber,
            statement: match[0],
            modulePath: match[1],
            importType: 'dynamic',
            isDynamic: true
        });
    });
    
    return imports;
}

/**
 * Analyze import to determine if it's development-only
 * @param {Object} importStmt - Import statement object
 * @param {Object} fileData - File data for usage analysis
 * @returns {Object} Import analysis
 */
function analyzeImport(importStmt, fileData) {
    const modulePath = importStmt.modulePath;
    const analysis = {
        ...importStmt,
        isDevImport: false,
        devType: null,
        confidence: 0,
        usageCount: 0,
        usageLines: [],
        canSafelyRemove: false,
        removalStrategy: 'preserve'
    };
    
    // Check against known development libraries
    const devCheck = checkAgainstDevLibraries(modulePath);
    if (devCheck.isDev) {
        analysis.isDevImport = true;
        analysis.devType = devCheck.type;
        analysis.confidence = devCheck.confidence;
    }
    
    // Analyze usage in file
    const usageAnalysis = analyzeImportUsage(importStmt, fileData);
    analysis.usageCount = usageAnalysis.count;
    analysis.usageLines = usageAnalysis.lines;
    
    // Determine removal strategy
    analysis.removalStrategy = determineRemovalStrategy(analysis, usageAnalysis);
    analysis.canSafelyRemove = analysis.removalStrategy !== 'preserve';
    
    return analysis;
}

/**
 * Analyze dynamic import
 * @param {Object} dynamicImport - Dynamic import object
 * @param {Object} fileData - File data
 * @returns {Object} Analysis result
 */
function analyzeDynamicImport(dynamicImport, fileData) {
    const analysis = {
        ...dynamicImport,
        isDevImport: false,
        devType: null,
        confidence: 0,
        canSafelyRemove: false,
        removalStrategy: 'preserve'
    };
    
    const devCheck = checkAgainstDevLibraries(dynamicImport.modulePath);
    if (devCheck.isDev) {
        analysis.isDevImport = true;
        analysis.devType = devCheck.type;
        analysis.confidence = devCheck.confidence;
        analysis.canSafelyRemove = true;
        analysis.removalStrategy = 'remove-statement';
    }
    
    return analysis;
}

/**
 * Check module path against known development libraries
 * @param {string} modulePath - Module path to check
 * @returns {Object} Development check result
 */
function checkAgainstDevLibraries(modulePath) {
    // Normalize module path (remove version specifiers, scoped package prefixes)
    const normalizedPath = normalizeModulePath(modulePath);
    
    // Check against production libraries first (to avoid false positives)
    if (PRODUCTION_LIBRARIES.some(lib => normalizedPath.includes(lib))) {
        return { isDev: false, type: null, confidence: 0 };
    }
    
    // Check against development library categories
    for (const [category, libraries] of Object.entries(DEV_IMPORT_PATTERNS)) {
        for (const lib of libraries) {
            if (normalizedPath.includes(lib) || normalizedPath.startsWith(lib)) {
                return {
                    isDev: true,
                    type: category.toLowerCase().replace('_', '-'),
                    confidence: calculateConfidence(normalizedPath, lib)
                };
            }
        }
    }
    
    // Check for common development patterns
    const devPatterns = [
        { pattern: /test|spec|mock|fixture/i, type: 'testing', confidence: 0.8 },
        { pattern: /dev|development|debug/i, type: 'development', confidence: 0.7 },
        { pattern: /lint|format|prettier/i, type: 'linting', confidence: 0.9 },
        { pattern: /webpack|babel|rollup|vite/i, type: 'build-tools', confidence: 0.6 }
    ];
    
    for (const { pattern, type, confidence } of devPatterns) {
        if (pattern.test(normalizedPath)) {
            return { isDev: true, type, confidence };
        }
    }
    
    return { isDev: false, type: null, confidence: 0 };
}

/**
 * Normalize module path for comparison
 * @param {string} modulePath - Original module path
 * @returns {string} Normalized path
 */
function normalizeModulePath(modulePath) {
    return modulePath
        .toLowerCase()
        .replace(/^@[^/]+\//, '') // Remove scoped package prefix
        .replace(/\/.*$/, '') // Remove sub-paths
        .replace(/[^a-z0-9-]/g, ''); // Remove special characters
}

/**
 * Calculate confidence score for dev library match
 * @param {string} modulePath - Module path
 * @param {string} library - Library name
 * @returns {number} Confidence score (0-1)
 */
function calculateConfidence(modulePath, library) {
    if (modulePath === library) return 1.0;
    if (modulePath.startsWith(library)) return 0.9;
    if (modulePath.includes(library)) return 0.8;
    return 0.7;
}

/**
 * Determine import type
 * @param {string} statement - Import statement
 * @returns {string} Import type
 */
function determineImportType(statement) {
    if (statement.includes('require(')) return 'commonjs';
    if (statement.match(/import\s+['"`]/)) return 'side-effect';
    if (statement.includes('import {')) return 'named';
    if (statement.includes('import * as')) return 'namespace';
    if (statement.includes('import ') && statement.includes(' from ')) return 'default';
    return 'unknown';
}

/**
 * Extract imported items from statement
 * @param {string} statement - Import statement
 * @returns {string[]} Imported items
 */
function extractImportedItems(statement) {
    const items = [];
    
    // Default import
    const defaultMatch = statement.match(/import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from/);
    if (defaultMatch) items.push(defaultMatch[1]);
    
    // Named imports
    const namedMatch = statement.match(/import\s+\{([^}]+)\}/);
    if (namedMatch) {
        const namedItems = namedMatch[1]
            .split(',')
            .map(item => item.trim().split(' as ')[0].trim())
            .filter(item => item);
        items.push(...namedItems);
    }
    
    // Namespace import
    const namespaceMatch = statement.match(/import\s+\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (namespaceMatch) items.push(namespaceMatch[1]);
    
    // CommonJS
    const commonjsMatch = statement.match(/(?:const|let|var)\s+(?:\{([^}]+)\}|([a-zA-Z_$][a-zA-Z0-9_$]*))\s*=/);
    if (commonjsMatch) {
        if (commonjsMatch[1]) {
            // Destructured require
            const destructuredItems = commonjsMatch[1]
                .split(',')
                .map(item => item.trim())
                .filter(item => item);
            items.push(...destructuredItems);
        } else if (commonjsMatch[2]) {
            // Direct require
            items.push(commonjsMatch[2]);
        }
    }
    
    return items;
}

/**
 * Analyze import usage in file
 * @param {Object} importStmt - Import statement
 * @param {Object} fileData - File data
 * @returns {Object} Usage analysis
 */
function analyzeImportUsage(importStmt, fileData) {
    const items = importStmt.importedItems || [];
    const content = fileData.content;
    const lines = fileData.lines;
    
    let totalCount = 0;
    const usageLines = [];
    
    items.forEach(item => {
        // Create regex to find usage (word boundaries to avoid partial matches)
        const usagePattern = new RegExp(`\\b${item}\\b`, 'g');
        const matches = [...content.matchAll(usagePattern)];
        
        matches.forEach(match => {
            // Find line number
            const beforeMatch = content.substring(0, match.index);
            const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
            
            // Skip the import line itself
            if (lineNumber !== importStmt.lineNumber) {
                totalCount++;
                if (!usageLines.includes(lineNumber)) {
                    usageLines.push(lineNumber);
                }
            }
        });
    });
    
    return {
        count: totalCount,
        lines: usageLines.sort((a, b) => a - b)
    };
}

/**
 * Determine removal strategy for import
 * @param {Object} analysis - Import analysis
 * @param {Object} usageAnalysis - Usage analysis
 * @returns {string} Removal strategy
 */
function determineRemovalStrategy(analysis, usageAnalysis) {
    // Don't remove if not a dev import
    if (!analysis.isDevImport) {
        return 'preserve';
    }
    
    // Don't remove if heavily used (might be false positive)
    if (usageAnalysis.count > 5) {
        return 'preserve';
    }
    
    // Remove if unused
    if (usageAnalysis.count === 0) {
        return 'remove-import';
    }
    
    // Remove if low confidence and low usage
    if (analysis.confidence < 0.7 && usageAnalysis.count <= 2) {
        return 'preserve'; // Be conservative
    }
    
    // Remove if high confidence dev import
    if (analysis.confidence >= 0.8) {
        return usageAnalysis.count > 0 ? 'remove-import-and-usage' : 'remove-import';
    }
    
    return 'preserve';
}

/**
 * Categorize development imports
 * @param {Object[]} imports - Array of imports
 * @returns {Object} Categorized imports
 */
function categorizeDevImports(imports) {
    const categories = {
        byType: {},
        byDevType: {},
        byRemovalStrategy: {},
        toRemove: [],
        toPreserve: []
    };
    
    imports.forEach(imp => {
        // By import type
        if (!categories.byType[imp.importType]) {
            categories.byType[imp.importType] = [];
        }
        categories.byType[imp.importType].push(imp);
        
        // By dev type
        if (imp.devType) {
            if (!categories.byDevType[imp.devType]) {
                categories.byDevType[imp.devType] = [];
            }
            categories.byDevType[imp.devType].push(imp);
        }
        
        // By removal strategy
        if (!categories.byRemovalStrategy[imp.removalStrategy]) {
            categories.byRemovalStrategy[imp.removalStrategy] = [];
        }
        categories.byRemovalStrategy[imp.removalStrategy].push(imp);
        
        // By action
        if (imp.canSafelyRemove) {
            categories.toRemove.push(imp);
        } else {
            categories.toPreserve.push(imp);
        }
    });
    
    return categories;
}

/**
 * Generate import summary
 * @param {Object[]} imports - Array of imports
 * @param {Object} categories - Categorized imports
 * @returns {Object} Summary
 */
function generateImportSummary(imports, categories) {
    return {
        total: imports.length,
        byDevType: Object.keys(categories.byDevType).map(type => ({
            type,
            count: categories.byDevType[type].length
        })),
        byImportType: Object.keys(categories.byType).map(type => ({
            type,
            count: categories.byType[type].length
        })),
        actions: {
            toRemove: categories.toRemove.length,
            toPreserve: categories.toPreserve.length
        },
        averageConfidence: imports.length > 0 ? 
            imports.reduce((sum, imp) => sum + imp.confidence, 0) / imports.length : 0
    };
}

/**
 * Generate import cleanup recommendations
 * @param {Object[]} imports - Array of imports
 * @param {Object} categories - Categorized imports
 * @returns {string[]} Recommendations
 */
function generateImportRecommendations(imports, categories) {
    const recommendations = [];
    
    if (categories.toRemove.length > 0) {
        recommendations.push(`Remove ${categories.toRemove.length} development imports`);
    }
    
    if (categories.toPreserve.length > 0) {
        recommendations.push(`Review ${categories.toPreserve.length} imports marked for preservation`);
    }
    
    const testingImports = categories.byDevType['testing-libraries']?.length || 0;
    if (testingImports > 0) {
        recommendations.push(`Remove ${testingImports} testing library imports`);
    }
    
    const devToolImports = categories.byDevType['dev-tools']?.length || 0;
    if (devToolImports > 0) {
        recommendations.push(`Remove ${devToolImports} development tool imports`);
    }
    
    const unusedImports = imports.filter(imp => imp.usageCount === 0).length;
    if (unusedImports > 0) {
        recommendations.push(`${unusedImports} imports are unused and can be safely removed`);
    }
    
    return recommendations;
}/**
 *
 Remove development imports from a file
 * @param {string} filePath - Path to the file to clean
 * @param {Object} options - Cleanup options
 * @returns {Object} Cleanup result
 */
export function removeDevelopmentImports(filePath, options = {}) {
    const defaultOptions = {
        createBackup: true,
        removeUnusedImports: true,
        removeUsedImports: false, // Conservative by default
        minConfidence: 0.8,
        dryRun: false
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        // Analyze imports first
        const analysis = scanDevelopmentImports(filePath);
        
        if (analysis.error) {
            return {
                success: false,
                filePath,
                error: analysis.error
            };
        }
        
        if (analysis.totalImports === 0) {
            return {
                success: true,
                filePath,
                message: 'No development imports found',
                importsRemoved: 0,
                usageRemoved: 0
            };
        }
        
        // Create backup if requested
        let backupResult = null;
        if (config.createBackup && !config.dryRun) {
            backupResult = createFileBackup(filePath);
            if (!backupResult.success) {
                return {
                    success: false,
                    filePath,
                    error: `Backup failed: ${backupResult.error}`
                };
            }
        }
        
        // Read file content
        const originalContent = readFileSync(filePath, 'utf8');
        const lines = originalContent.split('\n');
        
        // Process import removals
        const processResult = processImportRemovals(lines, analysis.imports, config);
        
        // Generate new content
        const newContent = processResult.modifiedLines.join('\n');
        
        // Write file if not dry run
        if (!config.dryRun) {
            writeFileSync(filePath, newContent, 'utf8');
        }
        
        return {
            success: true,
            filePath,
            originalSize: originalContent.length,
            newSize: newContent.length,
            sizeDifference: originalContent.length - newContent.length,
            importsRemoved: processResult.importsRemoved,
            usageRemoved: processResult.usageRemoved,
            linesRemoved: processResult.linesRemoved,
            backup: backupResult,
            dryRun: config.dryRun,
            preview: config.dryRun ? newContent : null,
            changes: processResult.changes
        };
    } catch (error) {
        return {
            success: false,
            filePath,
            error: error.message
        };
    }
}

/**
 * Process import removals
 * @param {string[]} lines - File lines
 * @param {Object[]} imports - Imports to process
 * @param {Object} config - Configuration options
 * @returns {Object} Processing result
 */
function processImportRemovals(lines, imports, config) {
    const modifiedLines = [...lines];
    const changes = [];
    let importsRemoved = 0;
    let usageRemoved = 0;
    let linesRemoved = 0;
    
    // Sort imports by line number (descending) to avoid index issues
    const sortedImports = imports.sort((a, b) => b.lineNumber - a.lineNumber);
    
    sortedImports.forEach(importItem => {
        const shouldRemove = shouldRemoveImport(importItem, config);
        
        if (shouldRemove.remove) {
            const result = processImportRemoval(modifiedLines, importItem, config);
            
            if (result.removed) {
                importsRemoved++;
                linesRemoved += result.linesRemoved || 0;
                usageRemoved += result.usageRemoved || 0;
                changes.push(...result.changes);
            }
        }
    });
    
    return {
        modifiedLines,
        importsRemoved,
        usageRemoved,
        linesRemoved,
        changes
    };
}

/**
 * Determine if import should be removed
 * @param {Object} importItem - Import to check
 * @param {Object} config - Configuration
 * @returns {Object} Removal decision
 */
function shouldRemoveImport(importItem, config) {
    // Don't remove if not a dev import
    if (!importItem.isDevImport) {
        return { remove: false, reason: 'Not a development import' };
    }
    
    // Don't remove if confidence is too low
    if (importItem.confidence < config.minConfidence) {
        return { remove: false, reason: 'Confidence too low' };
    }
    
    // Remove unused imports
    if (importItem.usageCount === 0 && config.removeUnusedImports) {
        return { remove: true, reason: 'Unused development import' };
    }
    
    // Remove used imports only if explicitly configured
    if (importItem.usageCount > 0 && config.removeUsedImports) {
        return { remove: true, reason: 'Used development import (explicit removal)' };
    }
    
    return { remove: false, reason: 'Import has usage and removeUsedImports is false' };
}

/**
 * Process individual import removal
 * @param {string[]} lines - File lines
 * @param {Object} importItem - Import to remove
 * @param {Object} config - Configuration
 * @returns {Object} Removal result
 */
function processImportRemoval(lines, importItem, config) {
    const changes = [];
    let usageRemoved = 0;
    
    // Remove import statement
    const lineIndex = importItem.lineNumber - 1;
    const originalLine = lines[lineIndex];
    
    lines.splice(lineIndex, 1);
    
    changes.push({
        type: 'import-removal',
        lineNumber: importItem.lineNumber,
        original: originalLine,
        modified: null,
        modulePath: importItem.modulePath,
        reason: `Removed development import: ${importItem.modulePath}`
    });
    
    // Remove usage if configured and import has usage
    if (config.removeUsedImports && importItem.usageLines && importItem.usageLines.length > 0) {
        // Sort usage lines in descending order to avoid index issues
        const sortedUsageLines = [...importItem.usageLines].sort((a, b) => b - a);
        
        sortedUsageLines.forEach(usageLineNumber => {
            // Adjust line number due to previous removals
            let adjustedLineNumber = usageLineNumber;
            
            // Count how many lines were removed before this line
            const removalsBeforeLine = changes.filter(change => 
                change.type === 'import-removal' && change.lineNumber < usageLineNumber
            ).length;
            
            adjustedLineNumber -= removalsBeforeLine;
            
            const usageLineIndex = adjustedLineNumber - 1;
            
            if (usageLineIndex >= 0 && usageLineIndex < lines.length) {
                const usageLine = lines[usageLineIndex];
                
                // Try to remove just the usage, not the entire line
                const cleanedLine = removeImportUsageFromLine(usageLine, importItem.importedItems);
                
                if (cleanedLine.trim() === '') {
                    // Remove entire line if it becomes empty
                    lines.splice(usageLineIndex, 1);
                    changes.push({
                        type: 'usage-line-removal',
                        lineNumber: adjustedLineNumber,
                        original: usageLine,
                        modified: null,
                        reason: 'Removed line that only contained removed import usage'
                    });
                } else if (cleanedLine !== usageLine) {
                    // Update line with usage removed
                    lines[usageLineIndex] = cleanedLine;
                    changes.push({
                        type: 'usage-modification',
                        lineNumber: adjustedLineNumber,
                        original: usageLine,
                        modified: cleanedLine,
                        reason: 'Removed import usage from line'
                    });
                }
                
                usageRemoved++;
            }
        });
    }
    
    return {
        removed: true,
        linesRemoved: 1,
        usageRemoved,
        changes
    };
}

/**
 * Remove import usage from a line
 * @param {string} line - Original line
 * @param {string[]} importedItems - Items that were imported
 * @returns {string} Line with usage removed
 */
function removeImportUsageFromLine(line, importedItems) {
    let cleanedLine = line;
    
    importedItems.forEach(item => {
        // Remove function calls
        const functionCallPattern = new RegExp(`\\b${item}\\s*\\([^)]*\\)`, 'g');
        cleanedLine = cleanedLine.replace(functionCallPattern, '');
        
        // Remove property access
        const propertyPattern = new RegExp(`\\b${item}\\.[a-zA-Z_$][a-zA-Z0-9_$]*`, 'g');
        cleanedLine = cleanedLine.replace(propertyPattern, '');
        
        // Remove simple references
        const referencePattern = new RegExp(`\\b${item}\\b`, 'g');
        cleanedLine = cleanedLine.replace(referencePattern, '');
    });
    
    // Clean up any resulting syntax issues
    cleanedLine = cleanedLine
        .replace(/,\s*,/g, ',') // Remove double commas
        .replace(/,\s*$/, '') // Remove trailing comma
        .replace(/^\s*,/, '') // Remove leading comma
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    
    return cleanedLine;
}

/**
 * Remove development imports from multiple files
 * @param {string[]} filePaths - Array of file paths
 * @param {Object} options - Cleanup options
 * @returns {Object} Batch cleanup result
 */
export function removeDevelopmentImportsFromFiles(filePaths, options = {}) {
    const results = {
        successful: [],
        failed: [],
        totalFiles: filePaths.length,
        totalImportsRemoved: 0,
        totalUsageRemoved: 0,
        totalSizeSaved: 0,
        startTime: new Date().toISOString()
    };
    
    filePaths.forEach(filePath => {
        const result = removeDevelopmentImports(filePath, options);
        
        if (result.success) {
            results.successful.push(result);
            results.totalImportsRemoved += result.importsRemoved || 0;
            results.totalUsageRemoved += result.usageRemoved || 0;
            results.totalSizeSaved += result.sizeDifference || 0;
        } else {
            results.failed.push(result);
        }
    });
    
    results.endTime = new Date().toISOString();
    results.successRate = (results.successful.length / results.totalFiles) * 100;
    
    return results;
}

/**
 * Preview development import removal without making changes
 * @param {string} filePath - Path to file to preview
 * @param {Object} options - Preview options
 * @returns {Object} Preview result
 */
export function previewDevelopmentImportRemoval(filePath, options = {}) {
    return removeDevelopmentImports(filePath, { ...options, dryRun: true });
}