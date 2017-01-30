const path = require('path')
window.onload = () => {

  function traverseFileTree(item, path) {
  path = path || "";
  if (item.isFile) {
    // Get file
    item.file(function(file) {
      console.log("File:", path + file.name);
    });
  } else if (item.isDirectory) {
    // Get folder contents
    var dirReader = item.createReader();
    dirReader.readEntries(function(entries) {
      for (var i=0; i<entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + "/");
      }
    });
  }
}

    var dropzone = document.getElementById('dropzone');
    dropzone.ondrop = function(e) {

        console.log("File dropped:", e.dataTransfer.files[0].path)
        var items = event.dataTransfer.items;
        for (var i=0; i<items.length; i++) {
          // webkitGetAsEntry is where the magic happens
          var item = items[i].webkitGetAsEntry();
          if (item) {
            traverseFileTree(item);
          }
        }
    };

    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault()
    }

    document.body.ondrop = (ev) => {
        ev.preventDefault()
    }

}
