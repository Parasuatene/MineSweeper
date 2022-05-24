// マスの情報を取得
var gridArray = document.querySelectorAll(".grid");
var mineInfoArray = Array(81).fill(0);
var isStart = true;

// .gridクラスの要素を配列として取得した後、二次元配列に変換し、返却する
function initGridArray() {
    let elms = document.querySelectorAll(".grid");
    let newArr = [];
    for (var i = 0; i < 9; i++) {
        let start = i*9;
        newArr.push(Array.from(elms).slice(start, start+8));
    }
    return newArr;
}

function getLeftCond(index) {
    return (index % 9 != 0);
};

function getRightCond(index) {
    return ((index + 1) % 9 != 0);
}

function getUpCond(index) {
    return (index - 9 >= 0);
}

function getDownCond(index) {
    return (index + 9 < mineInfoArray.length);
}

// 各マスにイベントを付与
play();
function play() {
    for (let i = 0; i < gridArray.length; i++) {
        gridArray[i].addEventListener("click", () => {
            // はじめのクリック時のみ呼び出す処理
            if (isStart) {
                console.log("start");
                setMines(i);
                isStart = false;
            }
            console.log(`index=${i}`);
        })
    }
};

// TODO: はじめにクリックした個所は取り除く処理を追記する
function createRandNum(index) {
    let filterIdxArr = () => {
        let filterArr = [index];
        if (getLeftCond(index)) { filterArr.push(index-1); }  // 左方向
        if (getRightCond(index)) { filterArr.push(index+1); }  // 右方向
        if (getUpCond(index)) { filterArr.push(index-9); }  // 上方向
        if (getDownCond(index)) { filterArr.push(index+9); }  // 下方向
        if (getLeftCond(index) && getUpCond(index)) { filterArr.push(index-10); }  // 左上方向
        if (getLeftCond(index) && getDownCond(index)) { filterArr.push(index+8); }  // 左下方向
        if (getRightCond(index) && getUpCond(index)) { filterArr.push(index-8); }  // 右上方向
        if (getRightCond(index) && getDownCond(index)) { filterArr.push(index+10); }  // 右下方向
        return filterArr;
    }

    console.log(index);
    console.log(filterIdxArr());
    // 0から80までが入った配列を作成。ただし、指定した値（filterIdx）は除外する。
    let arr = [...Array(81)].map((_, i) => i).filter(n => !filterIdxArr().includes(n) );
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
function calcMineCount(index) {
    const addCount = (idx) => {
        // 加算先が地雷でなければ＋1する
        if (mineInfoArray[idx] != "M") { mineInfoArray[idx] += 1; } 
    };

    // 加算処理
    if (getLeftCond(index)) { addCount(index-1) }  // 左方向
    if (getRightCond(index)) { addCount(index+1) }  // 右方向
    if (getUpCond(index)) { addCount(index-9) }  // 上方向
    if (getDownCond(index)) { addCount(index+9) }  // 下方向
    if (getLeftCond(index) && getUpCond(index)) { addCount(index-10); }  // 左上方向
    if (getLeftCond(index) && getDownCond(index)) { addCount(index+8); }  // 左下方向
    if (getRightCond(index) && getUpCond(index)) { addCount(index-8); }  // 右上方向
    if (getRightCond(index) && getDownCond(index)) { addCount(index+10); }  // 右下方向
};

function setMines(index) {
    let randArr = createRandNum(index);
    randArr.forEach(i => {
        mineInfoArray[i] = "M";
        calcMineCount(i);
    });
    setGridText();
};

function setGridText() {
    for (let i = 0; i < mineInfoArray.length; i++) {
        gridArray[i].textContent = mineInfoArray[i];
    }
};
