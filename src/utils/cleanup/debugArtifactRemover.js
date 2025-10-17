/**
 * Debugging Artifact Remover for Production Cleanup
* Handles removal of alert, confirm, prompt, statements and other debugging artifacts
 */

import { readFileSync, writeFileSync } from 'fs';
import { parseFileContent } from './fileScanner.js';
import { createFileBackup } from './backupManager.js';

/**
 * Patterns for debugging artifacts
 */
const DEBUG_ARTIFACT_PATTERNS = {
    // Alert-type statements
    ALERT_STATEMENTS: /\b(alert|confirm|prompt)\s*\(/g,
    
    // Debugger statements
    DEBUGGER_STATEMENTS: /\bdebugger\s*;?/g,
    
    // Development-only conditionals
    DEV_CONDITIONALS: /if\s*\(\s*(?:process\.env\.NODE_ENV|NODE_ENV|__DEV__|DEBUG)\s*[=!]==?\s*['"`](?:development|dev|debug)['"`]\s*\)/gi,
    
    // TODO/FIXME comments that might contain debugging code
    TODO_COMMENTS: /\/\/\s*(TODO|FIXME|HACK|XXX|BUG).*$/gm,
    
    // Development console groups
    CONSOLE_GROUPS: /console\.(group|groupCollapsed|groupEnd)\s*\(/g,
    
    // Performance timing (often debugging)
    PERFORMANCE_TIMING: /console\.(time|timeEnd|timeLog)\s*\(/g,
    
    // Assert statements (often debugging)
    ASSERT_STATEMENTS: /console\.assert\s*\(/g
};

/**
 * User feedback patterns (functional alerts that should be preserved)
 */
const FUNCTIONAL_PATTERNS = {
    SUCCESS_MESSAGES: /success|complete|saved|done|finished/i,
    ERROR_MESSAGES: /error|fail|invalid|wrong|missing|required/i,
    CONFIRMATION: /confirm|sure|delete|remove|proceed|continue/i,
    USER_INPUT: /enter|input|provide|name|email|phone/i
};

/**
 * Scan file for debugging artifacts
 * @param {string} filePath - Path to the file to scan
 * @returns {Object} Debugging artifact analysis
 */
export function scanDebuggingArtifacts(filePath) {
    try {
        const fileData = parseFileContent(filePath);
        const artifacts = [];
        
        // Scan for different types of debugging artifacts
        const alertArtifacts = findAlertArtifacts(fileData);
const Artifacts = findDebuggerArtifacts(fileData);
        const conditionalArtifacts = findDevConditionals(fileData);
        const commentArtifacts = findTodoComments(fileData);
        const consoleArtifacts = findConsoleArtifacts(fileData);
        
        artifacts.push(...alertArtifacts);
artifacts.push(...Artifacts);
        artifacts.push(...conditionalArtifacts);
        artifacts.push(...commentArtifacts);
        artifacts.push(...consoleArtifacts);
        
        // Categorize artifacts
        const categorized = categorizeArtifacts(artifacts);
        
        return {
            filePath,
            totalArtifacts: artifacts.length,
            artifacts,
            categories: categorized,
            summary: generateArtifactSummary(artifacts, categorized),
            recommendations: generateArtifactRecommendations(artifacts, categorized)
        };
    } catch (error) {
        return {
            filePath,
            error: error.message,
            totalArtifacts: 0,
            artifacts: [],
            categories: {},
            summary: null,
            recommendations: []
        };
    }
}

/**
 * Find alert-type artifacts (alert, confirm, prompt)
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Alert artifacts
 */
function findAlertArtifacts(fileData) {
    const artifacts = [];
    const lines = fileData.lines;
    
    lines.forEach((line, index) => {
        const matches = [...line.matchAll(DEBUG_ARTIFACT_PATTERNS.ALERT_STATEMENTS)];
        
        matches.forEach(match => {
            const type = match[1]; // alert, confirm, or prompt
            const lineNumber = index + 1;
            const content = line.trim();
            
            // Analyze if this serves a functional purpose
            const analysis = analyzeAlertPurpose(line, type);
            
            artifacts.push({
                type: `${type}-statement`,
                category: 'alert',
                lineNumber,
                content,
                fullMatch: match[0],
                columnStart: match.index,
                hasFunctionalPurpose: analysis.isFunctional,
                functionalType: analysis.type,
                message: extractAlertMessage(line, match),
                removalStrategy: determineAlertRemovalStrategy(analysis, type),
                replacement: analysis.isFunctional ? generateAlertReplacement(analysis, type) : null
            });
        });
    });
    
    return artifacts;
}

/**
* Find statements
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Debugger artifacts
 */
function findDebuggerArtifacts(fileData) {
    const artifacts = [];
    const lines = fileData.lines;
    
    lines.forEach((line, index) => {
        const matches = [...line.matchAll(DEBUG_ARTIFACT_PATTERNS.DEBUGGER_STATEMENTS)];
        
        matches.forEach(match => {
            const lineNumber = index + 1;
            const content = line.trim();
            
// Check if is in conditional block
            const context = analyzeDebuggerContext(lines, index);
            
            artifacts.push({
type: '-statement',
category: '',
                lineNumber,
                content,
                fullMatch: match[0],
                columnStart: match.index,
                hasFunctionalPurpose: false, // Debugger statements are never functional in production
                context,
                removalStrategy: context.inConditional ? 'remove-conditional-block' : 'remove-statement'
            });
        });
    });
    
    return artifacts;
}

/**
 * Find development conditionals
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Conditional artifacts
 */
function findDevConditionals(fileData) {
    const artifacts = [];
    const lines = fileData.lines;
    
    lines.forEach((line, index) => {
        const matches = [...line.matchAll(DEBUG_ARTIFACT_PATTERNS.DEV_CONDITIONALS)];
        
        matches.forEach(match => {
            const lineNumber = index + 1;
            const content = line.trim();
            
            // Find the extent of the conditional block
            const blockExtent = findConditionalBlockExtent(lines, index);
            
            artifacts.push({
                type: 'dev-conditional',
                category: 'conditional',
                lineNumber,
                endLineNumber: blockExtent.endLine + 1,
                content,
                blockContent: lines.slice(index, blockExtent.endLine + 1).join('\n'),
                fullMatch: match[0],
                hasFunctionalPurpose: false,
                removalStrategy: 'remove-entire-block'
            });
        });
    });
    
    return artifacts;
}

/**
 * Find TODO/FIXME comments with debugging code
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Comment artifacts
 */
function findTodoComments(fileData) {
    const artifacts = [];
    const lines = fileData.lines;
    
    lines.forEach((line, index) => {
        const matches = [...line.matchAll(DEBUG_ARTIFACT_PATTERNS.TODO_COMMENTS)];
        
        matches.forEach(match => {
            const lineNumber = index + 1;
            const content = line.trim();
            const commentType = match[1]; // TODO, FIXME, etc.
            
            // Check if comment contains debugging-related content
            const hasDebuggingContent = analyzeCommentForDebugging(content);
            
            if (hasDebuggingContent.isDebugging) {
                artifacts.push({
                    type: 'debug-comment',
                    category: 'comment',
                    lineNumber,
                    content,
                    commentType,
                    debuggingType: hasDebuggingContent.type,
                    hasFunctionalPurpose: hasDebuggingContent.isFunctional,
                    removalStrategy: hasDebuggingContent.isFunctional ? 'preserve' : 'remove-comment'
                });
            }
        });
    });
    
    return artifacts;
}

/**
 * Find console artifacts (groups, timing, assert)
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Console artifacts
 */
function findConsoleArtifacts(fileData) {
    const artifacts = [];
    const lines = fileData.lines;
    
    // Console groups
    lines.forEach((line, index) => {
        const groupMatches = [...line.matchAll(DEBUG_ARTIFACT_PATTERNS.CONSOLE_GROUPS)];
        groupMatches.forEach(match => {
            artifacts.push({
                type: 'console-group',
                category: 'console',
                lineNumber: index + 1,
                content: line.trim(),
                method: match[1],
                hasFunctionalPurpose: false,
                removalStrategy: 'remove-statement'
            });
        });
        
        // Performance timing
        const timingMatches = [...line.matchAll(DEBUG_ARTIFACT_PATTERNS.PERFORMANCE_TIMING)];
        timingMatches.forEach(match => {
            artifacts.push({
                type: 'console-timing',
                category: 'console',
                lineNumber: index + 1,
                content: line.trim(),
                method: match[1],
                hasFunctionalPurpose: false,
                removalStrategy: 'remove-statement'
            });
        });
        
        // Assert statements
        const assertMatches = [...line.matchAll(DEBUG_ARTIFACT_PATTERNS.ASSERT_STATEMENTS)];
        assertMatches.forEach(match => {
            artifacts.push({
                type: 'console-assert',
                category: 'console',
                lineNumber: index + 1,
                content: line.trim(),
                method: 'assert',
                hasFunctionalPurpose: false,
                removalStrategy: 'remove-statement'
            });
        });
    });
    
    return artifacts;
}

/**
 * Analyze alert purpose to determine if it's functional
 * @param {string} line - Line containing alert
 * @param {string} type - Alert type (alert, confirm, prompt)
 * @returns {Object} Purpose analysis
 */
function analyzeAlertPurpose(line, type) {
    const lowerLine = line.toLowerCase();
    
    // Check for functional patterns
    for (const [patternType, pattern] of Object.entries(FUNCTIONAL_PATTERNS)) {
        if (pattern.test(lowerLine)) {
            return {
                isFunctional: true,
                type: patternType.toLowerCase().replace('_', '-'),
                confidence: 0.8
            };
        }
    }
    
    // Check for debugging patterns
    if (lowerLine.includes('debug') || lowerLine.includes('test') || lowerLine.includes('temp')) {
        return {
            isFunctional: false,
            type: 'debugging',
            confidence: 0.9
        };
    }
    
    // Default to functional for confirm/prompt, debugging for alert
    return {
        isFunctional: type !== 'alert',
        type: type === 'alert' ? 'debugging' : 'user-interaction',
        confidence: 0.5
    };
}

/**
 * Extract message from alert statement
 * @param {string} line - Line containing alert
 * @param {RegExpMatchArray} match - Regex match
 * @returns {string} Extracted message
 */
function extractAlertMessage(line, match) {
    try {
        const startIndex = match.index + match[0].length - 1; // Position of opening parenthesis
        let parenCount = 0;
        let message = '';
        let inString = false;
        let stringChar = '';
        
        for (let i = startIndex; i < line.length; i++) {
            const char = line[i];
            
            if (!inString && (char === '"' || char === "'" || char === '`')) {
                inString = true;
                stringChar = char;
            } else if (inString && char === stringChar && line[i-1] !== '\\') {
                inString = false;
                stringChar = '';
            }
            
            if (!inString) {
                if (char === '(') parenCount++;
                else if (char === ')') parenCount--;
            }
            
            message += char;
            
            if (parenCount === 0 && char === ')') {
                break;
            }
        }
        
        return message.slice(1, -1).trim(); // Remove parentheses
    } catch (error) {
        return '';
    }
}

/**
* Analyze context
 * @param {string[]} lines - All file lines
* @param {number} lineIndex - Index of line
 * @returns {Object} Context analysis
 */
function analyzeDebuggerContext(lines, lineIndex) {
    const contextRange = 3;
    const startIndex = Math.max(0, lineIndex - contextRange);
    const endIndex = Math.min(lines.length, lineIndex + contextRange + 1);
    
    const contextLines = lines.slice(startIndex, endIndex);
    const contextText = contextLines.join(' ').toLowerCase();
    
    return {
        inConditional: /if\s*\(/.test(contextText),
        inTryCatch: /try\s*\{|catch\s*\(/.test(contextText),
        inFunction: /function\s+\w+|=>\s*\{/.test(contextText),
        surroundingLines: contextLines
    };
}

/**
 * Find extent of conditional block
 * @param {string[]} lines - File lines
 * @param {number} startIndex - Starting line index
 * @returns {Object} Block extent
 */
function findConditionalBlockExtent(lines, startIndex) {
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
                    return { endLine: i };
                }
            }
        }
    }
    
    return { endLine: startIndex };
}

/**
 * Analyze comment for debugging content
 * @param {string} content - Comment content
 * @returns {Object} Analysis result
 */
function analyzeCommentForDebugging(content) {
    const lowerContent = content.toLowerCase();
    
    const debuggingKeywords = ['debug', 'test', 'temp', 'hack', 'remove', 'delete'];
    const functionalKeywords = ['todo', 'implement', 'feature', 'bug', 'fix'];
    
    const hasDebugging = debuggingKeywords.some(keyword => lowerContent.includes(keyword));
    const hasFunctional = functionalKeywords.some(keyword => lowerContent.includes(keyword));
    
    if (hasDebugging && !hasFunctional) {
        return { isDebugging: true, type: 'debugging', isFunctional: false };
    } else if (hasFunctional) {
        return { isDebugging: true, type: 'functional', isFunctional: true };
    }
    
    return { isDebugging: false, type: 'unknown', isFunctional: false };
}

/**
 * Determine alert removal strategy
 * @param {Object} analysis - Alert purpose analysis
 * @param {string} type - Alert type
 * @returns {string} Removal strategy
 */
function determineAlertRemovalStrategy(analysis, type) {
    if (analysis.isFunctional) {
        if (type === 'alert') {
            return 'replace-with-ui-feedback';
        } else if (type === 'confirm') {
            return 'replace-with-ui-confirmation';
        } else if (type === 'prompt') {
            return 'replace-with-ui-input';
        }
    }
    
    return 'remove-statement';
}

/**
 * Generate replacement for functional alert
 * @param {Object} analysis - Alert analysis
 * @param {string} type - Alert type
 * @returns {string} Replacement code
 */
function generateAlertReplacement(analysis, type) {
    if (type === 'alert') {
        return '// TODO: Replace with proper UI notification';
    } else if (type === 'confirm') {
        return '// TODO: Replace with proper UI confirmation dialog';
    } else if (type === 'prompt') {
        return '// TODO: Replace with proper UI input form';
    }
    
    return '// TODO: Replace with appropriate UI component';
}

/**
 * Categorize artifacts
 * @param {Object[]} artifacts - Array of artifacts
 * @returns {Object} Categorized artifacts
 */
function categorizeArtifacts(artifacts) {
    const categories = {
        byType: {},
        byCategory: {},
        toRemove: [],
        toReplace: [],
        toPreserve: []
    };
    
    artifacts.forEach(artifact => {
        // By type
        if (!categories.byType[artifact.type]) {
            categories.byType[artifact.type] = [];
        }
        categories.byType[artifact.type].push(artifact);
        
        // By category
        if (!categories.byCategory[artifact.category]) {
            categories.byCategory[artifact.category] = [];
        }
        categories.byCategory[artifact.category].push(artifact);
        
        // By action
        if (artifact.hasFunctionalPurpose) {
            if (artifact.removalStrategy.includes('replace')) {
                categories.toReplace.push(artifact);
            } else {
                categories.toPreserve.push(artifact);
            }
        } else {
            categories.toRemove.push(artifact);
        }
    });
    
    return categories;
}

/**
 * Generate artifact summary
 * @param {Object[]} artifacts - Array of artifacts
 * @param {Object} categories - Categorized artifacts
 * @returns {Object} Summary
 */
function generateArtifactSummary(artifacts, categories) {
    return {
        total: artifacts.length,
        byType: Object.keys(categories.byType).map(type => ({
            type,
            count: categories.byType[type].length
        })),
        byCategory: Object.keys(categories.byCategory).map(category => ({
            category,
            count: categories.byCategory[category].length
        })),
        actions: {
            toRemove: categories.toRemove.length,
            toReplace: categories.toReplace.length,
            toPreserve: categories.toPreserve.length
        }
    };
}

/**
 * Generate cleanup recommendations
 * @param {Object[]} artifacts - Array of artifacts
 * @param {Object} categories - Categorized artifacts
 * @returns {string[]} Recommendations
 */
function generateArtifactRecommendations(artifacts, categories) {
    const recommendations = [];
    
    if (categories.toRemove.length > 0) {
        recommendations.push(`Remove ${categories.toRemove.length} debugging artifacts`);
    }
    
    if (categories.toReplace.length > 0) {
        recommendations.push(`Replace ${categories.toReplace.length} functional alerts with proper UI components`);
    }
    
    if (categories.toPreserve.length > 0) {
        recommendations.push(`Review ${categories.toPreserve.length} artifacts marked for preservation`);
    }
    
    const alertCount = (categories.byType['alert-statement']?.length || 0) + 
                     (categories.byType['confirm-statement']?.length || 0) + 
                     (categories.byType['prompt-statement']?.length || 0);
    if (alertCount > 0) {
        recommendations.push(`Handle ${alertCount} alert-type statements`);
    }
    
    return recommendations;
}/**

 * Remove debugging artifacts from a file
 * @param {string} filePath - Path to the file to clean
 * @param {Object} options - Cleanup options
 * @returns {Object} Cleanup result
 */
export function removeDebuggingArtifacts(filePath, options = {}) {
    const defaultOptions = {
        createBackup: true,
        replaceAlerts: true,
        removeDebugger: true,
        removeDevConditionals: true,
        removeDebugComments: true,
        removeConsoleArtifacts: true,
        dryRun: false
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        // Analyze artifacts first
        const analysis = scanDebuggingArtifacts(filePath);
        
        if (analysis.error) {
            return {
                success: false,
                filePath,
                error: analysis.error
            };
        }
        
        if (analysis.totalArtifacts === 0) {
            return {
                success: true,
                filePath,
                message: 'No debugging artifacts found',
                artifactsRemoved: 0,
                artifactsReplaced: 0,
                artifactsPreserved: 0
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
        
        // Process artifact removals
        const processResult = processArtifactRemovals(lines, analysis.artifacts, config);
        
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
            artifactsRemoved: processResult.removed,
            artifactsReplaced: processResult.replaced,
            artifactsPreserved: processResult.preserved,
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
 * Process artifact removals
 * @param {string[]} lines - File lines
 * @param {Object[]} artifacts - Artifacts to process
 * @param {Object} config - Configuration options
 * @returns {Object} Processing result
 */
function processArtifactRemovals(lines, artifacts, config) {
    const modifiedLines = [...lines];
    const changes = [];
    let removed = 0;
    let replaced = 0;
    let preserved = 0;
    let linesRemoved = 0;
    
    // Sort artifacts by line number (descending) to avoid index issues
    const sortedArtifacts = artifacts.sort((a, b) => (b.endLineNumber || b.lineNumber) - (a.endLineNumber || a.lineNumber));
    
    sortedArtifacts.forEach(artifact => {
        const result = processArtifactRemoval(modifiedLines, artifact, config);
        
        if (result.action === 'removed') {
            removed++;
            linesRemoved += result.linesRemoved || 0;
        } else if (result.action === 'replaced') {
            replaced++;
        } else if (result.action === 'preserved') {
            preserved++;
        }
        
        if (result.changes) {
            changes.push(...result.changes);
        }
    });
    
    return {
        modifiedLines,
        removed,
        replaced,
        preserved,
        linesRemoved,
        changes
    };
}

/**
 * Process individual artifact removal
 * @param {string[]} lines - File lines
 * @param {Object} artifact - Artifact to process
 * @param {Object} config - Configuration
 * @returns {Object} Processing result
 */
function processArtifactRemoval(lines, artifact, config) {
    switch (artifact.category) {
        case 'alert':
            return processAlertArtifact(lines, artifact, config);
case '':
            return processDebuggerArtifact(lines, artifact, config);
        case 'conditional':
            return processConditionalArtifact(lines, artifact, config);
        case 'comment':
            return processCommentArtifact(lines, artifact, config);
        case 'console':
            return processConsoleArtifact(lines, artifact, config);
        default:
            return { action: 'preserved', reason: 'Unknown artifact type' };
    }
}

/**
 * Process alert artifact
 * @param {string[]} lines - File lines
 * @param {Object} artifact - Alert artifact
 * @param {Object} config - Configuration
 * @returns {Object} Processing result
 */
function processAlertArtifact(lines, artifact, config) {
    const lineIndex = artifact.lineNumber - 1;
    const originalLine = lines[lineIndex];
    
    if (!config.replaceAlerts && artifact.hasFunctionalPurpose) {
        return {
            action: 'preserved',
            reason: 'Functional alert preserved by configuration'
        };
    }
    
    if (artifact.hasFunctionalPurpose && artifact.replacement) {
        // Replace with comment
        const leadingWhitespace = originalLine.match(/^\s*/)[0];
        const newLine = leadingWhitespace + artifact.replacement;
        lines[lineIndex] = newLine;
        
        return {
            action: 'replaced',
            changes: [{
                type: 'alert-replacement',
                lineNumber: artifact.lineNumber,
                original: originalLine,
                modified: newLine,
                reason: `Replaced functional ${artifact.type} with TODO comment`
            }]
        };
    } else {
        // Remove the alert statement
        const result = removeAlertFromLine(originalLine, artifact);
        
        if (result.newLine === null) {
            // Remove entire line
            lines.splice(lineIndex, 1);
            return {
                action: 'removed',
                linesRemoved: 1,
                changes: [{
                    type: 'alert-removal',
                    lineNumber: artifact.lineNumber,
                    original: originalLine,
                    modified: null,
                    reason: `Removed debugging ${artifact.type}`
                }]
            };
        } else {
            // Modify line
            lines[lineIndex] = result.newLine;
            return {
                action: 'removed',
                changes: [{
                    type: 'alert-modification',
                    lineNumber: artifact.lineNumber,
                    original: originalLine,
                    modified: result.newLine,
                    reason: `Removed ${artifact.type} from line`
                }]
            };
        }
    }
}

/**
* Process artifact
 * @param {string[]} lines - File lines
 * @param {Object} artifact - Debugger artifact
 * @param {Object} config - Configuration
 * @returns {Object} Processing result
 */
function processDebuggerArtifact(lines, artifact, config) {
    if (!config.removeDebugger) {
        return {
            action: 'preserved',
            reason: 'Debugger statements preserved by configuration'
        };
    }
    
    const lineIndex = artifact.lineNumber - 1;
    const originalLine = lines[lineIndex];
    
    if (artifact.removalStrategy === 'remove-conditional-block' && artifact.context.inConditional) {
        // Remove the entire conditional block (simplified - just remove the line for now)
        lines.splice(lineIndex, 1);
        return {
            action: 'removed',
            linesRemoved: 1,
            changes: [{
type: '-removal',
                lineNumber: artifact.lineNumber,
                original: originalLine,
                modified: null,
reason: 'Removed statement'
            }]
        };
    } else {
        const newLine = originalLine.replace(/\bdebugger\s*;?/, '').trim();
        
        if (newLine === '') {
            // Remove entire line if it becomes empty
            lines.splice(lineIndex, 1);
            return {
                action: 'removed',
                linesRemoved: 1,
                changes: [{
type: '-removal',
                    lineNumber: artifact.lineNumber,
                    original: originalLine,
                    modified: null,
reason: 'Removed statement (entire line)'
                }]
            };
        } else {
            // Keep modified line
            lines[lineIndex] = newLine;
            return {
                action: 'removed',
                changes: [{
type: '-modification',
                    lineNumber: artifact.lineNumber,
                    original: originalLine,
                    modified: newLine,
reason: 'Removed statement from line'
                }]
            };
        }
    }
}

/**
 * Process conditional artifact
 * @param {string[]} lines - File lines
 * @param {Object} artifact - Conditional artifact
 * @param {Object} config - Configuration
 * @returns {Object} Processing result
 */
function processConditionalArtifact(lines, artifact, config) {
    if (!config.removeDevConditionals) {
        return {
            action: 'preserved',
            reason: 'Development conditionals preserved by configuration'
        };
    }
    
    const startIndex = artifact.lineNumber - 1;
    const endIndex = (artifact.endLineNumber || artifact.lineNumber) - 1;
    const linesCount = endIndex - startIndex + 1;
    
    // Remove the entire conditional block
    const removedLines = lines.splice(startIndex, linesCount);
    
    return {
        action: 'removed',
        linesRemoved: linesCount,
        changes: [{
            type: 'conditional-removal',
            startLine: artifact.lineNumber,
            endLine: artifact.endLineNumber || artifact.lineNumber,
            original: removedLines.join('\n'),
            modified: null,
            reason: 'Removed development conditional block'
        }]
    };
}

/**
 * Process comment artifact
 * @param {string[]} lines - File lines
 * @param {Object} artifact - Comment artifact
 * @param {Object} config - Configuration
 * @returns {Object} Processing result
 */
function processCommentArtifact(lines, artifact, config) {
    if (!config.removeDebugComments || artifact.hasFunctionalPurpose) {
        return {
            action: 'preserved',
            reason: 'Debug comment preserved (functional or by configuration)'
        };
    }
    
    const lineIndex = artifact.lineNumber - 1;
    const originalLine = lines[lineIndex];
    
    // Remove the comment line
    lines.splice(lineIndex, 1);
    
    return {
        action: 'removed',
        linesRemoved: 1,
        changes: [{
            type: 'comment-removal',
            lineNumber: artifact.lineNumber,
            original: originalLine,
            modified: null,
            reason: `Removed debug comment (${artifact.commentType})`
        }]
    };
}

/**
 * Process console artifact
 * @param {string[]} lines - File lines
 * @param {Object} artifact - Console artifact
 * @param {Object} config - Configuration
 * @returns {Object} Processing result
 */
function processConsoleArtifact(lines, artifact, config) {
    if (!config.removeConsoleArtifacts) {
        return {
            action: 'preserved',
            reason: 'Console artifacts preserved by configuration'
        };
    }
    
    const lineIndex = artifact.lineNumber - 1;
    const originalLine = lines[lineIndex];
    
    // Remove the console statement
    const pattern = new RegExp(`console\\.${artifact.method}\\s*\\([^)]*\\)\\s*;?`, 'g');
    const newLine = originalLine.replace(pattern, '').trim();
    
    if (newLine === '') {
        // Remove entire line if it becomes empty
        lines.splice(lineIndex, 1);
        return {
            action: 'removed',
            linesRemoved: 1,
            changes: [{
                type: 'console-artifact-removal',
                lineNumber: artifact.lineNumber,
                original: originalLine,
                modified: null,
                reason: `Removed console.${artifact.method} statement`
            }]
        };
    } else {
        // Keep modified line
        lines[lineIndex] = newLine;
        return {
            action: 'removed',
            changes: [{
                type: 'console-artifact-modification',
                lineNumber: artifact.lineNumber,
                original: originalLine,
                modified: newLine,
                reason: `Removed console.${artifact.method} from line`
            }]
        };
    }
}

/**
 * Remove alert from line while preserving other code
 * @param {string} line - Original line
 * @param {Object} artifact - Alert artifact
 * @returns {Object} Removal result
 */
function removeAlertFromLine(line, artifact) {
    const trimmedLine = line.trim();
    
    // Check if alert is the entire line
    if (trimmedLine.startsWith(artifact.type.replace('-statement', '')) && 
        (trimmedLine.endsWith(';') || trimmedLine.endsWith(')'))) {
        return { newLine: null }; // Remove entire line
    }
    
    // Remove just the alert statement
    const pattern = new RegExp(`\\b${artifact.type.replace('-statement', '')}\\s*\\([^)]*\\)\\s*;?`, 'g');
    const newLine = line.replace(pattern, '').trim();
    
    return { newLine: newLine || null };
}

/**
 * Remove debugging artifacts from multiple files
 * @param {string[]} filePaths - Array of file paths
 * @param {Object} options - Cleanup options
 * @returns {Object} Batch cleanup result
 */
export function removeDebuggingArtifactsFromFiles(filePaths, options = {}) {
    const results = {
        successful: [],
        failed: [],
        totalFiles: filePaths.length,
        totalArtifactsRemoved: 0,
        totalArtifactsReplaced: 0,
        totalArtifactsPreserved: 0,
        totalSizeSaved: 0,
        startTime: new Date().toISOString()
    };
    
    filePaths.forEach(filePath => {
        const result = removeDebuggingArtifacts(filePath, options);
        
        if (result.success) {
            results.successful.push(result);
            results.totalArtifactsRemoved += result.artifactsRemoved || 0;
            results.totalArtifactsReplaced += result.artifactsReplaced || 0;
            results.totalArtifactsPreserved += result.artifactsPreserved || 0;
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
 * Preview debugging artifact removal without making changes
 * @param {string} filePath - Path to file to preview
 * @param {Object} options - Preview options
 * @returns {Object} Preview result
 */
export function previewDebuggingArtifactRemoval(filePath, options = {}) {
    return removeDebuggingArtifacts(filePath, { ...options, dryRun: true });
}