var barney = {
	imgsrc: "../RPG-Game/assets/images/barney.jpg",
	name: "Barney",
	attackPower: 50,
	health: 100,
	chosen: false,
	id: 'hero-barney'
}

var willyWonka = {
	imgsrc: "../RPG-Game/assets/images/willywonka.jpg",
	name: "Willy  Wonka",
	attackPower: 50,
	health: 101,
	chose: false,
	id: 'hero-willywonka'
}

var mrRogers = {
	imgsrc: "../RPG-Game/assets/images/mrrogers.jpg",
	name: "Mr. Rogers",
	attackPower: 50,
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
var previousDiv;

var chosenHero;
var chosenEnemy;
var heroChosen = false;
var enemyChosen = false;
var won = false;
var defeated = false;

var statusRightCount = 0;
var statusLeftCount = 0;

var statusRightText = '';
var statusLeftText = '';

$(document).ready(function () {

	addFourthColumn('#middle-row');
	createHeroObjects();

	$('.hero').on("click", heroOnClick);

});

function heroOnClick() {

	console.log(this.id);
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

		console.log(enemyHeroes);
		heroChosen = true;

	} else if (heroChosen && !enemyChosen) {

		if (this != chosenHero) {

			$('#middle-row-center').append(this);
			chosenEnemy = this;

			console.log(previousDiv);

			updateStatusText('right', 'Your target is <strong>' + $(chosenEnemy).attr('name') + "</strong>");
			
			updateStatusText('right', 'Click him to attack!');
			enemyChosen = true;
		}



	} else if (heroChosen && enemyChosen) {
		if (this !== chosenHero && this === chosenEnemy && won === false && defeated === false) {
			attackEnemy();
		}

	}


}
function clearStatusText(position) {
	if (position === 'right') {
		statusRightText = '';
		$('#status-right').html(statusRightText);
	} else {
		statusLeftText = '';
		$('#status-right').html(statusLeftText);
	}
}
function updateStatusText(position, text) {
	if (position === 'right') {

		++statusRightCount;
		statusRightText += '<br>>' + text;
		$('#status-right').html(statusRightText);
		console.log(statusRightText);

		if (statusRightCount > 4) {
			statusRightText = statusRightText.slice(statusRightText.indexOf(">") + 1);
			console.log(statusRightText);
			$('#status-right').html(statusRightText);
		}

	} else {
		++statusLeftCount;
		statusLeftText += '<br>>' + text;
		$('#status-left').html(statusLeftText);

		if (statusLeftCount > 4) {
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
	var newHealth = $(chosenEnemy).attr('health') - $(chosenHero).attr('attack');

	if (newHealth < 0) {
		newHealth = 0;
	}
	$(chosenEnemy).attr('health', newHealth);
	console.log(newHealth);

	$('#health-' + $(chosenEnemy).attr('id')).text(newHealth);

	newHealth = $(chosenHero).attr('health') - $(chosenEnemy).attr('attack');

	if (newHealth < 0) {
		newHealth = 0;
	}

	$(chosenHero).attr('health', newHealth);
	console.log(newHealth);

	$('#health-' + $(chosenHero).attr('id')).text(newHealth);

	updateStatusText('left', "You hit " + $(chosenEnemy).attr('name') + " for <strong>" + $(chosenHero).attr('attack') + " damage!</strong> Remaining Health: <strong>" + $(chosenEnemy).attr('health') + "</strong>");

	updateStatusText('left', $(chosenEnemy).attr('name') + " hit you for <strong>" + $(chosenEnemy).attr('attack') + " damage!</strong> You have <strong>" + $(chosenHero).attr('health') + " health</strong> left!");
	if (parseInt($(chosenEnemy).attr('health')) === parseInt($(chosenHero).attr('health'))) {
		tie();
	} else if (parseInt($(chosenEnemy).attr('health')) < 1) {
		win();
	} else if (parseInt($(chosenHero).attr('health')) < 1) {
		defeat();
	}
}

function defeat() {
	clearStatusText('left');
	defeated = true;
	$(chosenHero).css('background-color', 'black');
	updateStatusText('left', 'You are defeated!');
	updateStatusText('right', 'Game Over');
}

function win() {
	clearStatusText('left');
	won = true;
	$(chosenEnemy).css('background-color', 'black');
	updateStatusText('left', 'You are winner!');
	updateStatusText('left', "<strong>" + $(chosenEnemy).attr('name') + "</strong> is defeat!");
}

function tie(){
	clearStatusText('right');
	clearStatusText('left');
	updateStatusText('left', 'You both died!');
	updateStatusText('right', 'Game Over');
	$(chosenEnemy).css('background-color', 'black');
	$(chosenHero).css('background-color', 'black');
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
		console.log($(hero).attr('name'));
		createdHeroes.push(hero);

		console.log(createdHeroes);
		// $(hero).on("click", function () {
		// 	if (!heroChosen) {
		// 		console.log(hero.id);
		// 		$(hero).attr('id', 'chosen-hero');
		// 		$(hero).attr('chosen', true);
		// 		chosenHero = hero;
		// 		heroChosen = true;
		// 		console.log(chosenHero.id);
		// 		console.log( $(chosenHero).attr('name') );
		// 		$('#bottom-row-center').append(chosenHero);
		// 	}
		// });

		$('#middle-row').children().eq(i).append(hero);

	}
}
