/**
 * Enhanced Console Statement Scanner for Production Cleanup
 * Provides detailed analysis and categorization of console statements
 */

import { parseFileContent } from './fileScanner.js';

/**
 * Enhanced regex patterns for console statement detection
 */
const CONSOLE_PATTERNS = {
    // Main console methods
    CONSOLE_METHODS: /console\.(log|error|warn|debug|info|trace|table|group|groupCollapsed|groupEnd|time|timeEnd|timeLog|count|countReset|clear|assert|dir|dirxml)\s*\(/g,
    
    // Multi-line console statements
    MULTILINE_CONSOLE: /console\.[a-zA-Z]+\s*\(\s*[\s\S]*?\)/g,
    
    // Console with template literals
    TEMPLATE_LITERALS: /console\.[a-zA-Z]+\s*\(\s*`[\s\S]*?`/g,
    
    // Console with complex expressions
    COMPLEX_EXPRESSIONS: /console\.[a-zA-Z]+\s*\(\s*[^)]*\{[\s\S]*?\}[^)]*\)/g
};

/**
 * Context analysis patterns
 */
const CONTEXT_PATTERNS = {
    ERROR_HANDLING: [
        /try\s*\{[\s\S]*?\}\s*catch/i,
        /catch\s*\([^)]*\)\s*\{/i,
        /\.catch\s*\(/i,
        /throw\s+/i,
        /error/i,
        /exception/i
    ],
    
    TESTING: [
        /describe\s*\(/i,
        /it\s*\(/i,
        /test\s*\(/i,
        /expect\s*\(/i,
        /assert/i,
        /spec/i
    ],
    
    DEBUGGING: [
        /debug/i,
        /todo/i,
        /fixme/i,
        /hack/i,
        /temp/i,
        /temporary/i
    ],
    
    DEVELOPMENT: [
        /dev/i,
        /development/i,
        /local/i,
        /staging/i
    ]
};

/**
 * Scan file for console statements with enhanced analysis
 * @param {string} filePath - Path to the file to scan
 * @returns {Object} Detailed console statement analysis
 */
export function scanConsoleStatements(filePath) {
    try {
        const fileData = parseFileContent(filePath);
        const statements = [];
        
        // Analyze each line for console statements
        fileData.lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const matches = [...line.matchAll(CONSOLE_PATTERNS.CONSOLE_METHODS)];
            
            matches.forEach(match => {
                const statement = analyzeConsoleStatement(
                    line, 
                    match, 
                    lineNumber, 
                    fileData.lines, 
                    index
                );
                statements.push(statement);
            });
        });
        
        // Look for multi-line console statements
        const multilineStatements = findMultilineConsoleStatements(fileData);
        statements.push(...multilineStatements);
        
        // Categorize and prioritize statements
        const categorized = categorizeConsoleStatements(statements);
        
        return {
            filePath,
            totalStatements: statements.length,
            statements,
            categories: categorized,
            summary: generateConsoleSummary(statements, categorized),
            recommendations: generateCleanupRecommendations(statements, categorized)
        };
    } catch (error) {
        return {
            filePath,
            error: error.message,
            totalStatements: 0,
            statements: [],
            categories: {},
            summary: null,
            recommendations: []
        };
    }
}

/**
 * Analyze individual console statement
 * @param {string} line - Line containing console statement
 * @param {RegExpMatchArray} match - Regex match result
 * @param {number} lineNumber - Line number
 * @param {string[]} allLines - All lines in file
 * @param {number} lineIndex - Index of current line
 * @returns {Object} Console statement analysis
 */
function analyzeConsoleStatement(line, match, lineNumber, allLines, lineIndex) {
    const method = match[1]; // log, error, warn, etc.
    const fullMatch = match[0];
    const columnStart = match.index;
    
    // Extract the content being logged
    const content = extractConsoleContent(line, match);
    
    // Analyze context
    const context = analyzeStatementContext(allLines, lineIndex);
    
    // Determine importance and preservation strategy
    const importance = determineStatementImportance(line, content, context, method);
    
    // Check for special patterns
    const patterns = analyzeStatementPatterns(line, content);
    
    return {
        method,
        lineNumber,
        columnStart,
        content: line.trim(),
        loggedContent: content,
        context,
        importance,
        patterns,
        preserveAsComment: shouldPreserveAsComment(content, context, importance),
        removalStrategy: determineRemovalStrategy(line, match, context, importance),
        fullMatch,
        isMultiline: false
    };
}

/**
 * Extract content being logged from console statement
 * @param {string} line - Line containing console statement
 * @param {RegExpMatchArray} match - Regex match result
 * @returns {string} Extracted content
 */
function extractConsoleContent(line, match) {
    try {
        const startIndex = match.index + match[0].length - 1; // Position of opening parenthesis
        let parenCount = 0;
        let content = '';
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
            
            content += char;
            
            if (parenCount === 0 && char === ')') {
                break;
            }
        }
        
        return content.slice(1, -1).trim(); // Remove parentheses
    } catch (error) {
        return line.trim();
    }
}

/**
 * Analyze context around console statement
 * @param {string[]} allLines - All lines in file
 * @param {number} lineIndex - Index of line with console statement
 * @returns {Object} Context analysis
 */
function analyzeStatementContext(allLines, lineIndex) {
    const contextRange = 5; // Lines before and after to analyze
    const startIndex = Math.max(0, lineIndex - contextRange);
    const endIndex = Math.min(allLines.length, lineIndex + contextRange + 1);
    
    const contextLines = allLines.slice(startIndex, endIndex);
    const contextText = contextLines.join(' ').toLowerCase();
    
    const context = {
        type: 'general',
        confidence: 0,
        indicators: [],
        surroundingCode: contextLines
    };
    
    // Check for different context types
    for (const [contextType, patterns] of Object.entries(CONTEXT_PATTERNS)) {
        let matches = 0;
        const foundPatterns = [];
        
        patterns.forEach(pattern => {
            if (pattern.test(contextText)) {
                matches++;
                foundPatterns.push(pattern.source);
            }
        });
        
        if (matches > 0) {
            const confidence = matches / patterns.length;
            if (confidence > context.confidence) {
                context.type = contextType.toLowerCase().replace('_', '-');
                context.confidence = confidence;
                context.indicators = foundPatterns;
            }
        }
    }
    
    // Additional context analysis
    context.inFunction = analyzeIfInFunction(allLines, lineIndex);
    context.inConditional = analyzeIfInConditional(allLines, lineIndex);
    context.inLoop = analyzeIfInLoop(allLines, lineIndex);
    
    return context;
}

/**
 * Determine importance of console statement
 * @param {string} line - Line containing statement
 * @param {string} content - Logged content
 * @param {Object} context - Statement context
 * @param {string} method - Console method (log, error, etc.)
 * @returns {Object} Importance analysis
 */
function determineStatementImportance(line, content, context, method) {
    let score = 0;
    const factors = [];
    
    // Method-based scoring
    if (method === 'error') {
        score += 3;
        factors.push('error-method');
    } else if (method === 'warn') {
        score += 2;
        factors.push('warn-method');
    } else if (method === 'info') {
        score += 1;
        factors.push('info-method');
    }
    
    // Context-based scoring
    if (context.type === 'error-handling') {
        score += 3;
        factors.push('error-handling-context');
    } else if (context.type === 'testing') {
        score -= 2;
        factors.push('testing-context');
    } else if (context.type === 'debugging') {
        score -= 1;
        factors.push('debugging-context');
    }
    
    // Content-based scoring
    if (content.toLowerCase().includes('error')) {
        score += 2;
        factors.push('error-content');
    }
    if (content.toLowerCase().includes('success')) {
        score += 1;
        factors.push('success-content');
    }
    if (content.toLowerCase().includes('debug') || content.toLowerCase().includes('test')) {
        score -= 2;
        factors.push('debug-content');
    }
    
    // Determine importance level
    let level;
    if (score >= 4) level = 'critical';
    else if (score >= 2) level = 'important';
    else if (score >= 0) level = 'normal';
    else level = 'low';
    
    return {
        score,
        level,
        factors,
        shouldPreserve: score >= 2
    };
}

/**
 * Analyze statement patterns
 * @param {string} line - Line containing statement
 * @param {string} content - Logged content
 * @returns {Object} Pattern analysis
 */
function analyzeStatementPatterns(line, content) {
    const patterns = {
        hasVariables: /\$\{|\+\s*\w+|\w+\s*\+/.test(content),
        hasTemplateString: /`.*\$\{.*\}.*`/.test(content),
        hasObjectLogging: /\{[\s\S]*\}/.test(content),
        hasMethodCall: /\w+\([^)]*\)/.test(content),
        hasEmoji: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(content),
        isSimpleString: /^['"`][^'"`]*['"`]$/.test(content.trim()),
        isMultiArgument: content.includes(','),
        hasConditional: line.includes('?') && line.includes(':')
    };
    
    return patterns;
}

/**
 * Find multi-line console statements
 * @param {Object} fileData - Parsed file data
 * @returns {Object[]} Multi-line console statements
 */
function findMultilineConsoleStatements(fileData) {
    const multilineStatements = [];
    const content = fileData.content;
    
    // Find multi-line console statements using regex
    const matches = [...content.matchAll(CONSOLE_PATTERNS.MULTILINE_CONSOLE)];
    
    matches.forEach(match => {
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
        
        // Extract method name
        const methodMatch = match[0].match(/console\.([a-zA-Z]+)/);
        const method = methodMatch ? methodMatch[1] : 'unknown';
        
        multilineStatements.push({
            method,
            lineNumber,
            columnStart: match.index - beforeMatch.lastIndexOf('\n') - 1,
            content: match[0],
            loggedContent: match[0],
            context: { type: 'general', confidence: 0 },
            importance: { level: 'normal', score: 0, factors: [] },
            patterns: { isMultiline: true },
            preserveAsComment: false,
            removalStrategy: 'remove-entire-statement',
            fullMatch: match[0],
            isMultiline: true
        });
    });
    
    return multilineStatements;
}

/**
 * Categorize console statements
 * @param {Object[]} statements - Array of console statements
 * @returns {Object} Categorized statements
 */
function categorizeConsoleStatements(statements) {
    const categories = {
        byMethod: {},
        byContext: {},
        byImportance: {},
        toPreserve: [],
        toRemove: [],
        toComment: []
    };
    
    statements.forEach(statement => {
        // By method
        if (!categories.byMethod[statement.method]) {
            categories.byMethod[statement.method] = [];
        }
        categories.byMethod[statement.method].push(statement);
        
        // By context
        if (!categories.byContext[statement.context.type]) {
            categories.byContext[statement.context.type] = [];
        }
        categories.byContext[statement.context.type].push(statement);
        
        // By importance
        if (!categories.byImportance[statement.importance.level]) {
            categories.byImportance[statement.importance.level] = [];
        }
        categories.byImportance[statement.importance.level].push(statement);
        
        // By action
        if (statement.preserveAsComment) {
            categories.toComment.push(statement);
        } else if (statement.importance.shouldPreserve) {
            categories.toPreserve.push(statement);
        } else {
            categories.toRemove.push(statement);
        }
    });
    
    return categories;
}

/**
 * Generate summary of console statements
 * @param {Object[]} statements - Array of console statements
 * @param {Object} categories - Categorized statements
 * @returns {Object} Summary information
 */
function generateConsoleSummary(statements, categories) {
    return {
        total: statements.length,
        byMethod: Object.keys(categories.byMethod).map(method => ({
            method,
            count: categories.byMethod[method].length
        })),
        byContext: Object.keys(categories.byContext).map(context => ({
            context,
            count: categories.byContext[context].length
        })),
        byImportance: Object.keys(categories.byImportance).map(importance => ({
            importance,
            count: categories.byImportance[importance].length
        })),
        actions: {
            toRemove: categories.toRemove.length,
            toPreserve: categories.toPreserve.length,
            toComment: categories.toComment.length
        }
    };
}

/**
 * Generate cleanup recommendations
 * @param {Object[]} statements - Array of console statements
 * @param {Object} categories - Categorized statements
 * @returns {string[]} Array of recommendations
 */
function generateCleanupRecommendations(statements, categories) {
    const recommendations = [];
    
    if (categories.toRemove.length > 0) {
        recommendations.push(`Remove ${categories.toRemove.length} debugging console statements`);
    }
    
    if (categories.toComment.length > 0) {
        recommendations.push(`Convert ${categories.toComment.length} important console statements to comments`);
    }
    
    if (categories.toPreserve.length > 0) {
        recommendations.push(`Keep ${categories.toPreserve.length} critical console statements (review manually)`);
    }
    
    if (categories.byContext['error-handling'] && categories.byContext['error-handling'].length > 0) {
        recommendations.push(`Review ${categories.byContext['error-handling'].length} console statements in error handling blocks`);
    }
    
    if (categories.byMethod.error && categories.byMethod.error.length > 0) {
        recommendations.push(`Carefully review ${categories.byMethod.error.length} console.error statements`);
    }
    
    return recommendations;
}

/**
 * Helper functions for context analysis
 */

function analyzeIfInFunction(allLines, lineIndex) {
    // Look backwards for function declaration
    for (let i = lineIndex; i >= 0; i--) {
        const line = allLines[i].trim();
        if (/function\s+\w+|const\s+\w+\s*=.*=>|\w+\s*\([^)]*\)\s*\{/.test(line)) {
            return true;
        }
    }
    return false;
}

function analyzeIfInConditional(allLines, lineIndex) {
    // Look for if/else/switch statements
    for (let i = Math.max(0, lineIndex - 3); i <= lineIndex; i++) {
        const line = allLines[i].trim();
        if (/if\s*\(|else\s*\{|switch\s*\(/.test(line)) {
            return true;
        }
    }
    return false;
}

function analyzeIfInLoop(allLines, lineIndex) {
    // Look for loop statements
    for (let i = Math.max(0, lineIndex - 3); i <= lineIndex; i++) {
        const line = allLines[i].trim();
        if (/for\s*\(|while\s*\(|forEach\s*\(/.test(line)) {
            return true;
        }
    }
    return false;
}

function shouldPreserveAsComment(content, context, importance) {
    // Preserve important debugging information as comments
    if (importance.level === 'critical' || importance.level === 'important') {
        return true;
    }
    
    if (context.type === 'error-handling' && content.toLowerCase().includes('error')) {
        return true;
    }
    
    if (content.toLowerCase().includes('todo') || 
        content.toLowerCase().includes('fixme') || 
        content.toLowerCase().includes('note')) {
        return true;
    }
    
    return false;
}

function determineRemovalStrategy(line, match, context, importance) {
    if (importance.shouldPreserve) {
        return 'preserve';
    }
    
    if (shouldPreserveAsComment(match[0], context, importance)) {
        return 'convert-to-comment';
    }
    
    // Check if console statement is the only thing on the line
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('console.') && trimmedLine.endsWith(';')) {
        return 'remove-entire-line';
    }
    
    return 'remove-statement-only';
}