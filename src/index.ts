/*************************************************
 * Copyright (c) 2023.
 * Author: Cyrusky <bo.jin@borgor.cn>
 *************************************************/
import fs from "hexo-fs";
import path from "path";

const base_dir = path.join(hexo.source_dir, "_posts");

const fileList = fs
  .listDirSync(base_dir, {
    ignorePattern: /node_modules/,
  })
  .filter((each) => each && /\.md$/.test(each))
  .map((each) => {
    let array = (each + "").split(path.sep);
    // For Windows
    if (path.sep === "\\") {
      each = each.replace(new RegExp("\\" + path.sep, "g"), "/");
    }
    return {
      fileNameExt: array.length === 0 ? "" : array[array.length - 1],
      filePath: each,
      articleName: each.replace(/\.md$/, ""),
    };
  });

/**
 * md returns true
 * @param {*} data
 */
const ignore = (data) => {
  const source = data.source;
  const ext = source.substring(source.lastIndexOf(".")).toLowerCase();
  return ["md"].indexOf(ext) > -1;
};

function action(data) {
  let { content } = data;
  let result = content.match(/\[\[.*?]]/g);
  if (result && result.length > 0) {
    result.forEach((linkName: string) => {
      // {% post_link Ubuntu/ubuntu-enable-root 'Ubuntu Linux上启用root账户' %}
      let [realName, showName] = (linkName + "")
        .replace("[[", "")
        .replace("]]", "")
        .split("|");
      let anchor = null;
      [realName, anchor] = realName.split("#");

      let realNameExt = realName + ".md";
      let file = fileList.find((file) => file.fileNameExt === realNameExt);
      if (file) {
        // If the target article was found. then replace the backlink with 'post_link'
        // 检查 realName 是否为 :year-:month-:day-:title 格式
        let title = file.articleName;
        const pattern = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;
        const match = title.match(pattern);
        if (match) {
          // 如果匹配，则只取标题部分
          title = match[4];
        }
        content = content.replace(
          linkName,
          // `<a href="${file.articleName}${
          //   anchor ? "#" + anchor : ""
          // }" name="${realName}" id="huiqu">${showName || realName}</a>`
          `{% post_link ${file.articleName} '${showName || realName}' %}`,
        );
      }
    });
  }
  data.content = content;
  return data;
}

hexo.extend.filter.register(
  "before_post_render",
  function (data) {
    let { config } = this;
    if (config.backlink) {
      if (!ignore(data)) {
        action(data);
      }
    }
  },
  0,
);
