// マスの情報を取得
var gridArray = initGridArray();
var mineInfoArray = initMineInfoArray();
var isCheckedArray = initIsCheckedArray();
var isStart = true;
var totalMine = 10;
const SEARCH_ROOT = [
    [0, 1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [0, -1]
];
var count = gridArray.length;

// .gridクラスの要素を配列として取得した後、二次元配列に変換し、返却する
function initGridArray() {
    let elms = document.querySelectorAll(".grid");
    let newArr = [];
    for (var i = 0; i < 9; i++) {
        let start = i*9;
        newArr.push(Array.from(elms).slice(start, start+9));
    }
    return newArr;
}

function initMineInfoArray() {
    let arr = Array(9);
    for (var i = 0; i < arr.length; i++) { arr[i] = Array(9).fill(0); }
    return arr;
}

function initIsCheckedArray() {
    let arr = Array(9);
    for (var i = 0; i < arr.length; i++) { arr[i] = Array(9).fill(false); }
    return arr;
}

// 各マスにイベントを付与
play();
function play() {
    for (let y = 0; y < gridArray.length; y++) {
        for (let x = 0; x < gridArray[y].length; x++) {
            gridArray[y][x].addEventListener("click", () => {
                if (isStart) {
                    // はじめのクリック時のみ呼び出す処理
                    setMines(x, y);
                    isStart = false;
                }
                search(x, y);

                // 残りマスが地雷と同じ数になった時点でゲーム終了処理に移る
                if (count == totalMine) {
                    gameResult("SUCCESS");
                }
            })
        }
    }
};

// ゲームのリザルト処理
function gameResult(status) {
    if (status == "SUCCESS") {
        alert("ゲームクリア");
    } else if (status == "FAILURE") {
        alert("ゲームオーバーです");
    }
    checkAllGrid();
}

function checkAllGrid() {
    for (var i = 0; i < isCheckedArray.length; i++) {
        for (var j = 0; j < isCheckedArray[i].length; j++) {
            isCheckedArray[j][i] = true;
        }
    }
}

// クリックした個所が地雷か否か確認する
function isMineJudge(x, y) {
    if (mineInfoArray[y][x] == "M") { return true; }
    return false;
}

// 地雷の探索処理
function search(x, y) {
    // 地雷でないとき
    if (!isCheckedArray[y][x]) {
        count -= 1;
        // 周囲の地雷数が0のとき
        if (mineInfoArray[y][x] == 0) {
            setGridClass(x, y);
            checkGrid(x, y);
            SEARCH_ROOT.forEach(root => {
                let i = root[0];
                let j = root[1];
                if ((x+j) >= 0 && (y+i) >= 0 && (x+j) < 9 && (y+i) < 9) {
                    search(x+j, y+i);
                }
            });
        } else {
            setGridClass(x, y);
            checkGrid(x, y);
            if (mineInfoArray[y][x] == "M") {
                gameResult("FAILURE");
                return;
            } else {
                return;
            }
        }
    }
}

// 地雷のセット処理
function setMines(x, y) {
    let coordArray = createRandCoord(x, y);
    coordArray.forEach(coord => {
        let coord_y = coord[1];
        let coord_x = coord[0];
        mineInfoArray[coord_y][coord_x] = "M";
        calcMineCount(coord_x, coord_y);
    });
};

// TODO: はじめにクリックした個所は取り除く処理を追記する
function createRandCoord(x, y) {
    // クリックした座標の周囲6方向のインデックスを取得
    const removeNums = () => {
        let rmArr = [];
        for (let i=-1; i<=1; i++) {
            for (let j=-1; j<=1; j++) {
                if ((x+j) >= 0 && (y+i) >= 0 && (x+j) < 9 && (y+i) < 9) {
                    rmArr.push( (x + j) + (y + i) * 9 );
                }
            }
        }
        return rmArr;
    };

    // 0から80までが入った配列を作成。ただし、指定した値（filterIdx）は除外する。
    let arr = [...Array(81)].map((_, i) => i).filter(n => !removeNums().includes(n) );
    let arrLen = arr.length;

    // ランダムソート
    for (let i=0; i < arrLen; i++) {
        let j = Math.floor(Math.random() * arrLen);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    // x座標、y座標の形式に変換する
    const convertCoord = () => { 
        let randNum = arr.slice(0, totalMine);
        let coord = [];
        randNum.forEach(num => {
            coord.push([num % 9, Math.floor(num / 9)]);
        });
        return coord;
    }

    return convertCoord();
};

// TODO: 後ほどリファクタリングを行う
function calcMineCount(x, y) {
    for (let i=-1; i<=1; i++) {
        for (let j=-1; j<=1; j++) {
            if ((x+j) >= 0 && (y+i) >= 0 && (x+j) < 9 && (y+i) < 9) {
                if (mineInfoArray[y+i][x+j] != "M") {
                    mineInfoArray[y+i][x+j] += 1;
                }
            }
        }
    }
};

// グリッドの情報を追加する処理
function setGridClass(x, y) {
    gridArray[y][x].classList.add("type-" + mineInfoArray[y][x]);  // クラス情報を付与
    gridArray[y][x].classList.add("checked");  // クラス情報を付与
};

function checkGrid(x, y) {
    isCheckedArray[y][x] = true;
    gridArray[y][x].classList.remove("grid");
    if (mineInfoArray[y][x] != 0) { gridArray[y][x].textContent = mineInfoArray[y][x]; }
}
