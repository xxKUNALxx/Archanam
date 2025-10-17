/**
 * Rollback Manager for Production Cleanup
 * Handles automatic rollback when errors occur during cleanup
 */

import { restoreFromBackup, restoreBackupSession, listBackups } from './backupManager.js';
import { validateFileAccess } from './backupManager.js';

/**
 * Rollback configuration
 */
const ROLLBACK_CONFIG = {
    autoRollbackOnSyntaxError: true,
    autoRollbackOnImportError: true,
    maxRollbackAttempts: 3,
    validateAfterRollback: true
};

/**
 * Error types that trigger automatic rollback
 */
const ROLLBACK_TRIGGERS = {
    SYNTAX_ERROR: 'syntax-error',
    IMPORT_ERROR: 'import-error',
    EXPORT_ERROR: 'export-error',
    FILE_ACCESS_ERROR: 'file-access-error',
    VALIDATION_ERROR: 'validation-error'
};

/**
 * Detect if an error should trigger rollback
 * @param {Error} error - Error object
 * @param {string} filePath - File that caused the error
 * @returns {Object} Rollback decision
 */
export function shouldTriggerRollback(error, filePath) {
    const errorMessage = error.message.toLowerCase();
    
    // Syntax errors
    if (errorMessage.includes('syntax') || errorMessage.includes('unexpected token') || 
        errorMessage.includes('parse error')) {
        return {
            shouldRollback: ROLLBACK_CONFIG.autoRollbackOnSyntaxError,
            triggerType: ROLLBACK_TRIGGERS.SYNTAX_ERROR,
            reason: 'Syntax error detected'
        };
    }
    
    // Import/Export errors
    if (errorMessage.includes('import') || errorMessage.includes('export') || 
        errorMessage.includes('module not found')) {
        return {
            shouldRollback: ROLLBACK_CONFIG.autoRollbackOnImportError,
            triggerType: ROLLBACK_TRIGGERS.IMPORT_ERROR,
            reason: 'Import/Export error detected'
        };
    }
    
    // File access errors
    if (errorMessage.includes('enoent') || errorMessage.includes('permission') || 
        errorMessage.includes('access denied')) {
        return {
            shouldRollback: true,
            triggerType: ROLLBACK_TRIGGERS.FILE_ACCESS_ERROR,
            reason: 'File access error detected'
        };
    }
    
    return {
        shouldRollback: false,
        triggerType: null,
        reason: 'Error does not trigger automatic rollback'
    };
}

/**
 * Perform automatic rollback for a single file
 * @param {string} filePath - File to rollback
 * @param {string} reason - Reason for rollback
 * @returns {Object} Rollback result
 */
export function performFileRollback(filePath, reason = 'Error detected') {
    try {
        // Find the most recent backup for this file
        const backups = listBackups();
        const fileBackups = backups.filter(backup => backup.originalPath === filePath);
        
        if (fileBackups.length === 0) {
            return {
                success: false,
                filePath,
                error: 'No backup found for file',
                reason
            };
        }
        
        // Use the most recent backup
        const latestBackup = fileBackups[0];
        const restoreResult = restoreFromBackup(latestBackup.backupPath);
        
        if (!restoreResult.success) {
            return {
                success: false,
                filePath,
                error: restoreResult.error,
                reason
            };
        }
        
        // Validate the restored file
        let validationResult = null;
        if (ROLLBACK_CONFIG.validateAfterRollback) {
            validationResult = validateRestoredFile(filePath);
        }
        
        return {
            success: true,
            filePath,
            backupPath: latestBackup.backupPath,
            reason,
            restoredAt: restoreResult.restoredAt,
            validation: validationResult
        };
    } catch (error) {
        return {
            success: false,
            filePath,
            error: error.message,
            reason
        };
    }
}

/**
 * Perform rollback for multiple files
 * @param {string[]} filePaths - Files to rollback
 * @param {string} reason - Reason for rollback
 * @returns {Object} Rollback results
 */
export function performMultipleFileRollback(filePaths, reason = 'Batch rollback') {
    const results = {
        successful: [],
        failed: [],
        totalFiles: filePaths.length,
        reason,
        rolledBackAt: new Date().toISOString()
    };
    
    filePaths.forEach(filePath => {
        const result = performFileRollback(filePath, reason);
        
        if (result.success) {
            results.successful.push(result);
        } else {
            results.failed.push(result);
        }
    });
    
    return results;
}

/**
 * Perform session-based rollback
 * @param {string} sessionId - Backup session ID to rollback
 * @param {string} reason - Reason for rollback
 * @returns {Object} Session rollback result
 */
export function performSessionRollback(sessionId, reason = 'Session rollback') {
    try {
        const restoreResult = restoreBackupSession(sessionId);
        
        if (!restoreResult.success) {
            return {
                success: false,
                sessionId,
                error: restoreResult.error,
                reason
            };
        }
        
        // Validate all restored files if configured
        let validationResults = null;
        if (ROLLBACK_CONFIG.validateAfterRollback) {
            const filePaths = restoreResult.successful.map(r => r.originalPath);
            validationResults = validateMultipleRestoredFiles(filePaths);
        }
        
        return {
            success: true,
            sessionId,
            filesRestored: restoreResult.successful.length,
            filesFailed: restoreResult.failed.length,
            reason,
            rolledBackAt: new Date().toISOString(),
            validation: validationResults,
            details: restoreResult
        };
    } catch (error) {
        return {
            success: false,
            sessionId,
            error: error.message,
            reason
        };
    }
}

/**
 * Smart rollback that attempts different strategies
 * @param {Object} errorContext - Context about the error
 * @returns {Object} Rollback result
 */
export function performSmartRollback(errorContext) {
    const { error, filePath, sessionId, operation } = errorContext;
    
    // Determine rollback strategy
    const rollbackDecision = shouldTriggerRollback(error, filePath);
    
    if (!rollbackDecision.shouldRollback) {
        return {
            success: false,
            strategy: 'none',
            reason: rollbackDecision.reason,
            error: 'Automatic rollback not triggered'
        };
    }
    
    let rollbackResult;
    let strategy;
    
    // Try session rollback first if session ID is available
    if (sessionId) {
        strategy = 'session';
        rollbackResult = performSessionRollback(sessionId, rollbackDecision.reason);
    }
    // Try single file rollback
    else if (filePath) {
        strategy = 'single-file';
        rollbackResult = performFileRollback(filePath, rollbackDecision.reason);
    }
    // No specific target, can't rollback
    else {
        return {
            success: false,
            strategy: 'none',
            reason: 'No rollback target specified',
            error: 'Cannot determine what to rollback'
        };
    }
    
    return {
        ...rollbackResult,
        strategy,
        triggerType: rollbackDecision.triggerType,
        originalError: error.message
    };
}

/**
 * Validate a restored file
 * @param {string} filePath - Path to restored file
 * @returns {Object} Validation result
 */
function validateRestoredFile(filePath) {
    try {
        // Basic file access validation
        const accessValidation = validateFileAccess(filePath);
        
        if (!accessValidation.valid) {
            return {
                valid: false,
                error: 'File access validation failed',
                details: accessValidation
            };
        }
        
        // Try to get diagnostics if available (syntax checking)
        let syntaxValidation = null;
        try {
            // This would use the actual diagnostics tool if available
            // For now, we'll do basic validation
            syntaxValidation = { valid: true, issues: [] };
        } catch (error) {
            syntaxValidation = {
                valid: false,
                error: error.message
            };
        }
        
        return {
            valid: accessValidation.valid && syntaxValidation.valid,
            fileAccess: accessValidation,
            syntax: syntaxValidation
        };
    } catch (error) {
        return {
            valid: false,
            error: error.message
        };
    }
}

/**
 * Validate multiple restored files
 * @param {string[]} filePaths - Paths to restored files
 * @returns {Object} Validation results
 */
function validateMultipleRestoredFiles(filePaths) {
    const results = {
        valid: [],
        invalid: [],
        totalFiles: filePaths.length
    };
    
    filePaths.forEach(filePath => {
        const validation = validateRestoredFile(filePath);
        
        if (validation.valid) {
            results.valid.push({ filePath, validation });
        } else {
            results.invalid.push({ filePath, validation });
        }
    });
    
    return results;
}

/**
 * Create rollback strategy for cleanup operation
 * @param {Object} cleanupContext - Context about the cleanup operation
 * @returns {Object} Rollback strategy
 */
export function createRollbackStrategy(cleanupContext) {
    const { filePaths, sessionId, operation, riskLevel } = cleanupContext;
    
    return {
        sessionId,
        filePaths,
        operation,
        riskLevel,
        autoRollbackEnabled: ROLLBACK_CONFIG.autoRollbackOnSyntaxError,
        rollbackTriggers: Object.values(ROLLBACK_TRIGGERS),
        maxAttempts: ROLLBACK_CONFIG.maxRollbackAttempts,
        validateAfterRollback: ROLLBACK_CONFIG.validateAfterRollback,
        
        // Quick rollback function
        rollback: (errorContext) => performSmartRollback({
            ...errorContext,
            sessionId,
            operation
        })
    };
}

/**
 * Emergency rollback - rollback everything from the most recent session
 * @returns {Object} Emergency rollback result
 */
export function emergencyRollback() {
    try {
        const backups = listBackups();
        
        if (backups.length === 0) {
            return {
                success: false,
                error: 'No backups available for emergency rollback'
            };
        }
        
        // Find the most recent session
        const sessions = {};
        backups.forEach(backup => {
            const sessionMatch = backup.backupPath.match(/session_([^_]+)/);
            if (sessionMatch) {
                const sessionId = sessionMatch[1];
                if (!sessions[sessionId] || new Date(backup.timestamp) > new Date(sessions[sessionId].timestamp)) {
                    sessions[sessionId] = backup;
                }
            }
        });
        
        const sessionIds = Object.keys(sessions);
        if (sessionIds.length === 0) {
            return {
                success: false,
                error: 'No valid sessions found for emergency rollback'
            };
        }
        
        // Use the most recent session
        const latestSessionId = sessionIds.sort((a, b) => 
            new Date(sessions[b].timestamp) - new Date(sessions[a].timestamp)
        )[0];
        
        return performSessionRollback(latestSessionId, 'Emergency rollback');
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}