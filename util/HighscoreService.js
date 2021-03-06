import uuidv4 from "uuid/v4";
import * as _ from "lodash";

const HIGHSCORE_KEY = "highscore-list";
const HIGHSCORE_IMAGE_PREFIX = "highscore-img-";

function _getAllHighscores() {
    if (!process.browser) {
        return [];
    }

    return JSON.parse(window.localStorage.getItem(HIGHSCORE_KEY) || "[]");
}

export function getTopHighscoresWithImages(howMany = 10) {
    const all = _getAllHighscores();

    all.sort((a, b) => b.points - a.points);
    const top = _.take(all, howMany);

    top.forEach(h => {
        h.playerImageUrl = window.localStorage.getItem(HIGHSCORE_IMAGE_PREFIX + h.id) || "";
    });

    return top;
}

export function addNewHighscore(playerImageUrl, levelNo, points) {
    const highscoreList = _getAllHighscores();
    const newHighscore = {
        levelNo,
        points,
        id: uuidv4()
    };

    highscoreList.push(newHighscore);

    // For highscores after #200, start deleting images so we don't fill localStorage (limit is 5MB, each image is 10KB~)
    if (highscoreList.length > 210) {
        highscoreList.sort((a, b) => b.points - a.points);
        _.slice(highscoreList, 200).forEach(h => {
            window.localStorage.removeItem(HIGHSCORE_IMAGE_PREFIX + h.id);
        });
    }

    // TODO: Downsize?
    window.localStorage.setItem(HIGHSCORE_IMAGE_PREFIX + newHighscore.id, playerImageUrl);
    window.localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(highscoreList));
}

export function removeHighscore(id) {
    const highscores = _getAllHighscores();
    const newHighscoreLsit = _.filter(highscores, x => x.id !== id);
    window.localStorage.removeItem(HIGHSCORE_IMAGE_PREFIX + id);
    window.localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(newHighscoreLsit));
}

export function clearHighscores() {
    const all = _getAllHighscores();
    all.forEach(h => {
        window.localStorage.removeItem(HIGHSCORE_IMAGE_PREFIX + h.id);
    });
    window.localStorage.removeItem(HIGHSCORE_KEY + id);
}
