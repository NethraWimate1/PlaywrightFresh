import ExcelJS from 'exceljs';

class ExcelUtility {

    static async readExcelFile(filePath, sheetName, idHeader, statusHeader) {

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(sheetName);

        const headerRow = worksheet.getRow(1);

        let idColumn = -1;
        let statusColumn = -1;

        headerRow.eachCell((cell, colNumber) => {
            const value = cell.text.trim();

            if (value === idHeader) {
                idColumn = colNumber;
            }

            if (value === statusHeader) {
                statusColumn = colNumber;
            }
        });

        if (idColumn === -1 || statusColumn === -1) {
            throw new Error(
                `Headers not found in sheet '${sheetName}'. ` +
                `ID='${idHeader}', Status='${statusHeader}'`
            );
        }

        const dataMap = new Map();

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const id = row.getCell(idColumn).text.trim();
            const status = row.getCell(statusColumn).text.trim();

            dataMap.set(id, status);
        });

        return dataMap;
    }
}

export default ExcelUtility;