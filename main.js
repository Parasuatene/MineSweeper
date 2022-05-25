// マスの情報を取得
var gridArray = initGridArray();
var mineInfoArray = initMineInfoArray();
var isStart = true;

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

// 各マスにイベントを付与
play();
function play() {
    for (let y = 0; y < gridArray.length; y++) {
        for (let x = 0; x < gridArray[y].length; x++) {
            gridArray[y][x].addEventListener("click", () => {
                // はじめのクリック時のみ呼び出す処理
                if (isStart) {
                    setMines(x, y);
                    isStart = false;
                }
                setGridText();
            })
        }
    }
};

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
        let randNum = arr.slice(0, 10);
        let coord = [];
        randNum.forEach(num => {
            coord.push([num % 9, Math.floor(num / 9)]);
        });
        console.log(coord);
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

function setGridInfo() {
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            gridArray[j][i].classList.add("type-" + mineInfoArray[j][i]);  // クラス情報を付与
            gridArray[j][i].textContent = mineInfoArray[j][i];
        }
    }
};
