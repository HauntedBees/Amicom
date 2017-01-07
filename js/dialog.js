game.dialogs = [
	{next: 1, text: "Hello! Welcome to Pet Thing!"},
	{next: 2, text: "I'm your virtual pet now because hey, why not!"},
	{text: "Raise me well or I'll die and my blood will be on your hands!"},
	{text: "Welcome back!"},
	{text: "Hello again! Good to see you again!"},
	{text: "Long time no see!"},
	{text: "I couldn't eat another bite!"}, 
	{text: "I'm so hungry. Please feed me."}, 
	{text: "I could use some food!"}, 
	{text: "I am very ill. Why are you doing this to me?"}, 
	{text: "I don't feel too good."}, // 10
	{text: "I feel like I could lift a car!"},
	{text: "I need to exercise a bit more..."}, 
	{text: "I am a baby. I don't know things yet!"}, 
	{text: "The world is new and so am I!"}, 
	{text: "I want toys!"}, 
	{text: "I am a child."},
	{text: "Grown-ups don't understand!"},
	{text: "Business. Hmm hmm hmm."}, 
	{text: "I'm old"}, 
	{text: "I am so so happy."}, // 20
	{text: "I am happy."},
	{text: "I am very very sad."}, 
	{text: "I am sad."}, 
	{text: "Eh."}, 
	{text: "You're up late!"}, 
	{text: "Wow, you're early to rise!"}, 
	{text: "Good morning!"}, 
	{text: "Good afternoon!"}, 
	{text: "Good evening!"},
	{text: "It's a good night, isn't it?"}, // 30
	{text: "Blorp"},
	{next: 33, text: "I feel funny!"}, 
	{next: 34, evolving: true, text: "Woah!"}, 
	{text: "I'm a big kid now!"},
	{text: "Did you know there are lots of different kinds of bees?"}, 
	{text: "Bread is an important staple food."}, 
	{text: "Baseball is a sport."}, 
	{text: "If you put a turtle on your head, you can have a turtle hat!"}, 
	{text: "I believe in you!"}, 
	{text: "Do you cut your sandwiches diagonally?", options: [
		{value: "Yes", next: 41}, 
		{value: "No", next: 42}
	]}, // 40
	{text: "Great! You should give me half next time!"}, 
	{text: "What...? Why?", mood: -0.1}, 
	{text: "How does a polar bear know what apples is?"}, 
	{text: "Be safe!"}, 
	{text: "Milk is dairy good for you."}, 
	{text: "Which of these foods sounds the most appealing to you right now?", options: [
		{value: "Meat", next: 47}, 
		{value: "Something sugary", next: 48}, 
		{value: "Ice cream", next: 49}, 
		{value: "Something salty", next: 51}, 
		{value: "Pasta", next: 52}, 
		{value: "Anything and everything", next: 53}
	]}, 
	{text: "That means you might be angry right now!"}, 
	{text: "That means you might be depressed right now!"}, 
	{text: "That means you might be anxious right now!"}, 
	{text: "Man, I do not even begin to care."}, // 50 
	{text: "That means you might be stressed right now!"}, 
	{text: "That means you might be lonely right now!"}, 
	{text: "That means you might be feeling jealous right now!"}, 
	{text: "Keep on rocking!"}, 
	{text: "Remember to save the bees!"}, 
	{text: "Don't forget to bring snacks with you when you're going to be out for a while!"}, 
	{text: "Cookie dough is a sometimes food."}, 
	{text: ""}, 
	{text: ""}, 
	{text: ""} // 60
];
game.starters = {
	"evolving": [32],
	"_": [31, 35, 36, 37, 38, 39, 40, 43, 44, 45, 46, 54, 55, 56, 57], // 15
	"_shortReturn": [3],
	"_midReturn": [4],
	"_longReturn": [5],
	"_full": [6],
	"_starving": [7],
	"_hungry": [8],
	"_dying": [9],
	"_unhealthy": [10],
	"_fit": [11],
	"_unfit": [12],
	"_newborn": [13],
	"_baby": [14],
	"_infant": [15],
	"_child": [16],
	"_teenager": [17],
	"_adult": [18],
	"_old": [19],
	"_ecstatic": [20],
	"_happy": [21],
	"_depressed": [22],
	"_sad": [23],
	"_indifferent": [24, 50],
	"_lateNight": [25],
	"_earlyMorning": [26],
	"_morning": [27],
	"_noon": [28],
	"_evening": [29],
	"_night": [30]
};