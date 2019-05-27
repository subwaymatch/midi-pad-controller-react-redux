import padMappings from "../data/pad-mappings";

const _ = require("lodash");

const VOLUME_KEY = "volume";
const PAD_MAPPINGS_KEY = "padMappings";

const DEFAULT_VOLUME = 0.8;
const DEFAULT_PAD_MAPPINGS = _.cloneDeep(padMappings);

export default class PersistentStorage {
  static loadVolume() {
    let volume = JSON.parse(localStorage.getItem(VOLUME_KEY));

    volume = volume === null ? DEFAULT_VOLUME : volume;

    return volume;
  }

  static saveVolume(volume) {
    localStorage.setItem(VOLUME_KEY, JSON.stringify(volume));
  }

  static loadPadMappings() {
    let padMappings = localStorage.getItem(PAD_MAPPINGS_KEY);

    padMappings =
      padMappings === null ? DEFAULT_PAD_MAPPINGS : JSON.parse(padMappings);

    return padMappings;
  }

  static savePadMappings(padMappings) {
    localStorage.setItem(PAD_MAPPINGS_KEY, JSON.stringify(padMappings));
  }
}

PersistentStorage.loadVolume();
