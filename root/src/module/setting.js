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
    rocketInitialAngle = new SettingProp("rocket.initial_angle", 15);
    transmitterHeader = new SettingProp("telemetry.transmitter.header", "txda ");
    receiverHeaderSize = new SettingProp("telemetry.receiver.header_size", 0);

    constructor() {
        this.rocketInitialAngle.save();
        this.transmitterHeader.save();
        this.receiverHeaderSize.save();
    }

    reload(){
        this.rocketInitialAngle.read();
        this.transmitterHeader.read();
        this.receiverHeaderSize.read();
    }

    openSettingFile() {
        store.openInEditor();
    }
}

module.exports = new Setting();