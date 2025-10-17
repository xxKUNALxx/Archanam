/**
 * Simple test script to verify file scanner functionality
 */

import { 
    scanForJSFiles, 
    scanForConsoleStatements, 
    scanForTestFunctions, 
    scanForDebuggingArtifacts,
    scanForDevImports 
} from './fileScanner.js';

/**
 * Test the file scanner with current project files
 */
export function testFileScanner() {
    try {
        // Test 1: Scan for JS/JSX files in src directory
        const jsFiles = scanForJSFiles('src');
        
        const results = {
            totalFiles: jsFiles.length,
            files: jsFiles,
            consoleStatements: 0,
            testFunctions: 0,
            debuggingArtifacts: 0,
            devImports: 0,
            fileAnalysis: []
        };
        
        // Test 2: Analyze each file for debugging code
        jsFiles.forEach(filePath => {
            try {
                const consoleStatements = scanForConsoleStatements(filePath);
                const testFunctions = scanForTestFunctions(filePath);
                const debuggingArtifacts = scanForDebuggingArtifacts(filePath);
                const devImports = scanForDevImports(filePath);
                
                results.consoleStatements += consoleStatements.length;
                results.testFunctions += testFunctions.length;
                results.debuggingArtifacts += debuggingArtifacts.length;
                results.devImports += devImports.length;
                
                if (consoleStatements.length > 0 || testFunctions.length > 0 || 
                    debuggingArtifacts.length > 0 || devImports.length > 0) {
                    results.fileAnalysis.push({
                        filePath,
                        consoleStatements,
                        testFunctions,
                        debuggingArtifacts,
                        devImports
                    });
                }
            } catch (error) {
                results.fileAnalysis.push({
                    filePath,
                    error: error.message
                });
            }
        });
        
        return results;
    } catch (error) {
        return {
            error: error.message,
            stack: error.stack
        };
    }
}

/**
 * Run the test and display results
 */
export function runScannerTest() {
    const results = testFileScanner();
    
    if (results.error) {
        return `❌ Scanner test failed: ${results.error}`;
    }
    
    let report = `📊 File Scanner Test Results\n`;
    report += `================================\n`;
    report += `Total JS/JSX files found: ${results.totalFiles}\n`;
    report += `Console statements found: ${results.consoleStatements}\n`;
    report += `Test functions found: ${results.testFunctions}\n`;
    report += `Debugging artifacts found: ${results.debuggingArtifacts}\n`;
    report += `Dev imports found: ${results.devImports}\n\n`;
    
    if (results.fileAnalysis.length > 0) {
        report += `Files with debugging code:\n`;
        report += `-------------------------\n`;
        
        results.fileAnalysis.forEach(analysis => {
            if (analysis.error) {
                report += `❌ ${analysis.filePath}: ${analysis.error}\n`;
            } else {
                report += `📁 ${analysis.filePath}\n`;
                if (analysis.consoleStatements.length > 0) {
                    report += `  Console statements: ${analysis.consoleStatements.length}\n`;
                }
                if (analysis.testFunctions.length > 0) {
                    report += `  Test functions: ${analysis.testFunctions.length}\n`;
                }
                if (analysis.debuggingArtifacts.length > 0) {
                    report += `  Debugging artifacts: ${analysis.debuggingArtifacts.length}\n`;
                }
                if (analysis.devImports.length > 0) {
                    report += `  Dev imports: ${analysis.devImports.length}\n`;
                }
                report += `\n`;
            }
        });
    } else {
        report += `✅ No debugging code found in any files!\n`;
    }
    
    return report;
}