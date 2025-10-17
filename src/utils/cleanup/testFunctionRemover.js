/**
 * Test Function Detection and Removal for Production Cleanup
 * Handles identification and removal of test, debug, and mock functions
 */

import { readFileSync, writeFileSync } from 'fs';
import { parseFileContent } from './fileScanner.js';
import { createFileBackup } from './backupManager.js';

/**
 * Enhanced patterns for test function detection
 */
const TEST_FUNCTION_PATTERNS = {
    // Function declarations
    FUNCTION_DECLARATIONS: /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*(?:test|Test|TEST|debug|Debug|DEBUG|mock|Mock|MOCK|spec|Spec|SPEC)[a-zA-Z0-9_$]*)\s*\(/gi,
    
    // Arrow functions and const assignments
    ARROW_FUNCTIONS: /(?:export\s+)?const\s+([a-zA-Z_$][a-zA-Z0-9_$]*(?:test|Test|TEST|debug|Debug|DEBUG|mock|Mock|MOCK|spec|Spec|SPEC)[a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/gi,
    
    // Method definitions in objects/classes
    METHOD_DEFINITIONS: /([a-zA-Z_$][a-zA-Z0-9_$]*(?:test|Test|TEST|debug|Debug|DEBUG|mock|Mock|MOCK|spec|Spec|SPEC)[a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{/gi,
    
    // Export statements for test functions
    EXPORT_STATEMENTS: /export\s+\{[^}]*([a-zA-Z_$][a-zA-Z0-9_$]*(?:test|Test|TEST|debug|Debug|DEBUG|mock|Mock|MOCK|spec|Spec|SPEC)[a-zA-Z0-9_$]*)[^}]*\}/gi,
    
    // Test utility functions
    TEST_UTILITIES: /(?:export\s+)?(?:function\s+|const\s+)([a-zA-Z_$][a-zA-Z0-9_$]*(?:Helper|Util|Setup|Teardown|Fixture|Factory|Builder)[a-zA-Z0-9_$]*)\s*[=\(]/gi
};

/**
 * Patterns for identifying test-related imports
 */
const TEST_IMPORT_PATTERNS = {
    TESTING_LIBRARIES: /import\s+.*?\s+from\s+['"`](jest|mocha|chai|sinon|enzyme|@testing-library|vitest|cypress|playwright).*?['"`]/gi,
    TEST_UTILITIES: /import\s+.*?\s+from\s+['"`].*?(test|spec|mock|fixture).*?['"`]/gi
};

/**
 * Scan file for test functions and related code
 * @param {string} filePath - Path to the file to scan
 * @returns {Object} Test function analysis
 */
export function scanTestFunctions(filePath) {
    try {
        const fileData = parseFileContent(filePath);
        const functions = [];
        const imports = [];
        const exports = [];
        
        // Find test functions
        const functionMatches = findTestFunctions(fileData);
        functions.push(...functionMatches);
        
        // Find test-related imports
        const importMatches = findTestImports(fileData);
        imports.push(...importMatches);
        
        // Find test-related exports
        const exportMatches = findTestExports(fileData);
        exports.push(...exportMatches);
        
        // Analyze dependencies
        const dependencies = analyzeFunctionDependencies(fileData, functions);
        
        return {
            filePath,
            totalFunctions: functions.length,
            functions,
            imports,
            exports,
            dependencies,
            summary: generateTestFunctionSummary(functions, imports, exports),
            recommendations: generateTestCleanupRecommendations(functions, imports, exports, dependencies)
        };
    } catch (error) {
        return {
            filePath,
            error: error.message,
            totalFunctions: 0,
            functions: [],
            imports: [],
            exports: [],
            dependencies: {},
            summary: null,
            recommendations: []
        };
    }
}

/**
 * Find test functions in file
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Array of test function objects
 */
function findTestFunctions(fileData) {
    const functions = [];
    const content = fileData.content;
    const lines = fileData.lines;
    
    // Search for different types of function definitions
    Object.entries(TEST_FUNCTION_PATTERNS).forEach(([patternType, pattern]) => {
        const matches = [...content.matchAll(pattern)];
        
        matches.forEach(match => {
            const functionName = match[1];
            const startIndex = match.index;
            
            // Find line number
            const beforeMatch = content.substring(0, startIndex);
            const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
            
            // Find function boundaries
            const boundaries = findFunctionBoundaries(lines, lineNumber - 1, match[0]);
            
            // Analyze function content
            const analysis = analyzeFunctionContent(lines, boundaries.start, boundaries.end);
            
            functions.push({
                name: functionName,
                type: categorizeTestFunction(functionName, analysis.content),
                startLine: boundaries.start + 1,
                endLine: boundaries.end + 1,
                lineCount: boundaries.end - boundaries.start + 1,
                isExported: checkIfFunctionExported(content, functionName),
                patternType,
                content: analysis.content,
                hasUtilityCode: analysis.hasUtilityCode,
                dependencies: analysis.dependencies,
                complexity: analysis.complexity,
                canSafelyRemove: analysis.canSafelyRemove
            });
        });
    });
    
    // Remove duplicates (same function found by multiple patterns)
    return removeDuplicateFunctions(functions);
}

/**
 * Find test-related imports
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Array of test import objects
 */
function findTestImports(fileData) {
    const imports = [];
    const lines = fileData.lines;
    
    lines.forEach((line, index) => {
        Object.entries(TEST_IMPORT_PATTERNS).forEach(([patternType, pattern]) => {
            const matches = [...line.matchAll(pattern)];
            
            matches.forEach(match => {
                const importPath = extractImportPath(match[0]);
                const importedItems = extractImportedItems(match[0]);
                
                imports.push({
                    lineNumber: index + 1,
                    statement: line.trim(),
                    importPath,
                    importedItems,
                    patternType,
                    isDevOnly: true,
                    usageCount: countImportUsage(fileData.content, importedItems)
                });
            });
        });
    });
    
    return imports;
}

/**
 * Find test-related exports
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Array of test export objects
 */
function findTestExports(fileData) {
    const exports = [];
    const lines = fileData.lines;
    
    lines.forEach((line, index) => {
        const matches = [...line.matchAll(TEST_FUNCTION_PATTERNS.EXPORT_STATEMENTS)];
        
        matches.forEach(match => {
            const exportedName = match[1];
            
            exports.push({
                lineNumber: index + 1,
                statement: line.trim(),
                exportedName,
                type: 'named-export'
            });
        });
        
        // Check for default exports of test functions
        const defaultExportMatch = line.match(/export\s+default\s+([a-zA-Z_$][a-zA-Z0-9_$]*(?:test|Test|TEST|debug|Debug|DEBUG|mock|Mock|MOCK)[a-zA-Z0-9_$]*)/i);
        if (defaultExportMatch) {
            exports.push({
                lineNumber: index + 1,
                statement: line.trim(),
                exportedName: defaultExportMatch[1],
                type: 'default-export'
            });
        }
    });
    
    return exports;
}

/**
 * Find function boundaries (start and end lines)
 * @param {string[]} lines - File lines
 * @param {number} startLineIndex - Starting line index
 * @param {string} matchedText - Matched function text
 * @returns {Object} Function boundaries
 */
function findFunctionBoundaries(lines, startLineIndex, matchedText) {
    let braceCount = 0;
    let foundOpenBrace = false;
    let start = startLineIndex;
    let end = startLineIndex;
    
    // Find the actual start of the function (handle multi-line declarations)
    while (start > 0 && !lines[start].includes('function') && !lines[start].includes('const') && !lines[start].includes('export')) {
        start--;
    }
    
    // Find the end of the function
    for (let i = start; i < lines.length; i++) {
        const line = lines[i];
        
        for (const char of line) {
            if (char === '{') {
                braceCount++;
                foundOpenBrace = true;
            } else if (char === '}') {
                braceCount--;
                if (foundOpenBrace && braceCount === 0) {
                    end = i;
                    return { start, end };
                }
            }
        }
    }
    
    // Fallback for arrow functions without braces
    if (!foundOpenBrace) {
        // Look for semicolon or next function
        for (let i = start + 1; i < lines.length; i++) {
            if (lines[i].trim().endsWith(';') || 
                lines[i].includes('function') || 
                lines[i].includes('const') ||
                lines[i].includes('export')) {
                end = i;
                break;
            }
        }
    }
    
    return { start, end: Math.max(end, start) };
}

/**
 * Analyze function content
 * @param {string[]} lines - File lines
 * @param {number} startIndex - Function start index
 * @param {number} endIndex - Function end index
 * @returns {Object} Function analysis
 */
function analyzeFunctionContent(lines, startIndex, endIndex) {
    const functionLines = lines.slice(startIndex, endIndex + 1);
    const content = functionLines.join('\n');
    
    // Check for utility code patterns
    const hasUtilityCode = checkForUtilityCode(content);
    
    // Extract dependencies
    const dependencies = extractFunctionDependencies(content);
    
    // Calculate complexity
    const complexity = calculateFunctionComplexity(content);
    
    // Determine if can be safely removed
    const canSafelyRemove = determineRemovalSafety(content, dependencies);
    
    return {
        content,
        hasUtilityCode,
        dependencies,
        complexity,
        canSafelyRemove
    };
}

/**
 * Categorize test function type
 * @param {string} functionName - Function name
 * @param {string} content - Function content
 * @returns {string} Function category
 */
function categorizeTestFunction(functionName, content) {
    const name = functionName.toLowerCase();
    
    if (name.includes('test')) return 'test';
    if (name.includes('spec')) return 'spec';
    if (name.includes('mock')) return 'mock';
    if (name.includes('debug')) return 'debug';
    if (name.includes('helper') || name.includes('util')) return 'utility';
    if (name.includes('setup') || name.includes('teardown')) return 'setup';
    if (name.includes('fixture') || name.includes('factory')) return 'fixture';
    
    // Analyze content for clues
    if (content.includes('expect(') || content.includes('assert')) return 'test';
    if (content.includes('describe(') || content.includes('it(')) return 'test';
    if (content.includes('mock') || content.includes('stub')) return 'mock';
    
    return 'unknown';
}

/**
 * Check if function is exported
 * @param {string} content - File content
 * @param {string} functionName - Function name
 * @returns {boolean} True if exported
 */
function checkIfFunctionExported(content, functionName) {
    const exportPatterns = [
        new RegExp(`export\\s+.*?${functionName}`, 'g'),
        new RegExp(`export\\s*\\{[^}]*${functionName}[^}]*\\}`, 'g'),
        new RegExp(`export\\s+default\\s+${functionName}`, 'g')
    ];
    
    return exportPatterns.some(pattern => pattern.test(content));
}

/**
 * Check for utility code that might be worth preserving
 * @param {string} content - Function content
 * @returns {boolean} True if has utility code
 */
function checkForUtilityCode(content) {
    const utilityPatterns = [
        /return\s+[^;]+;/, // Returns something useful
        /class\s+\w+/, // Class definition
        /const\s+\w+\s*=\s*[^;]+;/, // Constant definitions
        /function\s+\w+/, // Nested function definitions
        /\.prototype\./, // Prototype extensions
        /Object\.defineProperty/, // Property definitions
        /module\.exports/, // Module exports
        /export\s+/, // ES6 exports
    ];
    
    return utilityPatterns.some(pattern => pattern.test(content));
}

/**
 * Extract function dependencies
 * @param {string} content - Function content
 * @returns {string[]} Array of dependencies
 */
function extractFunctionDependencies(content) {
    const dependencies = new Set();
    
    // Find function calls
    const functionCalls = content.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g);
    if (functionCalls) {
        functionCalls.forEach(call => {
            const funcName = call.replace(/\s*\($/, '');
            if (funcName !== 'console' && funcName !== 'return') {
                dependencies.add(funcName);
            }
        });
    }
    
    // Find variable references
    const variableRefs = content.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g);
    if (variableRefs) {
        variableRefs.forEach(ref => {
            if (ref.length > 2 && !['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'].includes(ref)) {
                dependencies.add(ref);
            }
        });
    }
    
    return Array.from(dependencies);
}

/**
 * Calculate function complexity
 * @param {string} content - Function content
 * @returns {Object} Complexity metrics
 */
function calculateFunctionComplexity(content) {
    const lines = content.split('\n').length;
    const cyclomaticComplexity = (content.match(/if|else|while|for|switch|case|\?/g) || []).length + 1;
    const functionCalls = (content.match(/\w+\s*\(/g) || []).length;
    
    let level = 'low';
    if (lines > 50 || cyclomaticComplexity > 10) level = 'high';
    else if (lines > 20 || cyclomaticComplexity > 5) level = 'medium';
    
    return {
        lines,
        cyclomaticComplexity,
        functionCalls,
        level
    };
}

/**
 * Determine if function can be safely removed
 * @param {string} content - Function content
 * @param {string[]} dependencies - Function dependencies
 * @returns {boolean} True if safe to remove
 */
function determineRemovalSafety(content, dependencies) {
    // Don't remove if it has utility code
    if (checkForUtilityCode(content)) return false;
    
    // Don't remove if it's complex and might have side effects
    const complexity = calculateFunctionComplexity(content);
    if (complexity.level === 'high') return false;
    
    // Don't remove if it modifies global state
    if (content.includes('window.') || content.includes('global.') || content.includes('document.')) {
        return false;
    }
    
    // Safe to remove if it's clearly a test/debug function
    const testKeywords = ['test', 'spec', 'mock', 'debug', 'console.log'];
    return testKeywords.some(keyword => content.toLowerCase().includes(keyword));
}

/**
 * Remove duplicate functions from array
 * @param {Object[]} functions - Array of functions
 * @returns {Object[]} Deduplicated functions
 */
function removeDuplicateFunctions(functions) {
    const seen = new Set();
    return functions.filter(func => {
        const key = `${func.name}-${func.startLine}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/**
 * Analyze dependencies between functions
 * @param {Object} fileData - Parsed file data
 * @param {Object[]} functions - Array of functions
 * @returns {Object} Dependency analysis
 */
function analyzeFunctionDependencies(fileData, functions) {
    const dependencies = {};
    const content = fileData.content;
    
    functions.forEach(func => {
        dependencies[func.name] = {
            dependsOn: func.dependencies,
            usedBy: [],
            usageCount: (content.match(new RegExp(`\\b${func.name}\\b`, 'g')) || []).length - 1 // Subtract 1 for definition
        };
    });
    
    // Find reverse dependencies
    functions.forEach(func => {
        func.dependencies.forEach(dep => {
            if (dependencies[dep]) {
                dependencies[dep].usedBy.push(func.name);
            }
        });
    });
    
    return dependencies;
}

/**
 * Extract import path from import statement
 * @param {string} importStatement - Import statement
 * @returns {string} Import path
 */
function extractImportPath(importStatement) {
    const match = importStatement.match(/from\s+['"`]([^'"`]+)['"`]/);
    return match ? match[1] : '';
}

/**
 * Extract imported items from import statement
 * @param {string} importStatement - Import statement
 * @returns {string[]} Imported items
 */
function extractImportedItems(importStatement) {
    const items = [];
    
    // Default import
    const defaultMatch = importStatement.match(/import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from/);
    if (defaultMatch) items.push(defaultMatch[1]);
    
    // Named imports
    const namedMatch = importStatement.match(/import\s+\{([^}]+)\}/);
    if (namedMatch) {
        const namedItems = namedMatch[1].split(',').map(item => item.trim().split(' as ')[0]);
        items.push(...namedItems);
    }
    
    // Namespace import
    const namespaceMatch = importStatement.match(/import\s+\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (namespaceMatch) items.push(namespaceMatch[1]);
    
    return items;
}

/**
 * Count usage of imported items in file
 * @param {string} content - File content
 * @param {string[]} items - Imported items
 * @returns {number} Usage count
 */
function countImportUsage(content, items) {
    let count = 0;
    items.forEach(item => {
        const matches = content.match(new RegExp(`\\b${item}\\b`, 'g'));
        if (matches) count += matches.length - 1; // Subtract import statement
    });
    return count;
}

/**
 * Generate summary of test functions
 * @param {Object[]} functions - Test functions
 * @param {Object[]} imports - Test imports
 * @param {Object[]} exports - Test exports
 * @returns {Object} Summary
 */
function generateTestFunctionSummary(functions, imports, exports) {
    const byType = {};
    const byComplexity = {};
    let safeToRemove = 0;
    let hasUtilityCode = 0;
    
    functions.forEach(func => {
        // By type
        byType[func.type] = (byType[func.type] || 0) + 1;
        
        // By complexity
        byComplexity[func.complexity.level] = (byComplexity[func.complexity.level] || 0) + 1;
        
        // Safety counters
        if (func.canSafelyRemove) safeToRemove++;
        if (func.hasUtilityCode) hasUtilityCode++;
    });
    
    return {
        totalFunctions: functions.length,
        totalImports: imports.length,
        totalExports: exports.length,
        byType,
        byComplexity,
        safeToRemove,
        hasUtilityCode,
        shouldReview: functions.length - safeToRemove
    };
}

/**
 * Generate cleanup recommendations
 * @param {Object[]} functions - Test functions
 * @param {Object[]} imports - Test imports
 * @param {Object[]} exports - Test exports
 * @param {Object} dependencies - Dependency analysis
 * @returns {string[]} Recommendations
 */
function generateTestCleanupRecommendations(functions, imports, exports, dependencies) {
    const recommendations = [];
    
    const safeToRemove = functions.filter(f => f.canSafelyRemove);
    const needReview = functions.filter(f => !f.canSafelyRemove);
    
    if (safeToRemove.length > 0) {
        recommendations.push(`Remove ${safeToRemove.length} test/debug functions that are safe to delete`);
    }
    
    if (needReview.length > 0) {
        recommendations.push(`Review ${needReview.length} functions that may contain utility code`);
    }
    
    if (imports.length > 0) {
        recommendations.push(`Remove ${imports.length} test-related import statements`);
    }
    
    if (exports.length > 0) {
        recommendations.push(`Remove ${exports.length} test function exports`);
    }
    
    const utilityFunctions = functions.filter(f => f.hasUtilityCode);
    if (utilityFunctions.length > 0) {
        recommendations.push(`Extract utility code from ${utilityFunctions.length} functions before removal`);
    }
    
    return recommendations;
}
/**
 * Rem
ove test functions from a file
 * @param {string} filePath - Path to the file to clean
 * @param {Object} options - Cleanup options
 * @returns {Object} Cleanup result
 */
export function removeTestFunctions(filePath, options = {}) {
    const defaultOptions = {
        createBackup: true,
        preserveUtilityCode: true,
        removeImports: true,
        removeExports: true,
        dryRun: false
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        // Analyze test functions first
        const analysis = scanTestFunctions(filePath);
        
        if (analysis.error) {
            return {
                success: false,
                filePath,
                error: analysis.error
            };
        }
        
        if (analysis.totalFunctions === 0 && analysis.imports.length === 0 && analysis.exports.length === 0) {
            return {
                success: true,
                filePath,
                message: 'No test functions or imports found',
                functionsRemoved: 0,
                importsRemoved: 0,
                exportsRemoved: 0
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
        
        // Process removals
        const processResult = processTestFunctionRemovals(lines, analysis, config);
        
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
            functionsRemoved: processResult.functionsRemoved,
            importsRemoved: processResult.importsRemoved,
            exportsRemoved: processResult.exportsRemoved,
            linesRemoved: processResult.linesRemoved,
            backup: backupResult,
            dryRun: config.dryRun,
            preview: config.dryRun ? newContent : null,
            changes: processResult.changes,
            preservedFunctions: processResult.preservedFunctions
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
 * Process test function removals
 * @param {string[]} lines - File lines
 * @param {Object} analysis - Test function analysis
 * @param {Object} config - Configuration options
 * @returns {Object} Processing result
 */
function processTestFunctionRemovals(lines, analysis, config) {
    const modifiedLines = [...lines];
    const changes = [];
    const preservedFunctions = [];
    let functionsRemoved = 0;
    let importsRemoved = 0;
    let exportsRemoved = 0;
    let linesRemoved = 0;
    
    // Sort by line number (descending) to avoid index issues
    const allItems = [
        ...analysis.functions.map(f => ({ ...f, type: 'function' })),
        ...analysis.imports.map(i => ({ ...i, type: 'import' })),
        ...analysis.exports.map(e => ({ ...e, type: 'export' }))
    ].sort((a, b) => (b.startLine || b.lineNumber) - (a.startLine || a.lineNumber));
    
    allItems.forEach(item => {
        if (item.type === 'function') {
            const result = processFunctionRemoval(modifiedLines, item, config);
            if (result.removed) {
                functionsRemoved++;
                linesRemoved += result.linesRemoved;
                changes.push(...result.changes);
            } else {
                preservedFunctions.push(item);
            }
        } else if (item.type === 'import' && config.removeImports) {
            const result = processImportRemoval(modifiedLines, item);
            if (result.removed) {
                importsRemoved++;
                linesRemoved += result.linesRemoved;
                changes.push(...result.changes);
            }
        } else if (item.type === 'export' && config.removeExports) {
            const result = processExportRemoval(modifiedLines, item);
            if (result.removed) {
                exportsRemoved++;
                linesRemoved += result.linesRemoved;
                changes.push(...result.changes);
            }
        }
    });
    
    return {
        modifiedLines,
        functionsRemoved,
        importsRemoved,
        exportsRemoved,
        linesRemoved,
        changes,
        preservedFunctions
    };
}

/**
 * Process function removal
 * @param {string[]} lines - File lines
 * @param {Object} func - Function object
 * @param {Object} config - Configuration
 * @returns {Object} Removal result
 */
function processFunctionRemoval(lines, func, config) {
    // Check if function should be preserved
    if (!func.canSafelyRemove && config.preserveUtilityCode) {
        return {
            removed: false,
            reason: 'Function preserved due to utility code or complexity'
        };
    }
    
    const startIndex = func.startLine - 1;
    const endIndex = func.endLine - 1;
    const changes = [];
    
    // Extract utility code if needed
    let utilityCode = null;
    if (func.hasUtilityCode && config.preserveUtilityCode) {
        utilityCode = extractUtilityCode(lines, startIndex, endIndex);
    }
    
    // Remove function lines
    const removedLines = endIndex - startIndex + 1;
    const originalLines = lines.slice(startIndex, endIndex + 1);
    
    lines.splice(startIndex, removedLines);
    
    // Add utility code back if extracted
    if (utilityCode) {
        lines.splice(startIndex, 0, ...utilityCode);
    }
    
    changes.push({
        type: 'function-removal',
        functionName: func.name,
        startLine: func.startLine,
        endLine: func.endLine,
        linesRemoved: removedLines,
        utilityCodePreserved: utilityCode ? utilityCode.length : 0,
        reason: `Removed ${func.type} function: ${func.name}`
    });
    
    return {
        removed: true,
        linesRemoved: removedLines - (utilityCode ? utilityCode.length : 0),
        changes
    };
}

/**
 * Process import removal
 * @param {string[]} lines - File lines
 * @param {Object} importItem - Import object
 * @returns {Object} Removal result
 */
function processImportRemoval(lines, importItem) {
    const lineIndex = importItem.lineNumber - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
        const originalLine = lines[lineIndex];
        lines.splice(lineIndex, 1);
        
        return {
            removed: true,
            linesRemoved: 1,
            changes: [{
                type: 'import-removal',
                lineNumber: importItem.lineNumber,
                originalLine,
                importPath: importItem.importPath,
                reason: `Removed test import: ${importItem.importPath}`
            }]
        };
    }
    
    return { removed: false, linesRemoved: 0, changes: [] };
}

/**
 * Process export removal
 * @param {string[]} lines - File lines
 * @param {Object} exportItem - Export object
 * @returns {Object} Removal result
 */
function processExportRemoval(lines, exportItem) {
    const lineIndex = exportItem.lineNumber - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
        const originalLine = lines[lineIndex];
        
        if (exportItem.type === 'named-export') {
            // For named exports, try to remove just the exported name
            const newLine = removeFromNamedExport(originalLine, exportItem.exportedName);
            if (newLine.trim() === 'export {};' || newLine.trim() === 'export{}') {
                // Remove entire line if export becomes empty
                lines.splice(lineIndex, 1);
                return {
                    removed: true,
                    linesRemoved: 1,
                    changes: [{
                        type: 'export-removal',
                        lineNumber: exportItem.lineNumber,
                        originalLine,
                        exportedName: exportItem.exportedName,
                        reason: `Removed empty export statement`
                    }]
                };
            } else {
                lines[lineIndex] = newLine;
                return {
                    removed: true,
                    linesRemoved: 0,
                    changes: [{
                        type: 'export-modification',
                        lineNumber: exportItem.lineNumber,
                        originalLine,
                        newLine,
                        exportedName: exportItem.exportedName,
                        reason: `Removed ${exportItem.exportedName} from export statement`
                    }]
                };
            }
        } else {
            // Remove entire line for default exports
            lines.splice(lineIndex, 1);
            return {
                removed: true,
                linesRemoved: 1,
                changes: [{
                    type: 'export-removal',
                    lineNumber: exportItem.lineNumber,
                    originalLine,
                    exportedName: exportItem.exportedName,
                    reason: `Removed default export: ${exportItem.exportedName}`
                }]
            };
        }
    }
    
    return { removed: false, linesRemoved: 0, changes: [] };
}

/**
 * Extract utility code from function
 * @param {string[]} lines - File lines
 * @param {number} startIndex - Function start index
 * @param {number} endIndex - Function end index
 * @returns {string[]} Utility code lines
 */
function extractUtilityCode(lines, startIndex, endIndex) {
    const functionLines = lines.slice(startIndex, endIndex + 1);
    const utilityLines = [];
    
    functionLines.forEach(line => {
        const trimmed = line.trim();
        
        // Extract useful constants, classes, or utility functions
        if (trimmed.startsWith('const ') && !trimmed.includes('console.') && !trimmed.includes('test')) {
            utilityLines.push(`  // Extracted utility: ${line.trim()}`);
            utilityLines.push(line);
        } else if (trimmed.startsWith('class ')) {
            utilityLines.push(`  // Extracted utility class: ${line.trim()}`);
            utilityLines.push(line);
        } else if (trimmed.includes('return ') && !trimmed.includes('test') && !trimmed.includes('mock')) {
            utilityLines.push(`  // Extracted return value: ${line.trim()}`);
            utilityLines.push(line);
        }
    });
    
    return utilityLines;
}

/**
 * Remove item from named export statement
 * @param {string} line - Export line
 * @param {string} itemToRemove - Item to remove
 * @returns {string} Modified line
 */
function removeFromNamedExport(line, itemToRemove) {
    // Handle export { item1, item2, item3 }
    const exportMatch = line.match(/export\s*\{([^}]+)\}/);
    if (exportMatch) {
        const items = exportMatch[1].split(',').map(item => item.trim());
        const filteredItems = items.filter(item => !item.includes(itemToRemove));
        
        if (filteredItems.length === 0) {
            return 'export {};';
        } else {
            return line.replace(exportMatch[1], filteredItems.join(', '));
        }
    }
    
    return line;
}

/**
 * Remove test functions from multiple files
 * @param {string[]} filePaths - Array of file paths
 * @param {Object} options - Cleanup options
 * @returns {Object} Batch cleanup result
 */
export function removeTestFunctionsFromFiles(filePaths, options = {}) {
    const results = {
        successful: [],
        failed: [],
        totalFiles: filePaths.length,
        totalFunctionsRemoved: 0,
        totalImportsRemoved: 0,
        totalExportsRemoved: 0,
        totalSizeSaved: 0,
        startTime: new Date().toISOString()
    };
    
    filePaths.forEach(filePath => {
        const result = removeTestFunctions(filePath, options);
        
        if (result.success) {
            results.successful.push(result);
            results.totalFunctionsRemoved += result.functionsRemoved || 0;
            results.totalImportsRemoved += result.importsRemoved || 0;
            results.totalExportsRemoved += result.exportsRemoved || 0;
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
 * Preview test function removal without making changes
 * @param {string} filePath - Path to file to preview
 * @param {Object} options - Preview options
 * @returns {Object} Preview result
 */
export function previewTestFunctionRemoval(filePath, options = {}) {
    return removeTestFunctions(filePath, { ...options, dryRun: true });
}