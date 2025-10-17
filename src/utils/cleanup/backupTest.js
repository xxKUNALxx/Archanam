/**
 * Simple test for backup and rollback functionality
 */

import { 
    createFileBackup, 
    createMultipleBackups, 
    listBackups, 
    validateFileAccess,
    createCleanupBackupStrategy 
} from './backupManager.js';

import { performFileRollback, performSmartRollback } from './rollbackManager.js';

/**
 * Test backup functionality
 */
export function testBackupSystem() {
    try {
        const results = {
            fileValidation: null,
            singleBackup: null,
            multipleBackups: null,
            backupList: null,
            rollbackTest: null,
            errors: []
        };
        
        // Test 1: File validation
        try {
            results.fileValidation = validateFileAccess('src/pages/AI.jsx');
        } catch (error) {
            results.errors.push(`File validation failed: ${error.message}`);
        }
        
        // Test 2: Single file backup
        try {
            results.singleBackup = createFileBackup('src/pages/AI.jsx');
        } catch (error) {
            results.errors.push(`Single backup failed: ${error.message}`);
        }
        
        // Test 3: Multiple file backup
        try {
            const testFiles = ['src/pages/AI.jsx', 'src/services/gemini.js'];
            results.multipleBackups = createMultipleBackups(testFiles);
        } catch (error) {
            results.errors.push(`Multiple backup failed: ${error.message}`);
        }
        
        // Test 4: List backups
        try {
            results.backupList = listBackups();
        } catch (error) {
            results.errors.push(`List backups failed: ${error.message}`);
        }
        
        // Test 5: Rollback test (if we have backups)
        if (results.singleBackup && results.singleBackup.success) {
            try {
                results.rollbackTest = performFileRollback('src/pages/AI.jsx', 'Test rollback');
            } catch (error) {
                results.errors.push(`Rollback test failed: ${error.message}`);
            }
        }
        
        return results;
    } catch (error) {
        return {
            error: error.message,
            stack: error.stack
        };
    }
}

/**
 * Test cleanup backup strategy
 */
export function testCleanupStrategy() {
    try {
        const testFiles = [
            'src/pages/AI.jsx',
            'src/pages/Booking.jsx', 
            'src/services/gemini.js',
            'src/services/razorpay.js'
        ];
        
        const strategy = createCleanupBackupStrategy(testFiles);
        
        return {
            strategy,
            canProceed: strategy.canProceed,
            backupCount: strategy.backupResults ? strategy.backupResults.successful.length : 0,
            sessionId: strategy.sessionId
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}

/**
 * Run backup system tests
 */
export function runBackupTests() {
    const basicTests = testBackupSystem();
    const strategyTest = testCleanupStrategy();
    
    let report = `🔒 Backup System Test Results\n`;
    report += `================================\n`;
    
    if (basicTests.error) {
        report += `❌ Basic tests failed: ${basicTests.error}\n`;
    } else {
        report += `📁 File Validation: ${basicTests.fileValidation?.valid ? '✅' : '❌'}\n`;
        report += `💾 Single Backup: ${basicTests.singleBackup?.success ? '✅' : '❌'}\n`;
        report += `📦 Multiple Backups: ${basicTests.multipleBackups?.successful?.length || 0} successful\n`;
        report += `📋 Backup List: ${basicTests.backupList?.length || 0} backups found\n`;
        report += `🔄 Rollback Test: ${basicTests.rollbackTest?.success ? '✅' : '❌'}\n`;
        
        if (basicTests.errors.length > 0) {
            report += `\n⚠️ Errors encountered:\n`;
            basicTests.errors.forEach(error => {
                report += `  - ${error}\n`;
            });
        }
    }
    
    report += `\n🛡️ Cleanup Strategy Test:\n`;
    if (strategyTest.error) {
        report += `❌ Strategy test failed: ${strategyTest.error}\n`;
    } else {
        report += `✅ Can proceed with cleanup: ${strategyTest.canProceed}\n`;
        report += `📦 Files backed up: ${strategyTest.backupCount}\n`;
        report += `🆔 Session ID: ${strategyTest.sessionId}\n`;
    }
    
    return report;
}