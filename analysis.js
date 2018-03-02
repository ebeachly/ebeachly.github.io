//Precompute binomial coefficients for dat speed
var pascalsTriangle = [[1]];
function computePascalsTriangleUpTo( nn )
{
	//For each row
	var n = pascalsTriangle.length;
	for (n = pascalsTriangle.length; n <= nn; ++n)
	{
		var row = [];
		row.push(1);
		var k = 1;
		for (k = 1; k < n; ++k)
		{
			row.push(pascalsTriangle[n-1][k-1] + pascalsTriangle[n-1][k]);
		}
		row.push(1);
		pascalsTriangle.push(row);
	}
}

function nChooseK(n,k)
{
	if (k > n)
	{
		return 0;
	} else if (k < 0) {
		return 0;
	} else if (n < 0) {
		return 0;
	} else {
		return pascalsTriangle[n][k];
	}
}

//Given a deck of nn cards, m of which are cards you want. What is the probability that if you draw n cards, x are the kind you want?
function hypergeometricDistribution(successesInSample, successesInPopulation, sampleSize, populationSize) {
	computePascalsTriangleUpTo(populationSize);
	return nChooseK(successesInPopulation, successesInSample) * nChooseK(populationSize - successesInPopulation, sampleSize - successesInSample) / nChooseK(populationSize, sampleSize);
}

//A class to represent a set of lands that can all produce the same mana. (How many UW duals do I have?)
var LandCount = function(manaProductionBitVector)
{
	this.manaProductionBitVector = manaProductionBitVector;
	this.count = 1;
}

var maxNumLands = 18;
function computeCastingProbabilitiesOfCard(cardElement)
{
	//console.log("Name: " +cardElement.getAttribute('name'));
	//Get the cost of the currently selected card
	var cost = new ManaCost(cardElement.getAttribute('casting_cost'));
	//console.log("Total Cost: " + cost.total);
	//Get whether this card is a commander
	var isCommander = cardElement.getAttribute('commander') == 'true';
	//console.log("Is Commander: " + cardElement.getAttribute('commander'));
	//Count how many non-commander non-token cards are on the playmat.
	var numCardsInDeck = 0;
	var numUsefulLandsInDeck = 0;
	//Also count the mana production available
	var manaProduction = [];

	//Get all the elements on the playmat
	var elementsOnMat = document.getElementById('playmat').getElementsByTagName('*');

	//Figure out which of the elements are cards
	var i = 0;
	var j = 0;
	var k = 0;
	for (i = 0; i < elementsOnMat.length; ++i)
	{
		//Check that the element is a card
		if (hasClass(elementsOnMat[i], "card"))
		{
			//Check that it's not a token
			if (elementsOnMat[i].getAttribute("token") != 'true')
			{
				//Check that it's not a commander
				if (elementsOnMat[i].getAttribute("commander") != 'true')
				{
					numCardsInDeck = numCardsInDeck + 1;
				}
				//Check if it's a land
				if (elementsOnMat[i].getAttribute("land") == 'true')
				{
					//Get the mana production bitvector from it
					var manaProductionBitVector = parseInt(elementsOnMat[i].getAttribute('mana_production_bitvector'));
					if (manaProductionBitVector != 0)
					{
						//Filter the manaProductionBitVector by the colors mentioned in the cost.
						var filteredManaProductionBitVector = manaProductionBitVector & cost.colorBitVector;
						//If generic mana is part of the cost, each land can be used to produce generic mana
						if (cost.generic > 0)
						{
							filteredManaProductionBitVector = filteredManaProductionBitVector | 0x40;
						}
						//Check if this land helps us pay the cost
						if (filteredManaProductionBitVector != 0)
						{
							++numUsefulLandsInDeck;
							//Check to see if we've recorded this cost
							var found = false;
							for ( j = 0; j < manaProduction.length; ++j)
							{
								//If this previously added production matches,
								if (manaProduction[j].manaProductionBitVector == filteredManaProductionBitVector)
								{
									//Increment the count of lands that have this kind of production
									++manaProduction[j].count;
									found = true;
									break;
								}
							}
							//If we haven't found it, add it
							if (!found)
							{
								manaProduction.push(new LandCount(filteredManaProductionBitVector));
							}
						}
					}
				}
			}
		}
	}

	//Assume we've already drawn the card from the deck
	if (!isCommander)
	{
		numCardsInDeck = numCardsInDeck - 1;
	}

	//Precompute binomial coefficients
	computePascalsTriangleUpTo(numCardsInDeck);

	//console.log("Cards in Deck: " + numCardsInDeck);
	//var manaProductionToString = "Lands: "
	//for (j = 0; j < manaProduction.length; ++j)
	//{
	//	manaProductionToString = manaProductionToString + manaProduction[j].count +  ":" + manaProduction[j].manaProductionBitVector + " ";
	//}
	//console.log(manaProductionToString);

	//Generate all combinations of up to maxNumLands lands that can't cast it
	var combinationsThatCantCast = [];
	var missingColorRequirement = false;
	if (cost.total > 0 && cost.total < maxNumLands)
	{
		//Consider combinations that just don't have enough lands
		var numSubCombinations = 1;
		//Only need to consider combinations that don't exceed the number of each kind of land in our deck
		var maxOfEachProductionToConsider = [];
		for (i = 0; i < manaProduction.length; ++i)
		{
			var maxOfThisProductionToConsider = manaProduction[i].count + 1;	//Need to add one because the modulo operation won't reach a combination with .count otherwise
			if (maxOfThisProductionToConsider > cost.total)
			{
				maxOfThisProductionToConsider = cost.total;
			}
			maxOfEachProductionToConsider.push(maxOfThisProductionToConsider);
			numSubCombinations = numSubCombinations * maxOfThisProductionToConsider;
		}
		//TODO: This considers 6+ times as many combinations as it actually needs to. Can this be optimized?
		for ( i = 0; i < numSubCombinations; ++i)
		{
			var combo = [];
			var quotient = i;
			var sumAmountOfManaProduction = 0;
			//Generate the number of lands of each kind that this combination represents
			for (j = 0; j < manaProduction.length; ++j )
			{
				var amountOfThisManaProduction = quotient % maxOfEachProductionToConsider[j];
				quotient = (quotient - amountOfThisManaProduction) / maxOfEachProductionToConsider[j];
				sumAmountOfManaProduction = sumAmountOfManaProduction + amountOfThisManaProduction;
				combo.push(amountOfThisManaProduction);
			}
			
			//If this isn't enough lands
			if (sumAmountOfManaProduction < cost.total) {
				//Save this combination as one that can't pay the cost
				combinationsThatCantCast.push(combo);
			}
		}

		function generateLandCombinations(numColorSymbols, colorBitVector)
		{
			//Consider combinations that don't satisfy color requirements
			//First, check if there's any of this symbol. Also check if doing this isn't pointless
			if (numColorSymbols > 0 && !missingColorRequirement) {
				//console.log("Processing Color: " + colorBitVector);
				//console.log("Num Symbols: " + numColorSymbols);
				//Split the lands into ones that can pay these symbols, and ones that cannot
				var colorProducers = [];
				var others = [];
				for (i = 0; i < manaProduction.length; ++i)
				{
					if (manaProduction[i].manaProductionBitVector & colorBitVector)	//Check if this land type produces a satisfactory color
					{
						colorProducers.push(i);
					} else {
						others.push(i);
					}
				}
				//for (i = 0; i < colorProducers.length; ++i)
				//{
				//	console.log("Color Producing Land: " + manaProduction[colorProducers[i]].manaProductionBitVector);
				//}
				//for (i = 0; i < others.length; ++i)
				//{
				//	console.log("Other Land: " + manaProduction[others[i]].manaProductionBitVector);
				//}
				if (colorProducers.length == 0)
				{
					missingColorRequirement = true;
					return;
				}
				//If there are fewer than cost.w white producing lands, you can't cast it.
				//Generate all combinations of cost.w - 1 white-producing lands
				var numSubCombinations = 1;
				var maxOfEachProductionToConsider = [];
				for (i = 0; i < colorProducers.length; ++i)
				{
					var maxOfThisProductionToConsider = manaProduction[colorProducers[i]].count + 1;
					if (maxOfThisProductionToConsider > numColorSymbols)
					{
						maxOfThisProductionToConsider = numColorSymbols;
					}
					maxOfEachProductionToConsider.push(maxOfThisProductionToConsider);
					numSubCombinations = numSubCombinations * maxOfThisProductionToConsider;
				}
				for (i = 0; i < numSubCombinations; ++i)
				{
					var subCombo = [];
					var quotient = i;
					var sumAmountOfManaProduction = 0;
					for (j = 0; j < colorProducers.length; ++j)
					{
						var amountOfThisManaProduction = quotient % maxOfEachProductionToConsider[j];
						quotient = (quotient - amountOfThisManaProduction) / maxOfEachProductionToConsider[j];
						sumAmountOfManaProduction = sumAmountOfManaProduction + amountOfThisManaProduction;
						subCombo.push(amountOfThisManaProduction);
					}

					//var comboToString = "Insufficient color producer combo: "
					//for (j = 0; j < subCombo.length; ++j)
					//{
					//	comboToString = comboToString + subCombo[j] +  ":" + manaProduction[colorProducers[j]].manaProductionBitVector + " ";
					//}
					//console.log(comboToString);

					//If this isn't enough lands of the color we need
					if (sumAmountOfManaProduction < numColorSymbols)
					{
						//Generate all combinations of the other land types
						var numSubCombinations2 = 1;
						var maxOfEachProductionToConsider2 = [];
						for (j = 0; j < others.length; ++j)
						{
							var maxOfThisProductionToConsider2 = manaProduction[others[j]].count + 1;
							if (maxOfThisProductionToConsider2 > maxNumLands)
							{
								maxOfThisProductionToConsider2 = maxNumLands;
							}
							maxOfEachProductionToConsider2.push(maxOfThisProductionToConsider2);
							numSubCombinations2 = numSubCombinations2 * maxOfThisProductionToConsider2;
						}
						for (j = 0; j < numSubCombinations2; ++j)
						{
							var subCombo2 = [];
							quotient = j;
							var sumAmountOfManaProduction2 = sumAmountOfManaProduction;
							for (k = 0; k < others.length; ++k)
							{
								var amountOfThisManaProduction = quotient % maxOfEachProductionToConsider2[k];
								quotient = (quotient - amountOfThisManaProduction) / maxOfEachProductionToConsider2[k];
								sumAmountOfManaProduction2 = sumAmountOfManaProduction2 + amountOfThisManaProduction;
								subCombo2.push(amountOfThisManaProduction);
							}
							//Check that we didn't already cover this combo with the generic case
							if ( sumAmountOfManaProduction2 >= cost.total)
							{
								//Generate the complete combo
								var combo = [];
								for (k = 0; k < colorProducers.length; ++k)
								{
									combo[colorProducers[k]] = subCombo[k];
								}
								for (k = 0; k < others.length; ++k)
								{
									combo[others[k]] = subCombo2[k];
								}
								//Add the combo
								combinationsThatCantCast.push(combo);
							}
						}
					}
				}
			}
		} //End function

		//Generate the combinations of that can't cast each mana requirement
		generateLandCombinations(cost.w, 0x01);
		generateLandCombinations(cost.u, 0x02);
		generateLandCombinations(cost.b, 0x04);
		generateLandCombinations(cost.r, 0x08);
		generateLandCombinations(cost.g, 0x10);
		generateLandCombinations(cost.c, 0x20);
		//Generate the combinations of lands that can't cast each hybrid mana requirement
		//WARNING: This assumes that you have no other costs of the hybrid mana's colors.
		generateLandCombinations(cost.wu, 0x01 | 0x02);
		generateLandCombinations(cost.ub, 0x02 | 0x04);
		generateLandCombinations(cost.br, 0x04 | 0x08);
		generateLandCombinations(cost.rg, 0x08 | 0x10);
		generateLandCombinations(cost.gw, 0x10 | 0x01);
		generateLandCombinations(cost.wb, 0x01 | 0x04);
		generateLandCombinations(cost.ur, 0x02 | 0x08);
		generateLandCombinations(cost.bg, 0x04 | 0x10);
		generateLandCombinations(cost.rw, 0x08 | 0x01);
		generateLandCombinations(cost.gu, 0x10 | 0x02);
	}

	//Sort the combos by the number of lands
	combinationsThatCantCast.sort(
		function(a,b){
			//Compute the number of lands in each combo
			var aSum = 0;
			var bSum = 0;
			var i = 0;
			var equal = true;
			var aHigher = false;
			for (i = 0; i < a.length; ++i)
			{
				if (equal && a[i] != b[i])
				{
					equal = false;
					if (a[i] > b[i])
					{
						aHigher = true;
					}
				}
				aSum = aSum + a[i];
				bSum = bSum + b[i];
			}

			if (aSum == bSum)
			{
				//Tiebreaker. Ensures duplicate combinations are adjacent for easier detection
				if (aHigher)
				{
					return -1;
				} else {
					return 1;
				}
			} else {
				return aSum - bSum;
			}
		}
	);

	//console.log("Num Combinations: " + combinationsThatCantCast.length);

	/*for (i = 0; i < combinationsThatCantCast.length; ++i)
	{
		var comboToString = ""
		for (j = 0; j < combinationsThatCantCast[i].length; ++j)
		{
			comboToString = comboToString + combinationsThatCantCast[i][j] +  ":" + manaProduction[j].manaProductionBitVector + " ";
		}
		console.log(comboToString);
	}*/

	//Plot the probabilities
	var castingProbabilities = [];
	var cardsDrawnFromDeck = 0;
	//For each sample size
	for (cardsDrawnFromDeck = 0; cardsDrawnFromDeck < maxNumLands; ++cardsDrawnFromDeck)
	{
		if (isCommander)
		{
			sampleSize = cardsDrawnFromDeck;
		} else {
			sampleSize = cardsDrawnFromDeck - 1;
		}
		//Is the samplesize even big enough for the mana cost? Also check if we aren't missing a mana color
		if (sampleSize < cost.total || missingColorRequirement)
		{
			castingProbabilities.push(0);
		} else {
			//For each combination
			var c = 0;
			var sum = 0;
			for (c = 0; c < combinationsThatCantCast.length; ++c) {
				var duplicate = true;
				var numLandsInCombination = 0;
				if (c != 0)
				{
					//Compare this combination to the previous to check for duplicates
					for (i = 0; i < combinationsThatCantCast[c].length; ++i)
					{
						if (combinationsThatCantCast[c - 1][i] != combinationsThatCantCast[c][i])
						{
							duplicate = false;
						}
						numLandsInCombination = numLandsInCombination + combinationsThatCantCast[c][i];
					}
				} else {
					duplicate = false;
					for (i = 0; i < combinationsThatCantCast[c].length; ++i)
					{
						numLandsInCombination = numLandsInCombination + combinationsThatCantCast[c][i];
					}
				}
				//If the lands in the combination outnumber the sample size
				if (numLandsInCombination > sampleSize)
				{
					//Don't need to consider any more combinations
					break;
				}
				//Check that this combination isn't a duplicate of the previous
				if (!duplicate)
				{
					//Compute the term this combination contributes to the sum
					//First compute the term that represents the dead cards
					var product = nChooseK(numCardsInDeck - numUsefulLandsInDeck, sampleSize - numLandsInCombination);
					for (i = 0; i < combinationsThatCantCast[c].length; ++i)
					{
						product = product * nChooseK(manaProduction[i].count, combinationsThatCantCast[c][i]);
					}
					sum = sum + product;
				}
			}
			//Divide by the denominator
			var probabilityCantCast = sum / nChooseK(numCardsInDeck, sampleSize);
			castingProbabilities.push(1 - probabilityCantCast);
		}
	}

	//for (i = 0; i < castingProbabilities.length; ++i)
	//{
	//	console.log("After drawing " + i + " cards: " + castingProbabilities[i] * 100 + "%");
	//}

	return castingProbabilities;
}

function computeCurveCastingProbabilityOfCard(cardElement)
{
	//console.log("Name: " +cardElement.getAttribute('name'));
	//Get the cost of the currently selected card
	var cost = new ManaCost(cardElement.getAttribute('casting_cost'));
	//console.log("Total Cost: " + cost.total);
	//Get whether this card is a commander
	var isCommander = cardElement.getAttribute('commander') == 'true';
	//console.log("Is Commander: " + cardElement.getAttribute('commander'));
	//Count how many non-commander non-token cards are on the playmat.
	var numCardsInDeck = 0;
	var numUsefulLandsInDeck = 0;
	//Also count the mana production available
	var manaProduction = [];

	//Get all the elements on the playmat
	var elementsOnMat = document.getElementById('playmat').getElementsByTagName('*');

	//Figure out which of the elements are cards
	var i = 0;
	var j = 0;
	var k = 0;
	for (i = 0; i < elementsOnMat.length; ++i)
	{
		//Check that the element is a card
		if (hasClass(elementsOnMat[i], "card"))
		{
			//Check that it's not a token
			if (elementsOnMat[i].getAttribute("token") != 'true')
			{
				//Check that it's not a commander
				if (elementsOnMat[i].getAttribute("commander") != 'true')
				{
					numCardsInDeck = numCardsInDeck + 1;
				}
				//Check if it's a land
				if (elementsOnMat[i].getAttribute("land") == 'true')
				{
					//Get the mana production bitvector from it
					var manaProductionBitVector = parseInt(elementsOnMat[i].getAttribute('mana_production_bitvector'));
					if (manaProductionBitVector != 0)
					{
						//Filter the manaProductionBitVector by the colors mentioned in the cost.
						var filteredManaProductionBitVector = manaProductionBitVector & cost.colorBitVector;
						//If generic mana is part of the cost, each land can be used to produce generic mana
						if (cost.generic > 0)
						{
							filteredManaProductionBitVector = filteredManaProductionBitVector | 0x40;
						}
						//Check if this land helps us pay the cost
						if (filteredManaProductionBitVector != 0)
						{
							++numUsefulLandsInDeck;
							//Check to see if we've recorded this cost
							var found = false;
							for ( j = 0; j < manaProduction.length; ++j)
							{
								//If this previously added production matches,
								if (manaProduction[j].manaProductionBitVector == filteredManaProductionBitVector)
								{
									//Increment the count of lands that have this kind of production
									++manaProduction[j].count;
									found = true;
									break;
								}
							}
							//If we haven't found it, add it
							if (!found)
							{
								manaProduction.push(new LandCount(filteredManaProductionBitVector));
							}
						}
					}
				}
			}
		}
	}

	//Assume we've already drawn the card from the deck
	if (!isCommander)
	{
		numCardsInDeck = numCardsInDeck - 1;
	}

	//Precompute binomial coefficients
	computePascalsTriangleUpTo(numCardsInDeck);

	//console.log("Cards in Deck: " + numCardsInDeck);
	//var manaProductionToString = "Lands: "
	//for (j = 0; j < manaProduction.length; ++j)
	//{
	//	manaProductionToString = manaProductionToString + manaProduction[j].count +  ":" + manaProduction[j].manaProductionBitVector + " ";
	//}
	//console.log(manaProductionToString);

	//Figure out how many cards we'll have drawn from our deck if we're tryin to play it on curve on the play
	var cardsDrawnFromDeck = 6 + cost.total;
	if (cardsDrawnFromDeck < 7)
	{
		cardsDrawnFromDeck = 7;
	}

	//Generate all combinations of up to cardsDrawnFromDeck lands that can't cast it
	var combinationsThatCantCast = [];
	var missingColorRequirement = false;
	if (cost.total > 0 && cost.total < cardsDrawnFromDeck)
	{
		//Consider combinations that just don't have enough lands
		var numSubCombinations = 1;
		//Only need to consider combinations that don't exceed the number of each kind of land in our deck
		var maxOfEachProductionToConsider = [];
		for (i = 0; i < manaProduction.length; ++i)
		{
			var maxOfThisProductionToConsider = manaProduction[i].count + 1;	//Need to add one because the modulo operation won't reach a combination with .count otherwise
			if (maxOfThisProductionToConsider > cost.total)
			{
				maxOfThisProductionToConsider = cost.total;
			}
			maxOfEachProductionToConsider.push(maxOfThisProductionToConsider);
			numSubCombinations = numSubCombinations * maxOfThisProductionToConsider;
		}
		for ( i = 0; i < numSubCombinations; ++i)
		{
			var combo = [];
			var quotient = i;
			var sumAmountOfManaProduction = 0;
			//Generate the number of lands of each kind that this combination represents
			for (j = 0; j < manaProduction.length; ++j )
			{
				var amountOfThisManaProduction = quotient % maxOfEachProductionToConsider[j];
				quotient = (quotient - amountOfThisManaProduction) / maxOfEachProductionToConsider[j];
				sumAmountOfManaProduction = sumAmountOfManaProduction + amountOfThisManaProduction;
				combo.push(amountOfThisManaProduction);
			}
			
			//If this isn't enough lands
			if (sumAmountOfManaProduction < cost.total) {
				//Save this combination as one that can't pay the cost
				combinationsThatCantCast.push(combo);
			}
		}

		function generateLandCombinations(numColorSymbols, colorBitVector)
		{
			//Consider combinations that don't satisfy color requirements
			//First, check if there's any of this symbol. Also check if doing this isn't pointless
			if (numColorSymbols > 0 && !missingColorRequirement) {
				//console.log("Processing Color: " + colorBitVector);
				//console.log("Num Symbols: " + numColorSymbols);
				//Split the lands into ones that can pay these symbols, and ones that cannot
				var colorProducers = [];
				var others = [];
				for (i = 0; i < manaProduction.length; ++i)
				{
					if (manaProduction[i].manaProductionBitVector & colorBitVector)	//Check if this land type produces a satisfactory color
					{
						colorProducers.push(i);
					} else {
						others.push(i);
					}
				}
				//for (i = 0; i < colorProducers.length; ++i)
				//{
				//	console.log("Color Producing Land: " + manaProduction[colorProducers[i]].manaProductionBitVector);
				//}
				//for (i = 0; i < others.length; ++i)
				//{
				//	console.log("Other Land: " + manaProduction[others[i]].manaProductionBitVector);
				//}
				if (colorProducers.length == 0)
				{
					missingColorRequirement = true;
					return;
				}
				//If there are fewer than cost.w white producing lands, you can't cast it.
				//Generate all combinations of cost.w - 1 white-producing lands
				var numSubCombinations = 1;
				var maxOfEachProductionToConsider = [];
				for (i = 0; i < colorProducers.length; ++i)
				{
					var maxOfThisProductionToConsider = manaProduction[colorProducers[i]].count + 1;
					if (maxOfThisProductionToConsider > numColorSymbols)
					{
						maxOfThisProductionToConsider = numColorSymbols;
					}
					maxOfEachProductionToConsider.push(maxOfThisProductionToConsider);
					numSubCombinations = numSubCombinations * maxOfThisProductionToConsider;
				}
				for (i = 0; i < numSubCombinations; ++i)
				{
					var subCombo = [];
					var quotient = i;
					var sumAmountOfManaProduction = 0;
					for (j = 0; j < colorProducers.length; ++j)
					{
						var amountOfThisManaProduction = quotient % maxOfEachProductionToConsider[j];
						quotient = (quotient - amountOfThisManaProduction) / maxOfEachProductionToConsider[j];
						sumAmountOfManaProduction = sumAmountOfManaProduction + amountOfThisManaProduction;
						subCombo.push(amountOfThisManaProduction);
					}

					//var comboToString = "Insufficient color producer combo: "
					//for (j = 0; j < subCombo.length; ++j)
					//{
					//	comboToString = comboToString + subCombo[j] +  ":" + manaProduction[colorProducers[j]].manaProductionBitVector + " ";
					//}
					//console.log(comboToString);

					//If this isn't enough lands of the color we need
					if (sumAmountOfManaProduction < numColorSymbols)
					{
						//Generate all combinations of the other land types
						var numSubCombinations2 = 1;
						var maxOfEachProductionToConsider2 = [];
						for (j = 0; j < others.length; ++j)
						{
							var maxOfThisProductionToConsider2 = manaProduction[others[j]].count + 1;
							if (maxOfThisProductionToConsider2 > cardsDrawnFromDeck)
							{
								maxOfThisProductionToConsider2 = cardsDrawnFromDeck;
							}
							maxOfEachProductionToConsider2.push(maxOfThisProductionToConsider2);
							numSubCombinations2 = numSubCombinations2 * maxOfThisProductionToConsider2;
						}
						for (j = 0; j < numSubCombinations2; ++j)
						{
							var subCombo2 = [];
							quotient = j;
							var sumAmountOfManaProduction2 = sumAmountOfManaProduction;
							for (k = 0; k < others.length; ++k)
							{
								var amountOfThisManaProduction = quotient % maxOfEachProductionToConsider2[k];
								quotient = (quotient - amountOfThisManaProduction) / maxOfEachProductionToConsider2[k];
								sumAmountOfManaProduction2 = sumAmountOfManaProduction2 + amountOfThisManaProduction;
								subCombo2.push(amountOfThisManaProduction);
							}
							//Check that we didn't already cover this combo with the generic case
							if ( sumAmountOfManaProduction2 >= cost.total)
							{
								//Generate the complete combo
								var combo = [];
								for (k = 0; k < colorProducers.length; ++k)
								{
									combo[colorProducers[k]] = subCombo[k];
								}
								for (k = 0; k < others.length; ++k)
								{
									combo[others[k]] = subCombo2[k];
								}
								//Add the combo
								combinationsThatCantCast.push(combo);
							}
						}
					}
				}
			}
		} //End function

		//Generate the combinations of that can't cast each mana requirement
		generateLandCombinations(cost.w, 0x01);
		generateLandCombinations(cost.u, 0x02);
		generateLandCombinations(cost.b, 0x04);
		generateLandCombinations(cost.r, 0x08);
		generateLandCombinations(cost.g, 0x10);
		generateLandCombinations(cost.c, 0x20);
		//Generate the combinations of lands that can't cast each hybrid mana requirement
		//WARNING: This assumes that you have no other costs of the hybrid mana's colors.
		generateLandCombinations(cost.wu, 0x01 | 0x02);
		generateLandCombinations(cost.ub, 0x02 | 0x04);
		generateLandCombinations(cost.br, 0x04 | 0x08);
		generateLandCombinations(cost.rg, 0x08 | 0x10);
		generateLandCombinations(cost.gw, 0x10 | 0x01);
		generateLandCombinations(cost.wb, 0x01 | 0x04);
		generateLandCombinations(cost.ur, 0x02 | 0x08);
		generateLandCombinations(cost.bg, 0x04 | 0x10);
		generateLandCombinations(cost.rw, 0x08 | 0x01);
		generateLandCombinations(cost.gu, 0x10 | 0x02);
	}

	//Sort the combos by the number of lands
	combinationsThatCantCast.sort(
		function(a,b){
			//Compute the number of lands in each combo
			var aSum = 0;
			var bSum = 0;
			var i = 0;
			var equal = true;
			var aHigher = false;
			for (i = 0; i < a.length; ++i)
			{
				if (equal && a[i] != b[i])
				{
					equal = false;
					if (a[i] > b[i])
					{
						aHigher = true;
					}
				}
				aSum = aSum + a[i];
				bSum = bSum + b[i];
			}

			if (aSum == bSum)
			{
				//Tiebreaker. Ensures duplicate combinations are adjacent for easier detection
				if (aHigher)
				{
					return -1;
				} else {
					return 1;
				}
			} else {
				return aSum - bSum;
			}
		}
	);

	//console.log("Num Combinations: " + combinationsThatCantCast.length);

	/*for (i = 0; i < combinationsThatCantCast.length; ++i)
	{
		var comboToString = ""
		for (j = 0; j < combinationsThatCantCast[i].length; ++j)
		{
			comboToString = comboToString + combinationsThatCantCast[i][j] +  ":" + manaProduction[j].manaProductionBitVector + " ";
		}
		console.log(comboToString);
	}*/

	//Plot the probabilities

	if (isCommander)
	{
		sampleSize = cardsDrawnFromDeck;
	} else {
		sampleSize = cardsDrawnFromDeck - 1;
	}
	//Is the samplesize even big enough for the mana cost? Also check if we aren't missing a mana color
	if (sampleSize < cost.total || missingColorRequirement)
	{
		return 0;
	} else {
		//For each combination
		var c = 0;
		var sum = 0;
		for (c = 0; c < combinationsThatCantCast.length; ++c) {
			var duplicate = true;
			var numLandsInCombination = 0;
			if (c != 0)
			{
				//Compare this combination to the previous to check for duplicates
				for (i = 0; i < combinationsThatCantCast[c].length; ++i)
				{
					if (combinationsThatCantCast[c - 1][i] != combinationsThatCantCast[c][i])
					{
						duplicate = false;
					}
					numLandsInCombination = numLandsInCombination + combinationsThatCantCast[c][i];
				}
			} else {
				duplicate = false;
				for (i = 0; i < combinationsThatCantCast[c].length; ++i)
				{
					numLandsInCombination = numLandsInCombination + combinationsThatCantCast[c][i];
				}
			}
			//If the lands in the combination outnumber the sample size
			if (numLandsInCombination > sampleSize)
			{
				//Don't need to consider any more combinations
				break;
			}
			//Check that this combination isn't a duplicate of the previous
			if (!duplicate)
			{
				//Compute the term this combination contributes to the sum
				//First compute the term that represents the dead cards
				var product = nChooseK(numCardsInDeck - numUsefulLandsInDeck, sampleSize - numLandsInCombination);
				for (i = 0; i < combinationsThatCantCast[c].length; ++i)
				{
					product = product * nChooseK(manaProduction[i].count, combinationsThatCantCast[c][i]);
				}
				sum = sum + product;
			}
		}
		//Divide by the denominator
		var probabilityCantCast = sum / nChooseK(numCardsInDeck, sampleSize);
		return 1 - probabilityCantCast;
	}
}