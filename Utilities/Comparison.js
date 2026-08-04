
class ComparisonUtil {

    // Missing Records
    static findMissingRecords(overviewMap, actualMap, sheetName) {

        const missingRecords = [];

        for (const [id, status] of actualMap) {

            if (!overviewMap.has(id)) {

                missingRecords.push({
                    id,
                    sheet: sheetName
                });

            }

        }

        return missingRecords;
    }

    // Status Mismatch
    static findStatusMismatch(overviewMap, actualMap, sheetName) {

        const mismatches = [];

        for (const [id, actualStatus] of actualMap) {

            if (!overviewMap.has(id))
                continue;

            const overviewStatus = overviewMap.get(id);

            // Ignore Accept -> Open
            if (
                overviewStatus.toLowerCase() === "accept" &&
                actualStatus.toLowerCase() === "open"
            ) {
                continue;
            }

            if (
                overviewStatus.toLowerCase() !==
                actualStatus.toLowerCase()
            ) {

                mismatches.push({

                    id,
                    sheet: sheetName,
                    overviewStatus,
                    actualStatus,
                    reason: "Status Mismatch"


                });

            }

        }

        return mismatches;
    }

    // Duplicate Records
    static findDuplicateRecords(actualMap, sheetName) {

        const seen = new Set();
        const duplicates = [];

        for (const [id] of actualMap) {

            if (seen.has(id)) {

                duplicates.push({

                    id,
                    sheet: sheetName

                });

            } else {

                seen.add(id);

            }

        }

        return duplicates;
    }

}

export default ComparisonUtil;


