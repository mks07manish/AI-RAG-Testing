import fs from 'node:fs';
import path from 'node:path';

class RagJsonReporter {
    constructor(options = {}) {
        this.outputFile =
            options.outputFile || 'reports/rag-test-report.json';

        this.results = [];
        this.startTime = 0;
    }

    onBegin(config, suite) {
        this.startTime = Date.now();
        this.totalTests = suite.allTests().length;
    }

    async onTestEnd(test, result) {
        let metrics = {};

        // Read the RAG metrics attached by the test.
        const attachment = result.attachments.find(
            item => item.name === 'rag-metrics'
        );

        if (attachment) {
            try {
                let content;

                if (attachment.body) {
                    content = attachment.body.toString('utf8');
                } else if (attachment.path) {
                    content = await fs.promises.readFile(
                        attachment.path,
                        'utf8'
                    );
                }

                if (content) {
                    metrics = JSON.parse(content);
                }
            } catch (error) {
                metrics = {
                    metricsReadError: error.message
                };
            }
        }

        const errors = result.errors.map(error => ({
            message: error.message || 'Unknown test error',
            stack: error.stack || null
        }));

        this.results.push({
            testId: test.title.match(/RAG-\d+/)?.[0] || null,
            title: test.title,
            file: test.location.file,
            line: test.location.line,
            status: result.status,
            durationMs: result.duration,
            retry: result.retry,
            metrics,
            errors
        });
    }

    async onEnd(result) {
        const passed = this.results.filter(
            item => item.status === 'passed'
        ).length;

        const failed = this.results.filter(
            item => item.status === 'failed'
        ).length;

        const skipped = this.results.filter(
            item => item.status === 'skipped'
        ).length;

        const interrupted = this.results.filter(
            item => item.status === 'interrupted'
        ).length;

        const report = {
            project: 'AI-RAG-TestBench',
            generatedAt: new Date().toISOString(),
            durationMs: Date.now() - this.startTime,
            summary: {
                total: this.results.length,
                passed,
                failed,
                skipped,
                interrupted,
                passRate: this.results.length
                    ? Number(
                        ((passed / this.results.length) * 100).toFixed(2)
                    )
                    : 0,
                playwrightRunStatus: result.status
            },
            tests: this.results
        };

        const outputPath = path.resolve(this.outputFile);

        await fs.promises.mkdir(path.dirname(outputPath), {
            recursive: true
        });

        await fs.promises.writeFile(
            outputPath,
            JSON.stringify(report, null, 2),
            'utf8'
        );

        console.log(`\nRAG JSON report saved: ${outputPath}`);
        console.log(
            `Total: ${report.summary.total} | ` +
            `Passed: ${passed} | Failed: ${failed} | ` +
            `Skipped: ${skipped}`
        );
    }
}

export default RagJsonReporter;