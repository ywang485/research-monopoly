// Theory Investment Game - Internationalization (i18n) System

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
    en: {
        // === GAME TITLE & SETUP ===
        'setup.title': 'Scientific Research is Gambling with Your Life',
        'setup.subtitle': 'How much life can you invest?',
        'setup.researchTopic': 'Research Topic',
        'setup.whatStudying': 'What are we studying?:',
        'setup.entityPlaceholder': 'e.g., The Existential Dust Bunny, Why cats judge our life choice...',
        'setup.players': 'Players (2-4)',
        'setup.playerPlaceholder': 'Player {num} Name',
        'setup.ai': 'AI',
        'setup.addPlayer': '+ Add Player',
        'setup.removePlayer': '- Remove Player',
        'setup.boardConfig': 'Board Configuration',
        'setup.selectMap': 'Select Map:',
        'setup.defaultBoard': 'Default Board',
        'setup.customMap': 'Load Custom Map',
        'setup.mapPlaceholder': 'Paste map configuration here...',
        'setup.initialAge': 'Initial Player Age:',
        'setup.startGame': 'START GAME!',

        // === GAMEPLAY UI ===
        'gameplay.checkingAI': 'Checking AI...',
        'gameplay.establishedTheories': 'Established Theories',
        'gameplay.scientists': 'Scientists',
        'gameplay.gameLog': 'Game Log',
        'gameplay.rollDice': 'Roll Dice',
        'gameplay.zoomIn': 'Zoom In',
        'gameplay.zoomOut': 'Zoom Out',
        'gameplay.resetZoom': 'Reset Zoom',
        'gameplay.turn': 'Turn: {name}',
        'gameplay.aiThinking': 'AI Thinking...',
        'gameplay.yourTurnToRoll': 'Your turn to roll!',
        'gameplay.ready': 'Ready!',

        // === MOBILE TABS ===
        'mobile.players': 'Players',
        'mobile.theories': 'Theories',
        'mobile.log': 'Log',
        'mobile.roll': 'Roll',

        // === PLAYER STATS ===
        'stats.age': 'Age:',
        'stats.available': 'Avail:',
        'stats.fame': 'Fame:',
        'stats.students': 'Students:',
        'stats.position': 'Position:',
        'stats.start': 'Start',

        // === THEORIES LIST ===
        'theories.noTheories': 'No theories established yet',
        'theories.publishedBy': 'Published by:',
        'theories.significance': 'Significance:',

        // === TOOLTIPS ===
        'tooltip.establishedTheory': 'Established Theory',
        'tooltip.proposedBy': 'Proposed by',
        'tooltip.addedBy': 'Added by',
        'tooltip.totalInvestments': 'Total Investments:',
        'tooltip.activeResearch': 'Active Research (Cost: {cost} yrs)',
        'tooltip.unmarked': 'Unmarked (Cost: {cost} yrs to start)',
        'tooltip.provenTheory': 'ESTABLISHED THEORY',
        'tooltip.playersHere': 'Players here:',
        'tooltip.npcHere': 'Scientific Underdeterminism is here',

        // === SPACE TYPES ===
        'space.start': 'Start',
        'space.hypothesis': 'Hypothesis',
        'space.recruit': 'Recruit',
        'space.conference': 'Conference',
        'space.sabbatical': 'Sabbatical',
        'space.communityService': 'Community Service',
        'space.grant': 'Grant',
        'space.scandal': 'Scandal',
        'space.collaboration': 'Collaboration',
        'space.eureka': 'Eureka',

        // === SPACE DESCRIPTIONS ===
        'spaceDesc.start': 'Begin your academic journey! Passing this space rejuvenates you by 2 years.',
        'spaceDesc.hypothesis': 'A research opportunity! Create a new hypothesis or invest in an existing one. If Scientific Underdeterminism lands here, the hypothesis becomes a proven theory.',
        'spaceDesc.recruit': 'Graduate recruitment center. Spend fame points to hire students who extend your available research years.',
        'spaceDesc.conference': 'Present your work and gain recognition! Earn 3 fame points for attending.',
        'spaceDesc.sabbatical': 'Take a well-deserved break. Rejuvenate by 3 years of life.',
        'spaceDesc.communityService': 'Forced to do community service! Lose years to service work, but you can sacrifice a student to get away with it.',
        'spaceDesc.grant': 'Research funding! Receive a grant and gain 2 fame points from your peers.',
        'spaceDesc.scandal': 'Academic misconduct allegations! Lose 5 fame points as your reputation suffers.',
        'spaceDesc.collaboration': 'Team up with a colleague! Gain 2 fame and rejuvenate by 1 year through shared research.',
        'spaceDesc.eureka': 'A flash of brilliance! Claim the nearest uninvested hypothesis space for FREE (no life cost).',

        // === STUDENT TYPES ===
        'student.undergraduate': 'Undergraduate',
        'student.master': 'Master Student',
        'student.phd': 'PhD Student',
        'student.provides': 'Provides: {years} years',
        'student.cost': 'Cost: {cost} fame',

        // === DEATH MESSAGES ===
        'death.message1': "Should've invested in better health insurance instead of hypotheses.",
        'death.message2': "At least they won't have to peer review any more grant proposals.",
        'death.message3': "Death: the ultimate sabbatical.",
        'death.message4': "Their h-index was never THAT impressive anyway.",
        'death.message5': "Posthumous publications don't count for tenure, unfortunately.",
        'death.message6': "Gone but not cited.",
        'death.message7': "They finally found the one research question they couldn't answer.",
        'death.message8': "Academia claims another victim.",
        'death.message9': "Should've spent less time in the lab and more time exercising.",
        'death.message10': "Their last hypothesis: 'I'll live forever.' Status: Disproven.",
        'death.message11': "The university will replace them with three adjuncts.",
        'death.message12': "At least now they don't have to attend any more faculty meetings.",
        'death.message13': "Their final contribution to science: becoming a cautionary tale.",
        'death.message14': "Too much coffee, not enough sleep, inevitable conclusion.",

        // === OBITUARY MODAL ===
        'obituary.title': 'OBITUARY',
        'obituary.passedAway': '{name} has passed away at the ripe old age of {age}.',
        'obituary.finalStats': 'Final Stats:',
        'obituary.totalFame': 'Total Fame: {fame}',
        'obituary.theoriesPublished': 'Theories Published: {count}',
        'obituary.studentsExploited': 'Students Exploited: {count}',
        'obituary.gameContinues': 'The game continues without them.',
        'obituary.rip': 'RIP',

        // === START SPACE ===
        'start.title': 'New Academic Year',
        'start.congratulations': "Congratulations! {you}'ve survived another trip around the sun without quitting academia.",
        'start.fameBonus': '+2 fame for {your} unrelenting stubbornness',
        'start.familyJoke': "{your} family still doesn't understand what {you} do for a living.",
        'start.button': 'Yay...',

        // === CONFERENCE SPACE ===
        'conference.title': 'Academic Conference',
        'conference.noPublications': '{you} showed up to the conference, but realized {you_lower} have nothing to present.',
        'conference.ateCookies': 'Awkwardly attended other people\'s talks and ate free cookies instead.',
        'conference.nameTag': 'At least someone remembered {your} name tag!',
        'conference.presented': '{you} traveled across the country to present {your} groundbreaking work on "{hypothesis}" in a windowless room to 6 people (3 were asleep).',
        'conference.hotelBreakfast': 'At least the hotel breakfast was mediocre!',
        'conference.buttonOops': 'Oops',
        'conference.buttonWorthIt': 'Worth it?',

        // === SABBATICAL SPACE ===
        'sabbatical.title': 'Sabbatical Leave',
        'sabbatical.escaped': '{you} escaped to "write a book" (really just avoided emails for 6 months).',
        'sabbatical.rejuvenate': '-2 years of aging from not attending meetings!',
        'sabbatical.bookChapter': "{you}'ll definitely finish that book chapter... eventually.",
        'sabbatical.button': 'Bliss',

        // === GRANT SPACE ===
        'grant.title': 'Research Grant!',
        'grant.approved': 'After only 47 revisions and 3 panel reviews, they actually gave {you} money!',
        'grant.fameBonus': '+2 fame (mostly from other academics jealous of {your} funding)',
        'grant.stipends': "Now if only the grant actually covered {your} students' stipends...",
        'grant.button': 'Finally!',

        // === SCANDAL SPACE ===
        'scandal.title': 'Academic Scandal!',
        'scandal.issues': 'Someone actually read {your} paper and found... issues.',
        'scandal.fameLoss': '-{loss} fame from the Twitter mob and anonymous blog posts',
        'scandal.pValues': 'Maybe {you} should have checked those p-values more carefully...',
        'scandal.button': 'Oops',

        // === COLLABORATION SPACE ===
        'collaboration.title': 'Research Collaboration',
        'collaboration.coauthors': '{you} and {collaborator} are now co-authors!',
        'collaboration.fameBonus': 'Both +{bonus} fame (now {you_lower} have to decide authorship order...)',
        'collaboration.passiveAggressive': 'May the most passive-aggressive email win.',
        'collaboration.alone': '{you} wanted to collaborate but everyone else is dead or has better things to do.',
        'collaboration.soloAuthorship': 'Solo authorship it is!',
        'collaboration.buttonAwkward': 'Awkward',
        'collaboration.buttonForeverAlone': 'Forever alone',

        // === EUREKA SPACE ===
        'eureka.title': 'EUREKA!',
        'eureka.shower': 'It came to {you_lower} in the shower!',
        'eureka.insight': 'A brilliant insight about {entity} just hit {you_lower}!',
        'eureka.claimFree': '{you} can claim the next available research question ("{space}") FOR FREE!',
        'eureka.aiSuggestions': 'AI-generated hypotheses (because originality is hard):',
        'eureka.generating': 'Generating suggestions...',
        'eureka.formulate': 'Or formulate {your} eureka moment:',
        'eureka.placeholder': 'Enter {your} hypothesis about {entity}...',
        'eureka.normalCost': 'Normal cost: {cost} years. Eureka cost: FREE!',
        'eureka.noSpaces': 'But... every hypothesis space is already claimed. {your} genius goes to waste.',
        'eureka.shouldveThought': "Should've thought of this sooner!",
        'eureka.buttonClaim': 'Claim it!',
        'eureka.buttonSkip': 'Skip',
        'eureka.buttonTragic': 'Tragic',

        // === HYPOTHESIS SPACE - NEW ===
        'hypothesis.newTitle': 'New Research Opportunity!',
        'hypothesis.nobodyWasted': "Nobody's wasted their life on this question about {entity} yet!",
        'hypothesis.investYears': 'Invest {cost} years to claim this territory before someone else does.',
        'hypothesis.aiSuggestions': 'AI-generated hypotheses (because originality is hard):',
        'hypothesis.originalThoughts': 'Or pretend to have original thoughts:',
        'hypothesis.placeholder': 'Enter your hypothesis about {entity}...',
        'hypothesis.yearsRemaining': 'Life years remaining: {years}',
        'hypothesis.likelyDie': "{you}'ll likely die before {you_lower} come up with anything",
        'hypothesis.buttonInvest': 'Invest',
        'hypothesis.buttonSkip': 'Skip',

        // === HYPOTHESIS SPACE - ACTIVE ===
        'hypothesis.activeTitle': 'Active Hypothesis',
        'hypothesis.currentHypothesis': 'Current Hypothesis:',
        'hypothesis.sacrificedYears': "People who've already sacrificed years of their life:",
        'hypothesis.addComplexity': 'Add unnecessary complexity (optional):',
        'hypothesis.addPlaceholder': 'Make it sound more academic...',
        'hypothesis.howManyYears': 'How many years to waste on this?',
        'hypothesis.cantAfford': '{you} literally can\'t afford any investment.',
        'hypothesis.invalidInvestment': '{you} need to invest at least 1 year!',
        'hypothesis.insufficientLife': "Insufficient Life",
        'hypothesis.notEnoughYears': "{you} don't have {years} years to spare!",
        'hypothesis.buttonPass': 'Pass',
        'hypothesis.buttonOops': 'Oops',
        'hypothesis.buttonDamn': 'Damn',

        // === HYPOTHESIS SPACE - PROVEN (OWN) ===
        'hypothesis.ownTheoryTitle': '{your} Own Theory!',
        'hypothesis.establishedTheory': 'Established Theory:',
        'hypothesis.yourTheory': 'This is {your} theory! {you} invested the most time into this research.',
        'hypothesis.noNeedToRead': "No need to waste time reading {your_lower} own work. {you} already know this stuff!",
        'hypothesis.buttonObviously': 'Obviously',
        'hypothesis.buttonOfCourse': 'Of course I do',

        // === HYPOTHESIS SPACE - PROVEN (OTHER) ===
        'hypothesis.literatureSurvey': 'Literature Survey Required',
        'hypothesis.surveySpent': '{you} spent {cost} year doing a literature survey on this theory.',
        'hypothesis.ageChange': 'Age: {before} → {after} years old',
        'hypothesis.buttonSigh': '*Sigh* Fine',

        // === CITATION COMPLAINTS (AI) ===
        'citation.ai1': 'Ugh, now {name} has to waste time reading someone else\'s garbage and pretend it\'s brilliant.',
        'citation.ai2': 'Great, another theory {name}\'ll have to cite even though {name} knows it\'s flawed.',
        'citation.ai3': 'Time to pad {name}\'s bibliography with this overhyped nonsense.',
        'citation.ai4': '{name} HAS to cite this. Academia\'s unwritten rule: stroke everyone\'s ego.',
        'citation.ai5': 'Now {name}\'s legally obligated to make this theory sound important in the lit review.',
        'citation.ai6': 'Fantastic. {name} gets to spend a year analyzing why this theory is \'foundational\' (it\'s not).',
        'citation.ai7': 'Nothing says \'fun\' like begrudgingly adding this to {name}\'s reference list.',
        'citation.ai8': '{name} could\'ve used this year for literally anything else. But no, literature survey time!',
        'citation.ai9': 'Time to write a whole paragraph explaining why this theory \'informs {name}\'s work\' (spoiler: barely).',
        'citation.ai10': 'Congrats, {name} now has to pretend to have always respected this research.',
        'citation.ai11': '{name}\'ll cite this through gritted teeth, knowing full well it has issues.',
        'citation.ai12': 'Another year lost to academic bureaucracy. At least {name}\'s citations look thorough!',
        'citation.ai13': '{name} has to read this AND cite it. Double the pain, zero the joy.',
        'citation.ai14': 'Time for a deep dive into theory {name}\'ll probably disagree with in 5 years.',

        // === CITATION COMPLAINTS (HUMAN) ===
        'citation.human1': 'Ugh, now you have to waste time reading someone else\'s garbage and pretend it\'s brilliant.',
        'citation.human2': 'Great, another theory you\'ll have to cite even though you know it\'s flawed.',
        'citation.human3': 'Time to pad your bibliography with this overhyped nonsense.',
        'citation.human4': 'You HAVE to cite this. Academia\'s unwritten rule: stroke everyone\'s ego.',
        'citation.human5': 'Now you\'re legally obligated to make this theory sound important in your lit review.',
        'citation.human6': 'Fantastic. You get to spend a year analyzing why this theory is \'foundational\' (it\'s not).',
        'citation.human7': 'Nothing says \'fun\' like begrudgingly adding this to your reference list.',
        'citation.human8': 'You could\'ve used this year for literally anything else. But no, literature survey time!',
        'citation.human9': 'Time to write a whole paragraph explaining why this theory \'informs your work\' (spoiler: barely).',
        'citation.human10': 'Congrats, you now have to pretend you\'ve always respected this research.',
        'citation.human11': 'You\'ll cite this through gritted teeth, knowing full well it has issues.',
        'citation.human12': 'Another year lost to academic bureaucracy. At least your citations look thorough!',
        'citation.human13': 'You have to read this AND cite it. Double the pain, zero the joy.',
        'citation.human14': 'Time for a deep dive into theory you\'ll probably disagree with in 5 years.',

        // === RECRUIT SPACE ===
        'recruit.title': 'Graduate Recruitment',
        'recruit.tradePoints': 'Trade {your} fame points for indentured servants... I mean, research assistants!',
        'recruit.fameAvailable': 'Fame available: {fame}',
        'recruit.currentVictims': 'Current exploitation victims: {count}',
        'recruit.takeCredit': "They'll do all the work while {you} take all the credit!",
        'recruit.buttonPerfect': 'Perfect',

        // === COMMUNITY SERVICE SPACE ===
        'community.title': 'Community Service',
        'community.assigned': "Oh no! {you}'ve been assigned mandatory community service work.",
        'community.costYears': 'This will cost {you_lower} {cost} years of {your} precious research time.',
        'community.butWait': 'BUT WAIT... {you_lower} have a {student} who could take {your} place!',
        'community.whatWillYouDo': 'What will {you_lower} do?',
        'community.buttonSacrifice': 'Sacrifice {student}',
        'community.buttonDoItMyself': 'Do it myself',
        'community.sacrificedTitle': 'Student Sacrificed',
        'community.threwUnderBus': '{you} threw {your} {student} under the bus!',
        'community.pickingLitter': "They're now spending their days picking up litter instead of doing research.",
        'community.crushingDreams': 'Academia: where we build character by crushing dreams!',
        'community.buttonNoRegrets': 'No regrets',
        'community.noblyChose': '{you} nobly chose to do the community service {you_lower}self.',
        'community.agingFromTasks': '+{cost} years of aging from mindless bureaucratic tasks.',
        'community.studentGrateful': '{your} student is grateful... for now.',
        'community.buttonIntegrity': 'Integrity?',
        'community.noStudents': "{you}'ve been assigned mandatory community service work!",
        'community.agingFromForms': '+{cost} years of aging from filling out forms and attending sensitivity training.',
        'community.ifOnlyStudent': 'If only {you_lower} had a grad student to dump this on...',
        'community.buttonSuchIsLife': 'Such is life',

        // === NPC TURN ===
        'npc.name': 'Scientific Underdeterminism',
        'npc.turnMessage': 'Scientific Underdeterminism is taking its turn...',
        'npc.modalTitle': 'The Universe Decides...',
        'npc.moves': 'Scientific Underdeterminism moves...',
        'npc.rolled': 'Scientific Underdeterminism rolled a {roll}',
        'npc.landedNothing': 'Scientific Underdeterminism landed on "{space}" - nothing happens here.',

        // === THEORY ESTABLISHED ===
        'theory.establishedTitle': 'THEORY ESTABLISHED!',
        'theory.validated': 'Scientific Underdeterminism has validated a hypothesis!',
        'theory.nowEstablished': 'This is now an established theory about {entity}!',
        'theory.publishedEarned': '{author} published the paper and earned {fame} fame!',
        'theory.buttonHistoric': 'Historic!',

        // === DICE ROLLING ===
        'dice.rolling': 'Rolling...',
        'dice.result': 'You rolled a {roll}!',
        'dice.buttonGo': "Let's go!",

        // === GAME OVER ===
        'gameover.title': 'GAME OVER',
        'gameover.synthesizing': 'Synthesizing groundbreaking discoveries...',
        'gameover.playAgain': 'PLAY AGAIN!',
        'gameover.shareResults': 'SHARE RESULTS',
        'gameover.winner': 'Winner: {name}',
        'gameover.allDead': 'Everyone died! Science marches on without them.',
        'gameover.finalFame': 'Final Fame: {fame}',
        'gameover.theoriesCount': 'Theories: {count}',

        // === LOG MESSAGES ===
        'log.landed': '{name} landed on "{space}" ({type})',
        'log.proposed': '{name} proposed: "{hypothesis}" and invested {years} years.',
        'log.expanded': '{name} expanded the hypothesis: "{addition}"',
        'log.invested': '{name} invested {years} years in the hypothesis.',
        'log.hired': '{name} hired a {student} for {cost} fame.',
        'log.sacrificed': '{name} sacrificed their {student} to avoid community service!',
        'log.visitedOwn': '{name} visited their own established theory.',
        'log.surveyedLiterature': '{name} grudgingly surveyed the literature on: "{hypothesis}"',
        'log.eurekaFree': '{name} had a EUREKA moment and claimed "{space}" with: "{hypothesis}" (FREE!)',
        'log.theoryProven': 'THEORY: "{hypothesis}" proven! {author} earned {fame} fame!',
        'log.passedAway': '{name} has passed away at age {age}. Their legacy lives on through {count} theories.',

        // === AI PROVIDERS ===
        'ai.gpt': 'GPT',
        'ai.claude': 'Claude',
        'ai.gemini': 'Gemini',
        'ai.templates': 'Templates',
        'ai.status': 'AI: {provider}',

        // === LANGUAGE ===
        'lang.english': 'English',
        'lang.chinese': '中文',
        'lang.switch': 'Language'
    },

    zh: {
        // === GAME TITLE & SETUP ===
        'setup.title': '科研就是拿命在赌',
        'setup.subtitle': '你愿意投入多少生命？',
        'setup.researchTopic': '研究课题',
        'setup.whatStudying': '我们在研究什么？:',
        'setup.entityPlaceholder': '例如：存在主义灰尘兔，猫为什么鄙视人类的生活选择...',
        'setup.players': '玩家 (2-4人)',
        'setup.playerPlaceholder': '玩家{num}姓名',
        'setup.ai': 'AI',
        'setup.addPlayer': '+ 添加玩家',
        'setup.removePlayer': '- 移除玩家',
        'setup.boardConfig': '棋盘设置',
        'setup.selectMap': '选择地图:',
        'setup.defaultBoard': '默认棋盘',
        'setup.customMap': '加载自定义地图',
        'setup.mapPlaceholder': '在此粘贴地图配置...',
        'setup.initialAge': '玩家初始年龄:',
        'setup.startGame': '开始游戏！',

        // === GAMEPLAY UI ===
        'gameplay.checkingAI': '正在检测AI...',
        'gameplay.establishedTheories': '已建立的理论',
        'gameplay.scientists': '科学家们',
        'gameplay.gameLog': '游戏日志',
        'gameplay.rollDice': '掷骰子',
        'gameplay.zoomIn': '放大',
        'gameplay.zoomOut': '缩小',
        'gameplay.resetZoom': '重置缩放',
        'gameplay.turn': '回合: {name}',
        'gameplay.aiThinking': 'AI思考中...',
        'gameplay.yourTurnToRoll': '轮到你掷骰子了！',
        'gameplay.ready': '准备好了！',

        // === MOBILE TABS ===
        'mobile.players': '玩家',
        'mobile.theories': '理论',
        'mobile.log': '日志',
        'mobile.roll': '掷骰',

        // === PLAYER STATS ===
        'stats.age': '年龄:',
        'stats.available': '可用:',
        'stats.fame': '声望:',
        'stats.students': '学生:',
        'stats.position': '位置:',
        'stats.start': '起点',

        // === THEORIES LIST ===
        'theories.noTheories': '暂无已建立的理论',
        'theories.publishedBy': '发表者:',
        'theories.significance': '重要性:',

        // === TOOLTIPS ===
        'tooltip.establishedTheory': '已建立的理论',
        'tooltip.proposedBy': '提出者',
        'tooltip.addedBy': '补充者',
        'tooltip.totalInvestments': '总投入:',
        'tooltip.activeResearch': '进行中的研究 (花费: {cost}年)',
        'tooltip.unmarked': '未标记 (开始花费: {cost}年)',
        'tooltip.provenTheory': '已建立的理论',
        'tooltip.playersHere': '此处的玩家:',
        'tooltip.npcHere': '科学不确定性在这里',

        // === SPACE TYPES ===
        'space.start': '起点',
        'space.hypothesis': '假说',
        'space.recruit': '招生',
        'space.conference': '学术会议',
        'space.sabbatical': '学术休假',
        'space.communityService': '社区服务',
        'space.grant': '科研基金',
        'space.scandal': '学术丑闻',
        'space.collaboration': '合作研究',
        'space.eureka': '灵感乍现',

        // === SPACE DESCRIPTIONS ===
        'spaceDesc.start': '开启你的学术之旅！经过此格可以年轻2岁。',
        'spaceDesc.hypothesis': '研究机会！提出新假说或投资现有假说。如果"科学不确定性"落在这里，假说将成为已证实的理论。',
        'spaceDesc.recruit': '研究生招募中心。花费声望点雇佣学生来延长你的可用研究年限。',
        'spaceDesc.conference': '展示你的研究成果！参会可获得3点声望。',
        'spaceDesc.sabbatical': '享受当之无愧的休息。年轻3岁。',
        'spaceDesc.communityService': '被迫做社区服务！损失研究时间，但你可以牺牲一个学生来脱身。',
        'spaceDesc.grant': '科研资助！获得基金，从同行那里获得2点声望。',
        'spaceDesc.scandal': '学术不端指控！声誉受损，损失5点声望。',
        'spaceDesc.collaboration': '与同事合作！获得2点声望，并通过共同研究年轻1岁。',
        'spaceDesc.eureka': '灵光一闪！免费认领最近的未投资假说格（无需消耗生命）。',

        // === STUDENT TYPES ===
        'student.undergraduate': '本科生',
        'student.master': '硕士生',
        'student.phd': '博士生',
        'student.provides': '提供: {years}年',
        'student.cost': '花费: {cost}声望',

        // === DEATH MESSAGES ===
        'death.message1': '早知道应该买份好点的医保，而不是投资那些假说。',
        'death.message2': '至少他们再也不用帮人审稿了。',
        'death.message3': '死亡：终极的学术休假。',
        'death.message4': '反正他们的h指数也没那么高。',
        'death.message5': '很遗憾，死后发表的论文不算评职称的。',
        'death.message6': '人走了，但没人引用过。',
        'death.message7': '他们终于找到了一个回答不了的研究问题。',
        'death.message8': '学术圈又收割了一条人命。',
        'death.message9': '早该少待在实验室，多去健身房的。',
        'death.message10': '他们的最后一个假说："我会长生不老。" 状态：已证伪。',
        'death.message11': '学校会用三个兼职教师来顶替他们。',
        'death.message12': '至少他们再也不用开教职工会议了。',
        'death.message13': '他们对科学的最后贡献：成为一个警示故事。',
        'death.message14': '咖啡太多，睡眠太少，这结局是必然的。',

        // === OBITUARY MODAL ===
        'obituary.title': '讣告',
        'obituary.passedAway': '{name}在{age}岁高龄与世长辞。',
        'obituary.finalStats': '最终数据:',
        'obituary.totalFame': '总声望: {fame}',
        'obituary.theoriesPublished': '发表理论数: {count}',
        'obituary.studentsExploited': '压榨过的学生数: {count}',
        'obituary.gameContinues': '游戏在没有他们的情况下继续。',
        'obituary.rip': '安息',

        // === START SPACE ===
        'start.title': '新学年',
        'start.congratulations': '恭喜！{you}又在学术圈熬过了一年没有辞职。',
        'start.fameBonus': '+2声望，表彰{your}的顽强坚持',
        'start.familyJoke': '{your}家人仍然不理解{you}到底是干什么的。',
        'start.button': '呃...',

        // === CONFERENCE SPACE ===
        'conference.title': '学术会议',
        'conference.noPublications': '{you}来参加会议了，但发现{you_lower}没有任何成果可以展示。',
        'conference.ateCookies': '只好尴尬地听别人的报告，顺便吃免费饼干。',
        'conference.nameTag': '至少有人记得{your}的名牌！',
        'conference.presented': '{you}千里迢迢来展示关于"{hypothesis}"的重大研究成果，在一间没有窗户的房间里，对着6个人讲（3个睡着了）。',
        'conference.hotelBreakfast': '至少酒店早餐还算一般般！',
        'conference.buttonOops': '尴尬',
        'conference.buttonWorthIt': '值得吗？',

        // === SABBATICAL SPACE ===
        'sabbatical.title': '学术休假',
        'sabbatical.escaped': '{you}逃去"写书"了（其实只是6个月没看邮件）。',
        'sabbatical.rejuvenate': '因为不用开会，年轻了2岁！',
        'sabbatical.bookChapter': '{you}肯定会写完那个章节的...迟早的事。',
        'sabbatical.button': '真爽',

        // === GRANT SPACE ===
        'grant.title': '科研基金！',
        'grant.approved': '经过47次修改和3轮评审，他们居然真的给了{you}钱！',
        'grant.fameBonus': '+2声望（主要来自嫉妒{your}拿到资助的同行）',
        'grant.stipends': '要是这笔钱能付得起{your}学生的津贴就好了...',
        'grant.button': '终于！',

        // === SCANDAL SPACE ===
        'scandal.title': '学术丑闻！',
        'scandal.issues': '有人真的读了{your}的论文，然后发现了...问题。',
        'scandal.fameLoss': '-{loss}声望，来自推特暴民和匿名博客的攻击',
        'scandal.pValues': '也许{you}应该更仔细地检查那些p值...',
        'scandal.button': '糟糕',

        // === COLLABORATION SPACE ===
        'collaboration.title': '合作研究',
        'collaboration.coauthors': '{you}和{collaborator}现在是合著者了！',
        'collaboration.fameBonus': '双方各+{bonus}声望（现在{you_lower}得决定作者排序了...）',
        'collaboration.passiveAggressive': '愿最会发阴阳怪气邮件的人获胜。',
        'collaboration.alone': '{you}想合作，但其他人要么死了，要么有更重要的事。',
        'collaboration.soloAuthorship': '那就独立作者吧！',
        'collaboration.buttonAwkward': '尴尬',
        'collaboration.buttonForeverAlone': '永远孤独',

        // === EUREKA SPACE ===
        'eureka.title': '灵感乍现！',
        'eureka.shower': '这个想法是{you_lower}洗澡时想到的！',
        'eureka.insight': '关于{entity}的绝妙见解突然击中了{you_lower}！',
        'eureka.claimFree': '{you}可以免费认领下一个可用的研究问题（"{space}"）！',
        'eureka.aiSuggestions': 'AI生成的假说（因为原创太难了）:',
        'eureka.generating': '正在生成建议...',
        'eureka.formulate': '或者自己构思{your}的灵感:',
        'eureka.placeholder': '输入{your}关于{entity}的假说...',
        'eureka.normalCost': '正常花费: {cost}年。灵感花费: 免费！',
        'eureka.noSpaces': '但是...所有假说格都已被认领。{your}的天才被浪费了。',
        'eureka.shouldveThought': '早该想到这个的！',
        'eureka.buttonClaim': '认领！',
        'eureka.buttonSkip': '跳过',
        'eureka.buttonTragic': '太悲剧了',

        // === HYPOTHESIS SPACE - NEW ===
        'hypothesis.newTitle': '新研究机会！',
        'hypothesis.nobodyWasted': '还没有人在这个关于{entity}的问题上浪费生命！',
        'hypothesis.investYears': '投入{cost}年来抢占这块领地，趁别人还没下手。',
        'hypothesis.aiSuggestions': 'AI生成的假说（因为原创太难了）:',
        'hypothesis.originalThoughts': '或者假装你有原创想法:',
        'hypothesis.placeholder': '输入你关于{entity}的假说...',
        'hypothesis.yearsRemaining': '剩余生命年限: {years}',
        'hypothesis.likelyDie': '{you}很可能在想出什么之前就死了',
        'hypothesis.buttonInvest': '投资',
        'hypothesis.buttonSkip': '跳过',

        // === HYPOTHESIS SPACE - ACTIVE ===
        'hypothesis.activeTitle': '进行中的假说',
        'hypothesis.currentHypothesis': '当前假说:',
        'hypothesis.sacrificedYears': '已经牺牲生命年限的人:',
        'hypothesis.addComplexity': '添加不必要的复杂性（可选）:',
        'hypothesis.addPlaceholder': '让它听起来更学术一点...',
        'hypothesis.howManyYears': '想在这上面浪费多少年？',
        'hypothesis.cantAfford': '{you}根本投资不起。',
        'hypothesis.invalidInvestment': '{you}至少需要投资1年！',
        'hypothesis.insufficientLife': '生命不足',
        'hypothesis.notEnoughYears': '{you}没有{years}年可以浪费！',
        'hypothesis.buttonPass': '跳过',
        'hypothesis.buttonOops': '糟糕',
        'hypothesis.buttonDamn': '该死',

        // === HYPOTHESIS SPACE - PROVEN (OWN) ===
        'hypothesis.ownTheoryTitle': '{your}自己的理论！',
        'hypothesis.establishedTheory': '已建立的理论:',
        'hypothesis.yourTheory': '这是{your}的理论！{you}在这项研究上投入了最多时间。',
        'hypothesis.noNeedToRead': '不需要浪费时间读{your_lower}自己的成果。{you}本来就懂！',
        'hypothesis.buttonObviously': '那当然',
        'hypothesis.buttonOfCourse': '我当然懂',

        // === HYPOTHESIS SPACE - PROVEN (OTHER) ===
        'hypothesis.literatureSurvey': '需要文献调研',
        'hypothesis.surveySpent': '{you}花了{cost}年做这个理论的文献调研。',
        'hypothesis.ageChange': '年龄: {before} → {after}岁',
        'hypothesis.buttonSigh': '*叹气* 好吧',

        // === CITATION COMPLAINTS (AI) ===
        'citation.ai1': '呃，现在{name}不得不浪费时间读别人的垃圾论文，还要假装它很精彩。',
        'citation.ai2': '太好了，又一个{name}明知有缺陷还得引用的理论。',
        'citation.ai3': '是时候用这种被过度吹捧的废话来充实{name}的参考文献了。',
        'citation.ai4': '{name}必须引用这个。学术界的潜规则：互相吹捧。',
        'citation.ai5': '现在{name}有法律义务在文献综述里把这个理论说得很重要。',
        'citation.ai6': '太棒了。{name}要花一年时间分析为什么这个理论是"基础性的"（其实不是）。',
        'citation.ai7': '没什么比不情不愿地把这个加到{name}的参考文献列表更"有趣"的了。',
        'citation.ai8': '{name}本可以用这一年做任何其他事。但不行，文献调研时间到！',
        'citation.ai9': '是时候写一整段话解释为什么这个理论"启发了{name}的研究"（剧透：几乎没有）。',
        'citation.ai10': '恭喜，{name}现在必须假装一直很尊重这项研究。',
        'citation.ai11': '{name}会咬牙切齿地引用这个，明知它有问题。',
        'citation.ai12': '又一年被学术官僚主义浪费了。至少{name}的引用看起来很全面！',
        'citation.ai13': '{name}必须读这个还得引用。双倍痛苦，零倍快乐。',
        'citation.ai14': '是时候深入研究一个{name}可能5年后就不认同的理论了。',

        // === CITATION COMPLAINTS (HUMAN) ===
        'citation.human1': '呃，现在你不得不浪费时间读别人的垃圾论文，还要假装它很精彩。',
        'citation.human2': '太好了，又一个你明知有缺陷还得引用的理论。',
        'citation.human3': '是时候用这种被过度吹捧的废话来充实你的参考文献了。',
        'citation.human4': '你必须引用这个。学术界的潜规则：互相吹捧。',
        'citation.human5': '现在你有法律义务在文献综述里把这个理论说得很重要。',
        'citation.human6': '太棒了。你要花一年时间分析为什么这个理论是"基础性的"（其实不是）。',
        'citation.human7': '没什么比不情不愿地把这个加到你的参考文献列表更"有趣"的了。',
        'citation.human8': '你本可以用这一年做任何其他事。但不行，文献调研时间到！',
        'citation.human9': '是时候写一整段话解释为什么这个理论"启发了你的研究"（剧透：几乎没有）。',
        'citation.human10': '恭喜，你现在必须假装一直很尊重这项研究。',
        'citation.human11': '你会咬牙切齿地引用这个，明知它有问题。',
        'citation.human12': '又一年被学术官僚主义浪费了。至少你的引用看起来很全面！',
        'citation.human13': '你必须读这个还得引用。双倍痛苦，零倍快乐。',
        'citation.human14': '是时候深入研究一个你可能5年后就不认同的理论了。',

        // === RECRUIT SPACE ===
        'recruit.title': '研究生招募',
        'recruit.tradePoints': '用{your}的声望点换取廉价劳动力...我是说，研究助理！',
        'recruit.fameAvailable': '可用声望: {fame}',
        'recruit.currentVictims': '当前受剥削者: {count}',
        'recruit.takeCredit': '他们干活，{you}署名！',
        'recruit.buttonPerfect': '完美',

        // === COMMUNITY SERVICE SPACE ===
        'community.title': '社区服务',
        'community.assigned': '糟糕！{you}被分配了强制社区服务。',
        'community.costYears': '这会花费{you_lower}{cost}年宝贵的研究时间。',
        'community.butWait': '但是等等...{you_lower}有个{student}可以替{your}去！',
        'community.whatWillYouDo': '{you_lower}会怎么做？',
        'community.buttonSacrifice': '牺牲{student}',
        'community.buttonDoItMyself': '自己去',
        'community.sacrificedTitle': '学生被牺牲了',
        'community.threwUnderBus': '{you}把{your}的{student}推出去顶锅了！',
        'community.pickingLitter': '他们现在整天在捡垃圾，而不是做研究。',
        'community.crushingDreams': '学术圈：通过摧毁梦想来培养品格！',
        'community.buttonNoRegrets': '不后悔',
        'community.noblyChose': '{you}高尚地选择了自己去做社区服务。',
        'community.agingFromTasks': '+{cost}年，浪费在无聊的行政任务上。',
        'community.studentGrateful': '{your}学生很感激...暂时。',
        'community.buttonIntegrity': '正直？',
        'community.noStudents': '{you}被分配了强制社区服务！',
        'community.agingFromForms': '+{cost}年，浪费在填表和参加各种培训上。',
        'community.ifOnlyStudent': '要是{you_lower}有个研究生可以推出去顶锅就好了...',
        'community.buttonSuchIsLife': '人生如此',

        // === NPC TURN ===
        'npc.name': '科学不确定性',
        'npc.turnMessage': '科学不确定性正在行动...',
        'npc.modalTitle': '宇宙在做决定...',
        'npc.moves': '科学不确定性在移动...',
        'npc.rolled': '科学不确定性掷出了{roll}',
        'npc.landedNothing': '科学不确定性落在了"{space}" - 这里什么也没发生。',

        // === THEORY ESTABLISHED ===
        'theory.establishedTitle': '理论建立了！',
        'theory.validated': '科学不确定性验证了一个假说！',
        'theory.nowEstablished': '这现在是一个关于{entity}的已建立理论！',
        'theory.publishedEarned': '{author}发表了论文，获得了{fame}点声望！',
        'theory.buttonHistoric': '历史性的！',

        // === DICE ROLLING ===
        'dice.rolling': '掷骰中...',
        'dice.result': '你掷出了{roll}！',
        'dice.buttonGo': '出发！',

        // === GAME OVER ===
        'gameover.title': '游戏结束',
        'gameover.synthesizing': '正在合成突破性发现...',
        'gameover.playAgain': '再玩一局！',
        'gameover.shareResults': '分享结果',
        'gameover.winner': '获胜者: {name}',
        'gameover.allDead': '所有人都死了！科学在没有他们的情况下继续前进。',
        'gameover.finalFame': '最终声望: {fame}',
        'gameover.theoriesCount': '理论数: {count}',

        // === LOG MESSAGES ===
        'log.landed': '{name}落在了"{space}"（{type}）',
        'log.proposed': '{name}提出了: "{hypothesis}"，投入了{years}年。',
        'log.expanded': '{name}扩展了假说: "{addition}"',
        'log.invested': '{name}在假说上投入了{years}年。',
        'log.hired': '{name}用{cost}声望雇佣了一个{student}。',
        'log.sacrificed': '{name}牺牲了他们的{student}来逃避社区服务！',
        'log.visitedOwn': '{name}参观了自己建立的理论。',
        'log.surveyedLiterature': '{name}不情愿地做了文献调研: "{hypothesis}"',
        'log.eurekaFree': '{name}灵光一闪，用"{hypothesis}"认领了"{space}"（免费！）',
        'log.theoryProven': '理论: "{hypothesis}"被证实了！{author}获得了{fame}点声望！',
        'log.passedAway': '{name}在{age}岁时去世了。他们通过{count}个理论留下了自己的遗产。',

        // === AI PROVIDERS ===
        'ai.gpt': 'GPT',
        'ai.claude': 'Claude',
        'ai.gemini': 'Gemini',
        'ai.templates': '模板',
        'ai.status': 'AI: {provider}',

        // === LANGUAGE ===
        'lang.english': 'English',
        'lang.chinese': '中文',
        'lang.switch': '语言'
    }
};

// ============================================
// TRANSLATION SYSTEM
// ============================================
let currentLanguage = 'en';

/**
 * Get a translated string by key
 * @param {string} key - The translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} The translated string
 */
function t(key, params = {}) {
    let text = translations[currentLanguage]?.[key] || translations['en']?.[key] || key;

    // Replace parameters in the text
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }

    return text;
}

/**
 * Set the current language
 * @param {string} lang - Language code ('en' or 'zh')
 */
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('gameLanguage', lang);

        // Trigger UI refresh if game is initialized
        if (typeof refreshUILanguage === 'function') {
            refreshUILanguage();
        }
    }
}

/**
 * Get the current language
 * @returns {string} Current language code
 */
function getLanguage() {
    return currentLanguage;
}

/**
 * Initialize language from localStorage or browser preference
 */
function initLanguage() {
    const savedLang = localStorage.getItem('gameLanguage');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else {
        // Check browser language preference
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.startsWith('zh')) {
            currentLanguage = 'zh';
        } else {
            currentLanguage = 'en';
        }
    }
}

/**
 * Get a random item from an array of translation keys
 * @param {string} prefix - The key prefix (e.g., 'death.message')
 * @param {number} count - Number of items in the array
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} A random translated string
 */
function tRandom(prefix, count, params = {}) {
    const index = Math.floor(Math.random() * count) + 1;
    return t(`${prefix}${index}`, params);
}

/**
 * Refresh UI elements when language changes
 * Updates static text elements on the setup screen
 */
function refreshUILanguage() {
    // Update body class for font
    if (currentLanguage === 'zh') {
        document.body.classList.add('lang-zh');
    } else {
        document.body.classList.remove('lang-zh');
    }

    // Update language switcher buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update setup screen elements
    const titleEl = document.getElementById('game-title');
    if (titleEl) titleEl.textContent = t('setup.title');

    const subtitleEl = document.getElementById('game-subtitle');
    if (subtitleEl) subtitleEl.textContent = t('setup.subtitle');

    // Update section headers
    const researchTopicH2 = document.querySelector('.sticky-note.yellow h2');
    if (researchTopicH2) researchTopicH2.textContent = t('setup.researchTopic');

    const playersH2 = document.querySelector('.sticky-note.pink h2');
    if (playersH2) playersH2.textContent = t('setup.players');

    const boardConfigH2 = document.querySelector('.sticky-note.blue h2');
    if (boardConfigH2) boardConfigH2.textContent = '🗺️ ' + t('setup.boardConfig');

    // Update labels
    const whatStudyingLabel = document.querySelector('label[for="entity-name"]');
    if (whatStudyingLabel) whatStudyingLabel.textContent = t('setup.whatStudying');

    const entityInput = document.getElementById('entity-name');
    if (entityInput) entityInput.placeholder = t('setup.entityPlaceholder');

    const selectMapLabel = document.querySelector('label[for="map-select"]');
    if (selectMapLabel) selectMapLabel.textContent = t('setup.selectMap');

    const mapSelect = document.getElementById('map-select');
    if (mapSelect) {
        mapSelect.options[0].text = t('setup.defaultBoard');
        mapSelect.options[1].text = t('setup.customMap');
    }

    const mapTextarea = document.getElementById('map-text');
    if (mapTextarea) mapTextarea.placeholder = t('setup.mapPlaceholder');

    const ageLabel = document.querySelector('label[for="starting-age"]');
    if (ageLabel) ageLabel.textContent = t('setup.initialAge');

    // Update buttons
    const addPlayerBtn = document.getElementById('add-player-btn');
    if (addPlayerBtn) addPlayerBtn.textContent = t('setup.addPlayer');

    const removePlayerBtn = document.getElementById('remove-player-btn');
    if (removePlayerBtn) removePlayerBtn.textContent = t('setup.removePlayer');

    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) startGameBtn.textContent = '▶ ' + t('setup.startGame');

    // Update AI checkbox labels
    document.querySelectorAll('.ai-toggle').forEach(label => {
        const checkbox = label.querySelector('input');
        if (checkbox) {
            label.innerHTML = '';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + t('setup.ai')));
        }
    });

    // Update gameplay screen elements if visible
    const theoriesH3 = document.querySelector('#theories-panel h3');
    if (theoriesH3) theoriesH3.textContent = t('gameplay.establishedTheories');

    const scientistsH3 = document.querySelector('#players-panel h3');
    if (scientistsH3) scientistsH3.textContent = t('gameplay.scientists');

    const gameLogTitle = document.querySelector('.notepad-title');
    if (gameLogTitle) gameLogTitle.textContent = t('gameplay.gameLog');

    const rollDiceBtn = document.getElementById('roll-dice-btn');
    if (rollDiceBtn && !rollDiceBtn.disabled) {
        rollDiceBtn.textContent = '🎲 ' + t('gameplay.rollDice');
    }

    // Update mobile tab labels
    const mobilePlayersLabel = document.querySelector('[data-tab="players"] .tab-label');
    if (mobilePlayersLabel) mobilePlayersLabel.textContent = t('mobile.players');

    const mobileTheoriesLabel = document.querySelector('[data-tab="theories"] .tab-label');
    if (mobileTheoriesLabel) mobileTheoriesLabel.textContent = t('mobile.theories');

    const mobileLogLabel = document.querySelector('[data-tab="log"] .tab-label');
    if (mobileLogLabel) mobileLogLabel.textContent = t('mobile.log');

    const mobileRollLabel = document.querySelector('[data-tab="dice"] .tab-label');
    if (mobileRollLabel) mobileRollLabel.textContent = t('mobile.roll');

    // Update mobile panel headers
    const mobilePlayersH3 = document.querySelector('#mobile-players-panel h3');
    if (mobilePlayersH3) mobilePlayersH3.textContent = t('gameplay.scientists');

    const mobileTheoriesH3 = document.querySelector('#mobile-theories-panel h3');
    if (mobileTheoriesH3) mobileTheoriesH3.textContent = t('gameplay.establishedTheories');

    const mobileLogH3 = document.querySelector('#mobile-log-panel h3');
    if (mobileLogH3) mobileLogH3.textContent = t('gameplay.gameLog');

    // Update game over screen if visible
    const gameOverTitle = document.querySelector('#gameover-screen .hand-title');
    if (gameOverTitle) gameOverTitle.textContent = t('gameover.title');

    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) playAgainBtn.textContent = t('gameover.playAgain');

    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.textContent = t('gameover.shareResults');

    // Update theories list if visible
    if (typeof updateTheoriesList === 'function' && typeof GameState !== 'undefined' && GameState.theories) {
        updateTheoriesList();
    }

    // Update zoom control tooltips
    const zoomInBtn = document.getElementById('zoom-in-btn');
    if (zoomInBtn) zoomInBtn.title = t('gameplay.zoomIn');

    const zoomOutBtn = document.getElementById('zoom-out-btn');
    if (zoomOutBtn) zoomOutBtn.title = t('gameplay.zoomOut');

    const zoomResetBtn = document.getElementById('zoom-reset-btn');
    if (zoomResetBtn) zoomResetBtn.title = t('gameplay.resetZoom');
}

// Initialize language on load
initLanguage();

// Apply initial language settings when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(refreshUILanguage, 200);
    });
} else {
    setTimeout(refreshUILanguage, 200);
}
