# inspector
  テレメトリ監視用GUIです。<br>
  受信したデータの解析、コマンドの送信をこのアプリケーションで行うことが出来ます。<br>
  テレメトリは[仕様書](https://github.com/FROM-THE-EARTH/document/blob/main/%E3%83%86%E3%83%AC%E3%83%A1%E3%83%88%E3%83%AA%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E4%BB%95%E6%A7%98%E6%9B%B8.pdf)に沿って行われることを前提としています。

# Download Installer
  |Platform|Link|Version|Date|
  |:----:|:----:|:----:|:----:|
  |Windows10|[Download](https://github.com/FROM-THE-EARTH/inspector/raw/main/release/inspector-installer-win.exe)|0.1.1|2020/12/14|
  |macOS|N/A|N/A|N/A|
  |Linux|N/A|N/A|N/A|

# Develop
## Build
  - **Install Node.js** (Using v14.15.1)
  ```
  git clone https://github.com/FROM-THE-EARTH/inspector.git
  cd inspector
  npm install
  npm run rebuild
  ```

## Run
  ```
  npm run start
  ```

## Packaging
  **Windows**
  ```
  npm run pac:win
  ```
  **macOS**
  ```
  ```
  **Linux**
  ```
  ```

# Releases
## 0.1.1
  - 送信時にヘッダを追加する機能を追加
  - UIを整理

## 0.1.0
  - Release beta version