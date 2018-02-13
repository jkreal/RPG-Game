var barney = {
	imgsrc: "../RPG-Game/assets/images/barney.jpg",
	name: "Barney",
	attackPower: 5,
	health: 100,
	chosen: false,
	id: 'hero-barney'
}

var willyWonka = {
	imgsrc: "../RPG-Game/assets/images/willywonka.jpg",
	name: "Willy  Wonka",
	attackPower: 5,
	health: 101,
	chose: false,
	id: 'hero-willywonka'
}

var mrRogers = {
	imgsrc: "../RPG-Game/assets/images/mrrogers.jpg",
	name: "Mr. Rogers",
	attackPower: 5,
	health: 102,
	chosen: false,
	id: 'hero-mrrogers'
}

var santa = {
	imgsrc: "../RPG-Game/assets/images/santa.jpg",
	name: "Santa",
	attackPower: 50,
	health: 103,
	chosen: false,
	id: 'hero-santa'
}

var imageWidth = '60%';
var imageHeight = '60%';

var heroes = [barney, willyWonka, mrRogers, santa];
var createdHeroes = [];
var enemyHeroes = [];
var enemyHeroesDefeated = [];

var chosenHero;
var chosenEnemy;
var heroChosen = false;
var enemyChosen = false;
var won = false;
var defeated = false;

var enemiesDefeated = 0;
var statusRightCount = 0;
var statusLeftCount = 0;

var statusRightText = '';
var statusLeftText = '';

$(document).ready(function () {

	addFourthColumn('#middle-row');
	createHeroObjects();
	updateStatusText('right', 'Welcome! To get started choose a hero to play');
	updateStatusText('left', "It's really a puzzle game, though.");
	$('.hero').on("click", heroOnClick);
	$(document).on("click", function () {
		if (defeated === true) {
			if (won === true) {
				reset();
				won = false;
			}
			won = true;
		}

	})

});


function heroOnClick() {

	if (!heroChosen) {
		removeFourthColumn('#middle-row');
		chosenHero = this;
		$('#bottom-row-center').append(chosenHero);

		$.each(createdHeroes, function (index, current) {
			if (current !== chosenHero) {

				enemyHeroes.push(current);
			}
		});

		$.each(enemyHeroes, function (index, current) {
			$(current).css('background-color', 'red');
			$('#top-row').children().eq(index).append(current);
		});

		startingText();
		heroChosen = true;

	} else if (heroChosen && !enemyChosen) {

		clearStatusText('right');
		if (this != chosenHero && !enemyHeroesDefeated.includes(this)) {

			if (enemiesDefeated > 0) {
			}
			$('#middle-row-center').append(this);
			chosenEnemy = this;

			updateStatusText('right', 'Your target is <strong>' + $(chosenEnemy).attr('name') + "</strong>");

			updateStatusText('right', 'Click him to attack!');
			enemyChosen = true;

		}


	} else if (heroChosen && enemyChosen) {
		if (this !== chosenHero && this === chosenEnemy && defeated === false) {
			attackEnemy();
		}
	}
}

function startingText(){
	clearStatusText('right');
	updateStatusText('right', "Great! All other heroes are now enemies.");
	updateStatusText('right', "Every character has their own health and attack power");
	updateStatusText('right', "Your attack power increases with each enemy you defeat.");
	updateStatusText('right', "Find the correct combination and defeat all enemies!");
	updateStatusText('left', "Choose an enemy to fight");
}
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

function removeFourthColumn(row) {
	$(row + '#fourth-column').remove();

	$('#middle-row-left').addClass('col-md-4');
	$('#middle-row-left').removeClass('col-md-3');

	$('#middle-row-right').addClass('col-md-4');
	$('#middle-row-right').removeClass('col-md-3');

	$('#middle-row-center').addClass('col-md-4');
	$('#middle-row-center').removeClass('col-md-3');
}

function attackEnemy() {
	var newEnemyHealth = $(chosenEnemy).attr('health') - $(chosenHero).attr('attack');
	var newHealth = $(chosenHero).attr('health') - $(chosenEnemy).attr('attack');

	if (newEnemyHealth < 0) {
		newEnemyHealth = 0;
	}
	$(chosenEnemy).attr('health', newEnemyHealth);

	$('#health-' + $(chosenEnemy).attr('id')).text(newEnemyHealth);

	if (newHealth < 0) {
		newHealth = 0;
	} else {
		$('#health-' + $(chosenHero).attr('id')).text(newHealth);
	}

	$(chosenHero).attr('health', newHealth);

	updateStatusText('left', "You hit " + $(chosenEnemy).attr('name') + " for <strong>" + $(chosenHero).attr('attack') + " damage!</strong> Remaining Health: <strong>" + $(chosenEnemy).attr('health') + "</strong>");

	updateStatusText('left', $(chosenEnemy).attr('name') + " hit you for <strong>" + $(chosenEnemy).attr('attack') + " damage!</strong> You have <strong>" + $(chosenHero).attr('health') + " health</strong> left!");

	if (parseInt($(chosenEnemy).attr('health')) < 1) {
		win();
	} else if (parseInt($(chosenHero).attr('health')) < 1) {
		defeat();
	}
}

function defeat() {
	clearStatusText('right');
	defeated = true;
	$(chosenHero).css('background-color', 'black');
	updateStatusText('left', 'You are defeated!');
	updateStatusText('right', 'Game Over');
	updateStatusText('right', 'Click anywhere to restart');
}

function win() {
	$(chosenEnemy).css('background-color', 'black');
	updateStatusText('left', 'You are winner!');
	updateStatusText('left', "<strong>" + $(chosenEnemy).attr('name') + "</strong> is defeat!");
	nextEnemy();
}

function nextEnemy() {
	clearStatusText('right');
	updateStatusText('right', "Click on your next enemy to fight!");
	enemiesDefeated++;
	if (enemiesDefeated > 2) {
		gameWin();
	}
	else {
		$('#top-row').children('div').each(function () {
			if ($(this).children().length < 1) {
				$(this).append(chosenEnemy);
			}
		});
		enemyHeroesDefeated.push(chosenEnemy);
		enemyChosen = false;

	}

}

function gameWin() {
	clearStatusText('right');
	updateStatusText('right', "You Win! Click anywhere to play again.");
	defeated = true;
}

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


function createHeroObjects() {

	for (var i = 0; i < heroes.length; ++i) {

		var hero = document.createElement('div');
		var heroImage = document.createElement('img');
		var name = document.createElement('h4');
		var health = document.createElement('h5');


		$(name).text(heroes[i].name);
		$(health).text(heroes[i].health);

		$(heroImage).css('width', imageWidth);
		$(heroImage).css('height', imageHeight);
		$(heroImage).attr('src', heroes[i].imgsrc);

		$(hero).append(name);
		$(hero).append(heroImage);
		$(hero).append(health);
		$(hero).attr('id', heroes[i].id);

		$(health).attr('id', 'health-' + heroes[i].id);

		$(hero).attr('health', heroes[i].health);
		$(hero).attr('name', heroes[i].name);
		$(hero).attr('chosen', heroes[i].chosen);
		$(hero).attr('attack', heroes[i].attackPower);

		$(hero).css('background-color', 'green');
		$(hero).css('width', imageWidth);
		$(hero).css('border', '2px solid black');
		$(hero).addClass('hero');
		$(hero).addClass('container');
		console.log($(hero).attr('name'));
		createdHeroes.push(hero);

		console.log(createdHeroes);

		$('#middle-row').children().eq(i).append(hero);

	}
}
