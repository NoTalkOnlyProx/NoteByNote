export class GlobalSettings {
    static loaded = false;
    static lastStatus : string = ""
    static customURLsList : {[key:string]:string} = {};
    static enableAutosave : boolean = localStorage.getItem("NBNAUTOSAVE") == "Y";

    static listeners : Set<()=>void> = new Set();

    static setAutosave() {
        console.log("autosave set", this.enableAutosave);
        localStorage.setItem("NBNAUTOSAVE", this.enableAutosave ? "Y" : "N");
    }
    static updateSettings(autosave=false) {
        for (let listener of this.listeners) {
            listener();
        }
        if (autosave && !this.enableAutosave) {
            return;
        }
        localStorage.setItem("NBNSETTINGS", this.exportSettings());
    }
    
    static onUpdateSettings(cb : ()=>void) : ()=>void {
        this.listeners.add(cb);
        return cb;
    }
    
    static clearListener(cb : ()=>void) {
        this.listeners.delete(cb);
    }

    static loadSettings() {
        console.log("Loading settings");
        let data = localStorage.getItem("NBNSETTINGS");
        if (data) {
            this.importSettings(data);
        } else {
            this.resetSettings();
        }
        this.loaded = true;
    }
    static resetSettings() {
        this.customURLsList = {};
        this.lastStatus = "Settings Reset";
    }
    static exportSettings() : string {
        if (!this.loaded) {
            this.loadSettings();
        }
        return JSON.stringify({
            urls: this.customURLsList
        }, null, 2);
    }
    static importSettings(raw : string) {
        try {
            let settings = JSON.parse(raw);
            this.customURLsList = settings.urls ?? {};
            this.lastStatus = "Settings Imported.";
        } catch(e) {
            this.lastStatus = "Settings Import Failed";
        }
        this.loaded = true;
    }
}
GlobalSettings.loadSettings();