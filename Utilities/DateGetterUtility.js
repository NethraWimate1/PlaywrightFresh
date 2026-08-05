class DateGetterUtility {
    static async getPreviousDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}
}
export default DateGetterUtility;
