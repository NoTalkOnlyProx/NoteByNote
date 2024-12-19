import { GenerateTuning, packTuning, unpackTuning, type Tuning } from "./Tuning";

export interface SettingsProfile {
    name : string;
    customURLsList : {[key:string]:string};
    tuning : Tuning;
}

export interface PackedProfile {
    name?  : string;
    urls?  : {[key:string]:string};
    tuning?: string;
}

export type Profiles = {[key:string]:SettingsProfile};
export type PackedProfiles = PackedProfile[];

export class GlobalSettings {
    static loaded = false;
    static enableAutosave : boolean = localStorage.getItem("NBNAUTOSAVE") == "Y";

    static activeProfile : string = localStorage.getItem("NBNPROF") ?? "default";
    static profiles : Profiles = {};

    static listeners : Set<()=>void> = new Set();

    static setAutosave(autosave : boolean) {
        this.enableAutosave = autosave;
        localStorage.setItem("NBNAUTOSAVE", this.enableAutosave ? "Y" : "N");
    }

    /* Manage Profiles */
    static selectProfile(pname : string = "default") {
        if (!this.loaded) {
            this.loadProfiles();
        }
        if (!(pname in this.profiles)) {
            return;
        }
        this.activeProfile = pname;
        localStorage.setItem("NBNPROF", pname);
        this.notifyUpdateSettings();
    }

    static getActiveProfile() : SettingsProfile {
        if (!this.loaded) {
            this.loadProfiles();
        }
        return this.profiles[this.activeProfile];
    }

    static listProfiles() : string[] {
        if (!this.loaded) {
            this.loadProfiles();
        }
        return Object.keys(this.profiles);
    }

    static resetProfile(pname : string = "default") {
        this.setEmptyProfile(pname);
        this.saveProfiles();
        this.notifyUpdateSettings();
    }

    static deleteProfile(pname : string = "default") {
        if (!(pname in this.profiles)) {
            return;
        }
        delete this.profiles[pname];
        this.saveProfiles();
        this.notifyUpdateSettings();
    }

    /* Call this after modifying settings, it will save them if appropriate, and inform
     * listeners.
     */
    static updateSettings(autosave=false) {
        if (!autosave || this.enableAutosave) {
            this.saveProfiles();
        }
        this.notifyUpdateSettings();
    }

    static nextNotif : any = undefined;
    static notifyUpdateSettings() {
        if (this.nextNotif) {
            clearTimeout(this.nextNotif);
        }
        this.nextNotif = setTimeout(() => {
            for (let listener of this.listeners) {
                listener();
            }
        }, 100);
    }
    
    /* Load/Save/Reset */
    static loadProfiles() {
        this.loaded = true;
        console.log("Loading profiles");
        let data = localStorage.getItem("NBNSETTINGS");
        if (!data || !this.importSettings(data)) {
            this.resetAllSettings();
        }
        this.saveProfiles();
        this.notifyUpdateSettings();
    }
    static saveProfiles() {
        this.sanitizeProfiles();
        localStorage.setItem("NBNSETTINGS", this.exportSettings("all"));
    }
    static resetAllSettings() {
        this.profiles = {};
        this.sanitizeProfiles();
        this.saveProfiles();
        this.notifyUpdateSettings();
    }
    static sanitizeProfiles() {
        if (Object.keys(this.profiles).length == 0) {
            this.setEmptyProfile("default");
        }

        if (!(this.activeProfile in this.profiles)) {
            this.selectProfile(Object.keys(this.profiles)[0]);
        }
    }

    static setEmptyProfile(pname : string = "default") : SettingsProfile {
        let profile = {
            name: pname,
            customURLsList: {},
            tuning: GenerateTuning("12ED2", 12, 2)
        };
        this.profiles[pname] = profile;
        return profile;
    }

    /* Import/Export */
    static exportSettings(pname : string = "all") : string {
        if (!this.loaded) {
            this.loadProfiles();
        }
        
        return JSON.stringify(this.packSettings(pname), null, 2);
    }
    static importSettings(raw : string) : boolean {
        try {
            let data = JSON.parse(raw);
            if (Array.isArray(data)) {
                let newProfiles : Profiles = {};
                for (let raw_profile of data) {
                    let profile : SettingsProfile = this.unpackSettings(raw_profile);
                    if (profile) {
                        newProfiles[profile.name] = profile;
                    }
                }
                this.profiles = newProfiles;
                this.notifyUpdateSettings();
                return true;
            }

            let profile : SettingsProfile = this.unpackSettings(data);
            if (profile && profile.name != "all") {
                this.profiles[profile.name] = profile;
                this.notifyUpdateSettings();
                return true;
            }

            return false;
        } catch(e) {
            return false;
        }
    }

    /* Pack/Unpack */
    static packSettings(pname : string) : PackedProfile | PackedProfiles {
        if (pname == "all") {
            return Object.keys(this.profiles).filter(pname => pname != "all").map(pname => this.packSettings(pname) as PackedProfile);
        }
        let profile = this.profiles[pname];
        return {
            name: profile.name,
            urls: profile.customURLsList,
            tuning: packTuning(profile.tuning ?? GenerateTuning("12ED2", 12, 2))
        }
    }
    static unpackSettings(packed : PackedProfile) : SettingsProfile {
        return {
            name: packed.name ?? "default",
            customURLsList: packed.urls ?? {},
            tuning: unpackTuning(packed.tuning) ?? GenerateTuning("12ED2", 12, 2)
        }
    }

    /* Event Listeners */
    static onUpdateSettings(cb : ()=>void) : ()=>void {
        this.listeners.add(cb);
        return cb;
    }
    static clearListener(cb : ()=>void) {
        this.listeners.delete(cb);
    }
}
GlobalSettings.loadProfiles();