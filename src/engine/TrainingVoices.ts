import {good_voices, NBN_CUSTOM_FONTS, smplr_voices} from "src/engine/VoiceData";
import {CacheStorage, Soundfont} from "smplr";
import { GlobalSettings } from "src/engine/GlobalSettings";

export class TrainingVoices {
    static voiceListeners : Set<()=>void> = new Set();
    static loadingListeners : Set<(v:string)=>void> = new Set();
    static voiceStorage : CacheStorage;

    static {
        this.voiceStorage = new CacheStorage();
        GlobalSettings.onUpdateSettings(()=>{
            for (let listener of this.voiceListeners) {
                listener();
            }
        });
    }

    static getAllGoodVoices() { 
        let profile = GlobalSettings.getActiveProfile();
        return [...good_voices, ...Object.keys(NBN_CUSTOM_FONTS), ...Object.keys(profile.customURLsList)];
    }

    static getAllVoices() {
        let profile = GlobalSettings.getActiveProfile();
        return [...smplr_voices, ...Object.keys(NBN_CUSTOM_FONTS), ...Object.keys(profile.customURLsList)];
    }

    static getRandomGoodVoice() {
        let good = this.getAllGoodVoices();
        return good[Math.floor(Math.random() * good.length)];
    }

    static supports(voice : string) {
        let all = this.getAllVoices();
        return all.includes(voice);
    }

    static onVoicesUpdated(callback : ()=>void) : ()=>void {
        this.voiceListeners.add(callback);
        return callback;
    }
    
    static onUpdateLoading(callback : (v:string)=>void) : (v:string)=>void {
        this.loadingListeners.add(callback);
        return callback;
    }

    static updateCounter = 0;
    static updateLoading(text : string) : number {
        for (let listener of this.loadingListeners) {
            listener(text);
        }
        return ++this.updateCounter;
    }

    static clearLoading(counter : number) {
        if (this.updateCounter == counter) {
            this.updateLoading("");
        }
    }
    
    static clearListener(callback : any) {
        if (this.voiceListeners.has(callback)) {
            this.voiceListeners.delete(callback);
        }
        if (this.loadingListeners.has(callback)) {
            this.loadingListeners.delete(callback);
        }
    }

    static deferredLoads : any[] = [];
    static fontCache : Map<string, Soundfont>[] = [];

    /* Load an instrument.
     * If it exists in cache, retrieve the cached instrument.
     * Otherwise, attempt to load from scratch.
     * Defer loading if context not yet available.
     * 
     * The need to load each instrument 3 times in a row is insanely ugly to me,
     * but I just don't see a way around it that doesn't involve going to pretty ridiculous lengths,
     * and I just need to move on to other items.
     * 
     * The real solution here would be to add Soundfont cloning to smplr directly
     */
    static async load(instrumentName : string, ctx : AudioContext | null, voice : number = 0) : Promise<Soundfont | null> {
        if (!(voice in this.fontCache)) {
            this.fontCache[voice] = new Map();
        }
        if (this.fontCache[voice].has(instrumentName)) {
            return this.fontCache[voice].get(instrumentName) ?? null;
        }
        if (ctx) {
            let counter = this.updateLoading(`Loading ${instrumentName} [${voice}]`);
            let config = TrainingVoices.getInstrumentConfig(instrumentName);
            let font = await new Soundfont(ctx as AudioContext, config).load;
            this.fontCache[voice].set(instrumentName, font);
            this.clearLoading(counter);
            return font;
        } else {
            return await new Promise((resolve, reject) => {
                this.deferredLoads.push({instrumentName, resolve, voice});
            });
        }
    }

    static async loadDeferred(ctx : AudioContext) {
        if (!ctx) {
            throw new Error("Cannot load deferred without valid context");
        }
        for (let {instrumentName, resolve, voice} of this.deferredLoads) {
            resolve(await this.load(instrumentName, ctx, voice));
        }
        this.deferredLoads = [];
    }

    static async loadRecommended(ctx : AudioContext) {
        for (let instrument of this.getAllGoodVoices()) {
            for (let i = 0; i < 3; i++) {
                await this.load(instrument, ctx, i);
            }
        }
    }

    static getInstrumentConfig(instrumentName : string) {
        let profile = GlobalSettings.getActiveProfile();
        if (instrumentName in profile.customURLsList) {
            return {
                instrumentUrl: profile.customURLsList[instrumentName],
                storage: this.voiceStorage
            }
        }

        if (instrumentName in NBN_CUSTOM_FONTS) {
            return {
                instrumentUrl: NBN_CUSTOM_FONTS[instrumentName],
                storage: this.voiceStorage
            }
        }

        return {
            instrument: instrumentName
        }
    }
    
}