# inspector
  テレメトリ監視用GUIです。<br>
  受信したデータの解析、コマンドの送信をこのアプリケーションで行うことが出来ます。<br>
  テレメトリは[仕様書](https://github.com/FROM-THE-EARTH/document/blob/main/%E3%83%86%E3%83%AC%E3%83%A1%E3%83%88%E3%83%AA%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E4%BB%95%E6%A7%98%E6%9B%B8.pdf)に沿って行われることを前提としています。

# Downloads
  |Platform|Link|Version|Date|
  |:------:|:--:|:-----:|:--:|
  |Windows|[Download](https://github.com/FROM-THE-EARTH/inspector/raw/main/release/inspector-installer-win.exe)|0.2.1|2020/12/19|
  | macOS |[Download](https://github.com/FROM-THE-EARTH/inspector/raw/main/release/inspector-installer-mac.dmg)|0.2.0|2020/12/15|
  | Linux |N/A|N/A|N/A|

  - Only available on 64bit architecture

  >macOSの場合、開発者登録をしていないため普通に実行するとブロックされてしまいます。macOSで実行する際は、初回のみアプリアイコンを右クリックしメニューから開くを押して実行する必要があります。

# Development
## Building
  - **Install Node.js** (Using v14.15.1)
  ```
  git clone https://github.com/FROM-THE-EARTH/inspector.git
  cd inspector
  npm install
  npm run rebuild
  ```

## Running
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
  npm run pac:mac
  ```
  **Linux**
  ```
  ```

## Troubleshooting
  - node_modules/を削除し、再度buildする
  - Windowsの場合、管理者権限のPowerShellで```npm install --global windows-build-tools```を実行する

# Releases
## 0.2.1
  - baudrate設定機能の追加
  - コマンド送信時、送信文字列の末尾に自動的に"\r\n"を追加するように修正

## 0.2.0
  - macOSに対応
  - UIをダークテーマに
  - ウィンドウの最小サイズを800x720に設定

## 0.1.1
  - 送信時にヘッダを追加する機能を追加
  - UIを整理

## 0.1.0
  - Release beta version