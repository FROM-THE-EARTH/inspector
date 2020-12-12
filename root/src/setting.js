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

module.exports = class{
    transmitterHeader = new SettingProp("telemetly.transmitter.header", "txda ");
    receiverHeader = new SettingProp("telemetly.receiver.header", "");

    constructor() {
        this.transmitterHeader.save();
        this.receiverHeader.save();
    }

    reload(){
        this.transmitterHeader.read();
        this.receiverHeader.read();
    }

    openSettingFile() {
        store.openInEditor();
    }
}