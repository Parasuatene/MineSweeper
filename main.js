// マスの情報を取得
var gridArray = document.querySelectorAll(".grid");
// console.log(gridArray);

// TODO: はじめにクリックした個所は取り除く処理を追記する
const createRandNum = () => {
    // 0から80までが入った配列を定義
    let arr = [...Array(81)].map((_, i) => i);
    let arrLen = arr.length;

    // ランダムソート
    for (let i=0; i < arrLen; i++) {
        let j = Math.floor(Math.random() *  arrLen);
        let t = arr[--arrLen];
        arr[arrLen] = arr[j];
        arr[j] = t;
    }
    
    // 前から10個取得し返却する
    return arr.slice(0, 10);
};

const setMines = () => {
    let randArr = createRandNum();
    randArr.forEach(i => {
        gridArray[i].textContent = "Mine";  // ひとまず地雷箇所には文字列を代入
    });
};

setMines();
