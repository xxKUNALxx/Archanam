/**
 * Console Statement Remover for Production Cleanup
 * Handles intelligent removal and transformation of console statements
 */

import { readFileSync, writeFileSync } from 'fs';
import { scanConsoleStatements } from './consoleScanner.js';
import { createFileBackup } from './backupManager.js';

/**
 * Remove console statements from a file
 * @param {string} filePath - Path to the file to clean
 * @param {Object} options - Cleanup options
 * @returns {Object} Cleanup result
 */
export function removeConsoleStatements(filePath, options = {}) {
    const defaultOptions = {
        createBackup: true,
        preserveErrorHandling: true,
        convertImportantToComments: true,
        removeEmptyLines: true,
        dryRun: false
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        // Analyze console statements first
        const analysis = scanConsoleStatements(filePath);
        
        if (analysis.error) {
            return {
                success: false,
                filePath,
                error: analysis.error
            };
        }
        
        if (analysis.totalStatements === 0) {
            return {
                success: true,
                filePath,
                message: 'No console statements found',
                statementsRemoved: 0,
                statementsPreserved: 0,
                statementsCommented: 0
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
        
        // Process console statements
        const processResult = processConsoleStatements(lines, analysis.statements, config);
        
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
            statementsRemoved: processResult.removed,
            statementsPreserved: processResult.preserved,
            statementsCommented: processResult.commented,
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
 * Process console statements in file lines
 * @param {string[]} lines - File lines
 * @param {Object[]} statements - Console statements to process
 * @param {Object} config - Configuration options
 * @returns {Object} Processing result
 */
function processConsoleStatements(lines, statements, config) {
    const modifiedLines = [...lines];
    const changes = [];
    let removed = 0;
    let preserved = 0;
    let commented = 0;
    let linesRemoved = 0;
    
    // Sort statements by line number (descending) to avoid index issues
    const sortedStatements = statements.sort((a, b) => b.lineNumber - a.lineNumber);
    
    sortedStatements.forEach(statement => {
        const lineIndex = statement.lineNumber - 1;
        const originalLine = modifiedLines[lineIndex];
        
        if (!originalLine) return; // Safety check
        
        const action = determineAction(statement, config);
        const result = applyAction(originalLine, statement, action, config);
        
        if (result.newLine !== null) {
            modifiedLines[lineIndex] = result.newLine;
        } else {
            // Remove the entire line
            modifiedLines.splice(lineIndex, 1);
            linesRemoved++;
        }
        
        // Track changes
        changes.push({
            lineNumber: statement.lineNumber,
            action: result.action,
            original: originalLine,
            modified: result.newLine,
            reason: result.reason
        });
        
        // Update counters
        switch (result.action) {
            case 'removed':
                removed++;
                break;
            case 'preserved':
                preserved++;
                break;
            case 'commented':
                commented++;
                break;
        }
    });
    
    // Remove empty lines if configured
    if (config.removeEmptyLines) {
        const beforeEmptyRemoval = modifiedLines.length;
        for (let i = modifiedLines.length - 1; i >= 0; i--) {
            if (modifiedLines[i].trim() === '') {
                // Check if this empty line is between meaningful code
                const hasCodeBefore = i > 0 && modifiedLines[i - 1].trim() !== '';
                const hasCodeAfter = i < modifiedLines.length - 1 && modifiedLines[i + 1].trim() !== '';
                
                // Only remove empty lines that don't separate code blocks
                if (!hasCodeBefore || !hasCodeAfter) {
                    modifiedLines.splice(i, 1);
                }
            }
        }
        linesRemoved += beforeEmptyRemoval - modifiedLines.length;
    }
    
    return {
        modifiedLines,
        removed,
        preserved,
        commented,
        linesRemoved,
        changes
    };
}

/**
 * Determine what action to take for a console statement
 * @param {Object} statement - Console statement object
 * @param {Object} config - Configuration options
 * @returns {string} Action to take
 */
function determineAction(statement, config) {
    // Always preserve if explicitly marked
    if (statement.importance.shouldPreserve) {
        return 'preserve';
    }
    
    // Convert to comment if configured and marked for commenting
    if (config.convertImportantToComments && statement.preserveAsComment) {
        return 'comment';
    }
    
    // Preserve error handling if configured
    if (config.preserveErrorHandling && 
        statement.context.type === 'error-handling' && 
        statement.method === 'error') {
        return 'preserve';
    }
    
    // Default action is remove
    return 'remove';
}

/**
 * Apply the determined action to a line
 * @param {string} line - Original line
 * @param {Object} statement - Console statement object
 * @param {string} action - Action to apply
 * @param {Object} config - Configuration options
 * @returns {Object} Action result
 */
function applyAction(line, statement, action, config) {
    switch (action) {
        case 'preserve':
            return {
                action: 'preserved',
                newLine: line,
                reason: 'Statement preserved due to importance or error handling'
            };
            
        case 'comment':
            return convertToComment(line, statement);
            
        case 'remove':
        default:
            return removeConsoleFromLine(line, statement);
    }
}

/**
 * Convert console statement to comment
 * @param {string} line - Original line
 * @param {Object} statement - Console statement object
 * @returns {Object} Conversion result
 */
function convertToComment(line, statement) {
    const trimmedLine = line.trim();
    const leadingWhitespace = line.match(/^\s*/)[0];
    
    // Extract meaningful content from console statement
    const meaningfulContent = extractMeaningfulContent(statement.loggedContent);
    
    let commentLine;
    if (meaningfulContent) {
        commentLine = `${leadingWhitespace}// ${meaningfulContent}`;
    } else {
        commentLine = `${leadingWhitespace}// ${trimmedLine}`;
    }
    
    return {
        action: 'commented',
        newLine: commentLine,
        reason: 'Console statement converted to comment to preserve information'
    };
}

/**
 * Remove console statement from line
 * @param {string} line - Original line
 * @param {Object} statement - Console statement object
 * @returns {Object} Removal result
 */
function removeConsoleFromLine(line, statement) {
    const trimmedLine = line.trim();
    
    // Check if console statement is the entire line
    if (statement.removalStrategy === 'remove-entire-line' || 
        isConsoleOnlyLine(trimmedLine)) {
        return {
            action: 'removed',
            newLine: null, // This will cause the line to be removed
            reason: 'Entire line contained only console statement'
        };
    }
    
    // Remove just the console statement from the line
    const newLine = removeConsoleStatementFromLine(line, statement);
    
    if (newLine.trim() === '') {
        return {
            action: 'removed',
            newLine: null,
            reason: 'Line became empty after console removal'
        };
    }
    
    return {
        action: 'removed',
        newLine: newLine,
        reason: 'Console statement removed from line'
    };
}

/**
 * Check if line contains only a console statement
 * @param {string} line - Trimmed line content
 * @returns {boolean} True if line only contains console statement
 */
function isConsoleOnlyLine(line) {
    // Remove semicolon and whitespace
    const cleaned = line.replace(/;\s*$/, '').trim();
    
    // Check if it starts with console. and doesn't have other meaningful code
    return cleaned.startsWith('console.') && 
           !cleaned.includes('=') && 
           !cleaned.includes('return') &&
           !cleaned.includes('if') &&
           !cleaned.includes('else');
}

/**
 * Remove console statement from a line while preserving other code
 * @param {string} line - Original line
 * @param {Object} statement - Console statement object
 * @returns {string} Modified line
 */
function removeConsoleStatementFromLine(line, statement) {
    try {
        // Find the console statement in the line
        const consolePattern = new RegExp(
            `console\\.${statement.method}\\s*\\([^)]*\\)\\s*;?`,
            'g'
        );
        
        let newLine = line.replace(consolePattern, '');
        
        // Clean up any remaining artifacts
        newLine = newLine.replace(/,\s*$/, ''); // Remove trailing comma
        newLine = newLine.replace(/^\s*,/, ''); // Remove leading comma
        newLine = newLine.replace(/\s+/g, ' '); // Normalize whitespace
        
        return newLine;
    } catch (error) {
        // Fallback: return original line if parsing fails
        return line;
    }
}

/**
 * Extract meaningful content from logged content
 * @param {string} content - Logged content
 * @returns {string} Meaningful content for comment
 */
function extractMeaningfulContent(content) {
    if (!content) return '';
    
    // Remove quotes from simple strings
    let meaningful = content.replace(/^['"`](.*)['"`]$/, '$1');
    
    // Extract variable names from template literals
    meaningful = meaningful.replace(/\$\{([^}]+)\}/g, '$1');
    
    // Limit length for comments
    if (meaningful.length > 80) {
        meaningful = meaningful.substring(0, 77) + '...';
    }
    
    return meaningful;
}

/**
 * Remove console statements from multiple files
 * @param {string[]} filePaths - Array of file paths
 * @param {Object} options - Cleanup options
 * @returns {Object} Batch cleanup result
 */
export function removeConsoleStatementsFromFiles(filePaths, options = {}) {
    const results = {
        successful: [],
        failed: [],
        totalFiles: filePaths.length,
        totalStatementsRemoved: 0,
        totalStatementsPreserved: 0,
        totalStatementsCommented: 0,
        totalSizeSaved: 0,
        startTime: new Date().toISOString()
    };
    
    filePaths.forEach(filePath => {
        const result = removeConsoleStatements(filePath, options);
        
        if (result.success) {
            results.successful.push(result);
            results.totalStatementsRemoved += result.statementsRemoved || 0;
            results.totalStatementsPreserved += result.statementsPreserved || 0;
            results.totalStatementsCommented += result.statementsCommented || 0;
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
 * Preview console statement removal without making changes
 * @param {string} filePath - Path to file to preview
 * @param {Object} options - Preview options
 * @returns {Object} Preview result
 */
export function previewConsoleRemoval(filePath, options = {}) {
    return removeConsoleStatements(filePath, { ...options, dryRun: true });
}

/**
 * Generate cleanup report for console statements
 * @param {Object} cleanupResult - Result from removeConsoleStatementsFromFiles
 * @returns {string} Formatted report
 */
export function generateCleanupReport(cleanupResult) {
    let report = `📊 Console Cleanup Report\n`;
    report += `========================\n`;
    report += `Files processed: ${cleanupResult.totalFiles}\n`;
    report += `Successful: ${cleanupResult.successful.length}\n`;
    report += `Failed: ${cleanupResult.failed.length}\n`;
    report += `Success rate: ${cleanupResult.successRate.toFixed(1)}%\n\n`;
    
    report += `📈 Statements Summary:\n`;
    report += `Removed: ${cleanupResult.totalStatementsRemoved}\n`;
    report += `Preserved: ${cleanupResult.totalStatementsPreserved}\n`;
    report += `Commented: ${cleanupResult.totalStatementsCommented}\n`;
    report += `Size saved: ${cleanupResult.totalSizeSaved} bytes\n\n`;
    
    if (cleanupResult.successful.length > 0) {
        report += `✅ Successfully cleaned files:\n`;
        cleanupResult.successful.forEach(result => {
            report += `  ${result.filePath}: -${result.statementsRemoved} +${result.statementsCommented} comments\n`;
        });
        report += `\n`;
    }
    
    if (cleanupResult.failed.length > 0) {
        report += `❌ Failed files:\n`;
        cleanupResult.failed.forEach(result => {
            report += `  ${result.filePath}: ${result.error}\n`;
        });
    }
    
    return report;
}