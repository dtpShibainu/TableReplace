// 選択した表に対して行方向への流し込みをするスクリプト
// 表と単語の数が合わない場合にはアラート表示から中止になります
// 2023.1012 完成
app.doScript(main, ScriptLanguage.JAVASCRIPT, [], UndoModes.FAST_ENTIRE_SCRIPT);

function main() {
//  var LF = String.fromCharCode(10); // 改行
//  var CR = String.fromCharCode(13); // 改行
  var TAB = String.fromCharCode(9); // タブ
  var CR = String.fromCharCode(0x0D); //改行
  var mySelection = app.activeDocument.selection;

  if (mySelection.length === 1) {
    var tblObj = mySelection[0];
    var clipAry = new Array();
    var myDoc = app.activeDocument;
    var txtfrmObj = myDoc.textFrames.add();
    txtfrmObj.visibleBounds = ["0cm", "0cm", "18cm", "21cm"];
    txtfrmObj.contents = "ダミー";
    app.selection = txtfrmObj.characters.itemByRange(0, -1);
    app.paste();
    while (txtfrmObj.characters[-1].contents == CR) {
      txtfrmObj.characters[-1].remove(); // 最後の改行を削除
      var clipstr = "" + txtfrmObj.contents;
    }

    var clipstr = txtfrmObj.contents;

    if (clipstr !== "") {
      var tblRows = tblObj.rows.length;
      var tblCols = tblObj.columns.length;
      var wordCount = clipstr.split(/\r+/).length; // クリップボードの単語数を数える
      var selectedCellCount = tblObj.cells.length; // 選択しているセルの数

      if (wordCount > selectedCellCount) {
        alert("クリップボードの単語数が表のセル数を超えています。");
      } else {
        try {
          var colIdx = 0; // 選択した列のインデックスを初期化
          var rowIdx = 0; // 選択した行のインデックスを初期化
          var clipAry = clipstr.split(CR);

          for (var iCol = 0; iCol < tblCols; iCol++) {
            var cell = tblObj.cells[rowIdx * tblCols + iCol];
            if (cell.contents === "ダミー") { // "ダミー"が見つかった場合、位置を設定してループを抜ける
              colIdx = iCol;
              break;
            }
          }

          for (var i = 0; i < clipAry.length; i++) {
            var targetColIdx = (colIdx + i) % tblCols;
            tblObj.cells[rowIdx * tblCols + targetColIdx].contents = clipAry[i];
            if (targetColIdx === tblCols - 1) {
              rowIdx++; // 次の行に移動
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
