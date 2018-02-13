
//Objects which are the base of the Hero div that will be created
var barney = {
	imgsrc: "../RPG-Game/assets/images/barney.jpg",
	name: "Barney",
	attackPower: 2500,
	health: 8800,
	chosen: false,
	id: 'hero-barney'
}

var willyWonka = {
	imgsrc: "../RPG-Game/assets/images/willywonka.jpg",
	name: "Willy  Wonka",
	attackPower: 2400,
	health: 6500,
	chose: false,
	id: 'hero-willywonka'
}

var mrRogers = {
	imgsrc: "../RPG-Game/assets/images/mrrogers.jpg",
	name: "Mr. Rogers",
	attackPower: 2350,
	health: 7500,
	chosen: false,
	id: 'hero-mrrogers'
}

var santa = {
	imgsrc: "../RPG-Game/assets/images/santa.jpg",
	name: "Santa",
	attackPower: 1667,
	health: 13000,
	chosen: false,
	id: 'hero-santa'
}

var imageWidth = '60%';
var imageHeight = '60%';

//Arrays to hold heroes/enemies
var heroes = [barney, willyWonka, mrRogers, santa];
var createdHeroes = [];
var enemyHeroes = [];
var enemyHeroesDefeated = [];

//Variables to store the active heroes and bools that control the flow of the game
var chosenHero;
var chosenEnemy;
var heroChosen = false;
var enemyChosen = false;
var won = false;
var defeated = false;
var click = false;

var enemiesDefeated = 0;
var statusRightCount = 0;
var statusLeftCount = 0;

var statusRightText = '';
var statusLeftText = '';

//Starts when the document is ready
$(document).ready(function () {
	//Add a fourth column to the middle row to hold hero choices
	addFourthColumn('#middle-row');
	//Creates the hero objects
	createHeroObjects();
	updateStatusText('right', 'Welcome! To get started choose a hero to play');
	updateStatusText('left', "It's really a puzzle game, though.");
	//Hero on click function
	$('.hero').on("click", heroOnClick);
	//Document on click resets the game after clicking anywhere
	$(document).on("click", function () {
		if (defeated === true) {
			if (click === true) {
				reset();
				click = false;
			} else {
				click = true;

			}
		}

	})

});


//Controls the flow of the game by changing the way clicking on a hero works
function heroOnClick() {
	//When the hero has not yet been chosen
	if (!heroChosen) {
		removeFourthColumn('#middle-row');
		chosenHero = this;
		$('#bottom-row-center').append(chosenHero);

		//Put the enemies into an array
		$.each(createdHeroes, function (index, current) {
			if (current !== chosenHero) {

				enemyHeroes.push(current);
			}
		});

		//Change each enemies' background color to red and add them to the top row
		$.each(enemyHeroes, function (index, current) {
			$(current).css('background-color', 'red');
			$('#top-row').children().eq(index).append(current);
		});

		startingText();
		heroChosen = true;

		//If the hero has been chosen but the enemy has not been chosen
	} else if (heroChosen && !enemyChosen) {

		clearStatusText('right');

		//If the hero pressed is not the chosen hero and not a defeated enemy
		if (this != chosenHero && !enemyHeroesDefeated.includes(this)) {

			$('#middle-row-center').append(this);
			chosenEnemy = this;

			updateStatusText('right', 'Your target is <strong>' + $(chosenEnemy).attr('name') + "</strong>");

			updateStatusText('right', 'Click him to attack!');
			enemyChosen = true;

		}

		//If the hero and enemy have both been chosen
	} else if (heroChosen && enemyChosen) {
		if (this !== chosenHero && this === chosenEnemy && defeated === false) {
			//Attack function is called
			attackEnemy();
		}
	}
}

//Icreases the attack power for every enemy killed
function updateAttackPower() {
	if (enemiesDefeated === 1) {
		var newPower = parseInt($(chosenHero).attr('attack')) + 1000;
		$(chosenHero).attr('attack', newPower);
	}
	else if (enemiesDefeated === 2) {
		var newPower = parseInt($(chosenHero).attr('attack')) + 3000;
		$(chosenHero).attr('attack', newPower);
	}
}

//Changes status panel text to the starting text
function startingText() {
	clearStatusText('right');
	updateStatusText('right', "Great! All other heroes are now enemies.");
	updateStatusText('right', "Every character has their own health and attack power");
	updateStatusText('right', "Your attack power increases with each enemy you defeat.");
	updateStatusText('right', "Find the correct combination and defeat all enemies!");
	updateStatusText('left', "Choose an enemy to fight");
}

//Clears the status panel of all text
function clearStatusText(position) {
	if (position === 'right') {
		statusRightText = '';
		$('#status-right').html(statusRightText);
		statusRightCount = 0;
	} else {
		statusLeftText = '';
		$('#status-right').html(statusLeftText);
		statusLeftCount = 0;
	}
}

//Updates the status text boxes with new text. Removes the oldest line of text to make room for another line. Arguments: position - left or right; text - The text to update
function updateStatusText(position, text) {
	if (position === 'right') {

		++statusRightCount;
		statusRightText += '<br>>' + text;
		$('#status-right').html(statusRightText);
		console.log(statusRightText);

		if (statusRightCount > 6) {
			statusRightText = statusRightText.slice(statusRightText.indexOf(">") + 1);
			console.log(statusRightText);
			$('#status-right').html(statusRightText);
		}

	} else {
		++statusLeftCount;
		statusLeftText += '<br>>' + text;
		$('#status-left').html(statusLeftText);

		if (statusLeftCount > 6) {
			statusLeftText = statusLeftText.slice(statusLeftText.indexOf("r>") + 1);
			$('#status-left').html(statusLeftText);
		}
	}
}

//Adds a fourth column to the row argument. Needed to display all heroes at the beginning of the game
function addFourthColumn(row) {
	var newColumn = document.createElement("div");
	$(newColumn).attr('id', row + 'fourth-column');
	$(newColumn).addClass('col-md-3');

	$(row).append(newColumn);

	$('#middle-row-left').addClass('col-md-3');
	$('#middle-row-left').removeClass('col-md-4');

	$('#middle-row-right').addClass('col-md-3');
	$('#middle-row-right').removeClass('col-md-4');

	$('#middle-row-center').addClass('col-md-3');
	$('#middle-row-center').removeClass('col-md-4');

}

//Removes the fourth column from the selected row
function removeFourthColumn(row) {
	$(row + '#fourth-column').remove();

	$('#middle-row-left').addClass('col-md-4');
	$('#middle-row-left').removeClass('col-md-3');

	$('#middle-row-right').addClass('col-md-4');
	$('#middle-row-right').removeClass('col-md-3');

	$('#middle-row-center').addClass('col-md-4');
	$('#middle-row-center').removeClass('col-md-3');
}

//Attack/counterattacks happen here.
function attackEnemy() {
	//New health based on attack/counterattack
	var newEnemyHealth = $(chosenEnemy).attr('health') - $(chosenHero).attr('attack');
	var newHealth = $(chosenHero).attr('health') - $(chosenEnemy).attr('attack');

	//If health falls below zero set health to 0
	if (newEnemyHealth < 0) {
		newEnemyHealth = 0;
	}
	$(chosenEnemy).attr('health', newEnemyHealth);

	//Updates the health element with new health
	$('#health-' + $(chosenEnemy).attr('id')).text(newEnemyHealth);

	updateStatusText('left', "You hit " + $(chosenEnemy).attr('name') + " for <strong>" + $(chosenHero).attr('attack') + " damage!</strong> Remaining Health: <strong>" + $(chosenEnemy).attr('health') + "</strong>");

	//Because of the counterattack mechanics, we will not update the players hp when  he defeats an enemy. An enemy cannot counterattack if he is dead.
	if (newEnemyHealth !== 0) {

		if (newHealth < 0) {
			newHealth = 0;
		} else {
			$('#health-' + $(chosenHero).attr('id')).text(newHealth);
		}

		$(chosenHero).attr('health', newHealth);

		updateStatusText('left', $(chosenEnemy).attr('name') + " counterattacks for <strong>" + $(chosenEnemy).attr('attack') + " damage!</strong> You have <strong>" + $(chosenHero).attr('health') + " health</strong> left!");

	}

	//If someone's health drops below zero, win or lose the game
	if (parseInt($(chosenEnemy).attr('health')) < 1) {
		win();
	} else if (parseInt($(chosenHero).attr('health')) < 1) {
		defeat();
	}
}

//Updates status text saying you are defeated and sets defeated to true. Also sets the deceased player's background color to black
function defeat() {
	clearStatusText('right');
	defeated = true;
	$(chosenHero).css('background-color', 'black');
	updateStatusText('left', 'You are defeated!');
	updateStatusText('right', 'Game Over');
	updateStatusText('right', 'Click anywhere to restart');
}

//Updates status text saying you have won and turns the defeated opponent's background color to black
function win() {
	$(chosenEnemy).css('background-color', 'black');
	updateStatusText('left', 'You are winner!');
	updateStatusText('left', "<strong>" + $(chosenEnemy).attr('name') + "</strong> is defeat!");
	//If you win  you fight the next enemy
	nextEnemy();
}

//What happens when you win the match and must choose a new enemy.
function nextEnemy() {
	clearStatusText('right');
	updateStatusText('right', "Click on your next enemy to fight!");
	enemiesDefeated++;
	updateAttackPower();
	//If you have defeated 3 enemies you win the game
	if (enemiesDefeated > 2) {
		gameWin();
	}
	//Otherwise put the enemy back into its original spot
	else {
		$('#top-row').children('div').each(function () {
			if ($(this).children().length < 1) {
				$(this).append(chosenEnemy);
			}
		});
		//Defeated enemies and chosen enemy updated
		enemyHeroesDefeated.push(chosenEnemy);
		enemyChosen = false;

	}

}

//Winning the game triggers this function
function gameWin() {
	clearStatusText('right');
	updateStatusText('right', "You Win! Click anywhere to play again.");
	defeated = true;
}

//Resets the game to be played again
function reset() {
	addFourthColumn();
	for (var i = 0; i < heroes.length; ++i) {
		$('#middle-row').children().eq(i).append(createdHeroes[i]);

		$(createdHeroes[i]).css('background-color', 'green');
		$(createdHeroes[i]).attr('health', heroes[i].health);

		$('#health-' + $(createdHeroes[i]).attr('id')).text(heroes[i].health);
	}
	clearStatusText('right');
	clearStatusText('left');
	updateStatusText('right', 'Welcome! To get started choose a hero to play');
	updateStatusText('left', "It's really a puzzle game, though.");
	enemyHeroes = [];
	defeated = false;
	heroChosen = false;
	enemyHeroesDefeated = [];
	enemiesDefeated = 0;
	enemyChosen = false;
}

//Creates all the hero objects based on the objects created at the top of this file
function createHeroObjects() {

	for (var i = 0; i < heroes.length; ++i) {
		//Create the elements needed to show a hero onscreen
		var hero = document.createElement('div');
		var heroImage = document.createElement('img');
		var name = document.createElement('h4');
		var health = document.createElement('h5');

		//Change text and health elements to predetermined variables
		$(name).text(heroes[i].name);
		$(health).text(heroes[i].health);

		//Image attributes
		$(heroImage).css('width', imageWidth);
		$(heroImage).css('height', imageHeight);
		$(heroImage).attr('src', heroes[i].imgsrc);

		//Appending to the hero object (which is a div)
		$(hero).append(name);
		$(hero).append(heroImage);
		$(hero).append(health);

		//Setting all the heroes' attributes
		$(hero).attr('id', heroes[i].id);
		$(hero).attr('health', heroes[i].health);
		$(hero).attr('name', heroes[i].name);
		$(hero).attr('chosen', heroes[i].chosen);
		$(hero).attr('attack', heroes[i].attackPower);

		$(health).attr('id', 'health-' + heroes[i].id);

		//Add CSS styling to the hero object 
		$(hero).css('background-color', 'green');
		$(hero).css('width', imageWidth);
		$(hero).css('border', '2px solid black');
		$(hero).addClass('hero');
		$(hero).addClass('container');

		//Adding created hero to the createdHeroes array
		createdHeroes.push(hero);

		$('#middle-row').children().eq(i).append(hero);

	}
}
