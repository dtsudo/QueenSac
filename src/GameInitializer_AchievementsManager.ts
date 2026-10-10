
let getAchievementsManager = function ({ browserWindow }: { browserWindow: Window }) {

	let windowAsAny: any = browserWindow;

	if (!windowAsAny.completedAchievements)
		windowAsAny.completedAchievements = [];

	let addAchievement = function (achievement: string) {
		let array: string[] = windowAsAny.completedAchievements;
		for (let i = 0; i < array.length; i++) {
			if (array[i] === achievement)
				return;
		}

		array.push(achievement);
	};

	let addAchievements = function ({ achievements }: { achievements: string[] | null }) {
		if (achievements !== null) {
			for (let i = 0; i < achievements.length; i++) {
				addAchievement(achievements[i]!);
			}
		}
	};

	return {
		addAchievements
	};
};

export { getAchievementsManager };
