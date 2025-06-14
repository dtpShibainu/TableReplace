//選択した表に対して列方向への流し込みをするスクリプト
//表と単語の数が合わない場合にはアラート表示から中止になります
//2023.0418 完成
app.doScript(main, ScriptLanguage.JAVASCRIPT, [], UndoModes.FAST_ENTIRE_SCRIPT);

function main() {
  var CR = String.fromCharCode(13); //改行
  var TAB = String.fromCharCode(9); //タブ
  var mySelection = app.selection;

  if (mySelection.length === 1) {
    var tblObj = mySelection[0];
    var clipAry = new Array();
    var myDoc = app.activeDocument;
    var txtfrmObj = myDoc.textFrames.add();
    txtfrmObj.visibleBounds = ["0cm", "0cm", "18cm", "21cm"];
    txtfrmObj.contents = "ダミー";
    app.selection = txtfrmObj.characters.itemByRange(0, -1);
    app.paste();

    while (txtfrmObj.characters[-1].contents === CR) {
      txtfrmObj.characters[-1].remove(); //最後の改行を削除
    }

    var clipstr = txtfrmObj.contents;

    if (clipstr !== "") {
      var tblRows = tblObj.rows.length;
      var tblCols = tblObj.columns.length;
      var wordCount = clipstr.split(/\s+/).length; // クリップボードの単語数を数える
      var selectedCellCount = tblObj.cells.length; // 選択しているセルの数

      if (wordCount > selectedCellCount) {
        alert("クリップボードの単語数が表のセル数を超えています。");
      } else {
        try {
          var colIdx = 0; // 選択した列のインデックスを初期化
          var rowIdx = 0; // 選択した行のインデックスを初期化
          var clipAry = clipstr.split(CR);

          for (var iRow = 0; iRow < tblRows; iRow++) {
            var cell = tblObj.cells[iRow * tblCols];
            if (cell.contents === "ダミー") {
              // "ダミー"が見つかった場合、位置を設定してループを抜ける
              rowIdx = iRow;
              break;
            }
          }

          for (var i = 0; i < clipAry.length; i++) {
            var targetRowIdx = (rowIdx + i) % tblRows;
            tblObj.cells[targetRowIdx * tblCols + colIdx].contents = clipAry[i];
            if (targetRowIdx === tblRows - 1) {
              colIdx++; // 次の列に移動
            }
          }
        } catch (e) {
          alert("表組みへの流し込み中にエラーが発生しました。\r" + e);
        }
      }
    } else {
      alert("クリップボードの内容がありません。");
    }

    txtfrmObj.remove();
  } else {
    alert("選択された範囲が正しくありません。");
  }
}