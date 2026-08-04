import ExcelJS from 'exceljs';

class ReportUtil {

    static async generateReport(
        missingGT,
        mismatchGT,
        missingWO,
        mismatchWO
    ) {

        const workbook = new ExcelJS.Workbook();

        // Summary Sheet
        const summary = workbook.addWorksheet("Summary");

        summary.addRow(["Validation", "Count"]);
        summary.addRow(["Missing General Tasks", missingGT.length]);
        summary.addRow(["Mismatch General Tasks", mismatchGT.length]);
        summary.addRow(["Missing Work Orders", missingWO.length]);
        summary.addRow(["Mismatch Work Orders", mismatchWO.length]);

        // Missing Records Sheet
        const missingSheet = workbook.addWorksheet("Missing Records");

        missingSheet.addRow(["Ticket ID", "Sheet"]);

        [...missingGT, ...missingWO].forEach(item => {
            missingSheet.addRow([
                item.id,
                item.sheet
            ]);
        });

        // Status Mismatch Sheet
        const mismatchSheet = workbook.addWorksheet("Status Mismatch");

        mismatchSheet.addRow([
            "Ticket ID",
            "Sheet",
            "Ticket Overview Status",
            "Actual Status"
        ]);

        [...mismatchGT, ...mismatchWO].forEach(item => {

            mismatchSheet.addRow([
                item.id,
                item.sheet,
                item.overviewStatus,
                item.actualStatus
            ]);

        });

        await workbook.xlsx.writeFile(
            "reports/Validation_Report.xlsx"
        );

        console.log("Validation report generated successfully.");
    }
}

export default ReportUtil;