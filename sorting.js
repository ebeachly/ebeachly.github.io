var ManaCost = function(manaCostString)
{
	this.generic = 0;
	this.w = 0;
	this.u = 0;
	this.b = 0;
	this.r = 0;
	this.g = 0;
	this.c = 0;
	this.wu = 0;
	this.ub = 0;
	this.br = 0;
	this.rg = 0;
	this.gw = 0;
	this.wb = 0;
	this.ur = 0;
	this.bg = 0;
	this.rw = 0;
	this.gu = 0;
	this.total = 0;
	this.colorBitVector = 0;
	this.coloredSymbolBitVectors = [];

	if(manaCostString != null)
	{
		var lc_manaCostString = manaCostString.toLowerCase();
		for (var c = 0; c < lc_manaCostString.length; ++c)
		{
			//Is this character a number?
			if (lc_manaCostString.charCodeAt(c) >= "0".charCodeAt(0) &&
				lc_manaCostString.charCodeAt(c) <= "9".charCodeAt(0))
			{
				//Add this digit to the running generic mana cost
				this.generic = this.generic * 10 + lc_manaCostString.charCodeAt(c) - "0".charCodeAt(0);
			} else if (lc_manaCostString[c] == 'w') {
				this.w++;
				this.colorBitVector |= 0x01;
				this.coloredSymbolBitVectors.push(0x01);
			} else if (lc_manaCostString[c] == 'u') {
				this.u++;
				this.colorBitVector |= 0x02;
				this.coloredSymbolBitVectors.push(0x02);
			} else if (lc_manaCostString[c] == 'b') {
				this.b++;
				this.colorBitVector |= 0x04;
				this.coloredSymbolBitVectors.push(0x04);
			} else if (lc_manaCostString[c] == 'r') {
				this.r++;
				this.colorBitVector |= 0x08;
				this.coloredSymbolBitVectors.push(0x08);
			} else if (lc_manaCostString[c] == 'g') {
				this.g++;
				this.colorBitVector |= 0x10;
				this.coloredSymbolBitVectors.push(0x10);
			} else if (lc_manaCostString[c] == 'c') {
				this.c++;
				this.colorBitVector |= 0x20;
				this.coloredSymbolBitVectors.push(0x20);
			} else if (lc_manaCostString[c] == '{' && (c+5) <= lc_manaCostString.length) {
				var substring = lc_manaCostString.substring(c,c+5);
				if ( substring       == "{w/u}") {
					this.wu++;
					this.colorBitVector |= 0x03;
					this.coloredSymbolBitVectors.push(0x03);
				} else if (substring == "{u/b}") {
					this.ub++;
					this.colorBitVector |= 0x06;
					this.coloredSymbolBitVectors.push(0x06);
				} else if (substring == "{b/r}") {
					this.br++;
					this.colorBitVector |= 0x0C;
					this.coloredSymbolBitVectors.push(0x0C);
				} else if (substring == "{r/g}") {
					this.rg++;
					this.colorBitVector |= 0x18;
					this.coloredSymbolBitVectors.push(0x18);
				} else if (substring == "{g/w}") {
					this.gw++;
					this.colorBitVector |= 0x11;
					this.coloredSymbolBitVectors.push(0x11);
				} else if (substring == "{w/b}") {
					this.wb++;
					this.colorBitVector |= 0x05;
					this.coloredSymbolBitVectors.push(0x05);
				} else if (substring == "{u/r}") {
					this.ur++;
					this.colorBitVector |= 0x0A;
					this.coloredSymbolBitVectors.push(0x0A);
				} else if (substring == "{b/g}") {
					this.bg++;
					this.colorBitVector |= 0x14;
					this.coloredSymbolBitVectors.push(0x14);
				} else if (substring == "{r/w}") {
					this.rw++;
					this.colorBitVector |= 0x09;
					this.coloredSymbolBitVectors.push(0x09);
				} else if (substring == "{g/u}") {
					this.gu++;
					this.colorBitVector |= 0x12;
					this.coloredSymbolBitVectors.push(0x12);
				}
				c += 4;
			}
		}
		this.total = this.generic + this.w + this.u + this.b + this.r + this.g + this.c + this.wu + this.ub + this.br + this.rg + this.gw + this.wb + this.ur + this.bg + this.rw + this.gu;
	}
}

function manaCostsAreEqual(a, b)
{
	if (a.total != b.total ||
		a.generic != b.generic ||
		a.w != b.w ||
		a.u != b.u ||
		a.b != b.b ||
		a.r != b.r ||
		a.g != b.g ||
		a.wu != b.wu ||
		a.ub != b.ub ||
		a.br != b.br ||
		a.rg != b.rg ||
		a.gw != b.gw ||
		a.wb != b.wb ||
		a.ur != b.ur ||
		a.bg != b.bg ||
		a.rw != b.rw ||
		a.gu != b.gu
		)
	{
		return false;
	} else {
		return true;
	}
}

function getTotalCost(cardElement)
{
	if (cardElement.getAttribute('token') == 'true')
	{
		return 1000000000000;
	} else if (cardElement.getAttribute('land') == 'true') {
		return -1;
	} else {
		var cost = new ManaCost(cardElement.getAttribute('casting_cost'));
		return cost.total;
	}
}

function getTotalCostLabel(cardElement)
{
	if (cardElement.getAttribute('token') == 'true')
	{
		return "Token";
	} else if (cardElement.getAttribute('land') == 'true') {
		return "Land";
	} else {
		var cost = new ManaCost(cardElement.getAttribute('casting_cost'));
		return String(cost.total) + " Mana";
	}
}

colorOrderLookupTable = [ 1,  2,  3,  7,  4, 12,  8, 17, 5, 16, 15, 22,  9, 24, 18, 31, 6, 11, 14, 21, 13, 26, 23, 30, 10, 20, 25, 29, 19, 28, 27, 32, 33, 34, 35, 39, 36, 44, 40, 49, 37, 48, 47, 54, 41, 56, 50, 63, 38, 43, 46, 53, 45, 58, 55, 62, 42, 52, 57, 61, 51, 60, 59, 64];


function getColorOrder(cardElement)
{
	if (cardElement.getAttribute('token') == 'true')
	{
		return 65;
	}
	else if (cardElement.getAttribute('land') == 'true')
	{
		var manaProductionBitVector = parseInt(cardElement.getAttribute('mana_production_bitvector'));
		//Ignore colorless production
		if (manaProductionBitVector >= 32)
		{
			manaProductionBitVector = manaProductionBitVector - 32;
		}
		//Lands come after nonlands
		return (colorOrderLookupTable[manaProductionBitVector] + 100);
	} else {
		var cost = new ManaCost(cardElement.getAttribute('casting_cost'));
		return colorOrderLookupTable[cost.colorBitVector];
	}
}

function getColorLabel(cardElement)
{
	if (cardElement.getAttribute('token') == 'true')
	{
		return 'Token';
	}
	else if (cardElement.getAttribute('land') == 'true')
	{
		var manaProductionBitVector = parseInt(cardElement.getAttribute('mana_production_bitvector'));
		var colorLabelString = "";
		if (manaProductionBitVector & 0x01){colorLabelString += 'W';}
		if (manaProductionBitVector & 0x02){colorLabelString += 'U';}
		if (manaProductionBitVector & 0x04){colorLabelString += 'B';}
		if (manaProductionBitVector & 0x08){colorLabelString += 'R';}
		if (manaProductionBitVector & 0x10){colorLabelString += 'G';}
		if (colorLabelString == ""){colorLabelString += 'C';}

		colorLabelString += ' Land';
		return colorLabelString;
	} else {
		var cost = new ManaCost(cardElement.getAttribute('casting_cost'));
		var colorLabelString = "";
		if (cost.colorBitVector & 0x01){colorLabelString += 'W';}
		if (cost.colorBitVector & 0x02){colorLabelString += 'U';}
		if (cost.colorBitVector & 0x04){colorLabelString += 'B';}
		if (cost.colorBitVector & 0x08){colorLabelString += 'R';}
		if (cost.colorBitVector & 0x10){colorLabelString += 'G';}
		if (cost.colorBitVector & 0x20){colorLabelString += 'C';}
		if (colorLabelString == ""){colorLabelString = "Generic";}
		return colorLabelString;
	}
}

function getTypeOrder(cardElement)
{
	if (cardElement.getAttribute('token') == 'true') {
		return 7;
	} else if (cardElement.getAttribute('land') == 'true') {
		return -1;
	} else if (cardElement.getAttribute('creature') == 'true') {
		return 1;
	} else if (cardElement.getAttribute('planeswalker') == 'true') {
		return 2;
	} else if (cardElement.getAttribute('artifact') == 'true') {
		return 3;
	} else if (cardElement.getAttribute('enchantment') == 'true') {
		return 4;
	} else if (cardElement.getAttribute('sorcery') == 'true') {
		return 5;
	} else if (cardElement.getAttribute('instant') == 'true') {
		return 6;
	} else {
		return 8;
	}
}

function getTypeLabel(cardElement)
{
	if (cardElement.getAttribute('token') == 'true') {
		return 'Token';
	} else if (cardElement.getAttribute('land') == 'true') {
		return 'Land';
	} else if (cardElement.getAttribute('creature') == 'true') {
		return 'Creature';
	} else if (cardElement.getAttribute('planeswalker') == 'true') {
		return 'Planeswalker';
	} else if (cardElement.getAttribute('artifact') == 'true') {
		return 'Artifact';
	} else if (cardElement.getAttribute('enchantment') == 'true') {
		return 'Enchantment';
	} else if (cardElement.getAttribute('sorcery') == 'true') {
		return 'Sorcery';
	} else if (cardElement.getAttribute('instant') == 'true') {
		return 'Instant';
	} else {
		return'Unknown';
	}
}

function getPurposeLabel(cardElement)
{
	var purpose = cardElement.getAttribute('purpose');
	if (purpose == null || purpose == "")
	{
		purpose = getTypeLabel(cardElement);
	}
	return purpose;
}


function costSort()
{
	//Deselect any selected cards
	deselectAll();
	deleteAllCounters();
	deleteAllLabels();;

	//Get all the elements on the playmat
	var elementsOnMat = document.getElementById('playmat').getElementsByTagName('*');

	//Figure out which of the elements are cards
	var totalNontokenCards = 0;
	var cardsToSort = [];
	var i = 0;
	for (i = 0; i < elementsOnMat.length; ++i)
	{
		if (hasClass(elementsOnMat[i], "card"))
		{
			if (elementsOnMat[i].getAttribute("token") != 'true')
			{
				++totalNontokenCards;
			}
			cardsToSort.push(elementsOnMat[i]);
		}
	}

	//Label the size of the previous stack
	var totalSizelabel = Label("Total: " + String(totalNontokenCards));
	totalSizelabel.style.left = 0 + 'px';
	totalSizelabel.style.top = 30 + 'px';

	//Sort the cards by cost
	cardsToSort.sort(
		function(a,b){
			var ret = getTotalCost(a) - getTotalCost(b);
			if (ret == 0)
			{
				ret = getColorOrder(a) - getColorOrder(b);
				if (ret == 0)
				{
					var aName = a.getAttribute("name");
					var bName = b.getAttribute("name");
					if (aName != null && bName != null)
					{
						ret = aName.localeCompare(bName);
					} else {
						ret = 0;
					}
				}
			}
			return ret;
		}
	);

	//Arrange the cards on the mat
	var stackNum = 0;
	var previousCardValue = -9000;
	var stackHeight = 0;

	var xOffset = 50;
	var yOffset = 130;

	var stackSpacing = cardWidth + 10;

	for (i = 0; i < cardsToSort.length; ++i)
	{
		//Is this card of a different class?
		if (getTotalCost(cardsToSort[i]) != previousCardValue)
		{
			//Is this the end of a stack?
			if (stackHeight > 0)
			{
				//Label the size of the previous stack
				var sizelabel = Label(String(stackHeight));
				sizelabel.style.top = yOffset - 60 + 'px';
				sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			}

			//Create a new stack
			stackNum++;
			stackHeight = 0;
			var label = Label(getTotalCostLabel(cardsToSort[i]));
			label.style.top = yOffset - 30 + 'px';
			label.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			previousCardValue = getTotalCost(cardsToSort[i]);
		}
		//Add this card to the stack
		//Reveal the card
		cardsToSort[i].src = cardsToSort[i].getAttribute("front");
		//Put it into the deck
		cardsToSort[i].style.top = yOffset + nameHeight * stackHeight + 'px';
		cardsToSort[i].style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
		//Untap
		cardsToSort[i].className = cardsToSort[i].className.replace( /(?:^|\s)rotated(?!\S)/g , '' );
		//Bring it in front of the other elements
		cardsToSort[i].parentNode.appendChild(cardsToSort[i]);
		stackHeight++;
	}

	//Is this the end of a stack?
	if (stackHeight > 0)
	{
		//Label the size of the previous stack
		var sizelabel = Label(String(stackHeight));
		sizelabel.style.top = yOffset - 60 + 'px';
		sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
	}

	//Resize document to fit
	resizeDocument();
}

function typeSort()
{
	//Deselect any selected cards
	deselectAll();
	deleteAllCounters();
	deleteAllLabels();

	//Get all the elements on the playmat
	var elementsOnMat = document.getElementById('playmat').getElementsByTagName('*');

	//Figure out which of the elements are cards
	var totalNontokenCards = 0;
	var cardsToSort = [];
	var i = 0;
	for (i = 0; i < elementsOnMat.length; ++i)
	{
		if (hasClass(elementsOnMat[i], "card"))
		{
			if (elementsOnMat[i].getAttribute("token") != 'true')
			{
				++totalNontokenCards;
			}
			cardsToSort.push(elementsOnMat[i]);
		}
	}

	//Label the size of the previous stack
	var totalSizelabel = Label("Total: " + String(totalNontokenCards));
	totalSizelabel.style.left = 0 + 'px';
	totalSizelabel.style.top = 30 + 'px';

	//Sort the cards by type, then cost, then color, then name
	cardsToSort.sort(
		function(a,b){
			var ret = getTypeOrder(a) - getTypeOrder(b);
			if (ret == 0)
			{
				ret = getTotalCost(a) - getTotalCost(b);
				if (ret == 0)
				{
					ret = getColorOrder(a) - getColorOrder(b);
					if (ret == 0)
					{
						var aName = a.getAttribute("name");
						var bName = b.getAttribute("name");
						if (aName != null && bName != null)
						{
							ret = aName.localeCompare(bName);
						} else {
							ret = 0;
						}
					}
				}
			}
			return ret;
		}
	);

	//Arrange the cards on the mat
	var stackNum = 0;
	var previousCardValue = -9000;
	var stackHeight = 0;

	var xOffset = 50;
	var yOffset = 130;

	var stackSpacing = cardWidth + 10;

	for (i = 0; i < cardsToSort.length; ++i)
	{
		//Is this card of a different class?
		if (getTypeOrder(cardsToSort[i]) != previousCardValue)
		{
			//Is this the end of a stack?
			if (stackHeight > 0)
			{
				//Label the size of the previous stack
				var sizelabel = Label(String(stackHeight));
				sizelabel.style.top = yOffset - 60 + 'px';
				sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			}
			//Create a new stack
			stackNum++;
			stackHeight = 0;
			var label = Label(getTypeLabel(cardsToSort[i]));
			label.style.top = yOffset - 30 + 'px';
			label.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			previousCardValue = getTypeOrder(cardsToSort[i]);
		}
		//Add this card to the stack
		//Reveal the card
		cardsToSort[i].src = cardsToSort[i].getAttribute("front");
		//Put it into the deck
		cardsToSort[i].style.top = yOffset + nameHeight * stackHeight + 'px';
		cardsToSort[i].style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
		//Untap
		cardsToSort[i].className = cardsToSort[i].className.replace( /(?:^|\s)rotated(?!\S)/g , '' );
		//Bring it in front of the other elements
		cardsToSort[i].parentNode.appendChild(cardsToSort[i]);
		stackHeight++;
	}
	//Is this the end of a stack?
	if (stackHeight > 0)
	{
		//Label the size of the previous stack
		var sizelabel = Label(String(stackHeight));
		sizelabel.style.top = yOffset - 60 + 'px';
		sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
	}

	//Resize document to fit
	resizeDocument();
}

function colorSort()
{
	//Deselect any selected cards
	deselectAll();
	deleteAllCounters();
	deleteAllLabels();

	//Get all the elements on the playmat
	var elementsOnMat = document.getElementById('playmat').getElementsByTagName('*');

	//Figure out which of the elements are cards
	var totalNontokenCards = 0;
	var cardsToSort = [];
	var i = 0;
	for (i = 0; i < elementsOnMat.length; ++i)
	{
		if (hasClass(elementsOnMat[i], "card"))
		{
			if (elementsOnMat[i].getAttribute("token") != 'true')
			{
				++totalNontokenCards;
			}
			cardsToSort.push(elementsOnMat[i]);
		}
	}

	//Label the size of the previous stack
	var totalSizelabel = Label("Total: " + String(totalNontokenCards));
	totalSizelabel.style.left = 0 + 'px';
	totalSizelabel.style.top = 30 + 'px';

	//Sort the cards by color, then cost, then name
	cardsToSort.sort(
		function(a,b)
		{
			var ret = getColorOrder(a) - getColorOrder(b);
			if (ret == 0)
			{
				ret = getTotalCost(a) - getTotalCost(b);
				if (ret == 0)
				{
					var aName = a.getAttribute("name");
					var bName = b.getAttribute("name");
					if (aName != null && bName != null)
					{
						ret = aName.localeCompare(bName);
					} else {
						ret = 0;
					}
				}
			}
			return ret;
		}
	);

	//Figure out the necessary columns
	var columns = [];
	for (i = 0; i < 65; ++i)
	{
		columns.push(-1);
	}

	function getColumnId(colorOrder)
	{
		colorOrder = colorOrder - 1;
		if (colorOrder >= 100) {
			return colorOrder - 100;
		} else {
			return colorOrder;
		}
	}

	//Figure out which columns will have cards
	for (i = 0; i < cardsToSort.length; ++i)
	{
		columns[getColumnId(getColorOrder(cardsToSort[i]))] = 1;
	}

	//Number off the columns that have cards
	var columnNum = 0;
	for (i = 0; i < columns.length; ++i)
	{
		if (columns[i] == 1){
			columns[i] = columnNum;
			columnNum++;
		}
	}

	//Arrange the cards on the mat
	var previousCardValue = -9000;
	var row1Height = 0;
	var stackHeight = 0;
	var xOffset = 50;
	var yOffset = 130;
	var stackSpacing = cardWidth + 10;

	for (i = 0; i < cardsToSort.length; ++i)
	{
		//Is this card of a different color?
		if ( getColorOrder(cardsToSort[i]) != previousCardValue )
		{
			//Is this the end of a stack?
			if (stackHeight > 0)
			{
				//Label the size of the previous stack
				var sizelabel = Label(String(stackHeight));
				sizelabel.style.left = xOffset + stackSpacing * columns[getColumnId(getColorOrder(cardsToSort[i - 1]))] + 'px';
				if (getColorOrder(cardsToSort[i-1]) < 100)
				{
					sizelabel.style.top = yOffset - 60 + 'px';
				} else {
					sizelabel.style.top = yOffset + cardsToSort[i-1].clientHeight + nameHeight * row1Height + 60 - 60 + 'px';
				}
			}
			//Create a new stack
			stackHeight = 0;
			//Label it
			var label = Label(getColorLabel(cardsToSort[i]));
			label.style.left = xOffset + stackSpacing * columns[getColumnId(getColorOrder(cardsToSort[i]))] + 'px';
			if (getColorOrder(cardsToSort[i]) < 100)
			{
				label.style.top = yOffset + nameHeight * stackHeight - 30 + 'px';
			} else {
				label.style.top = yOffset + cardsToSort[i].clientHeight + nameHeight * row1Height + 60 - 30 + 'px';
			}
			previousCardValue = getColorOrder(cardsToSort[i]);
		}
		
		//Add this card to the stack
		//Reveal the card
		cardsToSort[i].src = cardsToSort[i].getAttribute("front");
		//Put it in its column
		cardsToSort[i].style.left = xOffset + stackSpacing * columns[getColumnId(getColorOrder(cardsToSort[i]))] + 'px';
		//Untap
		cardsToSort[i].className = cardsToSort[i].className.replace( /(?:^|\s)rotated(?!\S)/g , '' );
		
		//Check if this is part of row 1
		if ( getColorOrder(cardsToSort[i]) < 100 )
		{
			cardsToSort[i].style.top = yOffset + nameHeight * stackHeight + 'px';
			stackHeight++;
			//Save the height of the largest stack in row 1
			if (stackHeight > row1Height)
			{
				row1Height = stackHeight;
			}
		} else {
			cardsToSort[i].style.top = yOffset + cardsToSort[i].clientHeight +  nameHeight * row1Height + nameHeight * stackHeight + 60 + 'px';
			stackHeight++;
		}

		//Bring it in front of the other elements
		cardsToSort[i].parentNode.appendChild(cardsToSort[i]);
	}
	//Is this the end of a stack?
	if (stackHeight > 0)
	{
		//Label the size of the previous stack
		var sizelabel = Label(String(stackHeight));
		sizelabel.style.left = xOffset + stackSpacing * columns[getColumnId(getColorOrder(cardsToSort[i - 1]))] + 'px';
		if (getColorOrder(cardsToSort[i-1]) < 100)
		{
			sizelabel.style.top = yOffset - 60 + 'px';
		} else {
			sizelabel.style.top = yOffset + cardsToSort[i-1].clientHeight + nameHeight * row1Height + 60 - 60 + 'px';
		}
	}

	//Resize document to fit
	resizeDocument();
}

function purposeSort()
{
	//Deselect any selected cards
	deselectAll();
	deleteAllCounters();
	deleteAllLabels();

	//Get all the elements on the playmat
	var elementsOnMat = document.getElementById('playmat').getElementsByTagName('*');

	//Figure out which of the elements are cards
	var totalNontokenCards = 0;
	var cardsToSort = [];
	var i = 0;
	for (i = 0; i < elementsOnMat.length; ++i)
	{
		if (hasClass(elementsOnMat[i], "card"))
		{
			if (elementsOnMat[i].getAttribute("token") != 'true')
			{
				++totalNontokenCards;
			}
			cardsToSort.push(elementsOnMat[i]);
		}
	}

	//Label the size of the previous stack
	var totalSizelabel = Label("Total: " + String(totalNontokenCards));
	totalSizelabel.style.left = 0 + 'px';
	totalSizelabel.style.top = 30 + 'px';

	//Sort the cards by purpose, then cost, then color, then name
	cardsToSort.sort(
		function(a,b){
			var aPurpose = getPurposeLabel(a);
			var bPurpose = getPurposeLabel(b);

			if (aPurpose == "Land" && bPurpose != "Land")
			{
				ret = -1;
			} else if (bPurpose == "Land" && aPurpose != "Land") {
				ret = 1;
			} else if (aPurpose == "Token" && bPurpose != "Token") {
				ret = 1;
			} else if (bPurpose == "Token" && aPurpose != "Token") {
				ret = -1;
			} else {
				ret = aPurpose.localeCompare(bPurpose);
			}
			if (ret == 0)
			{
				ret = getTotalCost(a) - getTotalCost(b);
				if (ret == 0)
				{
					ret = getColorOrder(a) - getColorOrder(b);
					if (ret == 0)
					{
						var aName = a.getAttribute("name");
						var bName = b.getAttribute("name");
						if (aName != null && bName != null)
						{
							ret = aName.localeCompare(bName);
						} else {
							ret = 0;
						}
					}
				}
			}
			return ret;
		}
	);

	//Arrange the cards on the mat
	var stackNum = 0;
	var previousCardValue = "plumbus"; //Who knows what its purpose is...
	var stackHeight = 0;

	var xOffset = 50;
	var yOffset = 130;

	var stackSpacing = cardWidth + 10;

	for (i = 0; i < cardsToSort.length; ++i)
	{
		//Is this card of a different class?
		if (getPurposeLabel(cardsToSort[i]) != previousCardValue)
		{
			//Is this the end of a stack?
			if (stackHeight > 0)
			{
				//Label the size of the previous stack
				var sizelabel = Label(String(stackHeight));
				sizelabel.style.top = yOffset - 60 + 'px';
				sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			}
			//Create a new stack
			stackNum++;
			stackHeight = 0;
			var label = Label(getPurposeLabel(cardsToSort[i]));
			label.style.top = yOffset - 30 + 'px';
			label.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			previousCardValue = getPurposeLabel(cardsToSort[i]);
		}
		//Add this card to the stack
		//Reveal the card
		cardsToSort[i].src = cardsToSort[i].getAttribute("front");
		//Put it into the deck
		cardsToSort[i].style.top = yOffset + nameHeight * stackHeight + 'px';
		cardsToSort[i].style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
		//Untap
		cardsToSort[i].className = cardsToSort[i].className.replace( /(?:^|\s)rotated(?!\S)/g , '' );
		//Bring it in front of the other elements
		cardsToSort[i].parentNode.appendChild(cardsToSort[i]);
		stackHeight++;
	}
	//Is this the end of a stack?
	if (stackHeight > 0)
	{
		//Label the size of the previous stack
		var sizelabel = Label(String(stackHeight));
		sizelabel.style.top = yOffset - 60 + 'px';
		sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
	}

	//Resize document to fit
	resizeDocument();
}

function curvabilitySort()
{
	//Deselect any selected cards
	deselectAll();
	deleteAllCounters();
	deleteAllLabels();

	//Get all the elements on the playmat
	var elementsOnMat = document.getElementById('playmat').getElementsByTagName('*');

	//Figure out which of the elements are cards
	//Also compute their curvability
	var cardsWithUniqueCosts = [];
	var curvabilityOfCardsWithUniqueCosts = [];
	var totalNontokenCards = 0;
	var cardsToSort = [];
	var i = 0;
	var j = 0;
	for (i = 0; i < elementsOnMat.length; ++i)
	{
		if (hasClass(elementsOnMat[i], "card"))
		{
			if (elementsOnMat[i].getAttribute("token") != 'true')
			{
				++totalNontokenCards;
			}
			cardsToSort.push(elementsOnMat[i]);
			//Check if this card isn't a land
			if (elementsOnMat[i].getAttribute("land") != 'true')
			{
				//Check if this card has a new cost
				var unique = true;
				for (j = 0; j < cardsWithUniqueCosts.length; ++j)
				{
					//Check if both of these cards are commanders or both not commanders
					if (cardsWithUniqueCosts[j].getAttribute('commander') == elementsOnMat[i].getAttribute('commander'))
					{
						//Check if they have the same cost
						var costA = new ManaCost(cardsWithUniqueCosts[j].getAttribute('casting_cost'));
						var costB = new ManaCost(elementsOnMat[i].getAttribute('casting_cost'));
						if (manaCostsAreEqual(costA, costB))
						{
							//Not unique
							unique = false;
						}
					}
				}
				//If the card has a unique cost
				if (unique)
				{
					//Add it
					cardsWithUniqueCosts.push(elementsOnMat[i]);
					//Compute the probability you can cast it on curve
					var curvability = computeCurveCastingProbabilityOfCard(elementsOnMat[i]);
					curvabilityOfCardsWithUniqueCosts.push(curvability);
					//console.log(elementsOnMat[i].getAttribute('name') + ": " + curvability * 100);
				}
			}
		}
	}

	//Create a label for the total number of cards
	var totalSizelabel = Label("Total: " + String(totalNontokenCards));
	totalSizelabel.style.left = 0 + 'px';
	totalSizelabel.style.top = 30 + 'px';

	function getCurvability(cardElement)
	{
		//Check that this isn't a land
		if (cardElement.getAttribute('token') == 'true')
		{
			return -100; //Tokens are super duper curvable
		}
		else if (cardElement.getAttribute('land') == 'true')
		{
			return 200; //Lands are super duper curvable
		} else {
			var j = 0;
			for (j = 0; j < cardsWithUniqueCosts.length; ++j)
			{
				//Check if both of these cards are commanders or both not commanders
				if (cardsWithUniqueCosts[j].getAttribute('commander') == cardElement.getAttribute('commander'))
				{
					//Check if they have the same cost
					var costA = new ManaCost(cardsWithUniqueCosts[j].getAttribute('casting_cost'));
					var costB = new ManaCost(cardElement.getAttribute('casting_cost'));
					if (manaCostsAreEqual(costA, costB))
					{
						//Found it
						return curvabilityOfCardsWithUniqueCosts[j];
					}
				}
			}
			return -1; 	//This shouldn't happen
		}
	}

	for (i = 0; i < cardsToSort.length; ++i)
	{
		console.log(cardsToSort[i].getAttribute("name") + ": " + getCurvability(cardsToSort[i]));
	}

	//Sort the cards by curvability
	cardsToSort.sort(
		function(a,b){
			//Compare their curvability descending order
			var ret = getCurvability(b) - getCurvability(a);
			if (ret == 0)
			{
				ret = getColorOrder(a) - getColorOrder(b);
				if (ret == 0)
				{
					var aName = a.getAttribute("name");
					var bName = b.getAttribute("name");
					if (aName != null && bName != null)
					{
						ret = aName.localeCompare(bName);
					} else {
						ret = 0;
					}
				}
			}
			return ret;
		}
	);

	//Arrange the cards on the mat
	var stackNum = 0;
	var previousCardValue = -9000;
	var stackHeight = 0;

	var xOffset = 50;
	var yOffset = 130;

	var stackSpacing = cardWidth + 10;

	for (i = 0; i < cardsToSort.length; ++i)
	{
		//Is this card of a different class?
		var curvability = getCurvability(cardsToSort[i]);
		if (curvability != previousCardValue)
		{
			//Is this the end of a stack?
			if (stackHeight > 0)
			{
				//Label the size of the previous stack
				var sizelabel = Label(String(stackHeight));
				sizelabel.style.top = yOffset - 60 + 'px';
				sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			}

			//Create a new stack
			stackNum++;
			stackHeight = 0;
			if (curvability == 200)
			{
				var label = Label("Lands");
			} else if (curvability == -100) {
				var label = Label("Tokens");
			} else {
				var label = Label(Math.round(curvability * 10000)/100 + "%");
				if (curvability < 0.5)
				{
					label.style.color = 'red';
				} else if (curvability < 0.6) {
					label.style.color = 'orange';
				} else if (curvability < 0.7) {
					label.style.color = 'yellow';
				} else if (curvability < 0.8) {
					label.style.color = 'green';
				} else if (curvability < 0.9) {
					label.style.color = 'rgb(0, 46, 255)';
				} else {
					label.style.color = 'purple';
				}
			}
			label.style.top = yOffset - 30 + 'px';
			label.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
			previousCardValue = curvability;
		}
		//Add this card to the stack
		//Reveal the card
		cardsToSort[i].src = cardsToSort[i].getAttribute("front");
		//Put it into the deck
		cardsToSort[i].style.top = yOffset + nameHeight * stackHeight + 'px';
		cardsToSort[i].style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
		//Untap
		cardsToSort[i].className = cardsToSort[i].className.replace( /(?:^|\s)rotated(?!\S)/g , '' );
		//Bring it in front of the other elements
		cardsToSort[i].parentNode.appendChild(cardsToSort[i]);
		stackHeight++;
	}

	//Is this the end of a stack?
	if (stackHeight > 0)
	{
		//Label the size of the previous stack
		var sizelabel = Label(String(stackHeight));
		sizelabel.style.top = yOffset - 60 + 'px';
		sizelabel.style.left = xOffset + stackSpacing * (stackNum - 1) + 'px';
	}

	//Resize document to fit
	resizeDocument();
}

		function sortSideboard()
{
	//Get all the elements in the sideboard
	var elementsOnSideboard = document.getElementById('sideboard').getElementsByTagName('*');
	
	//Figure out which of the elements are cards
	var cardsToSort = [];
	var i = 0;
	for (i = 0; i < elementsOnSideboard.length; ++i)
	{
		if (hasClass(elementsOnSideboard[i], "card"))
		{
			cardsToSort.push(elementsOnSideboard[i]);
		}
	}

	//Sort the cards by cost
	cardsToSort.sort(
		function(a,b)
		{
			var ret = getColorOrder(a) - getColorOrder(b);
			if (ret == 0)
			{
				ret = getTotalCost(a) - getTotalCost(b);
				if (ret == 0)
				{
					var aName = a.getAttribute("name");
					var bName = b.getAttribute("name");
					if (aName != null && bName != null)
					{
						ret = aName.localeCompare(bName);
					} else {
						ret = 0;
					}
				}
			}
			return ret;
		}
	);

	var xOffset = 10;
	var yOffset = 10;

	for (i = 0; i < cardsToSort.length; ++i)
	{
		//Reveal the card
		cardsToSort[i].src = cardsToSort[i].getAttribute("front");
		//Put it into the deck
		cardsToSort[i].style.top = yOffset + nameHeight * i + 'px';
		cardsToSort[i].style.left = xOffset + 'px';
		//Untap
		cardsToSort[i].className = cardsToSort[i].className.replace( /(?:^|\s)rotated(?!\S)/g , '' );
		//Bring it in front of the other elements
		cardsToSort[i].parentNode.appendChild(cardsToSort[i]);
	}
}