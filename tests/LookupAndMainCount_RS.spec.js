import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ReportStudioPage } from '../pages/ReportStudioPage';
import { DashboardPage } from '../pages/DashboardPage';
import MailUtil from '../Utilities/MailUtil';

test('Combined Lookup and Main Count Validation', async ({ browser }) => {

    test.setTimeout(0);

    const allReportRows = [];
    const failures = [];

    // Run validation for one customer/account
    async function validateCounts(config) {
        const page = await browser.newPage();

        try {
            const loginPage = new LoginPage(page);
            const reportStudioPage = new ReportStudioPage(page);
            const dashboardPage = new DashboardPage(page);

            // Login
            await loginPage.navigate();
            await loginPage.login(
                config.username,
                config.password
            );

            await dashboardPage.openReportStudio();
            await expect(page).toHaveURL(/reportStudio/);

            // Open Main saved query
            await reportStudioPage.clickHamburguerMenu();
            await reportStudioPage.clickSavedQueryButton();
            await reportStudioPage.savedQueryPageValidation();
            await reportStudioPage.searchSavedQueryAndClick(
                config.mainQuery
            );

           /* await expect(
                page.getByText(
                    'Loading… please enjoy this virtual cup of coffee! ☕'
                )
            ).toBeHidden();*/
            const loader = page.getByText('Loading… please enjoy this virtual cup of coffee! ☕');
await loader.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
await loader.waitFor({ state: 'hidden' });

            const mainCounts = {};

            for (const form of config.forms) {
                mainCounts[form] =
                    await reportStudioPage.getCountOfRecords(form);
            }

            // Open Lookup saved query
            await reportStudioPage.clickHamburguerMenu();
            await reportStudioPage.clickSavedQueryButton();
            await reportStudioPage.savedQueryPageValidation();
            await reportStudioPage.searchSavedQueryAndClick(
                config.lookupQuery
            );

           /* await expect(
                page.getByText(
                    'Loading… please enjoy this virtual cup of coffee! ☕'
                )
            ).toBeHidden();*/
            const loader2 = page.getByText('Loading… please enjoy this virtual cup of coffee! ☕');
await loader2.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
await loader2.waitFor({ state: 'hidden' });

            const lookupCounts = {};

            for (const form of config.forms) {
                lookupCounts[form] =
                    await reportStudioPage.getCountOfRecords(form);
            }

            // Collect report rows and mismatches
            for (const form of config.forms) {
                const main = mainCounts[form];
                const lookup = lookupCounts[form];
                const isMatch = main === lookup;

                allReportRows.push({
                    name: `${config.name} - ${form}`,
                    content:
                        `Main: ${main} | Lookup: ${lookup} | ` +
                        `${isMatch ? 'No Mismatch' : 'Mismatch'}`
                });

                if (!isMatch) {
                    failures.push(
                        `${config.name} - ${form}: ` +
                        `Main=${main}, Lookup=${lookup}`
                    );
                }
            }

        } finally {
            await page.close();
        }
    }

    // All three account configurations
    const configurations = [
        {
            name: 'BNB',
            username: process.env.Uname,
            password: process.env.PASSWORD,
            mainQuery: 'WebComplaint Main Record',
            lookupQuery: 'WebComplaint_Yesterday_data',
            forms: [
                'Web Complaint',
                'Work Order',
                'General Tasks',
                'Ticket Overview Form',
                'Task and PPM Activity'
            ]
        },
        {
            name: 'Climaveneta',
            username: process.env.UnameClimaveneta,
            password: process.env.PASSWORDClimaveneta,
            mainQuery: 'Web Complaint_Main',
            lookupQuery: 'WebComplaint_Lookup',
            forms: [
                'Web Complaint',
                'Work Order',
                'Task'
            ]
        },
        {
            name: 'ParyAI',
            username: process.env.paryaaUnameClimaveneta,
            password: process.env.paryaaPASSWORDClimaveneta,
            mainQuery: 'Main',
            lookupQuery: 'Lookupcount',
            forms: [
                'ParyAI Expenses'
            ]
        }
    ];

    // Execute all validations sequentially
    for (const config of configurations) {
        try {
            await validateCounts(config);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error);

            failures.push(
                `${config.name} validation failed: ${errorMessage}`
            );

            allReportRows.push({
                name: `${config.name} - Validation Error`,
                content: errorMessage
            });
        }
    }

    // Send ONE email containing all three reports
    await MailUtil.sendReport(
        'BNB, Climaveneta & ParyAI - Lookup and Main Count',
        'Combined Validation Report',
        allReportRows
    );

    // Fail the test after sending the report if anything mismatched
    // or any account validation failed.
    expect(
        failures,
        failures.length
            ? failures.join('\n')
            : 'All lookup and main counts match.'
    ).toEqual([]);
});
