// マスの情報を取得
var gridArray = document.querySelectorAll(".grid");
var mineInfoArray = Array(81).fill(0);

// TODO: はじめにクリックした個所は取り除く処理を追記する
const createRandNum = () => {
    // 0から80までが入った配列を定義
    let arr = [...Array(81)].map((_, i) => i);
    let arrLen = arr.length;

    // ランダムソート
    for (let i=0; i < arrLen; i++) {
        let j = Math.floor(Math.random() * arrLen);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    // 前から10個取得し返却する
    return arr.slice(0, 10);
};

// TODO: 後ほどリファクタリングを行う
const calcMineCount = (index) => {
    const addCount = (idx) => {
        // 加算先が地雷でなければ＋1する
        if (mineInfoArray[idx] != "M") { mineInfoArray[idx] += 1; } 
    };

    let leftCond = (index % 9 != 0);
    let rightCond = ((index + 1) % 9 != 0);
    let upCond = (index - 9 >= 0);
    let downCond = (index + 9 < mineInfoArray.length);

    // 加算処理
    if (leftCond) { addCount(index-1) }  // 左方向
    if (rightCond) { addCount(index+1) }  // 右方向
    if (upCond) { addCount(index-9) }  // 上方向
    if (downCond) { addCount(index+9) }  // 下方向
    if (leftCond && upCond) { addCount(index-10); }  // 左上方向
    if (leftCond && downCond) { addCount(index+8); }  // 左下方向
    if (rightCond && upCond) { addCount(index-8); }  // 右上方向
    if (rightCond && downCond) { addCount(index+10); }  // 右下方向
};

const setMines = () => {
    let randArr = createRandNum();
    randArr.forEach(i => {
        mineInfoArray[i] = "M";
        calcMineCount(i);
    });
};

const setGridText = () => {
    for (let i = 0; i < mineInfoArray.length; i++) {
        gridArray[i].textContent = mineInfoArray[i];
    }
}


setMines();
console.log(mineInfoArray);
setGridText();
