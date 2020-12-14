const Store = require('electron-store');

const store = new Store;

class SettingProp {
    constructor(key, defaultValue) {
        this.key = key;
        this.defaultValue = defaultValue;
        this.read();
    }

    set(value) {
        store.set(this.key, value);
    }

    read() {
        this.value = store.get(this.key, this.defaultValue);
    }

    save() {
        if(this.value === undefined){
            store.delete(this.key);
        }else{
            store.set(this.key , this.value);
        }
    }
}

class Setting{
    transmitterHeader = new SettingProp("telemetly.transmitter.header", "txda ");
    receiverHeaderSize = new SettingProp("telemetly.receiver.header_size", 0);

    constructor() {
        this.transmitterHeader.save();
        this.receiverHeaderSize.save();
    }

    reload(){
        this.transmitterHeader.read();
        this.receiverHeaderSize.read();
    }

    openSettingFile() {
        store.openInEditor();
    }
}

module.exports = new Setting();