# Hexo-Backlink

A plugin to convert backlink in `.md` file to `in-site` link.

## Install

```bash
npm install hexo-backlink
```

## configuration

Add `backlink:true` in `_config.yml`:

Check the settings in Obsidian as follow:

> "Settings" -> "Files & Links" -> "New link format" , setting as "Relative path to file"  
> "Settings" -> "Files & Links" -> "Use [[Wikilinks]]" , keeping it ON 

## Know-issue

- Can not convert link include `tags`, it will ignore the tags. like:

  ```
  [[DemoMarkdownFile#Demo]] --<result equals>-> [[DemoMarkdownFile]]
  ```

## TODO

- [] Update the documents and make sure you can start from zero.
- [] Change the project to typescript.
- [] Try to do some integritions.
