export function isEmpty(obj: Object | null) {
    if (
        obj === '' ||
        obj === undefined ||
        obj === 'undefined' ||
        obj === null
    ) {
        return true;
    } else {
        return false;
    }
}

//현재 년월까지의 list 가져오기 ex : ['202001', '202002', '202003', ..., 현재]
export const lessEqualNowYearMonthArray = (() => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let result = [];

    for (let index = 1; index <= month; index++) {
        let formedMonth = String(index).length === 2 ? index : `0${index}`;
        result.push(`${year}${formedMonth}`);
    }

    return result;
})();

//현재 년월 String 가져오기 ex : '202007'
export const nowYearMonthString = (() => {
    return lessEqualNowYearMonthArray[lessEqualNowYearMonthArray.length - 1];
})();

//타겟 문자열에 문자 끼워넣기
export const insertAt = (target: string, index: number, string: string) => {
    return target.substr(0, index) + string + target.substr(index);
};
