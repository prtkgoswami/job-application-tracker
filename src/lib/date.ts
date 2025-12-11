export const getDateString = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear()
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`
}

export const getDateInputString = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear()
    const d = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    return d
}

export const getDifferenceFromNow = (date: Date) => {
    const target = date.getTime();
    const now = Date.now();

    return now - target;
}