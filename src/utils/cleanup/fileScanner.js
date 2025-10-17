/**
 * File Scanner Utilities for Production Cleanup
 * Provides functions to scan source files for debugging code patterns
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Recursively scan directory for JavaScript/JSX files
 * @param {string} dirPath - Directory path to scan
 * @param {string[]} extensions - File extensions to include (default: ['.js', '.jsx'])
 * @returns {string[]} Array of file paths
 */
export function scanForJSFiles(dirPath, extensions = ['.js', '.jsx']) {
    const files = [];
    
    try {
        const items = readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = join(dirPath, item);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip node_modules and other common directories
                if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
                    files.push(...scanForJSFiles(fullPath, extensions));
                }
            } else if (stat.isFile() && extensions.includes(extname(item))) {
                files.push(fullPath);
            }
        }
    } catch (error) {
    }
    
    return files;
}

/**
 * Parse file content and extract lines with line numbers
 * @param {string} filePath - Path to the file
 * @returns {Object} Object with lines array and metadata
 */
export function parseFileContent(filePath) {
    try {
        const content = readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        return {
            filePath,
            content,
            lines,
            totalLines: lines.length,
            size: content.length
        };
    } catch (error) {
        throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
}

/**
 * Regex patterns for identifying different types of debugging code
 */
export const PATTERNS = {
    // Console statements - matches console.log, console.error, etc.
    CONSOLE_STATEMENTS: /console\.(log|error|warn|debug|info|trace|table|group|groupEnd|time|timeEnd)\s*\(/g,
    
    // Test functions - matches function names containing test, debug, mock
    TEST_FUNCTIONS: /(?:function\s+|const\s+|let\s+|var\s+)([a-zA-Z_$][a-zA-Z0-9_$]*(?:test|Test|TEST|debug|Debug|DEBUG|mock|Mock|MOCK)[a-zA-Z0-9_$]*)\s*[=\(]/gi,
    
    // Debugging artifacts
    ALERT_STATEMENTS: /\b(alert|confirm|prompt)\s*\(/g,
    DEBUGGER_STATEMENTS: /\bdebugger\s*;?/g,
    
    // Development imports (common testing/debugging libraries)
    DEV_IMPORTS: /import\s+.*?\s+from\s+['"`](jest|mocha|chai|sinon|enzyme|@testing-library|debug|console).*?['"`]/g,
    
    // Export statements for test functions
    EXPORT_TEST_FUNCTIONS: /export\s+(?:const\s+|function\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*(?:test|Test|TEST|debug|Debug|DEBUG|mock|Mock|MOCK)[a-zA-Z0-9_$]*)/gi
};

/**
 * Scan file for console statements
 * @param {string} filePath - Path to the file to scan
 * @returns {Object[]} Array of console statement objects
 */
export function scanForConsoleStatements(filePath) {
    const fileData = parseFileContent(filePath);
    const consoleStatements = [];
    
    fileData.lines.forEach((line, index) => {
        const matches = [...line.matchAll(PATTERNS.CONSOLE_STATEMENTS)];
        
        matches.forEach(match => {
            const lineNumber = index + 1;
            const type = match[1]; // log, error, warn, etc.
            const content = line.trim();
            
            // Determine context based on surrounding code
            const context = determineConsoleContext(fileData.lines, index);
            
            consoleStatements.push({
                type,
                lineNumber,
                content,
                context,
                preserveAsComment: shouldPreserveAsComment(content, context),
                fullMatch: match[0],
                columnStart: match.index
            });
        });
    });
    
    return consoleStatements;
}

/**
 * Scan file for test functions
 * @param {string} filePath - Path to the file to scan
 * @returns {Object[]} Array of test function objects
 */
export function scanForTestFunctions(filePath) {
    const fileData = parseFileContent(filePath);
    const testFunctions = [];
    
    fileData.lines.forEach((line, index) => {
        const matches = [...line.matchAll(PATTERNS.TEST_FUNCTIONS)];
        
        matches.forEach(match => {
            const functionName = match[1];
            const lineNumber = index + 1;
            
            // Find function end (simplified - looks for closing brace)
            const endLine = findFunctionEnd(fileData.lines, index);
            
            testFunctions.push({
                name: functionName,
                startLine: lineNumber,
                endLine,
                isExported: checkIfExported(fileData.content, functionName),
                dependencies: extractFunctionDependencies(fileData.lines, index, endLine),
                hasUtilityCode: analyzeForUtilityCode(fileData.lines, index, endLine)
            });
        });
    });
    
    return testFunctions;
}

/**
 * Scan file for debugging artifacts
 * @param {string} filePath - Path to the file to scan
 * @returns {Object[]} Array of debugging artifact objects
 */
export function scanForDebuggingArtifacts(filePath) {
    const fileData = parseFileContent(filePath);
    const artifacts = [];
    
    fileData.lines.forEach((line, index) => {
        const lineNumber = index + 1;
        
        // Check for alert, confirm, prompt
        const alertMatches = [...line.matchAll(PATTERNS.ALERT_STATEMENTS)];
        alertMatches.forEach(match => {
            artifacts.push({
                type: match[1],
                lineNumber,
                content: line.trim(),
                hasFunctionalPurpose: analyzeAlertPurpose(line)
            });
        });
        
// Check for statements
const Matches = [...line.matchAll(PATTERNS.DEBUGGER_STATEMENTS)];
Matches.forEach(match => {
            artifacts.push({
type: '',
                lineNumber,
                content: line.trim(),
                hasFunctionalPurpose: false
            });
        });
    });
    
    return artifacts;
}

/**
 * Scan file for development imports
 * @param {string} filePath - Path to the file to scan
 * @returns {Object[]} Array of development import objects
 */
export function scanForDevImports(filePath) {
    const fileData = parseFileContent(filePath);
    const devImports = [];
    
    fileData.lines.forEach((line, index) => {
        const matches = [...line.matchAll(PATTERNS.DEV_IMPORTS)];
        
        matches.forEach(match => {
            const lineNumber = index + 1;
            const importPath = extractImportPath(match[0]);
            const importedItems = extractImportedItems(match[0]);
            
            devImports.push({
                importPath,
                importedItems,
                lineNumber,
                isDevOnly: true,
                usageCount: countUsageInFile(fileData.content, importedItems),
                fullStatement: line.trim()
            });
        });
    });
    
    return devImports;
}

// Helper functions

/**
 * Determine the context of a console statement
 * @param {string[]} lines - All lines in the file
 * @param {number} lineIndex - Index of the line with console statement
 * @returns {string} Context type
 */
function determineConsoleContext(lines, lineIndex) {
    const contextLines = lines.slice(Math.max(0, lineIndex - 3), lineIndex + 3);
    const contextText = contextLines.join(' ').toLowerCase();
    
    if (contextText.includes('catch') || contextText.includes('error') || contextText.includes('throw')) {
        return 'error-handling';
    }
    if (contextText.includes('test') || contextText.includes('spec') || contextText.includes('describe')) {
        return 'testing';
    }
    if (contextText.includes('debug') || contextText.includes('todo') || contextText.includes('fixme')) {
        return 'debugging';
    }
    
    return 'general';
}

/**
 * Determine if console statement should be preserved as comment
 * @param {string} content - Console statement content
 * @param {string} context - Statement context
 * @returns {boolean} Whether to preserve as comment
 */
function shouldPreserveAsComment(content, context) {
    // Preserve important debugging information as comments
    if (context === 'error-handling' && content.includes('error')) {
        return true;
    }
    if (content.includes('TODO') || content.includes('FIXME') || content.includes('NOTE')) {
        return true;
    }
    
    return false;
}

/**
 * Find the end line of a function
 * @param {string[]} lines - All lines in the file
 * @param {number} startIndex - Starting line index
 * @returns {number} End line number
 */
function findFunctionEnd(lines, startIndex) {
    let braceCount = 0;
    let foundOpenBrace = false;
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        
        for (const char of line) {
            if (char === '{') {
                braceCount++;
                foundOpenBrace = true;
            } else if (char === '}') {
                braceCount--;
                if (foundOpenBrace && braceCount === 0) {
                    return i + 1;
                }
            }
        }
    }
    
    return startIndex + 1; // Fallback if no closing brace found
}

/**
 * Check if function is exported
 * @param {string} content - File content
 * @param {string} functionName - Function name to check
 * @returns {boolean} Whether function is exported
 */
function checkIfExported(content, functionName) {
    const exportPattern = new RegExp(`export\\s+.*?${functionName}`, 'g');
    return exportPattern.test(content);
}

/**
 * Extract function dependencies (simplified)
 * @param {string[]} lines - All lines in the file
 * @param {number} startIndex - Function start index
 * @param {number} endIndex - Function end index
 * @returns {string[]} Array of dependencies
 */
function extractFunctionDependencies(lines, startIndex, endIndex) {
    const functionLines = lines.slice(startIndex, endIndex);
    const dependencies = [];
    
    // Simple dependency extraction - look for function calls
    functionLines.forEach(line => {
        const matches = line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g);
        if (matches) {
            matches.forEach(match => {
                const funcName = match.replace(/\s*\($/, '');
                if (!dependencies.includes(funcName)) {
                    dependencies.push(funcName);
                }
            });
        }
    });
    
    return dependencies;
}

/**
 * Analyze if function contains utility code worth preserving
 * @param {string[]} lines - All lines in the file
 * @param {number} startIndex - Function start index
 * @param {number} endIndex - Function end index
 * @returns {boolean} Whether function has utility code
 */
function analyzeForUtilityCode(lines, startIndex, endIndex) {
    const functionLines = lines.slice(startIndex, endIndex);
    const functionContent = functionLines.join('\n');
    
    // Check for utility patterns
    const utilityPatterns = [
        /return\s+[^;]+;/, // Returns something useful
        /export\s+/, // Exported utility
        /class\s+/, // Class definition
        /const\s+\w+\s*=\s*[^;]+;/ // Constant definitions
    ];
    
    return utilityPatterns.some(pattern => pattern.test(functionContent));
}

/**
 * Analyze if alert statement serves a functional purpose
 * @param {string} line - Line containing alert statement
 * @returns {boolean} Whether alert serves functional purpose
 */
function analyzeAlertPurpose(line) {
    // Check if alert is used for user feedback vs debugging
    const functionalPatterns = [
        /success/i,
        /complete/i,
        /saved/i,
        /error.*user/i,
        /please/i,
        /invalid/i
    ];
    
    return functionalPatterns.some(pattern => pattern.test(line));
}

/**
 * Extract import path from import statement
 * @param {string} importStatement - Full import statement
 * @returns {string} Import path
 */
function extractImportPath(importStatement) {
    const match = importStatement.match(/from\s+['"`]([^'"`]+)['"`]/);
    return match ? match[1] : '';
}

/**
 * Extract imported items from import statement
 * @param {string} importStatement - Full import statement
 * @returns {string[]} Array of imported items
 */
function extractImportedItems(importStatement) {
    const items = [];
    
    // Handle different import patterns
    const defaultMatch = importStatement.match(/import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from/);
    if (defaultMatch) {
        items.push(defaultMatch[1]);
    }
    
    const namedMatch = importStatement.match(/import\s+\{([^}]+)\}/);
    if (namedMatch) {
        const namedItems = namedMatch[1].split(',').map(item => item.trim());
        items.push(...namedItems);
    }
    
    return items;
}

/**
 * Count usage of imported items in file content
 * @param {string} content - File content
 * @param {string[]} items - Imported items to count
 * @returns {number} Total usage count
 */
function countUsageInFile(content, items) {
    let count = 0;
    
    items.forEach(item => {
        const pattern = new RegExp(`\\b${item}\\b`, 'g');
        const matches = content.match(pattern);
        if (matches) {
            count += matches.length - 1; // Subtract 1 for the import statement itself
        }
    });
    
    return count;
}