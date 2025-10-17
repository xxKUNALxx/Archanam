/**
 * Backup Manager for Production Cleanup
 * Handles file backups, restoration, and safety mechanisms
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync, unlinkSync } from 'fs';
import { join, dirname, basename, extname } from 'path';

/**
 * Backup configuration
 */
const BACKUP_CONFIG = {
    backupDir: '.cleanup-backups',
    maxBackups: 10,
    timestampFormat: () => new Date().toISOString().replace(/[:.]/g, '-')
};

/**
 * Create backup directory if it doesn't exist
 */
function ensureBackupDirectory() {
    if (!existsSync(BACKUP_CONFIG.backupDir)) {
        mkdirSync(BACKUP_CONFIG.backupDir, { recursive: true });
    }
}

/**
 * Generate backup filename with timestamp
 * @param {string} originalPath - Original file path
 * @returns {string} Backup filename
 */
function generateBackupFilename(originalPath) {
    const timestamp = BACKUP_CONFIG.timestampFormat();
    const name = basename(originalPath, extname(originalPath));
    const ext = extname(originalPath);
    const relativePath = originalPath.replace(/[/\\]/g, '_').replace(/^src_/, '');
    
    return `${relativePath}_${timestamp}${ext}`;
}

/**
 * Create backup of a single file
 * @param {string} filePath - Path to file to backup
 * @returns {Object} Backup result with backup path and metadata
 */
export function createFileBackup(filePath) {
    try {
        ensureBackupDirectory();
        
        if (!existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        
        const backupFilename = generateBackupFilename(filePath);
        const backupPath = join(BACKUP_CONFIG.backupDir, backupFilename);
        
        // Copy file to backup location
        copyFileSync(filePath, backupPath);
        
        // Create metadata file
        const metadata = {
            originalPath: filePath,
            backupPath,
            timestamp: new Date().toISOString(),
            originalSize: statSync(filePath).size,
            checksum: generateFileChecksum(filePath)
        };
        
        const metadataPath = backupPath + '.meta.json';
        writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        
        return {
            success: true,
            originalPath: filePath,
            backupPath,
            metadataPath,
            metadata
        };
    } catch (error) {
        return {
            success: false,
            originalPath: filePath,
            error: error.message
        };
    }
}

/**
 * Create backups for multiple files
 * @param {string[]} filePaths - Array of file paths to backup
 * @returns {Object} Backup results for all files
 */
export function createMultipleBackups(filePaths) {
    const results = {
        successful: [],
        failed: [],
        totalFiles: filePaths.length,
        backupSession: BACKUP_CONFIG.timestampFormat()
    };
    
    filePaths.forEach(filePath => {
        const result = createFileBackup(filePath);
        
        if (result.success) {
            results.successful.push(result);
        } else {
            results.failed.push(result);
        }
    });
    
    // Create session manifest
    const manifestPath = join(BACKUP_CONFIG.backupDir, `session_${results.backupSession}.json`);
    writeFileSync(manifestPath, JSON.stringify(results, null, 2));
    
    return results;
}

/**
 * Restore file from backup
 * @param {string} backupPath - Path to backup file
 * @returns {Object} Restoration result
 */
export function restoreFromBackup(backupPath) {
    try {
        if (!existsSync(backupPath)) {
            throw new Error(`Backup file does not exist: ${backupPath}`);
        }
        
        const metadataPath = backupPath + '.meta.json';
        if (!existsSync(metadataPath)) {
            throw new Error(`Backup metadata not found: ${metadataPath}`);
        }
        
        const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
        const originalPath = metadata.originalPath;
        
        // Verify backup integrity
        const backupChecksum = generateFileChecksum(backupPath);
        if (backupChecksum !== metadata.checksum) {
            throw new Error('Backup file integrity check failed');
        }
        
        // Create backup of current file if it exists
        let currentFileBackup = null;
        if (existsSync(originalPath)) {
            currentFileBackup = createFileBackup(originalPath);
        }
        
        // Restore file
        copyFileSync(backupPath, originalPath);
        
        return {
            success: true,
            originalPath,
            backupPath,
            restoredAt: new Date().toISOString(),
            currentFileBackup
        };
    } catch (error) {
        return {
            success: false,
            backupPath,
            error: error.message
        };
    }
}

/**
 * Restore multiple files from a backup session
 * @param {string} sessionId - Backup session ID
 * @returns {Object} Restoration results
 */
export function restoreBackupSession(sessionId) {
    try {
        const manifestPath = join(BACKUP_CONFIG.backupDir, `session_${sessionId}.json`);
        
        if (!existsSync(manifestPath)) {
            throw new Error(`Backup session not found: ${sessionId}`);
        }
        
        const session = JSON.parse(readFileSync(manifestPath, 'utf8'));
        const results = {
            successful: [],
            failed: [],
            sessionId,
            totalFiles: session.successful.length
        };
        
        session.successful.forEach(backup => {
            const result = restoreFromBackup(backup.backupPath);
            
            if (result.success) {
                results.successful.push(result);
            } else {
                results.failed.push(result);
            }
        });
        
        return results;
    } catch (error) {
        return {
            success: false,
            sessionId,
            error: error.message
        };
    }
}

/**
 * List all available backups
 * @returns {Object[]} Array of backup information
 */
export function listBackups() {
    try {
        ensureBackupDirectory();
        
        const backups = [];
        const files = readdirSync(BACKUP_CONFIG.backupDir);
        
        files.forEach(file => {
            if (file.endsWith('.meta.json')) {
                const metadataPath = join(BACKUP_CONFIG.backupDir, file);
                const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
                
                backups.push({
                    ...metadata,
                    metadataFile: file,
                    backupExists: existsSync(metadata.backupPath)
                });
            }
        });
        
        // Sort by timestamp (newest first)
        backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return backups;
    } catch (error) {
        return [];
    }
}

/**
 * List backup sessions
 * @returns {Object[]} Array of session information
 */
export function listBackupSessions() {
    try {
        ensureBackupDirectory();
        
        const sessions = [];
        const files = readdirSync(BACKUP_CONFIG.backupDir);
        
        files.forEach(file => {
            if (file.startsWith('session_') && file.endsWith('.json')) {
                const sessionPath = join(BACKUP_CONFIG.backupDir, file);
                const session = JSON.parse(readFileSync(sessionPath, 'utf8'));
                
                sessions.push({
                    sessionId: session.backupSession,
                    totalFiles: session.totalFiles,
                    successful: session.successful.length,
                    failed: session.failed.length,
                    sessionFile: file
                });
            }
        });
        
        return sessions;
    } catch (error) {
        return [];
    }
}

/**
 * Clean up old backups (keep only maxBackups)
 * @returns {Object} Cleanup results
 */
export function cleanupOldBackups() {
    try {
        const backups = listBackups();
        const sessions = listBackupSessions();
        
        const results = {
            backupsRemoved: 0,
            sessionsRemoved: 0,
            errors: []
        };
        
        // Remove old individual backups
        if (backups.length > BACKUP_CONFIG.maxBackups) {
            const toRemove = backups.slice(BACKUP_CONFIG.maxBackups);
            
            toRemove.forEach(backup => {
                try {
                    if (existsSync(backup.backupPath)) {
                        unlinkSync(backup.backupPath);
                    }
                    const metadataPath = join(BACKUP_CONFIG.backupDir, backup.metadataFile);
                    if (existsSync(metadataPath)) {
                        unlinkSync(metadataPath);
                    }
                    results.backupsRemoved++;
                } catch (error) {
                    results.errors.push(`Failed to remove backup ${backup.backupPath}: ${error.message}`);
                }
            });
        }
        
        // Remove old sessions
        if (sessions.length > BACKUP_CONFIG.maxBackups) {
            const sessionsToRemove = sessions.slice(BACKUP_CONFIG.maxBackups);
            
            sessionsToRemove.forEach(session => {
                try {
                    const sessionPath = join(BACKUP_CONFIG.backupDir, session.sessionFile);
                    if (existsSync(sessionPath)) {
                        unlinkSync(sessionPath);
                        results.sessionsRemoved++;
                    }
                } catch (error) {
                    results.errors.push(`Failed to remove session ${session.sessionId}: ${error.message}`);
                }
            });
        }
        
        return results;
    } catch (error) {
        return {
            backupsRemoved: 0,
            sessionsRemoved: 0,
            errors: [error.message]
        };
    }
}

/**
 * Validate file permissions and access
 * @param {string} filePath - Path to validate
 * @returns {Object} Validation result
 */
export function validateFileAccess(filePath) {
    try {
        // Check if file exists
        if (!existsSync(filePath)) {
            return {
                valid: false,
                error: 'File does not exist',
                canRead: false,
                canWrite: false
            };
        }
        
        // Test read access
        let canRead = false;
        try {
            readFileSync(filePath, 'utf8');
            canRead = true;
        } catch (error) {
            // Read failed
        }
        
        // Test write access by attempting to write to a temp file
        let canWrite = false;
        try {
            const tempPath = filePath + '.temp';
            writeFileSync(tempPath, 'test');
            unlinkSync(tempPath);
            canWrite = true;
        } catch (error) {
            // Write failed
        }
        
        return {
            valid: canRead && canWrite,
            canRead,
            canWrite,
            path: filePath,
            size: statSync(filePath).size
        };
    } catch (error) {
        return {
            valid: false,
            error: error.message,
            canRead: false,
            canWrite: false
        };
    }
}

/**
 * Validate multiple files
 * @param {string[]} filePaths - Array of file paths to validate
 * @returns {Object} Validation results
 */
export function validateMultipleFiles(filePaths) {
    const results = {
        valid: [],
        invalid: [],
        totalFiles: filePaths.length
    };
    
    filePaths.forEach(filePath => {
        const validation = validateFileAccess(filePath);
        
        if (validation.valid) {
            results.valid.push(validation);
        } else {
            results.invalid.push(validation);
        }
    });
    
    return results;
}

/**
 * Generate simple checksum for file integrity
 * @param {string} filePath - Path to file
 * @returns {string} Simple checksum
 */
function generateFileChecksum(filePath) {
    const content = readFileSync(filePath, 'utf8');
    let hash = 0;
    
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(16);
}

/**
 * Create a complete backup strategy for cleanup operation
 * @param {string[]} filePaths - Files to be modified
 * @returns {Object} Backup strategy result
 */
export function createCleanupBackupStrategy(filePaths) {
    // Validate all files first
    const validation = validateMultipleFiles(filePaths);
    
    if (validation.invalid.length > 0) {
        return {
            success: false,
            error: 'Some files cannot be accessed',
            invalidFiles: validation.invalid
        };
    }
    
    // Create backups for all files
    const backupResults = createMultipleBackups(filePaths);
    
    // Clean up old backups
    const cleanupResults = cleanupOldBackups();
    
    return {
        success: backupResults.failed.length === 0,
        backupResults,
        cleanupResults,
        sessionId: backupResults.backupSession,
        canProceed: backupResults.failed.length === 0
    };
}