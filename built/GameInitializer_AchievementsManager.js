let getAchievementsManager = function ({ browserWindow }) {
    let windowAsAny = browserWindow;
    if (!windowAsAny.completedAchievements)
        windowAsAny.completedAchievements = [];
    let addAchievement = function (achievement) {
        let array = windowAsAny.completedAchievements;
        for (let i = 0; i < array.length; i++) {
            if (array[i] === achievement)
                return;
        }
        array.push(achievement);
    };
    let addAchievements = function ({ achievements }) {
        if (achievements !== null) {
            for (let i = 0; i < achievements.length; i++) {
                addAchievement(achievements[i]);
            }
        }
    };
    return {
        addAchievements
    };
};
export { getAchievementsManager };
